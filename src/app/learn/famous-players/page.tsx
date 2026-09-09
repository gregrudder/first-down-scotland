import type { Metadata } from "next";
import Link from "next/link";
import { CompactLessonProgress } from "@/components/LearnProgress";
import { MarkLessonDone } from "@/components/MarkLessonDone";
import { PageIntro } from "@/components/PageIntro";
import { PlayerCard } from "@/components/PlayerCard";
import { famousPlayers, famousPlayersIntro, famousPlayersSourcesNote } from "@/data/famous-players";
import { getLesson, getNextLesson, getPreviousLesson, lessons } from "@/data/lessons";

export const metadata: Metadata = {
  title: "Famous NFL players",
  description:
    "Notable NFL players beginners should know: short UK-English bios, teams, and why the names still come up on a Sunday.",
};

export default function FamousPlayersLessonPage() {
  const lesson = getLesson("famous-players");
  const previous = getPreviousLesson("famous-players");
  const next = getNextLesson("famous-players");
  const allTime = famousPlayers.filter((player) => player.group === "all-time");
  const modern = famousPlayers.filter((player) => player.group === "modern");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
        Lesson {lesson?.number ?? 14} of {lessons.length} · {lesson?.minutes ?? 10} min
      </p>
      <PageIntro eyebrow={famousPlayersIntro.eyebrow} title={famousPlayersIntro.title}>
        <p>{famousPlayersIntro.lead}</p>
      </PageIntro>
      <CompactLessonProgress slug="famous-players" />

      <div className="mt-8 rounded-2xl border border-gold/30 bg-navy-3 px-5 py-4">
        <p className="text-sm font-semibold text-gold">This is a lesson, not a game</p>
        <p className="mt-2 text-sm leading-6 text-cream">
          Read the names, then watch a match and see who the commentary treats as
          scripture. If you want clues and a score, Who am I? is in Mini Games.
        </p>
        <Link href="/mini-games/who-am-i" className="mt-3 inline-block text-sm font-semibold text-gold">
          Who am I? →
        </Link>
      </div>

      <h2 className="mt-12 font-display text-2xl text-cream sm:text-3xl">Names that built the tape</h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-cream-dim">
        These are the people older fans assume you already know. You do not. That is
        why they are here.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {allTime.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>

      <h2 className="mt-12 font-display text-2xl text-cream sm:text-3xl">Names you will hear now</h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-cream-dim">
        Still playing, or only just gone. Useful when the graphic flashes a surname
        and everyone else nods.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {modern.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>

      <p className="mt-10 text-xs leading-5 text-cream-dim">{famousPlayersSourcesNote}</p>

      <MarkLessonDone
        slug="famous-players"
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
        ) : (
          <Link href="/mini-games" className="text-sm font-semibold text-gold sm:text-right">
            Play a mini game →
          </Link>
        )}
      </nav>
    </div>
  );
}
