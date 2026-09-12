export const FAN_MAP_PRIVACY_THRESHOLD_DEFAULT = 3;
export const NEARBY_MILES = 15;
export const HOTSPOT_RADII_MILES = [5, 10, 15, 20, 25] as const;
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;
export const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 12;
export const MIN_FORM_FILL_MS = 3000;
export const CREATE_RATE_MAX = 3;
export const UPDATE_RATE_MAX = 20;
export const REGISTER_RATE_WINDOW_MS = 60 * 60 * 1000;

export const SESSION_COOKIE = "fds-fan-session";
export const ADMIN_COOKIE = "fds-fan-admin";

export const NATIONS = [
  "Scotland",
  "England",
  "Wales",
  "Northern Ireland",
] as const;

export type UkNation = (typeof NATIONS)[number];

export const NATION_FILTERS = [
  { id: "Scotland", label: "Scotland" },
  { id: "UK", label: "United Kingdom" },
  { id: "England", label: "England" },
  { id: "Wales", label: "Wales" },
  { id: "Northern Ireland", label: "Northern Ireland" },
] as const;

export type NationFilterId = (typeof NATION_FILTERS)[number]["id"];

export const YEARS_FOLLOWING = [
  { id: "new", label: "New this season" },
  { id: "1-2", label: "1-2 years" },
  { id: "3-5", label: "3-5 years" },
  { id: "6-10", label: "6-10 years" },
  { id: "10+", label: "10+ years" },
] as const;

export type YearsFollowingId = (typeof YEARS_FOLLOWING)[number]["id"];

export const WATCH_PARTY = [
  { id: "yes", label: "Yes" },
  { id: "maybe", label: "Maybe" },
  { id: "no", label: "No" },
] as const;

export type WatchPartyId = (typeof WATCH_PARTY)[number]["id"];

export const UK_MAP_BOUNDS = {
  west: -9.6,
  south: 49.7,
  east: 2.1,
  north: 61.1,
} as const;

export const SCOTLAND_VIEW = {
  longitude: -4.2,
  latitude: 56.8,
  zoom: 5.6,
} as const;

export const UK_VIEW = {
  longitude: -3.4,
  latitude: 54.8,
  zoom: 4.7,
} as const;

export function privacyThreshold(): number {
  const raw = Number.parseInt(process.env.FAN_MAP_PRIVACY_THRESHOLD ?? "", 10);
  if (Number.isFinite(raw) && raw >= 1 && raw <= 20) return raw;
  return FAN_MAP_PRIVACY_THRESHOLD_DEFAULT;
}

export function isUkNation(value: string): value is UkNation {
  return (NATIONS as readonly string[]).includes(value);
}

export function isYearsFollowing(value: string): value is YearsFollowingId {
  return YEARS_FOLLOWING.some((option) => option.id === value);
}

export function isWatchParty(value: string): value is WatchPartyId {
  return WATCH_PARTY.some((option) => option.id === value);
}
