import { getTeam } from "../../data/teams";
import { privacyThreshold } from "./constants";
import type { FanMapAggregateRow } from "./types";

export type TownLead = {
  leadingTeam: string | null;
  meets: boolean;
  fanCount: number;
};

export type FlipChange = {
  fromTeam: string | null;
  toTeam: string | null;
};

export function leadingTeamForTown(rows: FanMapAggregateRow[], placeId: string, threshold = privacyThreshold()): TownLead {
  const fans = rows.filter((row) => row.placeId === placeId);
  const counts = new Map<string, number>();
  for (const fan of fans) {
    counts.set(fan.teamAbbreviation, (counts.get(fan.teamAbbreviation) ?? 0) + 1);
  }
  const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const meets = fans.length >= threshold;
  return {
    leadingTeam: meets ? (ranked[0]?.[0] ?? null) : null,
    meets,
    fanCount: fans.length,
  };
}

export function detectFlip(before: TownLead, after: TownLead): FlipChange | null {
  if (before.leadingTeam === after.leadingTeam) return null;
  if (!before.meets && !after.meets) return null;
  return {
    fromTeam: before.leadingTeam,
    toTeam: after.leadingTeam,
  };
}

/** A = new owner, B = previous owner. TikTok-safe scheme banter — no weapons, gangs, or Old Firm. */
export const TAKEOVER_POOL = [
  "{A} just took {town} off the {B}. New firm in the scheme.",
  "{town}’s under new management — {A} run this scheme now. {B}, jog on.",
  "That’s the {A}’s scheme now. {town} used to be {B} turf.",
  "{A} moved in on {town}. {B} have been shuffled.",
  "{town} flipped — {A} walked the {B} out the scheme.",
  "🚨 {A} TAKE {TOWN} — {B} out the scheme",
  "SHOUT:{A} have taken {town} from the {B}",
  "{B} are on the run. {A} have took over {town}.",
  "The {B} take an L as their {town} scheme has been taken over by the {A}.",
] as const;

export const CLAIM_POOL = [
  "{A} just put {town} on the map. This scheme’s spoken for.",
  "{town} claimed — {A} are running it.",
  "Fresh turf: {A} have {town}.",
  "SHOUT:{A} have claimed {town}",
] as const;

export const LOSS_POOL = [
  "{B} scheme lost {town}. Nobody owns it yet.",
  "{B} take an L — {town} is back up for grabs.",
  "{B} are on the run out of {town}. Scheme vacant.",
] as const;

function shortName(abbreviation: string | null): string {
  if (!abbreviation) return "That side";
  return getTeam(abbreviation)?.shortName ?? abbreviation;
}

function possessive(name: string): string {
  return name.endsWith("s") ? `${name}’` : `${name}’s`;
}

/** Fill a Greg-approved template. {A} new owner, {B} previous, {TOWN} shouted. */
export function fillFlipTemplate(
  template: string,
  fromTeam: string | null,
  toTeam: string | null,
  townCity: string,
): string {
  const from = shortName(fromTeam);
  const to = shortName(toTeam);
  const shout = template.startsWith("SHOUT:");
  const text = template
    .replace(/^SHOUT:/, "")
    .replaceAll("{A}’s", possessive(to))
    .replaceAll("{B}’s", possessive(from))
    .replaceAll("{to}’s", possessive(to))
    .replaceAll("{from}’s", possessive(from))
    .replaceAll("{A}", to)
    .replaceAll("{B}", from)
    .replaceAll("{to}", to)
    .replaceAll("{from}", from)
    .replaceAll("{TOWN}", townCity.toUpperCase())
    .replaceAll("{town}", townCity);
  return shout ? text.toUpperCase() : text;
}

/** Always-on headline for the territory feed, e.g. PACKERS HAVE TAKEN MOTHERWELL FROM THE 49ERS. */
export function territoryHeadline(
  fromTeam: string | null,
  toTeam: string | null,
  townCity: string,
): string {
  const from = shortName(fromTeam).toUpperCase();
  const to = shortName(toTeam).toUpperCase();
  const town = townCity.toUpperCase();
  if (!fromTeam && toTeam) return `${to} HAVE CLAIMED ${town}`;
  if (fromTeam && !toTeam) return `${from} HAVE LOST ${town}`;
  return `${to} HAVE TAKEN ${town} FROM THE ${from}`;
}

function pick<T>(pool: readonly T[], seed: string): T {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash + seed.charCodeAt(i) * (i + 1)) % 997;
  return pool[hash % pool.length]!;
}

export function flipBanter(
  fromTeam: string | null,
  toTeam: string | null,
  townCity: string,
): string {
  const template = !fromTeam && toTeam
    ? pick(CLAIM_POOL, `${townCity}:${toTeam}`)
    : fromTeam && !toTeam
      ? pick(LOSS_POOL, `${townCity}:${fromTeam}`)
      : pick(TAKEOVER_POOL, `${townCity}:${fromTeam}:${toTeam}`);
  return fillFlipTemplate(template, fromTeam, toTeam, townCity);
}
