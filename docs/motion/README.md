# Motion reference

Drop screen recordings of the Figma prototype here. Name them after the
screen, e.g. `cover-cursor.mov`, `result-button.mov`.

## Why recordings and not the prototype itself

The prototype could not be read programmatically:

* the three "animation" frames (`cover - animation` 131:1164,
  `answer button press animation` 131:1244, `result - button animation`
  131:1307) are **byte-identical** to their static counterparts — a pixel
  diff of `131:1244` against `Q1` returns 0 differing pixels out of 280,800;
* every one of their interactions reads **After delay 800ms → Smart animate,
  Ease out, 800ms** with **Navigate to: None**, so there is no destination
  frame to interpolate toward;
* sampling the prototype's canvas from first paint for 14s, and again for
  16s after load, produced zero changed pixels.

So whatever motion is visible when a person plays it is not recoverable from
the file. A recording is the only reliable source.

## Measured from the recordings (2026-11-10)

Two clips were supplied and analysed frame by frame at 15fps. Both were
filmed off a screen, so every measurement is taken RELATIVE to a fixed
element in the same frame to cancel camera shake.

### Result CTA — scale pulse, not a blink

Tracking the button's pink bounding box while the green tree acts as the
control:

| | width | scale |
| --- | --- | --- |
| tree (control) | 293x455 ±4px all clip | fixed |
| button | 311x63 → 259x53 → 311x63 | 1.00 → 0.83 → 1.00 |

Luminance only varied 190→198 (4%), which is screen-refresh beat, not a
fade. Steady-state period ~530ms, continuous, no pause.

### Cover cursor — a slow float; the Start button does not move

Cursor position measured relative to the Start button's centroid:

| | range |
| --- | --- |
| button drift (camera) | x 6.7px, y 4.9px |
| cursor relative to button | x 9.1px, y 21.8px |

The button holds scale 1.000 for the whole clip — only the cursor moves. It
drifts roughly 6px right and 5px up and back on a ~1.6s cycle, continuously.
Video is 1.34x the design scale, so amplitudes are converted accordingly.

## Current implementation

| Element | Behaviour | Source |
| --- | --- | --- |
| Cover cursor | +6x / −5y float, 1.6s, continuous | measured |
| Cover Start button | static after fade-in | measured |
| Result CTA | scale 1.0 ↔ 0.83, 0.53s, continuous | measured |
| Option select | press to scale 0.90, springs back | from the client's description |
| Buttons | press to −5x/+6y and scale 0.94 | from the client's description |
| Question change | window recolours in place, Next slides centre → right | Smart Animate behaviour |
