import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import { newId } from "@/lib/fan-map/crypto";
import {
  isUkNation,
  isWatchParty,
  isYearsFollowing,
  type UkNation,
  type WatchPartyId,
  type YearsFollowingId,
} from "@/lib/fan-map/constants";
import type {
  FanMapAggregateRow,
  FanMapPlace,
  FanMapRegistrationRow,
  SchemeFlip,
} from "@/lib/fan-map/types";

type Sql = NeonQueryFunction<false, false>;

function databaseUrl(): string | undefined {
  const candidates = [
    process.env.DATABASE_URL,
    process.env.POSTGRES_URL,
    process.env.POSTGRES_PRISMA_URL,
    process.env.POSTGRES_URL_NON_POOLING,
  ];
  for (const value of candidates) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return undefined;
}

export function isFanMapDbConfigured(): boolean {
  return Boolean(databaseUrl());
}

function sqlClient(): Sql {
  const url = databaseUrl();
  if (!url) {
    throw new Error("Fan map database is not configured");
  }
  return neon(url);
}

let schemaPromise: Promise<void> | null = null;

async function ensureSchema(sql: Sql): Promise<void> {
  if (!schemaPromise) {
    schemaPromise = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS fan_map_users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
      try {
        await sql`ALTER TABLE fan_map_users ALTER COLUMN email DROP NOT NULL`;
      } catch {
        // Already nullable, or a fresh table.
      }
      await sql`
        CREATE TABLE IF NOT EXISTS fan_map_flips (
          id TEXT PRIMARY KEY,
          place_id TEXT NOT NULL,
          town_city TEXT NOT NULL,
          nation TEXT NOT NULL,
          from_team TEXT,
          to_team TEXT,
          message TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
      await sql`CREATE INDEX IF NOT EXISTS fan_map_flips_created_idx ON fan_map_flips (created_at DESC)`;
      await sql`
        CREATE TABLE IF NOT EXISTS fan_map_registrations (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL UNIQUE REFERENCES fan_map_users(id) ON DELETE CASCADE,
          team_abbreviation TEXT NOT NULL,
          country TEXT NOT NULL,
          nation TEXT NOT NULL,
          region_or_council_area TEXT NOT NULL,
          town_city TEXT NOT NULL,
          place_id TEXT NOT NULL,
          place_label TEXT NOT NULL,
          approx_latitude DOUBLE PRECISION NOT NULL,
          approx_longitude DOUBLE PRECISION NOT NULL,
          years_following TEXT,
          watch_party_interest TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
      await sql`CREATE INDEX IF NOT EXISTS fan_map_reg_nation_idx ON fan_map_registrations (nation)`;
      await sql`CREATE INDEX IF NOT EXISTS fan_map_reg_place_idx ON fan_map_registrations (place_id)`;
      await sql`CREATE INDEX IF NOT EXISTS fan_map_reg_team_idx ON fan_map_registrations (team_abbreviation)`;
      await sql`CREATE INDEX IF NOT EXISTS fan_map_reg_created_idx ON fan_map_registrations (created_at)`;
    })().catch((error) => {
      schemaPromise = null;
      throw error;
    });
  }
  await schemaPromise;
}

async function withSql<T>(work: (sql: Sql) => Promise<T>): Promise<T> {
  const sql = sqlClient();
  await ensureSchema(sql);
  return work(sql);
}

export async function findOrCreateFan(fanId: string): Promise<string> {
  return withSql(async (sql) => {
    const existing = (await sql`
      SELECT id FROM fan_map_users WHERE id = ${fanId} LIMIT 1
    `) as Array<{ id: string }>;
    if (existing[0]) return existing[0].id;
    await sql`
      INSERT INTO fan_map_users (id)
      VALUES (${fanId})
      ON CONFLICT (id) DO NOTHING
    `;
    return fanId;
  });
}

function mapRegistration(row: Record<string, unknown>): FanMapRegistrationRow | null {
  const nation = typeof row.nation === "string" && isUkNation(row.nation) ? row.nation : null;
  if (!nation) return null;
  const years =
    typeof row.years_following === "string" && isYearsFollowing(row.years_following)
      ? row.years_following
      : null;
  const watch =
    typeof row.watch_party_interest === "string" && isWatchParty(row.watch_party_interest)
      ? row.watch_party_interest
      : null;
  return {
    id: String(row.id),
    userId: String(row.user_id),
    teamAbbreviation: String(row.team_abbreviation),
    country: String(row.country),
    nation,
    regionOrCouncilArea: String(row.region_or_council_area),
    townCity: String(row.town_city),
    placeId: String(row.place_id),
    placeLabel: String(row.place_label),
    latitude: Number(row.approx_latitude),
    longitude: Number(row.approx_longitude),
    yearsFollowing: years,
    watchPartyInterest: watch,
    createdAt: new Date(String(row.created_at)).toISOString(),
    updatedAt: new Date(String(row.updated_at)).toISOString(),
  };
}

export async function getRegistrationForUser(userId: string): Promise<FanMapRegistrationRow | null> {
  return withSql(async (sql) => {
    const rows = (await sql`
      SELECT *
      FROM fan_map_registrations
      WHERE user_id = ${userId}
      LIMIT 1
    `) as Array<Record<string, unknown>>;
    return rows[0] ? mapRegistration(rows[0]) : null;
  });
}

export async function upsertRegistration(input: {
  userId: string;
  teamAbbreviation: string;
  place: FanMapPlace;
  yearsFollowing: YearsFollowingId | null;
  watchPartyInterest: WatchPartyId | null;
}): Promise<FanMapRegistrationRow> {
  return withSql(async (sql) => {
    const existing = (await sql`
      SELECT id FROM fan_map_registrations WHERE user_id = ${input.userId} LIMIT 1
    `) as Array<{ id: string }>;
    const id = existing[0]?.id ?? newId();
    const rows = (await sql`
      INSERT INTO fan_map_registrations (
        id, user_id, team_abbreviation, country, nation, region_or_council_area,
        town_city, place_id, place_label, approx_latitude, approx_longitude,
        years_following, watch_party_interest, created_at, updated_at
      )
      VALUES (
        ${id}, ${input.userId}, ${input.teamAbbreviation}, ${input.place.country},
        ${input.place.nation}, ${input.place.regionOrCouncilArea}, ${input.place.townCity},
        ${input.place.placeId}, ${input.place.label}, ${input.place.latitude},
        ${input.place.longitude}, ${input.yearsFollowing}, ${input.watchPartyInterest},
        now(), now()
      )
      ON CONFLICT (user_id) DO UPDATE SET
        team_abbreviation = EXCLUDED.team_abbreviation,
        country = EXCLUDED.country,
        nation = EXCLUDED.nation,
        region_or_council_area = EXCLUDED.region_or_council_area,
        town_city = EXCLUDED.town_city,
        place_id = EXCLUDED.place_id,
        place_label = EXCLUDED.place_label,
        approx_latitude = EXCLUDED.approx_latitude,
        approx_longitude = EXCLUDED.approx_longitude,
        years_following = EXCLUDED.years_following,
        watch_party_interest = EXCLUDED.watch_party_interest,
        updated_at = now()
      RETURNING *
    `) as Array<Record<string, unknown>>;
    const mapped = mapRegistration(rows[0]!);
    if (!mapped) throw new Error("Could not save that registration.");
    return mapped;
  });
}

function mapAggregate(row: Record<string, unknown>): FanMapAggregateRow | null {
  const nation = typeof row.nation === "string" && isUkNation(row.nation) ? row.nation : null;
  if (!nation) return null;
  return {
    teamAbbreviation: String(row.team_abbreviation),
    nation,
    regionOrCouncilArea: String(row.region_or_council_area),
    townCity: String(row.town_city),
    placeId: String(row.place_id),
    placeLabel: String(row.place_label),
    latitude: Number(row.approx_latitude),
    longitude: Number(row.approx_longitude),
    yearsFollowing:
      typeof row.years_following === "string" && isYearsFollowing(row.years_following)
        ? row.years_following
        : null,
    watchPartyInterest:
      typeof row.watch_party_interest === "string" && isWatchParty(row.watch_party_interest)
        ? row.watch_party_interest
        : null,
    createdAt: new Date(String(row.created_at)).toISOString(),
  };
}

export async function insertFlip(input: {
  placeId: string;
  townCity: string;
  nation: UkNation;
  fromTeam: string | null;
  toTeam: string | null;
  message: string;
}): Promise<void> {
  await withSql(async (sql) => {
    await sql`
      INSERT INTO fan_map_flips (
        id, place_id, town_city, nation, from_team, to_team, message, created_at
      )
      VALUES (
        ${newId()}, ${input.placeId}, ${input.townCity}, ${input.nation},
        ${input.fromTeam}, ${input.toTeam}, ${input.message}, now()
      )
    `;
  });
}

export async function listFlips(limit = 24): Promise<SchemeFlip[]> {
  return withSql(async (sql) => {
    const rows = (await sql`
      SELECT id, place_id, town_city, nation, from_team, to_team, message, created_at
      FROM fan_map_flips
      ORDER BY created_at DESC
      LIMIT ${limit}
    `) as Array<Record<string, unknown>>;
    return rows
      .map((row) => {
        const nation = typeof row.nation === "string" && isUkNation(row.nation) ? row.nation : null;
        if (!nation) return null;
        return {
          id: String(row.id),
          placeId: String(row.place_id),
          townCity: String(row.town_city),
          nation,
          fromTeam: row.from_team ? String(row.from_team) : null,
          toTeam: row.to_team ? String(row.to_team) : null,
          message: String(row.message),
          createdAt: new Date(String(row.created_at)).toISOString(),
        } satisfies SchemeFlip;
      })
      .filter((row): row is SchemeFlip => Boolean(row));
  });
}

export async function listAggregateRows(): Promise<FanMapAggregateRow[]> {
  return withSql(async (sql) => {
    const rows = (await sql`
      SELECT
        team_abbreviation, nation, region_or_council_area, town_city, place_id,
        place_label, approx_latitude, approx_longitude, years_following,
        watch_party_interest, created_at
      FROM fan_map_registrations
    `) as Array<Record<string, unknown>>;
    return rows.map(mapAggregate).filter((row): row is FanMapAggregateRow => Boolean(row));
  });
}

export type { UkNation };
