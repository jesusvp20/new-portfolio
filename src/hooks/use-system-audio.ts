import { useCallback, useEffect, useMemo, useRef } from "react";

export function useSystemAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const unlocked = useRef(false);

  const source = useMemo(() => "/sounds/home-menu.mp3", []);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "auto";
    audio.loop = true;
    audio.volume = 0.18;
    audio.src = source;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [source]);

  const unlock = useCallback(() => {
    if (unlocked.current) return;
    unlocked.current = true;
    void audioRef.current?.play().catch(() => {});
    audioRef.current?.pause();
  }, []);

  const play = useCallback(() => {
    unlock();
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    void audioRef.current.play().catch(() => {});
  }, [unlock]);

  const stop = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const playSfx = useCallback(
    (src: string, vol = 0.32) => {
      unlock();
      const a = new Audio(src);
      a.volume = vol;
      a.preload = "auto";
      void a.play().catch(() => {});
    },
    [unlock]
  );

  const playHover = useCallback(() => playSfx("/sounds/select.mp3", 0.22), [playSfx]);
  const playSelect = useCallback(() => playSfx("/sounds/select.mp3", 0.32), [playSfx]);
  const playBack = useCallback(() => playSfx("/sounds/startup.mp3", 0.18), [playSfx]);
  const playBlip = playHover;

  return { play, stop, playBlip, playHover, playSelect, playBack, unlock };
}
