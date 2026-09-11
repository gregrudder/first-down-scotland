import { NextResponse } from "next/server";
import { getMe } from "@/lib/fan-map/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const me = await getMe();
  return NextResponse.json(me);
}
