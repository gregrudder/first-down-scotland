import { TeamLogo } from "@/components/TeamLogo";
import { getTeam } from "@/data/teams";
import type { LateNightGame } from "@/lib/late-night-diary";

function statusLabel(game: LateNightGame): { text: string; className: string } {
  if (game.status === "in-progress") {
    return { text: "Live now", className: "text-live" };
  }
  if (game.status === "final") {
    return { text: "Kick-off gone", className: "text-cream-dim" };
  }
  return { text: game.ukTime, className: "text-gold" };
}

export function LateNightGameCard({
  game,
  favouriteAbbr,
}: {
  game: LateNightGame;
  favouriteAbbr?: string;
}) {
  const yours = favouriteAbbr ? favouriteAbbr.toUpperCase() : "";
  const isYours =
    Boolean(yours) &&
    (game.home.abbreviation.toUpperCase() === yours ||
      game.away.abbreviation.toUpperCase() === yours);
  const awayTeam = getTeam(game.away.abbreviation);
  const homeTeam = getTeam(game.home.abbreviation);
  const status = statusLabel(game);
  const venue = [game.venue, game.venueCity].filter(Boolean).join(" · ");

  return (
    <article
      className={`rounded-2xl border p-4 sm:p-5 ${
        isYours ? "border-gold/50 bg-navy-3" : "border-line bg-navy-2"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <p className={`font-semibold tracking-[0.14em] uppercase ${status.className}`}>
          {status.text}
        </p>
        <p className="text-cream-dim">{game.weekLabel}</p>
      </div>

      {isYours ? (
        <p className="mt-2 text-xs font-semibold tracking-[0.16em] text-gold uppercase">
          Your lot
        </p>
      ) : null}

      <p className="mt-3 font-display text-xl leading-tight text-cream sm:text-2xl">
        {game.nightLabel}
      </p>
      <p className="mt-1 text-sm text-gold">{game.ukDateTime}</p>
      <p className="text-xs text-cream-dim">US graphic: {game.usEastern}</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        <div className="flex items-center gap-3">
          <TeamLogo
            team={awayTeam}
            abbreviation={game.away.abbreviation}
            size={36}
          />
          <div className="min-w-0">
            <p className="truncate font-semibold text-cream">{game.away.shortName}</p>
            <p className="text-xs text-cream-dim">{game.away.abbreviation}</p>
          </div>
        </div>
        <p className="hidden text-center text-xs tracking-[0.16em] text-cream-dim uppercase sm:block">
          at
        </p>
        <div className="flex items-center gap-3 sm:flex-row-reverse sm:text-right">
          <TeamLogo
            team={homeTeam}
            abbreviation={game.home.abbreviation}
            size={36}
          />
          <div className="min-w-0">
            <p className="truncate font-semibold text-cream">{game.home.shortName}</p>
            <p className="text-xs text-cream-dim">{game.home.abbreviation}</p>
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-cream">{game.planningHint}</p>
      {venue ? <p className="mt-2 text-xs text-cream-dim">{venue}</p> : null}
      {game.broadcasts.length > 0 ? (
        <p className="mt-1 text-xs text-cream-dim">US: {game.broadcasts.join(", ")}</p>
      ) : null}
      <p className="mt-2 text-sm leading-6 text-cream-dim">{game.watchHint}</p>
    </article>
  );
}
