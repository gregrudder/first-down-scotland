import { livePubs } from "@/data/pubs";
import { plays } from "@/data/plays";
import type { NflTeam } from "@/data/teams";
import type { NflGame, TeamSide } from "@/lib/espn";
import { ukHourNumber, ukWeekdayShort } from "@/lib/time";
import { watchHintForGame } from "@/lib/watch-hints";

/** Weekly explainer is free. A later paywall should wrap this card, not the fixture slate. */
export const SUNDAY_CARD_IS_FREE = true;

export type LearnTieIn = {
  href: string;
  label: string;
  why: string;
};

export type SundayMatch = {
  game: NflGame;
  side: "home" | "away";
  opponent: TeamSide;
};

export type SundayExplainer = {
  watchFor: string;
  learn: LearnTieIn;
  watchHint: string;
  pubHint: string;
};

export function findTeamGame(games: NflGame[], abbreviation: string): SundayMatch | null {
  const abbr = abbreviation.toUpperCase();
  const ranked = [...games].sort((a, b) => statusRank(a.status) - statusRank(b.status));
  for (const game of ranked) {
    if (game.home.abbreviation.toUpperCase() === abbr) {
      return { game, side: "home", opponent: game.away };
    }
    if (game.away.abbreviation.toUpperCase() === abbr) {
      return { game, side: "away", opponent: game.home };
    }
  }
  return null;
}

function statusRank(status: NflGame["status"]): number {
  if (status === "in-progress") return 0;
  if (status === "scheduled") return 1;
  if (status === "final") return 2;
  return 3;
}

export function buildSundayExplainer(
  team: NflTeam,
  match: SundayMatch,
  weekNumber: number | null,
): SundayExplainer {
  return {
    watchFor: watchForCopy(team, match),
    learn: learnTieIn(team, match.game, weekNumber),
    watchHint: watchHintForGame(match.game),
    pubHint: pubHintForGame(match.game),
  };
}

export function byeWeekExplainer(team: NflTeam, weekNumber: number | null): SundayExplainer {
  const learn = learnTieIn(team, null, weekNumber);
  return {
    watchFor: `${team.shortName} are not on this week’s ESPN slate. That is usually a bye, a gap between slates, or a week the feed has not published yet. Use the quiet: one lesson, or the Film room. Everyone else’s games are still listed below.`,
    learn,
    watchHint: "No kick-off to map until they are back on the board.",
    pubHint:
      "Scottish pubs that already list NFL Sundays are on Watch near you. A bye week is a good time to call ahead for the next one.",
  };
}

function watchForCopy(team: NflTeam, match: SundayMatch): string {
  const { game, side, opponent } = match;
  const place = side === "home" ? "at home" : "on the road";
  const vs = opponent.shortName;

  if (game.status === "in-progress") {
    return `${team.shortName} are on against the ${vs}. Find the ball, then the end zone they are attacking. That is enough for the next snap.`;
  }

  if (game.status === "final") {
    const score =
      typeof game.home.score === "number" && typeof game.away.score === "number"
        ? ` It finished ${game.away.score}–${game.home.score}.`
        : "";
    return `${team.shortName} have played the ${vs}.${score} If you missed it, the Film room is the calm way to catch the story. If you watched, notice whether the pocket held.`;
  }

  if (isUkInternational(game)) {
    return `${team.shortName} ${place} against the ${vs}, and it is a UK international kick-off. Ignore the US network name on the score bug. Find the line of scrimmage before the first snap, then just watch who is moving the ball.`;
  }

  if (team.tags.includes("defence")) {
    return `${team.shortName} ${place} against the ${vs}. Watch their defence first: how many people rush the quarterback, and whether the ${vs} can still throw behind that. Count the rushers. That is the whole trick.`;
  }

  if (team.tags.includes("offence")) {
    return `${team.shortName} ${place} against the ${vs}. Watch the quarterback first. Do they hand it off, throw, or scramble? If the pocket collapses, the play is already over for the offence.`;
  }

  return `${team.shortName} ${place} against the ${vs}. For two minutes, ignore the commentary. Find the ball, find the end zone they want, and notice which side is lined up over it. That is the sport.`;
}

function learnTieIn(team: NflTeam, game: NflGame | null, weekNumber: number | null): LearnTieIn {
  if (game && isUkInternational(game)) {
    return {
      href: "/learn/what-youre-watching",
      label: "The field, in plain English",
      why: "A UK kick-off is the easiest time to practise finding the end zones.",
    };
  }

  if (game && isLateUkKickoff(game)) {
    return {
      href: "/learn/the-clock",
      label: "The clock and game length",
      why: "Overnight US games feel endless until you know when the clock actually stops.",
    };
  }

  if (team.tags.includes("defence")) {
    return {
      href: "/learn/offence-and-defence",
      label: "Offence vs defence",
      why: "A defence-first side makes more sense once you can spot the rush and the coverage.",
    };
  }

  const play = plays[(Math.max(weekNumber ?? 1, 1) - 1) % plays.length];
  if (play) {
    return {
      href: `/learn/plays/${play.slug}`,
      label: play.title,
      why: play.watch,
    };
  }

  return {
    href: "/learn/what-to-look-for",
    label: "What to look for on television",
    why: "A short checklist for the score bug, the yellow line, and when to ignore the noise.",
  };
}

function isUkInternational(game: NflGame): boolean {
  const city = `${game.venueCity ?? ""} ${game.venue ?? ""}`.toLowerCase();
  return (
    city.includes("london") ||
    city.includes("wembley") ||
    city.includes("tottenham") ||
    city.includes("munich") ||
    city.includes("frankfurt") ||
    city.includes("berlin") ||
    city.includes("dublin")
  );
}

function isLateUkKickoff(game: NflGame): boolean {
  const hour = ukHourNumber(game.kickoffUtc);
  const day = ukWeekdayShort(game.kickoffUtc);
  if (hour === null) return false;
  return (day === "Mon" || day === "Tue" || day === "Fri") && hour <= 3;
}

export function pubHintForGame(game: NflGame | null): string {
  const live = livePubs();
  const names = live
    .slice(0, 3)
    .map((pub) => pub.name)
    .join(", ");
  const where = names ? ` ${names} already advertise NFL Sundays.` : "";

  if (!game) {
    return `A handful of Scottish pubs list the NFL.${where} Always call ahead: screens and packages change.`.trim();
  }

  const hour = ukHourNumber(game.kickoffUtc);
  const day = ukWeekdayShort(game.kickoffUtc);
  const sundayWindow =
    day === "Sun" || (day === "Mon" && hour !== null && hour < 3);

  if (sundayWindow) {
    return `This is the pub-friendly window.${where} Check Watch near you, then ring them: we do not know what is on their telly tonight.`;
  }

  return `Overnight and midweek games are harder in a pub. Game Pass or Sky at home is the usual UK move. For Sundays, Watch near you lists the Scottish spots we could confirm.`;
}
