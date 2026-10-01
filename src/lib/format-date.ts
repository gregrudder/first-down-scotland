const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** `2026-09-30` → `30 Sep 2026`. Other strings are returned trimmed. */
export function formatUkDay(value: string): string {
  const trimmed = value.trim();
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(trimmed);
  if (!match) return trimmed;
  const day = Number(match[3]);
  const month = MONTHS[Number(match[2]) - 1];
  if (!month || !day) return trimmed;
  return `${day} ${month} ${match[1]}`;
}
