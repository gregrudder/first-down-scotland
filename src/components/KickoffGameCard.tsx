import { TeamLogo } from "@/components/TeamLogo";
import { discordInviteUrl } from "@/lib/discord";
import {
  VIEWING_WINDOWS,
  formatKickoffUk,
  matchupLabel,
  sideLabel,
  venueLabel,
  type KickoffGame,
} from "@/lib/uk-kickoff";

export function KickoffGameCard({
  game,
  teamAbbr,
  weekLabel = true,
}: {
  game: KickoffGame;
  teamAbbr?: string;
  weekLabel?: boolean;
}) {
  const invite = discordInviteUrl();
  const window = VIEWING_WINDOWS[game.windowId];
  const matchup = matchupLabel(game);
  const side = teamAbbr ? sideLabel(game, teamAbbr) : null;

  return (
    <article
      aria-labelledby={`kickoff-${game.id}`}
      className="flex h-full flex-col rounded-2xl border border-line bg-navy-2 p-4"
    >
      <p className="text-sm font-semibold text-gold">
        {weekLabel ? `Week ${game.week} · ` : null}
        <time dateTime={game.kickoffUtc}>{formatKickoffUk(game.kickoffUtc)}</time>
      </p>
      <div className="mt-3 flex items-center gap-3">
        <span className="shrink-0">
          <TeamLogo team={game.awayTeam} size={36} />
        </span>
        <p id={`kickoff-${game.id}`} className="min-w-0 flex-1 font-display text-2xl leading-tight text-cream">
          {matchup}
        </p>
        <span className="shrink-0">
          <TeamLogo team={game.homeTeam} size={36} />
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-cream-dim">
        {side ? `${side} · ` : null}
        {venueLabel(game)}
      </p>
      <ul className="mt-3 flex flex-wrap gap-2">
        <li className="rounded-full border border-line px-2.5 py-1 text-xs font-semibold text-cream">
          {window.label}
        </li>
        {game.international ? (
          <li className="rounded-full border border-gold/40 px-2.5 py-1 text-xs font-semibold text-gold">
            International Series
          </li>
        ) : null}
      </ul>
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold">
        <a href={`/kick-off-planner/calendar?game=${game.id}`} className="text-gold hover:text-gold-soft">
          Add to calendar
          <span className="sr-only">: {matchup}</span>
        </a>
        <a href={invite} target="_blank" rel="noopener noreferrer" className="text-gold hover:text-gold-soft">
          Watch along in the Discord
          <span className="sr-only">: {matchup}</span>
        </a>
      </div>
    </article>
  );
}
