"use client";

import { useState } from "react";
import { QuizEngine } from "@/components/QuizEngine";
import { CoverScreen } from "@/components/CoverScreen";
import { ResultScreen } from "@/components/ResultScreen";
import { ResponsiveWrapper } from "@/components/ResponsiveWrapper";
import type { ResultId } from "@/lib/quiz";

type Stage = { name: "cover" } | { name: "quiz" } | { name: "result"; id: ResultId };

export default function Page() {
  return (
    <ResponsiveWrapper>
      <Quiz />
    </ResponsiveWrapper>
  );
}

function Quiz() {
  const [stage, setStage] = useState<Stage>({ name: "cover" });

  if (stage.name === "cover") {
    return <CoverScreen onStart={() => setStage({ name: "quiz" })} />;
  }
  if (stage.name === "quiz") {
    return (
      <QuizEngine
        onFinish={(id) => setStage({ name: "result", id })}
        onExit={() => setStage({ name: "cover" })}
      />
    );
  }
  return <ResultScreen id={stage.id} />;
}
