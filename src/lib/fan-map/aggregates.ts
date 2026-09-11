import { getTeam } from "../../data/teams";
import {
  NATIONS,
  NEARBY_MILES,
  YEARS_FOLLOWING,
  type UkNation,
} from "./constants";
import { haversineMiles } from "./geo";
import type {
  AdminStats,
  FanMapAggregateRow,
  HotspotResult,
  PublicFanMap,
  PublicTown,
  TeamCount,
} from "./types";

function teamMeta(abbreviation: string): Pick<TeamCount, "abbreviation" | "name" | "shortName" | "primary" | "secondary"> | null {
  const team = getTeam(abbreviation);
  if (!team) return null;
  return {
    abbreviation: team.abbreviation,
    name: team.name,
    shortName: team.shortName,
    primary: team.primary,
    secondary: team.secondary,
  };
}

function toTeamCounts(counts: Map<string, number>, total: number): TeamCount[] {
  return [...counts.entries()]
    .map(([abbreviation, count]) => {
      const meta = teamMeta(abbreviation);
      if (!meta) return null;
      return {
        ...meta,
        count,
        percent: total > 0 ? Math.round((count / total) * 1000) / 10 : 0,
      };
    })
    .filter((row): row is TeamCount => Boolean(row))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "en-GB"));
}

function emptyPublic(configured: boolean, threshold: number, generatedAt = new Date().toISOString()): PublicFanMap {
  return {
    configured,
    privacyThreshold: threshold,
    generatedAt,
    counters: { fans: 0, towns: 0, teams: 0 },
    nations: NATIONS.map((id) => ({ id, label: id, fans: 0, towns: 0 })),
    leaderboards: { scotland: [], uk: [] },
    whoOwnsScotland: { owner: null, townsLed: [], towns: [] },
    towns: [],
    councils: [],
    schemeBattles: { scotlandTownsOwned: [], ukTownsOwned: [], flips: [] },
  };
}

type TownBucket = {
  placeId: string;
  townCity: string;
  nation: UkNation;
  regionOrCouncilArea: string;
  latitude: number;
  longitude: number;
  fans: FanMapAggregateRow[];
};

function groupTowns(rows: FanMapAggregateRow[]): TownBucket[] {
  const map = new Map<string, TownBucket>();
  for (const row of rows) {
    const current = map.get(row.placeId);
    if (current) {
      current.fans.push(row);
      continue;
    }
    map.set(row.placeId, {
      placeId: row.placeId,
      townCity: row.townCity,
      nation: row.nation,
      regionOrCouncilArea: row.regionOrCouncilArea,
      latitude: row.latitude,
      longitude: row.longitude,
      fans: [row],
    });
  }
  return [...map.values()];
}

function townTeamCounts(bucket: TownBucket, threshold: number): {
  teams: TeamCount[] | null;
  leadingTeam: TeamCount | null;
  meetsPrivacyThreshold: boolean;
} {
  const counts = new Map<string, number>();
  for (const fan of bucket.fans) {
    counts.set(fan.teamAbbreviation, (counts.get(fan.teamAbbreviation) ?? 0) + 1);
  }
  const teams = toTeamCounts(counts, bucket.fans.length);
  const meets = bucket.fans.length >= threshold;
  return {
    teams: meets ? teams : null,
    leadingTeam: meets ? (teams[0] ?? null) : null,
    meetsPrivacyThreshold: meets,
  };
}

export function buildPublicFanMap(
  rows: FanMapAggregateRow[],
  threshold: number,
  configured = true,
): PublicFanMap {
  if (rows.length === 0) return emptyPublic(configured, threshold);

  const buckets = groupTowns(rows);
  const publicTowns: PublicTown[] = buckets.map((bucket) => {
    const breakdown = townTeamCounts(bucket, threshold);
    const nearby = buckets
      .filter((other) => other.placeId !== bucket.placeId)
      .map((other) => ({
        placeId: other.placeId,
        townCity: other.townCity,
        nation: other.nation,
        miles: Math.round(haversineMiles(bucket.latitude, bucket.longitude, other.latitude, other.longitude) * 10) / 10,
        fanCount: other.fans.length,
      }))
      .filter((item) => item.miles <= NEARBY_MILES)
      .sort((a, b) => a.miles - b.miles || b.fanCount - a.fanCount)
      .slice(0, 6);

    const fansWithin15Miles = buckets
      .filter(
        (other) =>
          haversineMiles(bucket.latitude, bucket.longitude, other.latitude, other.longitude) <=
          NEARBY_MILES,
      )
      .reduce((sum, other) => sum + other.fans.length, 0);

    return {
      placeId: bucket.placeId,
      townCity: bucket.townCity,
      nation: bucket.nation,
      regionOrCouncilArea: bucket.regionOrCouncilArea,
      latitude: bucket.latitude,
      longitude: bucket.longitude,
      fanCount: bucket.fans.length,
      watchPartyYes: bucket.fans.filter((fan) => fan.watchPartyInterest === "yes").length,
      watchPartyMaybe: bucket.fans.filter((fan) => fan.watchPartyInterest === "maybe").length,
      teams: breakdown.teams,
      leadingTeam: breakdown.leadingTeam,
      nearby,
      fansWithin15Miles,
      meetsPrivacyThreshold: breakdown.meetsPrivacyThreshold,
    };
  });

  publicTowns.sort((a, b) => b.fanCount - a.fanCount || a.townCity.localeCompare(b.townCity, "en-GB"));

  const nationTownSets = new Map<UkNation, Set<string>>();
  const nationFanCounts = new Map<UkNation, number>();
  for (const nation of NATIONS) {
    nationTownSets.set(nation, new Set());
    nationFanCounts.set(nation, 0);
  }
  for (const town of publicTowns) {
    nationTownSets.get(town.nation)?.add(town.placeId);
    nationFanCounts.set(town.nation, (nationFanCounts.get(town.nation) ?? 0) + town.fanCount);
  }

  const scotlandRows = rows.filter((row) => row.nation === "Scotland");
  const ukCounts = new Map<string, number>();
  const scotlandCounts = new Map<string, number>();
  for (const row of rows) {
    ukCounts.set(row.teamAbbreviation, (ukCounts.get(row.teamAbbreviation) ?? 0) + 1);
    if (row.nation === "Scotland") {
      scotlandCounts.set(row.teamAbbreviation, (scotlandCounts.get(row.teamAbbreviation) ?? 0) + 1);
    }
  }

  const whoTowns = publicTowns
    .filter((town) => town.nation === "Scotland" && town.leadingTeam)
    .map((town) => ({
      placeId: town.placeId,
      townCity: town.townCity,
      regionOrCouncilArea: town.regionOrCouncilArea,
      fanCount: town.fanCount,
      leadingTeam: town.leadingTeam!,
      latitude: town.latitude,
      longitude: town.longitude,
    }));

  const ledCounts = new Map<string, { fans: number; towns: number }>();
  for (const town of whoTowns) {
    const current = ledCounts.get(town.leadingTeam.abbreviation) ?? { fans: 0, towns: 0 };
    current.towns += 1;
    current.fans += town.fanCount;
    ledCounts.set(town.leadingTeam.abbreviation, current);
  }

  const townsLed = [...ledCounts.entries()]
    .map(([abbreviation, value]) => {
      const meta = teamMeta(abbreviation);
      if (!meta) return null;
      return {
        ...meta,
        count: value.fans,
        percent: whoTowns.length > 0 ? Math.round((value.towns / whoTowns.length) * 1000) / 10 : 0,
        townCount: value.towns,
      };
    })
    .filter((row): row is TeamCount & { townCount: number } => Boolean(row))
    .sort((a, b) => b.townCount - a.townCount || b.count - a.count || a.name.localeCompare(b.name, "en-GB"));

  const ukOwnedTowns = publicTowns.filter((town) => town.leadingTeam);
  const ukLedCounts = new Map<string, { fans: number; towns: number }>();
  for (const town of ukOwnedTowns) {
    const abbr = town.leadingTeam!.abbreviation;
    const current = ukLedCounts.get(abbr) ?? { fans: 0, towns: 0 };
    current.towns += 1;
    current.fans += town.fanCount;
    ukLedCounts.set(abbr, current);
  }
  const ukTownsLed = [...ukLedCounts.entries()]
    .map(([abbreviation, value]) => {
      const meta = teamMeta(abbreviation);
      if (!meta) return null;
      return {
        ...meta,
        count: value.fans,
        percent: ukOwnedTowns.length > 0 ? Math.round((value.towns / ukOwnedTowns.length) * 1000) / 10 : 0,
        townCount: value.towns,
      };
    })
    .filter((row): row is TeamCount & { townCount: number } => Boolean(row))
    .sort((a, b) => b.townCount - a.townCount || b.count - a.count || a.name.localeCompare(b.name, "en-GB"));

  const councilMap = new Map<
    string,
    { regionOrCouncilArea: string; nation: UkNation; fans: FanMapAggregateRow[]; towns: Set<string> }
  >();
  for (const row of rows) {
    const key = `${row.nation}::${row.regionOrCouncilArea}`;
    const current = councilMap.get(key) ?? {
      regionOrCouncilArea: row.regionOrCouncilArea,
      nation: row.nation,
      fans: [],
      towns: new Set<string>(),
    };
    current.fans.push(row);
    current.towns.add(row.placeId);
    councilMap.set(key, current);
  }

  const councils = [...councilMap.values()]
    .map((council) => {
      const counts = new Map<string, number>();
      for (const fan of council.fans) {
        counts.set(fan.teamAbbreviation, (counts.get(fan.teamAbbreviation) ?? 0) + 1);
      }
      const meets = council.fans.length >= threshold;
      return {
        regionOrCouncilArea: council.regionOrCouncilArea,
        nation: council.nation,
        fanCount: council.fans.length,
        townCount: council.towns.size,
        teams: meets ? toTeamCounts(counts, council.fans.length) : null,
      };
    })
    .sort((a, b) => b.fanCount - a.fanCount || a.regionOrCouncilArea.localeCompare(b.regionOrCouncilArea, "en-GB"));

  return {
    configured,
    privacyThreshold: threshold,
    generatedAt: new Date().toISOString(),
    counters: {
      fans: rows.length,
      towns: publicTowns.length,
      teams: new Set(rows.map((row) => row.teamAbbreviation)).size,
    },
    nations: NATIONS.map((id) => ({
      id,
      label: id,
      fans: nationFanCounts.get(id) ?? 0,
      towns: nationTownSets.get(id)?.size ?? 0,
    })),
    leaderboards: {
      scotland: toTeamCounts(scotlandCounts, scotlandRows.length),
      uk: toTeamCounts(ukCounts, rows.length),
    },
    whoOwnsScotland: {
      owner: toTeamCounts(scotlandCounts, scotlandRows.length)[0] ?? null,
      townsLed,
      towns: whoTowns,
    },
    towns: publicTowns,
    councils,
    schemeBattles: {
      scotlandTownsOwned: townsLed,
      ukTownsOwned: ukTownsLed,
      flips: [],
    },
  };
}

export function emptyPublicFanMap(configured: boolean, threshold: number): PublicFanMap {
  return emptyPublic(configured, threshold);
}

export function buildAdminStats(rows: FanMapAggregateRow[], threshold: number, configured = true): AdminStats {
  const publicMap = buildPublicFanMap(rows, threshold, configured);
  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const byDayMap = new Map<string, number>();
  for (let i = 29; i >= 0; i -= 1) {
    const day = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const key = day.toISOString().slice(0, 10);
    byDayMap.set(key, 0);
  }
  for (const row of rows) {
    const key = row.createdAt.slice(0, 10);
    if (byDayMap.has(key)) byDayMap.set(key, (byDayMap.get(key) ?? 0) + 1);
  }

  const years = YEARS_FOLLOWING.map((option) => ({
    id: option.id,
    label: option.label,
    count: rows.filter((row) => row.yearsFollowing === option.id).length,
  }));

  return {
    configured,
    privacyThreshold: threshold,
    totals: {
      fans: publicMap.counters.fans,
      towns: publicMap.counters.towns,
      teams: publicMap.counters.teams,
      councils: publicMap.councils.length,
      watchPartyYes: rows.filter((row) => row.watchPartyInterest === "yes").length,
      watchPartyMaybe: rows.filter((row) => row.watchPartyInterest === "maybe").length,
      watchPartyNo: rows.filter((row) => row.watchPartyInterest === "no").length,
      watchPartyUnset: rows.filter((row) => !row.watchPartyInterest).length,
    },
    growth: {
      today: rows.filter((row) => new Date(row.createdAt) >= startOfToday).length,
      week: rows.filter((row) => new Date(row.createdAt) >= weekAgo).length,
      month: rows.filter((row) => new Date(row.createdAt) >= monthAgo).length,
      byDay: [...byDayMap.entries()].map(([date, count]) => ({ date, count })),
    },
    byNation: publicMap.nations.map((nation) => ({
      nation: nation.id,
      fans: nation.fans,
      towns: nation.towns,
    })),
    byTeam: publicMap.leaderboards.uk,
    byTown: publicMap.towns.map((town) => ({
      placeId: town.placeId,
      townCity: town.townCity,
      nation: town.nation,
      regionOrCouncilArea: town.regionOrCouncilArea,
      fanCount: town.fanCount,
      latitude: town.latitude,
      longitude: town.longitude,
      teams: town.teams ?? [],
    })),
    byCouncil: publicMap.councils.map((council) => ({
      regionOrCouncilArea: council.regionOrCouncilArea,
      nation: council.nation,
      fanCount: council.fanCount,
      townCount: council.townCount,
    })),
    largestCommunities: publicMap.towns.slice(0, 12).map((town) => ({
      placeId: town.placeId,
      townCity: town.townCity,
      nation: town.nation,
      fanCount: town.fanCount,
    })),
    yearsFollowing: years,
  };
}

export function buildHotspot(
  rows: FanMapAggregateRow[],
  placeId: string,
  miles: number,
): HotspotResult | null {
  const centreRow = rows.find((row) => row.placeId === placeId);
  if (!centreRow) return null;

  const inRadius = rows.filter(
    (row) =>
      haversineMiles(centreRow.latitude, centreRow.longitude, row.latitude, row.longitude) <= miles,
  );
  const counts = new Map<string, number>();
  const townMap = new Map<string, { placeId: string; townCity: string; nation: UkNation; miles: number; fans: number }>();
  for (const row of inRadius) {
    counts.set(row.teamAbbreviation, (counts.get(row.teamAbbreviation) ?? 0) + 1);
    const existing = townMap.get(row.placeId);
    const distance =
      Math.round(
        haversineMiles(centreRow.latitude, centreRow.longitude, row.latitude, row.longitude) * 10,
      ) / 10;
    if (existing) {
      existing.fans += 1;
    } else {
      townMap.set(row.placeId, {
        placeId: row.placeId,
        townCity: row.townCity,
        nation: row.nation,
        miles: distance,
        fans: 1,
      });
    }
  }

  return {
    centre: {
      placeId: centreRow.placeId,
      townCity: centreRow.townCity,
      nation: centreRow.nation,
      latitude: centreRow.latitude,
      longitude: centreRow.longitude,
    },
    miles,
    fans: inRadius.length,
    towns: townMap.size,
    teams: toTeamCounts(counts, inRadius.length),
    nearbyTowns: [...townMap.values()]
      .map((town) => ({
        placeId: town.placeId,
        townCity: town.townCity,
        nation: town.nation,
        miles: town.miles,
        fanCount: town.fans,
      }))
      .sort((a, b) => a.miles - b.miles || b.fanCount - a.fanCount),
  };
}

export function adminTablesToCsv(stats: AdminStats): string {
  const lines = [
    "section,key,nation,count,percent",
    ...stats.byTeam.map(
      (team) =>
        `team,${csv(team.abbreviation)},UK,${team.count},${team.percent}`,
    ),
    ...stats.byNation.map((nation) => `nation,${csv(nation.nation)},${csv(nation.nation)},${nation.fans},`),
    ...stats.byTown.map(
      (town) =>
        `town,${csv(town.townCity)},${csv(town.nation)},${town.fanCount},`,
    ),
    ...stats.byCouncil.map(
      (council) =>
        `council,${csv(council.regionOrCouncilArea)},${csv(council.nation)},${council.fanCount},`,
    ),
    ...stats.growth.byDay.map((day) => `growth,${day.date},,${day.count},`),
  ];
  return `${lines.join("\n")}\n`;
}

function csv(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replaceAll('"', '""')}"`;
  return value;
}
