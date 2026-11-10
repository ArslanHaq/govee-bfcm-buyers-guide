// Enforces the asset budget. The predecessor repo reached a 571 MB .git
// because source-resolution PNGs were committed (single files up to 12 MB).
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const MAX_FILE = 200 * 1024;      // 200 KB per asset
const MAX_TOTAL = 2 * 1024 * 1024; // 2 MB for public/ overall
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
