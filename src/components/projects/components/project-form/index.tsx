"use client";

import { useState } from "react";
import { TechSelector } from "@/components/profile/components/tech-selector";
import { CoverDrop } from "@/components/projects/components/cover-drop";
import type { CoverType } from "@/types";

type Values = {
  title: string;
  summary: string;
  description: string;
  role: string;
  cover: string;
  coverType: CoverType;
  coverValue: string;
  gallery: string;
  tech: string;
  githubUrl: string;
  demoUrl: string;
};

const GRADIENTS = [
  "linear-gradient(135deg, #0070D1 0%, #000000 100%)",
  "linear-gradient(135deg, #E30613 0%, #0070D1 100%)",
  "linear-gradient(135deg, #7c3aed 0%, #000000 100%)",
];

export function ProjectForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel = "Guardar",
}: {
  initial: Partial<Values>;
  onSubmit: (v: { title: string; summary: string; description: string; role: string; cover: string; coverType: CoverType; coverValue: string; gallery: string[]; tech: string[]; githubUrl: string; demoUrl: string }) => void;
  onCancel: () => void;
  submitLabel?: string;
}) {
  const [techs, setTechs] = useState<string[]>(() => (initial.tech ? initial.tech.split(",").map((s) => s.trim()).filter(Boolean) : []));
  const [gallery, setGallery] = useState<string>(initial.gallery ?? "");
  const [coverType, setCoverType] = useState<CoverType>((initial.coverType as CoverType) ?? "image");
  const [coverValue, setCoverValue] = useState(initial.coverValue ?? "#0070D1");
  const [v, setV] = useState({
    title: initial.title ?? "",
    summary: initial.summary ?? "",
    description: initial.description ?? "",
    role: initial.role ?? "",
    cover: initial.cover ?? "/projects/proyecto-1.svg",
    githubUrl: initial.githubUrl ?? "",
    demoUrl: initial.demoUrl ?? "",
  });
  const valid = v.title.trim().length >= 2 && v.description.trim().length >= 4 && techs.length > 0;

  return (
    <div className="w-full max-w-[920px] rounded-[24px] border border-white/10 bg-[#0f0f0f] p-8 max-h-[86vh] md:h-auto overflow-hidden flex flex-col">
      <div className="shrink-0">
        <h3 className="text-lg font-semibold text-white">{submitLabel === "Crear" ? "Nuevo proyecto" : "Editar proyecto"}</h3>
        <p className="text-xs text-white/40 mt-1">Organizado en columnas — más orden, sin estirar</p>
      </div>

      <div className="mt-6 flex flex-col md:flex-row gap-6 flex-1 min-h-0 overflow-hidden">
        {/* Columna izquierda */}
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1 min-h-0">
          <label className="text-xs text-white/60 flex flex-col gap-1.5">Título*<input value={v.title} onChange={(e) => setV({ ...v, title: e.target.value })} placeholder="Ej: Neon Dash — obligatorio" className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5 text-sm text-white placeholder-white/30 focus:border-[var(--ps-blue)] focus:outline-none h-[44px]" /></label>
          <label className="text-xs text-white/60 flex flex-col gap-1.5">Resumen breve* 100<input value={v.summary} onChange={(e) => setV({ ...v, summary: e.target.value.slice(0, 100) })} placeholder="Ej: Runner 60fps con haptics — obligatorio" className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5 text-sm text-white placeholder-white/30 focus:border-[var(--ps-blue)] focus:outline-none h-[44px]" /><span className="text-[11px] text-white/30 text-right">{v.summary.length}/100</span></label>
          <label className="text-xs text-white/60 flex flex-col gap-1.5">Descripción* <span className="text-[10px] text-white/30">qué hace, por qué importa</span><textarea value={v.description} onChange={(e) => setV({ ...v, description: e.target.value })} rows={4} placeholder="Ej: Runner futurista que demuestra física PS5 y shaders de onda..." className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5 text-sm text-white placeholder-white/30 focus:border-[var(--ps-blue)] focus:outline-none resize-none min-h-[96px]" /></label>
          <label className="text-xs text-white/60 flex flex-col gap-1.5">Rol*<input value={v.role} onChange={(e) => setV({ ...v, role: e.target.value })} placeholder="Ej: Full-Stack — obligatorio" className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5 text-sm text-white placeholder-white/30 focus:border-[var(--ps-blue)] focus:outline-none h-[44px]" /></label>
          <div className="text-xs text-white/60 flex flex-col gap-1.5">Tecnologías* <span className="text-[10px] text-white/30">logos vía Devicon API externa</span>
            <TechSelector value={techs} onChange={setTechs} />
          </div>
        </div>

        {/* Columna derecha */}
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1 min-h-0">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 flex flex-col gap-3">
            <p className="text-xs font-medium text-white">Cover del proyecto* — personaliza</p>
            <div className="flex gap-2">
              {(["image", "color", "gradient"] as const).map((t) => (
                <button key={t} type="button" onClick={() => setCoverType(t)} className={`flex-1 rounded-full px-3 py-2 text-xs font-medium cursor-pointer ${coverType === t ? "bg-[var(--ps-blue)] text-white" : "bg-white/5 border border-white/10 text-white/60"}`}>
                  {t === "image" ? "Imagen" : t === "color" ? "Color" : "Degradado"}
                </button>
              ))}
            </div>
            {coverType === "color" && (
              <div className="flex items-center gap-3">
                <input type="color" value={coverValue} onChange={(e) => setCoverValue(e.target.value)} className="h-10 w-16 rounded-xl border border-white/10 bg-transparent cursor-pointer" />
                <span className="h-10 flex-1 rounded-xl border border-white/10" style={{ background: coverValue }} />
                <span className="text-xs text-white/40">{coverValue}</span>
              </div>
            )}
            {coverType === "gradient" && (
              <div className="flex gap-2">
                {GRADIENTS.map((g) => (
                  <button key={g} type="button" onClick={() => setCoverValue(g)} className={`h-10 flex-1 rounded-xl border cursor-pointer ${coverValue === g ? "border-[var(--ps-blue)] ring-2 ring-[var(--ps-blue-glow)]" : "border-white/10"}`} style={{ background: g }} />
                ))}
              </div>
            )}
            {coverType === "image" && <CoverDrop value={v.cover} onChange={(url) => setV({ ...v, cover: url })} label="Imagen principal — drag & drop" />}
          </div>

          <CoverDrop value={gallery} onChange={setGallery} label="Añadir nueva imagen (galería opcional)" />

          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs text-white/60 flex flex-col gap-1.5">GitHub<input value={v.githubUrl} onChange={(e) => setV({ ...v, githubUrl: e.target.value })} placeholder="https://github.com/..." className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5 text-sm text-white focus:border-[var(--ps-blue)] focus:outline-none h-[44px]" /></label>
            <label className="text-xs text-white/60 flex flex-col gap-1.5">Producción<input value={v.demoUrl} onChange={(e) => setV({ ...v, demoUrl: e.target.value })} placeholder="https://..." className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5 text-sm text-white focus:border-[var(--ps-blue)] focus:outline-none h-[44px]" /></label>
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-3 shrink-0 pt-4 border-t border-white/5">
        <button type="button" onClick={onCancel} className="flex-1 rounded-full border border-white/10 bg-white/5 py-2.5 text-sm text-white/70 hover:bg-white/10 cursor-pointer">Cancelar</button>
        <button type="button" disabled={!valid} onClick={() => onSubmit({ title: v.title.trim(), summary: v.summary.trim(), description: v.description.trim(), role: v.role.trim(), cover: v.cover.trim() || "/projects/proyecto-1.svg", coverType, coverValue, gallery: gallery ? [gallery] : [], tech: techs, githubUrl: v.githubUrl.trim(), demoUrl: v.demoUrl.trim() })} className="flex-1 rounded-full bg-[var(--ps-blue)] py-2.5 text-sm font-semibold text-white disabled:opacity-40 cursor-pointer shadow-[0_8px_20px_var(--ps-blue-glow)]">{submitLabel}</button>
      </div>
    </div>
  );
}
