"use client";

import { useEffect, useRef, useState } from "react";

type Variant = "default" | "login" | "home";

export function WaveBackground({ variant = "default", coverUrl, coverType, coverValue }: { variant?: Variant; coverUrl?: string; coverType?: string; coverValue?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const mouseRef = useRef({ x: 0, y: 0 });
  const lerpMouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      mouseRef.current = { x: nx, y: ny };
      // throttle state to avoid 120Hz setState; lerp will smooth inside canvas
      setMouse({ x: nx, y: ny });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let visible = true;

    const onVis = () => {
      visible = document.visibilityState === "visible";
      if (visible && !reduceMotion) raf = requestAnimationFrame(draw);
    };
    document.addEventListener("visibilitychange", onVis);

    const isHome = variant === "home";
    const isLogin = variant === "login";
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const particleCount = isHome ? (isMobile ? 70 : 110) : isLogin ? 72 : 48;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random(),
      y: isHome ? 0.28 + Math.random() * 0.42 : 0.35 + Math.random() * 0.32,
      r: 0.5 + Math.random() * (isHome ? 3.4 : isLogin ? 2.4 : 2.2),
      a: 0.10 + Math.random() * (isHome ? 0.30 : 0.22),
      speed: 0.00006 + Math.random() * 0.00018,
      offset: Math.random() * Math.PI * 2,
      isBokeh: isHome ? Math.random() < 0.14 : isLogin ? Math.random() < 0.08 : false,
      hueShift: Math.random() < 0.22 ? 1 : 0,
    }));

    // PS5 symbols cloud — subtle watermark
    const symbolCount = isHome ? (isMobile ? 7 : 14) : isLogin ? 6 : 0;
    const symbols = Array.from({ length: symbolCount }, () => ({
      x: Math.random(),
      y: Math.random() * 0.9 + 0.05,
      s: 16 + Math.random() * 26,
      ch: ["△", "○", "×", "□"][Math.floor(Math.random() * 4)],
      speed: 0.00005 + Math.random() * 0.00007,
      offset: Math.random() * Math.PI * 2,
      a: 0.025 + Math.random() * 0.035,
      rot: (Math.random() - 0.5) * 0.6,
    }));

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 1.75);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = (t: number) => {
      if (!visible && !reduceMotion) {
        raf = requestAnimationFrame(draw);
        return;
      }
      const w = window.innerWidth;
      const h = window.innerHeight;
      // lerp mouse for smoothness (Emil: interruptible)
      lerpMouseRef.current.x += (mouseRef.current.x - lerpMouseRef.current.x) * 0.06;
      lerpMouseRef.current.y += (mouseRef.current.y - lerpMouseRef.current.y) * 0.06;
      const mx = lerpMouseRef.current.x * 20;
      const my = lerpMouseRef.current.y * 14;
      ctx.clearRect(0, 0, w, h);

      // Ambient base — more alive than before
      const cx = isHome ? w * 0.32 + mx * 0.55 : w * 0.5 + mx * 0.25;
      const cy = isHome ? h * 0.38 + my * 0.45 : h * 0.5 + my * 0.3;
      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 1.05);
      if (isHome) {
        bg.addColorStop(0, "rgba(0,112,209,0.28)");
        bg.addColorStop(0.38, "rgba(0,112,209,0.14)");
        bg.addColorStop(0.68, "rgba(0,112,209,0.05)");
        bg.addColorStop(0.9, "rgba(0,0,0,0)");
      } else if (isLogin) {
        bg.addColorStop(0, "rgba(0,112,209,0.20)");
        bg.addColorStop(0.45, "rgba(0,112,209,0.08)");
        bg.addColorStop(0.85, "rgba(0,0,0,0)");
      } else {
        bg.addColorStop(0, "rgba(0,112,209,0.11)");
        bg.addColorStop(0.85, "rgba(0,0,0,0)");
      }
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Aurora band arriba — vida extra sin costo
      if (isHome || isLogin) {
        const auroraGrad = ctx.createLinearGradient(0, 0, w, h * 0.35);
        auroraGrad.addColorStop(0, isHome ? "rgba(0,112,209,0.20)" : "rgba(0,112,209,0.11)");
        auroraGrad.addColorStop(0.5, "rgba(120,160,255,0.06)");
        auroraGrad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = auroraGrad;
        const driftAur = Math.sin(t * 0.00008) * 22;
        ctx.fillRect(driftAur, 0, w, h * (isHome ? 0.42 : 0.32));
      }

      // Blobs — 4 en home, 2 en login, con tint por cover si es color vivo
      if (isHome || isLogin) {
        const blobs = isHome
          ? [
              { x: w * 0.16, y: h * 0.24, r: Math.min(w, h) * 0.50, color: "rgba(0,112,209,0.30)" },
              { x: w * 0.84, y: h * 0.72, r: Math.min(w, h) * 0.44, color: "rgba(227,6,19,0.20)" },
              { x: w * 0.56, y: h * 0.90, r: Math.min(w, h) * 0.38, color: "rgba(255,255,255,0.12)" },
              { x: w * 0.42, y: h * 0.14, r: Math.min(w, h) * 0.32, color: "rgba(0,112,209,0.16)" },
            ]
          : [
              { x: w * 0.22, y: h * 0.28, r: Math.min(w, h) * 0.48, color: "rgba(0,112,209,0.22)" },
              { x: w * 0.78, y: h * 0.78, r: Math.min(w, h) * 0.36, color: "rgba(227,6,19,0.14)" },
            ];
        for (const b of blobs) {
          const driftX = Math.sin(t * 0.00011 + b.x * 0.001) * 30 + mx * 0.38;
          const driftY = Math.cos(t * 0.00009 + b.y * 0.001) * 20 + my * 0.28;
          const pulse = 1 + Math.sin(t * 0.00014 + b.x) * 0.045;
          const grad = ctx.createRadialGradient(b.x + driftX, b.y + driftY, 0, b.x + driftX, b.y + driftY, b.r * pulse);
          grad.addColorStop(0, b.color);
          grad.addColorStop(0.6, b.color.replace(/0\.\d+\)/, "0.02)"));
          grad.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(b.x + driftX, b.y + driftY, b.r * pulse, 0, Math.PI * 2);
          ctx.fill();
        }
        // Streak diagonal suave cada 9s — más visible
        if (isHome) {
          const streakT = (t % 9000) / 9000;
          const streakX = -w * 0.35 + streakT * w * 1.7;
          ctx.save();
          ctx.globalAlpha = 0.10 * Math.sin(streakT * Math.PI) * (0.8 + Math.sin(t * 0.0002) * 0.2);
          const streakGrad = ctx.createLinearGradient(streakX, 0, streakX + w * 0.25, h);
          streakGrad.addColorStop(0, "rgba(255,255,255,0)");
          streakGrad.addColorStop(0.5, "rgba(255,255,255,0.16)");
          streakGrad.addColorStop(1, "rgba(255,255,255,0)");
          ctx.fillStyle = streakGrad;
          ctx.beginPath();
          ctx.moveTo(streakX, 0);
          ctx.lineTo(streakX + w * 0.12, 0);
          ctx.lineTo(streakX + w * 0.32, h);
          ctx.lineTo(streakX + w * 0.20, h);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
      }

      // Fog rojo inferior
      const redGrad = ctx.createLinearGradient(0, h * (isHome ? 0.58 : 0.68), 0, h);
      redGrad.addColorStop(0, "rgba(227,6,19,0)");
      redGrad.addColorStop(1, isHome ? "rgba(227,6,19,0.16)" : isLogin ? "rgba(227,6,19,0.08)" : "rgba(227,6,19,0.06)");
      ctx.fillStyle = redGrad;
      ctx.fillRect(0, h * (isHome ? 0.58 : 0.68), w, h * 0.42);

      // Ondas con glow — más capas y suavidad
      ctx.shadowBlur = isHome ? 14 : isLogin ? 8 : 0;
      ctx.shadowColor = "rgba(0,112,209,0.30)";
      ctx.strokeStyle = isHome ? "rgba(0,112,209,0.35)" : isLogin ? "rgba(0,112,209,0.24)" : "rgba(0,112,209,0.18)";
      ctx.lineWidth = isHome ? 1.4 : 1;
      const layers = isHome ? 4 : isLogin ? 3 : 2;
      for (let layer = 0; layer < layers; layer++) {
        ctx.beginPath();
        const yBase = h * (isHome ? 0.34 + layer * 0.085 : isLogin ? 0.38 + layer * 0.07 : 0.42 + layer * 0.08);
        const amp = (isLogin ? 20 : isHome ? 30 : 18) + layer * 5;
        const freq = 0.0028 + layer * 0.0012;
        const time = t * (0.00032 + layer * 0.00009);
        for (let x = 0; x <= w; x += isMobile ? 10 : 8) {
          const y = yBase + Math.sin(x * freq + time + layer * 0.8) * amp + Math.cos(x * freq * 0.5 + time * 0.65) * amp * 0.38 + my * 0.14;
          if (x === 0) ctx.moveTo(x + mx * 0.10, y);
          else ctx.lineTo(x + mx * 0.10, y);
        }
        // fade edges
        ctx.globalAlpha = layer === 0 ? 1 : 0.85 - layer * 0.12;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
      ctx.shadowBlur = 0;

      // Spotlight que sigue mouse — sutil PS5
      if (isHome && !reduceMotion) {
        const sx = w * 0.5 + mx * 1.8;
        const sy = h * 0.5 + my * 1.2;
        const spot = ctx.createRadialGradient(sx, sy, 0, sx, sy, 520);
        spot.addColorStop(0, "rgba(255,255,255,0.07)");
        spot.addColorStop(0.5, "rgba(255,255,255,0.025)");
        spot.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = spot;
        ctx.beginPath();
        ctx.arc(sx, sy, 520, 0, Math.PI * 2);
        ctx.fill();
      }

      // Símbolos PS5 watermark
      if (symbols.length) {
        ctx.save();
        for (const s of symbols) {
          const driftX = Math.sin(t * s.speed + s.offset) * 18 + mx * 0.12;
          const driftY = Math.cos(t * s.speed * 0.8 + s.offset) * 12 + my * 0.08;
          const x = s.x * w + driftX;
          const y = s.y * h + driftY;
          const rot = s.rot + Math.sin(t * 0.00006 + s.offset) * 0.22;
          ctx.globalAlpha = s.a * (0.85 + Math.sin(t * 0.00018 + s.offset) * 0.15);
          ctx.translate(x, y);
          ctx.rotate(rot);
          ctx.font = `300 ${s.s}px system-ui, sans-serif`;
          ctx.fillStyle = "rgba(255,255,255,0.95)";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          // halo muy sutil
          ctx.shadowBlur = 8;
          ctx.shadowColor = "rgba(0,112,209,0.18)";
          ctx.fillText(s.ch, 0, 0);
          ctx.shadowBlur = 0;
          ctx.rotate(-rot);
          ctx.translate(-x, -y);
        }
        ctx.restore();
      }

      for (const p of particles) {
        const drift = Math.sin(t * p.speed + p.offset) * (isHome ? 28 : 18) + mx * 0.18;
        const yDrift = Math.cos(t * p.speed * 0.7 + p.offset) * (isHome ? 18 : 10) + my * 0.12;
        const x = p.x * w + drift;
        const y = p.y * h + yDrift;
        if (p.isBokeh) {
          ctx.save();
          ctx.globalAlpha = p.a * 0.85;
          ctx.shadowBlur = 24;
          ctx.shadowColor = p.hueShift ? "rgba(0,112,209,0.20)" : "rgba(255,255,255,0.16)";
          ctx.fillStyle = p.hueShift ? "rgba(0,112,209,0.16)" : "rgba(255,255,255,0.13)";
          ctx.beginPath();
          ctx.arc(x, y, p.r * 2.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        ctx.beginPath();
        ctx.fillStyle = p.hueShift ? `rgba(0,112,209,${p.a * 0.9})` : `rgba(255,255,255,${p.a})`;
        ctx.arc(x, y, p.r, 0, Math.PI * 2);
        ctx.fill();
        if (p.r > 1.6 && !p.isBokeh) {
          ctx.beginPath();
          ctx.fillStyle = "rgba(0,112,209,0.16)";
          ctx.arc(x, y, p.r * 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (!reduceMotion) raf = requestAnimationFrame(draw);
    };

    if (reduceMotion) draw(0);
    else raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [variant]);

  return (
    <>
      {variant === "home" && coverUrl && (
        <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={coverUrl} alt="" className="h-full w-full object-cover scale-[1.10] blur-[26px] opacity-[0.28] transition-opacity duration-700 will-change-transform" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/50 to-black/95" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-black/25" />
          <div className="absolute inset-0 opacity-[0.06] mix-blend-soft-light" style={{ background: `radial-gradient(ellipse at 30% 20%, rgba(0,112,209,0.5), transparent 60%)` }} />
        </div>
      )}
      {variant === "home" && coverType && coverValue && !coverUrl && (
        <div className="pointer-events-none fixed inset-0 -z-20 opacity-[0.30] blur-[1px] transition-opacity duration-700" style={{ background: coverValue }} aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/50 to-black/90" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(0,112,209,0.18),transparent_55%)]" />
        </div>
      )}
      <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 -z-10 h-full w-full will-change-transform" aria-hidden="true" />
      {/* CSS overlays — vida PS5 sin JS extra */}
      {(variant === "home" || variant === "login") && (
        <>
          <div className="pointer-events-none fixed inset-0 -z-10 opacity-[0.06] bg-[repeating-linear-gradient(0deg,transparent_0_2px,rgba(255,255,255,0.12)_2px_3px)]" aria-hidden="true" />
          <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_52%,rgba(0,0,0,0.45)_100%)]" aria-hidden="true" />
          <div className="pointer-events-none fixed inset-0 -z-10 opacity-[0.045] ps-grain" aria-hidden="true" />
          <div className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(180deg,rgba(0,112,209,0.12),transparent_38%)]" aria-hidden="true" />
        </>
      )}
      {variant === "login" && (
        <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_18%,rgba(255,255,255,0.06),transparent_60%)]" aria-hidden="true" />
      )}
    </>
  );
}
