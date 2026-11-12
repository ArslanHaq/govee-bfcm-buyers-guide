import type { Metadata, Viewport } from "next";
import "./globals.css";
import { StageScale } from "@/components/Stage";
import { BrowserTintEdges } from "@/components/BrowserTint";

export const metadata: Metadata = {
  title: "Build Your Perfect Holiday Setup | Govee",
  description:
    "Not sure which lights are right for your home? Answer 2–3 quick questions to find your perfect holiday lighting match.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  // The cover's top edge; each screen then updates it (useBrowserTint).
  themeColor: "#B27273",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StageScale />
        {/* In the server HTML so the browser bars are right from first paint,
            before the app hydrates. */}
        <BrowserTintEdges />
        {children}
      </body>
    </html>
  );
}
