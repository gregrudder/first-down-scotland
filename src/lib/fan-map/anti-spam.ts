import { MIN_FORM_FILL_MS } from "@/lib/fan-map/constants";

const MAX_FORM_FILL_MS = 24 * 60 * 60 * 1000;

/** Reject instant bot posts. The client sends elapsed ms since the form opened. */
export function filledMsOk(value: unknown, minimumMs = MIN_FORM_FILL_MS): boolean {
  const ms = typeof value === "number" ? value : Number(value);
  return Number.isFinite(ms) && ms >= minimumMs && ms <= MAX_FORM_FILL_MS;
}
