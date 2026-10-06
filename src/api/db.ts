import { promises as fs } from "fs";
import path from "path";
import type { Project } from "@/types";
import type { Profile } from "@/types";
import { projects as seedProjects } from "@/data/projects";
import { profile as seedProfile } from "@/data/profile";

const DATA_DIR = path.join(process.cwd(), ".data");
const PROJECTS_FILE = path.join(DATA_DIR, "projects.json");
const PROFILE_FILE = path.join(DATA_DIR, "profile.json");

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readProjectFile(): Promise<Project[]> {
  try {
    const raw = await fs.readFile(PROJECTS_FILE, "utf-8");
    return JSON.parse(raw) as Project[];
  } catch {
    return [...seedProjects];
  }
}

async function writeProjectFile(data: Project[]) {
  await ensureDir();
  await fs.writeFile(PROJECTS_FILE, JSON.stringify(data, null, 2), "utf-8");
}

async function readProfileFile(): Promise<Profile> {
  try {
    const raw = await fs.readFile(PROFILE_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    // compat: if file stored array, return first
    if (Array.isArray(parsed)) return parsed[0] as Profile;
    return parsed as Profile;
  } catch {
    if (!seedProfile) throw new Error("no profile");
    return { ...seedProfile } as Profile;
  }
}

async function writeProfileFile(data: Profile) {
  await ensureDir();
  await fs.writeFile(PROFILE_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export const db = {
  getProjects: readProjectFile,
  saveProjects: writeProjectFile,
  getProfile: readProfileFile,
  saveProfile: writeProfileFile,
};
