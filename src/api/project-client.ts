import { api } from "./client";
import type { Project } from "@/types";

export const projectsApi = {
  async list(): Promise<Project[]> {
    const { data } = await api.get<Project[]>("/projects");
    return data;
  },

  async get(id: string): Promise<Project> {
    const { data } = await api.get<Project>(`/projects/${id}`);
    return data;
  },

  async create(input: Omit<Project, "id">): Promise<Project> {
    const { data } = await api.post<Project>("/projects", input);
    return data;
  },

  async update(id: string, input: Partial<Omit<Project, "id">>): Promise<Project> {
    const { data } = await api.put<Project>(`/projects/${id}`, input);
    return data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/projects/${id}`);
  },
};
