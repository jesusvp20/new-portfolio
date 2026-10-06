import { supabase } from "@/lib/supabase-server";
import type { Project } from "@/types";
import { projects as seedProjects } from "@/data/projects";

function mapProjectRow(row: Record<string, unknown>): Project {
  return {
    id: row.id as string,
    profileId: row.profile_id as string,
    title: row.title as string,
    summary: row.summary as string | undefined,
    description: row.description as string,
    role: row.role as string | undefined,
    cover: row.cover as string,
    coverType: row.cover_type as Project["coverType"],
    coverValue: row.cover_value as string | undefined,
    gallery: row.gallery as string[] | undefined,
    tech: (row.tech as string[]) ?? [],
    githubUrl: row.github_url as string | undefined,
    demoUrl: row.demo_url as string | undefined,
    achievements: (row.achievements as Project["achievements"]) ?? [],
    featured: (row.featured as boolean) ?? false,
    order: row.order as number | undefined,
    createdAt: row.created_at as string | undefined,
    updatedAt: row.updated_at as string | undefined,
  };
}

function toProjectRow(p: Partial<Project>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (p.id !== undefined) row.id = p.id;
  if (p.profileId !== undefined) row.profile_id = p.profileId;
  if (p.title !== undefined) row.title = p.title;
  if (p.summary !== undefined) row.summary = p.summary;
  if (p.description !== undefined) row.description = p.description;
  if (p.role !== undefined) row.role = p.role;
  if (p.cover !== undefined) row.cover = p.cover;
  if (p.coverType !== undefined) row.cover_type = p.coverType;
  if (p.coverValue !== undefined) row.cover_value = p.coverValue;
  if (p.gallery !== undefined) row.gallery = p.gallery;
  if (p.tech !== undefined) row.tech = p.tech;
  if (p.githubUrl !== undefined) row.github_url = p.githubUrl;
  if (p.demoUrl !== undefined) row.demo_url = p.demoUrl;
  if (p.achievements !== undefined) row.achievements = p.achievements;
  if (p.featured !== undefined) row.featured = p.featured;
  if (p.order !== undefined) row.order = p.order;
  return row;
}

export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase.from("projects").select("*");
  if (error || !data || data.length === 0) return [...seedProjects];
  return data.map(mapProjectRow);
}

export async function getProject(id: string): Promise<Project | null> {
  const { data, error } = await supabase.from("projects").select("*").eq("id", id).single();
  if (error || !data) return null;
  return mapProjectRow(data);
}

export async function createProject(input: Omit<Project, "id">): Promise<Project> {
  const project: Project = { ...input, id: crypto.randomUUID() };
  const row = toProjectRow(project);
  const { error } = await supabase.from("projects").insert(row);
  if (error) throw error;
  return project;
}

export async function updateProject(
  id: string,
  input: Partial<Omit<Project, "id">>
): Promise<Project | null> {
  const row = toProjectRow(input);
  const { data, error } = await supabase.from("projects").update(row).eq("id", id).select().single();
  if (error || !data) return null;
  return mapProjectRow(data);
}

export async function deleteProject(id: string): Promise<boolean> {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  return !error;
}
