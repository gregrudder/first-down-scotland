import type { NflGame } from "@/lib/espn";
import { nflHighlightsSearchUrl, shouldOfferHighlights } from "@/lib/highlights";

export function GameHighlights({ game }: { game: NflGame }) {
  if (!shouldOfferHighlights(game)) return null;

  return (
    <div className="fds-spoiler mt-4 border-t border-line pt-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
        Highlights
      </p>
      <p className="mt-1 text-sm leading-6 text-cream-dim">
        Official NFL YouTube search for this match-up. We link out and do not
        embed. Titles and thumbnails on YouTube often name the winner or the
        score.
      </p>
      <p className="mt-2 text-sm">
        <a
          href={nflHighlightsSearchUrl(game)}
          className="font-semibold text-gold hover:text-gold-soft"
          target="_blank"
          rel="noreferrer"
        >
          Search NFL YouTube →
        </a>
      </p>
    </div>
  );
}
