"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ScoreGameRow } from "@/components/ScoreGameRow";
import {
  commonLookups,
  countPhrase,
  lookupHomeAway,
  lookupWinnerLoser,
  onceRecentLookups,
  rarityLabel,
  scoreHistoryMeta,
  type ScoreLookup,
} from "@/lib/score-history";
import { scoreHistoryPath } from "@/lib/score-history-path";

type Mode = "winner-loser" | "home-away";

function parseScoreParam(value: string | null): number | "" {
  if (value == null || value === "") return "";
  const number = Number(value);
  if (!Number.isInteger(number) || number < 0 || number > 99) return "";
  return number;
}

function scoreHeading(lookup: ScoreLookup): string {
  if (lookup.mode === "home-away") {
    return `Home ${lookup.homeScore}, away ${lookup.awayScore}`;
  }
  if (lookup.tie) return `${lookup.high}–${lookup.low} (a draw)`;
  return `${lookup.high}–${lookup.low}`;
}

export function ScoreHistoryExplorer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const startA = parseScoreParam(searchParams.get("a"));
  const startB = parseScoreParam(searchParams.get("b"));
  const startMode: Mode = searchParams.get("mode") === "ha" ? "home-away" : "winner-loser";

  const [mode, setMode] = useState<Mode>(startMode);
  const [scoreA, setScoreA] = useState<number | "">(startA);
  const [scoreB, setScoreB] = useState<number | "">(startB);

  const lookup = useMemo(() => {
    if (scoreA === "" || scoreB === "") return null;
    return mode === "home-away"
      ? lookupHomeAway(scoreA, scoreB)
      : lookupWinnerLoser(scoreA, scoreB);
  }, [mode, scoreA, scoreB]);

  const common = useMemo(() => commonLookups(), []);
  const onceRecent = useMemo(() => onceRecentLookups(), []);

  function commit(nextA: number | "", nextB: number | "", nextMode: Mode) {
    const params = new URLSearchParams();
    if (nextA !== "") params.set("a", String(nextA));
    if (nextB !== "") params.set("b", String(nextB));
    if (nextMode === "home-away") params.set("mode", "ha");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function onPreset(key: string) {
    const [high, low] = key.split("-").map(Number);
    if (high == null || low == null) return;
    setMode("winner-loser");
    setScoreA(high);
    setScoreB(low);
    commit(high, low, "winner-loser");
  }

  const aLabel = mode === "home-away" ? "Home points" : "Winner (or first score)";
  const bLabel = mode === "home-away" ? "Away points" : "Loser (or second score)";

  return (
    <div>
      <form
        className="mt-10 rounded-2xl border border-line bg-navy-2 p-5 sm:p-6"
        onSubmit={(event) => {
          event.preventDefault();
          commit(scoreA, scoreB, mode);
        }}
      >
        <fieldset className="flex flex-wrap gap-2">
          <legend className="sr-only">How to read the two numbers</legend>
          <button
            type="button"
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              mode === "winner-loser"
                ? "bg-gold text-gold-ink"
                : "border border-line text-cream hover:border-gold/50"
            }`}
            aria-pressed={mode === "winner-loser"}
            onClick={() => {
              setMode("winner-loser");
              commit(scoreA, scoreB, "winner-loser");
            }}
          >
            Winner–loser
          </button>
          <button
            type="button"
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              mode === "home-away"
                ? "bg-gold text-gold-ink"
                : "border border-line text-cream hover:border-gold/50"
            }`}
            aria-pressed={mode === "home-away"}
            onClick={() => {
              setMode("home-away");
              commit(scoreA, scoreB, "home-away");
            }}
          >
            Home and away
          </button>
        </fieldset>
        <p className="mt-3 text-sm leading-6 text-cream-dim">
          {mode === "home-away"
            ? "Home is the club listed as the host, including London and other neutral-site “home” sides in the table."
            : "Order does not matter. 24–17 is the same as 17–24: the winner scored 24 and the loser scored 17."}
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-cream">{aLabel}</span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              max={99}
              value={scoreA}
              onChange={(event) => {
                const next = parseScoreParam(event.target.value);
                setScoreA(next);
              }}
              placeholder="24"
              className="mt-2 w-full rounded-xl border border-line bg-navy-3 px-4 py-3 text-base text-cream placeholder:text-cream-dim/70"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-cream">{bLabel}</span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              max={99}
              value={scoreB}
              onChange={(event) => {
                const next = parseScoreParam(event.target.value);
                setScoreB(next);
              }}
              placeholder="17"
              className="mt-2 w-full rounded-xl border border-line bg-navy-3 px-4 py-3 text-base text-cream placeholder:text-cream-dim/70"
            />
          </label>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-gold-ink hover:bg-gold-soft"
          >
            Look up this final
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-cream hover:border-gold/50"
            onClick={() => {
              setScoreA("");
              setScoreB("");
              commit("", "", mode);
            }}
          >
            Clear
          </button>
        </div>
      </form>

      {lookup ? <LookupResult lookup={lookup} /> : null}

      <section className="mt-12">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
          Pick a familiar one
        </p>
        <h2 className="mt-2 font-display text-2xl text-cream">Most common finals in our table</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-cream-dim">
          These are the winner–loser scorelines that show up most often from{" "}
          {scoreHistoryMeta.seasonFrom} to {scoreHistoryMeta.seasonTo}. Tap one to look it up.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {common.map((entry) => (
            <button
              key={entry.key}
              type="button"
              onClick={() => onPreset(entry.key)}
              className="rounded-full border border-line bg-navy-2 px-3 py-1.5 text-sm text-cream hover:border-gold/50"
            >
              {entry.high}–{entry.low}
              <span className="ml-2 text-cream-dim">{entry.count}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
          Unusual
        </p>
        <h2 className="mt-2 font-display text-2xl text-cream">Recent one-offs</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-cream-dim">
          Each of these winner–loser finals appears once in our table. That means it is rare
          since {scoreHistoryMeta.seasonFrom}, not that it can never happen again.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {onceRecent.map((entry) => (
            <Link
              key={entry.key}
              href={scoreHistoryPath(entry.high, entry.low)}
              className="rounded-2xl border border-line bg-navy-2 p-4 transition hover:border-gold/50 hover:bg-navy-3"
            >
              <p className="font-display text-2xl text-cream">
                {entry.high}–{entry.low}
              </p>
              <p className="mt-1 text-sm text-cream-dim">Once in our table</p>
              {entry.last ? (
                <p className="mt-2 text-sm leading-6 text-cream-dim">
                  {entry.last.away} {entry.last.awayScore} at {entry.last.home}{" "}
                  {entry.last.homeScore}
                </p>
              ) : null}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function LookupResult({ lookup }: { lookup: ScoreLookup }) {
  const seen = new Set(
    [lookup.first, lookup.last]
      .filter((game): game is NonNullable<typeof game> => Boolean(game))
      .map((game) => `${game.date}-${game.away}-${game.home}`),
  );
  const examples = lookup.examples.filter((game) => {
    const id = `${game.date}-${game.away}-${game.home}`;
    if (seen.has(id)) return false;
    if (lookup.mode !== "home-away" || lookup.homeScore == null || lookup.awayScore == null) {
      return true;
    }
    return game.homeScore === lookup.homeScore && game.awayScore === lookup.awayScore;
  });

  return (
    <section className="mt-10">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
        {rarityLabel(lookup.count)}
      </p>
      <h2 className="mt-2 font-display text-3xl text-cream">{scoreHeading(lookup)}</h2>
      <p className="mt-3 max-w-2xl text-base leading-7 text-cream-dim">
        {countPhrase(lookup.count, scoreHistoryMeta.seasonFrom, scoreHistoryMeta.seasonTo)}
      </p>

      {!lookup.found ? (
        <div className="mt-6 rounded-2xl border border-line bg-navy-2 p-5">
          <h3 className="font-display text-xl text-cream">Nothing to show for that exact final</h3>
          <p className="mt-2 text-sm leading-6 text-cream-dim">
            Our snapshot starts in {scoreHistoryMeta.seasonFrom} and stops at the last completed
            season in the file ({scoreHistoryMeta.seasonTo}). A blank result is not a claim that
            the score never happened in the 1920s, or that it is impossible under the rules.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {lookup.first ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                First in our table
              </p>
              <div className="mt-2">
                <ScoreGameRow game={lookup.first} />
              </div>
            </div>
          ) : null}
          {lookup.last ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                Most recent
              </p>
              <div className="mt-2">
                <ScoreGameRow game={lookup.last} />
              </div>
            </div>
          ) : null}
        </div>
      )}

      {examples.length > 0 ? (
        <div className="mt-8">
          <h3 className="font-display text-2xl text-cream">Example games</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-cream-dim">
            A recent sample from the table, not every match. Home side listed second, as on a
            US scoreboard.
          </p>
          <div className="mt-4 grid gap-3">
            {examples.map((game) => (
              <ScoreGameRow
                key={`${game.date}-${game.away}-${game.home}`}
                game={game}
              />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
