"use client";

import { AvatarFromConfig, OPTIONS, BACKGROUNDS } from "dapvatar";
import type { AvatarConfig } from "dapvatar";

const FACE_SHAPES = OPTIONS.faceShape;
const SKIN_TONES = OPTIONS.skinTone;
const HAIR_STYLES = OPTIONS.hair;
const HAIR_COLORS = OPTIONS.hairColor;
const EYES = OPTIONS.eyes;
const EYEBROWS = OPTIONS.eyebrows;
const NOSES = OPTIONS.nose;
const MOUTHS = OPTIONS.mouth;
const ACCESSORIES = OPTIONS.accessory;
const BACKGROUND_OPTIONS = OPTIONS.background;

const HAIR_COLOR_HEX: Record<string, string> = {
  black: "#1a1a1a",
  brown: "#4a3728",
  blonde: "#d4a843",
  ginger: "#c45a2d",
  gray: "#9a9a9a",
};

const SKIN_TONE_HEX: Record<string, string> = {
  light: "#f2c9b6",
  peach: "#ffd9b2",
  tan: "#e6b48f",
  brown: "#c68e5e",
  dark: "#8d5524",
  deep: "#5c3a1e",
};

const FACE_SHAPE_HEX: Record<string, string> = {
  round: "#f2c9b6",
  oval: "#ffd9b2",
  softSquare: "#e6b48f",
};

const HAIR_STYLE_HEX: Record<string, string> = {
  buzz: "#1a1a1a",
  fade: "#2a2a2a",
  curly: "#3a2a1a",
  afro: "#1a1a1a",
  bob: "#4a3728",
  long: "#4a3728",
  bald: "#f2c9b6",
};

const EYES_HEX: Record<string, string> = {
  default: "#1a1a1a",
  soft: "#2a2a2a",
  almond: "#1a1a1a",
  happy: "#1a1a1a",
};

const EYEBROWS_HEX: Record<string, string> = {
  calm: "#1a1a1a",
  raised: "#1a1a1a",
  thick: "#1a1a1a",
  thin: "#1a1a1a",
};

const NOSES_HEX: Record<string, string> = {
  small: "#e6b48f",
  medium: "#e6b48f",
  broad: "#e6b48f",
};

const MOUTHS_HEX: Record<string, string> = {
  smile: "#e11d48",
  softSmile: "#e11d48",
  neutral: "#e11d48",
  grin: "#e11d48",
};

const ACCESSORIES_HEX: Record<string, string> = {
  none: "transparent",
  glasses: "#1a1a1a",
  roundGlasses: "#1a1a1a",
  sunglasses: "#1a1a1a",
};

const BACKGROUNDS_HEX: Record<string, string> = {
  gradient: "#4f46e5",
  solid: "#6d28d9",
  blob: "#059669",
  transparent: "transparent",
};

const POSTURES = ["happy", "laughing", "winking", "thinking", "party", "heart-eye", "star-eye", "shocked"] as const;

export function MemojiCustomizer({
  config,
  onChange,
  posture,
  onPostureChange,
}: {
  config: AvatarConfig;
  onChange: (c: AvatarConfig) => void;
  posture: string;
  onPostureChange: (p: string) => void;
}) {
  const update = <K extends keyof AvatarConfig>(key: K, value: AvatarConfig[K]) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center gap-2">
        <div className="h-[96px] w-[96px] overflow-hidden rounded-full bg-black ring-2 ring-white/10">
          <AvatarFromConfig config={config} size={96} title="preview" className="h-full w-full" />
        </div>
        <p className="text-xs text-white/40">Vista previa</p>
      </div>

      <div className="h-px bg-white/5" />

      <div className="flex flex-col gap-2">
        <p className="text-[11px] tracking-[0.12em] text-white/35 text-center">FORMA DE CARA</p>
        <div className="flex gap-1.5 justify-center">
          {FACE_SHAPES.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => update("faceShape", f)}
              className={`rounded-full px-2.5 py-1 text-xs cursor-pointer transition ${config.faceShape === f ? "bg-[var(--ps-blue)] text-white shadow-[0_0_8px_var(--ps-blue-glow)]" : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-[11px] tracking-[0.12em] text-white/35 text-center">TONO DE PIEL</p>
        <div className="flex gap-1.5 justify-center">
          {SKIN_TONES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => update("skinTone", s)}
              className={`h-7 w-7 rounded-full cursor-pointer transition ${config.skinTone === s ? "ring-2 ring-[var(--ps-blue)] ring-offset-2 ring-offset-black scale-110" : "ring-1 ring-white/20 hover:scale-105"}`}
              style={{ backgroundColor: SKIN_TONE_HEX[s] }}
              title={s}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-[11px] tracking-[0.12em] text-white/35 text-center">PELO</p>
        <div className="flex gap-1.5 justify-center">
          {HAIR_STYLES.map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => update("hair", h)}
              className={`rounded-full px-2.5 py-1 text-xs cursor-pointer transition ${config.hair === h ? "bg-[var(--ps-blue)] text-white shadow-[0_0_8px_var(--ps-blue-glow)]" : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"}`}
            >
              {h}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-[11px] tracking-[0.12em] text-white/35 text-center">COLOR DE PELO</p>
        <div className="flex gap-1.5 justify-center">
          {HAIR_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => update("hairColor", c)}
              className={`h-7 w-7 rounded-full cursor-pointer transition ${config.hairColor === c ? "ring-2 ring-[var(--ps-blue)] ring-offset-2 ring-offset-black scale-110" : "ring-1 ring-white/20 hover:scale-105"}`}
              style={{ backgroundColor: HAIR_COLOR_HEX[c] }}
              title={c}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-[11px] tracking-[0.12em] text-white/35 text-center">OJOS</p>
        <div className="flex gap-1.5 justify-center">
          {EYES.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => update("eyes", e)}
              className={`rounded-full px-2.5 py-1 text-xs cursor-pointer transition ${config.eyes === e ? "bg-[var(--ps-blue)] text-white shadow-[0_0_8px_var(--ps-blue-glow)]" : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"}`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-[11px] tracking-[0.12em] text-white/35 text-center">CEJAS</p>
        <div className="flex gap-1.5 justify-center">
          {EYEBROWS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => update("eyebrows", e)}
              className={`rounded-full px-2.5 py-1 text-xs cursor-pointer transition ${config.eyebrows === e ? "bg-[var(--ps-blue)] text-white shadow-[0_0_8px_var(--ps-blue-glow)]" : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"}`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-[11px] tracking-[0.12em] text-white/35 text-center">NARIZ</p>
        <div className="flex gap-1.5 justify-center">
          {NOSES.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => update("nose", n)}
              className={`rounded-full px-2.5 py-1 text-xs cursor-pointer transition ${config.nose === n ? "bg-[var(--ps-blue)] text-white shadow-[0_0_8px_var(--ps-blue-glow)]" : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"}`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-[11px] tracking-[0.12em] text-white/35 text-center">BOCA</p>
        <div className="flex gap-1.5 justify-center">
          {MOUTHS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => update("mouth", m)}
              className={`rounded-full px-2.5 py-1 text-xs cursor-pointer transition ${config.mouth === m ? "bg-[var(--ps-blue)] text-white shadow-[0_0_8px_var(--ps-blue-glow)]" : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"}`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-[11px] tracking-[0.12em] text-white/35 text-center">ACCESORIO</p>
        <div className="flex gap-1.5 justify-center">
          {ACCESSORIES.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => update("accessory", a)}
              className={`rounded-full px-2.5 py-1 text-xs cursor-pointer transition ${config.accessory === a ? "bg-[var(--ps-blue)] text-white shadow-[0_0_8px_var(--ps-blue-glow)]" : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"}`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-[11px] tracking-[0.12em] text-white/35 text-center">FONDO</p>
        <div className="flex gap-1.5 justify-center">
          {BACKGROUND_OPTIONS.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => update("background", b)}
              className={`rounded-full px-2.5 py-1 text-xs cursor-pointer transition ${config.background === b ? "bg-[var(--ps-blue)] text-white shadow-[0_0_8px_var(--ps-blue-glow)]" : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"}`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-white/5" />

      <div className="flex flex-col gap-2">
        <p className="text-[11px] tracking-[0.12em] text-white/35 text-center">EXPRESIÓN</p>
        <div className="flex flex-wrap gap-1.5 justify-center">
          {POSTURES.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPostureChange(p)}
              className={`rounded-full px-2.5 py-1 text-xs cursor-pointer transition ${posture === p ? "bg-[var(--ps-blue)] text-white shadow-[0_0_8px_var(--ps-blue-glow)]" : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
