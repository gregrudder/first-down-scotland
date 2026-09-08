"use client";

import { useMemo, useState } from "react";
import { TeamLogo } from "@/components/TeamLogo";
import { getTeamProfileByAbbr } from "@/data/team-profiles";
import { teams } from "@/data/teams";
import type { Rookie, RookiesSuccess } from "@/lib/rookies";

function RookieCard({ rookie }: { rookie: Rookie }) {
  const profile = getTeamProfileByAbbr(rookie.teamAbbr);

  return (
    <article className="rounded-2xl border border-line bg-navy-2 p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <TeamLogo
          abbreviation={rookie.teamAbbr}
          primary={profile?.primary}
          secondary={profile?.secondary}
          size={40}
        />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
            Round {rookie.round} · pick {rookie.pick}
          </p>
          <h3 className="mt-1 font-display text-xl text-cream">{rookie.name}</h3>
          <p className="mt-1 text-sm text-cream-dim">
            {rookie.teamName} · {rookie.positionLabel}
            {rookie.college ? ` · ${rookie.college}` : ""}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-navy-3 px-3 py-3">
        {rookie.stats.available && rookie.stats.lines.length > 0 ? (
          <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm sm:grid-cols-3">
            {rookie.stats.lines.map((line) => (
              <div key={line.label}>
                <dt className="text-xs text-cream-dim">{line.label}</dt>
                <dd className="font-semibold text-cream">{line.value}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="text-sm leading-6 text-cream-dim">{rookie.stats.note}</p>
        )}
        {rookie.stats.available && rookie.stats.note ? (
          <p className="mt-2 text-xs text-cream-dim">{rookie.stats.note}</p>
        ) : null}
      </div>
    </article>
  );
}

const SORTS = [
  { id: "pick", label: "Draft order" },
  { id: "name", label: "Name" },
  { id: "team", label: "Team" },
  { id: "round", label: "Round" },
] as const;

export function RookieWatch({
  board,
  initialTeam,
}: {
  board: RookiesSuccess;
  initialTeam?: string;
}) {
  const [team, setTeam] = useState(initialTeam?.toUpperCase() ?? "all");
  const [position, setPosition] = useState("all");
  const [round, setRound] = useState("all");
  const [sort, setSort] = useState<(typeof SORTS)[number]["id"]>("pick");

  const positions = useMemo(() => {
    const seen = new Map<string, string>();
    for (const rookie of board.rookies) {
      if (!seen.has(rookie.position)) seen.set(rookie.position, rookie.positionLabel);
    }
    return [...seen.entries()].sort((a, b) => a[1].localeCompare(b[1]));
  }, [board.rookies]);

  const rounds = useMemo(() => {
    return [...new Set(board.rookies.map((rookie) => rookie.round))].sort((a, b) => a - b);
  }, [board.rookies]);

  const visible = useMemo(() => {
    const rows = board.rookies.filter((rookie) => {
      if (team !== "all" && rookie.teamAbbr.toUpperCase() !== team) return false;
      if (position !== "all" && rookie.position !== position) return false;
      if (round !== "all" && String(rookie.round) !== round) return false;
      return true;
    });

    rows.sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "team") return a.teamName.localeCompare(b.teamName) || a.pick - b.pick;
      if (sort === "round") return a.round - b.round || a.pick - b.pick;
      return a.pick - b.pick;
    });
    return rows;
  }, [board.rookies, position, round, sort, team]);

  return (
    <div className="mt-8">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block text-sm">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-gold">
            Team
          </span>
          <select
            className="mt-2 w-full rounded-xl border border-line bg-navy-2 px-3 py-2 text-cream"
            value={team}
            onChange={(event) => setTeam(event.target.value)}
          >
            <option value="all">All teams</option>
            {teams.map((entry) => (
              <option key={entry.abbreviation} value={entry.abbreviation}>
                {entry.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-gold">
            Position
          </span>
          <select
            className="mt-2 w-full rounded-xl border border-line bg-navy-2 px-3 py-2 text-cream"
            value={position}
            onChange={(event) => setPosition(event.target.value)}
          >
            <option value="all">All positions</option>
            {positions.map(([code, label]) => (
              <option key={code} value={code}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-gold">
            Round
          </span>
          <select
            className="mt-2 w-full rounded-xl border border-line bg-navy-2 px-3 py-2 text-cream"
            value={round}
            onChange={(event) => setRound(event.target.value)}
          >
            <option value="all">All rounds</option>
            {rounds.map((value) => (
              <option key={value} value={String(value)}>
                Round {value}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-gold">
            Sort
          </span>
          <select
            className="mt-2 w-full rounded-xl border border-line bg-navy-2 px-3 py-2 text-cream"
            value={sort}
            onChange={(event) => setSort(event.target.value as (typeof SORTS)[number]["id"])}
          >
            {SORTS.map((entry) => (
              <option key={entry.id} value={entry.id}>
                {entry.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="mt-4 text-sm text-cream-dim" aria-live="polite">
        Showing {visible.length} of {board.rookies.length} drafted rookies.
      </p>

      {visible.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-line bg-navy-2 p-6">
          <h2 className="font-display text-xl text-cream">No rookies match those filters</h2>
          <p className="mt-2 text-sm leading-6 text-cream-dim">
            Clear a filter or pick All teams to see the full {board.draftYear} class.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {visible.map((rookie) => (
            <RookieCard key={rookie.id} rookie={rookie} />
          ))}
        </div>
      )}
    </div>
  );
}
