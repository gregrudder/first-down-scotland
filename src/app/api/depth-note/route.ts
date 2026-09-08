import { NextRequest, NextResponse } from "next/server";
import { espnTeamId } from "@/data/espn-team-ids";
import { getTeamDepthChart } from "@/lib/depth-chart";

export const revalidate = 600;

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("team") ?? "";
  const team = raw.trim().toUpperCase();
  if (!espnTeamId(team)) {
    return NextResponse.json({ ok: false, error: "Unknown team." }, { status: 400 });
  }

  const chart = await getTeamDepthChart(team);
  if (!chart.ok) {
    return NextResponse.json({ ok: false, error: chart.error });
  }

  const offence = chart.units.find((unit) => unit.unit === "offence");
  const qb = offence?.rows.find((row) => row.code === "QB");

  if (!qb?.starter) {
    return NextResponse.json({ ok: false, error: "No quarterback listed." });
  }

  return NextResponse.json({
    ok: true,
    qb: qb.starter,
    nextUp: qb.nextUp ?? null,
    seasonYear: chart.seasonYear,
    source: chart.source,
  });
}
