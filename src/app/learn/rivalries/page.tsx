import type { Metadata } from "next";
import Link from "next/link";
import { CompactLessonProgress } from "@/components/LearnProgress";
import { MarkLessonDone } from "@/components/MarkLessonDone";
import { PageIntro } from "@/components/PageIntro";
import { RivalryCard } from "@/components/RivalryCard";
import { getLesson, getNextLesson, getPreviousLesson, lessons } from "@/data/lessons";
import { rivalries, rivalriesIntro, rivalriesSourcesNote } from "@/data/rivalries";

export const metadata: Metadata = {
  title: "NFL rivalries",
  description:
    "Major NFL rivalries in plain UK English: who plays whom, why it matters, and the famous moments beginners actually hear about.",
};

export default function RivalriesLessonPage() {
  const lesson = getLesson("rivalries");
  const previous = getPreviousLesson("rivalries");
  const next = getNextLesson("rivalries");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
        Lesson {lesson?.number ?? 13} of {lessons.length} · {lesson?.minutes ?? 10} min
      </p>
      <PageIntro eyebrow={rivalriesIntro.eyebrow} title={rivalriesIntro.title}>
        <p>{rivalriesIntro.lead}</p>
      </PageIntro>
      <CompactLessonProgress slug="rivalries" />

      <div className="mt-8 rounded-2xl border border-gold/30 bg-navy-3 px-5 py-4">
        <p className="text-sm font-semibold text-gold">How to use this</p>
        <p className="mt-2 text-sm leading-6 text-cream">
          You do not need every fixture. Learn why a few Sundays sound personal, then
          put a game on. When you want to test the names, the rivalry quiz lives under
          Mini Games, not here.
        </p>
        <Link href="/mini-games/rivalries" className="mt-3 inline-block text-sm font-semibold text-gold">
          Rivalry match-up quiz →
        </Link>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        {rivalries.map((rivalry) => (
          <RivalryCard key={rivalry.id} rivalry={rivalry} />
        ))}
      </div>

      <p className="mt-10 text-xs leading-5 text-cream-dim">{rivalriesSourcesNote}</p>

      <MarkLessonDone
        slug="rivalries"
        nextHref={next ? `/learn/${next.slug}` : "/learn/quiz"}
        nextLabel={next ? `Next: ${next.title} →` : "Take the 20-question quiz →"}
      />

      <nav className="mt-12 flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:justify-between">
        {previous ? (
          <Link href={`/learn/${previous.slug}`} className="text-sm text-cream-dim hover:text-gold">
            ← {previous.title}
          </Link>
        ) : (
          <Link href="/learn" className="text-sm text-cream-dim hover:text-gold">
            ← All lessons
          </Link>
        )}
        {next ? (
          <Link href={`/learn/${next.slug}`} className="text-sm font-semibold text-gold sm:text-right">
            Next: {next.title} →
          </Link>
        ) : null}
      </nav>
    </div>
  );
}
