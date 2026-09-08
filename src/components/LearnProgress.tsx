"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { learnBadges } from "@/data/learn-quiz";
import { learnStages } from "@/data/learn-stages";
import {
  firstIncompleteInStage,
  firstIncompleteSlug,
  LEARN_CHANGE_EVENT,
  pathProgress,
  readLearnProgress,
  stageProgress,
  type SavedLearnProgress,
} from "@/lib/learn-storage";

function useLearnProgressState(): SavedLearnProgress | null {
  const [progress, setProgress] = useState<SavedLearnProgress | null>(null);

  useEffect(() => {
    const sync = () => setProgress(readLearnProgress());
    sync();
    window.addEventListener(LEARN_CHANGE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(LEARN_CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return progress;
}

function Bar({ done, total }: { done: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <div
      className="h-2 overflow-hidden rounded-full bg-navy-3"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={done}
    >
      <div className="h-full rounded-full bg-gold transition-[width]" style={{ width: `${pct}%` }} />
    </div>
  );
}

export function LearnPathProgress() {
  const progress = useLearnProgressState();
  const completed = progress?.completed ?? [];
  const path = pathProgress(completed);
  const continueSlug = firstIncompleteSlug(completed);
  const lastBadge = progress?.lastQuiz
    ? learnBadges.find((badge) => badge.id === progress.lastQuiz?.badgeId)
    : undefined;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-line bg-navy-2 p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">Your path</p>
            <p className="mt-1 text-sm text-cream-dim">
              {path.done} of {path.total} lessons marked as read
            </p>
          </div>
          {lastBadge && progress?.lastQuiz ? (
            <p className="text-sm text-cream">
              Last quiz:{" "}
              <span className="font-semibold text-gold">
                {progress.lastQuiz.score}/{progress.lastQuiz.total}
              </span>{" "}
              · {lastBadge.name}
            </p>
          ) : null}
        </div>
        <div className="mt-4">
          <Bar done={path.done} total={path.total} />
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          {continueSlug ? (
            <Link
              href={`/learn/${continueSlug}`}
              className="inline-flex items-center justify-center rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-navy hover:bg-gold-soft"
            >
              {path.done === 0 ? "Start lesson 1" : "Continue the path"} →
            </Link>
          ) : (
            <Link
              href="/learn/quiz"
              className="inline-flex items-center justify-center rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-navy hover:bg-gold-soft"
            >
              Take the 20-question quiz →
            </Link>
          )}
          <Link
            href="/learn/quiz"
            className="inline-flex items-center justify-center rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-cream hover:border-gold/50"
          >
            {path.complete ? "Retake the quiz" : "Quiz when you are ready"}
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {learnStages.map((stage) => {
          const stats = stageProgress(stage, completed);
          const nextSlug = firstIncompleteInStage(stage, completed);
          const href = `/learn/${nextSlug ?? stage.slugs[0]}`;
          return (
            <div key={stage.id} className="rounded-2xl border border-line bg-navy-2 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">{stage.title}</p>
              <p className="mt-2 text-sm leading-6 text-cream-dim">{stage.summary}</p>
              <div className="mt-4">
                <Bar done={stats.done} total={stats.total} />
              </div>
              <p className="mt-2 text-xs text-cream-dim">
                {stats.complete
                  ? "Stage done"
                  : `${stats.done} of ${stats.total} read`}
              </p>
              <Link href={href} className="mt-3 inline-block text-sm font-medium text-gold">
                {stats.complete ? "Revisit →" : stats.done === 0 ? "Open stage →" : "Continue stage →"}
              </Link>
              {stats.complete ? (
                <p className="mt-3 text-sm leading-6 text-cream-dim">
                  {path.complete ? (
                    <>
                      Path finished.{" "}
                      <Link href="/learn/quiz" className="text-gold">
                        Sit the quiz
                      </Link>
                      .
                    </>
                  ) : (
                    "On to the next stage when you are ready."
                  )}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function LessonReadMark({ slug }: { slug: string }) {
  const progress = useLearnProgressState();
  if (!progress?.completed.includes(slug)) return null;
  return (
    <span className="rounded-full border border-good/40 bg-good/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-good">
      Read
    </span>
  );
}

export function CompactLessonProgress({ slug }: { slug: string }) {
  const progress = useLearnProgressState();
  const completed = progress?.completed ?? [];
  const path = pathProgress(completed);

  return (
    <div className="mt-5">
      <Bar done={path.done} total={path.total} />
      <p className="mt-2 text-xs text-cream-dim">
        Path {path.done}/{path.total}
        {completed.includes(slug) ? " · this lesson is marked as read" : ""}
      </p>
    </div>
  );
}
