import { supabase } from "@/lib/supabase-server";
import type { Project } from "@/types";
import type { Profile } from "@/types";
import { projects as seedProjects } from "@/data/projects";
import { profile as seedProfile } from "@/data/profile";

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

function mapProfileRow(row: Record<string, unknown>): Profile {
  return {
    id: row.id as string,
    name: row.name as string,
    title: row.title as string,
    subtitle: row.subtitle as string | undefined,
    avatar: row.avatar as string,
    memojiSeed: row.memoji_seed as string,
    memojiPosture: row.memoji_posture as string | undefined,
    avatarConfig: row.avatar_config as Profile["avatarConfig"],
    bio: row.bio as string,
    headline: row.headline as string | undefined,
    email: row.email as string | undefined,
    phone: row.phone as string | undefined,
    github: row.github as string | undefined,
    linkedin: row.linkedin as string | undefined,
    website: row.website as string | undefined,
    location: row.location as string | undefined,
    technologies: row.technologies as string[] | undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
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

function toProfileRow(p: Partial<Profile>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (p.id !== undefined) row.id = p.id;
  if (p.name !== undefined) row.name = p.name;
  if (p.title !== undefined) row.title = p.title;
  if (p.subtitle !== undefined) row.subtitle = p.subtitle;
  if (p.avatar !== undefined) row.avatar = p.avatar;
  if (p.memojiSeed !== undefined) row.memoji_seed = p.memojiSeed;
  if (p.memojiPosture !== undefined) row.memoji_posture = p.memojiPosture;
  if (p.avatarConfig !== undefined) row.avatar_config = p.avatarConfig;
  if (p.bio !== undefined) row.bio = p.bio;
  if (p.headline !== undefined) row.headline = p.headline;
  if (p.email !== undefined) row.email = p.email;
  if (p.phone !== undefined) row.phone = p.phone;
  if (p.github !== undefined) row.github = p.github;
  if (p.linkedin !== undefined) row.linkedin = p.linkedin;
  if (p.website !== undefined) row.website = p.website;
  if (p.location !== undefined) row.location = p.location;
  if (p.technologies !== undefined) row.technologies = p.technologies;
  return row;
}

export const db = {
  async getProjects(): Promise<Project[]> {
    const { data, error } = await supabase.from("projects").select("*");
    if (error || !data || data.length === 0) return [...seedProjects];
    return data.map(mapProjectRow);
  },

  async saveProjects(projects: Project[]): Promise<void> {
    for (const p of projects) {
      const row = toProjectRow(p);
      const { error } = await supabase.from("projects").upsert(row);
      if (error) throw error;
    }
  },

  async getProfile(): Promise<Profile> {
    const { data, error } = await supabase.from("profiles").select("*").single();
    if (error || !data) return { ...seedProfile } as Profile;
    return mapProfileRow(data);
  },

  async saveProfile(profile: Profile): Promise<void> {
    const row = toProfileRow(profile);
    const { error } = await supabase.from("profiles").upsert(row);
    if (error) throw error;
  },
};
