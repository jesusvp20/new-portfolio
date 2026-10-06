"use client";

import { useState } from "react";
import NiceAvatar from "react-nice-avatar";
import { AVAILABLE_AVATARS } from "./avatars";
import { useSystemStore } from "@/store/use-system-store";
import { cn } from "@/lib/utils";
import type { Profile, AvatarConfig } from "@/types";

const DEFAULT_AVATAR_CONFIG: AvatarConfig = {
  faceShape: "round",
  skinTone: "peach",
  hair: "bob",
  hairColor: "brown",
  eyes: "default",
  eyebrows: "calm",
  nose: "medium",
  mouth: "smile",
  accessory: "none",
  background: "gradient",
};
import { FaArrowLeft } from "react-icons/fa";

export function CreateUser() {
  const createUser = useSystemStore((s) => s.createUser);
  const goBack = useSystemStore((s) => s.goBack);
  const [name, setName] = useState("");
  const [avatarId, setAvatarId] = useState(AVAILABLE_AVATARS[0].id);

  const selected = AVAILABLE_AVATARS.find((a) => a.id === avatarId)!;

  const handleCreate = () => {
    if (!name.trim()) return;
    const now = new Date().toISOString();
    const profile: Profile = {
      id: `user-${crypto.randomUUID()}`,
      name: name.trim(),
      title: "Nuevo usuario",
      bio: "",
      avatar: selected.id,
      memojiSeed: name.trim(),
      memojiPosture: "happy",
      avatarConfig: DEFAULT_AVATAR_CONFIG,
      createdAt: now,
      updatedAt: now,
    };
    createUser(profile);
  };

  return (
    <div className="flex h-full min-h-screen flex-col items-center justify-center gap-10 px-6">
      <button
        type="button"
        onClick={goBack}
        className="absolute left-6 top-6 flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white/80 backdrop-blur-xl transition-colors duration-200 hover:bg-white/10"
      >
        <FaArrowLeft /> Volver
      </button>

      <h1 className="text-3xl font-semibold text-white">Crear usuario</h1>

      <div className={cn("flex h-32 w-32 items-center justify-center rounded-full", selected.config.isGradient && "bg-gradient-to-br from-indigo-500 to-fuchsia-600")}>
        <NiceAvatar
          shape="circle"
          className="h-full w-full rounded-full"
          {...selected.config}
        />
      </div>

      <div className="flex gap-4">
        {AVAILABLE_AVATARS.map((avatar) => (
          <button
            key={avatar.id}
            type="button"
            onClick={() => setAvatarId(avatar.id)}
            aria-label={avatar.label}
            className={cn(
              "flex h-16 w-16 cursor-pointer items-center justify-center rounded-full transition-transform duration-200",
              avatar.id === avatarId ? "ring-4 ring-white" : "opacity-60 hover:scale-105 hover:opacity-100"
            )}
          >
            <NiceAvatar shape="circle" className="h-full w-full" {...avatar.config} />
          </button>
        ))}
      </div>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nombre de usuario"
        className="w-72 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/40 backdrop-blur-xl focus:border-white/40 focus:outline-none"
      />

      <button
        type="button"
        onClick={handleCreate}
        disabled={!name.trim()}
        className="cursor-pointer rounded-full bg-white px-8 py-3 font-medium text-black transition-colors duration-200 hover:bg-white/80 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Continuar
      </button>
    </div>
  );
}
