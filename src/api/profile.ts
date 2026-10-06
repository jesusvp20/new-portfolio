import { db } from "./db";
import type { Profile } from "@/types";

export async function getProfile(): Promise<Profile> {
  return db.getProfile();
}

export async function updateProfile(input: Partial<Profile>): Promise<Profile> {
  const current = await db.getProfile();
  const next: Profile = { ...current, ...input };
  await db.saveProfile(next);
  return next;
}
