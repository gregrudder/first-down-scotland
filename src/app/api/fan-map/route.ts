import { NextResponse } from "next/server";
import { getPublicFanMap } from "@/lib/fan-map/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getPublicFanMap();
  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" },
  });
}
