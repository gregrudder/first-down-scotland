import { espnTeamId } from "@/data/espn-team-ids";

export const DEPTH_CHART_REVALIDATE_SECONDS = 600;
export const DEPTH_CHART_CACHE_TAG = "depth-charts";

const FETCH_TIMEOUT_MS = 8_000;

export type DepthUnit = "offence" | "defence" | "special";

export type DepthRow = {
  code: string;
  label: string;
  starter: string;
  nextUp?: string;
};

export type DepthChartSuccess = {
  ok: true;
  fetchedAt: string;
  seasonYear: number;
  source: "ESPN";
  units: { unit: DepthUnit; heading: string; rows: DepthRow[] }[];
};

export type DepthChartFailure = {
  ok: false;
  fetchedAt: string;
  error: string;
};

export type DepthChartResult = DepthChartSuccess | DepthChartFailure;

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

function nflSeasonYear(now = new Date()): number {
  const year = now.getUTCFullYear();
  // Jan-Feb is still the previous NFL season.
  return now.getUTCMonth() < 2 ? year - 1 : year;
}

const POSITION_LABELS: Record<string, string> = {
  QB: "Quarterback",
  RB: "Running back",
  HB: "Running back",
  FB: "Full-back",
  WR: "Wide receiver",
  TE: "Tight end",
  LT: "Left tackle",
  LG: "Left guard",
  C: "Centre",
  RG: "Right guard",
  RT: "Right tackle",
  OT: "Tackle",
  OG: "Guard",
  G: "Guard",
  T: "Tackle",
  OL: "Offensive line",
  DE: "Defensive end",
  DT: "Defensive tackle",
  NT: "Nose tackle",
  LDE: "Left end",
  RDE: "Right end",
  LDT: "Left tackle (defence)",
  RDT: "Right tackle (defence)",
  EDGE: "Edge rusher",
  DL: "Defensive line",
  LB: "Linebacker",
  ILB: "Inside linebacker",
  MLB: "Middle linebacker",
  OLB: "Outside linebacker",
  WLB: "Weak-side linebacker",
  SLB: "Strong-side linebacker",
  LOLB: "Left outside linebacker",
  ROLB: "Right outside linebacker",
  LILB: "Left inside linebacker",
  RILB: "Right inside linebacker",
  CB: "Cornerback",
  LCB: "Left corner",
  RCB: "Right corner",
  NCB: "Nickel corner",
  NB: "Nickel corner",
  DB: "Defensive back",
  S: "Safety",
  SS: "Strong safety",
  FS: "Free safety",
  PK: "Kicker",
  K: "Kicker",
  P: "Punter",
  LS: "Long snapper",
  H: "Holder",
  KR: "Kick returner",
  PR: "Punt returner",
};

const UNIT_HEADING: Record<DepthUnit, string> = {
  offence: "Offence",
  defence: "Defence",
  special: "Special teams",
};

function classifyUnit(code: string, groupHint?: string): DepthUnit {
  const hint = (groupHint ?? "").toLowerCase();
  if (hint.includes("special")) return "special";
  if (hint.includes("defense") || hint.includes("defence")) return "defence";
  if (hint.includes("offense") || hint.includes("offence")) return "offence";

  const special = new Set(["PK", "K", "P", "LS", "H", "KR", "PR"]);
  const defence = new Set([
    "DE",
    "DT",
    "NT",
    "LDE",
    "RDE",
    "LDT",
    "RDT",
    "EDGE",
    "DL",
    "LB",
    "ILB",
    "MLB",
    "OLB",
    "WLB",
    "SLB",
    "LOLB",
    "ROLB",
    "LILB",
    "RILB",
    "CB",
    "LCB",
    "RCB",
    "NCB",
    "NB",
    "DB",
    "S",
    "SS",
    "FS",
  ]);
  if (special.has(code)) return "special";
  if (defence.has(code)) return "defence";
  return "offence";
}

function positionLabel(code: string, fallback?: string): string {
  return POSITION_LABELS[code] ?? fallback ?? code;
}

function athleteIdFromRef(value: unknown): string | undefined {
  if (!isRecord(value)) return asString(value);
  const id = asString(value.id) ?? asNumber(value.id)?.toString();
  if (id) return id;
  const ref = asString(value.$ref);
  if (!ref) return undefined;
  try {
    const path = new URL(ref).pathname.replace(/\/$/, "");
    const last = path.split("/").pop();
    return last && /^\d+$/.test(last) ? last : undefined;
  } catch {
    return undefined;
  }
}

function athleteName(value: unknown, roster: Map<string, string>): string | undefined {
  if (!isRecord(value)) return undefined;
  const direct =
    asString(value.displayName) ??
    asString(value.fullName) ??
    asString(value.shortName) ??
    asString(value.name);
  if (direct) return direct;
  const id = athleteIdFromRef(value);
  return id ? roster.get(id) : undefined;
}

async function fetchJson(url: string): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      next: {
        revalidate: DEPTH_CHART_REVALIDATE_SECONDS,
        tags: [DEPTH_CHART_CACHE_TAG],
      },
      headers: { Accept: "application/json" },
    });
    if (!response.ok) {
      throw new Error(`ESPN returned ${response.status}`);
    }
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

function collectRosterNames(data: unknown): Map<string, string> {
  const names = new Map<string, string>();

  function add(entry: unknown) {
    if (!isRecord(entry)) return;
    const id = asString(entry.id) ?? asNumber(entry.id)?.toString();
    const name =
      asString(entry.displayName) ?? asString(entry.fullName) ?? asString(entry.shortName);
    if (id && name) names.set(id, name);
  }

  const root = isRecord(data) ? data : {};
  const groups = Array.isArray(root.athletes) ? root.athletes : [];
  for (const group of groups) {
    if (isRecord(group) && Array.isArray(group.items)) {
      for (const item of group.items) add(item);
    } else {
      add(group);
    }
  }

  const team = isRecord(root.team) ? root.team : {};
  const roster = isRecord(team.roster) ? team.roster : {};
  const nested = Array.isArray(roster.athletes) ? roster.athletes : [];
  for (const group of nested) {
    if (isRecord(group) && Array.isArray(group.items)) {
      for (const item of group.items) add(item);
    } else {
      add(group);
    }
  }

  return names;
}

type RawSlot = { rank: number; name: string };

function collectPositions(
  data: unknown,
  roster: Map<string, string>,
): Map<string, { label: string; unitHint?: string; slots: RawSlot[] }> {
  const positions = new Map<string, { label: string; unitHint?: string; slots: RawSlot[] }>();

  function addSlot(codeRaw: string, label: string, unitHint: string | undefined, slot: RawSlot) {
    const code = codeRaw.toUpperCase();
    const existing = positions.get(code) ?? { label, unitHint, slots: [] };
    existing.slots.push(slot);
    positions.set(code, existing);
  }

  function walkPosition(code: string, block: unknown, unitHint?: string) {
    if (!isRecord(block)) return;
    const meta = isRecord(block.position) ? block.position : {};
    const abbr = (asString(meta.abbreviation) ?? code).toUpperCase();
    const label = positionLabel(abbr, asString(meta.displayName) ?? asString(meta.name));
    const athletes = Array.isArray(block.athletes) ? block.athletes : [];
    for (const athleteWrap of athletes) {
      if (!isRecord(athleteWrap)) continue;
      const rank = asNumber(athleteWrap.rank) ?? asNumber(athleteWrap.slot) ?? 99;
      const person = athleteWrap.athlete ?? athleteWrap;
      const name = athleteName(person, roster);
      if (!name) continue;
      addSlot(abbr, label, unitHint, { rank, name });
    }
  }

  const root = isRecord(data) ? data : {};
  const items = Array.isArray(root.items) ? root.items : Array.isArray(root) ? root : [root];

  for (const item of items) {
    if (!isRecord(item)) continue;
    const unitHint = asString(item.name) ?? asString(item.displayName);
    const posBlock = isRecord(item.positions) ? item.positions : item;
    for (const [key, value] of Object.entries(posBlock)) {
      if (key === "id" || key === "name" || key === "displayName") continue;
      walkPosition(key, value, unitHint);
    }
  }

  return positions;
}

function toUnits(
  positions: Map<string, { label: string; unitHint?: string; slots: RawSlot[] }>,
): DepthChartSuccess["units"] {
  const buckets: Record<DepthUnit, DepthRow[]> = {
    offence: [],
    defence: [],
    special: [],
  };

  for (const [code, entry] of positions) {
    const slots = [...entry.slots].sort((a, b) => a.rank - b.rank);
    const unique: RawSlot[] = [];
    for (const slot of slots) {
      if (unique.some((row) => row.name === slot.name)) continue;
      unique.push(slot);
    }
    const starter = unique[0]?.name;
    if (!starter) continue;
    buckets[classifyUnit(code, entry.unitHint)].push({
      code,
      label: entry.label,
      starter,
      nextUp: unique[1]?.name,
    });
  }

  const order = (rows: DepthRow[]) =>
    rows.sort((a, b) => a.label.localeCompare(b.label, "en-GB"));

  return (["offence", "defence", "special"] as const)
    .map((unit) => ({
      unit,
      heading: UNIT_HEADING[unit],
      rows: order(buckets[unit]),
    }))
    .filter((group) => group.rows.length > 0);
}

function rosterFallback(rosterData: unknown): DepthChartSuccess["units"] {
  const root = isRecord(rosterData) ? rosterData : {};
  const groups = Array.isArray(root.athletes) ? root.athletes : [];
  const positions = new Map<string, { label: string; unitHint?: string; slots: RawSlot[] }>();

  for (const group of groups) {
    if (!isRecord(group) || !Array.isArray(group.items)) continue;
    const unitHint = asString(group.position) ?? asString(group.name);
    for (const [index, item] of group.items.entries()) {
      if (!isRecord(item)) continue;
      const pos = isRecord(item.position) ? item.position : {};
      const code = (asString(pos.abbreviation) ?? "UNK").toUpperCase();
      const label = positionLabel(code, asString(pos.displayName));
      const name = asString(item.displayName) ?? asString(item.fullName);
      if (!name) continue;
      const existing = positions.get(code) ?? { label, unitHint, slots: [] };
      existing.slots.push({ rank: existing.slots.length + index, name });
      positions.set(code, existing);
    }
  }

  return toUnits(positions);
}

export async function getTeamDepthChart(abbreviation: string): Promise<DepthChartResult> {
  const fetchedAt = new Date().toISOString();
  const teamId = espnTeamId(abbreviation);
  if (!teamId) {
    return { ok: false, fetchedAt, error: "We do not have an ESPN team id for this club." };
  }

  const year = nflSeasonYear();

  try {
    const rosterUrl = `https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${teamId}/roster`;
    const chartUrl = `https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/${year}/teams/${teamId}/depthcharts`;

    const [rosterResult, chartResult] = await Promise.allSettled([
      fetchJson(rosterUrl),
      fetchJson(chartUrl),
    ]);

    const rosterData = rosterResult.status === "fulfilled" ? rosterResult.value : null;
    const chartData = chartResult.status === "fulfilled" ? chartResult.value : null;
    const roster = rosterData ? collectRosterNames(rosterData) : new Map<string, string>();

    let units: DepthChartSuccess["units"] = [];
    if (chartData) {
      units = toUnits(collectPositions(chartData, roster));
    }
    if (units.length === 0 && rosterData) {
      units = rosterFallback(rosterData);
    }

    if (units.length === 0) {
      return {
        ok: false,
        fetchedAt,
        error: "ESPN did not return a depth chart we could read just now.",
      };
    }

    return {
      ok: true,
      fetchedAt,
      seasonYear: year,
      source: "ESPN",
      units,
    };
  } catch (error) {
    const message =
      error instanceof Error && error.name === "AbortError"
        ? "The depth-chart feed timed out. Try again in a minute."
        : "We could not reach ESPN’s depth chart just now.";
    return { ok: false, fetchedAt, error: message };
  }
}
