"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { TeamLogo } from "@/components/TeamLogo";
import { teams, type NflTeam } from "@/data/teams";
import { savedTeamRecord } from "@/lib/team-storage";

function matches(team: NflTeam, needle: string): boolean {
  const hay = `${team.name} ${team.shortName} ${team.city} ${team.abbreviation} ${team.conference}`.toLowerCase();
  return hay.includes(needle);
}

export function TeamPicker() {
  const [query, setQuery] = useState("");
  const [current, setCurrent] = useState<string | undefined>(undefined);

  useEffect(() => {
    const sync = () => setCurrent(savedTeamRecord()?.team.abbreviation);
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("fds-team-change", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("fds-team-change", sync);
    };
  }, []);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const list = needle ? teams.filter((team) => matches(team, needle)) : teams;
    return [...list].sort((a, b) => a.name.localeCompare(b.name, "en-GB"));
  }, [query]);

  const afc = filtered.filter((team) => team.conference === "AFC");
  const nfc = filtered.filter((team) => team.conference === "NFC");
  const groups = query.trim()
    ? [{ label: "Matches", teams: filtered }]
    : [
        { label: "AFC", teams: afc },
        { label: "NFC", teams: nfc },
      ];

  return (
    <div>
      <label className="block">
        <span className="text-sm font-medium text-cream">Search the 32</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Chiefs, Seattle, NFC…"
          autoComplete="off"
          className="mt-2 w-full rounded-xl border border-line bg-navy-2 px-4 py-3 text-base text-cream placeholder:text-cream-dim/70"
        />
      </label>

      {filtered.length === 0 ? (
        <p className="mt-6 text-sm leading-6 text-cream-dim">
          No club matches that. Try a city, a nickname, or the three-letter code.
        </p>
      ) : (
        <div className="mt-8 space-y-10">
          {groups.map((group) =>
            group.teams.length === 0 ? null : (
              <section key={group.label}>
                <h2 className="font-display text-2xl text-cream">{group.label}</h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {group.teams.map((team) => {
                    const selected = team.abbreviation === current;
                    return (
                      <li key={team.abbreviation}>
                        <Link
                          href={`/pick-your-team/result?team=${encodeURIComponent(team.abbreviation)}&via=choose`}
                          className={`flex min-h-14 items-center gap-3 rounded-2xl border px-3 py-3 transition hover:border-gold/50 hover:bg-navy-3 ${
                            selected
                              ? "border-gold/60 bg-navy-3"
                              : "border-line bg-navy-2"
                          }`}
                        >
                          <TeamLogo team={team} size={40} />
                          <span className="min-w-0">
                            <span className="block truncate font-medium text-cream">
                              {team.name}
                            </span>
                            <span className="block text-xs text-cream-dim">
                              {team.city} · {team.abbreviation}
                              {selected ? " · yours" : ""}
                            </span>
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ),
          )}
        </div>
      )}
    </div>
  );
}
