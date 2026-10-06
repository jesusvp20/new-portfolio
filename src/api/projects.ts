import { db } from "./db";
import type { Project } from "@/types";

export async function getProjects(): Promise<Project[]> {
  return db.getProjects();
}

export async function getProject(id: string): Promise<Project | null> {
  const projects = await db.getProjects();
  return projects.find((p) => p.id === id) ?? null;
}

export async function createProject(input: Omit<Project, "id">): Promise<Project> {
  const projects = await db.getProjects();
  const project: Project = { ...input, id: crypto.randomUUID() };
  projects.push(project);
  await db.saveProjects(projects);
  return project;
}

export async function updateProject(
  id: string,
  input: Partial<Omit<Project, "id">>
): Promise<Project | null> {
  const projects = await db.getProjects();
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) return null;
  projects[index] = { ...projects[index], ...input, id };
  await db.saveProjects(projects);
  return projects[index];
}

export async function deleteProject(id: string): Promise<boolean> {
  const projects = await db.getProjects();
  const next = projects.filter((p) => p.id !== id);
  if (next.length === projects.length) return false;
  await db.saveProjects(next);
  return true;
}
