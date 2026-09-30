export const VERDICT_COLUMNS = [
  "week",
  "player_a",
  "player_b",
  "verdict",
  "confidence",
  "reason",
  "source_url",
  "checked_date",
] as const;

export type VerdictConfidence = "lean" | "strong";

export type VerdictRow = {
  week: number;
  playerA: string;
  playerB: string;
  verdict: string;
  confidence: VerdictConfidence;
  reason: string;
  sourceUrl: string;
  checkedDate: string;
};

export type ScoringKey = "ppr" | "half" | "std";

export const SCORING_OPTIONS: { key: ScoringKey; label: string }[] = [
  { key: "ppr", label: "PPR" },
  { key: "half", label: "Half-PPR" },
  { key: "std", label: "Standard" },
];

const SUFFIX = /\b(?:jr|sr|ii|iii|iv|v)\b/g;

/** Case, punctuation and suffixes such as Jr. do not block a match. */
export function normalizePlayerName(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(SUFFIX, " ")
    .replace(/[^a-z0-9]+/g, "");
}

export function namesMatch(left: string, right: string): boolean {
  const a = normalizePlayerName(left);
  const b = normalizePlayerName(right);
  return a.length > 0 && a === b;
}

export function findPlayerByName<T extends { id: string; name: string; searchRank: number | null }>(
  players: readonly T[],
  query: string,
): T | null {
  const key = normalizePlayerName(query);
  if (!key) return null;
  const hits = players.filter((player) => normalizePlayerName(player.name) === key);
  if (hits.length === 0) return null;
  hits.sort((a, b) => (a.searchRank ?? 99_999) - (b.searchRank ?? 99_999));
  return hits[0] ?? null;
}

export function parseVerdictRows(records: Record<string, string>[]): VerdictRow[] {
  const rows: VerdictRow[] = [];
  for (const record of records) {
    const week = Number(record.week);
    const confidence = record.confidence.trim().toLowerCase();
    if (!Number.isInteger(week) || (confidence !== "lean" && confidence !== "strong")) continue;
    const verdict = record.verdict.trim();
    const playerA = record.player_a.trim();
    if (!verdict || !playerA) continue;
    rows.push({
      week,
      playerA,
      playerB: record.player_b.trim(),
      verdict,
      confidence,
      reason: record.reason.trim(),
      sourceUrl: record.source_url.trim(),
      checkedDate: record.checked_date.trim(),
    });
  }
  return rows;
}

/**
 * Pair rows match in either order for the current week.
 * A blank player_b is a per-player note, used only when no pair row matches.
 * The last matching row in the file wins.
 */
export function matchVerdict(
  rows: readonly VerdictRow[],
  week: number | null,
  nameA: string,
  nameB: string,
): VerdictRow | null {
  if (week === null) return null;
  let pair: VerdictRow | null = null;
  let single: VerdictRow | null = null;
  for (const row of rows) {
    if (row.week !== week) continue;
    if (row.playerB) {
      const forward = namesMatch(row.playerA, nameA) && namesMatch(row.playerB, nameB);
      const backward = namesMatch(row.playerA, nameB) && namesMatch(row.playerB, nameA);
      if (forward || backward) pair = row;
      continue;
    }
    if (namesMatch(row.playerA, nameA) || namesMatch(row.playerA, nameB)) single = row;
  }
  return pair ?? single;
}

export function confidenceLabel(confidence: VerdictConfidence): string {
  return confidence === "strong" ? "Strong" : "Lean";
}

export function projectionLean(
  a: { name: string; points: number | null },
  b: { name: string; points: number | null },
): string | null {
  if (a.points === null || b.points === null) return null;
  const diff = Math.round(Math.abs(a.points - b.points) * 10) / 10;
  if (diff === 0) return `${a.name} and ${b.name} are level on these projections.`;
  const leader = a.points > b.points ? a.name : b.name;
  const points = Number.isInteger(diff) ? String(diff) : diff.toFixed(1);
  return `${leader} by ${points} projected points.`;
}

export type ProjectionNumbers = {
  ppr: number | null;
  half: number | null;
  std: number | null;
};

export type PlayerSnapshot = {
  id: string;
  name: string;
  position: string;
  team: string;
  injury: string | null;
  byeWeek: number | null;
  onBye: boolean;
  opponent: string | null;
  projections: ProjectionNumbers;
  stats: { label: string; value: string }[];
};

export type StartSitComparison = {
  week: number | null;
  season: string | null;
  a: PlayerSnapshot | null;
  b: PlayerSnapshot | null;
  verdict: VerdictRow | null;
  fetchedAt: string;
  error: string | null;
};

export type CatalogPlayer = {
  id: string;
  name: string;
  position: string;
  team: string;
  injuryStatus: string | null;
  searchRank: number | null;
};

export function searchCatalog(players: readonly CatalogPlayer[], query: string, limit = 8): CatalogPlayer[] {
  const key = normalizePlayerName(query);
  if (key.length < 2) return [];
  const scored: { player: CatalogPlayer; score: number }[] = [];
  for (const player of players) {
    const name = normalizePlayerName(player.name);
    let score = 0;
    if (name === key) score = 100;
    else if (name.startsWith(key)) score = 80;
    else if (name.includes(key)) score = 60;
    else continue;
    scored.push({ player, score });
  }
  scored.sort(
    (a, b) =>
      b.score - a.score ||
      (a.player.searchRank ?? 99_999) - (b.player.searchRank ?? 99_999) ||
      a.player.name.localeCompare(b.player.name, "en-GB"),
  );
  return scored.slice(0, limit).map((entry) => entry.player);
}
