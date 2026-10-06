import { NextResponse } from "next/server";
import { getProfile, updateProfile } from "@/api/profile";

export async function GET() {
  const profile = await getProfile();
  return NextResponse.json(profile);
}

export async function PUT(request: Request) {
  const body = await request.json();
  const profile = await updateProfile(body);
  return NextResponse.json(profile);
}
