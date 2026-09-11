import type {
  FixtureSlate,
  FixtureSlateRelation,
  FixturesFailure,
  NflGame,
} from "@/lib/espn";
import {
  formatUkDate,
  formatUkDateTime,
  formatUkTime,
  formatUsEastern,
  parseUtc,
  shiftUkCalendarDay,
  ukCalendarParts,
  ukDateKey,
  ukHourNumber,
} from "@/lib/time";
import { watchHintForGame } from "@/lib/watch-hints";

/** UK local hour at or after which a kick-off counts as late. */
export const LATE_UK_HOUR = 21;

/** Overnight kick-offs before this UK hour also count as late (TNF / SNF / MNF). */
export const OVERNIGHT_UNTIL_HOUR = 5;

export const LATE_THRESHOLD_COPY =
  "Late means a UK kick-off at 9pm or later, or overnight before 5am. That is the Sunday 4pm ET window, plus Thursday, Sunday and Monday night in the US — the ones that wreck a work morning if you stay up.";

export const SCHEDULE_CHANGE_COPY =
  "Schedule subject to change. NFL kick-off times, flex games and TV windows move. This is the late slate as listed today — use it to plan a nap or a day off, then check again before you book anything.";

export type LateNightTeam = {
  name: string;
  shortName: string;
  abbreviation: string;
  logo?: string;
};

export type LateNightGame = {
  id: string;
  kickoffUtc: string;
  status: NflGame["status"];
  weekLabel: string;
  weekNumber: number;
  seasonType: number;
  weekKey: string;
  slateKey: FixtureSlateRelation;
  slateHeading: string;
  away: LateNightTeam;
  home: LateNightTeam;
  broadcasts: string[];
  venue?: string;
  venueCity?: string;
  ukDate: string;
  ukDateTime: string;
  ukTime: string;
  usEastern: string;
  nightKey: string;
  nightLabel: string;
  planningHint: string;
  watchHint: string;
  overnight: boolean;
};

const SLATE_HEADINGS: Record<FixtureSlateRelation, string> = {
  "this-week": "This week",
  "next-week": "Next week",
  later: "Later weeks",
  recent: "Already kicked off",
};

function weekHeadingFor(game: Pick<LateNightGame, "slateKey" | "weekLabel">): string {
  if (game.slateKey === "this-week" || game.slateKey === "next-week") {
    return `${SLATE_HEADINGS[game.slateKey]} · ${game.weekLabel}`;
  }
  return game.weekLabel || SLATE_HEADINGS[game.slateKey];
}

function stripTeam(team: NflGame["home"]): LateNightTeam {
  return {
    name: team.name,
    shortName: team.shortName,
    abbreviation: team.abbreviation,
    logo: team.logo,
  };
}

export function isLateUkKickoffTime(iso: string): boolean {
  const hour = ukHourNumber(iso);
  if (hour === null) return false;
  return hour >= LATE_UK_HOUR || hour < OVERNIGHT_UNTIL_HOUR;
}

export function isLateUkGame(game: Pick<NflGame, "kickoffUtc">): boolean {
  return isLateUkKickoffTime(game.kickoffUtc);
}

export function ukNightForPlanners(iso: string): {
  nightKey: string;
  nightLabel: string;
  overnight: boolean;
} {
  const hour = ukHourNumber(iso);
  const today = ukCalendarParts(iso);
  if (hour === null || !today) {
    return {
      nightKey: "unknown",
      nightLabel: "Kick-off time to be confirmed",
      overnight: false,
    };
  }

  if (hour < OVERNIGHT_UNTIL_HOUR) {
    const previous = shiftUkCalendarDay(iso, -1);
    const from = previous?.weekday || "the night before";
    const into = today.weekday;
    return {
      nightKey: previous?.dateKey ?? today.dateKey,
      nightLabel: `${from} night into ${into} morning`,
      overnight: true,
    };
  }

  return {
    nightKey: today.dateKey,
    nightLabel: `${today.weekday} night`,
    overnight: hour >= LATE_UK_HOUR,
  };
}

export function planningHintForKickoff(iso: string, status: NflGame["status"]): string {
  if (status === "in-progress") {
    return "It is on now. If you are watching, the morning after is the one to protect.";
  }
  if (status === "final") {
    return "This kick-off has already gone. Times only here — scores live on This week and Scores.";
  }

  const hour = ukHourNumber(iso);
  const today = ukCalendarParts(iso);
  if (hour === null || !today) {
    return "Once the time is confirmed you can decide whether to nap, finish early, or book the day off.";
  }

  if (hour < OVERNIGHT_UNTIL_HOUR) {
    return `Small hours in the UK. Nap before kick-off if you can, or book a late start on ${today.weekday} morning.`;
  }

  if (hour >= LATE_UK_HOUR) {
    const next = shiftUkCalendarDay(iso, 1);
    const nextDay = next?.weekday ?? "the next";
    return `Late evening UK kick-off. Fine if ${nextDay} is quiet; book the morning off if work will not wait.`;
  }

  return "A civilised UK slot — this diary only lists the late ones.";
}

export function toLateNightGame(
  game: NflGame,
  slate: Pick<FixtureSlate, "relation" | "ref">,
  weekLabel: string,
): LateNightGame {
  const night = ukNightForPlanners(game.kickoffUtc);
  return {
    id: game.id,
    kickoffUtc: game.kickoffUtc,
    status: game.status,
    weekLabel,
    weekNumber: slate.ref.weekNumber,
    seasonType: slate.ref.seasonType,
    weekKey: `${slate.ref.seasonType}-${String(slate.ref.weekNumber).padStart(2, "0")}`,
    slateKey: slate.relation,
    slateHeading: weekHeadingFor({
      slateKey: slate.relation,
      weekLabel,
    }),
    away: stripTeam(game.away),
    home: stripTeam(game.home),
    broadcasts: game.broadcasts,
    venue: game.venue,
    venueCity: game.venueCity,
    ukDate: formatUkDate(game.kickoffUtc),
    ukDateTime: formatUkDateTime(game.kickoffUtc),
    ukTime: formatUkTime(game.kickoffUtc),
    usEastern: formatUsEastern(game.kickoffUtc),
    nightKey: night.nightKey,
    nightLabel: night.nightLabel,
    planningHint: planningHintForKickoff(game.kickoffUtc, game.status),
    watchHint: watchHintForGame(game),
    overnight: night.overnight,
  };
}

export function involvesTeam(game: LateNightGame, abbreviation: string): boolean {
  const abbr = abbreviation.toUpperCase();
  return (
    game.home.abbreviation.toUpperCase() === abbr ||
    game.away.abbreviation.toUpperCase() === abbr
  );
}

export function isUpcomingLateGame(game: LateNightGame, now = new Date()): boolean {
  if (game.status === "in-progress") return true;
  if (game.status === "final") return false;
  const kickoff = parseUtc(game.kickoffUtc);
  if (!kickoff) return game.status === "scheduled";
  return kickoff.getTime() >= now.getTime() - 15 * 60 * 1000;
}

export type LateNightNightGroup = {
  nightKey: string;
  nightLabel: string;
  games: LateNightGame[];
};

export type LateNightSlateGroup = {
  key: string;
  heading: string;
  weekLabel: string;
  nights: LateNightNightGroup[];
};

function nightGroups(games: LateNightGame[]): LateNightNightGroup[] {
  const byNight = new Map<string, LateNightGame[]>();
  for (const game of games) {
    const list = byNight.get(game.nightKey) ?? [];
    list.push(game);
    byNight.set(game.nightKey, list);
  }

  return [...byNight.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([nightKey, grouped]) => ({
      nightKey,
      nightLabel: grouped[0]?.nightLabel ?? nightKey,
      games: [...grouped].sort((left, right) =>
        left.kickoffUtc.localeCompare(right.kickoffUtc),
      ),
    }));
}

/** One section per NFL week, so later slates are not collapsed into a stub. */
export function groupLateGames(games: LateNightGame[]): LateNightSlateGroup[] {
  const byWeek = new Map<string, LateNightGame[]>();
  for (const game of games) {
    const list = byWeek.get(game.weekKey) ?? [];
    list.push(game);
    byWeek.set(game.weekKey, list);
  }

  return [...byWeek.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .flatMap(([weekKey, slateGames]) => {
      if (!slateGames.length) return [];
      const first = slateGames[0]!;
      return [
        {
          key: weekKey,
          heading: first.slateHeading,
          weekLabel: first.weekLabel,
          nights: nightGroups(slateGames),
        },
      ];
    });
}

/** Keep games on or after the UK calendar day the user is checking. */
export function fromCheckDayOnward(
  games: LateNightGame[],
  nowIso: string,
): LateNightGame[] {
  const today = ukDateKey(nowIso);
  return games.filter((game) => {
    if (game.status === "in-progress") return true;
    const day = ukDateKey(game.kickoffUtc);
    if (day === "unknown") return game.status === "scheduled";
    return day >= today;
  });
}

export function collectLateNightGames(slates: FixtureSlate[]): {
  games: LateNightGame[];
  error: FixturesFailure | null;
} {
  const games: LateNightGame[] = [];
  let error: FixturesFailure | null = null;

  for (const slate of slates) {
    if (!slate.fixtures.ok) {
      if (slate.relation === "this-week") error = slate.fixtures;
      continue;
    }

    const weekLabel = slate.fixtures.weekLabel || slate.ref.label;
    for (const game of slate.fixtures.games) {
      if (!isLateUkGame(game)) continue;
      games.push(toLateNightGame(game, slate, weekLabel));
    }
  }

  games.sort((left, right) => left.kickoffUtc.localeCompare(right.kickoffUtc));
  return { games, error };
}
