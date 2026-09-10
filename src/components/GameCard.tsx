import Image from "next/image";
import Link from "next/link";
import { GameHighlights } from "@/components/GameHighlights";
import { GameReportBlock } from "@/components/GameReportBlock";
import { TouchdownScorers } from "@/components/TouchdownScorers";
import type { NflGame, TeamSide } from "@/lib/espn";
import type { GameReport } from "@/lib/game-report";
import { formatGameLength } from "@/lib/game-length";
import { rarityLabel, lookupWinnerLoser } from "@/lib/score-history";
import { scoreHistoryPath } from "@/lib/score-history-path";
import { formatUkTime } from "@/lib/time";
import { watchHintForGame } from "@/lib/watch-hints";

function statusClass(status: NflGame["status"]) {
  if (status === "in-progress") return "text-live";
  if (status === "final") return "text-cream-dim";
  return "text-gold";
}

function statusLabel(game: NflGame) {
  if (game.status === "in-progress") {
    const quarter = game.period ? `Q${game.period}` : "Live";
    return game.clock ? `Live · ${quarter} ${game.clock}` : `Live · ${quarter}`;
  }
  if (game.status === "final") return "Full time";
  return formatUkTime(game.kickoffUtc);
}

function TeamRow({
  team,
  showScore,
  align = "left",
}: {
  team: TeamSide;
  showScore: boolean;
  align?: "left" | "right";
}) {
  return (
    <div
      className={`flex items-center gap-3 ${align === "right" ? "flex-row-reverse text-right" : ""}`}
    >
      {team.logo ? (
        <Image
          src={team.logo}
          alt=""
          width={36}
          height={36}
          className="h-9 w-9 shrink-0 object-contain"
        />
      ) : (
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-3 text-xs font-semibold">
          {team.abbreviation}
        </span>
      )}
      <div className="min-w-0">
        <p
          className={`truncate font-semibold text-cream ${team.winner ? "fds-winner text-gold-soft" : ""}`}
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
        <p className="fds-spoiler w-8 text-center font-display text-2xl text-cream">
          {team.score ?? 0}
        </p>
      ) : null}
    </div>
  );
}

export function GameCard({
  game,
  report,
}: {
  game: NflGame;
  report?: GameReport;
}) {
  const started = game.status === "in-progress" || game.status === "final";
  const venue = [game.venue, game.venueCity].filter(Boolean).join(" · ");
  const lengthLabel =
    game.status === "final" && game.elapsedMinutes
      ? formatGameLength(game.elapsedMinutes)
      : undefined;

  return (
    <article className="rounded-2xl border border-line bg-navy-2 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3 text-xs">
        {game.status === "in-progress" ? (
          <>
            <p className={`fds-spoiler font-semibold uppercase tracking-[0.14em] ${statusClass(game.status)}`}>
              {statusLabel(game)}
            </p>
            <p className="fds-spoiler-safe font-semibold uppercase tracking-[0.14em] text-live">
              Live
            </p>
          </>
        ) : (
          <p className={`font-semibold uppercase tracking-[0.14em] ${statusClass(game.status)}`}>
            {statusLabel(game)}
          </p>
        )}
        {game.broadcasts.length > 0 ? (
          <p className="text-cream-dim">US: {game.broadcasts.join(", ")}</p>
        ) : null}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        <TeamRow team={game.away} showScore={started} />
        <p className="hidden text-center text-xs uppercase tracking-[0.16em] text-cream-dim sm:block">
          at
        </p>
        <TeamRow team={game.home} showScore={started} align="right" />
      </div>

      {started ? (
        <p className="fds-spoiler-safe mt-3 text-xs leading-5 text-cream-dim">
          Result hidden. Turn off spoiler-free to see the score.
        </p>
      ) : null}

      <TouchdownScorers touchdowns={started ? game.touchdowns : undefined} />

      {venue ? <p className="mt-4 text-xs text-cream-dim">{venue}</p> : null}
      {lengthLabel ? <p className="mt-1 text-xs text-cream-dim">{lengthLabel}</p> : null}
      <p className="mt-2 text-sm leading-6 text-cream-dim">{watchHintForGame(game)}</p>
      {game.status === "final" && game.home.score != null && game.away.score != null ? (
        <p className="fds-spoiler mt-2 text-sm">
          <Link href={scoreHistoryPath(game.home.score, game.away.score)} className="text-gold">
            {rarityLabel(lookupWinnerLoser(game.home.score, game.away.score).count)} in our
            score table →
          </Link>
        </p>
      ) : null}
      {report ? <GameReportBlock report={report} /> : null}
      <GameHighlights game={game} />
    </article>
  );
}
