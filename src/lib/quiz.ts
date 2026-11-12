/**
 * The BFCM Buyer's Guide decision tree.
 *
 * Source of truth: Figma "brief + inspo" page — "1. Complete decision tree"
 * and "2. Six final result designs — full copy".
 *
 * Depth varies: the tree/outdoor/indoor paths ask 2 questions, the
 * multi-space path asks 3. Navigation therefore walks a path stack rather
 * than incrementing an index.
 */

export type QuestionId = "q1" | "q2a" | "q2b" | "q2c" | "q2d" | "q3";
/**
 * r4b is the second version of Result 4 (Govee Floor Lamp 3). Same screen,
 * different product: the brief sends "A Cozy Little Upgrade" there and every
 * other Result 4 path to the Uplighter Floor Lamp.
 */
export type ResultId = "r1" | "r2" | "r3" | "r4" | "r4b" | "r5" | "r6";
export type OptionLetter = "A" | "B" | "C" | "D";

/** Where answering an option leads: another question, or a result. */
export type Destination =
  | { kind: "question"; id: QuestionId }
  | { kind: "result"; id: ResultId };

export interface QuizOption {
  letter: OptionLetter;
  text: string;
  to: Destination;
}

export interface Question {
  id: QuestionId;
  /** The "Q1." / "Q2." / "Q3." eyebrow — not the position in the path. */
  label: string;
  /** Full question, used for the accessible name. */
  text: string;
  /**
   * The design sets each question on exactly two lines, and the break point
   * differs per question (q1 wraps at 272px, q2d needs the full 318px). The
   * copy is fixed, so the break is carried here rather than reverse-engineered
   * from a per-question width.
   */
  lines: [string, string];
  options: QuizOption[];
}

const q = (id: QuestionId): Destination => ({ kind: "question", id });
const r = (id: ResultId): Destination => ({ kind: "result", id });

export const QUESTIONS: Record<QuestionId, Question> = {
  q1: {
    id: "q1",
    label: "Q1.",
    text: "Where are you lighting up?",
    lines: ["Where are you", "lighting up?"],
    options: [
      { letter: "A", text: "Christmas Tree", to: q("q2a") },
      { letter: "B", text: "Outdoor", to: q("q2b") },
      { letter: "C", text: "Indoor", to: q("q2c") },
      { letter: "D", text: "Multiple Spaces", to: q("q2d") },
    ],
  },
  q2a: {
    id: "q2a",
    label: "Q2.",
    text: "What's your tree lighting style?",
    lines: ["What's your tree", "lighting style?"],
    options: [
      { letter: "A", text: "Full Christmas Tree Makeover", to: r("r1") },
      { letter: "B", text: "Extra Sparkle & Color", to: r("r2") },
    ],
  },
  q2b: {
    id: "q2b",
    label: "Q2.",
    text: "How big do you want to go?",
    lines: ["How big do you want", "to go?"],
    options: [
      { letter: "A", text: "The Whole House", to: r("r3") },
      { letter: "B", text: "One Special Outdoor Spot", to: r("r3") },
    ],
  },
  q2c: {
    id: "q2c",
    label: "Q2.",
    text: "What kind of glow are you after?",
    lines: ["What kind of glow are", "you after?"],
    options: [
      { letter: "A", text: "Full Room Transformation", to: r("r4") },
      { letter: "B", text: "A Cozy Little Upgrade", to: r("r4b") },
    ],
  },
  q2d: {
    id: "q2d",
    label: "Q2.",
    text: "How much of your home are you ready to light up?",
    lines: ["How much of your home", "are you ready to light up?"],
    options: [
      { letter: "A", text: "A Few Favorite Spaces", to: r("r4") },
      { letter: "B", text: "The Whole Home", to: q("q3") },
    ],
  },
  q3: {
    id: "q3",
    label: "Q3.",
    text: "What's Your Holiday Priority?",
    lines: ["What's Your Holiday", "Priority?"],
    options: [
      { letter: "A", text: "Make the Outside Stand Out", to: r("r3") },
      { letter: "B", text: "Create the Perfect Indoor Atmosphere", to: r("r4") },
      { letter: "C", text: "Welcome Guests Inside & Out", to: r("r5") },
      { letter: "D", text: "I Want It All!", to: r("r6") },
    ],
  },
};

export interface Result {
  id: ResultId;
  /** Display index shown as "RESULT n" in the brief. */
  index: number;
  title: string;
  /** Govee SKUs this result recommends. */
  skus: string[];
  /** Customer-facing product names, as printed in the result frames. */
  products: string[];
  bestFor: string;
  /** The "Why you'll love it" line. */
  description: string;
  /** Button label. Every result frame shows the same one. */
  cta: string;
  /** Discount shown on that result's sticker. Differs per result. */
  discount: string;
  /**
   * The full 2x frame export. The result screens carry no live state, so the
   * artwork ships as one plate and only the button is rendered over it.
   */
  plate: string;
  /** Button fill, measured per result frame. */
  ctaFill: string;
  /**
   * Button label colour. Five results use the dark outline colour; r4's teal
   * fill carries light text instead, so this cannot be derived from
   * luminance — it is measured per frame.
   */
  ctaText: string;
  /**
   * Destination for this result's button, from the links placed under each
   * result frame in Figma (12 Nov). Falls back to CAMPAIGN.shopUrl where the
   * file has none yet (r5, r6).
   */
  shopUrl?: string;
  /**
   * Result whose background and edge colours this one reuses. r4b is the same
   * screen as r4 with a different product, so it has no artwork of its own.
   */
  art?: ResultId;
}

export const RESULTS: Record<ResultId, Result> = {
  r1: {
    id: "r1",
    index: 1,
    title: "The Tree Showstopper",
    skus: ["H70C5"],
    bestFor: "Full Christmas tree transformation",
    description:
      "Turn your Christmas tree into the centerpiece of every holiday celebration.",
    cta: "Shop Lights",
    products: ["Christmas String Lights 2"],
    discount: "30%",
    plate: "/plates/r1.webp",
    shopUrl: "https://us.govee.com/products/christmas-string-lights-2",
    ctaFill: "#F9C0C7",
    ctaText: "#372A37",
  },
  r2: {
    id: "r2",
    index: 2,
    title: "The Festive Sparkle",
    skus: ["H6841"],
    bestFor: "Extra color and holiday sparkle",
    description: "Add vibrant color and personality to your Christmas tree.",
    cta: "Shop Lights",
    products: ["Cone Tree Lights"],
    discount: "31%",
    plate: "/plates/r2.webp",
    shopUrl: "https://us.govee.com/products/govee-cone-tree-lights",
    ctaFill: "#F9C0C7",
    ctaText: "#372A37",
  },
  r3: {
    id: "r3",
    index: 3,
    title: "The Home Showstopper",
    skus: ["H706C"],
    bestFor: "Outdoor holiday decorating",
    description:
      "Give your home a festive glow that makes every arrival feel special.",
    cta: "Shop Lights",
    products: ["Outdoor Lights Pro"],
    discount: "40%",
    plate: "/plates/r3.webp",
    // As placed under the result #3 frame, although its chip says
    // "Outdoor Lights Pro".
    shopUrl: "https://us.govee.com/products/govee-rgbicww-led-permanent-outdoor-lights",
    ctaFill: "#ECA315",
    ctaText: "#372A37",
  },
  r4: {
    id: "r4",
    index: 4,
    title: "The Indoor Mood Maker",
    // Figma frame 148:633. Reached from Full Room Transformation, A Few
    // Favorite Spaces and Create the Perfect Indoor Atmosphere.
    skus: ["H60B0"],
    bestFor: "Cozy rooms and holiday gatherings",
    description:
      "Create a warm, immersive atmosphere for memorable moments together.",
    cta: "Shop Lights",
    products: ["Uplighter Floor Lamp"],
    discount: "30%",
    plate: "/plates/r4.webp",
    shopUrl: "https://us.govee.com/products/govee-uplighter-floor-lamp",
    ctaFill: "#507F77",
    ctaText: "#F8F8F8",
  },
  r4b: {
    id: "r4b",
    index: 4,
    title: "The Indoor Mood Maker",
    // Figma frame 148:810. Client update 12 Nov: "A Cozy Little Upgrade" ->
    // H16B0 Floor Lamp 3 (decision tree edit, comments #24/#25).
    skus: ["H16B0"],
    bestFor: "Cozy rooms and holiday gatherings",
    description:
      "Create a warm, immersive atmosphere for memorable moments together.",
    cta: "Shop Lights",
    products: ["Govee Floor Lamp 3"],
    discount: "30%",
    plate: "/plates/r4.webp",
    shopUrl: "https://us.govee.com/products/govee-floor-lamp-3",
    art: "r4",
    ctaFill: "#507F77",
    ctaText: "#F8F8F8",
  },
  r5: {
    id: "r5",
    index: 5,
    title: "The Holiday Host",
    skus: ["H706C", "H60B0"],
    bestFor: "Indoor and outdoor holiday setups",
    description:
      "Welcome guests with a festive exterior and keep the celebration glowing inside.",
    cta: "Shop Lights",
    products: ["Permanent Outdoor Lights", "Uplighter Floor Lamp"],
    discount: "40%",
    plate: "/plates/r5.webp",
    ctaFill: "#8EB04F",
    ctaText: "#372A37",
  },
  r6: {
    id: "r6",
    index: 6,
    title: "The Ultimate Holiday Home",
    skus: ["H706C", "H60B0", "H70C5"],
    bestFor: "Complete holiday transformation",
    description:
      "Light up your Christmas tree, gathering spaces, and home's exterior.",
    cta: "Shop Lights",
    products: ["Permanent Outdoor Lights", "Uplighter Floor Lamp", "String Lights 2"],
    discount: "40%",
    plate: "/plates/r6.webp",
    ctaFill: "#BC9AF0",
    ctaText: "#372A37",
  },
};

export const FIRST_QUESTION: QuestionId = "q1";

/** Campaign copy, from the brief. Kept here so dates/offers are a one-line edit. */
export const CAMPAIGN = {
  /**
   * TODO: replace with the BFCM collection page. The brief and the design
   * give no destination URLs, so every result currently points here.
   * Override at deploy time with NEXT_PUBLIC_SHOP_URL.
   */
  shopUrl: process.env.NEXT_PUBLIC_SHOP_URL ?? "https://us.govee.com/",
  startsLabel: "STARTS",
  startsDate: "NOV 19",
  discount: "UP TO 53% OFF",
  coverSubhead:
    "Not sure which lights are right for your home? We've got you!",
} as const;
