"use client";

import { Fragment } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { QUICK, still } from "@/lib/motion";
import type { QuizOption } from "@/lib/quiz";
import { Checkmark } from "./icons";

export function AnswerList({
  options,
  selected,
  onSelect,
}: {
  options: QuizOption[];
  selected: string | null;
  onSelect: (letter: string) => void;
}) {
  const reduced = useReducedMotion();
  return (
    <div className="answer-list" role="radiogroup">
      {options.map((opt, i) => (
        <Fragment key={opt.letter}>
          {i > 0 && <hr className="answer-divider" />}
          {/* Pressing an option should feel like pressure on it — it sinks
              in and springs back, matching the buttons' physical language. */}
          <motion.button
            type="button"
            role="radio"
            aria-checked={selected === opt.letter}
            className="answer-row"
            onClick={() => onSelect(opt.letter)}
            whileTap={reduced ? undefined : { scale: 0.90 }}
            transition={{ type: "spring", stiffness: 210, damping: 17, mass: 0.9 }}
          >
            <span className="answer-letter">{opt.letter}.</span>
            <span className="answer-text">{opt.text}</span>
            <span className="answer-box">
              <AnimatePresence>
                {selected === opt.letter && (
                  <motion.span
                    key="tick"
                    initial={{ opacity: 0, scale: reduced ? 1 : 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: reduced ? 1 : 0.5 }}
                    transition={still(QUICK, reduced)}
                  >
                    <Checkmark />
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
          </motion.button>
        </Fragment>
      ))}
    </div>
  );
}
