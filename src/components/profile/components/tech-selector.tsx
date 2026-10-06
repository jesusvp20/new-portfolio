"use client";

import { useState, useMemo } from "react";
import { TECH_CATALOG, techIconUrl } from "@/lib/tech-icons";

export function TechSelector({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    if (!q.trim()) return TECH_CATALOG.slice(0, 8);
    const low = q.toLowerCase();
    return TECH_CATALOG.filter((t) => t.label.toLowerCase().includes(low) || t.id.includes(low)).slice(0, 8);
  }, [q]);

  const add = (label: string) => {
    if (value.includes(label)) return;
    onChange([...value, label]);
    setQ("");
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1.5">
        {value.map((t) => {
          const entry = TECH_CATALOG.find((c) => c.label === t);
          return (
            <span key={t} className="inline-flex items-center gap-1.5 rounded-full bg-white text-black px-2.5 py-1 text-xs font-medium">
              {entry && <img src={techIconUrl(entry.devicon)} alt={t} className="h-4 w-4 object-contain" />}
              {t}
              <button type="button" onClick={() => onChange(value.filter((x) => x !== t))} className="ml-1 text-black/50 hover:text-black cursor-pointer">×</button>
            </span>
          );
        })}
      </div>
      <div className="relative">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Añadir tecnología — ej: React, PostgreSQL, Docker" className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5 text-sm text-white placeholder-white/30 focus:border-[var(--ps-blue)] focus:outline-none" />
        {q.trim() && (
          <div className="absolute z-10 mt-1 w-full rounded-xl border border-white/10 bg-[#1a1a1a] shadow-xl max-h-48 overflow-auto">
            {filtered.map((t) => (
              <button key={t.id} type="button" onClick={() => add(t.label)} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-white hover:bg-white/10 cursor-pointer text-left">
                <img src={techIconUrl(t.devicon)} alt={t.label} className="h-5 w-5 object-contain bg-white rounded-full p-0.5" />
                {t.label}
              </button>
            ))}
            {filtered.length === 0 && <div className="px-3 py-2 text-xs text-white/40">Sin resultados — presiona Enter para añadir &quot;{q}&quot;</div>}
          </div>
        )}
      </div>
      <p className="text-[11px] text-white/30">Busca en el catálogo externo (Devicon CDN) — añade con click o Enter</p>
    </div>
  );
}
