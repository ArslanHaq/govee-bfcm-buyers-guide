// GENERATED from the Figma layer exports — see docs/ART-LAYERS.md.
// Positions are design pixels: the cover on its 390x720 canvas, the results
// on their 390x1180 scrolling page.
// `estimated: true` was placed from a scaled screen capture rather than
// an exact match, and is worth a visual check. (No result layer is any more.)

export interface ArtLayer {
  src: string;
  role: string;
  x: number; y: number; w: number; h: number;
  estimated?: boolean;
}

export const ART_LAYERS: Record<string, ArtLayer[]> = {
  cover: [
    { src: "/art/cover/Group 10879077.svg", role: "window", x: 24, y: 81, w: 342, h: 319 },
    { src: "/art/cover/headline.svg", role: "headline", x: 38, y: 187, w: 315, h: 91 },
    { src: "/art/cover/Group 10879078.svg", role: "window2", x: 153, y: 352, w: 237, h: 184 },
    { src: "/art/cover/starburst.svg", role: "burst", x: 106, y: 287, w: 284, h: 342 },
    { src: "/art/cover/Group 10879074.svg", role: "offer", x: 96, y: 403, w: 294, h: 92 },
    { src: "/art/cover/Group 10879108.svg", role: "sticker", x: 5, y: 342, w: 116, h: 71 },
    { src: "/art/cover/Vector.svg", role: "cursor", x: 242, y: 629, w: 63, h: 85 },
  ],
  // Results (client design, 18 Nov): 390x1180 scrolling pages. The top half
  // reuses the earlier layers, re-located by template matching against 4x
  // exports of the new frames (quarter-pixel). New below the fold: the
  // "Explore Your Match" link, the photo window (PhotoWindow.tsx) and the
  // "Your Match" chip (RESULT_LOWER). Chips and the r1/r2 stickers are cut
  // from the 4x frames: their text is outlined in Figma, so there is no
  // editable source to re-export. See docs/ART-LAYERS.md.
  r1: [
    { src: "/art/r1/Group 10879086.svg", role: "badge", x: 0, y: 47, w: 114, h: 141 },
    { src: "/art/r1/Group 10879081.svg", role: "ribbon", x: 10, y: 93.75, w: 365, h: 146 },
    { src: "/art/r1/The Tree Showstopper.svg", role: "headline", x: 56.5, y: 119.75, w: 278, h: 103 },
    { src: "/art/r1/desc.svg", role: "desc", x: 40.75, y: 265.25, w: 308, h: 34 },
    { src: "/art/r1/r1 1.webp", role: "product", x: 67, y: 315.75, w: 257, h: 279 },
    { src: "/art/r1/chip-best.webp", role: "chip", x: 225.5, y: 436.75, w: 148.75, h: 74.75 },
    { src: "/art/r1/sticker.webp", role: "sticker", x: 35, y: 511.5, w: 108.75, h: 68 },
    { src: "/art/r1/Vector.svg", role: "decor", x: 327.75, y: 343.25, w: 27, h: 27 },
    { src: "/art/r1/Cursor.svg", role: "cursor", x: 323.5, y: 185.75, w: 60, h: 73 },
    { src: "/art/r1/Vector.svg", role: "decor-low", x: 27.5, y: 672, w: 27, h: 27 },
  ],
  r2: [
    { src: "/art/r2/Group 10879086.svg", role: "badge", x: 0.25, y: 47, w: 114, h: 141 },
    { src: "/art/r2/Group 10879081.svg", role: "ribbon", x: 10.25, y: 93.75, w: 365, h: 146 },
    { src: "/art/r2/The Festive Sparkle.svg", role: "headline", x: 80.75, y: 119.75, w: 231, h: 103 },
    { src: "/art/r2/desc.svg", role: "desc", x: 67.75, y: 265.25, w: 256, h: 34 },
    { src: "/art/r2/r2 1.webp", role: "product", x: 67.25, y: 316.75, w: 257, h: 275 },
    { src: "/art/r2/chip-best.webp", role: "chip", x: 19.25, y: 424.75, w: 149, h: 75 },
    { src: "/art/r2/sticker.webp", role: "sticker", x: 277.25, y: 516.5, w: 97.25, h: 74.5 },
    { src: "/art/r2/Vector-1.svg", role: "decor", x: 335.5, y: 469.75, w: 33, h: 33 },
    { src: "/art/r2/Vector.svg", role: "decor", x: 30.5, y: 348, w: 24, h: 24 },
    { src: "/art/r2/Cursor.svg", role: "cursor", x: 322.5, y: 182.25, w: 60, h: 73 },
    { src: "/art/r2/Vector.svg", role: "decor-low", x: 30.5, y: 672.1, w: 24, h: 24 },
  ],
  r3: [
    { src: "/art/r3/Group 10879086.svg", role: "badge", x: 0, y: 47, w: 114, h: 141 },
    { src: "/art/r3/Group 10879081.svg", role: "ribbon", x: 9.75, y: 93.75, w: 365, h: 146 },
    { src: "/art/r3/The Home Showstopper.svg", role: "headline", x: 56.25, y: 119.75, w: 278, h: 103 },
    { src: "/art/r3/desc.svg", role: "desc", x: 63.25, y: 265.25, w: 264, h: 34 },
    { src: "/art/r3/r3 1.webp", role: "product", x: 66.75, y: 333, w: 257, h: 238 },
    { src: "/art/r3/chip-best.webp", role: "chip", x: 238.25, y: 432, w: 131.75, h: 74.75 },
    { src: "/art/r3/Group 10879105.svg", role: "sticker", x: 2.75, y: 500.75, w: 117, h: 83 },
    { src: "/art/r3/Group 10879089.svg", role: "decor", x: 25, y: 331.5, w: 66, h: 26 },
    { src: "/art/r3/Group 10879090.svg", role: "decor", x: 298.25, y: 574.5, w: 66, h: 26 },
    { src: "/art/r3/Cursor.svg", role: "cursor", x: 322, y: 191.25, w: 60, h: 73 },
    { src: "/art/r3/Group 10879089.svg", role: "decor-low", x: 25, y: 672.25, w: 66, h: 26 },
  ],
  r4: [
    { src: "/art/r4/Group 10879086.svg", role: "badge", x: 0, y: 47, w: 114, h: 141 },
    { src: "/art/r4/Group 10879081.svg", role: "ribbon", x: 9.75, y: 93.75, w: 365, h: 146 },
    { src: "/art/r4/The Indoor Mood Maker.svg", role: "headline", x: 71.75, y: 119.75, w: 247, h: 95 },
    { src: "/art/r4/desc.svg", role: "desc", x: 48.75, y: 265.25, w: 293, h: 34 },
    { src: "/art/r4/r4 1.webp", role: "product", x: 66.75, y: 311.75, w: 257, h: 284 },
    { src: "/art/r4/chip-best.webp", role: "chip", x: 220.5, y: 412.5, w: 147.5, h: 74.75 },
    { src: "/art/r4/sticker-uplighter.webp", role: "sticker", x: 12.25, y: 466.75, w: 109, h: 68.25 },
    { src: "/art/r4/Group 10879100.svg", role: "decor", x: 279.25, y: 326.25, w: 75, h: 31 },
    { src: "/art/r4/Cursor.svg", role: "cursor", x: 322.5, y: 182.25, w: 60, h: 73 },
    { src: "/art/r4/Group 10879100.svg", role: "decor-low", x: 36.25, y: 666.75, w: 75, h: 31 },
  ],
  r5: [
    { src: "/art/r5/Group 10879086.svg", role: "badge", x: 0, y: 47, w: 114, h: 141 },
    { src: "/art/r5/Group 10879081.svg", role: "ribbon", x: 10, y: 93.5, w: 365, h: 146 },
    { src: "/art/r5/The Holiday Host.svg", role: "headline", x: 84.75, y: 119.75, w: 222, h: 95 },
    { src: "/art/r5/desc.svg", role: "desc", x: 41.5, y: 265.25, w: 307, h: 34 },
    { src: "/art/r5/Group 10879107 1.webp", role: "product", x: 66.75, y: 307, w: 256, h: 284 },
    { src: "/art/r5/chip-best.webp", role: "chip", x: 27, y: 436.5, w: 149, h: 74.75 },
    { src: "/art/r5/Group 10879104.svg", role: "sticker", x: 267.75, y: 516.25, w: 116, h: 75 },
    { src: "/art/r5/Group 10879102.svg", role: "decor", x: 301, y: 323.25, w: 60, h: 64 },
    { src: "/art/r5/Cursor.svg", role: "cursor", x: 322.5, y: 182.25, w: 60, h: 73 },
    // A smaller, mirrored copy of the top cluster: cut from the frame
    // (re-cut 19 Nov, when the client moved it up 4px).
    { src: "/art/r5/stars-lower.webp", role: "decor-low", x: 23.5, y: 646, w: 52.75, h: 57 },
  ],
  r6: [
    { src: "/art/r6/Group 10879086.svg", role: "badge", x: 0, y: 47, w: 114, h: 141 },
    { src: "/art/r6/Group 10879081.svg", role: "ribbon", x: 10, y: 93.75, w: 365, h: 146 },
    { src: "/art/r6/The Ultimate Holiday Home.svg", role: "headline", x: 67.5, y: 119.75, w: 257, h: 103 },
    { src: "/art/r6/desc.svg", role: "desc", x: 48, y: 265.25, w: 293, h: 34 },
    { src: "/art/r6/r6 1.webp", role: "product", x: 66.75, y: 309.75, w: 257, h: 266 },
    { src: "/art/r6/chip-best.webp", role: "chip", x: 12.5, y: 430.75, w: 149, h: 74.75 },
    { src: "/art/r6/Group 10879105.svg", role: "sticker", x: 262.75, y: 523, w: 117, h: 83 },
    { src: "/art/r6/Cursor.svg", role: "cursor", x: 322.5, y: 182.25, w: 60, h: 73 },
    // Two yellow sparkles added 19 Nov. In Figma they float on the canvas
    // above the frame (layers 427:2399 / 427:2400) rather than inside it, so
    // no export includes them; placed by registering a zoomed canvas capture
    // against the frame. Same vector at two sizes.
    { src: "/art/r6/sparkle.svg", role: "decor", x: 25.8, y: 324.4, w: 55.92, h: 55.92 },
    { src: "/art/r6/sparkle.svg", role: "decor-low", x: 30.5, y: 655.9, w: 46.22, h: 46.22 },
  ],
};
// r4b is r4's page with its own photo and "Your Match" chip.
ART_LAYERS.r4b = ART_LAYERS.r4;

/**
 * "Explore Your Match ↓" — identical on every result. `box` is the Figma
 * group (node 427:1915 on result #3, hug 179x24). The words are cut once from
 * the frame (white mark); the arrow is Figma's own 24px "Arrow down" icon,
 * kept as a vector so it can bounce on its own.
 */
export const EXPLORE_LINK = {
  box: { x: 105.58, y: 615.5, w: 179, h: 24 },
  text: { src: "/art/result/explore-text.webp", x: 106.5, y: 618, w: 146.25, h: 18 },
  // Group maths gives (260.58, 615.5); against the 4x frame render it sits
  // within half a pixel anywhere in 260.1-260.6, so it takes the middle.
  arrow: { x: 260.33, y: 615.25, w: 24, h: 24 },
} as const;

/**
 * Below the fold on each result: the photo(s) inside the window, and the
 * "Your Match" chip that overlaps the window's edge. The window frame itself
 * is drawn by PhotoWindow.tsx in the result's accent colour.
 *
 * `photos` (client update 19 Nov): r5 and r6 recommend several products, so
 * their window cycles through one photo per setting, like a GIF. Timing is
 * taken from Figma's Motion export: a hard cut every 1.2s, looping. The
 * indoor photo is the same image and crop on both; r6's Christmas photo is
 * mirrored in Figma, and is shipped mirrored.
 */
export const RESULT_LOWER: Record<string, { photo: string; photos?: string[]; match: ArtLayer }> = {
  r1: { photo: "/art/r1/photo.webp", match: { src: "/art/r1/chip-match.webp", role: "match", x: 20.5, y: 854.75, w: 148.5, h: 74.75 } },
  r2: { photo: "/art/r2/photo.webp", match: { src: "/art/r2/chip-match.webp", role: "match", x: 240.5, y: 792, w: 130.5, h: 74.75 } },
  r3: { photo: "/art/r3/photo.webp", match: { src: "/art/r3/chip-match.webp", role: "match", x: 20, y: 776.75, w: 130.75, h: 74.75 } },
  r4: { photo: "/art/r4/photo.webp", match: { src: "/art/r4/chip-match.webp", role: "match", x: 8.5, y: 830.75, w: 130.5, h: 74.75 } },
  r4b: { photo: "/art/r4b/photo.webp", match: { src: "/art/r4b/chip-match.webp", role: "match", x: 22.5, y: 815.75, w: 125.75, h: 75 } },
  // r5's chip header reads "Your Product", r6's "Best for" (19 Nov frames).
  r5: {
    photo: "/art/r5/photo.webp",
    photos: ["/art/r5/photo.webp", "/art/result/photo-indoor.webp"],
    match: { src: "/art/r5/chip-match.webp", role: "match", x: 179.25, y: 774.5, w: 201.5, h: 74.75 },
  },
  r6: {
    photo: "/art/r6/photo.webp",
    photos: ["/art/r6/photo.webp", "/art/result/photo-indoor.webp", "/art/r6/photo-xmas.webp"],
    match: { src: "/art/r6/chip-match.webp", role: "match", x: 178.25, y: 773, w: 202.5, h: 92.25 },
  },
};
