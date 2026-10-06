"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaPlus } from "react-icons/fa";
import type { Project } from "@/types";
import { useSystemAudio } from "@/hooks/use-system-audio";

function CoverPreview({ p, isFocused }: { p: Project; isFocused: boolean }) {
  if (p.coverType === "color" && p.coverValue) {
    return <div className="h-[112px] w-full" style={{ background: p.coverValue }} />;
  }
  if (p.coverType === "gradient" && p.coverValue) {
    return <div className="h-[112px] w-full" style={{ background: p.coverValue }} />;
  }
  // image
  return (
    <div className="relative h-[112px] w-full overflow-hidden">
      <Image src={p.cover} alt={p.title} fill className="object-cover" unoptimized={p.cover.startsWith("data:")} />
      <span className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold ${isFocused ? "bg-[var(--ps-blue)] text-white" : "bg-black/60 text-white/80"}`}>{p.role || "Proyecto"}</span>
    </div>
  );
}

export function ProjectCarousel({
  projects,
  onSelect,
  onAdd,
  onFocusedChange,
}: {
  projects: Project[];
  onSelect: (p: Project) => void;
  onAdd: () => void;
  onFocusedChange?: (p: Project | null) => void;
}) {
  const [focused, setFocused] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const { playHover, playSelect } = useSystemAudio();

  const total = projects.length + 1;
  const focusedProject = focused === 0 ? null : projects[focused - 1];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const child = el.children[focused] as HTMLElement | undefined;
    child?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    onFocusedChange?.(focusedProject ?? null);
  }, [focused, focusedProject, onFocusedChange]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") { e.preventDefault(); setFocused((i) => Math.min(total - 1, i + 1)); playHover(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); setFocused((i) => Math.max(0, i - 1)); playHover(); }
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); playSelect(); if (focused === 0) onAdd(); else if (focusedProject) onSelect(focusedProject); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focused, total, focusedProject, onSelect, onAdd, playHover, playSelect]);

  return (
    <div className="w-full">
      <div ref={ref} className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-6 pt-2 px-2 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
        <motion.button
          layoutId="new-project-tile"
          type="button"
          onClick={onAdd}
          onFocus={() => setFocused(0)}
          onMouseEnter={() => { setFocused(0); playHover(); }}
          whileHover={{ y: -2, scale: focused === 0 ? 1.03 : 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          className={`snap-center shrink-0 w-[280px] h-[168px] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer will-change-transform ${focused === 0 ? "border-[var(--ps-red)] bg-[var(--ps-red-soft)] shadow-[0_8px_28px_var(--ps-red-glow)]" : "border-white/15 bg-white/[0.03] hover:bg-white/[0.05] hover:border-white/20"}`}
          style={{ transform: focused === 0 ? "scale(1.03)" : "scale(1)" }}
        >
          <motion.span animate={{ scale: focused === 0 ? 1.08 : 1, rotate: focused === 0 ? 90 : 0 }} transition={{ type: "spring", stiffness: 400, damping: 18 }} className={`h-10 w-10 rounded-full flex items-center justify-center ${focused === 0 ? "bg-[var(--ps-red)] text-white" : "bg-white/10 text-white/70"}`}><FaPlus /></motion.span>
          <span className="text-sm font-medium text-white">Nuevo proyecto</span>
          <span className="text-xs text-white/40">Añadir</span>
        </motion.button>

        {projects.map((p, idx) => {
          const i = idx + 1;
          const isFocused = focused === i;
          return (
            <motion.button
              key={p.id}
              layoutId={`project-${p.id}`}
              type="button"
              onClick={() => { if (isFocused) { playSelect(); onSelect(p); } else { setFocused(i); playHover(); } }}
              onFocus={() => setFocused(i)}
              onMouseEnter={() => { setFocused(i); playHover(); }}
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: isFocused ? 1 : 0.82, y: 0, scale: isFocused ? 1.04 : 1 }}
              transition={{ type: "spring", stiffness: 420, damping: 30, delay: idx * 0.03 }}
              whileHover={{ y: -2, scale: isFocused ? 1.05 : 1.02 }}
              whileTap={{ scale: 0.97 }}
              className={`snap-center shrink-0 text-left w-[280px] overflow-hidden rounded-2xl border backdrop-blur cursor-pointer will-change-transform ${isFocused ? "border-white bg-white ring-2 ring-[var(--ps-blue)] ring-offset-2 ring-offset-black shadow-[0_12px_32px_rgba(0,0,0,0.45)]" : "border-white/10 bg-white/[0.04] hover:bg-white/[0.06] hover:border-white/15"}`}
            >
              <motion.div layout className="overflow-hidden" transition={{ duration: 0.32, ease: [0.23, 1, 0.32, 1] as never }}>
                <CoverPreview p={p} isFocused={isFocused} />
              </motion.div>
              {(p.coverType === "color" || p.coverType === "gradient") && (
                <span className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold ${isFocused ? "bg-[var(--ps-blue)] text-white" : "bg-black/60 text-white/80"}`}>{p.role || "Proyecto"}</span>
              )}
              <div className={`p-3 transition-colors duration-200 ${isFocused ? "bg-white" : "bg-transparent"}`}>
                <p className={`truncate text-sm font-semibold transition-colors duration-200 ${isFocused ? "text-black" : "text-white"}`}>{p.title}</p>
                <p className={`truncate text-xs transition-colors duration-200 ${isFocused ? "text-black/60" : "text-white/45"}`}>{p.summary || p.tech.join(" · ")}</p>
              </div>
            </motion.button>
          );
        })}
      </div>


    </div>
  );
}
