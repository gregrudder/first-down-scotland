import { siteUserAgent } from "@/lib/site";
import { NATIONS, UK_MAP_BOUNDS, type UkNation } from "@/lib/fan-map/constants";
import { isFiniteCoordinate, nationFromParts, roundCoord } from "@/lib/fan-map/geo";
import type { FanMapPlace } from "@/lib/fan-map/types";

const ALLOWED_PLACE_VALUES = new Set([
  "city",
  "town",
  "village",
  "hamlet",
  "suburb",
  "locality",
  "municipality",
  "city_district",
  "neighbourhood",
]);

const REJECT_VALUES = new Set([
  "house",
  "housenumber",
  "street",
  "road",
  "postcode",
  "postal_code",
  "building",
  "address",
]);

type CacheEntry = { at: number; places: FanMapPlace[] };
const cache = new Map<string, CacheEntry>();
const CACHE_MS = 10 * 60 * 1000;

function cacheKey(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, " ");
}

function inUkBounds(lat: number, lng: number): boolean {
  return (
    lat >= UK_MAP_BOUNDS.south &&
    lat <= UK_MAP_BOUNDS.north &&
    lng >= UK_MAP_BOUNDS.west &&
    lng <= UK_MAP_BOUNDS.east
  );
}

function finishPlace(partial: {
  placeId: string;
  label: string;
  nation: UkNation | null;
  regionOrCouncilArea: string;
  townCity: string;
  latitude: number;
  longitude: number;
}): FanMapPlace | null {
  if (!partial.nation) return null;
  if (!partial.townCity || !partial.regionOrCouncilArea) return null;
  if (!inUkBounds(partial.latitude, partial.longitude)) return null;
  return {
    placeId: partial.placeId,
    label: partial.label,
    country: "United Kingdom",
    nation: partial.nation,
    regionOrCouncilArea: partial.regionOrCouncilArea,
    townCity: partial.townCity,
    latitude: roundCoord(partial.latitude),
    longitude: roundCoord(partial.longitude),
  };
}

function dedupe(places: FanMapPlace[]): FanMapPlace[] {
  const seen = new Set<string>();
  const out: FanMapPlace[] = [];
  for (const place of places) {
    const key = `${place.nation}:${place.townCity.toLowerCase()}:${place.regionOrCouncilArea.toLowerCase()}`;
    if (seen.has(key) || seen.has(place.placeId)) continue;
    seen.add(key);
    seen.add(place.placeId);
    out.push(place);
  }
  return out.slice(0, 8);
}

async function fromGeoapify(query: string, apiKey: string): Promise<FanMapPlace[]> {
  const url = new URL("https://api.geoapify.com/v1/geocode/autocomplete");
  url.searchParams.set("text", query);
  url.searchParams.set("filter", "countrycode:gb");
  url.searchParams.set("type", "city");
  url.searchParams.set("limit", "8");
  url.searchParams.set("lang", "en");
  url.searchParams.set("format", "json");
  url.searchParams.set("apiKey", apiKey);

  const response = await fetch(url, {
    headers: { Accept: "application/json", "User-Agent": siteUserAgent() },
    next: { revalidate: 300 },
  });
  if (!response.ok) throw new Error(`Geoapify ${response.status}`);
  const json = (await response.json()) as {
    results?: Array<{
      place_id?: string;
      formatted?: string;
      city?: string;
      town?: string;
      village?: string;
      hamlet?: string;
      suburb?: string;
      county?: string;
      state?: string;
      country?: string;
      country_code?: string;
      lat?: number;
      lon?: number;
      result_type?: string;
    }>;
  };

  return (json.results ?? [])
    .map((item) => {
      if (item.result_type && REJECT_VALUES.has(item.result_type)) return null;
      const town =
        item.city || item.town || item.village || item.hamlet || item.suburb || "";
      const region = item.county || item.state || item.country || "";
      if (!isFiniteCoordinate(item.lat) || !isFiniteCoordinate(item.lon)) return null;
      return finishPlace({
        placeId: `geoapify:${item.place_id ?? `${town}:${item.lat}:${item.lon}`}`,
        label: item.formatted || `${town}, ${region}`,
        nation: nationFromParts({
          country: item.country,
          countryCode: item.country_code,
          state: item.state,
          county: item.county,
          city: town,
          name: town,
        }),
        regionOrCouncilArea: region,
        townCity: town,
        latitude: item.lat,
        longitude: item.lon,
      });
    })
    .filter((place): place is FanMapPlace => Boolean(place));
}

async function fromPhoton(query: string): Promise<FanMapPlace[]> {
  const url = new URL("https://photon.komoot.io/api/");
  url.searchParams.set("q", query);
  url.searchParams.set("limit", "12");
  url.searchParams.set("lang", "en");
  url.searchParams.set(
    "bbox",
    `${UK_MAP_BOUNDS.west},${UK_MAP_BOUNDS.south},${UK_MAP_BOUNDS.east},${UK_MAP_BOUNDS.north}`,
  );
  return fetchPhoton(url);
}

async function fetchPhoton(url: URL): Promise<FanMapPlace[]> {
  const response = await fetch(url, {
    headers: { Accept: "application/json", "User-Agent": siteUserAgent() },
    next: { revalidate: 300 },
  });
  if (!response.ok) throw new Error(`Photon ${response.status}`);
  const json = (await response.json()) as {
    features?: Array<{
      geometry?: { coordinates?: number[] };
      properties?: {
        osm_id?: number;
        osm_type?: string;
        osm_key?: string;
        osm_value?: string;
        name?: string;
        country?: string;
        countrycode?: string;
        state?: string;
        county?: string;
        city?: string;
        district?: string;
        locality?: string;
        type?: string;
      };
    }>;
  };

  return (json.features ?? [])
    .map((feature) => {
      const props = feature.properties ?? {};
      const coords = feature.geometry?.coordinates;
      const lng = coords?.[0];
      const lat = coords?.[1];
      if (!isFiniteCoordinate(lat) || !isFiniteCoordinate(lng)) return null;
      const value = (props.osm_value || props.type || "").toLowerCase();
      if (REJECT_VALUES.has(value)) return null;
      if (value && !ALLOWED_PLACE_VALUES.has(value) && props.osm_key !== "place") return null;
      const town = props.name || props.city || props.locality || props.district || "";
      const region = props.county || props.state || props.district || props.city || "";
      return finishPlace({
        placeId: `photon:${props.osm_type ?? "N"}:${props.osm_id ?? `${town}:${lat}:${lng}`}`,
        label: [town, region, nationFromParts({
          country: props.country,
          countryCode: props.countrycode,
          state: props.state,
          county: props.county,
          city: props.city,
          name: props.name,
        })].filter(Boolean).join(", "),
        nation: nationFromParts({
          country: props.country,
          countryCode: props.countrycode,
          state: props.state,
          county: props.county,
          city: props.city,
          name: props.name,
        }),
        regionOrCouncilArea: region === town ? (props.state || region) : region,
        townCity: town,
        latitude: lat,
        longitude: lng,
      });
    })
    .filter((place): place is FanMapPlace => Boolean(place));
}

async function fromNominatim(query: string): Promise<FanMapPlace[]> {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", query);
  url.searchParams.set("countrycodes", "gb");
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("limit", "8");
  url.searchParams.set("featureType", "settlement");

  const response = await fetch(url, {
    headers: { Accept: "application/json", "User-Agent": siteUserAgent() },
    next: { revalidate: 300 },
  });
  if (!response.ok) throw new Error(`Nominatim ${response.status}`);
  const json = (await response.json()) as Array<{
    place_id?: number;
    display_name?: string;
    lat?: string;
    lon?: string;
    type?: string;
    class?: string;
    addresstype?: string;
    name?: string;
    address?: {
      city?: string;
      town?: string;
      village?: string;
      hamlet?: string;
      suburb?: string;
      county?: string;
      state?: string;
      country?: string;
      country_code?: string;
    };
  }>;

  return json
    .map((item) => {
      const kind = (item.addresstype || item.type || "").toLowerCase();
      if (REJECT_VALUES.has(kind)) return null;
      if (item.class && item.class !== "place" && item.class !== "boundary") return null;
      const lat = Number.parseFloat(item.lat ?? "");
      const lng = Number.parseFloat(item.lon ?? "");
      if (!isFiniteCoordinate(lat) || !isFiniteCoordinate(lng)) return null;
      const address = item.address ?? {};
      const town =
        item.name ||
        address.city ||
        address.town ||
        address.village ||
        address.hamlet ||
        address.suburb ||
        "";
      const region = address.county || address.state || "";
      return finishPlace({
        placeId: `nominatim:${item.place_id ?? `${town}:${lat}:${lng}`}`,
        label: item.display_name || `${town}, ${region}`,
        nation: nationFromParts({
          country: address.country,
          countryCode: address.country_code,
          state: address.state,
          county: address.county,
          city: town,
          name: town,
        }),
        regionOrCouncilArea: region,
        townCity: town,
        latitude: lat,
        longitude: lng,
      });
    })
    .filter((place): place is FanMapPlace => Boolean(place));
}

export async function searchUkTowns(rawQuery: string): Promise<FanMapPlace[]> {
  const query = rawQuery.trim().replace(/\s+/g, " ");
  if (query.length < 2 || query.length > 80) return [];

  const key = cacheKey(query);
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < CACHE_MS) return hit.places;

  const geoapifyKey = process.env.GEOAPIFY_API_KEY?.trim();
  let places: FanMapPlace[] = [];
  const errors: string[] = [];

  if (geoapifyKey) {
    try {
      places = await fromGeoapify(query, geoapifyKey);
    } catch (error) {
      errors.push(error instanceof Error ? error.message : "Geoapify failed");
    }
  }

  if (places.length === 0) {
    try {
      places = await fromPhoton(query);
    } catch (error) {
      errors.push(error instanceof Error ? error.message : "Photon failed");
    }
  }

  if (places.length === 0) {
    try {
      places = await fromNominatim(query);
    } catch (error) {
      errors.push(error instanceof Error ? error.message : "Nominatim failed");
    }
  }

  const unique = dedupe(places).sort((a, b) => {
    const nationOrder = NATIONS.indexOf(a.nation) - NATIONS.indexOf(b.nation);
    if (nationOrder !== 0) return nationOrder;
    return a.townCity.localeCompare(b.townCity, "en-GB");
  });

  if (unique.length === 0 && errors.length > 0) {
    console.error("[fan-map] geocode failed", errors.join("; "));
  }

  cache.set(key, { at: Date.now(), places: unique });
  return unique;
}

export function placesMatch(stored: FanMapPlace, picked: FanMapPlace): boolean {
  return stored.placeId === picked.placeId;
}
