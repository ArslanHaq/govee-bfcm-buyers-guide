/**
 * Per-screen palettes, sampled pixel-by-pixel from the Figma renders
 * (design page, nodes 131:1486 – 131:1950).
 *
 * Every screen shares the same window geometry; only these colours change.
 * Values that are identical on every screen live in CHROME below.
 */

/** Constants verified identical across all 9 screens. */
export const CHROME = {
  /** Window outline + icon strokes. */
  border: "#372A37",
  /** Address-bar and close-button fill. */
  field: "#FDF1E6",
  /** Body copy inside the window. */
  text: "#F8F8F8",
  /** Hard offset shadow — never blurred. */
  shadow: "#000000",
  /** Dark glyph colour used on light buttons. */
  textDark: "#1A1A1A",
} as const;

export interface Theme {
  /** Window interior. */
  body: string;
  /** Title bar, nav row and bottom bar. */
  accent: string;
  /** Primary (Next / Start) button fill + its glyph colour. */
  next: { fill: string; text: string };
  /** Back button; absent on the first question. */
  back?: { fill: string; text: string };
  /** Background artwork for the screen. */
  bg: string;
  /** Letterbox fill above/below the canvas, averaged from the artwork edges. */
  edge: { top: string; bottom: string };
}

const DARK = CHROME.textDark;
const LIGHT = CHROME.text;

export const THEMES: Record<string, Theme> = {
  cover: {
    body: "#941B16",
    accent: "#63B6D4",
    next: { fill: "#BA2D0B", text: LIGHT },
    bg: "/plates/cover.webp",
    edge: { top: "#B27273", bottom: "#D2B0A6" },
  },
  q1: {
    body: "#743C72",
    accent: "#DA7DD7",
    next: { fill: "#DA7DD7", text: DARK },
    bg: "/bg/q1.webp",
    edge: { top: "#B795D1", bottom: "#E0DAEC" },
  },
  q2a: {
    body: "#6D000D",
    accent: "#F9C0C7",
    next: { fill: "#F9C0C7", text: DARK },
    back: { fill: "#231E21", text: LIGHT },
    bg: "/bg/q2a.webp",
    edge: { top: "#363131", bottom: "#302C2C" },
  },
  q2b: {
    body: "#895A00",
    accent: "#ECA315",
    next: { fill: "#ECA315", text: DARK },
    back: { fill: "#356D8E", text: LIGHT },
    bg: "/bg/q2b.webp",
    edge: { top: "#5B768A", bottom: "#626A7A" },
  },
  q2c: {
    body: "#883204",
    accent: "#EE5E12",
    next: { fill: "#EE5E12", text: DARK },
    back: { fill: "#D9736E", text: DARK },
    bg: "/bg/q2c.webp",
    edge: { top: "#CC867F", bottom: "#CA8275" },
  },
  q2d: {
    body: "#385403",
    accent: "#8EB04F",
    next: { fill: "#8EB04F", text: DARK },
    back: { fill: "#FCB443", text: DARK },
    bg: "/bg/q2d.webp",
    edge: { top: "#D5B56A", bottom: "#E6B468" },
  },
  q3: {
    body: "#614E01",
    accent: "#FFDE59",
    next: { fill: "#FFDE59", text: DARK },
    back: { fill: "#F5ACC0", text: DARK },
    bg: "/bg/q3.webp",
    edge: { top: "#E1A5C8", bottom: "#E8B3BA" },
  },
};

/** The quit dialog floats above whichever question is active. */
export const QUIT_DIALOG = {
  surface: "#FFFFFF",
  titleBar: "#63B6D4",
  confirmFill: "#63B6D4",
  cancelFill: "#FFFFFF",
} as const;

/** Result screens sit on a near-black backdrop rather than a gradient. */
/** Letterbox colours per result, sampled from each delivered plate. */
export const RESULT_EDGES: Record<string, { top: string; bottom: string }> = {
  r1: { top: "#322C2D", bottom: "#2B2828" },
  r2: { top: "#4B6A55", bottom: "#57725F" },
  r3: { top: "#70817E", bottom: "#577387" },
  r4: { top: "#D19B98", bottom: "#CD9187" },
  r5: { top: "#CFB47B", bottom: "#DFB47B" },
  r6: { top: "#DCB6BB", bottom: "#D3A9C1" },
};

export const RESULT_THEME = {
  backdrop: "#2A2626",
  accent: "#F9C0C7",
  productCard: "#FFF8E3",
  productTitle: "#0F6312",
  cta: { fill: "#F9C0C7", text: DARK },
} as const;

/** Turns a Theme into the CSS custom properties the components read. */
export function themeVars(t: Theme): React.CSSProperties {
  return {
    "--body": t.body,
    "--accent": t.accent,
    "--border": CHROME.border,
    "--field": CHROME.field,
    "--text": CHROME.text,
    "--next-fill": t.next.fill,
    "--next-text": t.next.text,
    "--back-fill": t.back?.fill ?? "transparent",
    "--back-text": t.back?.text ?? CHROME.text,
    "--edge-top": t.edge.top,
    "--edge-bottom": t.edge.bottom,
  } as React.CSSProperties;
}
