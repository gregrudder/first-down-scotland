import { NextResponse } from "next/server";
import { adminPasswordMatches, getAdminSecret, writeAdminSession } from "@/lib/fan-map/auth";
import { takeFanMapSlot } from "@/lib/fan-map/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!getAdminSecret()) {
    return NextResponse.json(
      { error: "Set FAN_MAP_ADMIN_SECRET to open the admin map." },
      { status: 503 },
    );
  }

  const slot = takeFanMapSlot(request, "admin-login", 8, 10 * 60 * 1000);
  if (!slot.ok) {
    return NextResponse.json(
      { error: "Too many tries. Wait a bit." },
      { status: 429, headers: { "Retry-After": String(slot.retryAfterSec) } },
    );
  }

  let password = "";
  try {
    const raw = (await request.json()) as { password?: unknown };
    password = typeof raw.password === "string" ? raw.password : "";
  } catch {
    return NextResponse.json({ error: "Send the password." }, { status: 400 });
  }

  if (!adminPasswordMatches(password)) {
    return NextResponse.json({ error: "That password is not right." }, { status: 401 });
  }

  await writeAdminSession();
  return NextResponse.json({ ok: true });
}
