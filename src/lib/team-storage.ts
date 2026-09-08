import { getTeam, type NflTeam } from "@/data/teams";

export const TEAM_STORAGE_KEY = "fds-team";

export type SavedTeam = {
  abbreviation: string;
  via: "quiz" | "spin" | "choose";
  at: string;
};

export function readSavedTeam(): SavedTeam | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(TEAM_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedTeam;
    if (!parsed?.abbreviation || !getTeam(parsed.abbreviation)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveTeam(abbreviation: string, via: SavedTeam["via"]): void {
  const payload: SavedTeam = {
    abbreviation,
    via,
    at: new Date().toISOString(),
  };
  window.localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(payload));
  window.dispatchEvent(new Event("fds-team-change"));
}

export function clearSavedTeam(): void {
  window.localStorage.removeItem(TEAM_STORAGE_KEY);
  window.dispatchEvent(new Event("fds-team-change"));
}

export function savedTeamRecord(): { saved: SavedTeam; team: NflTeam } | null {
  const saved = readSavedTeam();
  if (!saved) return null;
  const team = getTeam(saved.abbreviation);
  if (!team) return null;
  return { saved, team };
}
