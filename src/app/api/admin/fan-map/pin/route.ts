import { NextResponse } from "next/server";
import { detectFlip, flipBanter, leadingTeamForTown } from "@/lib/fan-map/battles";
import { isAdmin } from "@/lib/fan-map/auth";
import { bustFanMapCache } from "@/lib/fan-map/data";
import {
  deleteRegistration,
  getAdminPin,
  hideRegistration,
  insertFlip,
  listAggregateRows,
  unhideRegistration,
} from "@/lib/fan-map/db";
import { takeFanMapSlot } from "@/lib/fan-map/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ACTIONS = ["hide", "unhide", "delete"] as const;
type PinAction = (typeof ACTIONS)[number];

function isAction(value: string): value is PinAction {
  return (ACTIONS as readonly string[]).includes(value);
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const slot = takeFanMapSlot(request, "admin-pin", 40, 10 * 60 * 1000);
  if (!slot.ok) {
    return NextResponse.json(
      { error: "Slow down the moderation clicks." },
      { status: 429, headers: { "Retry-After": String(slot.retryAfterSec) } },
    );
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Send JSON." }, { status: 400 });
  }
  if (!raw || typeof raw !== "object") {
    return NextResponse.json({ error: "Send JSON." }, { status: 400 });
  }
  const body = raw as Record<string, unknown>;
  const id = typeof body.id === "string" ? body.id.trim() : "";
  const action = typeof body.action === "string" ? body.action : "";
  if (!id || !isAction(action)) {
    return NextResponse.json({ error: "Need a pin id and hide, unhide, or delete." }, { status: 400 });
  }

  const pin = await getAdminPin(id);
  if (!pin) {
    return NextResponse.json({ error: "That pin is gone." }, { status: 404 });
  }

  try {
    const beforeRows = await listAggregateRows();
    const before = leadingTeamForTown(beforeRows, pin.placeId);

    const changed =
      action === "hide"
        ? await hideRegistration(id)
        : action === "unhide"
          ? await unhideRegistration(id)
          : await deleteRegistration(id);
    if (!changed && action !== "delete") {
      return NextResponse.json({ ok: true, pin, action, unchanged: true });
    }

    const afterRows = await listAggregateRows();
    const after = leadingTeamForTown(afterRows, pin.placeId);
    const flip = detectFlip(before, after);
    if (flip) {
      await insertFlip({
        placeId: pin.placeId,
        townCity: pin.townCity,
        nation: pin.nation,
        fromTeam: flip.fromTeam,
        toTeam: flip.toTeam,
        message: flipBanter(flip.fromTeam, flip.toTeam, pin.townCity),
      });
    }

    bustFanMapCache();
    return NextResponse.json({ ok: true, action });
  } catch (error) {
    console.error("[fan-map] admin pin failed", error);
    return NextResponse.json({ error: "Could not change that pin." }, { status: 502 });
  }
}
