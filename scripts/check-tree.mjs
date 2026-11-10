/**
 * Walks every path through the decision tree and asserts it lands on the
 * result the Figma brief specifies ("1. Complete decision tree").
 *
 * The mapping is many-to-one — R3 and R4 are each reachable several ways —
 * so a typo in one `to:` is invisible by inspection. This catches it.
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const out = mkdtempSync(join(tmpdir(), "bfcm-tree-"));
try {
  execFileSync("npx", ["tsc", "src/lib/quiz.ts", "--outDir", out,
    "--module", "esnext", "--target", "es2020",
    "--moduleResolution", "bundler", "--skipLibCheck"], { stdio: "inherit" });

  const { QUESTIONS, RESULTS, FIRST_QUESTION } =
    await import(`file://${join(out, "quiz.js")}`);

  const EXPECTED = {
    "A>A": "r1", "A>B": "r2",
    "B>A": "r3", "B>B": "r3",
    "C>A": "r4", "C>B": "r4",
    "D>A": "r4",
    "D>B>A": "r3", "D>B>B": "r4", "D>B>C": "r5", "D>B>D": "r6",
  };

  const paths = [];
  (function walk(qid, trail) {
    for (const opt of QUESTIONS[qid].options) {
      const next = [...trail, opt.letter];
      if (opt.to.kind === "result") paths.push([next.join(">"), opt.to.id]);
      else walk(opt.to.id, next);
    }
  })(FIRST_QUESTION, []);

  let bad = 0;
  for (const [path, got] of paths) {
    const want = EXPECTED[path];
    if (want !== got) {
      console.error(`✗ ${path}: got ${got}, brief says ${want ?? "(no such path)"}`);
      bad++;
    }
  }
  for (const p of Object.keys(EXPECTED)) {
    if (!paths.some(([x]) => x === p)) {
      console.error(`✗ ${p} is in the brief but unreachable in code`);
      bad++;
    }
  }
  const reached = new Set(paths.map(([, r]) => r));
  for (const [id, r] of Object.entries(RESULTS)) {
    if (!reached.has(id)) { console.error(`✗ ${id} (${r.title}) unreachable`); bad++; }
  }

  if (bad) { console.error(`\nDecision tree check FAILED (${bad}).`); process.exit(1); }
  console.log(`✓ decision tree: ${paths.length} paths match the brief, ${reached.size}/6 results reachable`);
} finally {
  rmSync(out, { recursive: true, force: true });
}
