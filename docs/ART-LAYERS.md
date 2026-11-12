# Layered artwork

The cover and the six results are composed from the individual Figma layer
exports, not from a flattened frame. That is what makes three things possible
at once:

| | Flattened frame | Layered |
| --- | --- | --- |
| Button | drawn into the image, so the live button on top showed a twin when pressed | real DOM, no twin |
| Height on tall phones | letterboxed — the image could not cover the viewport without the baked button drifting out of line | background covers, UI stays on the 390x720 canvas |
| Motion | one flat picture, nothing could move separately | every layer animates on its own |

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
* r4's chip ("Govee Floor Lamp 3") and left-facing sticker, and r5's
  three-line chip, are cut from the 4x frame export: the text is outlined in
  Figma, so there is no editable source to re-export.

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
