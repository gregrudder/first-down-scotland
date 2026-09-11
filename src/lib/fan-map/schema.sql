-- NFL UK Fan Map. Applied automatically on first DB use (CREATE IF NOT EXISTS).
-- Never store names, emails, postcodes, GPS traces, or free-text addresses.
-- Identity is a signed browser cookie (fan id), not an account.

CREATE TABLE IF NOT EXISTS fan_map_users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

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
  hidden_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS fan_map_reg_nation_idx
  ON fan_map_registrations (nation);
CREATE INDEX IF NOT EXISTS fan_map_reg_place_idx
  ON fan_map_registrations (place_id);
CREATE INDEX IF NOT EXISTS fan_map_reg_team_idx
  ON fan_map_registrations (team_abbreviation);
CREATE INDEX IF NOT EXISTS fan_map_reg_created_idx
  ON fan_map_registrations (created_at);

CREATE TABLE IF NOT EXISTS fan_map_flips (
  id TEXT PRIMARY KEY,
  place_id TEXT NOT NULL,
  town_city TEXT NOT NULL,
  nation TEXT NOT NULL,
  from_team TEXT,
  to_team TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS fan_map_flips_created_idx
  ON fan_map_flips (created_at DESC);
