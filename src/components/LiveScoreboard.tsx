"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { ByeCard, ScoreCard } from "@/components/ScoreCard";
import type { FixturesResult, FixturesSuccess, NflGame, TeamSide } from "@/lib/espn";
import { formatFetchedAt } from "@/lib/time";
import { savedTeamRecord } from "@/lib/team-storage";

export type ScoreboardPayload = {
  fixtures: FixturesResult;
  byes: TeamSide[];
};

function pollMs(fixtures: FixturesResult): number {
  if (!fixtures.ok) return 30_000;
  if (fixtures.games.some((game) => game.status === "in-progress")) return 20_000;
  const soon = fixtures.games.some((game) => {
    const start = new Date(game.kickoffUtc).getTime();
    return Number.isFinite(start) && start - Date.now() < 90 * 60 * 1000;
  });
  if (soon) return 30_000;
  return 120_000;
}

function weekHeading(fixtures: FixturesSuccess): string {
  const bits = [fixtures.seasonTypeName, fixtures.weekLabel].filter(
    (value) => value && value !== "NFL",
  );
  if (fixtures.seasonYear) bits.unshift(String(fixtures.seasonYear));
  return bits.join(" · ");
}

function seasonHasStarted(fixtures: FixturesSuccess): boolean {
  if ((fixtures.weekNumber ?? 0) > 1) return true;
  return fixtures.games.some(
    (game) => game.status === "in-progress" || game.status === "final",
  );
}

function partition(games: NflGame[]) {
  const live = games.filter((game) => game.status === "in-progress");
  const scheduled = games.filter((game) => game.status === "scheduled");
  const final = games.filter((game) => game.status === "final");
  const other = games.filter(
    (game) =>
      game.status !== "in-progress" && game.status !== "scheduled" && game.status !== "final",
  );
  return { live, scheduled, final, other };
}

function subscribeTeam(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("fds-team-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("fds-team-change", callback);
  };
}

function savedTeamAbbr(): string {
  return savedTeamRecord()?.team.abbreviation ?? "";
}

export function LiveScoreboard({ initial }: { initial: ScoreboardPayload }) {
  const [payload, setPayload] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const highlight = useSyncExternalStore(subscribeTeam, savedTeamAbbr, () => "") || undefined;

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let latest = initial.fixtures;

    async function tick() {
      try {
        const response = await fetch("/api/scores", { cache: "no-store" });
        if (!response.ok) throw new Error("bad status");
        const next = (await response.json()) as ScoreboardPayload;
        if (cancelled) return;
        if (next?.fixtures) {
          latest = next.fixtures;
          setPayload(next);
          setError(null);
        }
      } catch {
        if (!cancelled) {
          setError("Could not refresh scores. Showing the last good board.");
        }
      } finally {
        if (!cancelled) {
          timer = setTimeout(tick, pollMs(latest));
        }
      }
    }

    timer = setTimeout(tick, pollMs(initial.fixtures));
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [initial]);

  const fixtures = payload.fixtures;
  const byes = payload.byes;

  if (!fixtures.ok) {
    return (
      <div className="mt-8 rounded-2xl border border-live/40 bg-navy-2 p-6">
        <h2 className="font-display text-2xl text-cream">The scoreboard is unavailable</h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-cream-dim">{fixtures.error}</p>
        <p className="mt-3 text-xs text-cream-dim">
          Last attempt {formatFetchedAt(fixtures.fetchedAt)}.
        </p>
      </div>
    );
  }

  const groups = partition(fixtures.games);
  const empty = fixtures.games.length === 0 && byes.length === 0;

  return (
    <div className="mt-8" aria-live="polite">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <p className="text-sm text-cream-dim">{weekHeading(fixtures)}</p>
        <p className="text-xs text-cream-dim">
          Refreshed {formatFetchedAt(fixtures.fetchedAt)} · times in Europe/London
        </p>
      </div>
      {error ? <p className="mt-3 text-sm text-live">{error}</p> : null}

      {empty ? (
        <div className="mt-8 rounded-2xl border border-line bg-navy-2 p-6">
          <h2 className="font-display text-2xl text-cream">No games listed just now</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-cream-dim">
            Midweek quiet, a gap between slates, or the next week has not been published yet.
            When ESPN lists kick-offs, they will land here.
          </p>
        </div>
      ) : null}

      {!empty && groups.live.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-line bg-navy-2 p-5">
          <h2 className="font-display text-xl text-cream">Nothing is live right now</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-cream-dim">
            {seasonHasStarted(fixtures)
              ? "No game is in progress. Scheduled and finished scores stay on this board."
              : "Week 1 has not kicked off yet. The slate below is Scheduled until the first snap."}
          </p>
        </div>
      ) : null}

      {groups.live.length > 0 ? (
        <section className="mt-8">
          <h2 className="font-display text-2xl text-cream">Live</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {groups.live.map((game) => (
              <ScoreCard key={game.id} game={game} highlight={highlight} />
            ))}
          </div>
        </section>
      ) : null}

      {groups.scheduled.length > 0 ? (
        <section className="mt-8">
          <h2 className="font-display text-2xl text-cream">Scheduled</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {groups.scheduled.map((game) => (
              <ScoreCard key={game.id} game={game} highlight={highlight} />
            ))}
          </div>
        </section>
      ) : null}

      {groups.final.length > 0 ? (
        <section className="mt-8">
          <h2 className="font-display text-2xl text-cream">Final</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {groups.final.map((game) => (
              <ScoreCard key={game.id} game={game} highlight={highlight} />
            ))}
          </div>
        </section>
      ) : null}

      {groups.other.length > 0 ? (
        <section className="mt-8">
          <h2 className="font-display text-2xl text-cream">Other</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {groups.other.map((game) => (
              <ScoreCard key={game.id} game={game} highlight={highlight} />
            ))}
          </div>
        </section>
      ) : null}

      {byes.length > 0 ? (
        <section className="mt-8">
          <h2 className="font-display text-2xl text-cream">Bye</h2>
          <p className="mt-1 text-sm text-cream-dim">
            These clubs are not on this week’s slate. A bye is a rest week.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {byes.map((team) => (
              <ByeCard key={team.abbreviation} team={team} highlight={highlight} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
