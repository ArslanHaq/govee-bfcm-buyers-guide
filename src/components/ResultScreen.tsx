"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { CAMPAIGN, RESULTS, type ResultId } from "@/lib/quiz";
import { ART_LAYERS, EXPLORE_LINK, RESULT_LOWER } from "@/lib/art-layers";
import { RESULT_TINT, TINT_STEP } from "@/lib/result-tint";
import { EASE_OUT, still } from "@/lib/motion";
import { ArtLayerImg } from "./ArtLayer";
import { useScrollTint } from "./BrowserTint";
import { PhotoWindow, PHOTO_WINDOW } from "./PhotoWindow";

/**
 * Result — Figma "final design" frames result #1 … #6 (427:1685, 427:1746,
 * 427:1805, 427:1919, 427:2183, 427:2297; r4b is 427:2051).
 *
 * Client design, 18 Nov: each result is a 390x1180 page that scrolls. The
 * top half is the match itself; below "Explore Your Match" a photo of the
 * lights in a real room, then the Shop Lights button. "We talked about how
 * the screen is not full, so we added a photo section for the results."
 *
 * Composed from the individual layer exports rather than one flattened frame,
 * which is what lets the button be real DOM, and each element animate on its
 * own. The page is scaled to the viewport WIDTH (--sw) and scrolls inside
 * .result-screen; html/body never scroll (see globals.css, BrowserTint.tsx).
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
  explore: 0.75,
  // Below the fold these play as they scroll into view, so the delays are
  // relative to that moment rather than to page load.
  "decor-low": 0.15,
  match: 0.25,
};

export function ResultScreen({ id }: { id: ResultId }) {
  const result = RESULTS[id];
  const layers = ART_LAYERS[id] ?? [];
  const lower = RESULT_LOWER[id];
  const href = result.shopUrl ?? CAMPAIGN.shopUrl;
  // r4b reuses r4's background; only its photo and chip differ.
  const art = result.art ?? id;
  const tint = RESULT_TINT[art] ?? [];
  const reduced = useReducedMotion();
  const scroller = useRef<HTMLDivElement>(null);
  useScrollTint(scroller, tint, TINT_STEP);
  const box = EXPLORE_LINK.box;

  // QA link: `?screen=r5&at=photo` opens a result already scrolled to its
  // photo, for checking the lower half on a device without touching it.
  useEffect(() => {
    const el = scroller.current;
    if (!el || new URLSearchParams(window.location.search).get("at") !== "photo") return;
    el.scrollTo({ top: (PHOTO_WINDOW.y - 40) * (el.clientWidth / 390) });
  }, []);

  // The Explore arrow bounces until the reader first scrolls the page.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const onScroll = () => {
      if (el.scrollTop > 24) {
        setScrolled(true);
        el.removeEventListener("scroll", onScroll);
      }
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);
  const bounce = !reduced && !scrolled;

  const exploreMatch = () => {
    const el = scroller.current;
    if (!el) return;
    const sw = el.clientWidth / 390;
    // Land with the decor above the window still in view.
    el.scrollTo({ top: (PHOTO_WINDOW.y - 40) * sw, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <div
      ref={scroller}
      className="screen result-screen"
      data-result={id}
      style={{
        ["--edge-top" as string]: tint[0],
        ["--edge-bottom" as string]: tint[tint.length - 1],
      }}
    >
      <div className="result-page">
        <div className="stage">
          <Image
            className="result-bg"
            src={`/bg/${art}.webp`}
            alt=""
            width={390}
            height={1180}
            priority
            unoptimized
          />

          {/* Shared with the question screens rather than duplicated per
              result: seven copies of the same mark cost 343 KB. */}
          <Image className="govee-logo" src="/icons/govee.png" alt="Govee" width={84} height={47} priority />

          {/* One <img> per Figma layer, absolutely placed on the design canvas. */}
          {/* Index in the key: one asset can be placed twice (r1's sparkle). */}
          {layers.map((l, i) => (
            <ArtLayerImg
              key={`${l.src}#${i}`}
              layer={l}
              delay={STAGGER[l.role] ?? 0.3}
              inView={l.role === "decor-low"}
            />
          ))}

          {/* "Explore Your Match ↓": takes the reader down to the photo. The
              hit area is padded past the 24px-high artwork to a usable size. */}
          <motion.button
            type="button"
            className="explore-link"
            style={{ left: box.x, top: box.y, width: box.w, height: box.h }}
            onClick={exploreMatch}
            aria-label="Explore your match"
            initial={{ opacity: 0, y: reduced ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={still({ duration: 0.5, ease: EASE_OUT, delay: STAGGER.explore }, reduced)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={EXPLORE_LINK.text.src}
              alt=""
              style={{ left: EXPLORE_LINK.text.x - box.x, top: EXPLORE_LINK.text.y - box.y, width: EXPLORE_LINK.text.w, height: EXPLORE_LINK.text.h }}
            />
            {/* Not in the design; added on request (18 Nov) as a hint that the
                page continues. A short drop and back every 2s, starting once
                the page has built in, and it stops for good the first time
                the reader scrolls: by then it has done its job. */}
            <motion.svg
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
              style={{ left: EXPLORE_LINK.arrow.x - box.x, top: EXPLORE_LINK.arrow.y - box.y, width: 24, height: 24 }}
              animate={bounce ? { y: [0, 5, 0] } : { y: 0 }}
              transition={
                bounce
                  ? { duration: 0.9, ease: "easeInOut", repeat: Infinity, repeatDelay: 1.1, delay: 1.4 }
                  : { duration: 0.25, ease: EASE_OUT }
              }
            >
              <path
                d="M12 4.99997V19M5.00002 12L12 19L19 12"
                stroke="white"
                strokeWidth={2.25}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          </motion.button>

          {lower && (
            <>
              <motion.div
                className="photo-window-slot"
                style={{ left: PHOTO_WINDOW.x, top: PHOTO_WINDOW.y, width: PHOTO_WINDOW.w, height: PHOTO_WINDOW.h }}
                initial={{ opacity: 0, y: reduced ? 0 : 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={still({ duration: 0.55, ease: EASE_OUT }, reduced)}
              >
                <PhotoWindow
                  accent={result.ctaFill}
                  photos={lower.photos ?? [lower.photo]}
                  alt={`${result.products.join(" + ")} lighting a room`}
                />
              </motion.div>
              <ArtLayerImg layer={lower.match} delay={STAGGER.match} inView />
            </>
          )}

          {/* The artwork is decorative; the page's meaning lives here. */}
          <h1 className="sr-only">{result.title}</h1>
          <p className="sr-only">
            {result.description} Best for: {result.bestFor}. Your match:{" "}
            {result.products.join(", ")}. Up to {result.discount} off.
          </p>

          {/* Entry is on the wrapper so the blink can own the anchor's own
              opacity without the two fighting over the same property. */}
          <motion.div
            className="result-cta-slot"
            initial={{ opacity: 0, y: reduced ? 0 : 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={still({ duration: 0.4, ease: EASE_OUT, delay: reduced ? 0 : 0.1 }, reduced)}
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
    </div>
  );
}
