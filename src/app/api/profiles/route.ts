import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-server";
import type { Profile } from "@/types";

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

export async function GET() {
  const { data, error } = await supabase.from("profiles").select("*");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data.map(mapProfileRow));
}

export async function POST(request: Request) {
  const body = await request.json();
  const { id, ...rest } = body;
  const row = toProfileRow(rest);
  const { data, error } = await supabase.from("profiles").insert(row).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(mapProfileRow(data), { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, ...rest } = body;
  const row = toProfileRow(rest);
  const { data, error } = await supabase.from("profiles").update(row).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(mapProfileRow(data));
}

export async function DELETE(request: Request) {
  const body = await request.json();
  const { id } = body;
  const { error } = await supabase.from("profiles").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
