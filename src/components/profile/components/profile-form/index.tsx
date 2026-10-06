"use client";

import { useState } from "react";
import { MemojiAvatar, MEMOJI_CATALOG, AvatarFromConfig } from "dapvatar";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { TechSelector } from "@/components/profile/components/tech-selector";
import { MemojiCustomizer } from "@/components/profile/components/memoji-customizer";
import type { AvatarConfig } from "@/types/profile";

type ProfileFormValues = {
  name: string;
  title: string;
  bio: string;
  headline: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  memojiSeed: string;
  memojiPosture: string;
  catalogId: string;
  avatarConfig: AvatarConfig;
  technologies: string[];
};

const DEFAULT_AVATAR_CONFIG: AvatarConfig = {
  faceShape: "round",
  skinTone: "peach",
  hair: "bob",
  hairColor: "brown",
  eyes: "default",
  eyebrows: "calm",
  nose: "medium",
  mouth: "smile",
  accessory: "none",
  background: "gradient",
};

const POSTURES = ["happy", "laughing", "winking", "thinking", "party", "heart-eye", "star-eye", "shocked"] as const;

function useMemojiCatalog() {
  const seen = new Set<string>();
  const uniq: (typeof MEMOJI_CATALOG)[number][] = [];
  for (const e of MEMOJI_CATALOG) if (!seen.has(e.name)) { seen.add(e.name); (uniq as unknown as typeof e[]).push(e); }
  const females = uniq.filter((e) => e.genderPresentation === "female");
  const males = uniq.filter((e) => e.genderPresentation === "male");
  const mixed: typeof uniq = [];
  const max = Math.max(females.length, males.length);
  for (let i = 0; i < max; i++) { if (females[i]) (mixed as unknown as typeof females[number][]).push(females[i]!); if (males[i]) (mixed as unknown as typeof males[number][]).push(males[i]!); }
  return mixed;
}

export function ProfileForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel = "Guardar",
}: {
  initial: Partial<ProfileFormValues>;
  onSubmit: (v: ProfileFormValues) => void;
  onCancel: () => void;
  submitLabel?: string;
}) {
  const catalog = useMemojiCatalog();
  const [values, setValues] = useState<ProfileFormValues>({
    name: initial.name ?? "",
    title: initial.title ?? "",
    bio: initial.bio ?? "",
    headline: initial.headline ?? "",
    email: initial.email ?? "",
    phone: initial.phone ?? "",
    github: initial.github ?? "",
    linkedin: initial.linkedin ?? "",
    memojiSeed: initial.memojiSeed ?? "",
    memojiPosture: initial.memojiPosture ?? "happy",
    catalogId: initial.catalogId ?? catalog[0]?.id ?? "",
    avatarConfig: initial.avatarConfig ?? DEFAULT_AVATAR_CONFIG!,

    technologies: initial.technologies ?? [],
  });
  const [gender, setGender] = useState<"all" | "female" | "male">("all");
  const [activeTab, setActiveTab] = useState<"catalog" | "custom">("custom");
  const filteredCatalog = (() => {
    if (gender === "all") return catalog;
    return catalog.filter((c) => c.genderPresentation === gender);
  })();
  const selected = catalog.find((c) => c.id === values.catalogId) ?? catalog[0];
  const seedPreview = values.name.trim() ? `${values.name} ${selected.name}` : selected.name;

  const emailValid = !values.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email);
  const valid = values.name.trim().length >= 2 && values.title.trim().length >= 2 && values.bio.trim().length >= 10 && values.headline.trim().length >= 5 && emailValid && values.technologies.length > 0;

  return (
    <div className="flex flex-col md:flex-row gap-0 overflow-hidden rounded-[24px] border border-white/10 bg-[#0f0f0f] max-w-[1120px] w-[min(1120px,96vw)] max-h-[86vh] md:h-[700px]">
      {/* Left picker — ordenado, centrado y simétrico */}
      <div className="flex-1 bg-[#0a0a0a] p-8 flex flex-col min-h-0 overflow-hidden">
        <p className="text-[11px] tracking-[0.18em] text-white/35 flex items-center justify-center gap-2 shrink-0 text-center pb-4"><span className="h-1.5 w-1.5 rounded-full bg-[var(--ps-blue)]" /> PERFIL</p>

        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto gap-5 px-1">
          {/* 1 · Preview */}
          <div className="flex flex-col items-center gap-1 py-2 shrink-0">
            <div className="h-[96px] w-[96px] overflow-hidden rounded-full bg-black ring-2 ring-white/10">
              {activeTab === "custom" ? (
                <AvatarFromConfig config={values.avatarConfig} size={96} className="h-full w-full" />
              ) : (
                <MemojiAvatar seed={seedPreview} posture={values.memojiPosture as never} size={96} shape="circle" alt="preview" className="h-full w-full object-cover" />
              )}
            </div>
            <p className="mt-2 text-sm font-medium text-white text-center leading-none">{values.name || "Nombre"}</p>
            <p className="text-xs text-white/40 text-center leading-none">{values.title || "Título"}</p>
          </div>

          <div className="h-px bg-white/5 shrink-0" />

          {/* 2 · Tabs */}
          <div className="flex flex-col gap-2 shrink-0">
            <div className="flex gap-1.5 w-full max-w-[280px] mx-auto justify-center">
              <button type="button" onClick={() => setActiveTab("custom")} className={`flex-1 rounded-full px-2.5 py-1.5 text-xs font-medium cursor-pointer transition text-center ${activeTab === "custom" ? "bg-[var(--ps-blue)] text-white shadow-[0_0_8px_var(--ps-blue-glow)]" : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"}`}>
                Personalizar
              </button>
              <button type="button" onClick={() => setActiveTab("catalog")} className={`flex-1 rounded-full px-2.5 py-1.5 text-xs font-medium cursor-pointer transition text-center ${activeTab === "catalog" ? "bg-[var(--ps-blue)] text-white shadow-[0_0_8px_var(--ps-blue-glow)]" : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"}`}>
                Catálogo
              </button>
            </div>
          </div>

          {/* 3 · Content */}
          {activeTab === "custom" ? (
            <MemojiCustomizer
              config={values.avatarConfig}
              onChange={(c) => setValues((v) => ({ ...v, avatarConfig: c }))}
              posture={values.memojiPosture}
              onPostureChange={(p) => setValues((v) => ({ ...v, memojiPosture: p }))}
            />
          ) : (
            <>
              <div className="flex flex-col gap-2 shrink-0">
                <p className="text-[11px] tracking-[0.12em] text-white/35 text-center">GÉNERO</p>
                <div className="flex gap-1.5 w-full max-w-[280px] mx-auto justify-center">
                  {(["all", "female", "male"] as const).map((g) => (
                    <button key={g} type="button" onClick={() => setGender(g)} className={`flex-1 rounded-full px-2.5 py-1.5 text-xs font-medium cursor-pointer transition text-center ${gender === g ? "bg-[var(--ps-blue)] text-white shadow-[0_0_8px_var(--ps-blue-glow)]" : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"}`}>
                      {g === "all" ? "Todos" : g === "female" ? "Femenino" : "Masculino"} {g !== "all" && `· ${catalog.filter((c) => c.genderPresentation === g).length}`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2 shrink-0">
                <p className="text-[11px] tracking-[0.12em] text-white/35 text-center">AVATAR · {filteredCatalog.length}</p>
                <div className="grid grid-cols-6 gap-2 place-items-center justify-center w-fit mx-auto p-1">
                  {filteredCatalog.slice(0, 36).map((e) => (
                    <button key={e.id} type="button" onClick={() => setValues((v) => ({ ...v, catalogId: e.id, memojiSeed: seedPreview }))} className={`rounded-full p-[2px] cursor-pointer shrink-0 transition ${e.id === values.catalogId ? "bg-[var(--ps-blue)] shadow-[0_0_8px_var(--ps-blue-glow)] scale-[1.04]" : "bg-white/10 hover:bg-white/15"}`}>
                      <div className="overflow-hidden rounded-full bg-black"><MemojiAvatar seed={e.name} posture="happy" size={44} shape="circle" alt={e.name} className="h-10 w-10 object-cover" /></div>
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-white/25 text-center">{gender === "all" ? "todos los géneros" : gender} · elige uno</p>
              </div>

              <div className="h-px bg-white/5 shrink-0" />

              <div className="flex flex-col gap-2 shrink-0">
                <p className="text-[11px] tracking-[0.12em] text-white/35 text-center">EXPRESIÓN</p>
                <div className="flex flex-wrap gap-1.5 justify-center max-w-[300px] mx-auto">
                  {POSTURES.map((p) => (
                    <button key={p} type="button" onClick={() => setValues((v) => ({ ...v, memojiPosture: p }))} className={`rounded-full px-2.5 py-1 text-xs cursor-pointer transition ${values.memojiPosture === p ? "bg-[var(--ps-blue)] text-white shadow-[0_0_8px_var(--ps-blue-glow)]" : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"}`}>{p}</button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <p className="pt-4 pb-1 text-[11px] tracking-[0.12em] text-white/25 text-center shrink-0 border-t border-white/5 mt-4">Elige avatar y expresión</p>
      </div>

      {/* Right form — espejo exacto: misma altura, centrado interno, scroll independiente */}
      <div className="flex-1 p-8 flex flex-col gap-4 bg-[#101010] overflow-y-auto min-h-0">
        <div className="grid grid-cols-2 gap-3 items-start">
          <label className="col-span-2 md:col-span-1 flex flex-col gap-1 text-xs text-white/60"><span className="flex items-baseline gap-1.5 h-[16px]">Nombre* <span className="text-[10px] text-white/30">mín. 2</span></span><input value={values.name} onChange={(e) => setValues({ ...values, name: e.target.value })} placeholder="Ej: Ana Torres" className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5 text-sm text-white placeholder-white/30 focus:border-[var(--ps-blue)] focus:outline-none" /></label>
          <label className="col-span-2 md:col-span-1 flex flex-col gap-1 text-xs text-white/60"><span className="flex items-baseline gap-1.5 h-[16px]">Título profesional* <span className="text-[10px] text-transparent select-none">mín. 2</span></span><input value={values.title} onChange={(e) => setValues({ ...values, title: e.target.value })} placeholder="Ej: Frontend Developer · UX" className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5 text-sm text-white placeholder-white/30 focus:border-[var(--ps-blue)] focus:outline-none" /></label>
        </div>
        <label className="flex flex-col gap-1 text-xs text-white/60">Quién soy* <span className="text-[10px] text-white/30">breve, 10-220</span><textarea value={values.bio} onChange={(e) => setValues({ ...values, bio: e.target.value.slice(0, 220) })} rows={2} placeholder="Ej: Desarrolladora enfocada en productos rápidos, accesibles y con estética PS5. 3 años creando portfolios." className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5 text-sm text-white placeholder-white/30 focus:border-[var(--ps-blue)] focus:outline-none resize-none" /><span className="text-[11px] text-white/30 text-right">{values.bio.length}/220</span></label>
        <label className="flex flex-col gap-1 text-xs text-white/60">Headline profesional* <span className="text-[10px] text-white/30">5-80</span><input value={values.headline} onChange={(e) => setValues({ ...values, headline: e.target.value.slice(0, 80) })} placeholder="Ej: Construyo experiencias web rápidas y memorables" className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5 text-sm text-white placeholder-white/30 focus:border-[var(--ps-blue)] focus:outline-none" /></label>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1 text-xs text-white/60">Correo {values.email && !emailValid && <span className="text-[10px] text-[var(--ps-red)]">inválido</span>}<input value={values.email} onChange={(e) => setValues({ ...values, email: e.target.value })} placeholder="Ej: ana@portafolio.dev" className={`rounded-xl border px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none ${!emailValid ? "border-[var(--ps-red)] bg-[var(--ps-red-soft)]" : "border-white/10 bg-white/[0.06] focus:border-[var(--ps-blue)]"}`} /></label>
          <label className="flex flex-col gap-1 text-xs text-white/60">Teléfono<input value={values.phone} onChange={(e) => setValues({ ...values, phone: e.target.value })} placeholder="Ej: +57 300 123 4567" className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5 text-sm text-white placeholder-white/30 focus:border-[var(--ps-blue)] focus:outline-none" /></label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1 text-xs text-white/60"><span className="flex items-center gap-1"><FaGithub /> GitHub</span><input value={values.github} onChange={(e) => setValues({ ...values, github: e.target.value })} placeholder="Ej: https://github.com/anatorres" className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5 text-sm text-white placeholder-white/30 focus:border-[var(--ps-blue)] focus:outline-none" /></label>
          <label className="flex flex-col gap-1 text-xs text-white/60"><span className="flex items-center gap-1"><FaLinkedin /> LinkedIn</span><input value={values.linkedin} onChange={(e) => setValues({ ...values, linkedin: e.target.value })} placeholder="Ej: https://linkedin.com/in/anatorres" className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5 text-sm text-white placeholder-white/30 focus:border-[var(--ps-blue)] focus:outline-none" /></label>
        </div>
        <div className="flex flex-col gap-1 text-xs text-white/60">Tecnologías* <span className="text-[10px] text-white/30">elige al menos 1 — logos vía Devicon CDN</span>
          <TechSelector value={values.technologies} onChange={(techs) => setValues((v) => ({ ...v, technologies: techs }))} />
        </div>

        <div className="mt-auto flex gap-3 pt-4 shrink-0">
          <button type="button" onClick={onCancel} className="flex-1 rounded-full border border-white/10 bg-white/5 py-2.5 text-sm text-white/70 hover:bg-white/10 cursor-pointer">Cancelar</button>
          <button type="button" disabled={!valid} onClick={() => onSubmit(activeTab === "custom" ? { ...values, memojiSeed: "" } : { ...values, memojiSeed: seedPreview })} className="flex-1 rounded-full bg-[var(--ps-blue)] py-2.5 text-sm font-semibold text-white disabled:opacity-40 cursor-pointer shadow-[0_8px_20px_var(--ps-blue-glow)]">{submitLabel}</button>
        </div>
      </div>
    </div>
  );
}
