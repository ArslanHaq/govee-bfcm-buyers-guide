"use client";

import { motion, useReducedMotion } from "framer-motion";
import { QUIT_DIALOG } from "@/lib/theme";
import { QUICK, still } from "@/lib/motion";
import { TitleSquare } from "./icons";

/**
 * Quit confirmation, floating over the active question.
 * Geometry measured from Figma node 131:1950: 334x226 at x28/y240,
 * over a black scrim at 47% (sampled: #CDA2D5 dims to #6C5570).
 */
export function QuitDialog({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className="quit-scrim"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quit-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={still(QUICK, reduced)}
    >
      <div className="stage">
        <motion.div
          className="quit-dialog"
          initial={{ opacity: 0, scale: reduced ? 1 : 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={still(QUICK, reduced)}
        >
          <div className="quit-titlebar">
            <TitleSquare className="quit-square" />
            <TitleSquare className="quit-square" />
            <TitleSquare className="quit-square" />
          </div>
          <div className="quit-body">
            <p id="quit-title" className="quit-heading">
              Are you sure you want to quit?
            </p>
            <p className="quit-sub">
              Your progress will be lost and you&apos;ll need to start over.
            </p>
            <div className="quit-actions">
              <button
                type="button"
                className="quit-btn"
                style={{ background: QUIT_DIALOG.cancelFill, color: "#1A1A1A" }}
                onClick={onConfirm}
              >
                Quit Anyway
              </button>
              <button
                type="button"
                className="quit-btn"
                style={{ background: QUIT_DIALOG.confirmFill, color: "#1A1A1A" }}
                onClick={onCancel}
              >
                Continue Quiz
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
