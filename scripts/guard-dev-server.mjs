/**
 * Refuses to run while `next dev` is running.
 *
 * `next build` and `next dev` share the .next directory. Running a build (or
 * regenerating assets) while the dev server is up overwrites the chunks it is
 * serving, and the page then renders with no CSS and no hydration — it looks
 * blank or frozen, with nothing in either log to explain it. This cost us four
 * debugging rounds, so it is now a hard stop.
 */
import { execSync } from "node:child_process";

let running = "";
try {
  running = execSync("pgrep -f 'next dev' || true", { encoding: "utf8" }).trim();
} catch {
  process.exit(0); // pgrep unavailable — nothing to check
}

if (running) {
  console.error("\n✗ A `next dev` server is running (pid " + running.split("\n").join(", ") + ").");
  console.error("  It shares .next with this command, and running both corrupts the");
  console.error("  dev server's chunks — the page loses its CSS and stops hydrating.\n");
  console.error("  Stop it first:   pkill -f 'next dev'");
  console.error("  Then re-run.     If the page is already broken: rm -rf .next\n");
  process.exit(1);
}
