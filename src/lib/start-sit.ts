import { readFileSync } from "node:fs";
import path from "node:path";
import { unstable_cache } from "next/cache";
import { parseCsv, rowsToRecords } from "@/lib/csv";
import { siteUserAgent } from "@/lib/site";
import {
  VERDICT_COLUMNS,
  matchVerdict,
  parseVerdictRows,
  searchCatalog,
  type CatalogPlayer,
  type PlayerSnapshot,
  type ProjectionNumbers,
  type StartSitComparison,
  type VerdictRow,
} from "@/lib/start-sit-logic";

export const START_SIT_CACHE_TAG = "start-sit";
const PLAYERS_TAG = "start-sit-players";
const PLAYERS_URL = "https://api.sleeper.app/v1/players/nfl";
const STATE_URL = "https://api.sleeper.app/v1/state/nfl";
const FANTASY_POSITIONS = new Set(["QB", "RB", "WR", "TE", "K", "DEF"]);

const STAT_LABELS: { key: string; label: string }[] = [
  { key: "pass_yd", label: "Pass yards" },
  { key: "pass_td", label: "Pass touchdowns" },
  { key: "rush_yd", label: "Rush yards" },
  { key: "rush_td", label: "Rush touchdowns" },
  { key: "rec", label: "Receptions" },
  { key: "rec_yd", label: "Receiving yards" },
  { key: "rec_td", label: "Receiving touchdowns" },
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function asNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() && !Number.isNaN(Number(value))) return Number(value);
  return undefined;
}

async function fetchJson(url: string, revalidate: number, tags: string[], timeoutMs: number): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json", "User-Agent": siteUserAgent() },
      next: { revalidate, tags },
    });
    if (!response.ok) throw new Error(`Sleeper returned ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

function playerName(row: Record<string, unknown>): string {
  const full = asString(row.full_name);
  if (full) return full;
  return [asString(row.first_name), asString(row.last_name)].filter(Boolean).join(" ");
}

function slimPlayers(data: unknown): CatalogPlayer[] {
  if (!isRecord(data)) return [];
  const players: CatalogPlayer[] = [];
  for (const [id, value] of Object.entries(data)) {
    if (!isRecord(value)) continue;
    const position = (asString(value.position) ?? "").toUpperCase();
    const fantasy = Array.isArray(value.fantasy_positions)
      ? value.fantasy_positions.map((entry) => String(entry).toUpperCase())
      : [];
    const relevant = FANTASY_POSITIONS.has(position) || fantasy.some((entry) => FANTASY_POSITIONS.has(entry));
    if (!relevant) continue;
    const name = playerName(value);
    if (!name) continue;
    const team = asString(value.team) ?? "";
    if (value.active === false && !team) continue;
    const injuryStatus = asString(value.injury_status) ?? null;
    const body = asString(value.injury_body_part);
    players.push({
      id,
      name,
      position: position || fantasy.find((entry) => FANTASY_POSITIONS.has(entry)) || "",
      team,
      injuryStatus: injuryStatus && body ? `${injuryStatus} · ${body}` : injuryStatus,
      searchRank: asNumber(value.search_rank) ?? null,
    });
  }
  return players;
}

export const getPlayerCatalog = unstable_cache(
  async () => slimPlayers(await fetchJson(PLAYERS_URL, 86_400, [PLAYERS_TAG], 25_000)),
  ["start-sit-catalog-v1"],
  { revalidate: 86_400, tags: [PLAYERS_TAG, START_SIT_CACHE_TAG] },
);

type NflState = { week: number; season: string; seasonType: string };

async function readState(): Promise<NflState | null> {
  const data = await fetchJson(STATE_URL, 600, [START_SIT_CACHE_TAG], 12_000);
  if (!isRecord(data)) return null;
  const week = asNumber(data.week);
  const season = asString(data.season);
  if (week === undefined || !season) return null;
  return { week, season, seasonType: asString(data.season_type) ?? "regular" };
}

export const getNflState = unstable_cache(readState, ["start-sit-state-v1"], {
  revalidate: 600,
  tags: [START_SIT_CACHE_TAG],
});

function byeWeeks(games: unknown): Record<string, number> {
  if (!Array.isArray(games)) return {};
  const played = new Map<string, Set<number>>();
  for (const game of games) {
    if (!isRecord(game)) continue;
    const week = asNumber(game.week);
    const home = asString(game.home);
    const away = asString(game.away);
    if (week === undefined) continue;
    for (const team of [home, away]) {
      if (!team) continue;
      const weeks = played.get(team) ?? new Set<number>();
      weeks.add(week);
      played.set(team, weeks);
    }
  }
  const byes: Record<string, number> = {};
  for (const [team, weeks] of played) {
    const missing: number[] = [];
    for (let week = 1; week <= 18; week += 1) {
      if (!weeks.has(week)) missing.push(week);
    }
    if (missing.length === 1) byes[team] = missing[0];
  }
  return byes;
}

type WeekFeeds = {
  byes: Record<string, number>;
  projections: Record<string, { opponent: string | null; team: string | null; projections: ProjectionNumbers }>;
  stats: Record<string, { label: string; value: string }[]>;
};

function finite(value: unknown): number | null {
  const number = asNumber(value);
  return number === undefined ? null : number;
}

function formatStat(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

async function readWeek(season: string, week: number): Promise<WeekFeeds> {
  const seasonType = "regular";
  const [schedule, projections, stats] = await Promise.all([
    fetchJson(`https://api.sleeper.app/schedule/nfl/${seasonType}/${season}`, 86_400, [START_SIT_CACHE_TAG], 12_000).catch(
      () => null,
    ),
    fetchJson(
      `https://api.sleeper.app/projections/nfl/${season}/${week}?season_type=${seasonType}`,
      600,
      [START_SIT_CACHE_TAG],
      20_000,
    ).catch(() => null),
    fetchJson(
      `https://api.sleeper.app/stats/nfl/${season}/${week}?season_type=${seasonType}`,
      600,
      [START_SIT_CACHE_TAG],
      20_000,
    ).catch(() => null),
  ]);

  const projectionMap: WeekFeeds["projections"] = {};
  if (Array.isArray(projections)) {
    for (const row of projections) {
      if (!isRecord(row)) continue;
      const id = asString(row.player_id) ?? (asNumber(row.player_id) !== undefined ? String(asNumber(row.player_id)) : "");
      if (!id || !isRecord(row.stats)) continue;
      const numbers: ProjectionNumbers = {
        ppr: finite(row.stats.pts_ppr),
        half: finite(row.stats.pts_half_ppr),
        std: finite(row.stats.pts_std),
      };
      if (numbers.ppr === null && numbers.half === null && numbers.std === null) continue;
      projectionMap[id] = {
        opponent: asString(row.opponent) ?? null,
        team: asString(row.team) ?? null,
        projections: numbers,
      };
    }
  }

  const statMap: WeekFeeds["stats"] = {};
  if (Array.isArray(stats)) {
    for (const row of stats) {
      if (!isRecord(row) || !isRecord(row.stats)) continue;
      const statBag = row.stats;
      const id = asString(row.player_id) ?? (asNumber(row.player_id) !== undefined ? String(asNumber(row.player_id)) : "");
      if (!id) continue;
      const lines = STAT_LABELS.flatMap((stat) => {
        const value = finite(statBag[stat.key]);
        if (value === null || value === 0) return [];
        return [{ label: stat.label, value: formatStat(value) }];
      });
      if (lines.length) statMap[id] = lines;
    }
  }

  return { byes: byeWeeks(schedule), projections: projectionMap, stats: statMap };
}

function weekCache(season: string, week: number) {
  return unstable_cache(() => readWeek(season, week), ["start-sit-week-v1", season, String(week)], {
    revalidate: 600,
    tags: [START_SIT_CACHE_TAG],
  });
}

export function loadVerdictRows(): VerdictRow[] {
  const csv = readFileSync(path.join(process.cwd(), "src/data/start-sit-verdicts.csv"), "utf8");
  return parseVerdictRows(rowsToRecords(parseCsv(csv), VERDICT_COLUMNS));
}

function snapshot(player: CatalogPlayer, week: number | null, feeds: WeekFeeds | null): PlayerSnapshot {
  const projection = feeds?.projections[player.id];
  const byeWeek = player.team && feeds ? (feeds.byes[player.team] ?? null) : null;
  return {
    id: player.id,
    name: player.name,
    position: player.position,
    team: projection?.team || player.team,
    injury: player.injuryStatus,
    byeWeek,
    onBye: week !== null && byeWeek === week,
    opponent: projection?.opponent ?? null,
    projections: projection?.projections ?? { ppr: null, half: null, std: null },
    stats: feeds?.stats[player.id] ?? [],
  };
}

export async function searchPlayers(query: string): Promise<CatalogPlayer[]> {
  const catalog = await getPlayerCatalog();
  return searchCatalog(catalog, query);
}

export async function getStartSitComparison(aId?: string, bId?: string): Promise<StartSitComparison> {
  const fetchedAt = new Date().toISOString();
  const clean = (value?: string) => (value && /^[A-Za-z0-9]{1,12}$/.test(value) ? value : "");
  const leftId = clean(aId);
  const rightId = clean(bId);

  let state: NflState | null = null;
  try {
    state = await getNflState();
  } catch {
    state = null;
  }

  if (!leftId && !rightId) {
    return {
      week: state?.week ?? null,
      season: state?.season ?? null,
      a: null,
      b: null,
      verdict: null,
      fetchedAt,
      error: state ? null : "Sleeper’s NFL week did not load. Player search still works.",
    };
  }

  try {
    const catalog = await getPlayerCatalog();
    const byId = new Map(catalog.map((player) => [player.id, player]));
    const feeds = state ? await weekCache(state.season, state.week)() : null;
    const a = leftId ? snapshot(byId.get(leftId) ?? missingPlayer(leftId), state?.week ?? null, feeds) : null;
    const b = rightId ? snapshot(byId.get(rightId) ?? missingPlayer(rightId), state?.week ?? null, feeds) : null;
    let verdict: VerdictRow | null = null;
    if (a?.name && b?.name && state) {
      verdict = matchVerdict(loadVerdictRows(), state.week, a.name, b.name);
    }
    return {
      week: state?.week ?? null,
      season: state?.season ?? null,
      a: leftId ? a : null,
      b: rightId ? b : null,
      verdict,
      fetchedAt,
      error: null,
    };
  } catch {
    return {
      week: state?.week ?? null,
      season: state?.season ?? null,
      a: null,
      b: null,
      verdict: null,
      fetchedAt,
      error: "Sleeper’s player list did not load. Nothing here is guessed.",
    };
  }
}

function missingPlayer(id: string): CatalogPlayer {
  return { id, name: "", position: "", team: "", injuryStatus: null, searchRank: null };
}
