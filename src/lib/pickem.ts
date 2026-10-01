import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { gameById, matchupLabel, type KickoffGame } from "@/lib/uk-kickoff";

const DATA_DIR = path.join(process.cwd(), "src/data/pickem");

const PLACEHOLDER_NAME =
  /^(demo|sample|placeholder|lorem|lorem ipsum|test user|player|player \d+|tbd|n\/a|na|unknown|your name)$/i;

const PLACEHOLDER_NOTE =
  /^(tbd|todo|placeholder|lorem|lorem ipsum|sample|demo|n\/a|na|unknown|coming soon|xxx+)$/i;

export type StandingRow = {
  name: string;
  points: number;
};

export type WeekScore = {
  name: string;
  correct: number;
};

export type PickemWeek = {
  week: number;
  gamesCounted: number | null;
  countingGames: KickoffGame[];
  excludedGames: KickoffGame[];
  scores: WeekScore[];
  caughtFolkOut?: string;
};

export type PickemModel = {
  activeWeek: number;
  channel: string;
  pointsPerCorrectPick: number;
  missedWeekPoints: number;
  counts: string;
  gamesCounted: number;
  weeksIncluded: number[];
  weeksWithoutContest: number[];
  weekOneDetailPublished: boolean;
  standings: Array<StandingRow & { rank: number }>;
  weeks: PickemWeek[];
  board: PickemWeek;
  results: PickemWeek[];
};

type SeasonFile = {
  gamesCounted: number;
  weeksIncluded: number[];
  weeksWithoutContest: number[];
  weekOneDetailPublished: boolean;
  standings: StandingRow[];
};

function readJson(filePath: string): unknown {
  return JSON.parse(readFileSync(filePath, "utf8")) as unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function requireString(value: unknown, label: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Pick'em ${label} must be a non-empty string`);
  }
  return value.trim();
}

function requireName(value: unknown, label: string): string {
  const name = requireString(value, label);
  if (PLACEHOLDER_NAME.test(name)) {
    throw new Error(`Pick'em ${label} looks like a placeholder: ${name}`);
  }
  return name;
}

function requireInt(value: unknown, label: string): number {
  if (typeof value !== "number" || !Number.isInteger(value)) {
    throw new Error(`Pick'em ${label} must be a whole number`);
  }
  return value;
}

export function sortByScoreThenName<T>(
  rows: readonly T[],
  score: (row: T) => number,
  name: (row: T) => string,
): T[] {
  return [...rows].sort((a, b) => {
    const delta = score(b) - score(a);
    if (delta !== 0) return delta;
    return name(a).localeCompare(name(b), "en-GB", { numeric: true, sensitivity: "base" });
  });
}

export function rankByScore<T extends { name: string }>(
  rows: readonly T[],
  score: (row: T) => number,
): Array<T & { rank: number }> {
  const sorted = sortByScoreThenName(rows, score, (row) => row.name);
  let lastScore: number | null = null;
  let lastRank = 0;
  return sorted.map((row, index) => {
    const value = score(row);
    const rank = lastScore === value ? lastRank : index + 1;
    lastScore = value;
    lastRank = rank;
    return { ...row, rank };
  });
}

function gamesForIds(ids: string[], label: string): KickoffGame[] {
  return ids.map((id) => {
    const game = gameById(id);
    if (!game) throw new Error(`Pick'em ${label} has unknown game id ${id}`);
    return game;
  });
}

function parseWeek(filePath: string, data: unknown): PickemWeek {
  if (!isRecord(data)) throw new Error(`Pick'em week file is not an object: ${filePath}`);
  const week = requireInt(data.week, "week");
  const expected = Number(/^week-(\d+)\.json$/.exec(path.basename(filePath))?.[1]);
  if (week !== expected) {
    throw new Error(`${path.basename(filePath)} says week ${week}`);
  }

  const countingIds = Array.isArray(data.countingGameIds)
    ? data.countingGameIds.map((id, index) => requireString(id, `countingGameIds[${index}]`))
    : [];
  const excludedIds = Array.isArray(data.excludedGameIds)
    ? data.excludedGameIds.map((id, index) => requireString(id, `excludedGameIds[${index}]`))
    : [];
  if (new Set(countingIds).size !== countingIds.length) {
    throw new Error(`Week ${week} repeats a counting game`);
  }
  const overlap = excludedIds.filter((id) => countingIds.includes(id));
  if (overlap.length > 0) {
    throw new Error(`Week ${week} lists ${overlap[0]} as both counting and excluded`);
  }

  const scores: WeekScore[] = [];
  if (data.scores != null) {
    if (!Array.isArray(data.scores) || data.scores.length === 0) {
      throw new Error(`Week ${week} scores must be a non-empty list or be left out`);
    }
    const gamesCounted = requireInt(data.gamesCounted, `week ${week} gamesCounted`);
    if (gamesCounted < 1) throw new Error(`Week ${week} gamesCounted must be at least 1`);
    for (const [index, row] of data.scores.entries()) {
      if (!isRecord(row)) throw new Error(`Week ${week} score ${index} is not an object`);
      const name = requireName(row.name, `week ${week} score name`);
      const correct = requireInt(row.correct, `week ${week} correct for ${name}`);
      if (correct < 0 || correct > gamesCounted) {
        throw new Error(`Week ${week} ${name} has ${correct} correct from ${gamesCounted}`);
      }
      scores.push({ name, correct });
    }
    if (new Set(scores.map((row) => row.name)).size !== scores.length) {
      throw new Error(`Week ${week} repeats a name`);
    }
  }

  let caughtFolkOut: string | undefined;
  if (data.caughtFolkOut != null) {
    caughtFolkOut = requireString(data.caughtFolkOut, `week ${week} caughtFolkOut`);
    if (PLACEHOLDER_NOTE.test(caughtFolkOut)) {
      throw new Error(`Week ${week} caughtFolkOut looks like a placeholder`);
    }
  }

  return {
    week,
    gamesCounted: data.scores ? requireInt(data.gamesCounted, `week ${week} gamesCounted`) : null,
    countingGames: gamesForIds(countingIds, `week ${week}`),
    excludedGames: gamesForIds(excludedIds, `week ${week} excluded`),
    scores: rankByScore(scores, (row) => row.correct).map(({ name, correct }) => ({ name, correct })),
    caughtFolkOut,
  };
}

function loadWeeks(season: SeasonFile): PickemWeek[] {
  const dir = path.join(DATA_DIR, "weeks");
  const files = readdirSync(dir)
    .filter((name) => /^week-\d+\.json$/.test(name))
    .sort();
  const weeks = files.map((name) => parseWeek(path.join(dir, name), readJson(path.join(dir, name))));

  for (const week of weeks) {
    if (!season.weekOneDetailPublished && week.week === 1 && week.scores.length > 0) {
      throw new Error("Week 1 detail is unpublished. Remove week-1.json or set weekOneDetailPublished.");
    }
    if (season.weeksWithoutContest.includes(week.week) && week.scores.length > 0) {
      throw new Error(`Week ${week.week} is listed as having no contest, but it has scores`);
    }
  }

  return weeks.sort((a, b) => a.week - b.week);
}

function formatWeekList(weeks: number[]): string {
  const labels = weeks.map((week) => String(week));
  if (labels.length === 0) return "";
  if (labels.length === 1) return `Week ${labels[0]}`;
  const head = labels.slice(0, -1).join(", ");
  return `Weeks ${head} and ${labels[labels.length - 1]}`;
}

export function seasonSummary(model: Pick<
  PickemModel,
  "gamesCounted" | "weeksIncluded" | "weeksWithoutContest" | "weekOneDetailPublished"
>): string {
  const parts = [
    `Season totals after ${formatWeekList(model.weeksIncluded)} (${model.gamesCounted} games counted).`,
  ];
  if (model.weeksWithoutContest.length > 0) {
    const label = formatWeekList(model.weeksWithoutContest);
    parts.push(
      model.weeksWithoutContest.length === 1
        ? `There was no ${label} contest.`
        : `There was no contest in ${label}.`,
    );
  }
  if (!model.weekOneDetailPublished && model.weeksIncluded.includes(1)) {
    parts.push("Week 1 is included in the totals only. There is no separate Week 1 table.");
  }
  return parts.join(" ");
}

export function entriesCloseAt(week: PickemWeek): KickoffGame | null {
  if (week.countingGames.length === 0) return null;
  return [...week.countingGames].sort(
    (a, b) => Date.parse(a.kickoffUtc) - Date.parse(b.kickoffUtc),
  )[0] ?? null;
}

export function leaders<T>(rows: readonly T[], score: (row: T) => number): T[] {
  if (rows.length === 0) return [];
  const best = Math.max(...rows.map(score));
  return rows.filter((row) => score(row) === best);
}

let cached: PickemModel | null = null;

export function loadPickem(): PickemModel {
  if (cached) return cached;

  const meta = readJson(path.join(DATA_DIR, "meta.json"));
  const seasonRaw = readJson(path.join(DATA_DIR, "season.json"));
  if (!isRecord(meta) || !isRecord(seasonRaw)) {
    throw new Error("Pick'em meta.json and season.json must be objects");
  }

  const season = seasonRaw as SeasonFile;
  if (!Array.isArray(season.weeksIncluded) || !Array.isArray(season.weeksWithoutContest)) {
    throw new Error("Pick'em season week lists must be arrays");
  }
  if (!Array.isArray(season.standings) || season.standings.length === 0) {
    throw new Error("Pick'em season standings are empty");
  }
  const standingsInput: StandingRow[] = season.standings.map((row, index) => {
    if (!isRecord(row)) throw new Error(`Standing ${index} is not an object`);
    const name = requireName(row.name, `standing ${index}`);
    const points = requireInt(row.points, `points for ${name}`);
    if (points < 0) throw new Error(`${name} has negative points`);
    return { name, points };
  });
  if (new Set(standingsInput.map((row) => row.name)).size !== standingsInput.length) {
    throw new Error("Season standings repeat a name");
  }

  const weeks = loadWeeks(season);
  const activeWeek = requireInt(meta.activeWeek, "activeWeek");
  const board = weeks.find((week) => week.week === activeWeek);
  if (!board) throw new Error(`No data file for active Pick'em week ${activeWeek}`);
  if (board.countingGames.length === 0) {
    throw new Error(`Active week ${activeWeek} has no counting games`);
  }

  const model: PickemModel = {
    activeWeek,
    channel: requireString(meta.channel, "channel"),
    pointsPerCorrectPick: requireInt(meta.pointsPerCorrectPick, "pointsPerCorrectPick"),
    missedWeekPoints: requireInt(meta.missedWeekPoints, "missedWeekPoints"),
    counts: requireString(meta.counts, "counts"),
    gamesCounted: requireInt(season.gamesCounted, "gamesCounted"),
    weeksIncluded: season.weeksIncluded,
    weeksWithoutContest: season.weeksWithoutContest,
    weekOneDetailPublished: season.weekOneDetailPublished === true,
    standings: rankByScore(standingsInput, (row) => row.points),
    weeks,
    board,
    results: weeks.filter((week) => week.scores.length > 0),
  };

  cached = model;
  return model;
}

export function pickemMatchup(game: KickoffGame): string {
  return matchupLabel(game);
}

export function resetPickemCache(): void {
  cached = null;
}
