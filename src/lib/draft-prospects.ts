import {
  fallbackProspects,
  fallbackSource,
  fallbackSources,
  type DraftProspect,
} from "@/data/draft-prospects-fallback";

export const DRAFT_PROSPECTS_CACHE_TAG = "draft-prospects";
export const DRAFT_PROSPECTS_REVALIDATE_SECONDS = 600;
export const DRAFT_YEAR = 2027;
const FETCH_TIMEOUT_MS = 8_000;
const ESPN_LIST =
  "https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/2027/draft/athletes?limit=12";

const POSITION_LABELS: Record<string, string> = {
  WR: "Wide receiver",
  QB: "Quarterback",
  CB: "Cornerback",
  EDGE: "Edge rusher",
  DE: "Defensive end",
  DT: "Defensive tackle",
  DL: "Defensive line",
  OT: "Offensive tackle",
  OG: "Guard",
  G: "Guard",
  C: "Centre",
  OL: "Offensive line",
  "OT/OG": "Offensive line",
  LB: "Linebacker",
  ILB: "Linebacker",
  OLB: "Linebacker",
  S: "Safety",
  FS: "Safety",
  SS: "Safety",
  RB: "Running back",
  TE: "Tight end",
  ATH: "Athlete",
};

export function labelForPosition(abbreviation: string): string {
  const key = abbreviation.trim().toUpperCase();
  return POSITION_LABELS[key] ?? abbreviation;
}

export type DraftSourceLink = {
  label: string;
  href: string;
};

export type DraftProspectsResult = {
  source: "espn" | "fallback";
  sourceLabel: string;
  sourceHref?: string;
  sources: DraftSourceLink[];
  fetchedAt: string;
  prospects: DraftProspect[];
};

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function whyFor(name: string, position: string, college: string): string {
  const known = fallbackProspects.find(
    (entry) => entry.name.toLowerCase() === name.toLowerCase(),
  );
  if (known) return known.why;
  return `${labelForPosition(position)} at ${college}. A name on the early 2027 boards — rankings move every week of the college season.`;
}

async function fetchJson(url: string): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      next: {
        revalidate: DRAFT_PROSPECTS_REVALIDATE_SECONDS,
        tags: [DRAFT_PROSPECTS_CACHE_TAG],
      },
      headers: {
        Accept: "application/json",
        "User-Agent": "FirstDownScotland/1.0 (https://first-down-scotland.vercel.app)",
      },
    });
    if (!response.ok) throw new Error(`ESPN returned ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

function httpsRef(ref: string): string {
  return ref.replace(/^http:\/\//, "https://");
}

async function collegeName(ref: string | undefined): Promise<string> {
  if (!ref) return "College TBC";
  try {
    const data = await fetchJson(httpsRef(ref));
    if (!isRecord(data)) return "College TBC";
    return asString(data.shortDisplayName) ?? asString(data.displayName) ?? asString(data.name) ?? "College TBC";
  } catch {
    return "College TBC";
  }
}

async function loadEspnProspects(): Promise<DraftProspect[] | null> {
  const list = await fetchJson(ESPN_LIST);
  if (!isRecord(list)) return null;
  const count = typeof list.count === "number" ? list.count : 0;
  const items = Array.isArray(list.items) ? list.items : [];
  if (count < 8 || items.length < 8) return null;

  const refs = items
    .slice(0, 12)
    .map((item) => (isRecord(item) ? asString(item.$ref) : undefined))
    .filter((ref): ref is string => Boolean(ref));

  const rows = await Promise.all(
    refs.map(async (ref, index) => {
      const data = await fetchJson(httpsRef(ref));
      if (!isRecord(data)) return null;
      const name = asString(data.displayName) ?? asString(data.fullName);
      if (!name) return null;
      const position = isRecord(data.position)
        ? (asString(data.position.abbreviation) ?? asString(data.position.displayName) ?? "—")
        : "—";
      const college = isRecord(data.college) ? await collegeName(asString(data.college.$ref)) : "College TBC";
      const rank =
        (typeof data.overallRanking === "number" && data.overallRanking) ||
        (typeof data.rank === "number" && data.rank) ||
        index + 1;
      return {
        id: asString(data.id) ?? name.toLowerCase().replace(/\s+/g, "-"),
        rank,
        name,
        position,
        college,
        why: whyFor(name, position, college),
      } satisfies DraftProspect;
    }),
  );

  const prospects = rows.filter((row): row is DraftProspect => row !== null);
  if (prospects.length < 8) return null;
  return prospects.sort((a, b) => a.rank - b.rank).slice(0, 12);
}

export async function getDraftProspects(): Promise<DraftProspectsResult> {
  const fetchedAt = new Date().toISOString();
  try {
    const live = await loadEspnProspects();
    if (live) {
      return {
        source: "espn",
        sourceLabel: "ESPN’s public 2027 draft athlete list",
        sourceHref: "https://www.espn.com/nfl/draft/",
        sources: [{ label: "ESPN NFL Draft", href: "https://www.espn.com/nfl/draft/" }],
        fetchedAt,
        prospects: live,
      };
    }
  } catch {
    // fall through to the cited boards
  }

  return {
    source: "fallback",
    sourceLabel: fallbackSource.label,
    sourceHref: fallbackSource.href,
    sources: fallbackSources.map((entry) => ({ label: entry.label, href: entry.href })),
    fetchedAt,
    prospects: fallbackProspects,
  };
}
