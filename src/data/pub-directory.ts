import { parseCsv, rowsToRecords } from "@/lib/csv";
import { formatUkDay } from "@/lib/format-date";

export const PUB_COLUMNS = [
  "name",
  "town",
  "address",
  "shows",
  "booking_or_contact",
  "source_url",
  "checked_date",
  "notes",
] as const;

/** Full row, including internal verification notes. Notes are not for the public page. */
export type PubRecord = {
  name: string;
  town: string;
  address: string;
  shows: string;
  bookingOrContact: string;
  sourceUrl: string;
  checkedDate: string;
  notes: string;
};

/** What the public directory is allowed to render. */
export type PublicPub = {
  name: string;
  /** Group heading. "Dundee (Broughty Ferry)" groups under Dundee. */
  town: string;
  /** Card label. Broughty Ferry for that Dundee row; otherwise the town. */
  placeLabel: string;
  address: string;
  shows: string;
  bookingOrContact: string;
  sourceUrl: string;
  checkedDate: string;
  checkedLabel: string;
};

export function pubPlace(town: string): { town: string; placeLabel: string } {
  const trimmed = town.trim();
  const match = /^(.*?)\s*\(([^)]+)\)\s*$/.exec(trimmed);
  if (!match) return { town: trimmed, placeLabel: trimmed };
  const group = match[1].trim();
  const label = match[2].trim();
  return { town: group || trimmed, placeLabel: label || group || trimmed };
}

export function checkedLabel(checkedDate: string): string {
  const formatted = formatUkDay(checkedDate);
  return formatted ? `Checked ${formatted}` : "";
}

export function parsePubRecords(csv: string): PubRecord[] {
  const records = rowsToRecords(parseCsv(csv), PUB_COLUMNS);
  return records
    .filter((row) => row.name.trim())
    .map((row) => ({
      name: row.name,
      town: row.town,
      address: row.address,
      shows: row.shows,
      bookingOrContact: row.booking_or_contact,
      sourceUrl: row.source_url,
      checkedDate: row.checked_date,
      notes: row.notes,
    }));
}

export function toPublicPub(record: PubRecord): PublicPub {
  const place = pubPlace(record.town);
  return {
    name: record.name,
    town: place.town,
    placeLabel: place.placeLabel,
    address: record.address,
    shows: record.shows,
    bookingOrContact: record.bookingOrContact,
    sourceUrl: record.sourceUrl,
    checkedDate: record.checkedDate,
    checkedLabel: checkedLabel(record.checkedDate),
  };
}

export function groupPubsByTown(pubs: readonly PublicPub[]): { town: string; pubs: PublicPub[] }[] {
  const groups = new Map<string, PublicPub[]>();
  for (const pub of pubs) {
    const town = pub.town || "Town not listed";
    const list = groups.get(town) ?? [];
    list.push(pub);
    groups.set(town, list);
  }
  return [...groups.entries()]
    .sort((a, b) => a[0].localeCompare(b[0], "en-GB"))
    .map(([town, list]) => ({
      town,
      pubs: [...list].sort((a, b) => a.name.localeCompare(b.name, "en-GB")),
    }));
}

/** Pull a URL out of a booking/contact cell and keep the phone or email beside it. */
export function splitContact(value: string): { url: string | null; detail: string } {
  const match = value.match(/https?:\/\/[^\s)]+/i);
  if (!match) return { url: null, detail: value.trim() };
  const url = match[0];
  const detail = value
    .replace(url, " ")
    .replace(/[()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return { url, detail };
}
