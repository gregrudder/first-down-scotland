"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import type { MiniGame } from "@/data/mini-games";

type Answers = Record<string, number>;

export function MiniQuiz({ game }: { game: MiniGame }) {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [picked, setPicked] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const feedbackId = useId();

  const total = game.questions.length;
  const question = game.questions[step];
  const score = useMemo(
    () => game.questions.filter((entry) => answers[entry.id] === entry.correctIndex).length,
    [answers, game.questions],
  );

  function choose(optionIndex: number) {
    if (!question || picked !== null) return;
    setPicked(optionIndex);
    setAnswers((current) => ({ ...current, [question.id]: optionIndex }));
  }

  function next() {
    if (step + 1 < total) {
      setStep(step + 1);
      setPicked(null);
      return;
    }
    setSubmitted(true);
  }

  function retake() {
    setAnswers({});
    setStep(0);
    setPicked(null);
    setSubmitted(false);
    setStarted(false);
  }

  if (submitted) {
    return (
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">Result</p>
        <h1 className="mt-3 font-display text-4xl leading-tight text-cream sm:text-5xl">
          {score}/{total}
        </h1>
        <p className="mt-4 text-lg leading-8 text-cream-dim">
          {score === total
            ? "Clean sheet. You can explain that in the pub."
            : score >= Math.ceil(total * 0.7)
              ? "Solid. Skim the ones you missed and you will be fine on Sunday."
              : "Useful miss. The explainers below are the lesson, not a telling-off."}
        </p>

        <div className="mt-10 space-y-4">
          {game.questions.map((entry, index) => {
            const chosen = answers[entry.id];
            const correct = chosen === entry.correctIndex;
            return (
              <div key={entry.id} className="rounded-2xl border border-line bg-navy-2 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                  {index + 1} of {total} · {correct ? "Right" : "Wrong"}
                </p>
                <p className="mt-2 text-base text-cream">{entry.prompt}</p>
                {entry.clues?.length ? (
                  <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm leading-6 text-cream-dim">
                    {entry.clues.map((clue) => (
                      <li key={clue}>{clue}</li>
                    ))}
                  </ol>
                ) : null}
                <p className="mt-2 text-sm leading-6 text-cream-dim">
                  You said: {entry.options[chosen] ?? "-"}
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
            href="/mini-games"
            className="inline-flex items-center justify-center rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-cream hover:border-gold/50"
          >
            All mini games
          </Link>
          <Link
            href={game.learnHref}
            className="inline-flex items-center justify-center rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-cream hover:border-gold/50"
          >
            {game.learnLabel}
          </Link>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
          Mini game · about {game.minutes} min
        </p>
        <h1 className="mt-3 font-display text-4xl leading-tight text-cream sm:text-5xl">
          {game.title}
        </h1>
        <p className="mt-4 text-lg leading-8 text-cream-dim">{game.summary}</p>
        <p className="mt-4 text-sm leading-6 text-cream-dim">
          {total} questions. Tap an answer, read the note, then go on. Nothing is saved
          to an account.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => setStarted(true)}
            className="inline-flex items-center justify-center rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-gold-ink hover:bg-gold-soft"
          >
            Start
          </button>
          <Link
            href="/mini-games"
            className="inline-flex items-center justify-center rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-cream hover:border-gold/50"
          >
            Back to Mini Games
          </Link>
        </div>
      </div>
    );
  }

  if (!question) return null;

  const locked = picked !== null;
  const correct = picked === question.correctIndex;

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
        Question {step + 1} of {total}
      </p>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-navy-3" aria-hidden>
        <div
          className="h-full rounded-full bg-gold transition-[width]"
          style={{ width: `${((step + (locked ? 1 : 0)) / total) * 100}%` }}
        />
      </div>
      <h1 className="mt-6 font-display text-3xl text-cream sm:text-4xl">{question.prompt}</h1>
      {question.clues?.length ? (
        <ol className="mt-5 list-decimal space-y-2 pl-5 text-base leading-7 text-cream-dim">
          {question.clues.map((clue) => (
            <li key={clue}>{clue}</li>
          ))}
        </ol>
      ) : null}
      <div className="mt-8 grid gap-3" role="group" aria-labelledby={feedbackId}>
        {question.options.map((option, index) => {
          const isPicked = picked === index;
          const isAnswer = index === question.correctIndex;
          let extra = "border-line bg-navy-2 hover:border-gold/50 hover:bg-navy-3";
          if (locked && isAnswer) extra = "border-good/60 bg-good/10";
          if (locked && isPicked && !isAnswer) extra = "border-live/60 bg-live/10";
          return (
            <button
              key={option}
              type="button"
              onClick={() => choose(index)}
              disabled={locked}
              aria-pressed={isPicked}
              className={`rounded-2xl border px-5 py-4 text-left text-base leading-7 text-cream transition disabled:cursor-default ${extra}`}
            >
              {option}
            </button>
          );
        })}
      </div>
      <div id={feedbackId} className="mt-6 min-h-16" aria-live="polite">
        {locked ? (
          <div className="rounded-2xl border border-gold/30 bg-navy-3 px-5 py-4">
            <p className="text-sm font-semibold text-gold">{correct ? "Right" : "Not that one"}</p>
            <p className="mt-2 text-sm leading-6 text-cream">{question.explain}</p>
          </div>
        ) : null}
      </div>
      {locked ? (
        <button
          type="button"
          onClick={next}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-gold-ink hover:bg-gold-soft"
        >
          {step + 1 < total ? "Next question" : "See your score"}
        </button>
      ) : step > 0 ? (
        <button
          type="button"
          onClick={() => {
            setStep(step - 1);
            setPicked(answers[game.questions[step - 1]?.id] ?? null);
          }}
          className="mt-6 text-sm text-cream-dim hover:text-gold"
        >
          ← Back
        </button>
      ) : (
        <Link href="/mini-games" className="mt-6 inline-block text-sm text-cream-dim hover:text-gold">
          ← Back to Mini Games
        </Link>
      )}
    </div>
  );
}
