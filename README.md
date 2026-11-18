# Govee BFCM Interactive Buyer's Guide

"Build Your Perfect Holiday Setup" — a mobile-only interactive buyer's guide in
a retro Y2K / pixel aesthetic. The cover and questions are a fixed 390×720
screen; each result is a 390×1180 page that scrolls (client design, 18 Nov).

**Figma:** [Govee BFCM Buyer's Guide](https://www.figma.com/design/2V4PdPDue3uOiqG6d9pleW/Govee-BFCM-Buyer-s-Guide?node-id=131-1486)
(the `final design` page is current; `quiz` is an earlier iteration).

> **Offer:** **UP TO 40% OFF** on the start screen and the desktop page
> (decided 18 Nov; the designs had 53% and 42%). The figures were redrawn in
> the artwork's own type: Gotham Bold on the start screen, the pixel face on
> desktop. The start date is the design's **STARTS NOV 19** (the brief said
> Nov 13–14). Both live in `CAMPAIGN` in `src/lib/quiz.ts`.

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
            ├─ C Indoor          → Q2C ─┬─ A → R4  Indoor Mood Maker (Uplighter Floor Lamp)
            │                           └─ B → R4b Indoor Mood Maker (Govee Floor Lamp 3)
            └─ D Multiple Spaces → Q2D ─┬─ A → R4 Indoor Mood Maker
                                        └─ B → Q3 ─┬─ A → R3 Home Showstopper
                                                   ├─ B → R4 Indoor Mood Maker
                                                   ├─ C → R5 Holiday Host
                                                   └─ D → R6 Ultimate Holiday Home
```

Depth varies (2 or 3 questions), so `QuizEngine` walks a **path stack** rather
than an index — Back pops the stack. `npm run check:tree` asserts all 11 paths
against the brief; the R3/R4 convergence makes a typo invisible by eye.

R4 has two versions on the same screen: R4 (Uplighter Floor Lamp, H60B0)
for every R4 path except "A Cozy Little Upgrade", which gets R4b (Floor
Lamp 3, H16B0). Each result's Shop Lights link is the Amazon URL placed under
its Figma frame (client, 18 Nov): product pages for R1–R4b, Govee store pages
for R5 and R6, which recommend several products.

### Result pages

Below the match, each result has "Explore Your Match ↓" (scrolls to the
photo), a photo of the lights in a real room inside a browser window, a
"Your Match" chip naming the product, then Shop Lights. The page is scaled to
the screen width (`--sw`) and scrolls inside `.result-screen`; html/body stay
fixed so the browser-bar tinting keeps working. The window frame is drawn by
`PhotoWindow.tsx` from Figma's own paths, in each result's accent colour.

### Desktop

Above 768px the quiz shows the Figma "Desktop" frame: a hand-off page asking
people to open the quiz on their phone, with an "Explore Govee" link
(`CAMPAIGN.shopUrl`). It keeps the design's composition at any window size and
only shrinks when the window is too small to show all of it.

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

All 13 screens use the real Figma artwork. The cover and results are composed
from individual layer exports (see `docs/ART-LAYERS.md`), with a live button
on top. Result backgrounds carry Figma's image adjustments baked in, measured
from 4x frame exports on 12 Nov.

Exports are served exactly as authored (`unoptimized`): they are already
780x1440 WebP, so routing them through the image optimizer would only add a
second lossy pass.

To replace a background: drop the PNG into `public/bg` and run
`npm run assets`. Source PNGs are gitignored; only the WebP is committed.
That script also clears `.next/cache/images`, which otherwise keeps serving
the previous bytes for the same path.

Asset filenames must be plain (letters, digits, spaces, `-`, `_`, `.`).
`next start`, which the Docker image runs, answers 404 for a path containing a
comma or apostrophe, even though Vercel serves it.

### Browser bars

Safari 26 colours its status bar and toolbar from the page, sampling a
full-viewport `position: fixed` element once at load and never again. That
froze the bars in the cover's colours for the whole quiz. Screens are
therefore `position: absolute`, and `BrowserTint.tsx` publishes each screen's
edge colours to two thin fixed edges, the page background and `theme-color`.
Verified in the iOS 26.2 simulator. The result pages scroll, so there the
bars follow the background under them, from colours sampled every 20 design
px down each page (`src/lib/result-tint.ts`).

### QA link

`?screen=cover|q1|q2a|q2b|q2c|q2d|q3|r1…r6|r4b` opens that screen directly, for
reviewing one screen on a phone without tapping through the quiz.
`?view=desktop` shows the desktop page at any width.

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
- **Mobile only.** Desktop gets the design's hand-off page instead of the quiz.
