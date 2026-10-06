import { api } from "./client";
import type { Profile } from "@/types";

export const profileApi = {
  async get(): Promise<Profile> {
    const { data } = await api.get<Profile>("/profile");
    return data;
  },

  async update(input: Partial<Profile>): Promise<Profile> {
    const { data } = await api.put<Profile>("/profile", input);
    return data;
  },
};
