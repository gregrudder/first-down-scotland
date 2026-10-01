import scheduleFile from "@/data/kickoff-schedule.json";
import { getTeam, teams, type NflTeam } from "@/data/teams";
import { parseUtc, ukHourNumber } from "@/lib/time";

const EASTERN = "America/New_York";
const LONDON = "Europe/London";

/** nflverse abbreviations that differ from the ones used on this site. */
const SITE_ABBR: Record<string, string> = {
  LA: "LAR",
  WAS: "WSH",
};

/**
 * International Series venues in the 2026 nflverse file.
 * City and country were checked against ESPN’s 2026 scoreboard venue addresses.
 * Tottenham is included even when a club is the designated home side.
 */
const INTERNATIONAL_VENUES: Record<string, { city: string; country: string }> = {
  "Melbourne Cricket Ground": { city: "Melbourne", country: "Australia" },
  "Maracana Stadium": { city: "Rio de Janeiro", country: "Brazil" },
  "Tottenham Hotspur Stadium": { city: "London", country: "England" },
  "Wembley Stadium": { city: "London", country: "England" },
  "Stade de France": { city: "Saint-Denis", country: "France" },
  Bernabeu: { city: "Madrid", country: "Spain" },
  "FC Bayern Munich Stadium": { city: "Munich", country: "Germany" },
  "Estadio Banorte": { city: "Mexico City", country: "Mexico" },
};

export const VIEWING_WINDOWS = {
  "international-afternoon": {
    label: "London/International afternoon",
    hint: "Afternoon kick-off in Britain or Europe. The easy one.",
  },
  "tea-time": {
    label: "Tea-time",
    hint: "Around 6pm UK, including 5pm on the Sunday the clocks go back.",
  },
  evening: {
    label: "Evening",
    hint: "Around 9pm UK. On 25 October the same window is closer to 8pm.",
  },
  "late-night": {
    label: "Late night",
    hint: "10pm or later, still the same UK evening.",
  },
  overnight: {
    label: "Overnight",
    hint: "After midnight UK time. Thursday, Sunday and Monday night in the US.",
  },
} as const;

export type ViewingWindowId = keyof typeof VIEWING_WINDOWS;

export type RawScheduleGame = {
  id: string;
  week: number;
  gameday: string;
  weekday: string;
  gametimeEt: string;
  away: string;
  home: string;
  location: string;
  stadium: string;
};

export type KickoffGame = {
  id: string;
  week: number;
  gameday: string;
  weekday: string;
  gametimeEt: string;
  location: "Home" | "Neutral";
  stadium: string;
  kickoffUtc: string;
  awayTeam: NflTeam;
  homeTeam: NflTeam;
  international: boolean;
  venueCity?: string;
  venueCountry?: string;
  windowId: ViewingWindowId;
};

export type LondonParts = {
  year: string;
  month: string;
  day: string;
  hour: string;
  minute: string;
  zone: string;
  dateKey: string;
};

type ScheduleFile = {
  source: string;
  sourceRepo: string;
  sourceName: string;
  season: number;
  generatedAt: string;
  games: RawScheduleGame[];
};

const schedule = scheduleFile as ScheduleFile;

export const kickoffScheduleSource = {
  source: schedule.source,
  sourceRepo: schedule.sourceRepo,
  sourceName: schedule.sourceName,
  season: schedule.season,
  generatedAt: schedule.generatedAt,
} as const;

function tzOffsetMinutes(instant: Date, timeZone: string): number {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(instant)
      .map((part) => [part.type, part.value]),
  );
  const hour = parts.hour === "24" ? "0" : parts.hour;
  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(hour),
    Number(parts.minute),
    Number(parts.second),
  );
  return (asUtc - instant.getTime()) / 60000;
}

/** Convert a US Eastern wall-clock kick-off to an absolute instant. */
export function easternWallTimeToUtc(gameday: string, gametime: string): Date {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(gameday);
  const timeMatch = /^(\d{2}):(\d{2})$/.exec(gametime);
  if (!dateMatch || !timeMatch) {
    throw new Error(`Bad Eastern kick-off: ${gameday} ${gametime}`);
  }
  const wallAsUtc = Date.UTC(
    Number(dateMatch[1]),
    Number(dateMatch[2]) - 1,
    Number(dateMatch[3]),
    Number(timeMatch[1]),
    Number(timeMatch[2]),
    0,
  );
  let utc = wallAsUtc - tzOffsetMinutes(new Date(wallAsUtc), EASTERN) * 60_000;
  utc = wallAsUtc - tzOffsetMinutes(new Date(utc), EASTERN) * 60_000;
  return new Date(utc);
}

export function londonParts(instant: Date): LondonParts {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: LONDON,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
      timeZoneName: "short",
    })
      .formatToParts(instant)
      .map((part) => [part.type, part.value]),
  );
  const hour = parts.hour === "24" ? "00" : (parts.hour ?? "00");
  const year = parts.year ?? "";
  const month = parts.month ?? "";
  const day = parts.day ?? "";
  return {
    year,
    month,
    day,
    hour,
    minute: parts.minute ?? "00",
    zone: parts.timeZoneName ?? "UK",
    dateKey: `${year}-${month}-${day}`,
  };
}

export function formatKickoffUk(iso: string): string {
  const date = parseUtc(iso);
  if (!date) return "Kick-off time to be confirmed";
  const clock = londonParts(date);
  const written = new Intl.DateTimeFormat("en-GB", {
    timeZone: LONDON,
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
  return `${written} · ${clock.hour}:${clock.minute} ${clock.zone}`;
}

export function siteAbbreviation(nflverseAbbr: string): string {
  return SITE_ABBR[nflverseAbbr] ?? nflverseAbbr;
}

function teamOrThrow(nflverseAbbr: string): NflTeam {
  const abbr = siteAbbreviation(nflverseAbbr);
  const team = getTeam(abbr);
  if (!team) throw new Error(`No site team for ${nflverseAbbr}`);
  return team;
}

export function viewingWindow(iso: string, international: boolean): ViewingWindowId {
  const hour = ukHourNumber(iso);
  if (hour === null) return "overnight";
  if (hour < 5) return "overnight";
  if (hour >= 22) return "late-night";
  if (hour >= 19) return "evening";
  if (hour >= 17) return "tea-time";
  if (international) return "international-afternoon";
  return "tea-time";
}

function enrich(raw: RawScheduleGame): KickoffGame {
  const kickoff = easternWallTimeToUtc(raw.gameday, raw.gametimeEt);
  const venue = INTERNATIONAL_VENUES[raw.stadium];
  const international = Boolean(venue) || raw.location === "Neutral";
  const kickoffUtc = kickoff.toISOString();
  return {
    id: raw.id,
    week: raw.week,
    gameday: raw.gameday,
    weekday: raw.weekday,
    gametimeEt: raw.gametimeEt,
    location: raw.location === "Neutral" ? "Neutral" : "Home",
    stadium: raw.stadium,
    kickoffUtc,
    awayTeam: teamOrThrow(raw.away),
    homeTeam: teamOrThrow(raw.home),
    international,
    venueCity: venue?.city,
    venueCountry: venue?.country,
    windowId: viewingWindow(kickoffUtc, international),
  };
}

let cached: KickoffGame[] | null = null;

export function getKickoffGames(): KickoffGame[] {
  if (!cached) cached = schedule.games.map(enrich);
  return cached;
}

export function gameById(id: string): KickoffGame | undefined {
  return getKickoffGames().find((game) => game.id === id);
}

export function gamesForWeek(week: number): KickoffGame[] {
  return getKickoffGames().filter((game) => game.week === week);
}

export function gamesForTeam(siteAbbr: string): KickoffGame[] {
  const abbr = siteAbbr.toUpperCase();
  return getKickoffGames().filter(
    (game) => game.homeTeam.abbreviation === abbr || game.awayTeam.abbreviation === abbr,
  );
}

/** First week that still has a kick-off inside a six-hour grace window. */
export function weekForInstant(now: Date): number {
  const games = getKickoffGames();
  const graceMs = 6 * 60 * 60 * 1000;
  for (const game of games) {
    const kick = Date.parse(game.kickoffUtc);
    if (Number.isFinite(kick) && kick + graceMs >= now.getTime()) return game.week;
  }
  return games[games.length - 1]?.week ?? 1;
}

export function matchupLabel(game: KickoffGame): string {
  if (game.location === "Neutral") {
    return `${game.awayTeam.shortName} vs ${game.homeTeam.shortName}`;
  }
  return `${game.awayTeam.shortName} @ ${game.homeTeam.shortName}`;
}

export function venueLabel(game: KickoffGame): string {
  return game.venueCity ? `${game.stadium}, ${game.venueCity}` : game.stadium;
}

export function sideForTeam(game: KickoffGame, siteAbbr: string): "home" | "away" | "neutral" {
  if (game.location === "Neutral") return "neutral";
  return game.homeTeam.abbreviation === siteAbbr.toUpperCase() ? "home" : "away";
}

export function sideLabel(game: KickoffGame, siteAbbr: string): string {
  const side = sideForTeam(game, siteAbbr);
  if (side === "neutral") return "Neutral site";
  return side === "home" ? "Home" : "Away";
}

export type SeasonRow =
  | { kind: "game"; game: KickoffGame }
  | { kind: "bye"; week: number };

export function seasonRows(siteAbbr: string): SeasonRow[] {
  const grouped = new Map<number, KickoffGame[]>();
  for (const game of gamesForTeam(siteAbbr)) {
    const list = grouped.get(game.week) ?? [];
    list.push(game);
    grouped.set(game.week, list);
  }
  const rows: SeasonRow[] = [];
  for (let week = 1; week <= 18; week += 1) {
    const games = grouped.get(week);
    if (!games || games.length === 0) {
      rows.push({ kind: "bye", week });
      continue;
    }
    for (const game of games) rows.push({ kind: "game", game });
  }
  return rows;
}

export function teamChoices(): NflTeam[] {
  return [...teams].sort((a, b) => a.name.localeCompare(b.name, "en-GB"));
}

export function findTeam(abbr: string | undefined): NflTeam | undefined {
  if (!abbr) return undefined;
  return getTeam(abbr);
}

const ICS_BLOCK_MS = (3 * 60 + 15) * 60 * 1000;

function icsEscape(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r\n|\n|\r/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function icsUtc(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function foldLine(line: string): string {
  if (line.length <= 75) return line;
  const chunks = [line.slice(0, 75)];
  let rest = line.slice(75);
  while (rest.length > 0) {
    chunks.push(` ${rest.slice(0, 74)}`);
    rest = rest.slice(74);
  }
  return chunks.join("\r\n");
}

export function buildKickoffCalendar(
  games: KickoffGame[],
  options: { name: string; discordUrl: string },
): string {
  const stamp = icsUtc(new Date());
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//First Down Scotland//UK kick-off planner//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${icsEscape(options.name)}`,
    "X-WR-TIMEZONE:Europe/London",
  ];

  for (const game of games) {
    const start = parseUtc(game.kickoffUtc);
    if (!start) continue;
    const end = new Date(start.getTime() + ICS_BLOCK_MS);
    const summary = `NFL: ${matchupLabel(game)}`;
    const description = [
      `UK kick-off: ${formatKickoffUk(game.kickoffUtc)} (Europe/London)`,
      `Window: ${VIEWING_WINDOWS[game.windowId].label}`,
      `Venue: ${venueLabel(game)}`,
      game.international ? "International Series" : "",
      "Blocked for about 3 hours 15 minutes. The final whistle varies.",
      `Watch along in the Discord: ${options.discordUrl}`,
    ]
      .filter(Boolean)
      .join("\n");

    lines.push(
      "BEGIN:VEVENT",
      `UID:${game.id}@firstdownscotland.com`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${icsUtc(start)}`,
      `DTEND:${icsUtc(end)}`,
      `SUMMARY:${icsEscape(summary)}`,
      `LOCATION:${icsEscape(venueLabel(game))}`,
      `DESCRIPTION:${icsEscape(description)}`,
      "END:VEVENT",
    );
  }

  lines.push("END:VCALENDAR");
  return `${lines.map(foldLine).join("\r\n")}\r\n`;
}
