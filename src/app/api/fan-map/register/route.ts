import { NextResponse } from "next/server";
import { getTeam } from "@/data/teams";
import { getMe } from "@/lib/fan-map/auth";
import {
  isUkNation,
  isWatchParty,
  isYearsFollowing,
} from "@/lib/fan-map/constants";
import { isFiniteCoordinate } from "@/lib/fan-map/geo";
import { bustFanMapCache } from "@/lib/fan-map/data";
import { upsertRegistration } from "@/lib/fan-map/db";
import { takeFanMapSlot } from "@/lib/fan-map/rate-limit";
import type { FanMapPlace } from "@/lib/fan-map/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function parsePlace(raw: unknown): FanMapPlace | { error: string } {
  if (!raw || typeof raw !== "object") {
    return { error: "Pick a town from the search results." };
  }
  const place = raw as Record<string, unknown>;
  const placeId = typeof place.placeId === "string" ? place.placeId.trim() : "";
  const townCity = typeof place.townCity === "string" ? place.townCity.trim() : "";
  const region = typeof place.regionOrCouncilArea === "string" ? place.regionOrCouncilArea.trim() : "";
  const nation = typeof place.nation === "string" ? place.nation : "";
  const label = typeof place.label === "string" ? place.label.trim() : "";
  const latitude = place.latitude;
  const longitude = place.longitude;

  if (!placeId || !/^(geoapify|photon|nominatim):/.test(placeId)) {
    return { error: "Pick a town from the search results." };
  }
  if (!townCity || !region || !isUkNation(nation)) {
    return { error: "That result is not a UK town we can put on the map." };
  }
  if (!isFiniteCoordinate(latitude) || !isFiniteCoordinate(longitude)) {
    return { error: "That town is missing a centre point." };
  }
  if (/\b[A-Z]{1,2}\d{1,2}[A-Z]?\s*\d[A-Z]{2}\b/i.test(`${townCity} ${label}`)) {
    return { error: "We only store the town, not a postcode." };
  }

  return {
    placeId,
    label: label || `${townCity}, ${region}`,
    country: "United Kingdom",
    nation,
    regionOrCouncilArea: region,
    townCity,
    latitude,
    longitude,
  };
}

export async function POST(request: Request) {
  const slot = takeFanMapSlot(request, "register", 8, 10 * 60 * 1000);
  if (!slot.ok) {
    return NextResponse.json(
      { error: "Easy — one pin per fan is plenty." },
      { status: 429, headers: { "Retry-After": String(slot.retryAfterSec) } },
    );
  }

  const me = await getMe();
  if (!me.configured) {
    return NextResponse.json(
      { error: "The fan map database is not wired up yet." },
      { status: 503 },
    );
  }
  if (!me.session) {
    return NextResponse.json(
      { error: "Confirm your email first so we can keep one pin per person." },
      { status: 401 },
    );
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Send the form as JSON." }, { status: 400 });
  }
  if (!raw || typeof raw !== "object") {
    return NextResponse.json({ error: "Send the form as JSON." }, { status: 400 });
  }

  const body = raw as Record<string, unknown>;
  const teamAbbreviation =
    typeof body.teamAbbreviation === "string" ? body.teamAbbreviation.toUpperCase() : "";
  if (!getTeam(teamAbbreviation)) {
    return NextResponse.json({ error: "Pick one of the 32 NFL teams." }, { status: 400 });
  }

  const place = parsePlace(body.place);
  if ("error" in place) {
    return NextResponse.json({ error: place.error }, { status: 400 });
  }

  const yearsRaw = typeof body.yearsFollowing === "string" ? body.yearsFollowing : "";
  const watchRaw = typeof body.watchPartyInterest === "string" ? body.watchPartyInterest : "";
  const yearsFollowing = yearsRaw && isYearsFollowing(yearsRaw) ? yearsRaw : null;
  const watchPartyInterest = watchRaw && isWatchParty(watchRaw) ? watchRaw : null;
  if (yearsRaw && !yearsFollowing) {
    return NextResponse.json({ error: "That years-following option is not one of ours." }, { status: 400 });
  }
  if (watchRaw && !watchPartyInterest) {
    return NextResponse.json({ error: "Say yes, maybe, or no for watch parties." }, { status: 400 });
  }

  try {
    const registration = await upsertRegistration({
      userId: me.session.userId,
      teamAbbreviation,
      place,
      yearsFollowing,
      watchPartyInterest,
    });
    bustFanMapCache();
    return NextResponse.json({ ok: true, registration });
  } catch (error) {
    console.error("[fan-map] register failed", error);
    return NextResponse.json(
      { error: "Could not save that just now. Try again in a minute." },
      { status: 502 },
    );
  }
}
