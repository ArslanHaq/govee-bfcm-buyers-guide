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

/** Publishes the current screen's edge colours to the browser chrome. */
export function useBrowserTint(edge: { top: string; bottom: string }) {
  const { top, bottom } = edge;
  useEffect(() => {
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
    meta.content = top;
  }, [top, bottom]);
}
