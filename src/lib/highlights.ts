import type { NflGame } from "@/lib/espn";

/**
 * Official NFL YouTube channel search for this match-up.
 * No API key and no scrape: we do not fetch titles or thumbnails (those nearly
 * always name the winner or the score). The user leaves this site for YouTube.
 */
export function nflHighlightsSearchUrl(game: NflGame): string {
  const query = `${game.away.shortName} ${game.home.shortName} highlights`;
  return `https://www.youtube.com/@NFL/search?query=${encodeURIComponent(query)}`;
}

export function shouldOfferHighlights(game: NflGame): boolean {
  return game.status === "in-progress" || game.status === "final";
}
