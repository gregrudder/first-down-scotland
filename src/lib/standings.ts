const STANDINGS_URL =
  "https://site.api.espn.com/apis/v2/sports/football/nfl/standings?type=0&level=3";

const FETCH_TIMEOUT_MS = 8_000;
export const STANDINGS_REVALIDATE_SECONDS = 300;
export const STANDINGS_CACHE_TAG = "standings";

export type Conference = "AFC" | "NFC";
export type DivisionName = "East" | "North" | "South" | "West";

export type StandingTeam = {
  abbreviation: string;
  name: string;
  shortName: string;
  logo?: string;
  wins: number;
  losses: number;
  ties: number;
  recordText: string;
  winPercent: number;
  winPercentText: string;
  pointsFor: number;
  pointsAgainst: number;
  differentialText: string;
  streak: string;
  gamesBehind: string;
  divisionRecord: string;
  conferenceRecord: string;
  playoffSeed: number | null;
  divisionRank: number;
  conference: Conference;
  division: DivisionName;
};

export type DivisionStanding = {
  conference: Conference;
  division: DivisionName;
  heading: string;
  teams: StandingTeam[];
};

export type StandingsSuccess = {
  ok: true;
  fetchedAt: string;
  seasonYear: number | null;
  seasonLabel: string;
  divisions: DivisionStanding[];
};

export type StandingsFailure = {
  ok: false;
  fetchedAt: string;
  error: string;
};

export type StandingsResult = StandingsSuccess | StandingsFailure;

type UnknownRecord = Record<string, unknown>;

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

function statMap(stats: unknown): Map<string, UnknownRecord> {
  const map = new Map<string, UnknownRecord>();
  if (!Array.isArray(stats)) return map;
  for (const entry of stats) {
    if (!isRecord(entry)) continue;
    const name = asString(entry.name) ?? asString(entry.abbreviation);
    if (name) map.set(name, entry);
  }
  return map;
}

function statNumber(stats: Map<string, UnknownRecord>, ...names: string[]): number {
  for (const name of names) {
    const entry = stats.get(name);
    if (!entry) continue;
    const value = asNumber(entry.value);
    if (value !== undefined) return value;
  }
  return 0;
}

function statText(stats: Map<string, UnknownRecord>, ...names: string[]): string {
  for (const name of names) {
    const entry = stats.get(name);
    if (!entry) continue;
    const text = asString(entry.displayValue);
    if (text) return text;
  }
  return "";
}

function parseConference(name: string): Conference | null {
  const upper = name.toUpperCase();
  if (upper.includes("AFC") || upper.includes("AMERICAN")) return "AFC";
  if (upper.includes("NFC") || upper.includes("NATIONAL")) return "NFC";
  return null;
}

function parseDivision(name: string): DivisionName | null {
  const upper = name.toUpperCase();
  if (upper.includes("EAST")) return "East";
  if (upper.includes("NORTH")) return "North";
  if (upper.includes("SOUTH")) return "South";
  if (upper.includes("WEST")) return "West";
  return null;
}

function parseEntry(
  raw: unknown,
  conference: Conference,
  division: DivisionName,
): Omit<StandingTeam, "divisionRank"> | null {
  if (!isRecord(raw)) return null;
  const team = isRecord(raw.team) ? raw.team : {};
  const abbreviation = asString(team.abbreviation);
  const name = asString(team.displayName) ?? asString(team.name);
  if (!abbreviation || !name) return null;

  const stats = statMap(raw.stats);
  const wins = Math.round(statNumber(stats, "wins"));
  const losses = Math.round(statNumber(stats, "losses"));
  const ties = Math.round(statNumber(stats, "ties"));
  const recordText = statText(stats, "overall") || `${wins}-${losses}${ties ? `-${ties}` : ""}`;
  const seed = Math.round(statNumber(stats, "playoffSeed"));
  const logos = Array.isArray(team.logos) ? team.logos : [];
  const logoEntry = logos.find(isRecord);

  return {
    abbreviation,
    name,
    shortName: asString(team.shortDisplayName) ?? asString(team.name) ?? name,
    logo: logoEntry ? asString(logoEntry.href) : undefined,
    wins,
    losses,
    ties,
    recordText,
    winPercent: statNumber(stats, "winPercent"),
    winPercentText: statText(stats, "winPercent") || ".000",
    pointsFor: Math.round(statNumber(stats, "pointsFor")),
    pointsAgainst: Math.round(statNumber(stats, "pointsAgainst")),
    differentialText: statText(stats, "pointDifferential", "differential") || "0",
    streak: statText(stats, "streak") || "-",
    gamesBehind: statText(stats, "gamesBehind") || "-",
    divisionRecord: statText(stats, "divisionRecord", "vs. Div.") || "0-0",
    conferenceRecord: statText(stats, "vs. Conf.") || "0-0",
    playoffSeed: seed > 0 ? seed : null,
    conference,
    division,
  };
}

function rankDivision(
  conference: Conference,
  division: DivisionName,
  rows: Array<Omit<StandingTeam, "divisionRank">>,
): DivisionStanding {
  const sorted = [...rows].sort((a, b) => {
    if (b.winPercent !== a.winPercent) return b.winPercent - a.winPercent;
    if (b.wins !== a.wins) return b.wins - a.wins;
    const aDiff = Number.parseInt(a.differentialText, 10);
    const bDiff = Number.parseInt(b.differentialText, 10);
    if (Number.isFinite(bDiff) && Number.isFinite(aDiff) && bDiff !== aDiff) {
      return bDiff - aDiff;
    }
    return a.name.localeCompare(b.name);
  });

  return {
    conference,
    division,
    heading: `${conference} ${division}`,
    teams: sorted.map((team, index) => ({ ...team, divisionRank: index + 1 })),
  };
}

function parseStandings(data: unknown, fetchedAt: string): StandingsSuccess {
  const root = isRecord(data) ? data : {};
  const season = isRecord(root.season) ? root.season : {};
  const seasonYear = asNumber(season.year) ?? null;
  const conferences = Array.isArray(root.children) ? root.children : [];
  const divisions: DivisionStanding[] = [];

  for (const conferenceRaw of conferences) {
    if (!isRecord(conferenceRaw)) continue;
    const conference = parseConference(
      asString(conferenceRaw.abbreviation) ?? asString(conferenceRaw.name) ?? "",
    );
    if (!conference) continue;
    const kids = Array.isArray(conferenceRaw.children) ? conferenceRaw.children : [];

    for (const divisionRaw of kids) {
      if (!isRecord(divisionRaw)) continue;
      const division = parseDivision(
        asString(divisionRaw.name) ?? asString(divisionRaw.abbreviation) ?? "",
      );
      if (!division) continue;
      const standings = isRecord(divisionRaw.standings) ? divisionRaw.standings : {};
      const entries = Array.isArray(standings.entries) ? standings.entries : [];
      const rows = entries
        .map((entry) => parseEntry(entry, conference, division))
        .filter((row): row is Omit<StandingTeam, "divisionRank"> => row !== null);
      if (rows.length > 0) {
        divisions.push(rankDivision(conference, division, rows));
      }
    }
  }

  const order: Array<[Conference, DivisionName]> = [
    ["AFC", "East"],
    ["AFC", "North"],
    ["AFC", "South"],
    ["AFC", "West"],
    ["NFC", "East"],
    ["NFC", "North"],
    ["NFC", "South"],
    ["NFC", "West"],
  ];
  divisions.sort((a, b) => {
    const ai = order.findIndex(([c, d]) => c === a.conference && d === a.division);
    const bi = order.findIndex(([c, d]) => c === b.conference && d === b.division);
    return ai - bi;
  });

  return {
    ok: true,
    fetchedAt,
    seasonYear,
    seasonLabel: seasonYear ? `${seasonYear} regular season` : "This season",
    divisions,
  };
}

export async function getNflStandings(): Promise<StandingsResult> {
  const fetchedAt = new Date().toISOString();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(STANDINGS_URL, {
      signal: controller.signal,
      next: {
        revalidate: STANDINGS_REVALIDATE_SECONDS,
        tags: [STANDINGS_CACHE_TAG],
      },
      headers: {
        Accept: "application/json",
      },
    });
    if (!response.ok) throw new Error(`ESPN returned ${response.status}`);
    return parseStandings(await response.json(), fetchedAt);
  } catch (error) {
    const message =
      error instanceof Error && error.name === "AbortError"
        ? "The standings feed timed out. Try again in a minute."
        : "We could not reach the live standings feed just now.";
    return { ok: false, fetchedAt, error: message };
  } finally {
    clearTimeout(timer);
  }
}

export function divisionForTeam(
  standings: StandingsSuccess,
  abbreviation: string,
): DivisionStanding | undefined {
  const abbr = abbreviation.toUpperCase();
  return standings.divisions.find((division) =>
    division.teams.some((team) => team.abbreviation.toUpperCase() === abbr),
  );
}
