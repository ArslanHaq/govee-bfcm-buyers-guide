"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { HERO, STEP, still } from "@/lib/motion";

/**
 * Shared layout for the two screen types that are mostly illustration: the
 * cover and the six results.
 *
 * Three layers, deliberately separate:
 *
 *   1. background  — the frame's image fill, covering the whole viewport so
 *                    there is no letterbox on taller phones.
 *   2. overlay     — every drawn layer in the frame except the button, as one
 *                    transparent SVG. Vector, so it stays crisp at any
 *                    density, and its groups stay addressable for staggering.
 *   3. button      — real DOM.
 *
 * The earlier build flattened all three into one raster "plate". That broke
 * the press animation (translating the live button revealed the baked one
 * underneath), forced the letterbox, and made per-element motion impossible.
 */
export function ArtScreen({
  background,
  overlay,
  alt,
  edge,
  children,
  className = "",
}: {
  background: string;
  /**
   * Omit until the real export lands. While absent the background is the full
   * frame (button included), so the press translate is suppressed — that is
   * exactly the double-button artefact this architecture removes.
   */
  overlay?: string;
  alt: string;
  edge: { top: string; bottom: string };
  /** The button(s), positioned by the caller. */
  children: React.ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();

  // Until the overlay export lands, `background` is the whole frame with the
  // button drawn in. It then has to sit on the stage, not cover the viewport,
  // or the baked button drifts away from the live one as the two scale
  // differently. That costs a letterbox, and it is why the flattened plate is
  // being replaced rather than patched.
  const baked = !overlay;

  return (
    <div
      className={`screen art-screen${baked ? " baked" : ""} ${className}`}
      style={{
        ["--edge-top" as string]: edge.top,
        ["--edge-bottom" as string]: edge.bottom,
      }}
    >
      {!baked && (
        <Image
          className="screen-bg"
          src={background}
          alt=""
          fill
          sizes="100vw"
          priority
          unoptimized
        />
      )}
      <div className="stage">
        <motion.img
          className="art-overlay"
          src={overlay ?? background}
          alt={alt}
          width={390}
          height={720}
          initial={{ opacity: 0, scale: reduced ? 1 : 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={still(HERO, reduced)}
        />
        <motion.div
          className="art-actions"
          initial={{ opacity: 0, y: reduced ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={still({ ...STEP, delay: reduced ? 0 : 0.45 }, reduced)}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
