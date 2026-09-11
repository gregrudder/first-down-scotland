import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { getMiniGamesByKind, miniGamesIntro, type MiniGame } from "@/data/mini-games";

export const metadata: Metadata = {
  title: "Mini Games",
  description:
    "Short browser games for UK NFL fans: beginner quizzes plus fun trivia — Super Bowls, catches, rivalries, jersey numbers, and late-night kick-off survival.",
};

function GameGrid({
  games,
  label,
}: {
  games: MiniGame[];
  label: "Game" | "Quiz";
}) {
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      {games.map((game, index) => (
        <Link
          key={game.slug}
          href={`/mini-games/${game.slug}`}
          className="group flex h-full flex-col rounded-2xl border border-line bg-navy-2 p-5 transition hover:border-gold/50 hover:bg-navy-3"
        >
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
              {label} {index + 1}
            </span>
            <span className="text-xs text-cream-dim">{game.minutes} min</span>
          </div>
          <h3 className="mt-3 font-display text-xl text-cream group-hover:text-gold-soft">
            {game.title}
          </h3>
          <p className="mt-2 flex-1 text-sm leading-6 text-cream-dim">{game.summary}</p>
          <span className="mt-4 text-sm font-medium text-gold">Play →</span>
        </Link>
      ))}
    </div>
  );
}

export default function MiniGamesHubPage() {
  const learnGames = getMiniGamesByKind("learn");
  const funGames = getMiniGamesByKind("fun");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <PageIntro eyebrow={miniGamesIntro.eyebrow} title={miniGamesIntro.title}>
        <p>{miniGamesIntro.lead}</p>
      </PageIntro>

      <section className="mt-10">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
          For beginners
        </p>
        <h2 className="mt-2 font-display text-2xl text-cream">Learn with a score</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-cream-dim">
          Downs, famous names, and who plays whom. Use these after a lesson, or when
          you have five minutes on the bus.
        </p>
        <GameGrid games={learnGames} label="Game" />
      </section>

      <section className="mt-14">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
          Fun quizzes
        </p>
        <h2 className="mt-2 font-display text-2xl text-cream">
          For fans who already like the NFL
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-cream-dim">
          Famous moments, silly names, late-night survival. Not a rules lesson. Banter
          first, homework never.
        </p>
        <GameGrid games={funGames} label="Quiz" />
      </section>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Link
          href="/learn/rivalries"
          className="rounded-2xl border border-line bg-navy-2 p-5 transition hover:border-gold/50 hover:bg-navy-3"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">Learn</p>
          <h2 className="mt-2 font-display text-xl text-cream">NFL rivalries</h2>
          <p className="mt-2 text-sm leading-6 text-cream-dim">
            The reading, not the quiz. Who plays whom, and why the crowd cares.
          </p>
        </Link>
        <Link
          href="/learn/famous-players"
          className="rounded-2xl border border-line bg-navy-2 p-5 transition hover:border-gold/50 hover:bg-navy-3"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">Learn</p>
          <h2 className="mt-2 font-display text-xl text-cream">Famous players</h2>
          <p className="mt-2 text-sm leading-6 text-cream-dim">
            Short bios for the names the broadcast assumes you already know.
          </p>
        </Link>
      </div>
    </div>
  );
}
