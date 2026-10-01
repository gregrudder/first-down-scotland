import { NextResponse } from "next/server";
import { discordInviteUrl } from "@/lib/discord";
import {
  buildKickoffCalendar,
  findTeam,
  gameById,
  gamesForTeam,
  gamesForWeek,
  matchupLabel,
  type KickoffGame,
} from "@/lib/uk-kickoff";

function icsResponse(body: string, filename: string) {
  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}

function notFound() {
  return new NextResponse("Not found", {
    status: 404,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function calendarFor(games: KickoffGame[], name: string) {
  return buildKickoffCalendar(games, {
    name,
    discordUrl: discordInviteUrl(),
  });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const gameId = url.searchParams.get("game");
  const teamAbbr = url.searchParams.get("team");
  const weekParam = url.searchParams.get("week");

  if (gameId) {
    const game = gameById(gameId);
    if (!game) return notFound();
    const name = `NFL: ${matchupLabel(game)}`;
    return icsResponse(calendarFor([game], name), `${game.id}.ics`);
  }

  if (teamAbbr) {
    const team = findTeam(teamAbbr);
    if (!team) return notFound();
    const games = gamesForTeam(team.abbreviation);
    if (games.length === 0) return notFound();
    return icsResponse(
      calendarFor(games, `${team.name} 2026 regular season (UK time)`),
      `${slug(team.shortName)}-2026-uk.ics`,
    );
  }

  if (weekParam) {
    if (!/^\d{1,2}$/.test(weekParam)) return notFound();
    const week = Number(weekParam);
    if (week < 1 || week > 18) return notFound();
    const games = gamesForWeek(week);
    if (games.length === 0) return notFound();
    return icsResponse(
      calendarFor(games, `NFL Week ${week} 2026 (UK time)`),
      `nfl-week-${week}-2026-uk.ics`,
    );
  }

  return notFound();
}
