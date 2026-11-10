"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ArtLayer as Layer } from "@/lib/art-layers";
import { EASE_OUT, still } from "@/lib/motion";

/**
 * One exported Figma layer, absolutely placed on the 390x720 canvas.
 *
 * The cursor is treated specially. Probing the Figma prototype's canvas
 * frame by frame showed it is the only element that moves on the cover, and
 * it moves once on load. A single 800ms nudge is too easy to miss as a
 * call-to-action, so it repeats on a long delay instead — a periodic hint
 * rather than constant motion. It also sits above the button, since in the
 * design it points at it.
 */
export function ArtLayerImg({
  layer,
  delay,
  animateCursor = false,
}: {
  layer: Layer;
  delay: number;
  /**
   * Only the cover nudges its cursor: there it sits beside the Start button
   * and reads as "press this". On the results the cursor sits up by the
   * headline, far from the CTA, and the prototype animates the button
   * instead — so there it stays still.
   */
  animateCursor?: boolean;
}) {
  const reduced = useReducedMotion();
  const isCursor = layer.role === "cursor" && animateCursor;

  return (
    <motion.img
      className={`art-layer${isCursor ? " cursor-layer" : ""}`}
      src={layer.src}
      alt=""
      aria-hidden
      style={{ left: layer.x, top: layer.y, width: layer.w, height: layer.h }}
      initial={{ opacity: 0, x: 0, y: reduced ? 0 : 8 }}
      animate={
        isCursor && !reduced
          ? { opacity: 1, x: [0, 6, 0], y: [0, -5, 0] }
          : { opacity: 1, x: 0, y: 0 }
      }
      transition={
        isCursor && !reduced
          ? {
              opacity: { duration: 0.5, ease: EASE_OUT, delay },
              // Measured off the prototype recording, with the cursor
              // tracked RELATIVE to the Start button so camera shake drops
              // out: it drifts ~6px right and ~5px up and back, on a ~1.6s
              // cycle, continuously — no pause between repeats.
              x: { duration: 1.6, ease: "easeInOut", repeat: Infinity, delay: 0.9 },
              y: { duration: 1.6, ease: "easeInOut", repeat: Infinity, delay: 0.9 },
            }
          : still({ duration: 0.5, ease: EASE_OUT, delay }, reduced)
      }
    />
  );
}
