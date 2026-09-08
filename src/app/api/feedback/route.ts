import { NextResponse } from "next/server";
import {
  favouriteOptions,
  FEEDBACK_LIMITS,
  foundOptions,
  payOptions,
  recommendOptions,
  type FeedbackPayload,
} from "@/data/feedback";
import { rateLimitKey, takeFeedbackSlot } from "@/lib/feedback-rate-limit";
import { deliverFeedback } from "@/lib/send-feedback";
import { getTeam } from "@/data/teams";

export const runtime = "nodejs";

const MIN_FILL_MS = 4000;
const OPTION_IDS = {
  found: new Set<string>(foundOptions.map((option) => option.id)),
  favourite: new Set<string>(favouriteOptions.map((option) => option.id)),
  pay: new Set<string>(payOptions.map((option) => option.id)),
  recommend: new Set<string>(recommendOptions.map((option) => option.id)),
};

function clip(value: unknown, max: number): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, max);
}

function parsePayload(input: unknown): FeedbackPayload | { error: string } {
  if (!input || typeof input !== "object") return { error: "Send the form as JSON." };
  const raw = input as Record<string, unknown>;

  if (clip(raw.website, 120)) {
    return { error: "ignored" };
  }

  const found = typeof raw.found === "string" ? raw.found : "";
  const favourite = typeof raw.favourite === "string" ? raw.favourite : "";
  const pay = typeof raw.pay === "string" ? raw.pay : "";
  if (!OPTION_IDS.found.has(found as FeedbackPayload["found"])) {
    return { error: "Tell us how you found the app." };
  }
  if (!OPTION_IDS.favourite.has(favourite as FeedbackPayload["favourite"])) {
    return { error: "Pick a favourite bit." };
  }
  if (!OPTION_IDS.pay.has(pay as FeedbackPayload["pay"])) {
    return { error: "Answer the £2 question: even a no is useful." };
  }

  const startedAt = typeof raw.startedAt === "number" ? raw.startedAt : Number(raw.startedAt);
  if (!Number.isFinite(startedAt) || Date.now() - startedAt < MIN_FILL_MS) {
    return { error: "That was a bit quick. Have another look, then send." };
  }
  if (Date.now() - startedAt > 1000 * 60 * 60 * 6) {
    return { error: "That form went stale. Refresh and try again." };
  }

  const team = clip(raw.team, FEEDBACK_LIMITS.team)?.toUpperCase();
  if (team && !getTeam(team)) {
    return { error: "That team code is not one of the 32." };
  }

  const recommendRaw = typeof raw.recommend === "string" ? raw.recommend : "";
  const recommend = OPTION_IDS.recommend.has(recommendRaw)
    ? (recommendRaw as NonNullable<FeedbackPayload["recommend"]>)
    : undefined;

  return {
    found: found as FeedbackPayload["found"],
    foundOther: clip(raw.foundOther, FEEDBACK_LIMITS.short),
    favourite: favourite as FeedbackPayload["favourite"],
    favouriteOther: clip(raw.favouriteOther, FEEDBACK_LIMITS.short),
    confusing: clip(raw.confusing, FEEDBACK_LIMITS.text),
    broken: clip(raw.broken, FEEDBACK_LIMITS.text),
    pay: pay as FeedbackPayload["pay"],
    worthIt: clip(raw.worthIt, FEEDBACK_LIMITS.text),
    else: clip(raw.else, FEEDBACK_LIMITS.text),
    name: clip(raw.name, FEEDBACK_LIMITS.name),
    team,
    recommend,
    startedAt,
  };
}

export async function POST(request: Request) {
  const slot = takeFeedbackSlot(rateLimitKey(request));
  if (!slot.ok) {
    return NextResponse.json(
      { error: "Easy: a few notes are already in the queue. Try again in a bit." },
      { status: 429, headers: { "Retry-After": String(slot.retryAfterSec) } },
    );
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Send the form as JSON." }, { status: 400 });
  }

  const parsed = parsePayload(raw);
  if ("error" in parsed) {
    if (parsed.error === "ignored") {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const result = await deliverFeedback(parsed);
    if (!result.ok) {
      return NextResponse.json(
        { error: "Could not send that just now. Try again in a minute." },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Could not send that just now. Try again in a minute." },
      { status: 502 },
    );
  }
}
