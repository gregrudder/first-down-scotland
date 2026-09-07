"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { quizQuestions, scoreQuiz, type QuizAnswer } from "@/data/team-quiz";
import { saveTeam } from "@/lib/team-storage";

export function TeamQuiz() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);

  const question = quizQuestions[step];
  if (!question) return null;

  function choose(optionIndex: number) {
    const nextAnswers = [
      ...answers.filter((answer) => answer.questionId !== question.id),
      { questionId: question.id, optionIndex },
    ];
    setAnswers(nextAnswers);

    if (step + 1 < quizQuestions.length) {
      setStep(step + 1);
      return;
    }

    const result = scoreQuiz(nextAnswers);
    saveTeam(result.team.abbreviation, "quiz");
    const tags = result.matchedTags.join(",");
    const also = result.runnersUp.map((team) => team.abbreviation).join(",");
    router.push(
      `/pick-your-team/result?team=${result.team.abbreviation}&via=quiz&tags=${encodeURIComponent(tags)}&also=${also}`,
    );
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
        Question {step + 1} of {quizQuestions.length}
      </p>
      <h1 className="mt-3 font-display text-3xl text-cream sm:text-4xl">{question.prompt}</h1>
      <div className="mt-8 grid gap-3">
        {question.options.map((option, index) => (
          <button
            key={option.label}
            type="button"
            onClick={() => choose(index)}
            className="rounded-2xl border border-line bg-navy-2 px-5 py-4 text-left text-base leading-7 text-cream transition hover:border-gold/50 hover:bg-navy-3"
          >
            {option.label}
          </button>
        ))}
      </div>
      {step > 0 ? (
        <button
          type="button"
          onClick={() => setStep(step - 1)}
          className="mt-6 text-sm text-cream-dim hover:text-gold"
        >
          ← Back
        </button>
      ) : null}
    </div>
  );
}
