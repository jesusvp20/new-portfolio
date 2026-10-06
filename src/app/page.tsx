"use client";

import { useSystemStore } from "@/store/use-system-store";
import { SelectProfile } from "@/components/profile/components/select-profile";
import { CreateUser } from "@/components/profile/components/create-user";
import { Home } from "@/components/home";
import { DetallesProject } from "@/components/projects/components/detaills-project";

export default function Page() {
  const screen = useSystemStore((s) => s.screen);

  if (screen === "home") return <Home />;
  if (screen === "project-detail") return <DetallesProject />;
  if (screen === "create-user") return <CreateUser />;
  return <SelectProfile />;
}
