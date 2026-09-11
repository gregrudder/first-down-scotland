import { NextResponse } from "next/server";
import { requestMagicLink } from "@/lib/fan-map/auth";
import { takeFanMapSlot } from "@/lib/fan-map/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const slot = takeFanMapSlot(request, "magic-link", 5, 10 * 60 * 1000);
  if (!slot.ok) {
    return NextResponse.json(
      { error: "A few sign-in emails are already on the way. Try again in a bit." },
      { status: 429, headers: { "Retry-After": String(slot.retryAfterSec) } },
    );
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Send an email address." }, { status: 400 });
  }

  const email =
    raw && typeof raw === "object" && "email" in raw && typeof raw.email === "string"
      ? raw.email
      : "";

  const result = await requestMagicLink(email);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({
    ok: true,
    ...(result.devLink ? { devLink: result.devLink } : {}),
  });
}
