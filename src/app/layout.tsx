import type { Metadata, Viewport } from "next";
import "./globals.css";
import { StageScale } from "@/components/Stage";

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
  themeColor: "#2A2626",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StageScale />
        {children}
      </body>
    </html>
  );
}
