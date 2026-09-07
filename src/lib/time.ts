import { site } from "@/lib/site";

const ukDateTime = new Intl.DateTimeFormat("en-GB", {
  timeZone: site.timeZone,
  weekday: "long",
  day: "numeric",
  month: "long",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const ukDate = new Intl.DateTimeFormat("en-GB", {
  timeZone: site.timeZone,
  weekday: "long",
  day: "numeric",
  month: "long",
});

const ukTime = new Intl.DateTimeFormat("en-GB", {
  timeZone: site.timeZone,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const ukWeekday = new Intl.DateTimeFormat("en-GB", {
  timeZone: site.timeZone,
  weekday: "short",
});

const ukHour = new Intl.DateTimeFormat("en-GB", {
  timeZone: site.timeZone,
  hour: "2-digit",
  hour12: false,
});

function partsMap(date: Date, formatter: Intl.DateTimeFormat) {
  return Object.fromEntries(
    formatter.formatToParts(date).map((part) => [part.type, part.value]),
  ) as Partial<Record<Intl.DateTimeFormatPartTypes, string>>;
}

export function parseUtc(iso: string): Date | null {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatUkDateTime(iso: string): string {
  const date = parseUtc(iso);
  if (!date) return "Kick-off time to be confirmed";
  const parts = partsMap(date, ukDateTime);
  return `${parts.weekday} ${parts.day} ${parts.month} · ${parts.hour}:${parts.minute} UK`;
}

export function formatUkDate(iso: string): string {
  const date = parseUtc(iso);
  if (!date) return "Date to be confirmed";
  return ukDate.format(date);
}

export function formatUkTime(iso: string): string {
  const date = parseUtc(iso);
  if (!date) return "TBC";
  return `${ukTime.format(date)} UK`;
}

export function ukDateKey(iso: string): string {
  const date = parseUtc(iso);
  if (!date) return "unknown";
  const parts = partsMap(
    date,
    new Intl.DateTimeFormat("en-GB", {
      timeZone: site.timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }),
  );
  return `${parts.year}-${parts.month}-${parts.day}`;
}

export function ukWeekdayShort(iso: string): string {
  const date = parseUtc(iso);
  return date ? ukWeekday.format(date) : "";
}

export function ukHourNumber(iso: string): number | null {
  const date = parseUtc(iso);
  if (!date) return null;
  const hour = Number(ukHour.format(date));
  return Number.isNaN(hour) ? null : hour;
}

export function formatFetchedAt(iso: string): string {
  const date = parseUtc(iso);
  if (!date) return "";
  return formatUkDateTime(iso);
}
