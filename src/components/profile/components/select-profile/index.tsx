"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaChevronLeft, FaChevronRight, FaPen, FaTrash } from "react-icons/fa";
import { useSystemStore } from "@/store/use-system-store";
import { SelectProfileCard } from "./select-profile-card";
import { WaveBackground } from "@/components/wave-background";
import { useSystemAudio } from "@/hooks/use-system-audio";
import { ProfileForm } from "@/components/profile/components/profile-form";
import type { Profile, AvatarConfig } from "@/types";

const PAGE_SIZE = 4;

export function SelectProfile() {
  const profiles = useSystemStore((s) => s.profiles);
  const selectUser = useSystemStore((s) => s.selectUser);
  const createUser = useSystemStore((s) => s.createUser);
  const updateUser = useSystemStore((s) => s.updateUser);
  const deleteUser = useSystemStore((s) => s.deleteUser);
  const hydrate = useSystemStore((s) => s.hydrate);
  const { playHover, playSelect, playBack } = useSystemAudio();

  const [page, setPage] = useState(0);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [showForm, setShowForm] = useState<null | "create" | Profile>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => { hydrate(); }, [hydrate]);

  const slots = useMemo(() => [{ type: "add" as const }, ...profiles.map((p) => ({ type: "profile" as const, profile: p }))], [profiles]);
  const totalPages = Math.max(1, Math.ceil(slots.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const pageSlots = slots.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);
  const padded = [...pageSlots, ...Array(Math.max(0, PAGE_SIZE - pageSlots.length)).fill(null)];

  useEffect(() => {
    if (focusedIndex >= pageSlots.length) setFocusedIndex(Math.max(0, pageSlots.length - 1));
  }, [focusedIndex, pageSlots.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (showForm) { if (e.key === "Escape") { setShowForm(null); playBack(); } return; }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        if (focusedIndex < pageSlots.length - 1) setFocusedIndex((i) => i + 1);
        else if (safePage < totalPages - 1) { setPage((p) => p + 1); setFocusedIndex(0); }
        playHover();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (focusedIndex > 0) setFocusedIndex((i) => i - 1);
        else if (safePage > 0) { setPage((p) => p - 1); setFocusedIndex(PAGE_SIZE - 1); }
        playHover();
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const slot = pageSlots[focusedIndex];
        if (!slot) return;
        if (slot.type === "profile") { playSelect(); selectUser(slot.profile); }
        else { playHover(); setShowForm("create"); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focusedIndex, pageSlots, safePage, totalPages, selectUser, playHover, playSelect, playBack, showForm]);

  useEffect(() => { containerRef.current?.focus(); }, []);

  const nextPage = () => { if (safePage < totalPages - 1) { setPage((p) => p + 1); setFocusedIndex(0); playHover(); } };
  const prevPage = () => { if (safePage > 0) { setPage((p) => p - 1); setFocusedIndex(0); playHover(); } };

  return (
    <div ref={containerRef} tabIndex={-1} className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-transparent px-4 py-10 outline-none">
      <WaveBackground variant="login" />
      <motion.div initial={{ opacity: 0, transform: "translateY(-8px)" }} animate={{ opacity: 1, transform: "translateY(0px)" }} transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }} className="pointer-events-none absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--ps-blue)]/50 to-transparent" />
      <motion.div initial={{ opacity: 0, transform: "translateY(12px)" }} animate={{ opacity: 1, transform: "translateY(0px)" }} transition={{ duration: 0.32, delay: 0.08, ease: [0.23, 1, 0.32, 1] }} className="relative z-10 flex flex-col items-center">
        <p className="mb-2 text-[11px] font-medium tracking-[0.22em] text-white/45">MI PORTAFOLIO</p>
        <h1 className="text-center text-[28px] md:text-[36px] font-semibold tracking-[-0.03em] text-white">¿Quién va a jugar?</h1>
        <p className="mt-2 text-center text-[13px] text-white/45">Selecciona tu perfil para continuar · {profiles.length} usuarios</p>
        <div className="mt-4 flex items-center gap-2">
          <span className="h-[2px] w-10 rounded-full bg-[var(--ps-red)]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--ps-blue)] shadow-[0_0_8px_var(--ps-blue-glow)]" />
          <span className="h-[2px] w-10 rounded-full bg-white/15" />
        </div>
      </motion.div>

      <div className="relative z-10 mt-10 flex w-full max-w-[820px] items-center justify-center gap-2 md:gap-3">
        {totalPages > 1 && (
          <button type="button" onClick={prevPage} disabled={safePage === 0} aria-label="Página anterior" className="hidden md:flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white/70 backdrop-blur transition hover:bg-white/10 hover:text-white disabled:opacity-20 shrink-0">
            <FaChevronLeft className="text-sm" />
          </button>
        )}
        <AnimatePresence mode="wait">
          <motion.div key={safePage} initial={{ opacity: 0, transform: "translateX(24px)" }} animate={{ opacity: 1, transform: "translateX(0px)" }} exit={{ opacity: 0, transform: "translateX(-24px)" }} transition={{ duration: 0.32, ease: [0.23, 1, 0.32, 1] }} className="flex flex-wrap items-start justify-center gap-5 md:gap-8 will-change-transform" role="listbox" aria-label={`Selección de perfil página ${safePage + 1} de ${totalPages}`}>
            {padded.map((slot, i) => {
              if (slot === null) return <div key={`empty-${i}`} className="w-[132px] h-[140px] opacity-0 pointer-events-none hidden md:block" aria-hidden />;
              const isFocused = i === focusedIndex;
              if (slot.type === "profile") {
                return (
                  <motion.div key={slot.profile.id} initial={{ opacity: 0, transform: "scale(0.96)" }} animate={{ opacity: 1, transform: "scale(1)" }} transition={{ delay: i * 0.05, duration: 0.28, ease: [0.23, 1, 0.32, 1] }} onMouseEnter={() => { setFocusedIndex(i); playHover(); }} className="relative group/profile will-change-transform">
                    <SelectProfileCard profile={slot.profile} onSelect={(p) => { playSelect(); selectUser(p); }} focused={isFocused} />
                    <div className="absolute -top-1 -right-1 flex gap-1 opacity-0 group-hover/profile:opacity-100" style={{ transition: "opacity 160ms var(--ease-out)" }}>
                      <button type="button" onClick={(e) => { e.stopPropagation(); playHover(); setShowForm(slot.profile); }} className="h-7 w-7 rounded-full bg-white text-black flex items-center justify-center text-xs cursor-pointer" style={{ transition: "transform 160ms var(--ease-out)" }} aria-label="Editar"><FaPen className="text-[11px]" /></button>
                      <button type="button" onClick={(e) => { e.stopPropagation(); if (confirm(`Eliminar ${slot.profile.name}?`)) { playBack(); deleteUser(slot.profile.id); } }} className="h-7 w-7 rounded-full bg-[var(--ps-red)] text-white flex items-center justify-center text-xs cursor-pointer" style={{ transition: "transform 160ms var(--ease-out)" }} aria-label="Eliminar"><FaTrash className="text-[11px]" /></button>
                    </div>
                  </motion.div>
                );
              }
              return (
                <motion.div key="add" initial={{ opacity: 0, transform: "scale(0.96)" }} animate={{ opacity: 1, transform: "scale(1)" }} transition={{ delay: i * 0.05, duration: 0.28, ease: [0.23, 1, 0.32, 1] }} onMouseEnter={() => { setFocusedIndex(i); playHover(); }} className="will-change-transform">
                  <button type="button" onClick={() => { playHover(); setShowForm("create"); }} className={`group flex w-[132px] flex-col items-center gap-3 focus:outline-none ${isFocused ? "scale-[1.04]" : ""} transition-transform duration-200`} aria-label="Crear nuevo usuario">
                    <div className={`flex h-[96px] w-[96px] md:h-[108px] md:w-[108px] items-center justify-center rounded-full border-2 border-dashed bg-white/[0.04] backdrop-blur transition-all duration-200 ${isFocused ? "border-[var(--ps-red)] bg-[var(--ps-red-soft)] text-white shadow-[0_0_20px_var(--ps-red-glow)] scale-[1.04]" : "border-white/25 text-white/60 group-hover:border-white/40 group-hover:text-white"}`}>
                      <FaPlus className="text-3xl" />
                    </div>
                    <span className="text-center text-[15px] font-medium text-white">Nuevo usuario</span>
                    <span className="text-[11px] text-white/45">Crear perfil</span>
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
        {totalPages > 1 && (
          <button type="button" onClick={nextPage} disabled={safePage === totalPages - 1} aria-label="Página siguiente" className="hidden md:flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white/70 backdrop-blur transition hover:bg-white/10 hover:text-white disabled:opacity-20 shrink-0">
            <FaChevronRight className="text-sm" />
          </button>
        )}
      </div>

      {totalPages > 1 && (
        <>
          <div className="mt-4 flex md:hidden items-center gap-3">
            <button type="button" onClick={prevPage} disabled={safePage === 0} className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 disabled:opacity-20"><FaChevronLeft className="text-xs" /></button>
            <span className="text-xs text-white/50">{safePage + 1} / {totalPages}</span>
            <button type="button" onClick={nextPage} disabled={safePage === totalPages - 1} className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 disabled:opacity-20"><FaChevronRight className="text-xs" /></button>
          </div>
          <div className="mt-6 flex items-center justify-center gap-2" role="tablist" aria-label="Paginación">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button key={idx} type="button" role="tab" aria-selected={idx === safePage} aria-label={`Ir a página ${idx + 1}`} onClick={() => { setPage(idx); setFocusedIndex(0); playHover(); }} className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${idx === safePage ? "w-8 bg-[var(--ps-blue)] shadow-[0_0_10px_var(--ps-blue-glow)]" : "w-6 bg-white/20 hover:bg-white/35"}`} />
            ))}
          </div>
        </>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }} className="fixed inset-0 z-40 flex items-center justify-center bg-black/75 backdrop-blur-[8px] p-6 overflow-y-auto" onClick={() => setShowForm(null)}>
            <motion.div initial={{ opacity: 0, transform: "scale(0.96) translateY(12px)", filter: "blur(4px)" }} animate={{ opacity: 1, transform: "scale(1) translateY(0px)", filter: "blur(0px)" }} exit={{ opacity: 0, transform: "scale(0.96) translateY(12px)", filter: "blur(4px)" }} transition={{ type: "spring", duration: 0.5, bounce: 0.15 }} onClick={(e) => e.stopPropagation()} className="my-4 w-full flex justify-center will-change-transform">
              <ProfileForm
                initial={
                  showForm === "create"
                    ? {}
                    : {
                        name: (showForm as Profile).name,
                        title: (showForm as Profile).title,
                        bio: (showForm as Profile).bio,
                        headline: (showForm as Profile).headline,
                        email: (showForm as Profile).email,
                        phone: (showForm as Profile).phone,
                        github: (showForm as Profile).github,
                        linkedin: (showForm as Profile).linkedin,
                        memojiSeed: (showForm as Profile).memojiSeed,
                        memojiPosture: (showForm as Profile).memojiPosture,
                        catalogId: undefined,
                        technologies: (showForm as Profile).technologies,
                      }
                }
                submitLabel={showForm === "create" ? "Crear" : "Guardar"}
                onCancel={() => { playBack(); setShowForm(null); }}
                onSubmit={(vals: { name: string; title: string; bio: string; headline: string; email: string; phone: string; github: string; linkedin: string; memojiSeed: string; memojiPosture: string; catalogId: string; avatarConfig?: AvatarConfig; technologies: string[] }) => {
                  const now = new Date().toISOString();
                  if (showForm === "create") {
                    const p: Profile = {
                      id: `user-${Date.now()}`,
                      name: vals.name,
                      title: vals.title,
                      subtitle: vals.headline,
                      avatar: vals.catalogId,
                      memojiSeed: vals.memojiSeed,
                      memojiPosture: vals.memojiPosture,
                      avatarConfig: vals.avatarConfig,
                      bio: vals.bio,
                      headline: vals.headline,
                      email: vals.email,
                      phone: vals.phone,
                      github: vals.github,
                      linkedin: vals.linkedin,
                      technologies: vals.technologies,
                      createdAt: now,
                      updatedAt: now,
                    };
                    playSelect();
                    createUser(p);
                  } else {
                    const prof = showForm as Profile;
                    playSelect();
                    updateUser(prof.id, {
                      name: vals.name,
                      title: vals.title,
                      subtitle: vals.headline,
                      memojiSeed: vals.memojiSeed,
                      memojiPosture: vals.memojiPosture,
                      avatarConfig: vals.avatarConfig,
                      bio: vals.bio,
                      headline: vals.headline,
                      email: vals.email,
                      phone: vals.phone,
                      github: vals.github,
                      linkedin: vals.linkedin,
                      technologies: vals.technologies,
                    });
                  }
                  setShowForm(null);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
