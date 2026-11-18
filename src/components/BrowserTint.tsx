"use client";

import { useEffect } from "react";

/**
 * Colours the phone browser's own bars (status bar and toolbar) to match the
 * screen on show.
 *
 * Measured in the iOS 26.2 simulator, which is what the client was using:
 *
 *  - Safari 26 ignores `theme-color`. It colours the top and bottom bars from
 *    fixed elements that touch the top and bottom edges, or failing that from
 *    the page background colour.
 *  - A fixed element covering the WHOLE viewport is sampled once, at load,
 *    and never again. Every screen used to be one, so the bars kept the
 *    cover's colours for the entire quiz — the "cut off" bands in the
 *    client's screenshots. Screens are now absolutely positioned instead.
 *  - Edge-sized fixed elements are re-read on every change. Two of them sit
 *    at the top and bottom, painted in the screen's edge colours and masked
 *    to fade out, so each bar takes its own colour and the artwork blends
 *    into it rather than meeting it at a line.
 *
 * `theme-color` and the page background are still set: Chrome on Android
 * reads the former, and older iOS reads either.
 */
export function BrowserTintEdges() {
  return (
    <>
      <div className="browser-edge top" aria-hidden />
      <div className="browser-edge bottom" aria-hidden />
    </>
  );
}

function setTint(top: string, bottom: string) {
  // html/body and both edges read these, so one write recolours all three.
  const root = document.documentElement;
  root.style.setProperty("--tint-top", top);
  root.style.setProperty("--tint-bottom", bottom);

  let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "theme-color";
    document.head.appendChild(meta);
  }
  if (meta.content !== top) meta.content = top;
}

/** Publishes the current screen's edge colours to the browser chrome. */
export function useBrowserTint(edge: { top: string; bottom: string }) {
  const { top, bottom } = edge;
  useEffect(() => setTint(top, bottom), [top, bottom]);
}

/**
 * For the scrolling result pages: the bars take the colour of the background
 * that is actually under them, from samples taken every `step` design px
 * down the page (src/lib/result-tint.ts). Updated once per frame while
 * scrolling; the edges' own colour transition smooths the steps.
 */
export function useScrollTint(
  ref: React.RefObject<HTMLElement | null>,
  samples: string[],
  step: number,
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || samples.length === 0) return;
    const pick = (y: number) =>
      samples[Math.max(0, Math.min(samples.length - 1, Math.round(y / step)))];
    let raf = 0;
    const apply = () => {
      raf = 0;
      const sw = el.clientWidth / 390 || 1;
      setTint(pick(el.scrollTop / sw), pick((el.scrollTop + el.clientHeight) / sw));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    apply();
    el.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      el.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref, samples, step]);
}
