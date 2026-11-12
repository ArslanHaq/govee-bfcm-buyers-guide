"use client";

import { useState } from "react";
import { QuizEngine } from "@/components/QuizEngine";
import { CoverScreen } from "@/components/CoverScreen";
import { ResultScreen } from "@/components/ResultScreen";
import { ResponsiveWrapper } from "@/components/ResponsiveWrapper";
import { QUESTIONS, RESULTS, type QuestionId, type ResultId } from "@/lib/quiz";

type Stage =
  | { name: "cover" }
  | { name: "quiz"; path?: QuestionId[] }
  | { name: "result"; id: ResultId };

/** The question stack that leads to each question, for the QA deep link. */
const PATH_TO: Record<QuestionId, QuestionId[]> = {
  q1: ["q1"],
  q2a: ["q1", "q2a"],
  q2b: ["q1", "q2b"],
  q2c: ["q1", "q2c"],
  q2d: ["q1", "q2d"],
  q3: ["q1", "q2d", "q3"],
};

/**
 * QA deep link: `?screen=r4` (or cover, q1…q3, r1…r6) opens that screen
 * directly, so a single screen can be reviewed on a phone without clicking
 * through the quiz. Anything else starts on the cover as normal.
 */
function initialStage(): Stage {
  if (typeof window === "undefined") return { name: "cover" };
  const s = new URLSearchParams(window.location.search).get("screen");
  if (s && s in RESULTS) return { name: "result", id: s as ResultId };
  if (s && s in QUESTIONS) return { name: "quiz", path: PATH_TO[s as QuestionId] };
  return { name: "cover" };
}

export default function Page() {
  return (
    <ResponsiveWrapper>
      <Quiz />
    </ResponsiveWrapper>
  );
}

function Quiz() {
  // ResponsiveWrapper renders nothing until it has measured the viewport, so
  // this only ever runs in the browser and can read the URL directly.
  const [stage, setStage] = useState<Stage>(initialStage);

  let screen: React.ReactNode;
  if (stage.name === "cover") {
    screen = <CoverScreen onStart={() => setStage({ name: "quiz" })} />;
  } else if (stage.name === "quiz") {
    screen = (
      <QuizEngine
        initialPath={stage.path}
        onFinish={(id) => setStage({ name: "result", id })}
        onExit={() => setStage({ name: "cover" })}
      />
    );
  } else {
    screen = <ResultScreen id={stage.id} />;
  }

  return <>{screen}</>;
}
