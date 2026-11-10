"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { CAMPAIGN } from "@/lib/quiz";
import { THEMES } from "@/lib/theme";
import { ART_LAYERS } from "@/lib/art-layers";
import { EASE_OUT, still } from "@/lib/motion";
import { ArtLayerImg } from "./ArtLayer";
import { RetroButton } from "./RetroButton";

/**
 * Cover — Figma node 131:1486.
 *
 * Composed from the individual layer exports, same as the results. The
 * sub-head is the one piece that is not artwork, so it is live text rather
 * than a baked image.
 *
 * Start button measured from the frame: top 616, i.e. a 49px bottom margin —
 * not the 38px the question screens use.
 */
const STAGGER: Record<string, number> = {
  window: 0.0,
  headline: 0.14,
  window2: 0.1,
  burst: 0.26,
  offer: 0.34,
  sticker: 0.4,
  cursor: 0.5,
};

export function CoverScreen({ onStart }: { onStart: () => void }) {
  const theme = THEMES.cover;
  const layers = ART_LAYERS.cover ?? [];
  const reduced = useReducedMotion();

  return (
    <div
      className="screen cover-screen"
      style={{
        ["--edge-top" as string]: theme.edge.top,
        ["--edge-bottom" as string]: theme.edge.bottom,
        ["--next-fill" as string]: theme.next.fill,
        ["--next-text" as string]: theme.next.text,
      }}
    >
      <Image
        className="screen-bg"
        src="/bg/cover.webp"
        alt=""
        fill
        sizes="100vw"
        priority
        unoptimized
      />

      <div className="stage">
        <Image className="govee-logo" src="/icons/govee.png" alt="Govee" width={84} height={47} priority />

        {layers.map((l) => (
          <ArtLayerImg key={l.src} layer={l} delay={STAGGER[l.role] ?? 0.3} animateCursor />
        ))}

        {/* Live text: measured at y294-323, centred. */}
        <motion.p
          className="cover-sub"
          initial={{ opacity: 0, y: reduced ? 0 : 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={still({ duration: 0.45, ease: EASE_OUT, delay: reduced ? 0 : 0.2 }, reduced)}
        >
          Not sure which lights are right
          <br />
          for your home? We&apos;ve got you!
        </motion.p>

        <h1 className="sr-only">Build Your Perfect Holiday Setup</h1>

        {/* The recording shows the Start button holding scale 1.000 for the
            whole clip — only the cursor moves on this screen. So this fades
            in and then stays put. */}
        <motion.div
          className="cover-cta"
          initial={{ opacity: 0, y: reduced ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={still({ duration: 0.4, ease: EASE_OUT, delay: reduced ? 0 : 0.62 }, reduced)}
        >
          <RetroButton variant="next" onClick={onStart}>
            Start
          </RetroButton>
        </motion.div>
      </div>
    </div>
  );
}
