import type { Metadata } from "next";
import Link from "next/link";
import { DraftProspectsTeaser } from "@/components/DraftProspectsTeaser";
import { LearnPathProgress } from "@/components/LearnProgress";
import { LessonCard } from "@/components/LessonCard";
import { PageIntro } from "@/components/PageIntro";
import { lessons } from "@/data/lessons";
import { getDraftProspects } from "@/lib/draft-prospects";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Learn the NFL",
  description:
    "A short, ordered path for UK beginners: the field, downs, scoring, common plays with diagrams, turnovers, the clock, penalties, what to look for on telly, the NFL Draft, and fantasy football.",
};

export default async function LearnIndexPage() {
  const board = await getDraftProspects();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <PageIntro eyebrow="Learning path" title="Short lessons. Start at one.">
        <p>
          Read them in order if you are brand new. Skip ahead if a word on the broadcast
          sent you here. Each one is written in UK English, for people who did not grow
          up with Friday-night lights. Mark a lesson as read and the stage bars keep
          score. When you finish a stage (or the whole path) you can sit a 20-question
          quiz. After that, meet fans of the team you support: Discord for chat, pubs
          for turning up.
        </p>
      </PageIntro>
      <div className="mt-10">
        <LearnPathProgress />
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {lessons.map((lesson) => (
          <LessonCard key={lesson.slug} lesson={lesson} />
        ))}
      </div>
      <div className="mt-10">
        <DraftProspectsTeaser board={board} />
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Link
          href="/history"
          className="rounded-2xl border border-line bg-navy-2 p-5 transition hover:border-gold/50 hover:bg-navy-3"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
            Context
          </p>
          <h2 className="mt-2 font-display text-xl text-cream">NFL history</h2>
          <p className="mt-2 text-sm leading-6 text-cream-dim">
            Merger, Super Bowl, expansion, London: a timeline, not a dissertation.
          </p>
        </Link>
        <Link
          href="/teams"
          className="rounded-2xl border border-line bg-navy-2 p-5 transition hover:border-gold/50 hover:bg-navy-3"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
            The 32
          </p>
          <h2 className="mt-2 font-display text-xl text-cream">Team profiles</h2>
          <p className="mt-2 text-sm leading-6 text-cream-dim">
            Stadium, colours, a few iconic names, Super Bowls at a glance.
          </p>
        </Link>
      </div>
      <p className="mt-10 max-w-3xl text-sm leading-6 text-cream-dim">
        When a lesson clicks, come find people who support the same team:{" "}
        <Link href="/community" className="text-gold">
          Community
        </Link>{" "}
        for Discord chat, and{" "}
        <Link href="/watch-near-you" className="text-gold">
          pubs near you
        </Link>{" "}
        for meeting in person.
      </p>
    </div>
  );
}
