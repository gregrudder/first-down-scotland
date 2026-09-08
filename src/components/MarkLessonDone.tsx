"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { stageForLesson } from "@/data/learn-stages";
import {
  isStageComplete,
  LEARN_CHANGE_EVENT,
  markLessonComplete,
  pathProgress,
  readLearnProgress,
} from "@/lib/learn-storage";

export function MarkLessonDone({
  slug,
  nextHref,
  nextLabel,
}: {
  slug: string;
  nextHref?: string;
  nextLabel?: string;
}) {
  const [done, setDone] = useState(false);
  const [justFinishedStage, setJustFinishedStage] = useState(false);
  const [pathDone, setPathDone] = useState(false);

  useEffect(() => {
    const sync = () => {
      const progress = readLearnProgress();
      setDone(progress.completed.includes(slug));
      setPathDone(pathProgress(progress.completed).complete);
    };
    sync();
    window.addEventListener(LEARN_CHANGE_EVENT, sync);
    return () => window.removeEventListener(LEARN_CHANGE_EVENT, sync);
  }, [slug]);

  function mark() {
    const stage = stageForLesson(slug);
    const before = readLearnProgress();
    const stageWasDone = stage ? isStageComplete(stage, before.completed) : true;
    const after = markLessonComplete(slug);
    setDone(true);
    setPathDone(pathProgress(after.completed).complete);
    setJustFinishedStage(Boolean(stage && !stageWasDone && isStageComplete(stage, after.completed)));
  }

  return (
    <div className="mt-12 rounded-2xl border border-line bg-navy-2 p-5">
      {done ? (
        <p className="text-sm font-semibold text-good">This lesson is marked as read.</p>
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-cream-dim">Finished this one?</p>
          <button
            type="button"
            onClick={mark}
            className="inline-flex items-center justify-center rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-gold-ink hover:bg-gold-soft"
          >
            Mark as read
          </button>
        </div>
      )}

      {justFinishedStage ? (
        <p className="mt-3 text-sm leading-6 text-cream">
          {pathDone
            ? "That was the last lesson on the path."
            : "Stage done. The next set of lessons is waiting when you are."}
        </p>
      ) : null}

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {nextHref && nextLabel ? (
          <Link
            href={nextHref}
            onClick={mark}
            className="text-sm font-semibold text-gold"
          >
            {nextLabel}
          </Link>
        ) : pathDone ? (
          <Link href="/learn/quiz" className="text-sm font-semibold text-gold">
            Take the 20-question quiz →
          </Link>
        ) : (
          <Link href="/learn" className="text-sm font-semibold text-gold">
            Back to the path →
          </Link>
        )}
        {done && !pathDone ? (
          <Link href="/learn/quiz" className="text-sm text-cream-dim hover:text-gold">
            Quiz when you are ready
          </Link>
        ) : pathDone ? (
          <Link href="/this-week" className="text-sm text-cream-dim hover:text-gold">
            See this week’s games →
          </Link>
        ) : (
          <Link href="/this-week" className="text-sm text-cream-dim hover:text-gold">
            See this week’s games →
          </Link>
        )}
      </div>
    </div>
  );
}
