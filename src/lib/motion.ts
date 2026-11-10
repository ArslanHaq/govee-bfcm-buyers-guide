import type { Transition } from "framer-motion";

/**
 * Motion language.
 *
 * All three Figma "animation" frames carry the same interaction stub —
 * After delay 800ms, Smart animate, Ease out, 800ms — with no destination
 * wired, so the transitions themselves were never authored. The easing and
 * the 800ms are taken from that stub.
 *
 * Question changes deliberately run shorter: 800ms plus an 800ms delay would
 * make each question take 1.6s, and the quiz promises "2-3 quick questions".
 * The long timing is kept for the cover and the result, where it is a moment
 * rather than a step. Flagged to the client as Q5.3.
 */

/** CSS ease-out, as a cubic bezier framer-motion accepts. */
export const EASE_OUT = [0, 0, 0.2, 1] as const;

export const HERO: Transition = { duration: 0.8, ease: EASE_OUT };
export const STEP: Transition = { duration: 0.4, ease: EASE_OUT };
export const QUICK: Transition = { duration: 0.24, ease: EASE_OUT };

/** Honours the OS "reduce motion" setting by collapsing every duration. */
export function still(t: Transition, reduced: boolean | null): Transition {
  return reduced ? { duration: 0 } : t;
}
