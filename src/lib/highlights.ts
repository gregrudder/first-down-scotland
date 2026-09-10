import type { NflGame } from "@/lib/espn";

/**
 * Official NFL YouTube channel search for this match-up.
 *
 * The NFL does not allow these clips to play in-app (embeds are blocked), so
 * we link out. We do not fetch titles or thumbnails: those nearly always name
 * the winner or the score.
 */
export function nflHighlightsSearchUrl(game: Pick<NflGame, "away" | "home">): string {
  const query = `${game.away.shortName} ${game.home.shortName} highlights`;
  return `https://www.youtube.com/@NFL/search?query=${encodeURIComponent(query)}`;
}

export function shouldOfferHighlights(game: Pick<NflGame, "status">): boolean {
  return game.status === "in-progress" || game.status === "final";
}
