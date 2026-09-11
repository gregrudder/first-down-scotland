"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { LateNightGameCard } from "@/components/LateNightGameCard";
import { useFavouriteTeam } from "@/components/useFavouriteTeam";
import {
  groupLateGames,
  involvesTeam,
  isUpcomingLateGame,
  LATE_THRESHOLD_COPY,
  SCHEDULE_CHANGE_COPY,
  type LateNightGame,
} from "@/lib/late-night-diary";

type Filter = "all" | "mine";

function ScheduleDisclaimer({
  checkDayLabel,
  count,
  teamLabel,
}: {
  checkDayLabel: string;
  count: number;
  teamLabel?: string;
}) {
  const scope = teamLabel
    ? `${count} late ${teamLabel} kick-off${count === 1 ? "" : "s"}`
    : `${count} late kick-off${count === 1 ? "" : "s"}`;

  return (
    <aside
      className="mt-6 rounded-2xl border border-gold/40 bg-navy-2 px-5 py-4"
      role="note"
    >
      <p className="text-sm font-semibold text-gold">Schedule subject to change</p>
      <p className="mt-2 text-sm leading-6 text-cream">{SCHEDULE_CHANGE_COPY}</p>
      <p className="mt-2 text-sm leading-6 text-cream-dim">
        Full late slate as of {checkDayLabel}: {scope} from today forward, as ESPN
        has them listed now. Flex weeks and TV slots can still move.
      </p>
    </aside>
  );
}

export function LateNightDiary({
  games,
  checkDayLabel,
  feedError,
}: {
  games: LateNightGame[];
  checkDayLabel: string;
  feedError?: string;
}) {
  const { team } = useFavouriteTeam();
  const [filter, setFilter] = useState<Filter>("all");

  const visible = useMemo(() => {
    if (filter === "mine" && team) {
      return games.filter((game) => involvesTeam(game, team.abbreviation));
    }
    return games;
  }, [filter, games, team]);

  const upcoming = useMemo(
    () => visible.filter((game) => isUpcomingLateGame(game)),
    [visible],
  );
  const yoursUpcoming = useMemo(
    () =>
      team
        ? games.filter(
            (game) => involvesTeam(game, team.abbreviation) && isUpcomingLateGame(game),
          )
        : [],
    [games, team],
  );
  const groups = useMemo(() => groupLateGames(visible), [visible]);
  const teamLabel = filter === "mine" && team ? team.shortName : undefined;

  return (
    <div>
      <aside className="mt-8 rounded-2xl border border-gold/30 bg-navy-3 px-5 py-4">
        <p className="text-sm font-semibold text-gold">What counts as late</p>
        <p className="mt-2 text-sm leading-6 text-cream">{LATE_THRESHOLD_COPY}</p>
        <p className="mt-2 text-sm leading-6 text-cream-dim">
          Times are Europe/London (BST or GMT). This page is kick-off times only —
          no scores, even if spoiler-free is off. For the full Sunday card see{" "}
          <Link href="/this-week" className="text-gold">
            This week
          </Link>
          .
        </p>
      </aside>

      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Late Night Diary filter">
        <button
          type="button"
          onClick={() => setFilter("all")}
          aria-pressed={filter === "all"}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            filter === "all"
              ? "bg-gold text-gold-ink"
              : "border border-line text-cream hover:border-gold/50"
          }`}
        >
          All teams
        </button>
        {team ? (
          <button
            type="button"
            onClick={() => setFilter("mine")}
            aria-pressed={filter === "mine"}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              filter === "mine"
                ? "bg-gold text-gold-ink"
                : "border border-line text-cream hover:border-gold/50"
            }`}
          >
            {team.shortName} only
          </button>
        ) : (
          <Link
            href="/pick-your-team"
            className="rounded-full border border-dashed border-gold/40 px-4 py-2 text-sm font-semibold text-gold hover:border-gold/70"
          >
            Pick a team for Your team only
          </Link>
        )}
      </div>

      <ScheduleDisclaimer
        checkDayLabel={checkDayLabel}
        count={visible.length}
        teamLabel={teamLabel}
      />

      {filter === "all" && team && yoursUpcoming.length > 0 ? (
        <section className="mt-8 rounded-2xl border border-gold/45 bg-navy-2 p-5 sm:p-6">
          <p className="text-xs font-semibold tracking-[0.16em] text-gold uppercase">
            Your late nights
          </p>
          <h2 className="mt-2 font-display text-2xl text-cream sm:text-3xl">
            {team.shortName} on the late shift
          </h2>
          <p className="mt-2 text-sm leading-6 text-cream-dim">
            Every remaining late {team.shortName} kick-off on the list as of{" "}
            {checkDayLabel}. Same schedule-subject-to-change rule as the full slate.
          </p>
          <ul className="mt-4 divide-y divide-line">
            {yoursUpcoming.map((game) => {
              const other =
                game.home.abbreviation.toUpperCase() === team.abbreviation.toUpperCase()
                  ? game.away
                  : game.home;
              const home =
                game.home.abbreviation.toUpperCase() === team.abbreviation.toUpperCase();
              return (
                <li key={game.id} className="py-3">
                  <p className="text-xs text-cream-dim">{game.weekLabel}</p>
                  <p className="font-medium text-cream">
                    {home ? `v ${other.shortName} at home` : `@ ${other.shortName}`}
                  </p>
                  <p className="text-sm text-gold">{game.ukDateTime}</p>
                  <p className="text-sm text-cream-dim">{game.nightLabel}</p>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {upcoming.length > 0 ? (
        <section className="mt-8">
          <h2 className="font-display text-2xl text-cream">
            {filter === "mine" && team
              ? `Full ${team.shortName} late slate`
              : "Full late slate from today"}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-cream-dim">
            Every late kick-off still listed from today forward. Nap before the
            overnight ones, or book the morning after if you need to be useful at
            work.
          </p>
          <ol className="mt-4 grid gap-3 sm:grid-cols-2">
            {upcoming.map((game) => (
              <li
                key={game.id}
                className="rounded-2xl border border-line bg-navy-2 px-4 py-3"
              >
                <p className="text-xs font-semibold tracking-[0.14em] text-gold uppercase">
                  {game.slateHeading}
                </p>
                <p className="mt-1 font-semibold text-cream">
                  {game.away.abbreviation} @ {game.home.abbreviation}
                </p>
                <p className="text-sm text-gold">{game.ukDateTime}</p>
                <p className="text-sm text-cream-dim">{game.nightLabel}</p>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {feedError ? (
        <div className="mt-10 rounded-2xl border border-live/40 bg-navy-2 p-6">
          <h2 className="font-display text-2xl text-cream">The feed is unavailable</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-cream-dim">{feedError}</p>
          <p className="mt-3 text-xs text-cream-dim">
            You can still{" "}
            <Link href="/learn" className="text-gold">
              keep learning
            </Link>{" "}
            or read{" "}
            <Link href="/watch" className="text-gold">
              where to watch
            </Link>
            .
          </p>
        </div>
      ) : visible.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-line bg-navy-2 p-6">
          <h2 className="font-display text-2xl text-cream">
            {filter === "mine" && team
              ? `No late ${team.shortName} kick-offs from today`
              : "No late kick-offs listed from today"}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-cream-dim">
            {filter === "mine" && team
              ? `Nothing late remains for ${team.shortName} on the slate as of ${checkDayLabel}. Their next game might be the early Sunday window — around 6pm UK — which this diary skips.`
              : `The live scoreboard has nothing late from ${checkDayLabel} forward. That is usually an off-week, a London afternoon, or a gap while the next slate is published.`}
          </p>
          {filter === "mine" && team ? (
            <button
              type="button"
              onClick={() => setFilter("all")}
              className="mt-4 text-sm font-semibold text-gold"
            >
              Show every late game →
            </button>
          ) : (
            <Link href="/this-week" className="mt-4 inline-block text-sm font-semibold text-gold">
              Open this week’s games →
            </Link>
          )}
        </div>
      ) : (
        <div className="mt-10 space-y-12">
          {groups.map((group) => (
            <section key={group.key}>
              <div className="flex flex-wrap items-end justify-between gap-3">
                <h2 className="font-display text-2xl text-cream sm:text-3xl">
                  {group.heading}
                </h2>
                <p className="text-sm text-cream-dim">{group.weekLabel}</p>
              </div>
              <div className="mt-5 space-y-8">
                {group.nights.map((night) => (
                  <div key={night.nightKey}>
                    <h3 className="font-display text-xl text-cream">{night.nightLabel}</h3>
                    <div className="mt-3 grid gap-4 lg:grid-cols-2">
                      {night.games.map((game) => (
                        <LateNightGameCard
                          key={game.id}
                          game={game}
                          favouriteAbbr={team?.abbreviation}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
