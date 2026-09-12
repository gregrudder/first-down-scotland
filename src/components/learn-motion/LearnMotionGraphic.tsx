"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { learnMotionStepMs, type LearnMotionStep } from "@/data/learn-motion/types";
import { usePrefersReducedMotion } from "./primitives";

export function LearnMotionGraphic<T extends LearnMotionStep>({
  title,
  svgTitle,
  describe,
  figcaption,
  steps,
  stepMs = learnMotionStepMs,
  viewBox = "0 0 720 250",
  svgClassName = "w-full max-h-[22rem]",
  sceneLabel,
  defs,
  children,
}: {
  title: string;
  svgTitle: string;
  describe: (step: T) => string;
  figcaption: string;
  steps: readonly T[];
  stepMs?: number;
  viewBox?: string;
  svgClassName?: string;
  sceneLabel: (step: T) => string;
  defs?: (markerPrefix: string) => ReactNode;
  children: (ctx: { step: T; animate: boolean; markerPrefix: string }) => ReactNode;
}) {
  const titleId = useId();
  const descId = useId();
  const markerPrefix = useId().replace(/:/g, "");
  const motion = usePrefersReducedMotion();
  const reduced = motion === "reduce";
  const animate = motion === "ok";
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const step = steps[index] ?? steps[0]!;
  const lastIndex = steps.length - 1;
  const atEnd = index >= lastIndex;
  const playing = animate && !paused && !atEnd;

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => {
      setIndex((current) => Math.min(current + 1, lastIndex));
    }, stepMs);
    return () => window.clearTimeout(timer);
  }, [playing, index, lastIndex, stepMs]);

  function play() {
    if (reduced) {
      setIndex((current) => (current >= lastIndex ? 0 : current + 1));
      return;
    }
    if (atEnd) setIndex(0);
    setPaused(false);
  }

  function replay() {
    setIndex(0);
    setPaused(reduced);
  }

  function goTo(next: number) {
    setPaused(true);
    setIndex(next);
  }

  return (
    <figure className="overflow-hidden rounded-2xl border border-line bg-navy">
      <div className="flex flex-col gap-3 border-b border-line px-4 py-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
            Motion graphic
          </p>
          <h2 id={titleId} className="mt-1 font-display text-2xl text-cream">
            {title}
          </h2>
          <p className="mt-1 text-sm text-cream-dim">{sceneLabel(step)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={playing ? () => setPaused(true) : play}
            className="inline-flex items-center justify-center rounded-full bg-gold px-4 py-2 text-sm font-semibold text-gold-ink hover:bg-gold-soft"
          >
            {reduced
              ? atEnd
                ? "Start again"
                : "Next step"
              : playing
                ? "Pause"
                : atEnd
                  ? "Play again"
                  : "Play"}
          </button>
          <button
            type="button"
            onClick={replay}
            className="inline-flex items-center justify-center rounded-full border border-line px-4 py-2 text-sm font-semibold text-cream hover:border-gold/50"
          >
            Replay
          </button>
        </div>
      </div>

      {reduced ? (
        <p className="border-b border-line px-4 py-3 text-sm leading-6 text-cream-dim">
          Motion is off because your system asked for less animation. Use Next
          step or pick a labelled step below. Each frame is written in words, not
          only colour.
        </p>
      ) : null}

      <svg
        viewBox={viewBox}
        role="img"
        aria-labelledby={`${titleId} ${descId}`}
        className={svgClassName}
      >
        <title>{svgTitle}</title>
        <desc id={descId}>{describe(step)}</desc>
        {defs ? <defs>{defs(markerPrefix)}</defs> : null}
        {children({ step, animate, markerPrefix })}
      </svg>

      <div className="space-y-4 border-t border-line px-4 py-4">
        <div className="flex flex-wrap gap-2">
          <p className="rounded-full border border-gold/40 bg-navy-3 px-3 py-1 text-sm font-semibold text-gold">
            {step.call}
          </p>
          <p className="rounded-full border border-line bg-navy-2 px-3 py-1 text-sm text-cream">
            {step.plain}
          </p>
        </div>

        <div aria-live="polite" aria-atomic="true">
          <p className="font-display text-xl text-cream">{step.title}</p>
          <p className="mt-2 text-sm leading-6 text-cream-dim">{step.caption}</p>
        </div>

        <ol className="grid gap-2 sm:grid-cols-2">
          {steps.map((entry, entryIndex) => {
            const current = entryIndex === index;
            return (
              <li key={entry.id}>
                <button
                  type="button"
                  onClick={() => goTo(entryIndex)}
                  aria-current={current ? "step" : undefined}
                  className={`w-full rounded-xl border px-3 py-2 text-left text-sm leading-6 transition ${
                    current
                      ? "border-gold bg-navy-3 text-cream"
                      : "border-line bg-navy-2 text-cream-dim hover:border-gold/40 hover:text-cream"
                  }`}
                >
                  <span className="font-semibold text-gold">
                    Step {entryIndex + 1}
                    {current ? " · now" : ""}
                  </span>
                  <span className="mt-0.5 block">{entry.title}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <figcaption className="border-t border-line px-4 py-3 text-sm leading-6 text-cream-dim">
        {figcaption}
      </figcaption>
    </figure>
  );
}
