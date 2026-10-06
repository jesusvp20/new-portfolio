import type { Achievement } from "./achievement";

export type CoverType = "image" | "color" | "gradient";

export interface Project {
  id: string;
  profileId: string;
  title: string;
  summary?: string;
  description: string;
  role?: string;
  cover: string; // image url/dataURL fallback
  coverType?: CoverType;
  coverValue?: string; // hex or gradient css
  gallery?: string[];
  tech: string[];
  githubUrl?: string;
  demoUrl?: string;
  achievements: Achievement[];
  featured?: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}
