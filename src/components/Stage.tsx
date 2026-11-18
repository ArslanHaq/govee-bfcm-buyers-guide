"use client";

import { useEffect } from "react";

/**
 * Publishes the canvas scale as a unitless --s.
 *
 * This cannot be done in pure CSS: `min(100vw / 390, 100dvh / 720)` yields a
 * <length>, and scale() requires a <number>, so the transform is dropped
 * silently. Computing it here keeps the 390x720 design canvas exact at any
 * viewport size.
 */
export function useStageScale() {
  useEffect(() => {
    const apply = () => {
      const s = Math.min(window.innerWidth / 390, window.innerHeight / 720);
      document.documentElement.style.setProperty("--s", String(s));
      // The result pages are 390x1180 and scroll, so they fit the WIDTH
      // only; fitting the height as well would shrink them to a strip.
      document.documentElement.style.setProperty("--sw", String(window.innerWidth / 390));
    };
    apply();
    window.addEventListener("resize", apply);
    window.addEventListener("orientationchange", apply);
    return () => {
      window.removeEventListener("resize", apply);
      window.removeEventListener("orientationchange", apply);
    };
  }, []);
}

export function StageScale() {
  useStageScale();
  return null;
}
