"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Question } from "@/lib/quiz";
import { type Theme, themeVars } from "@/lib/theme";
import { BG_IS_FRAME } from "@/lib/art-manifest";
import { STEP, still } from "@/lib/motion";
import { RetroWindow } from "./RetroWindow";
import { NavRow } from "./NavRow";
import { AnswerList } from "./AnswerList";
import { RetroButton } from "./RetroButton";
import { PlayerWidget } from "./PlayerWidget";
import { CloseX } from "./icons";

/**
 * The question shell. One instance serves all six question screens.
 *
 * This is deliberately NOT remounted per question. Figma's prototype uses
 * Smart Animate, which matches layers across frames and interpolates them —
 * the window card recolours in place, the Next button slides from centre to
 * right as Back appears, the logo and chrome never move. Remounting the
 * screen would destroy exactly the elements that are supposed to persist, so
 * only the background and the content inside the window change identity.
 */
export function QuestionScreen({
  question,
  theme,
  selected,
  onSelect,
  onNext,
  onBack,
  onQuit,
  canGoBack,
}: {
  question: Question;
  theme: Theme;
  selected: string | null;
  onSelect: (letter: string) => void;
  onNext: () => void;
  onBack: () => void;
  onQuit: () => void;
  canGoBack: boolean;
}) {
  const reduced = useReducedMotion();
  // A background that still has the UI drawn into it must track the stage.
  // Letting it cover the viewport scales it independently and you see the
  // baked card, logo and buttons drifting behind the live ones.
  const framed = BG_IS_FRAME[question.id] ?? false;

  return (
    <div className={`screen morphing${framed ? " bg-framed" : ""}`} style={themeVars(theme)}>
      {/* Only the artwork swaps identity, so it can cross-fade. */}
      <AnimatePresence initial={false}>
        <motion.div
          key={theme.bg}
          className="bg-layer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={still(STEP, reduced)}
        >
          {framed ? (
            <Image
              className="screen-bg"
              src={theme.bg}
              alt=""
              width={390}
              height={720}
              priority
              unoptimized
            />
          ) : (
            <Image
              className="screen-bg"
              src={theme.bg}
              alt=""
              fill
              sizes="100vw"
              priority
              unoptimized
            />
          )}
        </motion.div>
      </AnimatePresence>

      <div className="stage">
        <button type="button" className="close-button" onClick={onQuit} aria-label="Quit quiz">
          <CloseX />
        </button>

        <Image className="govee-logo" src="/icons/govee.png" alt="Govee" width={84} height={47} priority />

        <RetroWindow nav={<NavRow />}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: reduced ? 0 : 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduced ? 0 : -6 }}
              transition={still({ duration: 0.22, ease: [0, 0, 0.2, 1] }, reduced)}
            >
              <div>
                <p className="q-label">{question.label}</p>
                <p className="q-text" aria-label={question.text}>
                  {question.lines[0]}
                  <br />
                  {question.lines[1]}
                </p>
              </div>
              <div style={{ height: 24 }} />
              <AnswerList options={question.options} selected={selected} onSelect={onSelect} />
              {question.options.length === 2 && <PlayerWidget />}
            </motion.div>
          </AnimatePresence>
        </RetroWindow>

        {/* Both buttons are always present and absolutely placed, so Next
            slides from centre to right as Back fades in — as the prototype
            interpolates it — rather than the row re-laying out. */}
        <div className="btn-row">
          <div className={`btn-slot back${canGoBack ? " shown" : ""}`}>
            <RetroButton variant="back" onClick={onBack} disabled={!canGoBack}>
              Back
            </RetroButton>
          </div>
          <div className={`btn-slot next${canGoBack ? " paired" : " alone"}`}>
            <RetroButton variant="next" onClick={onNext} disabled={!selected}>
              Next
            </RetroButton>
          </div>
        </div>
      </div>
    </div>
  );
}
