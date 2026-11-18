"use client";

import { useEffect } from "react";
import Image from "next/image";
import { CAMPAIGN } from "@/lib/quiz";

/**
 * Shown above 768px — Figma "Desktop" frame (378:11, 1728x1117), client
 * design 18 Nov: the quiz is phone-only, so desktop gets a hand-off page
 * asking people to open it on their phone.
 *
 * The background is the frame's own image fill (covers the viewport). The
 * window, "Starts Nov 19" sticker and offer burst are one layer cut from a 2x
 * export against that fill: their type is outlined in Figma, so there is no
 * live text to rebuild. The "Explore Govee" button is a real link laid
 * exactly over the drawn one.
 *
 * Scale: the content uses the background's own cover scale, so at the design
 * size the composition is exactly the frame; it only shrinks when the window
 * is too small to show all of it (short laptop screens, portrait tablets).
 */
const CANVAS = { w: 1728, h: 1117 };
/** Everything that must stay on screen: logo, sticker, window, burst. */
const SAFE = { left: 301.5, right: 1433, top: 73.5, bottom: 963 };

export function DesktopViewMessage() {
  useEffect(() => {
    const apply = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const cover = Math.max(vw / CANVAS.w, vh / CANVAS.h);
      const cx = CANVAS.w / 2;
      const cy = CANVAS.h / 2;
      const fitW = (vw / 2 - 24) / Math.max(cx - SAFE.left, SAFE.right - cx);
      const fitH = (vh / 2 - 16) / Math.max(cy - SAFE.top, SAFE.bottom - cy);
      document.documentElement.style.setProperty("--dvs", String(Math.min(cover, fitW, fitH)));
    };
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);

  return (
    <main className="dv">
      <Image className="dv-bg" src="/art/desktop/bg.webp" alt="" fill sizes="100vw" priority unoptimized />

      <div className="dv-stage">
        <Image
          className="dv-layer"
          src="/art/desktop/logo.webp"
          alt="Govee"
          width={109}
          height={29.5}
          style={{ left: 809, top: 73.5 }}
          priority
          unoptimized
        />
        <Image
          className="dv-layer"
          src="/art/desktop/content.webp"
          alt=""
          width={1131.5}
          height={673}
          style={{ left: 301.5, top: 290 }}
          priority
          unoptimized
        />

        {/* The copy is drawn into the artwork; this is what it says. */}
        <h1 className="sr-only">For the best experience, please visit this quiz on your mobile device</h1>
        <p className="sr-only">
          Try it on your phone to find your home personality. Starts {CAMPAIGN.startsDate}. Up to 40% off.
        </p>

        <a className="dv-explore" href={CAMPAIGN.shopUrl}>
          <span className="sr-only">Explore Govee</span>
        </a>
      </div>
    </main>
  );
}
