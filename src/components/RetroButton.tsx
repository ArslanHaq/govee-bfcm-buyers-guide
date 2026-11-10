"use client";

import { motion, useReducedMotion } from "framer-motion";

type Variant = "next" | "back";

/**
 * The press reads as physical: the button travels into its own hard shadow
 * and springs back, rather than easing linearly. The offset shadow in this
 * design makes that the natural gesture — the face moves, the shadow stays.
 */
export function RetroButton({
  children,
  onClick,
  variant = "next",
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: Variant;
  disabled?: boolean;
}) {
  const reduced = useReducedMotion();
  const fill = variant === "next" ? "var(--next-fill)" : "var(--back-fill)";
  const text = variant === "next" ? "var(--next-text)" : "var(--back-text)";

  return (
    <motion.button
      type="button"
      className="retro-btn"
      onClick={onClick}
      disabled={disabled}
      style={{ background: fill, color: text, opacity: disabled ? 0.55 : 1 }}
      whileTap={
        disabled || reduced
          ? undefined
          : { x: -5, y: 6, scale: 0.94, boxShadow: "0px 0px 0px rgba(0,0,0,1)" }
      }
      transition={{ type: "spring", stiffness: 210, damping: 17, mass: 0.9 }}
    >
      {children}
    </motion.button>
  );
}
