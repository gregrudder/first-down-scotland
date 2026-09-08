import { allLessonSlugs, learnStages, type LearnStage } from "@/data/learn-stages";
import { badgeForScore, LEARN_QUIZ_TOTAL, type LearnBadgeId } from "@/data/learn-quiz";

export const LEARN_STORAGE_KEY = "fds-learn";
export const LEARN_CHANGE_EVENT = "fds-learn-change";

export type SavedLearnQuiz = {
  score: number;
  total: number;
  badgeId: LearnBadgeId;
  at: string;
};

export type SavedLearnProgress = {
  completed: string[];
  lastQuiz: SavedLearnQuiz | null;
  attempts: number;
};

const emptyProgress = (): SavedLearnProgress => ({
  completed: [],
  lastQuiz: null,
  attempts: 0,
});

function isLessonSlug(value: string): boolean {
  return allLessonSlugs().includes(value);
}

export function readLearnProgress(): SavedLearnProgress {
  if (typeof window === "undefined") return emptyProgress();
  try {
    const raw = window.localStorage.getItem(LEARN_STORAGE_KEY);
    if (!raw) return emptyProgress();
    const parsed = JSON.parse(raw) as Partial<SavedLearnProgress>;
    const completed = Array.isArray(parsed.completed)
      ? parsed.completed.filter((slug): slug is string => typeof slug === "string" && isLessonSlug(slug))
      : [];
    const lastQuiz =
      parsed.lastQuiz &&
      typeof parsed.lastQuiz.score === "number" &&
      typeof parsed.lastQuiz.total === "number" &&
      typeof parsed.lastQuiz.badgeId === "string" &&
      typeof parsed.lastQuiz.at === "string"
        ? {
            score: parsed.lastQuiz.score,
            total: parsed.lastQuiz.total,
            badgeId: badgeForScore(parsed.lastQuiz.score, parsed.lastQuiz.total).id,
            at: parsed.lastQuiz.at,
          }
        : null;
    return {
      completed: [...new Set(completed)],
      lastQuiz,
      attempts: typeof parsed.attempts === "number" && parsed.attempts > 0 ? parsed.attempts : lastQuiz ? 1 : 0,
    };
  } catch {
    return emptyProgress();
  }
}

function writeLearnProgress(next: SavedLearnProgress): SavedLearnProgress {
  if (typeof window === "undefined") return next;
  try {
    window.localStorage.setItem(LEARN_STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(LEARN_CHANGE_EVENT));
  } catch {
    // Private mode or blocked storage: keep the in-memory result for this visit.
  }
  return next;
}

export function markLessonComplete(slug: string): SavedLearnProgress {
  const current = readLearnProgress();
  if (!isLessonSlug(slug) || current.completed.includes(slug)) return current;
  return writeLearnProgress({
    ...current,
    completed: [...current.completed, slug],
  });
}

export function saveLearnQuiz(score: number): SavedLearnProgress {
  const badge = badgeForScore(score);
  const current = readLearnProgress();
  return writeLearnProgress({
    ...current,
    attempts: current.attempts + 1,
    lastQuiz: {
      score,
      total: LEARN_QUIZ_TOTAL,
      badgeId: badge.id,
      at: new Date().toISOString(),
    },
  });
}

export function stageProgress(stage: LearnStage, completed: string[]): {
  done: number;
  total: number;
  complete: boolean;
} {
  const done = stage.slugs.filter((slug) => completed.includes(slug)).length;
  return { done, total: stage.slugs.length, complete: done === stage.slugs.length };
}

export function pathProgress(completed: string[]): { done: number; total: number; complete: boolean } {
  const slugs = allLessonSlugs();
  const done = slugs.filter((slug) => completed.includes(slug)).length;
  return { done, total: slugs.length, complete: done === slugs.length };
}

export function firstIncompleteSlug(completed: string[]): string | undefined {
  return allLessonSlugs().find((slug) => !completed.includes(slug));
}

export function firstIncompleteInStage(stage: LearnStage, completed: string[]): string | undefined {
  return stage.slugs.find((slug) => !completed.includes(slug));
}

export function isStageComplete(stage: LearnStage, completed: string[]): boolean {
  return stageProgress(stage, completed).complete;
}

export { learnStages };
