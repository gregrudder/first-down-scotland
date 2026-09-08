"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  badgeForScore,
  LEARN_QUIZ_TOTAL,
  learnBadges,
  learnQuizQuestions,
} from "@/data/learn-quiz";
import { saveLearnQuiz } from "@/lib/learn-storage";

type Answers = Record<string, number>;

export function LearnQuiz() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [submitted, setSubmitted] = useState(false);

  const question = learnQuizQuestions[step];
  const score = useMemo(
    () =>
      learnQuizQuestions.filter((entry) => answers[entry.id] === entry.correctIndex).length,
    [answers],
  );

  function choose(optionIndex: number) {
    if (!question) return;
    const next = { ...answers, [question.id]: optionIndex };
    setAnswers(next);
    if (step + 1 < learnQuizQuestions.length) {
      setStep(step + 1);
      return;
    }
    const finalScore = learnQuizQuestions.filter((entry) => next[entry.id] === entry.correctIndex)
      .length;
    saveLearnQuiz(finalScore);
    setSubmitted(true);
  }

  function retake() {
    setAnswers({});
    setStep(0);
    setSubmitted(false);
    setStarted(false);
  }

  if (submitted) {
    const badge = badgeForScore(score);
    return (
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">Result</p>
        <h1 className="mt-3 font-display text-4xl leading-tight text-cream sm:text-5xl">
          {score}/{LEARN_QUIZ_TOTAL} · {badge.name}
        </h1>
        <p className="mt-4 text-lg leading-8 text-cream-dim">{badge.blurb}</p>

        <ol className="mt-8 grid gap-3 sm:grid-cols-2">
          {learnBadges.map((entry) => (
            <li
              key={entry.id}
              className={`rounded-2xl border px-4 py-3 text-sm leading-6 ${
                entry.id === badge.id
                  ? "border-gold/60 bg-navy-3 text-cream"
                  : "border-line bg-navy-2 text-cream-dim"
              }`}
            >
              <p className="font-semibold text-cream">{entry.name}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.12em] text-gold">
                {entry.min}–{entry.max} / {LEARN_QUIZ_TOTAL}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-10 space-y-4">
          {learnQuizQuestions.map((entry, index) => {
            const picked = answers[entry.id];
            const correct = picked === entry.correctIndex;
            return (
              <div key={entry.id} className="rounded-2xl border border-line bg-navy-2 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                  {index + 1} of {LEARN_QUIZ_TOTAL} · {correct ? "Right" : "Wrong"}
                </p>
                <p className="mt-2 text-base text-cream">{entry.prompt}</p>
                <p className="mt-2 text-sm leading-6 text-cream-dim">
                  You said: {entry.options[picked] ?? "-"}
                  {correct ? null : (
                    <>
                      <br />
                      Answer: {entry.options[entry.correctIndex]}
                    </>
                  )}
                </p>
                <p className="mt-2 text-sm leading-6 text-cream-dim">{entry.explain}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={retake}
            className="inline-flex items-center justify-center rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-gold-ink hover:bg-gold-soft"
          >
            Have another go
          </button>
          <Link
            href="/learn"
            className="inline-flex items-center justify-center rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-cream hover:border-gold/50"
          >
            Back to the path
          </Link>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
          End-of-path quiz
        </p>
        <h1 className="mt-3 font-display text-4xl leading-tight text-cream sm:text-5xl">
          Twenty questions. One badge.
        </h1>
        <p className="mt-4 text-lg leading-8 text-cream-dim">
          Everything here is in the lessons. No trick scores. Your result stays in
          this browser. There is no account.
        </p>
        <ol className="mt-8 grid gap-3 sm:grid-cols-2">
          {learnBadges.map((entry) => (
            <li key={entry.id} className="rounded-2xl border border-line bg-navy-2 px-4 py-3">
              <p className="font-semibold text-cream">{entry.name}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.12em] text-gold">
                {entry.min}–{entry.max} / {LEARN_QUIZ_TOTAL}
              </p>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-sm leading-6 text-cream-dim">
          Practice Squad is the first rung, then Rookie, Starter, Hall of Famer. Not
          the other way round.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => setStarted(true)}
            className="inline-flex items-center justify-center rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-gold-ink hover:bg-gold-soft"
          >
            Start the quiz
          </button>
          <Link
            href="/learn"
            className="inline-flex items-center justify-center rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-cream hover:border-gold/50"
          >
            Back to the lessons
          </Link>
        </div>
      </div>
    );
  }

  if (!question) return null;

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
        Question {step + 1} of {LEARN_QUIZ_TOTAL}
      </p>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-navy-3" aria-hidden>
        <div
          className="h-full rounded-full bg-gold transition-[width]"
          style={{ width: `${(step / LEARN_QUIZ_TOTAL) * 100}%` }}
        />
      </div>
      <h1 className="mt-6 font-display text-3xl text-cream sm:text-4xl">{question.prompt}</h1>
      <div className="mt-8 grid gap-3">
        {question.options.map((option, index) => (
          <button
            key={option}
            type="button"
            onClick={() => choose(index)}
            className="rounded-2xl border border-line bg-navy-2 px-5 py-4 text-left text-base leading-7 text-cream transition hover:border-gold/50 hover:bg-navy-3"
          >
            {option}
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
      ) : (
        <Link href="/learn" className="mt-6 inline-block text-sm text-cream-dim hover:text-gold">
          ← Back to the path
        </Link>
      )}
    </div>
  );
}
