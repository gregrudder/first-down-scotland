import { formatUkDate, ukDateKey } from "@/lib/time";

import { teams } from "@/data/teams";

const SCOREBOARD_URL =
  "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard";

const FETCH_TIMEOUT_MS = 8_000;
export const FIXTURES_REVALIDATE_SECONDS = 300;
export const FIXTURES_CACHE_TAG = "fixtures";
export const SCORES_REVALIDATE_SECONDS = 20;
export const SCORES_CACHE_TAG = "scores";

export type GameStatus = "scheduled" | "in-progress" | "final" | "other";

export type TeamSide = {
  name: string;
  shortName: string;
  abbreviation: string;
  logo?: string;
  score?: number;
  record?: string;
  winner?: boolean;
};

export type TouchdownScorer = {
  id: string;
  teamAbbreviation: string;
  playerName: string;
  yards?: number;
  quarter?: string;
};

export type NflGame = {
  id: string;
  name: string;
  shortName: string;
  kickoffUtc: string;
  status: GameStatus;
  statusText: string;
  period?: number;
  clock?: string;
  venue?: string;
  venueCity?: string;
  broadcasts: string[];
  recapUrl?: string;
  gamecastUrl?: string;
  home: TeamSide;
  away: TeamSide;
  /** From ESPN’s per-game summary scoring plays. Omitted when none or the feed has none. */
  touchdowns?: TouchdownScorer[];
};

export type FixturesSuccess = {
  ok: true;
  fetchedAt: string;
  seasonYear: number | null;
  seasonType: number | null;
  seasonTypeName: string;
  weekNumber: number | null;
  weekLabel: string;
  games: NflGame[];
};

export type FixturesFailure = {
  ok: false;
  fetchedAt: string;
  error: string;
};

export type FixturesResult = FixturesSuccess | FixturesFailure;

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function asNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() && !Number.isNaN(Number(value))) {
    return Number(value);
  }
  return undefined;
}

function mapStatus(raw: unknown): { status: GameStatus; statusText: string } {
  if (!isRecord(raw)) {
    return { status: "other", statusText: "Status unknown" };
  }

  const type = isRecord(raw.type) ? raw.type : {};
  const state = asString(type.state)?.toLowerCase();
  const name = asString(type.name)?.toUpperCase() ?? "";
  const completed = type.completed === true;
  const description = asString(type.description) ?? asString(type.detail);

  if (completed || name.includes("FINAL") || state === "post") {
    return { status: "final", statusText: description ?? "Full time" };
  }
  if (state === "in" || name.includes("IN_PROGRESS") || name.includes("HALFTIME")) {
    return { status: "in-progress", statusText: description ?? "Live" };
  }
  if (state === "pre" || name.includes("SCHEDULED")) {
    return { status: "scheduled", statusText: description ?? "Scheduled" };
  }
  return { status: "other", statusText: description ?? "See kick-off time" };
}

function parseTeam(raw: unknown): TeamSide | null {
  if (!isRecord(raw)) return null;
  const team = isRecord(raw.team) ? raw.team : {};
  const name =
    asString(team.displayName) ??
    asString(team.name) ??
    asString(team.shortDisplayName);
  const abbreviation = asString(team.abbreviation);
  if (!name || !abbreviation) return null;

  const records = Array.isArray(raw.records) ? raw.records : [];
  const overall = records.find(
    (entry) => isRecord(entry) && (entry.type === "total" || entry.name === "overall"),
  );

  return {
    name,
    shortName: asString(team.shortDisplayName) ?? asString(team.name) ?? name,
    abbreviation,
    logo: asString(team.logo),
    score: asNumber(raw.score),
    record:
      isRecord(overall) && typeof overall.summary === "string"
        ? overall.summary
        : undefined,
    winner: typeof raw.winner === "boolean" ? raw.winner : undefined,
  };
}

function parseBroadcasts(competition: UnknownRecord): string[] {
  const names = new Set<string>();

  if (Array.isArray(competition.broadcasts)) {
    for (const broadcast of competition.broadcasts) {
      if (!isRecord(broadcast) || !Array.isArray(broadcast.names)) continue;
      for (const name of broadcast.names) {
        if (typeof name === "string" && name.trim()) names.add(name.trim());
      }
    }
  }

  const single = asString(competition.broadcast);
  if (single) names.add(single);

  return [...names];
}

function parseEspnLinks(raw: unknown): { recapUrl?: string; gamecastUrl?: string } {
  if (!Array.isArray(raw)) return {};
  let recapUrl: string | undefined;
  let gamecastUrl: string | undefined;
  for (const entry of raw) {
    if (!isRecord(entry)) continue;
    const href = asString(entry.href);
    if (!href) continue;
    const rel = Array.isArray(entry.rel)
      ? entry.rel.filter((value): value is string => typeof value === "string")
      : [];
    const relSet = new Set(rel.map((value) => value.toLowerCase()));
    if (relSet.has("recap")) recapUrl = href;
    if (relSet.has("summary") || relSet.has("desktop")) {
      if (!gamecastUrl) gamecastUrl = href;
    }
  }
  return { recapUrl, gamecastUrl };
}

function parseVenue(competition: UnknownRecord): {
  venue?: string;
  venueCity?: string;
} {
  const venue = isRecord(competition.venue) ? competition.venue : {};
  const address = isRecord(venue.address) ? venue.address : {};
  const city = [asString(address.city), asString(address.state), asString(address.country)]
    .filter(Boolean)
    .join(", ");

  return {
    venue: asString(venue.fullName),
    venueCity: city || undefined,
  };
}

function parseGame(event: unknown): NflGame | null {
  if (!isRecord(event)) return null;

  const competitions = Array.isArray(event.competitions) ? event.competitions : [];
  const competition = competitions.find(isRecord);
  if (!competition) return null;

  const competitors = Array.isArray(competition.competitors)
    ? competition.competitors
    : [];
  const homeRaw = competitors.find(
    (entry) => isRecord(entry) && entry.homeAway === "home",
  );
  const awayRaw = competitors.find(
    (entry) => isRecord(entry) && entry.homeAway === "away",
  );
  const home = parseTeam(homeRaw);
  const away = parseTeam(awayRaw);
  if (!home || !away) return null;

  const kickoffUtc =
    asString(competition.date) ?? asString(event.date) ?? asString(competition.startDate);
  if (!kickoffUtc) return null;

  const statusSource = isRecord(event.status) ? event.status : competition.status;
  const { status, statusText } = mapStatus(statusSource);
  const period = isRecord(statusSource) ? asNumber(statusSource.period) : undefined;
  const clock = isRecord(statusSource) ? asString(statusSource.displayClock) : undefined;
  const { venue, venueCity } = parseVenue(competition);
  const { recapUrl, gamecastUrl } = parseEspnLinks(event.links);

  return {
    id: asString(event.id) ?? `${away.abbreviation}-${home.abbreviation}-${kickoffUtc}`,
    name: asString(event.name) ?? `${away.name} at ${home.name}`,
    shortName: asString(event.shortName) ?? `${away.abbreviation} @ ${home.abbreviation}`,
    kickoffUtc,
    status,
    statusText,
    period,
    clock,
    venue,
    venueCity,
    broadcasts: parseBroadcasts(competition),
    recapUrl,
    gamecastUrl,
    home,
    away,
  };
}

function seasonTypeName(type: number | null, fallback?: string): string {
  if (fallback) return fallback;
  switch (type) {
    case 1:
      return "Preseason";
    case 2:
      return "Regular season";
    case 3:
      return "Play-offs";
    case 4:
      return "Off-season";
    default:
      return "NFL";
  }
}

function parseScoreboard(data: unknown, fetchedAt: string): FixturesSuccess {
  const root = isRecord(data) ? data : {};
  const season = isRecord(root.season) ? root.season : {};
  const week = isRecord(root.week) ? root.week : {};
  const leagues = Array.isArray(root.leagues) ? root.leagues : [];
  const league = leagues.find(isRecord);
  const leagueSeason = league && isRecord(league.season) ? league.season : {};
  const leagueSeasonType = isRecord(leagueSeason.type) ? leagueSeason.type : {};

  const seasonType =
    asNumber(season.type) ?? asNumber(leagueSeasonType.type) ?? asNumber(leagueSeasonType.id);
  const seasonYear = asNumber(season.year) ?? asNumber(leagueSeason.year);
  const weekNumber = asNumber(week.number);
  const events = Array.isArray(root.events) ? root.events : [];

  const games = events
    .map(parseGame)
    .filter((game): game is NflGame => game !== null)
    .sort((a, b) => a.kickoffUtc.localeCompare(b.kickoffUtc));

  return {
    ok: true,
    fetchedAt,
    seasonYear: seasonYear ?? null,
    seasonType: seasonType ?? null,
    seasonTypeName: seasonTypeName(seasonType ?? null, asString(leagueSeasonType.name)),
    weekNumber: weekNumber ?? null,
    weekLabel: weekNumber ? `Week ${weekNumber}` : "This week",
    games,
  };
}

type ScoreboardCache = {
  revalidate?: number;
  tags?: string[];
  cache?: "no-store";
};

async function fetchScoreboard(url: string, cache?: ScoreboardCache): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      ...(cache?.cache === "no-store"
        ? { cache: "no-store" as const }
        : {
            next: {
              revalidate: cache?.revalidate ?? FIXTURES_REVALIDATE_SECONDS,
              tags: cache?.tags ?? [FIXTURES_CACHE_TAG],
            },
          }),
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`ESPN returned ${response.status}`);
    }

    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

function withParams(params: Record<string, string | number>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    search.set(key, String(value));
  }
  return `${SCOREBOARD_URL}?${search.toString()}`;
}

async function loadScoreboard(cache?: ScoreboardCache): Promise<FixturesResult> {
  const fetchedAt = new Date().toISOString();

  try {
    const primary = parseScoreboard(await fetchScoreboard(SCOREBOARD_URL, cache), fetchedAt);
    if (primary.games.length > 0) return primary;

    const fallbackParams: Record<string, string | number> = {};
    if (primary.seasonYear) fallbackParams.dates = primary.seasonYear;
    if (primary.seasonType) fallbackParams.seasontype = primary.seasonType;
    if (primary.weekNumber) fallbackParams.week = primary.weekNumber;

    if (Object.keys(fallbackParams).length > 0) {
      const fallback = parseScoreboard(
        await fetchScoreboard(withParams(fallbackParams), cache),
        fetchedAt,
      );
      if (fallback.games.length > 0) return fallback;
    }

    return primary;
  } catch (error) {
    const message =
      error instanceof Error && error.name === "AbortError"
        ? "The fixture feed timed out. Try again in a minute."
        : "We could not reach the live fixture feed just now.";

    return {
      ok: false,
      fetchedAt,
      error: message,
    };
  }
}

export async function getNflFixtures(): Promise<FixturesResult> {
  return loadScoreboard({
    revalidate: FIXTURES_REVALIDATE_SECONDS,
    tags: [FIXTURES_CACHE_TAG],
  });
}

/** Near-live scoreboard: not shared with the 5-minute fixtures cache. */
export async function getNflLiveScoreboard(): Promise<FixturesResult> {
  return loadScoreboard({ cache: "no-store" });
}

export function groupGamesByUkDate(games: NflGame[]) {
  const groups = new Map<string, NflGame[]>();

  for (const game of games) {
    const key = ukDateKey(game.kickoffUtc);
    const list = groups.get(key) ?? [];
    list.push(game);
    groups.set(key, list);
  }

  return [...groups.entries()].map(([dateKey, grouped]) => ({
    dateKey,
    heading: formatUkDate(grouped[0]?.kickoffUtc ?? dateKey),
    games: grouped,
  }));
}

export function weekHeading(fixtures: FixturesSuccess): string {
  const bits = [fixtures.seasonTypeName, fixtures.weekLabel].filter(
    (value) => value && value !== "NFL",
  );
  if (fixtures.seasonYear) bits.unshift(String(fixtures.seasonYear));
  return bits.join(" · ");
}

export function teamsOnBye(fixtures: FixturesSuccess): TeamSide[] {
  if (fixtures.seasonType !== 2 || fixtures.games.length === 0) return [];

  const playing = new Set<string>();
  for (const game of fixtures.games) {
    playing.add(game.home.abbreviation.toUpperCase());
    playing.add(game.away.abbreviation.toUpperCase());
  }
  if (playing.size >= 32) return [];

  return teams
    .filter((team) => !playing.has(team.abbreviation.toUpperCase()))
    .map((team) => ({
      name: team.name,
      shortName: team.shortName,
      abbreviation: team.abbreviation,
    }));
}

export function seasonHasStarted(fixtures: FixturesSuccess): boolean {
  if ((fixtures.weekNumber ?? 0) > 1) return true;
  return fixtures.games.some(
    (game) => game.status === "in-progress" || game.status === "final",
  );
}
