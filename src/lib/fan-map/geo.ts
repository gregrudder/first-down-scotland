import { isUkNation, type UkNation } from "./constants";

const EARTH_RADIUS_MILES = 3958.8;

export function haversineMiles(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_MILES * Math.asin(Math.min(1, Math.sqrt(a)));
}

export function nationFromParts(parts: {
  country?: string;
  countryCode?: string;
  state?: string;
  county?: string;
  city?: string;
  name?: string;
}): UkNation | null {
  const hay = [parts.state, parts.county, parts.country, parts.name, parts.city]
    .filter(Boolean)
    .join(" | ");

  if (/northern\s*ireland|\bulster\b/i.test(hay)) return "Northern Ireland";
  if (/\bscotland\b|\balba\b/i.test(hay)) return "Scotland";
  if (/\bwales\b|\bcymru\b/i.test(hay)) return "Wales";
  if (/\bengland\b/i.test(hay)) return "England";

  const code = (parts.countryCode ?? "").toUpperCase();
  const country = parts.country ?? "";
  const inUk =
    code === "GB" ||
    code === "UK" ||
    /united kingdom|great britain|britain/i.test(country);
  if (!inUk) return null;

  // Some geocoders only return "United Kingdom" plus an English county.
  if (parts.county || parts.state) return "England";
  return null;
}

export function assertUkNation(value: string): UkNation {
  if (isUkNation(value)) return value;
  throw new Error("That place is not in the UK.");
}

export function isFiniteCoordinate(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function roundCoord(value: number): number {
  return Math.round(value * 10_000) / 10_000;
}
