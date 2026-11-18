# Layered artwork

The cover and the six results are composed from the individual Figma layer
exports, not from a flattened frame. That is what makes three things possible
at once:

| | Flattened frame | Layered |
| --- | --- | --- |
| Button | drawn into the image, so the live button on top showed a twin when pressed | real DOM, no twin |
| Height on tall phones | letterboxed — the image could not cover the viewport without the baked button drifting out of line | background covers, UI stays on the 390x720 canvas |
| Motion | one flat picture, nothing could move separately | every layer animates on its own |

## Result pages (18 Nov 2026)

The client's final design made each result a 390x1180 page that scrolls, with
a photo section under the match. Frames: result #1 427:1685, #2 427:1746,
#3 427:1805, #4 427:1919 (Uplighter), #4b 427:2051 (Floor Lamp 3), #5 427:2183,
#6 427:2297.

* **Top half: same layers, re-located.** Every reused layer was rendered at 4x
  and matched against a 4x export of the new frame. Most moved by 0-0.5px;
  r1's product went up 3px, r2's plus up 8px, the cursors settled at
  (322.5, 182.25) except r1 and r3, and r1's logo stays at y24 (the other five
  are at y34).
* **New "Best for" chip** where the old "Your Match" chip was, and **r1/r2
  stickers** that changed shape or side: cut from the 4x frames.
* **Below the fold:** "Explore Your Match" (the words are one white matte,
  identical on every result; the arrow is Figma's 24px "Arrow down" vector so
  it can bounce, which was added on request and is not in the design), lower decor (the same SVGs as the top; r5's smaller mirrored stars
  are cut from the frame), the photo window (`PhotoWindow.tsx`, drawn from the
  frame's own vector paths), the photo (the band between the window's bars,
  from the 4x export, at 2x), and the "Your Match" chip.
* **Backgrounds** are the same toned 1200px fills, cropped to 390:1180 at
  their native size. r2's fill is offset in Figma ("Crop", x0 = 560 of 1200);
  the rest are centred. `npm run assets` reproduces them.
* A solid single-colour mark (r1's sparkle, r2's x and plus) is placed from
  its exact outline against the known background, not by template matching:
  matching puts it inside any larger patch of its colour (the tree-top burst,
  the window's title bar).

Verified by rendering each page at 390x1180 @2x and diffing against the 4x
export: 3.5-7.5% of pixels differ by more than 24/255, nearly all of it text
anti-aliasing and photo detail.

## How positions were derived

The layer SVGs carry no coordinates, so every position is measured.

**Results (re-measured 12 Nov 2026).** Each result frame was exported from
Figma at 4x and every layer matched against it (alpha-weighted SSD, searched
over the whole frame, refined to a quarter of a design pixel). Small decor is
searched only inside the illustration area, since a solid mark otherwise
matches any flat patch of its own colour on the ribbon or button.

The first build assumed the shared layers sat at r1's coordinates on every
result. They do not: r3 and r4 put the chip on the right and the sticker on
the left, products sit up to 14px off r1's y, and the r5 cursor is elsewhere.
All of that is now taken from the frames.

* The Govee logo on the results is at **y34**, not the y24 of the cover and
  questions (`.result-screen .govee-logo`).
* r1 has a second, identical sparkle. Figma's zip export merges same-named
  layers, so `Vector.svg` is placed twice.
* Chips are cut from the 4x frame export: the text is outlined in Figma, so
  there is no editable source to re-export.

**Cover.** Matched against its 390x720 render. The logo was set to its known
x153 y24 from the Figma design context.

## Result backgrounds

Each result frame fills with a 1200x1200 image, but Figma renders it through
image adjustments that a plain export of the image does not include. The
shipped build used the raw images, so r2-r6 were visibly more saturated than
the design (r5 orange instead of tan, r4 coral instead of dusty rose).

The mapping Figma applies was learned per result from the background pixels
of the 4x frame export (a cubic colour fit, outliers = artwork rejected) and
baked into `public/bg/rN.png`, from which the WebP is made. Re-rendered, the
toned image matches the frame to a median of 1-2/255.

**r6's image fill is rotated 180 degrees** in Figma. The baked r6 background
includes the rotation.

To redo one: export the frame at 4x, download its image fill (click the image
name in the Properties panel), and fit the first to the second.

## Weight

The exports needed two fixes to fit the budget:

* the Govee logo shipped seven times at 49 KB each, every copy wrapping an
  embedded raster — 343 KB of duplication. It is now one shared
  `/icons/govee.png` at 21 KB, which also lets it persist across transitions.
* the product layers were base64 rasters inside SVG wrappers (57-107 KB each).
  Converted to WebP at 2x: 16-40 KB, saving 334 KB.
