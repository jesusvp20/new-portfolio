import { create } from "zustand";
import type { Profile } from "@/types";
import type { Project } from "@/types";
import { profiles as seedProfiles } from "@/data/profiles";
import { projects as seedProjects } from "@/data/projects";

export type Screen = "select-profile" | "create-user" | "home" | "project-detail";

interface SystemState {
  screen: Screen;
  profiles: Profile[];
  projects: Project[];
  activeUser: Profile | null;
  selectedProject: Project | null;
  goCreateUser: () => void;
  selectUser: (user: Profile) => void;
  createUser: (user: Profile) => Promise<void>;
  updateUser: (id: string, patch: Partial<Profile>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  goHome: () => void;
  selectProject: (project: Project) => void;
  goBack: () => void;
  logout: () => void;
  createProject: (p: Project) => Promise<void>;
  updateProject: (id: string, patch: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useSystemStore = create<SystemState>((set, get) => ({
  screen: "select-profile",
  profiles: [...seedProfiles],
  projects: [...seedProjects],
  activeUser: null,
  selectedProject: null,

  hydrate: async () => {
    try {
      const [profilesRes, projectsRes] = await Promise.all([
        fetch("/api/profiles"),
        fetch("/api/projects"),
      ]);
      const profiles = profilesRes.ok ? await profilesRes.json() : [...seedProfiles];
      const projects = projectsRes.ok ? await projectsRes.json() : [...seedProjects];
      set({ profiles, projects });
    } catch {
      set({ profiles: [...seedProfiles], projects: [...seedProjects] });
    }
  },

  goCreateUser: () => set({ screen: "create-user" }),
  selectUser: (user) => set({ activeUser: user, screen: "home" }),
  goHome: () => set({ screen: "home" }),
  selectProject: (project) => set({ selectedProject: project, screen: "project-detail" }),
  goBack: () => set({ screen: "home" }),
  logout: () => set({ screen: "select-profile", activeUser: null, selectedProject: null }),

  createUser: async (user) => {
    const res = await fetch("/api/profiles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    if (res.ok) {
      const saved = await res.json();
      set((s) => ({ profiles: [...s.profiles, saved], activeUser: saved, screen: "home" }));
    }
  },

  updateUser: async (id, patch) => {
    const res = await fetch("/api/profiles", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...patch, id }),
    });
    if (res.ok) {
      const updated = await res.json();
      set((s) => ({
        profiles: s.profiles.map((p) => (p.id === id ? updated : p)),
        activeUser: s.activeUser?.id === id ? updated : s.activeUser,
      }));
    }
  },

  deleteUser: async (id) => {
    const res = await fetch("/api/profiles", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      set((s) => {
        const isActive = s.activeUser?.id === id;
        return {
          profiles: s.profiles.filter((p) => p.id !== id),
          projects: s.projects.filter((pr) => pr.profileId !== id),
          activeUser: isActive ? null : s.activeUser,
          screen: isActive ? "select-profile" : s.screen,
        };
      });
    }
  },

  createProject: async (p) => {
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(p),
    });
    if (res.ok) {
      const saved = await res.json();
      set((s) => ({ projects: [...s.projects, saved] }));
    }
  },

  updateProject: async (id, patch) => {
    const res = await fetch(`/api/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (res.ok) {
      const updated = await res.json();
      set((s) => ({
        projects: s.projects.map((pr) => (pr.id === id ? updated : pr)),
        selectedProject: s.selectedProject?.id === id ? updated : s.selectedProject,
      }));
    }
  },

  deleteProject: async (id) => {
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (res.ok) {
      set((s) => ({
        projects: s.projects.filter((pr) => pr.id !== id),
        selectedProject: s.selectedProject?.id === id ? null : s.selectedProject,
        screen: s.selectedProject?.id === id ? "home" : s.screen,
      }));
    }
  },
}));
