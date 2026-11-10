// Fails the build if a config file has been tampered with.
// Written after an obfuscated blockchain-C2 dropper was found appended to
// next.config.js / tailwind.config.js in the predecessor repo (Nov 2026).
import { readFileSync, existsSync } from "node:fs";

const GUARDED = ["next.config.js", "postcss.config.mjs", "tsconfig.json"];
const MAX_BYTES = 2048;

// Signatures of the injector family found previously, plus generic red flags.
const SIGNATURES = [
  /global\s*\[\s*["']!["']\s*\]/,
  /_\$_[a-z0-9]+/i,
  /\bFunction\s*\(\s*["'][^"']*["']\s*,/,
  /child_process["']\s*\]\s*\[\s*["']spawn/,
  /trongrid\.io|aptoslabs\.com|bsc-dataseed|publicnode\.com/i,
  /eth_getTransactionByHash/,
];

let failed = false;
for (const file of GUARDED) {
  if (!existsSync(file)) continue;
  const src = readFileSync(file, "utf8");

  if (src.length > MAX_BYTES) {
    console.error(`✗ ${file}: ${src.length} bytes exceeds ${MAX_BYTES}. Config files are small — inspect for appended code.`);
    failed = true;
  }
  for (const re of SIGNATURES) {
    if (re.test(src)) {
      console.error(`✗ ${file}: matches injection signature ${re}`);
      failed = true;
    }
  }
  // Payloads hide past a wall of whitespace on one line.
  for (const [i, line] of src.split("\n").entries()) {
    if (line.length > 500) {
      console.error(`✗ ${file}:${i + 1}: line is ${line.length} chars — payloads hide behind padding.`);
      failed = true;
    }
  }
}

if (failed) {
  console.error("\nIntegrity check FAILED.");
  process.exit(1);
}
console.log("✓ integrity check passed");
