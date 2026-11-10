# Govee BFCM Interactive Buyer's Guide

"Build Your Perfect Holiday Setup" — a mobile-only, 390×720 interactive buyer's
guide in a retro Y2K / pixel aesthetic.

**Figma:** [Govee BFCM Buyer's Guide](https://www.figma.com/design/2V4PdPDue3uOiqG6d9pleW/Govee-BFCM-Buyer-s-Guide?node-id=131-1486)
(the `design` page is current; `quiz` is an earlier iteration).

> **Launch date conflict — needs a decision.** The brief says *Launch Nov 13–14*
> and *up to 42% off*; the cover design says **STARTS NOV 19** and **UP TO 53% OFF**.
> The code follows the design. Both live in `CAMPAIGN` in `src/lib/quiz.ts`.

## Why this is a separate repo

The predecessor (`Grovvy-Quiz-web-app`, the Floor Lamp Personality Quiz) is a
different campaign with a different data model. It also carries a 571 MB `.git`
from committed source-resolution PNGs, and its CI is hardwired to one ECS
service. Branching would have inherited all three. See `docs/SECURITY.md`.

## Flow

```
Cover → Q1 ─┬─ A Christmas Tree  → Q2A ─┬─ R1 Tree Showstopper
            │                           └─ R2 Festive Sparkle
            ├─ B Outdoor         → Q2B ──── R3 Home Showstopper (both options)
            ├─ C Indoor          → Q2C ──── R4 Indoor Mood Maker (both options)
            └─ D Multiple Spaces → Q2D ─┬─ A → R4 Indoor Mood Maker
                                        └─ B → Q3 ─┬─ A → R3 Home Showstopper
                                                   ├─ B → R4 Indoor Mood Maker
                                                   ├─ C → R5 Holiday Host
                                                   └─ D → R6 Ultimate Holiday Home
```

Depth varies (2 or 3 questions), so `QuizEngine` walks a **path stack** rather
than an index — Back pops the stack. `npm run check:tree` asserts all 11 paths
against the brief; the R3/R4 convergence makes a typo invisible by eye.

## Architecture

One window geometry serves all nine screens. `RetroWindow` holds the exact
vector paths exported from Figma (notch, radii, 2.6px outline) with the baked
fills stripped; colour comes from CSS custom properties set per screen by
`THEMES` in `src/lib/theme.ts`. Three values are identical on every screen and
live in `CHROME`: border `#372A37`, field `#FDF1E6`, text `#F8F8F8`.

**Vertical anchoring.** The stage is pinned to the TOP, not centred. Centring
split the leftover height into equal bands, so on a tall phone the
composition started ~60px down. Scaling from `top center` keeps the artwork
identical from the top on every screen and lets all the slack fall below the
buttons, where the background simply continues.

**Pixel fidelity.** The design is a fixed 390×720 canvas. `.stage` is that box
scaled by a unitless `--s` set from JS (`Stage.tsx`) — CSS cannot divide two
lengths into the `<number>` `scale()` needs, and `min(100vw/390, …)` silently
yields a length that makes the transform a no-op. Everything inside is authored
in literal design pixels. The background lives *inside* the stage so artwork and
content stay locked together; letterbox bands take the sampled edge colours.

Verified against the Figma render: window `x16 y77 358×534.53`, content
`x36 y190.55 w318`, answer rows 58px at a 72px pitch, checkbox 23px at x321,
button box `y627 h55` with a `-5px 6px` shadow.

Two traps worth knowing: the answer divider is a **zero-height** node in Figma
with the rule overflowing it (a 1px-tall divider adds 1px to every row pitch),
and Figma's `leading: normal` on Gotham is 1.2 while the browser computes
~1.208 — enough to drift the content block a pixel.

## Assets

Backgrounds are real artwork (bespoke mesh gradients over a non-repeating
perspective grid), so they ship as 2× WebP at ~77 KB each — reproducing them in
CSS would be less faithful, not more. Everything else is CSS or inline SVG.
Budget: no asset over 200 KB, `public/` under 2 MB, enforced by
`npm run check:assets`.

### Assets

All 13 screens use the real Figma artwork, delivered 2026-11-10.

The cover and the six results carry no live state beyond one button, so each
ships as a single 2x frame export with a real button laid over the one drawn
into the artwork — the label stays live and the control stays a proper link.
The question screens need live text and answer state, so their background is
the full frame with our own card drawn over the baked one at identical
coordinates.

Exports are served exactly as authored (`unoptimized`): they are already
780x1440 WebP, so routing them through the image optimizer would only add a
second lossy pass.

To replace any of them: drop the PNG into `public/plates` or `public/bg` and
run `npm run assets`. Source PNGs are gitignored; only the WebP is committed.
That script also clears `.next/cache/images`, which otherwise keeps serving
the previous bytes for the same path.

| Group | Files | Shipped size |
| --- | --- | --- |
| `plates/` cover + r1-r6 | 7 | 51-100 KB each |
| `bg/` q1-q3 | 6 | 48-104 KB each |
| fonts | 3 | 91 KB total |
| **public/ total** | | **849 KB** |

## Motion

All three Figma "animation" frames carry the same interaction stub —
**After delay 800ms → Smart animate, Ease out, 800ms** — with no destination
wired, so the transitions themselves are unspecified. The timing language is
implemented; question transitions use 400ms ease-out, because 800ms + an 800ms
delay would make each question take 1.6s. Confirm with the designer.

## Commands

> **Stop the dev server before `npm run assets`.** Regenerating files while
> Next is watching corrupts its webpack cache — the page renders but never
> hydrates, so it looks blank or unresponsive. If that happens:
> `pkill -f "next dev" && rm -rf .next && npm run dev`.


```
npm run dev     # localhost:3000
npm run check   # integrity + assets + tree + typecheck
npm run build
```

## Decisions taken

- **No email capture.** The design goes result → "Shop Lights"; no `/user-form`
  or Klaviyo step was carried over.
- **Mobile only**, matching the 390×720 design.
