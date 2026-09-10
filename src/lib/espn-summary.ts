export const ESPN_SUMMARY_CACHE_TAG = "game-reports";
export const ESPN_SUMMARY_REVALIDATE_SECONDS = 300;

const SUMMARY_URL =
  "https://site.api.espn.com/apis/site/v2/sports/football/nfl/summary";

const FETCH_TIMEOUT_MS = 8_000;

export type SummaryCache = {
  revalidate: number;
  tags: string[];
};

/**
 * ESPN’s per-game summary. Same public API family as the scoreboard.
 * Used for recap articles and scoring plays (touchdown scorers).
 */
export async function fetchEspnSummaryJson(
  gameId: string,
  cache: SummaryCache,
): Promise<unknown | null> {
  if (!/^\d+$/.test(gameId)) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const url = `${SUMMARY_URL}?event=${encodeURIComponent(gameId)}`;
    const response = await fetch(url, {
      signal: controller.signal,
      next: {
        revalidate: cache.revalidate,
        tags: cache.tags,
      },
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
