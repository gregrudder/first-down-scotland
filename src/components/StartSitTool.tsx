"use client";

import { useEffect, useId, useState } from "react";
import { useRouter } from "next/navigation";
import {
  SCORING_OPTIONS,
  confidenceLabel,
  projectionLean,
  type PlayerSnapshot,
  type ScoringKey,
  type StartSitComparison,
} from "@/lib/start-sit-logic";
import { formatUkDay } from "@/lib/format-date";

type Hit = { id: string; name: string; position: string; team: string };

export function StartSitTool({
  aId,
  bId,
  comparison,
}: {
  aId: string;
  bId: string;
  comparison: StartSitComparison;
}) {
  const router = useRouter();

  function choose(slot: "a" | "b", id: string) {
    const params = new URLSearchParams();
    const nextA = slot === "a" ? id : aId;
    const nextB = slot === "b" ? id : bId;
    if (nextA) params.set("a", nextA);
    if (nextB) params.set("b", nextB);
    router.push(params.size ? `/start-sit?${params.toString()}` : "/start-sit");
  }

  function clear(slot: "a" | "b") {
    choose(slot, "");
  }

  return (
    <div className="mt-10">
      {comparison.week ? (
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
          Week {comparison.week}
          {comparison.season ? ` · ${comparison.season}` : ""}
        </p>
      ) : null}
      {comparison.error ? <p className="mt-3 text-sm leading-6 text-cream-dim">{comparison.error}</p> : null}

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <PlayerSearch
          label="Player A"
          selected={comparison.a?.name || ""}
          onSelect={(id) => choose("a", id)}
          onClear={() => clear("a")}
        />
        <PlayerSearch
          label="Player B"
          selected={comparison.b?.name || ""}
          onSelect={(id) => choose("b", id)}
          onClear={() => clear("b")}
        />
      </div>

      {comparison.a && comparison.b ? (
        <ComparisonBoard a={comparison.a} b={comparison.b} verdict={comparison.verdict} />
      ) : null}
    </div>
  );
}

function PlayerSearch({
  label,
  selected,
  onSelect,
  onClear,
}: {
  label: string;
  selected: string;
  onSelect: (id: string) => void;
  onClear: () => void;
}) {
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [error, setError] = useState("");
  const listId = useId();

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) return;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      void (async () => {
        try {
          const response = await fetch(`/api/start-sit/search?q=${encodeURIComponent(trimmed)}`, {
            signal: controller.signal,
          });
          const payload = (await response.json()) as { players?: Hit[]; error?: string };
          if (!response.ok) {
            setHits([]);
            setError(payload.error || "Search did not load.");
            return;
          }
          setHits(payload.players ?? []);
          setError("");
        } catch (err) {
          if (err instanceof DOMException && err.name === "AbortError") return;
          setError("Search did not load.");
        }
      })();
    }, 200);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-[0.16em] text-gold" htmlFor={listId}>
        {label}
      </label>
      {selected ? (
        <p className="mt-2 flex items-center justify-between gap-3 text-sm text-cream">
          <span>{selected}</span>
          <button type="button" onClick={onClear} className="text-cream-dim hover:text-gold">
            Clear
          </button>
        </p>
      ) : null}
      <input
        id={listId}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search a player"
        autoComplete="off"
        className="mt-2 w-full rounded-2xl border border-line bg-navy-2 px-4 py-3 text-sm text-cream outline-none focus:border-gold/60"
      />
      {query.trim().length >= 2 && error ? <p className="mt-2 text-xs text-cream-dim">{error}</p> : null}
      {query.trim().length >= 2 && hits.length > 0 ? (
        <ul className="mt-2 overflow-hidden rounded-2xl border border-line bg-navy-2">
          {hits.map((hit) => (
            <li key={hit.id}>
              <button
                type="button"
                onClick={() => {
                  onSelect(hit.id);
                  setQuery("");
                  setHits([]);
                }}
                className="flex w-full items-baseline justify-between gap-3 px-4 py-2 text-left text-sm text-cream hover:bg-navy-3"
              >
                <span>{hit.name}</span>
                <span className="text-xs text-cream-dim">
                  {hit.position}
                  {hit.team ? ` · ${hit.team}` : ""}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function ComparisonBoard({
  a,
  b,
  verdict,
}: {
  a: PlayerSnapshot;
  b: PlayerSnapshot;
  verdict: StartSitComparison["verdict"];
}) {
  const [scoring, setScoring] = useState<ScoringKey>("ppr");
  const scoringLabel = SCORING_OPTIONS.find((option) => option.key === scoring)?.label ?? "PPR";
  const lean = projectionLean(
    { name: a.name, points: a.projections[scoring] },
    { name: b.name, points: b.projections[scoring] },
  );

  return (
    <div className="mt-8">
      {verdict ? (
        <aside className="rounded-2xl border border-gold/40 bg-navy-2 p-5">
          <h2 className="font-display text-2xl text-cream">{"Waiver Wire's verdict"}</h2>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-gold">
            {confidenceLabel(verdict.confidence)}
          </p>
          <p className="mt-2 text-lg text-cream">Start {verdict.verdict}</p>
          {verdict.reason ? <p className="mt-2 text-sm leading-6 text-cream-dim">{verdict.reason}</p> : null}
          {verdict.sourceUrl ? (
            <p className="mt-3 text-sm">
              <a href={verdict.sourceUrl} className="text-gold" target="_blank" rel="noreferrer">
                Source
              </a>
            </p>
          ) : null}
          {verdict.checkedDate ? (
            <p className="mt-2 text-sm text-cream-dim">Checked {formatUkDay(verdict.checkedDate)}</p>
          ) : null}
        </aside>
      ) : null}

      <div className="mt-4">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Scoring">
          {SCORING_OPTIONS.map((option) => (
            <button
              key={option.key}
              type="button"
              aria-pressed={scoring === option.key}
              onClick={() => setScoring(option.key)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
                scoring === option.key ? "bg-gold text-gold-ink" : "border border-line text-cream-dim"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        {lean ? (
          <p className="mt-3 text-sm leading-6 text-cream">
            <span className="font-semibold">Based on Sleeper projections ({scoringLabel}): </span>
            {lean}
          </p>
        ) : null}
        <p className="mt-2 text-sm leading-6 text-cream-dim">
          Not a guarantee. PPR, half-PPR and standard scoring change the numbers.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <PlayerColumn player={a} />
        <PlayerColumn player={b} />
      </div>
      <p className="mt-4 text-xs leading-5 text-cream-dim">
        Position, team, injury, bye and matchup come from Sleeper&apos;s public players list, regular-season
        schedule, weekly projections and weekly stats.
      </p>
    </div>
  );
}

function PlayerColumn({ player }: { player: PlayerSnapshot }) {
  if (!player.name) {
    return (
      <article className="rounded-2xl border border-line bg-navy-2 p-5">
        <p className="text-sm leading-6 text-cream-dim">That player is not on the Sleeper list we loaded.</p>
      </article>
    );
  }

  const rows = [
    ["Position", player.position || "Not listed"],
    ["Team", player.team || "Not listed"],
    ["Injury", player.injury || "Not listed"],
    ["Bye", player.byeWeek ? `Week ${player.byeWeek}` : "Not listed"],
    ["Matchup", player.onBye ? "Bye" : player.opponent || "Not listed"],
    ["PPR", points(player.projections.ppr)],
    ["Half-PPR", points(player.projections.half)],
    ["Standard", points(player.projections.std)],
  ];

  return (
    <article className="rounded-2xl border border-line bg-navy-2 p-5">
      <h2 className="font-display text-2xl text-cream">{player.name}</h2>
      <dl className="mt-4 space-y-2 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4">
            <dt className="text-cream-dim">{label}</dt>
            <dd className="text-right text-cream">{value}</dd>
          </div>
        ))}
      </dl>
      {player.stats.length > 0 ? (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">This week’s stats</p>
          <ul className="mt-2 space-y-1 text-sm text-cream-dim">
            {player.stats.map((stat) => (
              <li key={stat.label}>
                {stat.label}: <span className="text-cream">{stat.value}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </article>
  );
}

function points(value: number | null): string {
  if (value === null) return "Not listed";
  return Number.isInteger(value) ? value.toFixed(1) : value.toFixed(1);
}
