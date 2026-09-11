import { NextResponse } from "next/server";
import { HOTSPOT_RADII_MILES } from "@/lib/fan-map/constants";
import { isAdmin } from "@/lib/fan-map/auth";
import { getHotspot } from "@/lib/fan-map/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const params = new URL(request.url).searchParams;
  const placeId = params.get("placeId")?.trim() ?? "";
  const miles = Number.parseInt(params.get("miles") ?? "", 10);
  if (!placeId) {
    return NextResponse.json({ error: "Pick a town." }, { status: 400 });
  }
  if (!HOTSPOT_RADII_MILES.includes(miles as (typeof HOTSPOT_RADII_MILES)[number])) {
    return NextResponse.json({ error: "Radius must be 5, 10, 15, 20 or 25 miles." }, { status: 400 });
  }

  const hotspot = await getHotspot(placeId, miles);
  if (!hotspot) {
    return NextResponse.json({ error: "That town is not on the map yet." }, { status: 404 });
  }
  return NextResponse.json(hotspot);
}
