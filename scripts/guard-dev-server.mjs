/**
 * Refuses to run while a local `next dev` server is running.
 *
 * `next build` and `next dev` share the .next directory. Running a build (or
 * regenerating assets) while the dev server is up overwrites the chunks it is
 * serving, and the page then renders with no CSS and no hydration — it looks
 * blank or frozen, with nothing in either log to explain it.
 *
 * Only meaningful on a developer machine: CI builds in a clean container, so
 * the check is skipped there.
 */
import { execSync } from "node:child_process";

const CI =
  process.env.CI ||
  process.env.VERCEL ||
  process.env.GITHUB_ACTIONS ||
  process.env.NETLIFY ||
  process.env.CONTAINER;

if (CI) process.exit(0);

/**
 * Working directory of a process, or null if it cannot be read. Only a dev
 * server started from THIS project shares its .next; one belonging to another
 * project on the same machine is harmless and must not block the build.
 */
function cwdOf(pid) {
  try {
    const out = execSync(`lsof -a -p ${pid} -d cwd -Fn 2>/dev/null || true`, { encoding: "utf8" });
    const line = out.split("\n").find((l) => l.startsWith("n"));
    return line ? line.slice(1) : null;
  } catch {
    return null;
  }
}

let running = "";
try {
  // The bracket stops pgrep matching the shell that runs this very command:
  // that shell's own argv contains the pattern, which otherwise always hits.
  running = execSync(`pgrep -f 'next[ ]dev' || true`, { encoding: "utf8" })
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((pid) => Number(pid) !== process.pid && Number(pid) !== process.ppid)
    // Unknown cwd counts as ours: better a false stop than a corrupted .next.
    .filter((pid) => {
      const cwd = cwdOf(pid);
      return cwd === null || cwd === process.cwd();
    })
    .join(", ");
} catch {
  process.exit(0); // pgrep unavailable — nothing to check
}

if (running) {
  console.error(`\n✗ A \`next dev\` server is running (pid ${running}).`);
  console.error("  It shares .next with this command, and running both corrupts the");
  console.error("  dev server's chunks — the page loses its CSS and stops hydrating.\n");
  console.error("  Stop it first:   pkill -f 'next dev'");
  console.error("  Then re-run.     If the page is already broken: rm -rf .next\n");
  process.exit(1);
}
