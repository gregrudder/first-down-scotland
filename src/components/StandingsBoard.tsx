"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import { TeamLogo } from "@/components/TeamLogo";
import { getTeamProfileByAbbr } from "@/data/team-profiles";
import { teamProfilePath } from "@/data/teams";
import type { Conference, DivisionStanding, StandingTeam } from "@/lib/standings";
import { savedTeamRecord } from "@/lib/team-storage";

function recordLine(team: StandingTeam): string {
  return team.ties > 0
    ? `${team.wins}-${team.losses}-${team.ties}`
    : `${team.wins}-${team.losses}`;
}

function DivisionTable({
  division,
  highlight,
}: {
  division: DivisionStanding;
  highlight?: string;
}) {
  return (
    <section className="rounded-2xl border border-line bg-navy-2 p-4 sm:p-5">
      <h3 className="font-display text-xl text-cream">{division.heading}</h3>
      <p className="mt-1 text-xs text-cream-dim">
        Ranked in the division. W-L-T is wins, losses and ties.
      </p>
      <ol className="mt-4 divide-y divide-line">
        {division.teams.map((team) => {
          const profile = getTeamProfileByAbbr(team.abbreviation);
          const current = highlight?.toUpperCase() === team.abbreviation.toUpperCase();
          return (
            <li key={team.abbreviation}>
              <Link
                href={teamProfilePath(team.abbreviation)}
                className={`flex items-center gap-3 py-3 no-underline ${
                  current ? "rounded-xl bg-navy-3 px-2" : ""
                }`}
              >
                <span className="w-6 text-center font-display text-lg text-gold" aria-hidden>
                  {team.divisionRank}
                </span>
                <TeamLogo
                  abbreviation={team.abbreviation}
                  primary={profile?.primary}
                  secondary={profile?.secondary}
                  size={36}
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold text-cream">
                    {team.shortName}
                    <span className="sr-only">, division rank {team.divisionRank}</span>
                  </span>
                  <span className="block text-xs text-cream-dim">
                    {team.abbreviation}
                    {team.playoffSeed ? ` · play-off seed ${team.playoffSeed}` : ""}
                  </span>
                </span>
                <span className="text-right">
                  <span className="block font-display text-xl text-cream">{recordLine(team)}</span>
                  <span className="block text-xs text-cream-dim">
                    PF {team.pointsFor} · PA {team.pointsAgainst}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
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

export function StandingsBoard({ divisions }: { divisions: DivisionStanding[] }) {
  const [conference, setConference] = useState<"all" | Conference>("all");
  const highlight = useSyncExternalStore(subscribeTeam, savedTeamAbbr, () => "") || undefined;

  const visible = useMemo(() => {
    if (conference === "all") return divisions;
    return divisions.filter((division) => division.conference === conference);
  }, [conference, divisions]);

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Conference filter">
        {(
          [
            ["all", "All 32"],
            ["AFC", "AFC"],
            ["NFC", "NFC"],
          ] as const
        ).map(([id, label]) => {
          const selected = conference === id;
          return (
            <button
              key={id}
              type="button"
              aria-pressed={selected}
              onClick={() => setConference(id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                selected
                  ? "bg-gold text-gold-ink"
                  : "border border-line text-cream-dim hover:text-cream"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {visible.map((division) => (
          <DivisionTable
            key={division.heading}
            division={division}
            highlight={highlight}
          />
        ))}
      </div>
    </div>
  );
}

export function DivisionStandingsCard({
  division,
  highlight,
}: {
  division: DivisionStanding;
  highlight?: string;
}) {
  return <DivisionTable division={division} highlight={highlight} />;
}
