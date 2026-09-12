import table from "@/data/score-history.json";
import { getTeam, teamProfilePath } from "@/data/teams";
import type { NflGame } from "@/lib/espn";
import { formatUkDate } from "@/lib/time";

export type ScoreGameTuple = [
  season: number,
  week: number,
  gameType: string,
  date: string,
  away: string,
  home: string,
  awayScore: number,
  homeScore: number,
];

export type ScoreLineRecord = {
  n: number;
  first: ScoreGameTuple;
  last: ScoreGameTuple;
  ex?: ScoreGameTuple[];
};

export type ScoreHistoryMeta = {
  sourceName: string;
  sourceRepo: string;
  sourceFile: string;
  builtAt: string;
  seasonFrom: number;
  seasonTo: number;
  gameCount: number;
  lineCount: number;
  homeAwayCount: number;
  includes: string;
};

type ScoreHistoryFile = {
  meta: ScoreHistoryMeta;
  lines: Record<string, ScoreLineRecord>;
  homeAway: Record<string, Omit<ScoreLineRecord, "ex">>;
  common: string[];
  onceRecent: string[];
};

const data = table as unknown as ScoreHistoryFile;

const TEAM_ALIASES: Record<string, string> = {
  WAS: "WSH",
  OAK: "LV",
  SD: "LAC",
  STL: "LAR",
  LA: "LAR",
  JAC: "JAX",
};

export const scoreHistoryMeta = data.meta;

export function winnerLoserKey(scoreA: number, scoreB: number): string {
  return `${Math.max(scoreA, scoreB)}-${Math.min(scoreA, scoreB)}`;
}

export function homeAwayKey(homeScore: number, awayScore: number): string {
  return `${homeScore}-${awayScore}`;
}

export function parseScoreKey(key: string): { high: number; low: number } | null {
  const match = /^(\d+)-(\d+)$/.exec(key);
  if (!match) return null;
  const high = Number(match[1]);
  const low = Number(match[2]);
  if (!Number.isInteger(high) || !Number.isInteger(low)) return null;
  return { high, low };
}

export type ScoreGame = {
  season: number;
  week: number;
  gameType: string;
  date: string;
  away: string;
  home: string;
  awayScore: number;
  homeScore: number;
};

export function unpackGame(tuple: ScoreGameTuple): ScoreGame {
  return {
    season: tuple[0],
    week: tuple[1],
    gameType: tuple[2],
    date: tuple[3],
    away: tuple[4],
    home: tuple[5],
    awayScore: tuple[6],
    homeScore: tuple[7],
  };
}

export function teamShortName(abbreviation: string): string {
  const current = TEAM_ALIASES[abbreviation.toUpperCase()] ?? abbreviation;
  return getTeam(current)?.shortName ?? abbreviation;
}

export function teamHref(abbreviation: string): string {
  const current = TEAM_ALIASES[abbreviation.toUpperCase()] ?? abbreviation;
  return teamProfilePath(current);
}

export function gameTypeLabel(gameType: string): string {
  switch (gameType) {
    case "REG":
      return "Regular season";
    case "WC":
      return "Wild Card";
    case "DIV":
      return "Divisional";
    case "CON":
      return "Conference";
    case "SB":
      return "Super Bowl";
    default:
      return gameType;
  }
}

export function gameWhen(game: ScoreGame): string {
  const date = formatUkDate(`${game.date}T17:00:00Z`);
  if (game.gameType === "SB") return `${date} · Super Bowl · ${game.season} season`;
  if (game.gameType !== "REG") {
    return `${date} · ${gameTypeLabel(game.gameType)} · ${game.season}`;
  }
  return `${date} · Week ${game.week} · ${game.season}`;
}

export type ScoreLookup = {
  key: string;
  high: number;
  low: number;
  count: number;
  first?: ScoreGame;
  last?: ScoreGame;
  examples: ScoreGame[];
  found: boolean;
  tie: boolean;
  mode: "winner-loser" | "home-away";
  homeScore?: number;
  awayScore?: number;
};

function lineToLookup(
  key: string,
  record: ScoreLineRecord | undefined,
  mode: ScoreLookup["mode"],
  extras?: Pick<ScoreLookup, "homeScore" | "awayScore">,
): ScoreLookup {
  const parsed = parseScoreKey(key) ?? { high: 0, low: 0 };
  const examples = (record?.ex ?? []).map(unpackGame).reverse();
  return {
    key,
    high: parsed.high,
    low: parsed.low,
    count: record?.n ?? 0,
    first: record ? unpackGame(record.first) : undefined,
    last: record ? unpackGame(record.last) : undefined,
    examples,
    found: Boolean(record),
    tie: parsed.high === parsed.low,
    mode,
    ...extras,
  };
}

export function lookupWinnerLoser(scoreA: number, scoreB: number): ScoreLookup {
  const key = winnerLoserKey(scoreA, scoreB);
  return lineToLookup(key, data.lines[key], "winner-loser");
}

export function lookupHomeAway(homeScore: number, awayScore: number): ScoreLookup {
  const key = homeAwayKey(homeScore, awayScore);
  const record = data.homeAway[key];
  return lineToLookup(key, record, "home-away", { homeScore, awayScore });
}

export function lookupFromKey(key: string, mode: "winner-loser" | "home-away"): ScoreLookup | null {
  const parsed = parseScoreKey(key);
  if (!parsed) return null;
  if (mode === "home-away") return lookupHomeAway(parsed.high, parsed.low);
  return lookupWinnerLoser(parsed.high, parsed.low);
}

export function commonLookups(): ScoreLookup[] {
  return data.common
    .map((key) => lookupFromKey(key, "winner-loser"))
    .filter((entry): entry is ScoreLookup => entry !== null);
}

export function onceRecentLookups(): ScoreLookup[] {
  return data.onceRecent
    .map((key) => lookupFromKey(key, "winner-loser"))
    .filter((entry): entry is ScoreLookup => entry !== null);
}

export function rarityLabel(count: number): string {
  if (count === 0) return "Not in our table";
  if (count === 1) return "Once in our table";
  if (count <= 5) return "Rare";
  if (count <= 20) return "Uncommon";
  return "A familiar scoreline";
}

export function countPhrase(count: number, seasonFrom: number, seasonTo: number): string {
  if (count === 0) {
    return `This exact final is not in our table (${seasonFrom}-${seasonTo}). It may have happened earlier. We do not fill gaps from memory.`;
  }
  if (count === 1) {
    return `This exact final appears once in our table (${seasonFrom}-${seasonTo}).`;
  }
  return `This exact final appears ${count.toLocaleString("en-GB")} times in our table (${seasonFrom}-${seasonTo}).`;
}

export type UnusualFinal = {
  game: NflGame;
  homeScore: number;
  awayScore: number;
  lookup: ScoreLookup;
};

export function unusualFinals(games: NflGame[]): UnusualFinal[] {
  const rows: UnusualFinal[] = [];
  for (const game of games) {
    if (game.status !== "final") continue;
    const homeScore = game.home.score;
    const awayScore = game.away.score;
    if (homeScore == null || awayScore == null) continue;
    rows.push({
      game,
      homeScore,
      awayScore,
      lookup: lookupWinnerLoser(homeScore, awayScore),
    });
  }
  return rows.sort((a, b) => a.lookup.count - b.lookup.count);
}

export function isUnusualLookup(lookup: ScoreLookup): boolean {
  return lookup.count <= 5;
}
