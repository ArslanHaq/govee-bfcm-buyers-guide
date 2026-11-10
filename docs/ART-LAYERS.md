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

The layer SVGs carry no coordinates. Each was rasterised and matched against
the original 390x720 frame render; the offset with the best colour agreement
over the layer's opaque pixels is its position. Two needed hand correction:

* the Govee logo matched a light patch of background — set to its known
  x153 y24 from the Figma design context;
* the description is white type, which defeats colour matching — placed from
  the measured text bands (y266-276 and y285-295), centred.

Shared layers (badge, ribbon, chip, cursor) carry the same Figma group id in
all six results and sit at identical positions, so r1's anchors apply to all.
Per-result layers (headline, description, product, sticker) are centred
horizontally at r1's y.

Seven small decorative layers could not be matched — the r2 marks, r3 arrows,
r4 hearts, r5 stars. They are placed from scaled screen captures and carry
`estimated: true` in `src/lib/art-layers.ts`. **Those need a visual check.**

## Weight

The exports needed two fixes to fit the budget:

* the Govee logo shipped seven times at 49 KB each, every copy wrapping an
  embedded raster — 343 KB of duplication. It is now one shared
  `/icons/govee.png` at 21 KB, which also lets it persist across transitions.
* the product layers were base64 rasters inside SVG wrappers (57-107 KB each).
  Converted to WebP at 2x: 16-40 KB, saving 334 KB.

## Still outstanding

The **cover** cannot be composed yet. Its export is missing three layers:

1. the pixel headline "Build Your Perfect Holiday Setup"
2. the sub-head line
3. the blue starburst shape (only the "UP TO 53% OFF" type came through)

Until they arrive the cover falls back to the flattened frame, so it
letterboxes and its press animation is suppressed.
