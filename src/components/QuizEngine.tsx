"use client";

import { useCallback, useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
  FIRST_QUESTION,
  QUESTIONS,
  RESULTS,
  type OptionLetter,
  type QuestionId,
  type ResultId,
} from "@/lib/quiz";
import { THEMES } from "@/lib/theme";
import { QuestionScreen } from "./QuestionScreen";
import { QuitDialog } from "./QuitDialog";

/**
 * Walks the decision tree.
 *
 * Depth is variable (2 or 3 questions), so progress is a stack of visited
 * question ids rather than an index. Back pops the stack; it cannot be
 * derived arithmetically.
 */
export function QuizEngine({
  initialPath,
  onFinish,
  onExit,
}: {
  /** Question stack to start from; only the `?screen=` QA link sets it. */
  initialPath?: QuestionId[];
  onFinish: (id: ResultId) => void;
  onExit: () => void;
}) {
  const [path, setPath] = useState<QuestionId[]>(initialPath ?? [FIRST_QUESTION]);
  const [answers, setAnswers] = useState<Partial<Record<QuestionId, OptionLetter>>>({});
  const [quitOpen, setQuitOpen] = useState(false);

  const current = path[path.length - 1];
  const question = QUESTIONS[current];
  const selected = answers[current] ?? null;

  const handleNext = useCallback(() => {
    const letter = answers[current];
    if (!letter) return;
    const option = question.options.find((o) => o.letter === letter);
    if (!option) return;

    if (option.to.kind === "result") {
      onFinish(option.to.id);
      return;
    }
    setPath((p) => [...p, (option.to as { id: QuestionId }).id]);
  }, [answers, current, question, onFinish]);

  const handleBack = useCallback(() => {
    setPath((p) => (p.length > 1 ? p.slice(0, -1) : p));
  }, []);

  const handleSelect = useCallback(
    (letter: string) => {
      setAnswers((a) => ({ ...a, [current]: letter as OptionLetter }));
    },
    [current],
  );

  return (
    <>
      {/* No key and no AnimatePresence around the shell: it persists so its
          chrome can morph between questions, the way Smart Animate does.
          Identity changes happen inside it (background, content). */}
      <QuestionScreen
        question={question}
        theme={THEMES[current]}
        selected={selected}
        onSelect={handleSelect}
        onNext={handleNext}
        onBack={handleBack}
        onQuit={() => setQuitOpen(true)}
        canGoBack={path.length > 1}
      />

      <AnimatePresence>
        {quitOpen && (
          <QuitDialog onCancel={() => setQuitOpen(false)} onConfirm={onExit} />
        )}
      </AnimatePresence>
    </>
  );
}

export { RESULTS };
