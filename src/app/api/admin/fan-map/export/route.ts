import { NextResponse } from "next/server";
import { adminTablesToCsv } from "@/lib/fan-map/aggregates";
import { isAdmin } from "@/lib/fan-map/auth";
import { getAdminStats } from "@/lib/fan-map/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  const stats = await getAdminStats();
  const csv = adminTablesToCsv(stats);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="fds-fan-map-aggregates.csv"',
    },
  });
}
