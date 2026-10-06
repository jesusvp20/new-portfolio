import type { Project } from "@/types";
import Image from "next/image";

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
}

export function ProjectCard({ project, onSelect }: ProjectCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(project)}
      className="anim-card group w-48 cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] text-left backdrop-blur-xl hover:border-[var(--ps-blue)]/40 hover:bg-white/[0.07] hover:shadow-[0_8px_24px_rgba(0,112,209,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ps-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
    >
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={project.cover}
          alt={project.title}
          fill
          className="object-cover transition-[transform,filter] duration-500 ease-[var(--ease-out)] group-hover:scale-[1.06] group-hover:brightness-[1.08]"
        />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/35 to-transparent" />
      </div>
      <div className="p-3">
        <p className="truncate text-base font-medium text-white">{project.title}</p>
        <p className="mt-0.5 truncate text-xs text-white/50">
          {project.tech.join(" · ")}
        </p>
      </div>
    </button>
  );
}
