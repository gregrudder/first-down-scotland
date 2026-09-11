import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/fan-map/auth";
import { getAdminStats } from "@/lib/fan-map/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  try {
    const stats = await getAdminStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error("[fan-map] admin stats failed", error);
    return NextResponse.json({ error: "Could not load admin stats." }, { status: 502 });
  }
}
