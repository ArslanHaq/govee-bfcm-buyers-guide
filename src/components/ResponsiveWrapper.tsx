"use client";

import { useEffect, useState } from "react";
import { DesktopViewMessage } from "./DesktopViewMessage";

/** Same breakpoint as the previous Govee quiz. */
const MOBILE_MAX = 768;

export function ResponsiveWrapper({ children }: { children: React.ReactNode }) {
  // null until measured, so the server render does not commit to either.
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    // QA override: ?view=desktop / ?view=mobile forces either side without
    // resizing the window.
    const forced = new URLSearchParams(window.location.search).get("view");
    if (forced === "desktop") { setIsMobile(false); return; }
    if (forced === "mobile") { setIsMobile(true); return; }

    const mq = window.matchMedia(`(max-width: ${MOBILE_MAX - 1}px)`);
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  if (isMobile === null) return null;
  return isMobile ? <>{children}</> : <DesktopViewMessage />;
}
