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

const ukWeekdayLong = new Intl.DateTimeFormat("en-GB", {
  timeZone: site.timeZone,
  weekday: "long",
});

const usEastern = new Intl.DateTimeFormat("en-GB", {
  timeZone: "America/New_York",
  weekday: "short",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

const ukCalendarDay = new Intl.DateTimeFormat("en-GB", {
  timeZone: site.timeZone,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  weekday: "long",
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
  if (Number.isNaN(hour)) return null;
  // Some engines emit 24 for midnight; treat that as 0.
  return hour === 24 ? 0 : hour;
}

export function ukWeekdayLongName(iso: string): string {
  const date = parseUtc(iso);
  return date ? ukWeekdayLong.format(date) : "";
}

/** US Eastern clock, the one American graphics usually show. */
export function formatUsEastern(iso: string): string {
  const date = parseUtc(iso);
  if (!date) return "US time TBC";
  const parts = partsMap(date, usEastern);
  const hour = parts.hour ?? "";
  const minute = parts.minute ?? "00";
  const dayPeriod = (parts.dayPeriod ?? "").replace(/\s+/g, "").toLowerCase();
  const weekday = parts.weekday ?? "";
  return `${weekday} ${hour}:${minute}${dayPeriod ? ` ${dayPeriod}` : ""} ET`;
}

export function ukCalendarParts(iso: string): {
  year: string;
  month: string;
  day: string;
  weekday: string;
  dateKey: string;
} | null {
  const date = parseUtc(iso);
  if (!date) return null;
  const parts = partsMap(date, ukCalendarDay);
  if (!parts.year || !parts.month || !parts.day) return null;
  return {
    year: parts.year,
    month: parts.month,
    day: parts.day,
    weekday: parts.weekday ?? "",
    dateKey: `${parts.year}-${parts.month}-${parts.day}`,
  };
}

/** Shift a UK calendar date by whole days. Used for “night into next morning” labels. */
export function shiftUkCalendarDay(
  iso: string,
  deltaDays: number,
): { weekday: string; dateKey: string } | null {
  const current = ukCalendarParts(iso);
  if (!current) return null;
  const noonUtc = Date.UTC(
    Number(current.year),
    Number(current.month) - 1,
    Number(current.day),
    12,
    0,
    0,
  );
  if (!Number.isFinite(noonUtc)) return null;
  const shifted = new Date(noonUtc + deltaDays * 24 * 60 * 60 * 1000);
  const parts = partsMap(
    shifted,
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "UTC",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      weekday: "long",
    }),
  );
  if (!parts.year || !parts.month || !parts.day) return null;
  return {
    weekday: parts.weekday ?? "",
    dateKey: `${parts.year}-${parts.month}-${parts.day}`,
  };
}

export function formatFetchedAt(iso: string): string {
  const date = parseUtc(iso);
  if (!date) return "";
  return formatUkDateTime(iso);
}
