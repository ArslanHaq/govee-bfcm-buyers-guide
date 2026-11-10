"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { CAMPAIGN, RESULTS, type ResultId } from "@/lib/quiz";
import { RESULT_EDGES } from "@/lib/theme";
import { ART_LAYERS } from "@/lib/art-layers";
import { EASE_OUT, still } from "@/lib/motion";
import { ArtLayerImg } from "./ArtLayer";

/**
 * Result — Figma nodes 148:148 … 148:1144.
 *
 * Composed from the individual layer exports rather than one flattened frame,
 * which is what lets the button be real DOM (no baked twin underneath), the
 * background cover the viewport, and each element animate on its own.
 *
 * Reveal order follows the way Smart Animate reads the frame: the ground
 * first, then the headline block, then the product, then the overlays.
 */
const STAGGER: Record<string, number> = {
  badge: 0.05,
  ribbon: 0.0,
  headline: 0.12,
  desc: 0.22,
  product: 0.3,
  chip: 0.42,
  sticker: 0.5,
  decor: 0.55,
  cursor: 0.6,
  logo: 0.0,
};

export function ResultScreen({ id }: { id: ResultId }) {
  const result = RESULTS[id];
  const layers = ART_LAYERS[id] ?? [];
  const href = result.shopUrl ?? CAMPAIGN.shopUrl;
  const edge = RESULT_EDGES[id];
  const reduced = useReducedMotion();

  return (
    <div
      className="screen result-screen"
      style={{
        ["--edge-top" as string]: edge.top,
        ["--edge-bottom" as string]: edge.bottom,
      }}
    >
      <Image
        className="screen-bg"
        src={`/bg/${id}.webp`}
        alt=""
        fill
        sizes="100vw"
        priority
        unoptimized
      />

      <div className="stage">
        {/* Shared with the question screens rather than duplicated per result:
            seven copies of the same mark cost 343 KB, and keeping one element
            lets it persist across the transition. */}
        <Image className="govee-logo" src="/icons/govee.png" alt="Govee" width={84} height={47} priority />

        {/* One <img> per Figma layer, absolutely placed on the design canvas. */}
        {layers.map((l) => (
          <ArtLayerImg key={l.src} layer={l} delay={STAGGER[l.role] ?? 0.3} />
        ))}

        {/* The artwork is decorative; the page's meaning lives here. */}
        <h1 className="sr-only">{result.title}</h1>
        <p className="sr-only">
          {result.description} Recommended: {result.products.join(", ")}. Up to{" "}
          {result.discount} off.
        </p>

        {/* Entry is on the wrapper so the blink can own the anchor's own
            opacity without the two fighting over the same property. */}
        <motion.div
          className="result-cta-slot"
          initial={{ opacity: 0, y: reduced ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={still({ duration: 0.4, ease: EASE_OUT, delay: reduced ? 0 : 0.7 }, reduced)}
        >
          <motion.a
            className="retro-btn result-cta"
            style={{ background: result.ctaFill, color: result.ctaText }}
            href={href}
            aria-label={`${result.cta}: ${result.products.join(", ")}`}
            animate={reduced ? { scale: 1 } : { scale: [1, 0.83, 1] }}
            whileTap={reduced ? undefined : { x: -5, y: 6, scale: 0.94, boxShadow: "0px 0px 0px rgba(0,0,0,1)" }}
            transition={
              reduced
                ? { duration: 0 }
                : {
                    // Measured off the prototype recording: the button
                    // scales to 0.83 and back on a ~530ms cycle, running
                    // continuously. A control element in the same frames
                    // (the tree, 293x455) stays fixed, so this is the
                    // button moving and not the camera.
                    scale: {
                      duration: 0.53,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatDelay: 1.5, // pause between pulses, per request
                      delay: 1.2,
                    },
                    default: { type: "spring", stiffness: 210, damping: 17, mass: 0.9 },
                  }
            }
          >
            {result.cta} →
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
}
