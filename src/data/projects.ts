import type { Project } from "@/types";

export const projects: Project[] = [
  {
    id: "proyecto-1",
    profileId: "you",
    title: "Neon Dash",
    summary: "Runner futurista 60fps con haptics DualSense.",
    description: "Runner futurista con física PS5 y haptics. Diseño modular, ondas tenues y carrusel expansivo. Demuestra CRUD, sonidos PS5 y paleta negro/blanco/rojo/azul.",
    role: "Full-Stack",
    cover: "/projects/proyecto-1.svg",
    tech: ["Next.js", "Tailwind", "Framer Motion", "PostgreSQL"],
    githubUrl: "https://github.com/tu/neon-dash",
    demoUrl: "https://neon-dash.vercel.app",
    achievements: [
      { id: "a1", title: "Primer logro", description: "Lanzamiento alfa", rarity: "bronze" },
      { id: "a2", title: "60 FPS locked", description: "Optimización extrema", rarity: "silver" },
      { id: "a3", title: "Platino PS5", description: "100% completado", rarity: "platinum" },
    ],
    featured: true,
  },
  {
    id: "proyecto-2",
    profileId: "you",
    title: "Wave OS",
    summary: "OS experimental con shader de ondas y blur PS5.",
    description: "Sistema operativo experimental con ondas canvas y blur PS5. Carrusel PS5 con highlight y expansión a detalle con git/producción.",
    role: "Frontend",
    cover: "/projects/proyecto-2.svg",
    tech: ["React", "TypeScript", "Canvas", "Docker"],
    githubUrl: "https://github.com/tu/wave-os",
    demoUrl: "https://wave-os.vercel.app",
    achievements: [
      { id: "b1", title: "Boot perfecto", description: "Arranque en 0.8s", rarity: "bronze" },
      { id: "b2", title: "Onda infinita", description: "Shader custom", rarity: "gold" },
    ],
    featured: true,
  },
];
