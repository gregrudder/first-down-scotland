import { labelForPosition } from "@/lib/draft-prospects";

export const ROOKIES_CACHE_TAG = "rookies";
export const ROOKIES_REVALIDATE_SECONDS = 600;
export const SLEEPER_PLAYERS_REVALIDATE_SECONDS = 86_400;
const FETCH_TIMEOUT_MS = 12_000;
const SLEEPER_PLAYERS_TIMEOUT_MS = 20_000;

const DRAFT_URL = (year: number) =>
  `https://site.api.espn.com/apis/site/v2/sports/football/nfl/draft?year=${year}`;
const SLEEPER_STATS_URL = (year: number) =>
  `https://api.sleeper.app/v1/stats/nfl/regular/${year}`;
const SLEEPER_PLAYERS_URL = "https://api.sleeper.app/v1/players/nfl";

export type RookieStatLine = {
  label: string;
  value: string;
};

export type RookieStats = {
  available: boolean;
  gamesPlayed: number | null;
  lines: RookieStatLine[];
  note: string;
};

export type Rookie = {
  id: string;
  name: string;
  position: string;
  positionLabel: string;
  college?: string;
  teamAbbr: string;
  teamName: string;
  round: number;
  pick: number;
  roundPick: number;
  traded: boolean;
  headshot?: string;
  espnPlayerUrl?: string;
  stats: RookieStats;
};

export type RookiesSuccess = {
  ok: true;
  fetchedAt: string;
  seasonYear: number;
  draftYear: number;
  sourceLabel: string;
  statsSourceLabel: string;
  rookies: Rookie[];
  statsNote: string;
};

export type RookiesFailure = {
  ok: false;
  fetchedAt: string;
  error: string;
};

export type RookiesResult = RookiesSuccess | RookiesFailure;

type UnknownRecord = Record<string, unknown>;

type DraftTeam = {
  id: string;
  abbreviation: string;
  displayName: string;
};

type PositionRow = {
  id: string;
  abbreviation: string;
};

type SleeperPlayer = {
  id: string;
  name: string;
  team?: string;
  position?: string;
  espnId?: string;
};

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function asNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() && !Number.isNaN(Number(value))) {
    return Number(value);
  }
  return undefined;
}

function normalizeName(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function sleeperPositionFamily(position: string): string {
  const key = position.toUpperCase();
  if (key === "PK" || key === "K") return "K";
  if (key === "CB" || key === "S" || key === "FS" || key === "SS" || key === "DB") return "DB";
  if (key === "OT" || key === "OG" || key === "G" || key === "C" || key === "OL" || key === "T") {
    return "OL";
  }
  if (key === "DT" || key === "DE" || key === "DL" || key === "EDGE" || key === "NT") return "DL";
  if (key === "LB" || key === "ILB" || key === "OLB") return "LB";
  if (key === "FB" || key === "HB") return "RB";
  return key;
}

async function fetchJson(
  url: string,
  cacheTag: string,
  revalidateSeconds: number,
  timeoutMs = FETCH_TIMEOUT_MS,
): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      next: {
        revalidate: revalidateSeconds,
        tags: [cacheTag],
      },
      headers: {
        Accept: "application/json",
        "User-Agent": "FirstDownScotland/1.0 (https://first-down-scotland.vercel.app)",
      },
    });
    if (!response.ok) throw new Error(`Feed returned ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

function parseDraftTeams(raw: unknown): Map<string, DraftTeam> {
  const map = new Map<string, DraftTeam>();
  if (!Array.isArray(raw)) return map;
  for (const entry of raw) {
    if (!isRecord(entry)) continue;
    const id = asString(entry.id);
    const abbreviation = asString(entry.abbreviation);
    const displayName = asString(entry.displayName) ?? asString(entry.name);
    if (!id || !abbreviation || !displayName) continue;
    map.set(id, { id, abbreviation, displayName });
  }
  return map;
}

function parsePositions(raw: unknown): Map<string, PositionRow> {
  const map = new Map<string, PositionRow>();
  if (!Array.isArray(raw)) return map;
  for (const entry of raw) {
    if (!isRecord(entry)) continue;
    const id = asString(entry.id);
    const abbreviation = asString(entry.abbreviation);
    if (!id || !abbreviation) continue;
    map.set(id, { id, abbreviation });
  }
  return map;
}

function parseSleeperPlayers(data: unknown): SleeperPlayer[] {
  if (!isRecord(data)) return [];
  const rows: SleeperPlayer[] = [];
  for (const [id, value] of Object.entries(data)) {
    if (!isRecord(value)) continue;
    const name = asString(value.full_name) ?? [asString(value.first_name), asString(value.last_name)]
      .filter(Boolean)
      .join(" ");
    if (!name) continue;
    const yearsExp = asNumber(value.years_exp);
    const rookieYear = asNumber(value.rookie_year);
    const keep = yearsExp === 0 || rookieYear !== undefined || Boolean(asString(value.espn_id));
    if (!keep && yearsExp !== undefined && yearsExp > 2) continue;
    rows.push({
      id,
      name,
      team: asString(value.team) ?? undefined,
      position: asString(value.position) ?? undefined,
      espnId: asString(value.espn_id) ?? (asNumber(value.espn_id) !== undefined
        ? String(asNumber(value.espn_id))
        : undefined),
    });
  }
  return rows;
}

function sleeperNumber(stats: UnknownRecord, key: string): number | null {
  const value = asNumber(stats[key]);
  return value === undefined ? null : value;
}

function formatCount(value: number | null): string | null {
  if (value === null) return null;
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function hasRealStats(stats: UnknownRecord): boolean {
  const keys = [
    "gp",
    "pass_yd",
    "pass_td",
    "rush_yd",
    "rush_td",
    "rec",
    "rec_yd",
    "tkl",
    "tkl_solo",
    "sack",
    "int",
    "ff",
    "fgm",
    "xpm",
  ];
  return keys.some((key) => {
    const value = asNumber(stats[key]);
    return value !== undefined && value !== 0;
  });
}

function buildStatLines(position: string, stats: UnknownRecord): RookieStatLine[] {
  const family = sleeperPositionFamily(position);
  const line = (label: string, key: string, extra?: string): RookieStatLine | null => {
    const value = formatCount(sleeperNumber(stats, key));
    if (value === null) return null;
    return { label, value: extra ? `${value}${extra}` : value };
  };

  if (family === "QB") {
    const cmp = formatCount(sleeperNumber(stats, "pass_cmp"));
    const att = formatCount(sleeperNumber(stats, "pass_att"));
    return [
      cmp && att ? { label: "Completions", value: `${cmp}/${att}` } : null,
      line("Passing yards", "pass_yd"),
      line("Passing touchdowns", "pass_td"),
      line("Interceptions", "pass_int"),
      line("Rushing yards", "rush_yd"),
    ].filter((row): row is RookieStatLine => row !== null);
  }

  if (family === "RB") {
    return [
      line("Rushing yards", "rush_yd"),
      line("Rushing touchdowns", "rush_td"),
      line("Carries", "rush_att"),
      line("Catches", "rec"),
      line("Receiving yards", "rec_yd"),
    ].filter((row): row is RookieStatLine => row !== null);
  }

  if (family === "WR" || family === "TE") {
    return [
      line("Catches", "rec"),
      line("Receiving yards", "rec_yd"),
      line("Receiving touchdowns", "rec_td"),
      line("Rushing yards", "rush_yd"),
    ].filter((row): row is RookieStatLine => row !== null);
  }

  if (family === "K") {
    const fgm = formatCount(sleeperNumber(stats, "fgm"));
    const fga = formatCount(sleeperNumber(stats, "fga"));
    return [
      fgm && fga ? { label: "Field goals", value: `${fgm}/${fga}` } : line("Field goals", "fgm"),
      line("Extra points", "xpm"),
    ].filter((row): row is RookieStatLine => row !== null);
  }

  if (family === "OL" || family === "LS" || family === "P") {
    return [];
  }

  return [
    line("Tackles", "tkl") ?? line("Solo tackles", "tkl_solo"),
    line("Sacks", "sack"),
    line("Interceptions", "int"),
    line("Forced fumbles", "ff"),
  ].filter((row): row is RookieStatLine => row !== null);
}

function emptyStats(note: string): RookieStats {
  return { available: false, gamesPlayed: null, lines: [], note };
}

function matchSleeperPlayer(
  rookie: { name: string; teamAbbr: string; position: string; espnId?: string },
  players: SleeperPlayer[],
): SleeperPlayer | undefined {
  if (rookie.espnId) {
    const byEspn = players.find((player) => player.espnId === rookie.espnId);
    if (byEspn) return byEspn;
  }

  const nameKey = normalizeName(rookie.name);
  const named = players.filter((player) => normalizeName(player.name) === nameKey);
  if (named.length === 0) return undefined;
  if (named.length === 1) return named[0];

  const teamHit = named.find(
    (player) => player.team?.toUpperCase() === rookie.teamAbbr.toUpperCase(),
  );
  if (teamHit) return teamHit;

  const posHit = named.find(
    (player) =>
      player.position &&
      sleeperPositionFamily(player.position) === sleeperPositionFamily(rookie.position),
  );
  return posHit ?? named[0];
}

function statsForRookie(
  rookie: { name: string; teamAbbr: string; position: string; espnId?: string },
  players: SleeperPlayer[],
  statsById: Record<string, UnknownRecord>,
  seasonStarted: boolean,
): RookieStats {
  if (!seasonStarted) {
    return emptyStats("No regular-season numbers yet. Week 1 has not been played.");
  }

  const player = matchSleeperPlayer(rookie, players);
  if (!player) {
    return emptyStats("We could not match this player to the stats feed yet.");
  }

  const raw = statsById[player.id];
  if (!raw || !hasRealStats(raw)) {
    return emptyStats("No regular-season numbers yet for this player.");
  }

  const gamesPlayed = sleeperNumber(raw, "gp");
  const family = sleeperPositionFamily(rookie.position);
  if (family === "OL" || family === "LS" || family === "P") {
    return {
      available: false,
      gamesPlayed,
      lines: [],
      note:
        gamesPlayed && gamesPlayed > 0
          ? `On the roster for ${gamesPlayed} game${gamesPlayed === 1 ? "" : "s"}. Line and specialist box-score stats are not listed here.`
          : "Line and specialist box-score stats are not listed here.",
    };
  }

  const lines = buildStatLines(rookie.position, raw);
  if (lines.length === 0) {
    return emptyStats("The stats feed has this player, but no counting numbers we trust yet.");
  }

  return {
    available: true,
    gamesPlayed,
    lines,
    note: gamesPlayed ? `In ${gamesPlayed} game${gamesPlayed === 1 ? "" : "s"} this season.` : "",
  };
}

function parseDraftPicks(
  data: unknown,
  seasonStarted: boolean,
  players: SleeperPlayer[],
  statsById: Record<string, UnknownRecord>,
): Rookie[] {
  if (!isRecord(data)) return [];
  const teams = parseDraftTeams(data.teams);
  const positions = parsePositions(data.positions);
  const picks = Array.isArray(data.picks) ? data.picks : [];
  const rookies: Rookie[] = [];

  for (const pick of picks) {
    if (!isRecord(pick)) continue;
    const athlete = isRecord(pick.athlete) ? pick.athlete : {};
    const name = asString(athlete.displayName);
    const round = asNumber(pick.round);
    const overall = asNumber(pick.overall);
    const roundPick = asNumber(pick.pick);
    if (!name || round === undefined || overall === undefined || roundPick === undefined) {
      continue;
    }

    const team = teams.get(asString(pick.teamId) ?? "");
    const positionId = isRecord(athlete.position) ? asString(athlete.position.id) : undefined;
    const position = (positionId && positions.get(positionId)?.abbreviation) || "ATH";
    const collegeTeam = isRecord(athlete.team) ? athlete.team : {};
    const headshot = isRecord(athlete.headshot) ? asString(athlete.headshot.href) : undefined;
    const espnId = asString(athlete.alternativeId) ?? asString(athlete.id);

    const row = {
      name,
      teamAbbr: team?.abbreviation ?? "TBC",
      position,
      espnId,
    };

    rookies.push({
      id: espnId ?? `${overall}-${normalizeName(name)}`,
      name,
      position,
      positionLabel: labelForPosition(position),
      college: asString(collegeTeam.shortDisplayName) ?? asString(collegeTeam.location),
      teamAbbr: team?.abbreviation ?? "TBC",
      teamName: team?.displayName ?? "Team to be confirmed",
      round,
      pick: overall,
      roundPick,
      traded: pick.traded === true,
      headshot,
      espnPlayerUrl: asString(athlete.proLink) ?? asString(athlete.link),
      stats: statsForRookie(row, players, statsById, seasonStarted),
    });
  }

  return rookies.sort((a, b) => a.pick - b.pick);
}

export async function getRookieWatch(options: {
  seasonYear: number;
  seasonStarted: boolean;
}): Promise<RookiesResult> {
  const fetchedAt = new Date().toISOString();
  const draftYear = options.seasonYear;

  try {
    const draft = await fetchJson(
      DRAFT_URL(draftYear),
      ROOKIES_CACHE_TAG,
      ROOKIES_REVALIDATE_SECONDS,
    );
    if (!isRecord(draft)) {
      return { ok: false, fetchedAt, error: "The draft list came back in a shape we do not recognise." };
    }

    let statsById: Record<string, UnknownRecord> = {};
    let players: SleeperPlayer[] = [];
    let statsNote =
      "Season stats come from Sleeper’s public regular-season feed, matched to ESPN’s draft list. If a number is missing, we leave it blank.";

    try {
      const statsRaw = await fetchJson(
        SLEEPER_STATS_URL(draftYear),
        ROOKIES_CACHE_TAG,
        ROOKIES_REVALIDATE_SECONDS,
      );
      if (isRecord(statsRaw)) {
        statsById = Object.fromEntries(
          Object.entries(statsRaw).filter((entry): entry is [string, UnknownRecord] =>
            isRecord(entry[1]),
          ),
        );
      }

      const anyStats = Object.values(statsById).some(hasRealStats);
      if (options.seasonStarted && anyStats) {
        const playersRaw = await fetchJson(
          SLEEPER_PLAYERS_URL,
          ROOKIES_CACHE_TAG,
          SLEEPER_PLAYERS_REVALIDATE_SECONDS,
          SLEEPER_PLAYERS_TIMEOUT_MS,
        );
        players = parseSleeperPlayers(playersRaw);
      } else if (!options.seasonStarted) {
        statsNote =
          "The 2026 regular season has not kicked off yet. Counting stats will appear here after rookies play.";
      } else {
        statsNote =
          "The stats feed is up, but it has no regular-season counting numbers yet. We will not invent any.";
      }
    } catch {
      statsNote =
        "The draft class loaded. The season stats feed did not, so numbers are marked unavailable rather than guessed.";
    }

    const rookies = parseDraftPicks(draft, options.seasonStarted, players, statsById);
    if (rookies.length === 0) {
      return {
        ok: false,
        fetchedAt,
        error: `ESPN’s ${draftYear} draft list is empty just now. Try again later.`,
      };
    }

    return {
      ok: true,
      fetchedAt,
      seasonYear: options.seasonYear,
      draftYear,
      sourceLabel: `ESPN’s public ${draftYear} NFL Draft board`,
      statsSourceLabel: "Sleeper public regular-season stats",
      rookies,
      statsNote,
    };
  } catch (error) {
    const message =
      error instanceof Error && error.name === "AbortError"
        ? "The rookie feed timed out. Try again in a minute."
        : "We could not load this year’s drafted rookies just now.";
    return { ok: false, fetchedAt, error: message };
  }
}
