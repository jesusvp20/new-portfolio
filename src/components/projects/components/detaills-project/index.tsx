"use client";

import { useState } from "react";
import { useSystemStore } from "@/store/use-system-store";
import { Logros } from "@/components/user/components/logros";
import { ProjectForm } from "@/components/projects/components/project-form";
import { WaveBackground } from "@/components/wave-background";
import { FaArrowLeft, FaGithub, FaExternalLinkAlt, FaPen, FaTrash, FaGamepad } from "react-icons/fa";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useSystemAudio } from "@/hooks/use-system-audio";

export function DetallesProject() {
  const project = useSystemStore((s) => s.selectedProject);
  const goBack = useSystemStore((s) => s.goBack);
  const updateProject = useSystemStore((s) => s.updateProject);
  const deleteProject = useSystemStore((s) => s.deleteProject);
  const { playBack, playSelect } = useSystemAudio();
  const [editing, setEditing] = useState(false);

  if (!project) return null;

  const coverForBg = project.coverType === "image" ? project.cover : undefined;
  return (
    <main className="relative min-h-screen bg-transparent overflow-hidden">
      <WaveBackground variant="home" coverUrl={coverForBg} coverType={project.coverType} coverValue={project.coverValue} />
      <div className="relative">
        {/* Hero PS5 expand con vida e iconos — entrada suave */}
        <motion.div layoutId={`project-${project.id}`} initial={{ opacity: 0, scale: 0.98, filter: "blur(6px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} transition={{ type: "spring", stiffness: 380, damping: 30 }} className="relative h-[340px] w-full overflow-hidden border-b border-white/10">
          {project.coverType === "color" && project.coverValue ? (
            <div className="absolute inset-0" style={{ background: project.coverValue }} />
          ) : project.coverType === "gradient" && project.coverValue ? (
            <div className="absolute inset-0" style={{ background: project.coverValue }} />
          ) : (
            <Image src={project.cover} alt={project.title} fill className="object-cover opacity-50" unoptimized={project.cover.startsWith("data:")} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute bottom-0 p-6 md:p-10 flex items-end gap-6">
            <div className="hidden md:flex h-28 w-48 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--ps-blue)] to-black border border-white/15 text-5xl text-white/80 shrink-0">
              <FaGamepad />
            </div>
            <div>
              <p className="text-xs tracking-[0.18em] text-white/60 flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[var(--ps-blue)]" />{project.role || "Proyecto"} {project.featured && <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-black"><FaGamepad className="text-[10px]" /> DESTACADO</span>}</p>
              <h1 className="text-3xl md:text-4xl font-bold tracking-[-0.02em] text-white flex items-center gap-3">{project.title} <span className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur px-2.5 py-1 text-xs font-medium text-white border border-white/15">★ {project.tech.length} tech</span></h1>
              <p className="mt-2 max-w-2xl text-sm text-white/70">{project.summary || project.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.tech.map((t) => <span key={t} className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium text-black">{t}</span>)}
              </div>
            </div>
          </div>
          <button type="button" onClick={() => { playBack(); goBack(); }} className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/60 backdrop-blur border border-white/15 px-4 py-2 text-sm text-white hover:bg-black/80 cursor-pointer"><FaArrowLeft /> Volver [O]</button>
          <div className="absolute right-4 top-4 flex gap-2">
            <button type="button" onClick={() => { playSelect(); setEditing(true); }} className="h-9 w-9 rounded-full bg-white text-black flex items-center justify-center hover:bg-white/90 cursor-pointer"><FaPen className="text-xs" /></button>
            <button type="button" onClick={() => { if (confirm("Eliminar proyecto?")) { playBack(); deleteProject(project.id); } }} className="h-9 w-9 rounded-full bg-[var(--ps-red)] text-white flex items-center justify-center hover:bg-[var(--ps-red-hover)] cursor-pointer"><FaTrash className="text-xs" /></button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.48, delay: 0.18, ease: [0.23, 1, 0.32, 1] }} className="max-w-3xl p-6 md:p-10">
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22, duration: 0.4 }} className="text-white/70 leading-relaxed flex items-start gap-2"><FaGamepad className="mt-1 text-[var(--ps-blue)] shrink-0" /> {project.description}</motion.p>
          {project.gallery && project.gallery.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28 }} className="mt-6 grid grid-cols-2 gap-3">
              {project.gallery.map((g, idx) => (
                <motion.img key={idx} initial={{ opacity: 0, scale: 0.96, filter: "blur(4px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} transition={{ delay: 0.30 + idx * 0.06, duration: 0.4, ease: [0.23, 1, 0.32, 1] }} src={g} alt={`gallery ${idx}`} className="h-32 w-full rounded-2xl object-cover border border-white/10 anim-card" />
              ))}
            </motion.div>
          )}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36, duration: 0.4 }} className="mt-6 flex flex-wrap gap-3">
            {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-white/90 anim-card"><FaGithub /> GitHub</a>}
            {project.demoUrl && <a href={project.demoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--ps-blue)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--ps-blue-hover)] anim-card"><FaExternalLinkAlt /> Producción</a>}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs text-white/60 border border-white/10">◀▶ Navega · X Abre</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42, duration: 0.46 }} className="mt-8">
            <Logros achievements={project.achievements} />
          </motion.div>
        </motion.div>
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0, backdropFilter: "blur(0px)" }} animate={{ opacity: 1, backdropFilter: "blur(8px)" }} exit={{ opacity: 0, backdropFilter: "blur(0px)" }} transition={{ duration: 0.26, ease: [0.23, 1, 0.32, 1] }} className="fixed inset-0 z-40 flex items-center justify-center bg-black/75 p-4" onClick={() => setEditing(false)}>
            <motion.div initial={{ opacity: 0, transform: "scale(0.96) translateY(12px)", filter: "blur(4px)" }} animate={{ opacity: 1, transform: "scale(1) translateY(0px)", filter: "blur(0px)" }} exit={{ opacity: 0, transform: "scale(0.96) translateY(12px)", filter: "blur(4px)" }} transition={{ type: "spring", duration: 0.5, bounce: 0.14 }} onClick={(e) => e.stopPropagation()} className="will-change-transform">
              <ProjectForm
                initial={{ title: project.title, summary: project.summary, description: project.description, role: project.role, cover: project.cover, tech: project.tech.join(", "), githubUrl: project.githubUrl, demoUrl: project.demoUrl }}
                submitLabel="Guardar"
                onCancel={() => setEditing(false)}
                onSubmit={(vals) => { updateProject(project.id, { title: vals.title, summary: vals.summary, description: vals.description, role: vals.role, cover: vals.cover, tech: vals.tech, githubUrl: vals.githubUrl, demoUrl: vals.demoUrl }); setEditing(false); }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
