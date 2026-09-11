import { rateLimitKey } from "@/lib/feedback-rate-limit";

type Bucket = { hits: number[] };

const windows = new Map<string, Bucket>();

function takeSlot(
  key: string,
  maxHits: number,
  windowMs: number,
): { ok: true } | { ok: false; retryAfterSec: number } {
  const now = Date.now();
  const current = windows.get(key) ?? { hits: [] };
  current.hits = current.hits.filter((at) => now - at < windowMs);

  if (current.hits.length >= maxHits) {
    const oldest = current.hits[0] ?? now;
    windows.set(key, current);
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((windowMs - (now - oldest)) / 1000)),
    };
  }

  current.hits.push(now);
  windows.set(key, current);
  return { ok: true };
}

export function takeFanMapSlot(
  request: Request,
  bucket: string,
  maxHits: number,
  windowMs: number,
): { ok: true } | { ok: false; retryAfterSec: number } {
  return takeSlot(`${bucket}::${rateLimitKey(request)}`, maxHits, windowMs);
}
