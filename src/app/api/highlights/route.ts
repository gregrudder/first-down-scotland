import { NextRequest, NextResponse } from "next/server";
import { getTeam } from "@/data/teams";
import {
  HIGHLIGHTS_LIVE_REVALIDATE_SECONDS,
  HIGHLIGHTS_REVALIDATE_SECONDS,
  nflHighlightsSearchUrl,
  resolveGameHighlight,
  shouldOfferHighlights,
  type HighlightGame,
} from "@/lib/highlights";
import type { GameStatus } from "@/lib/espn";

export const revalidate = 600;

const ABBR_RE = /^[A-Za-z]{2,4}$/;
const GAME_ID_RE = /^[A-Za-z0-9._-]{1,48}$/;

function parseStatus(raw: string | null): GameStatus {
  if (raw === "in-progress" || raw === "final" || raw === "scheduled" || raw === "other") {
    return raw;
  }
  return "other";
}

function parseKickoff(raw: string | null): string | undefined {
  if (!raw) return undefined;
  const time = Date.parse(raw);
  if (!Number.isFinite(time)) return undefined;
  return new Date(time).toISOString();
}

function cacheSeconds(status: GameStatus): number {
  return status === "in-progress" ? HIGHLIGHTS_LIVE_REVALIDATE_SECONDS : HIGHLIGHTS_REVALIDATE_SECONDS;
}

export async function GET(request: NextRequest) {
  const awayAbbr = (request.nextUrl.searchParams.get("away") ?? "").trim().toUpperCase();
  const homeAbbr = (request.nextUrl.searchParams.get("home") ?? "").trim().toUpperCase();
  const gameIdRaw = (request.nextUrl.searchParams.get("gameId") ?? "").trim();
  const status = parseStatus(request.nextUrl.searchParams.get("status"));
  const kickoffUtc = parseKickoff(request.nextUrl.searchParams.get("kickoff"));

  if (!ABBR_RE.test(awayAbbr) || !ABBR_RE.test(homeAbbr)) {
    return NextResponse.json({ error: "Unknown match-up." }, { status: 400 });
  }

  const awayTeam = getTeam(awayAbbr);
  const homeTeam = getTeam(homeAbbr);
  if (!awayTeam || !homeTeam) {
    return NextResponse.json({ error: "Unknown team." }, { status: 400 });
  }

  const gameId = GAME_ID_RE.test(gameIdRaw)
    ? gameIdRaw
    : `${awayTeam.abbreviation}-${homeTeam.abbreviation}-${kickoffUtc ?? "week"}`;

  const game: HighlightGame = {
    id: gameId,
    status,
    kickoffUtc,
    away: {
      name: awayTeam.name,
      shortName: awayTeam.shortName,
      abbreviation: awayTeam.abbreviation,
    },
    home: {
      name: homeTeam.name,
      shortName: homeTeam.shortName,
      abbreviation: homeTeam.abbreviation,
    },
  };

  const ttl = cacheSeconds(status);
  const lookup = shouldOfferHighlights(game)
    ? await resolveGameHighlight(game)
    : { watchUrl: null, searchUrl: nflHighlightsSearchUrl(game) };

  return NextResponse.json(
    {
      watchUrl: lookup.watchUrl,
      searchUrl: lookup.searchUrl,
    },
    {
      headers: {
        "Cache-Control": `public, s-maxage=${ttl}, stale-while-revalidate=${HIGHLIGHTS_REVALIDATE_SECONDS}`,
      },
    },
  );
}
