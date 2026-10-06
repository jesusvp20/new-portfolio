"use client";

import { useState, useCallback } from "react";
import Image from "next/image";

export function CoverDrop({ value, onChange, label = "Cover" }: { value: string; onChange: (url: string) => void; label?: string }) {
  const [drag, setDrag] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return alert("Solo imágenes");
      if (file.size > 5 * 1024 * 1024) return alert("Máx 5MB");
      const reader = new FileReader();
      reader.onload = () => onChange(reader.result as string);
      reader.readAsDataURL(file);
    },
    [onChange]
  );

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs text-white/60">{label}</span>
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        className={`relative flex h-[160px] w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition ${drag ? "border-[var(--ps-blue)] bg-[var(--ps-blue-soft)]" : "border-white/15 bg-white/[0.03] hover:border-white/25"}`}
      >
        {value && value.startsWith("data:") || value.startsWith("/") || value.startsWith("http") ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="cover" className="h-full w-full object-cover" />
        ) : (
          <span className="text-xs text-white/40 text-center px-4">Arrastra imagen aquí o selecciona<br /><span className="text-[11px] text-white/30">PNG/JPG/WebP ≤5MB</span></span>
        )}
        <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} className="absolute inset-0 cursor-pointer opacity-0" />
      </div>
      {value && <button type="button" onClick={() => onChange("")} className="self-start text-xs text-white/40 hover:text-white cursor-pointer">Quitar imagen</button>}
    </div>
  );
}
