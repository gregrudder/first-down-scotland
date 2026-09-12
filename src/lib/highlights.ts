import { decodeEntities } from "@/lib/html-entities";
import type { GameStatus, NflGame, TeamSide } from "@/lib/espn";

/** Official NFL YouTube channel (`youtube.com/@NFL`). */
export const NFL_YOUTUBE_CHANNEL_ID = "UCDVYQ4Zhbm3S2dlz7P1GBDg";

export const HIGHLIGHTS_CACHE_TAG = "highlights";
export const HIGHLIGHTS_REVALIDATE_SECONDS = 3600;
export const HIGHLIGHTS_LIVE_REVALIDATE_SECONDS = 600;

const YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";
const FETCH_TIMEOUT_MS = 8_000;
const YOUTUBE_VIDEO_ID_RE = /^[a-zA-Z0-9_-]{11}$/;

export type HighlightGame = {
  id: string;
  status: GameStatus;
  kickoffUtc?: string;
  home: Pick<TeamSide, "name" | "shortName" | "abbreviation">;
  away: Pick<TeamSide, "name" | "shortName" | "abbreviation">;
};

export type HighlightLookup = {
  videoId: string | null;
  searchUrl: string;
};

type YoutubeSearchItem = {
  id?: { videoId?: unknown };
  snippet?: {
    title?: unknown;
    channelTitle?: unknown;
    channelId?: unknown;
  };
};

type YoutubeSearchResponse = {
  items?: unknown;
  error?: { message?: unknown; errors?: unknown };
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Official NFL YouTube channel search for this match-up.
 * Used when we have no API key, no embeddable official clip, or the viewer
 * still wants to leave the site.
 */
export function nflHighlightsSearchUrl(game: Pick<HighlightGame, "away" | "home">): string {
  const query = highlightsSearchQuery(game);
  return `https://www.youtube.com/@NFL/search?query=${encodeURIComponent(query)}`;
}

export function highlightsSearchQuery(game: Pick<HighlightGame, "away" | "home">): string {
  return `${game.away.shortName} ${game.home.shortName} highlights`;
}

export function shouldOfferHighlights(game: Pick<HighlightGame, "status">): boolean {
  return game.status === "in-progress" || game.status === "final";
}

export function isYoutubeVideoId(value: string): boolean {
  return YOUTUBE_VIDEO_ID_RE.test(value);
}

/** Privacy-enhanced embed. No autoplay. The poster frame is still YouTube chrome. */
export function youtubeEmbedSrc(videoId: string): string {
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
  });
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}

export function highlightsApiPath(game: Pick<NflGame, "id" | "status" | "kickoffUtc" | "away" | "home">): string {
  const params = new URLSearchParams({
    away: game.away.abbreviation,
    home: game.home.abbreviation,
    gameId: game.id,
    status: game.status,
  });
  if (game.kickoffUtc) params.set("kickoff", game.kickoffUtc);
  return `/api/highlights?${params.toString()}`;
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function preferredChannel(
  channelTitle: string,
  channelId: string | undefined,
  game: HighlightGame,
): "nfl" | "team" | null {
  if (channelId === NFL_YOUTUBE_CHANNEL_ID) return "nfl";
  const title = channelTitle.trim().toLowerCase();
  if (title === "nfl" || title === "nfl network" || title === "nfl films") return "nfl";

  const officialNames = [game.home.name, game.away.name].map((name) => name.toLowerCase());
  if (officialNames.some((name) => title === name || title.startsWith(`${name} `))) {
    return "team";
  }
  return null;
}

function titleHasBothTeams(title: string, game: HighlightGame): boolean {
  const away = game.away.shortName.toLowerCase();
  const home = game.home.shortName.toLowerCase();
  const awayAbbr = game.away.abbreviation.toLowerCase();
  const homeAbbr = game.home.abbreviation.toLowerCase();
  const hasAway = title.includes(away) || title.includes(awayAbbr);
  const hasHome = title.includes(home) || title.includes(homeAbbr);
  return hasAway && hasHome;
}

function titleHasOneTeam(title: string, game: HighlightGame): boolean {
  const needles = [
    game.away.shortName,
    game.home.shortName,
    game.away.abbreviation,
    game.home.abbreviation,
  ].map((value) => value.toLowerCase());
  return needles.some((needle) => title.includes(needle));
}

function isPlausibleHighlight(
  title: string,
  channelPref: "nfl" | "team",
  game: HighlightGame,
): boolean {
  if (/\bpress conference\b|\bmedia avail|\bmic['’]d up\b|\bfantasy\b/.test(title)) {
    return false;
  }
  if (channelPref === "nfl") {
    // Avoid weekly round-ups: the official game package names both sides.
    return titleHasBothTeams(title, game);
  }
  return title.includes("highlight") && titleHasOneTeam(title, game);
}

function scoreItem(item: YoutubeSearchItem, game: HighlightGame): { videoId: string; score: number } | null {
  const videoId = asString(item.id?.videoId);
  if (!videoId || !isYoutubeVideoId(videoId)) return null;

  const rawTitle = asString(item.snippet?.title);
  const channelTitle = asString(item.snippet?.channelTitle);
  if (!rawTitle || !channelTitle) return null;

  const title = decodeEntities(rawTitle).toLowerCase();
  const channelId = asString(item.snippet?.channelId);
  const channelPref = preferredChannel(channelTitle, channelId, game);
  if (!channelPref) return null;
  if (!isPlausibleHighlight(title, channelPref, game)) return null;

  let score = channelPref === "nfl" ? 50 : 30;
  if (title.includes("highlight")) score += 20;
  if (title.includes("game highlight")) score += 5;
  if (titleHasBothTeams(title, game)) score += 15;
  else if (titleHasOneTeam(title, game)) score += 4;
  if (/\bpreview\b|\bpre-game\b|\bpregame\b/.test(title)) score -= 15;

  return { videoId, score };
}

export function pickOfficialHighlightVideoId(
  items: YoutubeSearchItem[],
  game: HighlightGame,
): string | null {
  let best: { videoId: string; score: number } | null = null;
  for (const item of items) {
    const ranked = scoreItem(item, game);
    if (!ranked) continue;
    if (!best || ranked.score > best.score) best = ranked;
  }
  return best?.videoId ?? null;
}

function parseSearchItems(payload: unknown): YoutubeSearchItem[] {
  if (!isRecord(payload) || !Array.isArray(payload.items)) return [];
  return payload.items.filter(isRecord) as YoutubeSearchItem[];
}

async function youtubeSearch(params: URLSearchParams, revalidate: number): Promise<YoutubeSearchItem[]> {
  const key = process.env.YOUTUBE_API_KEY?.trim();
  if (!key) return [];

  const url = new URL(YOUTUBE_SEARCH_URL);
  url.search = params.toString();
  url.searchParams.set("key", key);
  url.searchParams.set("part", "snippet");
  url.searchParams.set("type", "video");
  url.searchParams.set("maxResults", "8");
  url.searchParams.set("safeSearch", "none");
  url.searchParams.set("videoEmbeddable", "true");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(url.toString(), {
      signal: controller.signal,
      next: {
        revalidate,
        tags: [HIGHLIGHTS_CACHE_TAG],
      },
      headers: { Accept: "application/json" },
    });
    const payload = (await response.json()) as YoutubeSearchResponse;
    if (!response.ok) return [];
    return parseSearchItems(payload);
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
  }
}

function publishedAfterParam(kickoffUtc: string | undefined): string | undefined {
  if (!kickoffUtc) return undefined;
  const kickoff = Date.parse(kickoffUtc);
  if (!Number.isFinite(kickoff)) return undefined;
  // A little slack so a same-day upload with a slightly early timestamp still matches.
  return new Date(kickoff - 6 * 60 * 60 * 1000).toISOString();
}

/**
 * Resolve an embeddable official clip. Never returns titles or thumbnails:
 * those nearly always name the winner or the score.
 *
 * No `YOUTUBE_API_KEY`: skip the Data API and return the NFL search URL only.
 */
export async function resolveGameHighlight(game: HighlightGame): Promise<HighlightLookup> {
  const searchUrl = nflHighlightsSearchUrl(game);
  if (!shouldOfferHighlights(game)) {
    return { videoId: null, searchUrl };
  }
  if (!process.env.YOUTUBE_API_KEY?.trim()) {
    return { videoId: null, searchUrl };
  }

  const revalidate =
    game.status === "in-progress"
      ? HIGHLIGHTS_LIVE_REVALIDATE_SECONDS
      : HIGHLIGHTS_REVALIDATE_SECONDS;

  const query = highlightsSearchQuery(game);
  const publishedAfter = publishedAfterParam(game.kickoffUtc);

  const nflParams = new URLSearchParams({
    q: query,
    channelId: NFL_YOUTUBE_CHANNEL_ID,
    order: "relevance",
  });
  if (publishedAfter) nflParams.set("publishedAfter", publishedAfter);

  const nflItems = await youtubeSearch(nflParams, revalidate);
  const nflId = pickOfficialHighlightVideoId(nflItems, game);
  if (nflId) return { videoId: nflId, searchUrl };

  const wideParams = new URLSearchParams({
    q: `NFL ${query}`,
    order: "relevance",
  });
  if (publishedAfter) wideParams.set("publishedAfter", publishedAfter);

  const wideItems = await youtubeSearch(wideParams, revalidate);
  const wideId = pickOfficialHighlightVideoId(wideItems, game);
  return { videoId: wideId, searchUrl };
}
