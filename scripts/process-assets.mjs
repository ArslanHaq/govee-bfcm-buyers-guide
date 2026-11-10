/**
 * Converts dropped Figma exports into the 2x WebP the app actually loads,
 * then reports what is still missing.
 *
 * Drop PNGs (any resolution) into public/plates and public/bg; this resizes
 * to 2x of the 390x720 canvas and writes the .webp beside them. Source PNGs
 * are gitignored — only the WebP is committed, which is what keeps this repo
 * from repeating the predecessor's 571 MB history.
 */
import sharp from "sharp";
import { readdir, stat, unlink } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

const TARGET_W = 780;   // 2x of 390
const TARGET_H = 1440;  // 2x of 720
const QUALITY = 72;

const EXPECTED = {
  "public/bg": ["q1", "q2a", "q2b", "q2c", "q2d", "q3",
                "cover", "r1", "r2", "r3", "r4", "r5", "r6"],
};
// Vector overlays: copied through as-is, never re-encoded.
const VECTOR_DIR = "public/art";
const VECTOR_NAMES = ["cover", "r1", "r2", "r3", "r4", "r5", "r6"];

let converted = 0;
const missing = [];
const placeholders = new Set(
  existsSync("public/bg/PLACEHOLDERS.txt")
    ? (await import("node:fs")).readFileSync("public/bg/PLACEHOLDERS.txt", "utf8")
        .split("\n").map((l) => l.trim()).filter(Boolean)
    : [],
);

for (const [dir, names] of Object.entries(EXPECTED)) {
  const present = existsSync(dir) ? await readdir(dir) : [];
  for (const name of names) {
    const webp = join(dir, `${name}.webp`);
    // A .jpg here is a background-only re-export and supersedes any
    // whole-frame .png of the same name.
    const png =
      present.find((f) => f.toLowerCase() === `${name}.jpg`) ??
      present.find((f) => f.toLowerCase() === `${name}.jpeg`) ??
      present.find((f) => f.toLowerCase() === `${name}.png`);

    if (png) {
      const src = join(dir, png);
      // Square source fills (Figma exports the fill at its natural size) are
      // cover-cropped exactly as Figma composites them into the frame.
      await sharp(src)
        .resize(TARGET_W, TARGET_H, { fit: "cover", position: "centre" })
        .webp({ quality: QUALITY, effort: 6 })
        .toFile(webp + ".tmp");
      const { size } = await stat(webp + ".tmp");
      await unlink(webp).catch(() => {});
      await sharp(webp + ".tmp").toFile(webp).catch(async () => {});
      const { rename } = await import("node:fs/promises");
      await rename(webp + ".tmp", webp).catch(() => {});
      console.log(`  ✓ ${name.padEnd(6)} ${(size / 1024).toFixed(0).padStart(4)} KB  (from ${png})`);
      converted++;
      placeholders.delete(name);
      continue;
    }
    if (!existsSync(webp)) missing.push(`${dir}/${name}.png`);
  }
}

// Next caches optimized images keyed by source URL, so a replaced file keeps
// serving the old bytes until this is cleared.
if (converted) {
  await (await import("node:fs/promises"))
    .rm(".next/cache/images", { recursive: true, force: true })
    .catch(() => {});
  console.log("  cleared .next/cache/images");
}

const vectorMissing = [];
for (const n of VECTOR_NAMES) {
  if (!existsSync(join(VECTOR_DIR, `${n}.svg`)) && !existsSync(join(VECTOR_DIR, `${n}.png`))) {
    vectorMissing.push(`${VECTOR_DIR}/${n}.svg`);
  }
}

// A background that still has the window card drawn into it cannot cover the
// viewport: it would scale independently of the stage and the baked UI would
// drift off the live UI, showing two of everything. Detect it by sampling the
// middle of the card: on a true background that pixel is artwork, on a whole
// frame it is the flat card body.
const CARD_BODY = {
  q1: "#743C72", q2a: "#6D000D", q2b: "#895A00",
  q2c: "#883204", q2d: "#385403", q3: "#614E01",
};
const framed = {};
for (const [name, hex] of Object.entries(CARD_BODY)) {
  const f = join("public/bg", `${name}.webp`);
  if (!existsSync(f)) continue;
  const { data, info } = await sharp(f).raw().toBuffer({ resolveWithObject: true });
  // centre of the card body, in the 390x720 design frame
  const px = Math.round(0.5 * info.width);
  const py = Math.round((400 / 720) * info.height);
  const i = (py * info.width + px) * info.channels;
  const want = [1, 3, 5].map((k) => parseInt(hex.slice(k, k + 2), 16));
  const d = Math.abs(data[i] - want[0]) + Math.abs(data[i + 1] - want[1]) + Math.abs(data[i + 2] - want[2]);
  framed[name] = d < 45;
}
const framedList = Object.entries(framed).filter(([, v]) => v).map(([k]) => k);
if (framedList.length) {
  console.log(`\n  ${framedList.length} background(s) still contain the whole frame:`);
  console.log(`    ${framedList.join(", ")}`);
  console.log("  These stay letterboxed — covering the viewport would show the");
  console.log("  baked UI drifting off the live UI. Re-export as the Image fill.");
}

// Emit a manifest so each screen flips to the layered path on its own, as
// soon as BOTH its background and its overlay exist. No hand-editing.
const { writeFileSync } = await import("node:fs");
const ready = {};
for (const n of VECTOR_NAMES) {
  const svg = existsSync(join(VECTOR_DIR, `${n}.svg`));
  const png = existsSync(join(VECTOR_DIR, `${n}.png`));
  const bg = existsSync(join("public/bg", `${n}.webp`));
  ready[n] = bg && (svg || png) ? (svg ? `/art/${n}.svg` : `/art/${n}.png`) : null;
}
writeFileSync(
  "src/lib/art-manifest.ts",
  `// GENERATED by scripts/process-assets.mjs — do not edit.\n` +
    `// ART_OVERLAY: null means that screen falls back to the flattened frame.\n` +
    `// BG_IS_FRAME: true means the background still has the UI drawn into it,\n` +
    `// so it must track the stage instead of covering the viewport.\n` +
    `export const ART_OVERLAY: Record<string, string | null> = ${JSON.stringify(ready, null, 2)};\n\n` +
    `export const BG_IS_FRAME: Record<string, boolean> = ${JSON.stringify(framed, null, 2)};\n`,
);
console.log(`  wrote src/lib/art-manifest.ts`);

console.log(`\n  converted ${converted} file(s)`);
if (vectorMissing.length) {
  console.log(`\n  artwork overlays still missing (${vectorMissing.length}):`);
  for (const m of vectorMissing) console.log(`    - ${m}`);
  console.log("  Until these land, the cover and results use the flattened");
  console.log("  frame: they letterbox and the press animation is suppressed.");
}
if (missing.length) {
  console.log(`\n  still missing ${missing.length}:`);
  for (const m of missing) console.log(`    - ${m}`);
  console.log(`\n  See public/DROP_ASSETS_HERE.md for where each comes from.`);
} else {
  console.log("  all expected files present");
}
if (placeholders.size) {
  console.log(`\n  ${placeholders.size} background(s) are still GRADIENT STAND-INS, not real artwork:`);
  for (const p of [...placeholders].sort()) console.log(`    - public/bg/${p}.webp`);
  console.log("  They render, but without the grid texture from the design.");
}
