"use client";

import { useSyncExternalStore } from "react";
import { getTeam, teamProfilePath, type NflTeam } from "@/data/teams";
import { readSavedTeam } from "@/lib/team-storage";

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener("fds-team-change", onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener("fds-team-change", onChange);
  };
}

function getAbbr(): string {
  return readSavedTeam()?.abbreviation ?? "";
}

export function useFavouriteTeam(): {
  team: NflTeam | null;
  href: string;
} {
  const abbr = useSyncExternalStore(subscribe, getAbbr, () => "");
  const team = abbr ? (getTeam(abbr) ?? null) : null;
  return {
    team,
    href: team ? teamProfilePath(team.abbreviation) : "/pick-your-team",
  };
}
