import type { Metadata } from "next";
import Link from "next/link";
import { CompactLessonProgress } from "@/components/LearnProgress";
import { MarkLessonDone } from "@/components/MarkLessonDone";
import { PlayDiagram, PlayLegend } from "@/components/PlayDiagram";
import { PageIntro } from "@/components/PageIntro";
import { getNextLesson, getPreviousLesson } from "@/data/lessons";
import { plays } from "@/data/plays";

export const metadata: Metadata = {
  title: "Common plays",
  description:
    "Beginner X-and-O diagrams for common NFL play types: inside run, sweep, play-action, screen, slant, go route, Hail Mary, a basic blitz, and a draw.",
};

export default function PlaysIndexPage() {
  const previous = getPreviousLesson("plays");
  const next = getNextLesson("plays");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
        Lesson 5 · about 8 min if you browse them all
      </p>
      <PageIntro eyebrow="X’s and O’s" title="Common plays">
        <p>
          Coaches draw the sport like this: cream circles for the team with the
          ball, dark circles with gold letters for the other lot, arrows for where
          people are meant to go. You do not need a 400-page playbook. These nine
          shapes cover most of what you will hear on a Sunday.
        </p>
      </PageIntro>
      <CompactLessonProgress slug="plays" />

      <div className="mt-8">
        <PlayLegend />
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {plays.map((play) => (
          <Link
            key={play.slug}
            href={`/learn/plays/${play.slug}`}
            className="group rounded-2xl border border-line bg-navy-2 p-4 transition hover:border-gold/50 hover:bg-navy-3"
          >
            <PlayDiagram play={play} compact />
            <h2 className="mt-4 font-display text-2xl text-cream group-hover:text-gold-soft">
              {play.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-cream-dim">{play.summary}</p>
            <p className="mt-3 text-sm font-medium text-gold">Open the diagram →</p>
          </Link>
        ))}
      </div>

      <MarkLessonDone
        slug="plays"
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
