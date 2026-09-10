import Link from "next/link";
import { GameHighlights } from "@/components/GameHighlights";
import { TeamLogo } from "@/components/TeamLogo";
import { TouchdownScorers } from "@/components/TouchdownScorers";
import { getTeamProfileByAbbr } from "@/data/team-profiles";
import { teamProfilePath } from "@/data/teams";
import type { NflGame, TeamSide } from "@/lib/espn";
import { formatGameLength } from "@/lib/game-length";
import { scoreHistoryPath } from "@/lib/score-history-path";
import { formatUkTime } from "@/lib/time";

function statusTone(status: NflGame["status"] | "bye") {
  if (status === "in-progress") return "text-live";
  if (status === "final") return "text-cream-dim";
  if (status === "bye") return "text-cream-dim";
  return "text-gold";
}

function gameStatusLabel(game: NflGame): string {
  if (game.status === "in-progress") {
    const quarter = game.period ? `Q${game.period}` : "Live";
    return game.clock ? `Live · ${quarter} ${game.clock}` : `Live · ${quarter}`;
  }
  if (game.status === "final") return "Final";
  if (game.status === "scheduled") return `Scheduled · ${formatUkTime(game.kickoffUtc)}`;
  return game.statusText || "See kick-off time";
}

function TeamScore({
  team,
  showScore,
  winner,
}: {
  team: TeamSide;
  showScore: boolean;
  winner?: boolean;
}) {
  const profile = getTeamProfileByAbbr(team.abbreviation);
  return (
    <div className="flex items-center gap-3">
      <TeamLogo
        abbreviation={team.abbreviation}
        primary={profile?.primary}
        secondary={profile?.secondary}
        size={40}
      />
      <div className="min-w-0 flex-1">
        <p
          className={`truncate font-semibold ${winner ? "fds-winner text-gold-soft" : "text-cream"}`}
        >
          {team.shortName}
        </p>
        <p className="text-xs text-cream-dim">
          {team.abbreviation}
          {team.record ? (
            <span className={showScore ? "fds-spoiler" : undefined}>{` · ${team.record}`}</span>
          ) : null}
        </p>
      </div>
      {showScore ? (
        <p className="fds-spoiler w-10 text-right font-display text-3xl text-cream">
          {team.score ?? 0}
        </p>
      ) : null}
    </div>
  );
}

export function ScoreCard({
  game,
  highlight,
}: {
  game: NflGame;
  highlight?: string;
}) {
  const started = game.status === "in-progress" || game.status === "final";
  const venue = [game.venue, game.venueCity].filter(Boolean).join(" · ");
  const marked =
    highlight &&
    [game.home.abbreviation, game.away.abbreviation].some(
      (abbr) => abbr.toUpperCase() === highlight.toUpperCase(),
    );
  const lengthLabel =
    game.status === "final" && game.elapsedMinutes
      ? formatGameLength(game.elapsedMinutes)
      : undefined;

  return (
    <article
      className={`rounded-2xl border bg-navy-2 p-4 sm:p-5 ${
        marked ? "border-gold/50" : "border-line"
      }`}
    >
      <div className="flex items-center justify-between gap-3 text-xs">
        <p
          className={`font-semibold uppercase tracking-[0.14em] ${statusTone(game.status)}${
            game.status === "in-progress" ? " fds-spoiler" : ""
          }`}
        >
          {gameStatusLabel(game)}
        </p>
        {game.status === "in-progress" ? (
          <span className="inline-flex items-center gap-1.5 text-live">
            <span className="h-2 w-2 rounded-full bg-live motion-safe:animate-pulse" aria-hidden />
            Live
          </span>
        ) : null}
      </div>

      <div className="mt-4 space-y-3">
        <TeamScore
          team={game.away}
          showScore={started}
          winner={game.status === "final" && game.away.winner}
        />
        <TeamScore
          team={game.home}
          showScore={started}
          winner={game.status === "final" && game.home.winner}
        />
      </div>

      {started ? (
        <p className="fds-spoiler-safe mt-3 text-xs leading-5 text-cream-dim">
          Result hidden. Turn off spoiler-free to see the score.
        </p>
      ) : null}

      <TouchdownScorers touchdowns={started ? game.touchdowns : undefined} />

      {venue ? <p className="mt-4 text-xs text-cream-dim">{venue}</p> : null}
      {lengthLabel ? <p className="mt-1 text-xs text-cream-dim">{lengthLabel}</p> : null}
      <p className="mt-3 text-sm">
        <Link href="/this-week" className="text-gold">
          Preview or report →
        </Link>
        {game.status === "final" && game.home.score != null && game.away.score != null ? (
          <span className="fds-spoiler">
            {" · "}
            <Link href={scoreHistoryPath(game.home.score, game.away.score)} className="text-gold">
              Has this final happened before?
            </Link>
          </span>
        ) : null}
      </p>
      <GameHighlights game={game} />
    </article>
  );
}

export function ByeCard({ team, highlight }: { team: TeamSide; highlight?: string }) {
  const profile = getTeamProfileByAbbr(team.abbreviation);
  const marked = highlight?.toUpperCase() === team.abbreviation.toUpperCase();

  return (
    <article
      className={`rounded-2xl border bg-navy-2 p-4 sm:p-5 ${
        marked ? "border-gold/50" : "border-line"
      }`}
    >
      <p className={`text-xs font-semibold uppercase tracking-[0.14em] ${statusTone("bye")}`}>
        Bye
      </p>
      <div className="mt-4 flex items-center gap-3">
        <TeamLogo
          abbreviation={team.abbreviation}
          primary={profile?.primary}
          secondary={profile?.secondary}
          size={40}
        />
        <div className="min-w-0">
          <p className="font-semibold text-cream">{team.shortName}</p>
          <p className="text-xs text-cream-dim">{team.abbreviation} · not playing this week</p>
        </div>
      </div>
      <p className="mt-3 text-sm">
        <Link href={teamProfilePath(team.abbreviation)} className="text-gold">
          Team page →
        </Link>
      </p>
    </article>
  );
}
