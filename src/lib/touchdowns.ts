import {
  SCORES_CACHE_TAG,
  SCORES_REVALIDATE_SECONDS,
  type FixturesResult,
  type NflGame,
  type TouchdownScorer,
} from "@/lib/espn";
import {
  ESPN_SUMMARY_CACHE_TAG,
  ESPN_SUMMARY_REVALIDATE_SECONDS,
  fetchEspnSummaryJson,
} from "@/lib/espn-summary";

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

function isTouchdownPlay(play: UnknownRecord): boolean {
  const scoringType = isRecord(play.scoringType) ? play.scoringType : {};
  const type = isRecord(play.type) ? play.type : {};
  const scoringName = asString(scoringType.name)?.toLowerCase() ?? "";
  const scoringAbbr = asString(scoringType.abbreviation)?.toUpperCase() ?? "";
  const typeText = asString(type.text)?.toLowerCase() ?? "";
  const typeAbbr = asString(type.abbreviation)?.toUpperCase() ?? "";

  if (scoringName.includes("field-goal") || scoringName.includes("field goal")) return false;
  if (scoringName.includes("safety") || scoringName.includes("extra-point")) return false;
  if (scoringName.includes("two-point") || scoringAbbr === "FG" || scoringAbbr === "PAT") {
    return false;
  }
  if (scoringName === "touchdown" || scoringAbbr === "TD") return true;
  if (typeAbbr === "TD" || typeText.includes("touchdown")) return true;
  return false;
}

function quarterLabel(period: number | undefined): string | undefined {
  if (period == null || period < 1) return undefined;
  if (period <= 4) return `Q${period}`;
  if (period === 5) return "OT";
  return `OT${period - 4}`;
}

/** “Jaxon Smith-Njigba” → “J. Smith-Njigba”; leave “A.J. Brown” / “D.K. Metcalf” as-is. */
export function shortPlayerName(full: string): string {
  const parts = full.trim().split(/\s+/).filter(Boolean);
  if (parts.length < 2) return full.trim();
  const first = parts[0];
  if (first.includes(".") || /^[A-Z](?:-[A-Z])?\.?$/i.test(first)) {
    return parts.join(" ");
  }
  return `${first.charAt(0).toUpperCase()}. ${parts.slice(1).join(" ")}`;
}

function stripKickSuffix(text: string): string {
  return text
    .replace(/\s*\([^)]*(?:kick|conversion|failed)[^)]*\)\s*$/i, "")
    .trim();
}

function scorerFromText(text: string): { name: string; yards?: number } | null {
  const cleaned = stripKickSuffix(text);
  if (!cleaned) return null;

  const withYards = cleaned.match(/^(.+?)\s+(\d+)\s+Yds?\b/i);
  if (withYards) {
    const name = withYards[1].trim();
    const yards = Number(withYards[2]);
    if (!name) return null;
    return {
      name: shortPlayerName(name),
      yards: Number.isFinite(yards) ? yards : undefined,
    };
  }

  const beforePass = cleaned.split(/\s+pass from\s+/i)[0]?.trim();
  if (beforePass && beforePass !== cleaned) {
    return { name: shortPlayerName(beforePass) };
  }

  return { name: shortPlayerName(cleaned) };
}

function scorerFromAthletes(raw: unknown): string | undefined {
  if (!Array.isArray(raw)) return undefined;
  for (const entry of raw) {
    if (!isRecord(entry)) continue;
    const short = asString(entry.shortName);
    const display = asString(entry.displayName) ?? asString(entry.fullName);
    if (short) return short;
    if (display) return shortPlayerName(display);
  }
  return undefined;
}

export function parseTouchdowns(data: unknown): TouchdownScorer[] {
  if (!isRecord(data) || !Array.isArray(data.scoringPlays)) return [];

  const scorers: TouchdownScorer[] = [];

  for (const raw of data.scoringPlays) {
    if (!isRecord(raw) || !isTouchdownPlay(raw)) continue;

    const team = isRecord(raw.team) ? raw.team : {};
    const abbreviation = asString(team.abbreviation)?.toUpperCase();
    const text = asString(raw.text);
    const parsed = text ? scorerFromText(text) : null;
    const playerName = parsed?.name ?? scorerFromAthletes(raw.athletesInvolved);
    if (!abbreviation || !playerName) continue;

    const period = isRecord(raw.period) ? asNumber(raw.period.number) : asNumber(raw.period);
    const id =
      asString(raw.id) ?? `${abbreviation}-${playerName}-${period ?? ""}-${scorers.length}`;

    scorers.push({
      id,
      teamAbbreviation: abbreviation,
      playerName,
      yards: parsed?.yards,
      quarter: quarterLabel(period),
    });
  }

  return scorers;
}

function summaryCacheFor(status: NflGame["status"]): {
  revalidate: number;
  tags: string[];
} {
  if (status === "in-progress") {
    return {
      revalidate: SCORES_REVALIDATE_SECONDS,
      tags: [SCORES_CACHE_TAG],
    };
  }
  return {
    revalidate: ESPN_SUMMARY_REVALIDATE_SECONDS,
    tags: [ESPN_SUMMARY_CACHE_TAG],
  };
}

function parseElapsedMinutes(data: unknown): number | undefined {
  if (!isRecord(data) || !isRecord(data.meta)) return undefined;
  const first = asString(data.meta.firstPlayWallClock);
  const last = asString(data.meta.lastPlayWallClock);
  if (!first || !last) return undefined;
  const start = Date.parse(first);
  const end = Date.parse(last);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return undefined;
  return Math.round((end - start) / 60_000);
}

type SummaryBits = {
  touchdowns: TouchdownScorer[];
  elapsedMinutes?: number;
};

export async function touchdownsForGames(
  games: NflGame[],
): Promise<Record<string, SummaryBits>> {
  const started = games.filter(
    (game) => game.status === "in-progress" || game.status === "final",
  );
  if (started.length === 0) return {};

  const entries = await Promise.all(
    started.map(async (game) => {
      try {
        const json = await fetchEspnSummaryJson(game.id, summaryCacheFor(game.status));
        return [
          game.id,
          {
            touchdowns: parseTouchdowns(json),
            elapsedMinutes: parseElapsedMinutes(json),
          },
        ] as const;
      } catch {
        return [game.id, { touchdowns: [] as TouchdownScorer[] }] as const;
      }
    }),
  );

  return Object.fromEntries(entries);
}

/** Attach TD scorers and game length onto live/final games. Missing data stays omitted. */
export async function withTouchdownScorers(result: FixturesResult): Promise<FixturesResult> {
  if (!result.ok) return result;

  const byId = await touchdownsForGames(result.games);
  return {
    ...result,
    games: result.games.map((game) => {
      const bits = byId[game.id];
      if (!bits) return game;
      return {
        ...game,
        ...(bits.touchdowns.length ? { touchdowns: bits.touchdowns } : {}),
        ...(typeof bits.elapsedMinutes === "number"
          ? { elapsedMinutes: bits.elapsedMinutes }
          : {}),
      };
    }),
  };
}
