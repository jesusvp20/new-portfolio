"use client";

import { useEffect, useState } from "react";
import { useSystemStore } from "@/store/use-system-store";
import { ProjectCarousel } from "@/components/projects/components/project-carousel";
import { ProjectForm } from "@/components/projects/components/project-form";
import { WaveBackground } from "@/components/wave-background";
import { MemojiAvatar, AvatarFromConfig } from "dapvatar";
import { FaGithub, FaLinkedin, FaEnvelope, FaPhone, FaPen } from "react-icons/fa";
import { TECH_CATALOG, techIconUrl } from "@/lib/tech-icons";
import { AnimatePresence, motion } from "framer-motion";
import type { Project } from "@/types";
import { useSystemAudio } from "@/hooks/use-system-audio";
import { ProfileForm } from "@/components/profile/components/profile-form";
import Image from "next/image";

export function Home() {
  const activeUser = useSystemStore((s) => s.activeUser);
  const allProjects = useSystemStore((s) => s.projects);
  const projects = activeUser ? allProjects.filter((p) => p.profileId === activeUser.id) : [];
  const selectProject = useSystemStore((s) => s.selectProject);
  const logout = useSystemStore((s) => s.logout);
  const hydrate = useSystemStore((s) => s.hydrate);
  const createProject = useSystemStore((s) => s.createProject);
  const updateUser = useSystemStore((s) => s.updateUser);
  const { play, stop } = useSystemAudio();

  const [showAdd, setShowAdd] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [preview, setPreview] = useState<Project | null>(null);
  const [focusedProject, setFocusedProject] = useState<Project | null>(null);

  useEffect(() => { hydrate(); }, [hydrate]);
  useEffect(() => { play(); return () => stop(); }, [play, stop]);

  // Mock inventado: si el perfil activo no tiene proyectos, le sembramos 2 destacados con id único
  useEffect(() => {
    if (!activeUser) return;
    if (projects.length > 0) return;
    const hasAny = allProjects.some((p) => p.profileId === activeUser.id);
    if (hasAny) return;
    const seededKey = `mocksSeeded:${activeUser.id}`;
    if (typeof window !== "undefined" && localStorage.getItem(seededKey)) return;
    const now = new Date().toISOString();
    const mocks: Project[] = [
      {
        id: `proj-${crypto.randomUUID()}`,
        profileId: activeUser.id,
        title: "Bloom — Design System PS5",
        summary: "Sistema modular con tokens PS5 y Devicon.",
        description: "Design system inspirado en PS5: tokens --ps-blue/red, glass blur 16px y carrusel con expand. Incluye TechSelector con logos externos.",
        role: "Design Engineer",
        cover: "/projects/proyecto-1.svg",
        coverType: "image",
        tech: ["Next.js", "Tailwind", "Figma"],
        githubUrl: "https://github.com/tu/bloom-ps5",
        demoUrl: "https://bloom-ps5.vercel.app",
        achievements: [{ id: "m1", title: "Tokens PS5", description: "AA contrast validado", rarity: "gold" }],
        featured: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: `proj-${crypto.randomUUID()}`,
        profileId: activeUser.id,
        title: "Orbit — Visual 3D",
        summary: "Visualizador orbital con Three.js y GSAP.",
        description: "Experiencia 3D orbital a 60fps con controles PS5 y sonidos espaciales. Carrusel PS5 con highlight y modal expand.",
        role: "Frontend 3D",
        cover: "/projects/proyecto-2.svg",
        coverType: "image",
        tech: ["Three.js", "GSAP", "React"],
        githubUrl: "https://github.com/tu/orbit-3d",
        demoUrl: "https://orbit-3d.vercel.app",
        achievements: [{ id: "m2", title: "60fps", description: "Mantiene 60fps en mobile", rarity: "platinum" }],
        featured: true,
        createdAt: now,
        updatedAt: now,
      },
    ];
    if (typeof window !== "undefined") localStorage.setItem(seededKey, "1");
    mocks.forEach((m) => createProject(m));
  }, [activeUser, projects.length, allProjects, createProject]);

  if (!activeUser) return null;

  const bgProject = focusedProject || projects[0] || null;
  const bgCover = bgProject?.coverType === "image" ? bgProject.cover : undefined;
  const bgCoverType = bgProject?.coverType;
  const bgCoverValue = bgProject?.coverValue;

  return (
    <main className="relative min-h-screen overflow-hidden bg-transparent">
      <WaveBackground variant="home" coverUrl={bgCover} coverType={bgCoverType} coverValue={bgCoverValue} />
      <motion.div initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }} transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }} className="h-[1px] w-full bg-gradient-to-r from-transparent via-[var(--ps-blue)]/50 to-transparent origin-center" />
      <div className="relative flex min-h-screen flex-col">
        <motion.header initial={{ opacity: 0, y: -10, filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.52, ease: [0.23, 1, 0.32, 1], delay: 0.08 }} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 md:px-10 border-b border-white/[0.06] bg-white/[0.02] backdrop-blur will-change-transform">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 overflow-hidden rounded-full ring-1 ring-white/15">
              {activeUser.avatarConfig ? (
                <AvatarFromConfig config={activeUser.avatarConfig} size={40} title={activeUser.name} className="h-full w-full" />
              ) : (
                <MemojiAvatar seed={activeUser.memojiSeed} posture={(activeUser.memojiPosture as never) ?? "happy"} size={40} shape="circle" alt={activeUser.name} className="h-full w-full object-cover" />
              )}
            </div>
            <div>
              <h1 className="text-[16px] font-semibold tracking-[-0.02em] text-white">{activeUser.name}</h1>
              <p className="text-xs text-white/45 line-clamp-1">{activeUser.headline || activeUser.title} · {activeUser.bio?.slice(0, 80)}</p>
              <div className="mt-1 flex flex-wrap gap-2 text-xs text-white/50">
                {activeUser.email && <span className="flex items-center gap-1"><FaEnvelope className="text-[11px]" /> {activeUser.email}</span>}
                {activeUser.phone && <span className="flex items-center gap-1"><FaPhone className="text-[11px]" /> {activeUser.phone}</span>}
                {activeUser.github && <a href={activeUser.github} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-white"><FaGithub /> GitHub</a>}
                {activeUser.linkedin && <a href={activeUser.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-white"><FaLinkedin /> LinkedIn</a>}
              </div>
              {activeUser.technologies && activeUser.technologies.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {activeUser.technologies.map((t) => {
                    const e = TECH_CATALOG.find((c) => c.label === t);
                    const url = e ? techIconUrl(e.devicon) : null;
                    return <span key={t} className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-white/70">{url && <img src={url} alt={t} className="h-3.5 w-3.5 object-contain bg-white rounded-full p-0.5" />}{t}</span>;
                  })}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setShowEditProfile(true)} className="cursor-pointer rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs flex items-center gap-1.5 text-white/70 hover:bg-white/10"><FaPen className="text-[11px]" /> Editar perfil</button>
            <button type="button" onClick={logout} className="cursor-pointer rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/70 hover:bg-white/10">Cambiar usuario</button>
          </div>
        </motion.header>

        <motion.section initial={{ opacity: 0, y: 14, filter: "blur(4px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.52, ease: [0.23, 1, 0.32, 1], delay: 0.14 }} className="px-6 py-6 md:px-10 will-change-transform">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1], delay: 0.18 }} className="flex items-end justify-between mb-3">
            <div>
              <h2 className="text-[13px] font-medium tracking-[0.14em] text-white/35">EXPLORAR</h2>
              <p className="mt-1 text-xl font-semibold tracking-[-0.02em] text-white">Mis proyectos</p>
            </div>
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.32 }} className="text-xs text-white/30">{projects.length} títulos</motion.span>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.46, delay: 0.22, ease: [0.23, 1, 0.32, 1] }}>
            <ProjectCarousel projects={projects} onSelect={setPreview} onAdd={() => setShowAdd(true)} onFocusedChange={setFocusedProject} />
          </motion.div>
        </motion.section>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.46, delay: 0.36, ease: [0.23, 1, 0.32, 1] }} className="mt-auto flex justify-center p-4">
          <div className="flex items-center gap-3 rounded-full border border-white/[0.07] bg-white/[0.05] px-4 py-2 text-xs text-white/50 backdrop-blur">
            <span className="flex items-center gap-1.5"><span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-[8px] font-bold text-black">◀▶</span> Navegar</span>
            <span className="h-3 w-px bg-white/15" />
            <span className="flex items-center gap-1.5"><span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-[8px] font-bold text-black">X</span> Abrir</span>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0, backdropFilter: "blur(0px)" }} animate={{ opacity: 1, backdropFilter: "blur(12px)" }} exit={{ opacity: 0, backdropFilter: "blur(0px)" }} transition={{ duration: 0.32, ease: [0.23, 1, 0.32, 1] }} className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 p-6" onClick={() => setShowAdd(false)}>
            <motion.div layoutId="new-project-tile" initial={{ opacity: 0, y: 16, scale: 0.96, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }} exit={{ opacity: 0, y: 10, scale: 0.96, filter: "blur(6px)" }} transition={{ type: "spring", stiffness: 380, damping: 28 }} onClick={(e) => e.stopPropagation()} className="origin-center w-full flex justify-center will-change-transform">
              <ProjectForm
                initial={{}}
                submitLabel="Crear"
                onCancel={() => setShowAdd(false)}
                onSubmit={(vals) => {
                  const p: Project = {
                    id: `proj-${Date.now()}`,
                    profileId: activeUser.id,
                    title: vals.title,
                    summary: vals.summary,
                    description: vals.description,
                    role: vals.role,
                    cover: vals.cover,
                    coverType: vals.coverType,
                    coverValue: vals.coverValue,
                    gallery: vals.gallery,
                    tech: vals.tech,
                    githubUrl: vals.githubUrl,
                    demoUrl: vals.demoUrl,
                    achievements: [],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  };
                  createProject(p);
                  setShowAdd(false);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Preview modal PS5 — expand desde el tile con spring suave */}
      <AnimatePresence>
        {preview && (
          <motion.div initial={{ opacity: 0, backdropFilter: "blur(0px)" }} animate={{ opacity: 1, backdropFilter: "blur(14px)" }} exit={{ opacity: 0, backdropFilter: "blur(0px)" }} transition={{ duration: 0.32, ease: [0.23, 1, 0.32, 1] }} className="fixed inset-0 z-40 flex items-center justify-center bg-black/75 p-4 md:p-6" onClick={() => setPreview(null)}>
            <motion.div layoutId={`project-${preview.id}`} initial={{ opacity: 0, y: 18, scale: 0.96, filter: "blur(10px)" }} animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }} exit={{ opacity: 0, y: 12, scale: 0.97, filter: "blur(8px)" }} transition={{ type: "spring", stiffness: 380, damping: 30 }} onClick={(e) => e.stopPropagation()} className="relative w-full max-w-[760px] overflow-hidden rounded-[28px] border border-white/15 bg-[#0f0f0f] shadow-[0_24px_64px_rgba(0,0,0,0.7)] will-change-transform">
              <div className="relative h-[220px] w-full overflow-hidden">
                {preview.coverType === "color" && preview.coverValue ? (
                  <div className="h-full w-full" style={{ background: preview.coverValue }} />
                ) : preview.coverType === "gradient" && preview.coverValue ? (
                  <div className="h-full w-full" style={{ background: preview.coverValue }} />
                ) : (
                  <Image src={preview.cover} alt={preview.title} fill className="object-cover opacity-90" unoptimized={preview.cover.startsWith("data:")} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <button type="button" onClick={() => setPreview(null)} className="absolute right-4 top-4 h-8 w-8 rounded-full bg-black/60 backdrop-blur border border-white/15 text-white flex items-center justify-center hover:bg-black/80 cursor-pointer">×</button>
                <div className="absolute bottom-0 p-6">
                  <p className="text-xs tracking-[0.14em] text-white/60">{preview.role || "Proyecto"} {preview.featured && "· DESTACADO"}</p>
                  <h3 className="text-2xl font-bold text-white">{preview.title}</h3>
                  <p className="text-sm text-white/70 max-w-[520px]">{preview.summary || preview.description}</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm text-white/60 leading-relaxed">{preview.description}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {preview.tech.map((t) => {
                    const e = TECH_CATALOG.find((c) => c.label === t);
                    const url = e ? techIconUrl(e.devicon) : null;
                    return (
                      <span key={t} className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-xs text-white/80">
                        {url && <img src={url} alt={t} className="h-4 w-4 object-contain bg-white rounded-full p-0.5" />}
                        {t}
                      </span>
                    );
                  })}
                </div>
                {preview.gallery && preview.gallery.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {preview.gallery.map((g, idx) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={idx} src={g} alt={`gallery ${idx}`} className="h-24 w-full rounded-xl object-cover border border-white/10" />
                    ))}
                  </div>
                )}
                <div className="mt-6 flex flex-wrap gap-3">
                  {preview.githubUrl && <a href={preview.githubUrl} target="_blank" rel="noreferrer" className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-white/90">GitHub</a>}
                  {preview.demoUrl && <a href={preview.demoUrl} target="_blank" rel="noreferrer" className="rounded-full bg-[var(--ps-blue)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--ps-blue-hover)]">Producción</a>}
                  <button type="button" onClick={() => { setPreview(null); selectProject(preview); }} className="rounded-full bg-white/10 border border-white/10 px-5 py-2.5 text-sm text-white hover:bg-white/15 cursor-pointer">Ver detalle completo [X]</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEditProfile && (
          <motion.div initial={{ opacity: 0, backdropFilter: "blur(0px)" }} animate={{ opacity: 1, backdropFilter: "blur(8px)" }} exit={{ opacity: 0, backdropFilter: "blur(0px)" }} transition={{ duration: 0.26, ease: [0.23, 1, 0.32, 1] }} className="fixed inset-0 z-40 flex items-center justify-center bg-black/75 p-4 overflow-y-auto" onClick={() => setShowEditProfile(false)}>
            <motion.div initial={{ opacity: 0, transform: "scale(0.96) translateY(12px)", filter: "blur(4px)" }} animate={{ opacity: 1, transform: "scale(1) translateY(0px)", filter: "blur(0px)" }} exit={{ opacity: 0, transform: "scale(0.96) translateY(12px)", filter: "blur(4px)" }} transition={{ type: "spring", duration: 0.5, bounce: 0.14 }} onClick={(e) => e.stopPropagation()} className="my-4 will-change-transform">
              <ProfileForm
                initial={{
                  name: activeUser.name,
                  title: activeUser.title,
                  bio: activeUser.bio,
                  headline: activeUser.headline,
                  email: activeUser.email,
                  phone: activeUser.phone,
                  github: activeUser.github,
                  linkedin: activeUser.linkedin,
                  memojiSeed: activeUser.memojiSeed,
                  memojiPosture: activeUser.memojiPosture,
                  catalogId: undefined,
                  technologies: activeUser.technologies,
                }}
                submitLabel="Guardar"
                onCancel={() => setShowEditProfile(false)}
                onSubmit={(vals) => {
                  updateUser(activeUser.id, {
                    name: vals.name,
                    title: vals.title,
                    bio: vals.bio,
                    headline: vals.headline,
                    email: vals.email,
                    phone: vals.phone,
                    github: vals.github,
                    linkedin: vals.linkedin,
                    memojiSeed: vals.memojiSeed,
                    memojiPosture: vals.memojiPosture,
                    technologies: vals.technologies,
                  });
                  setShowEditProfile(false);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
