// Enforces the asset budget. The predecessor repo reached a 571 MB .git
// because source-resolution PNGs were committed (single files up to 12 MB).
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

// 400 KB per asset: full-screen backgrounds at 3x (what an iPhone needs)
// land at 150-270 KB, the desktop background at 2x (retina laptops) at
// 370 KB. Source-resolution exports are 1-12 MB, still caught.
const MAX_FILE = 400 * 1024;
// 4.5 MB for public/ overall (3x art for iPhones, 22 Nov; 2.5 MB from 19 Nov): the final design
// added a photo to every result (three on r6), plus the desktop page. A
// visitor only ever loads one result, so what one person downloads is still
// a few hundred KB; this cap exists to stop source-resolution exports
// creeping into the repo, which a per-file limit already guards.
const MAX_TOTAL = 4.5 * 1024 * 1024;
const EXEMPT = /\.(woff2?|otf|ttf)$/i; // fonts are licensed binaries, budgeted separately
// Figma source exports. Gitignored and never served — `npm run assets`
// turns them into the .webp the app actually loads.
const SOURCES = /^public\/(plates|bg|art)\/.+\.(png|jpe?g|tiff?)$/i;

let total = 0;
const oversized = [];

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) { walk(p); continue; }
    const size = statSync(p).size;
    if (EXEMPT.test(entry.name)) continue;
    if (SOURCES.test(p)) continue;
    total += size;
    if (size > MAX_FILE) oversized.push([p, size]);
  }
}
walk("public");

for (const [p, size] of oversized) {
  console.error(`✗ ${p} is ${(size / 1024).toFixed(0)} KB (limit ${MAX_FILE / 1024} KB)`);
}
if (total > MAX_TOTAL) {
  console.error(`✗ public/ totals ${(total / 1024 / 1024).toFixed(2)} MB (limit ${MAX_TOTAL / 1024 / 1024} MB)`);
}
if (oversized.length || total > MAX_TOTAL) {
  console.error("\nAsset budget FAILED. Re-export at 2x and compress to WebP/AVIF.");
  process.exit(1);
}
console.log(`✓ asset budget passed — public/ is ${(total / 1024).toFixed(0)} KB`);
