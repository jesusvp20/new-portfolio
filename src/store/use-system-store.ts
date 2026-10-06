import { create } from "zustand";
import type { Profile } from "@/types";
import type { Project } from "@/types";
import { profiles as seedProfiles } from "@/data/profiles";
import { projects as seedProjects } from "@/data/projects";

export type Screen = "select-profile" | "create-user" | "home" | "project-detail";

const LS_PROFILES = "ps5:profiles";
const LS_PROJECTS = "ps5:projects";

function loadProfiles(): Profile[] {
  if (typeof window === "undefined") return [...seedProfiles];
  try {
    const raw = localStorage.getItem(LS_PROFILES);
    if (raw) return JSON.parse(raw) as Profile[];
  } catch {}
  return [...seedProfiles];
}
function loadProjects(): Project[] {
  if (typeof window === "undefined") return [...seedProjects];
  try {
    const raw = localStorage.getItem(LS_PROJECTS);
    if (raw) {
      const parsed = JSON.parse(raw) as Project[];
      // dedupe by id
      const seen = new Set<string>();
      return parsed.filter((p) => (seen.has(p.id) ? false : (seen.add(p.id), true)));
    }
  } catch {}
  return [...seedProjects];
}

interface SystemState {
  screen: Screen;
  profiles: Profile[];
  projects: Project[];
  activeUser: Profile | null;
  selectedProject: Project | null;
  goCreateUser: () => void;
  selectUser: (user: Profile) => void;
  createUser: (user: Profile) => void;
  updateUser: (id: string, patch: Partial<Profile>) => void;
  deleteUser: (id: string) => void;
  goHome: () => void;
  selectProject: (project: Project) => void;
  goBack: () => void;
  logout: () => void;
  // projects CRUD
  createProject: (p: Project) => void;
  updateProject: (id: string, patch: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  hydrate: () => void;
}

export const useSystemStore = create<SystemState>((set) => ({
  screen: "select-profile",
  profiles: [...seedProfiles],
  projects: [...seedProjects],
  activeUser: null,
  selectedProject: null,
  hydrate: () =>
    set({ profiles: loadProfiles(), projects: loadProjects() }),
  goCreateUser: () => set({ screen: "create-user" }),
  selectUser: (user) => set({ activeUser: user, screen: "home" }),
  createUser: (user) =>
    set((s) => {
      const next = [...s.profiles, user];
      try { localStorage.setItem(LS_PROFILES, JSON.stringify(next)); } catch {}
      return { profiles: next, activeUser: user, screen: "home" };
    }),
  updateUser: (id, patch) =>
    set((s) => {
      const next = s.profiles.map((p) => (p.id === id ? { ...p, ...patch, updatedAt: new Date().toISOString() } : p));
      try { localStorage.setItem(LS_PROFILES, JSON.stringify(next)); } catch {}
      const active = s.activeUser?.id === id ? { ...s.activeUser, ...patch } as Profile : s.activeUser;
      return { profiles: next, activeUser: active };
    }),
  deleteUser: (id) =>
    set((s) => {
      const next = s.profiles.filter((p) => p.id !== id);
      try { localStorage.setItem(LS_PROFILES, JSON.stringify(next)); } catch {}
      // delete projects of that user
      const nextProjects = s.projects.filter((pr) => pr.profileId !== id);
      try { localStorage.setItem(LS_PROJECTS, JSON.stringify(nextProjects)); } catch {}
      const isActive = s.activeUser?.id === id;
      return {
        profiles: next,
        projects: nextProjects,
        activeUser: isActive ? null : s.activeUser,
        screen: isActive ? "select-profile" : s.screen,
      };
    }),
  goHome: () => set({ screen: "home" }),
  selectProject: (project) => set({ selectedProject: project, screen: "project-detail" }),
  goBack: () => set({ screen: "home" }),
  logout: () => set({ screen: "select-profile", activeUser: null, selectedProject: null }),
  createProject: (p) =>
    set((s) => {
      if (s.projects.some((x) => x.id === p.id)) return s;
      const next = [...s.projects, p];
      try { localStorage.setItem(LS_PROJECTS, JSON.stringify(next)); } catch {}
      return { projects: next };
    }),
  updateProject: (id, patch) =>
    set((s) => {
      const next = s.projects.map((pr) => (pr.id === id ? { ...pr, ...patch, updatedAt: new Date().toISOString() } : pr));
      try { localStorage.setItem(LS_PROJECTS, JSON.stringify(next)); } catch {}
      return { projects: next, selectedProject: s.selectedProject?.id === id ? { ...s.selectedProject, ...patch } as Project : s.selectedProject };
    }),
  deleteProject: (id) =>
    set((s) => {
      const next = s.projects.filter((pr) => pr.id !== id);
      try { localStorage.setItem(LS_PROJECTS, JSON.stringify(next)); } catch {}
      return { projects: next, selectedProject: s.selectedProject?.id === id ? null : s.selectedProject, screen: s.selectedProject?.id === id ? "home" : s.screen };
    }),
}));
