type Bucket = { hits: number[]; };

const windows = new Map<string, Bucket>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 5;

function prune(now: number, hits: number[]): number[] {
  return hits.filter((at) => now - at < WINDOW_MS);
}

export function rateLimitKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  const agent = request.headers.get("user-agent")?.slice(0, 80) || "na";
  return `${ip}::${agent}`;
}

function takeSlot(
  store: Map<string, Bucket>,
  key: string,
  maxHits: number,
): { ok: true } | { ok: false; retryAfterSec: number } {
  const now = Date.now();
  const current = store.get(key) ?? { hits: [] };
  current.hits = prune(now, current.hits);

  if (current.hits.length >= maxHits) {
    const oldest = current.hits[0] ?? now;
    store.set(key, current);
    return { ok: false, retryAfterSec: Math.max(1, Math.ceil((WINDOW_MS - (now - oldest)) / 1000)) };
  }

  current.hits.push(now);
  store.set(key, current);
  return { ok: true };
}

export function takeFeedbackSlot(key: string): { ok: true } | { ok: false; retryAfterSec: number } {
  return takeSlot(windows, key, MAX_HITS);
}

const launchWindows = new Map<string, Bucket>();
const LAUNCH_MAX_HITS = 8;

export function takeLaunchSlot(key: string): { ok: true } | { ok: false; retryAfterSec: number } {
  return takeSlot(launchWindows, `launch::${key}`, LAUNCH_MAX_HITS);
}
