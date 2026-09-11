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

const TAKEOVERS = [
  "SHOUT:{to} have taken {town} from the {from}",
  "{to} took over {town}. {from} are on the run.",
  "{from} take an L. {to} scheme taken over {town}.",
  "Scheme battle: {to} have {town}. {from} on the run.",
  "{to} scheme taken over {town}. {from} can take an L.",
  "{town} flipped. {to} took over; {from} are on the run.",
  "{from} just took an L in {town}. {to} scheme is in.",
  "{to} ran the scheme in {town}. {from} on the run.",
  "Takeover in {town}: {to} took over. {from} take an L.",
];

const CLAIMS = [
  "SHOUT:{to} have claimed {town}",
  "{to} scheme has claimed {town}.",
  "{to} planted their scheme in {town}.",
  "{town} is on the map — {to} took over first.",
  "New scheme in {town}: {to} have it.",
];

const LOSSES = [
  "{from} scheme lost {town}. Nobody owns it yet.",
  "{from} take an L — {town} is back up for grabs.",
  "{from} are on the run out of {town}. Scheme vacant.",
];

function shortName(abbreviation: string | null): string {
  if (!abbreviation) return "That side";
  return getTeam(abbreviation)?.shortName ?? abbreviation;
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

function pick<T>(pool: T[], seed: string): T {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash + seed.charCodeAt(i) * (i + 1)) % 997;
  return pool[hash % pool.length]!;
}

export function flipBanter(
  fromTeam: string | null,
  toTeam: string | null,
  townCity: string,
): string {
  const from = shortName(fromTeam);
  const to = shortName(toTeam);
  const template = !fromTeam && toTeam
    ? pick(CLAIMS, `${townCity}:${toTeam}`)
    : fromTeam && !toTeam
      ? pick(LOSSES, `${townCity}:${fromTeam}`)
      : pick(TAKEOVERS, `${townCity}:${fromTeam}:${toTeam}`);
  const shout = template.startsWith("SHOUT:");
  const text = template
    .replace(/^SHOUT:/, "")
    .replaceAll("{from}", from)
    .replaceAll("{to}", to)
    .replaceAll("{town}", townCity);
  return shout ? text.toUpperCase() : text;
}
