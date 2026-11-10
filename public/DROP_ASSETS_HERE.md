# Asset drop — round 2

The question screens (Q1, Q2A-D, Q3) are DONE. Nothing more needed for them.

What is still flattened is the **cover** and the **six results**. Each is
currently one PNG of the whole frame, which causes three problems:

  * the button is drawn into the image, so pressing the live button on top
    reveals the baked one underneath — two buttons;
  * the image cannot cover the viewport without the baked button drifting out
    of line, so those screens letterbox on tall phones;
  * nothing inside can animate separately, because it is one flat picture.

Fixing all three needs each frame split into **background** and **artwork**.

## Per screen, two exports

For the cover and each result frame on the `design` page:

### A. The background  ->  public/bg/
Select the frame. In the right panel under **Image**, click the file name link
(e.g. `image.png`) to download the original.

| Frame     | Save as                |
| --------- | ---------------------- |
| cover     | public/bg/cover.png    |
| result #1 | public/bg/r1.png       |
| result #2 | public/bg/r2.png       |
| result #3 | public/bg/r3.png       |
| result #4 | public/bg/r4.png       |
| result #5 | public/bg/r5.png       |
| result #6 | public/bg/r6.png       |

### B. The artwork, without the button  ->  public/art/
Expand the frame in the left layers panel. Select **every child layer except
the button** (click the first, shift-click the last, then cmd-click the button
to deselect it). Then right panel -> Export -> `+` -> **SVG** -> Export.

The frame's background is an image *fill* on the frame itself, not a child
layer, so selecting the children automatically excludes it. You should get a
transparent SVG.

| Frame     | Save as                |
| --------- | ---------------------- |
| cover     | public/art/cover.svg   |
| result #1 | public/art/r1.svg      |
| result #2 | public/art/r2.svg      |
| result #3 | public/art/r3.svg      |
| result #4 | public/art/r4.svg      |
| result #5 | public/art/r5.svg      |
| result #6 | public/art/r6.svg      |

Use the LEFT "result #4" (pink/rose). The right-hand one is a duplicate.

**If SVG export is greyed out or the file looks wrong**, export the same
selection as **PNG at 2x** instead and name it `.png` — it still fixes the
button and the letterbox, just without vector crispness.

## Then

```
npm run assets
```

It converts, reports anything missing, and clears Next's image cache.

## Why not ask for every element separately

Exporting the headline, ribbon, product, badge and sticker as ~40 individual
files would be a long afternoon. One SVG per screen keeps Figma's layer names
as group ids inside the file, so individual pieces can still be animated
without exporting them one by one.
