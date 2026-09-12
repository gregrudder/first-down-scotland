import Link from "next/link";
import type { ScoreGame } from "@/lib/score-history";
import { gameWhen, teamHref, teamShortName } from "@/lib/score-history";

export function ScoreGameRow({ game }: { game: ScoreGame }) {
  const awayName = teamShortName(game.away);
  const homeName = teamShortName(game.home);

  return (
    <article className="rounded-2xl border border-line bg-navy-2 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cream-dim">
        {gameWhen(game)}
      </p>
      <p className="mt-2 font-display text-xl text-cream">
        <Link href={teamHref(game.away)} className="text-cream hover:text-gold">
          {awayName}
        </Link>{" "}
        {game.awayScore}{" "}
        <span className="text-cream-dim">at</span>{" "}
        <Link href={teamHref(game.home)} className="text-cream hover:text-gold">
          {homeName}
        </Link>{" "}
        {game.homeScore}
      </p>
      <p className="mt-1 text-xs text-cream-dim">
        {game.away} {game.awayScore}-{game.home} {game.homeScore}
      </p>
    </article>
  );
}
