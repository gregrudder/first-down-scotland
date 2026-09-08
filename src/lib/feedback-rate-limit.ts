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

export function takeFeedbackSlot(key: string): { ok: true } | { ok: false; retryAfterSec: number } {
  const now = Date.now();
  const current = windows.get(key) ?? { hits: [] };
  current.hits = prune(now, current.hits);

  if (current.hits.length >= MAX_HITS) {
    const oldest = current.hits[0] ?? now;
    windows.set(key, current);
    return { ok: false, retryAfterSec: Math.max(1, Math.ceil((WINDOW_MS - (now - oldest)) / 1000)) };
  }

  current.hits.push(now);
  windows.set(key, current);
  return { ok: true };
}
