import { NextResponse } from "next/server";
import { getTeam } from "@/data/teams";
import { filledMsOk } from "@/lib/fan-map/anti-spam";
import { detectFlip, flipBanter, leadingTeamForTown } from "@/lib/fan-map/battles";
import { ensureFanId, getAuthSecret, readFanId } from "@/lib/fan-map/auth";
import {
  CREATE_RATE_MAX,
  isUkNation,
  isWatchParty,
  isYearsFollowing,
  REGISTER_RATE_WINDOW_MS,
  UPDATE_RATE_MAX,
} from "@/lib/fan-map/constants";
import { isFiniteCoordinate } from "@/lib/fan-map/geo";
import { bustFanMapCache } from "@/lib/fan-map/data";
import {
  findOrCreateFan,
  getRegistrationForUser,
  insertFlip,
  isFanMapDbConfigured,
  listAggregateRows,
  upsertRegistration,
} from "@/lib/fan-map/db";
import { takeFanMapSlot } from "@/lib/fan-map/rate-limit";
import { verifyTurnstile } from "@/lib/fan-map/turnstile";
import type { FanMapPlace } from "@/lib/fan-map/types";
import { rateLimitKey } from "@/lib/feedback-rate-limit";

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
  if (!isFanMapDbConfigured()) {
    return NextResponse.json(
      { error: "The fan map database is not wired up yet." },
      { status: 503 },
    );
  }
  if (!getAuthSecret()) {
    return NextResponse.json(
      { error: "Fan map cookies are not configured on this deployment." },
      { status: 503 },
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
  if (typeof body.website === "string" && body.website.trim()) {
    return NextResponse.json({ ok: true });
  }

  if (!filledMsOk(body.filledMs)) {
    return NextResponse.json(
      { error: "That submit was too quick. Have another go in a moment." },
      { status: 400 },
    );
  }

  const ip = rateLimitKey(request).split("::")[0];
  const captcha = await verifyTurnstile(
    typeof body.turnstileToken === "string" ? body.turnstileToken : undefined,
    ip,
  );
  if (!captcha.ok) {
    return NextResponse.json({ error: captcha.error }, { status: captcha.status });
  }

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

  const existingFanId = await readFanId();
  const existing = existingFanId ? await getRegistrationForUser(existingFanId) : null;
  const updating = Boolean(existing);
  const slot = takeFanMapSlot(
    request,
    updating ? "register-update" : "register-create",
    updating ? UPDATE_RATE_MAX : CREATE_RATE_MAX,
    REGISTER_RATE_WINDOW_MS,
  );
  if (!slot.ok) {
    return NextResponse.json(
      {
        error: updating
          ? "A few updates at a time is plenty. Try again later."
          : "Easy: one new pin per fan is plenty. Try again later.",
      },
      { status: 429, headers: { "Retry-After": String(slot.retryAfterSec) } },
    );
  }

  const fanId = existingFanId ?? (await ensureFanId());
  if (!fanId) {
    return NextResponse.json(
      { error: "Could not start a pin for this browser." },
      { status: 503 },
    );
  }

  try {
    await findOrCreateFan(fanId);
    const beforeRows = await listAggregateRows();
    const before = leadingTeamForTown(beforeRows, place.placeId);

    const registration = await upsertRegistration({
      userId: fanId,
      teamAbbreviation,
      place,
      yearsFollowing,
      watchPartyInterest,
    });

    const afterRows = await listAggregateRows();
    const after = leadingTeamForTown(afterRows, place.placeId);
    const change = detectFlip(before, after);
    if (change) {
      await insertFlip({
        placeId: place.placeId,
        townCity: place.townCity,
        nation: place.nation,
        fromTeam: change.fromTeam,
        toTeam: change.toTeam,
        message: flipBanter(change.fromTeam, change.toTeam, place.townCity),
      });
    }

    bustFanMapCache();
    return NextResponse.json({ ok: true, registration, updated: updating });
  } catch (error) {
    console.error("[fan-map] register failed", error);
    return NextResponse.json(
      { error: "Could not save that just now. Try again in a minute." },
      { status: 502 },
    );
  }
}
