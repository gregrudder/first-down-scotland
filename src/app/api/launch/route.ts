import { NextResponse } from "next/server";
import { getTeam } from "@/data/teams";
import { LAUNCH_EMAIL_MAX, LAUNCH_SOURCES, type LaunchSource } from "@/data/launch";
import { rateLimitKey, takeLaunchSlot } from "@/lib/feedback-rate-limit";
import { deliverLaunchSignup, isPlausibleEmail } from "@/lib/send-launch";

export const runtime = "nodejs";

const MIN_FILL_MS = 2000;

function clip(value: unknown, max: number): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, max);
}

function parseSignup(input: unknown):
  | { email: string; team?: string; source: LaunchSource }
  | { error: string; ignored?: true } {
  if (!input || typeof input !== "object") return { error: "Send the form as JSON." };
  const raw = input as Record<string, unknown>;

  if (clip(raw.website, 120)) {
    return { error: "ignored", ignored: true };
  }

  const email = clip(raw.email, LAUNCH_EMAIL_MAX)?.toLowerCase();
  if (!email || !isPlausibleEmail(email)) {
    return { error: "That does not look like an email address." };
  }

  const startedAt = typeof raw.startedAt === "number" ? raw.startedAt : Number(raw.startedAt);
  if (!Number.isFinite(startedAt) || Date.now() - startedAt < MIN_FILL_MS) {
    return { error: "That was a bit quick. Have another look, then send." };
  }
  if (Date.now() - startedAt > 1000 * 60 * 60 * 6) {
    return { error: "That form went stale. Refresh and try again." };
  }

  const sourceRaw = typeof raw.source === "string" ? raw.source : "";
  const source = LAUNCH_SOURCES.includes(sourceRaw as LaunchSource)
    ? (sourceRaw as LaunchSource)
    : "home";

  const team = clip(raw.team, 8)?.toUpperCase();
  if (team && !getTeam(team)) {
    return { error: "That team code is not one of the 32." };
  }

  return { email, team, source };
}

export async function POST(request: Request) {
  const slot = takeLaunchSlot(rateLimitKey(request));
  if (!slot.ok) {
    return NextResponse.json(
      { error: "Easy: a few signups are already in the queue. Try again in a bit." },
      { status: 429, headers: { "Retry-After": String(slot.retryAfterSec) } },
    );
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Send the form as JSON." }, { status: 400 });
  }

  const parsed = parseSignup(raw);
  if ("error" in parsed) {
    if ("ignored" in parsed && parsed.ignored) {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const result = await deliverLaunchSignup(parsed);
    if (!result.ok) {
      console.error("[launch] delivery failed", result.reason, result.error);
      if (result.reason === "unconfigured") {
        return NextResponse.json(
          {
            error:
              "Could not join the list just now. The live site does not have a launch inbox wired up yet.",
          },
          { status: 503 },
        );
      }
      return NextResponse.json(
        { error: "Could not join the list just now. Try again in a minute." },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[launch] delivery threw", error);
    return NextResponse.json(
      { error: "Could not join the list just now. Try again in a minute." },
      { status: 502 },
    );
  }
}
