import { NextResponse } from "next/server";
import { searchUkTowns } from "@/lib/fan-map/geocode";
import { takeFanMapSlot } from "@/lib/fan-map/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const slot = takeFanMapSlot(request, "geocode", 30, 60_000);
  if (!slot.ok) {
    return NextResponse.json(
      { error: "Slow down the search a touch." },
      { status: 429, headers: { "Retry-After": String(slot.retryAfterSec) } },
    );
  }

  const query = new URL(request.url).searchParams.get("q") ?? "";
  if (query.trim().length < 2) {
    return NextResponse.json({ places: [] });
  }

  try {
    const places = await searchUkTowns(query);
    return NextResponse.json({ places });
  } catch (error) {
    console.error("[fan-map] geocode route failed", error);
    return NextResponse.json({ error: "Town search is having a moment. Try again." }, { status: 502 });
  }
}
