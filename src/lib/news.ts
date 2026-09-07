import {
  FANTASY_NEWS_CACHE_TAG,
  NEWS_CACHE_TAG,
  NEWS_ITEM_LIMIT,
  NEWS_REVALIDATE_SECONDS,
  fantasyNewsFeeds,
  nflNewsFeeds,
  type NewsFeed,
} from "@/data/news-feeds";
import { extractOgImage } from "@/lib/news-image";
import { parseFeedItems, type ParsedRssItem } from "@/lib/rss";

const FETCH_TIMEOUT_MS = 8_000;
const OG_IMAGE_TIMEOUT_MS = 3_000;

export type NewsArticle = {
  id: string;
  title: string;
  url: string;
  snippet: string;
  imageUrl: string | null;
  source: string;
  sourceId: string;
  publishedAt: string | null;
};

export type NewsSuccess = {
  ok: true;
  fetchedAt: string;
  articles: NewsArticle[];
  failedSources: string[];
};

export type NewsFailure = {
  ok: false;
  fetchedAt: string;
  error: string;
  failedSources: string[];
};

export type NewsResult = NewsSuccess | NewsFailure;

async function fetchFeedXml(feed: NewsFeed, cacheTag: string): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(feed.url, {
      signal: controller.signal,
      next: {
        revalidate: NEWS_REVALIDATE_SECONDS,
        tags: [cacheTag],
      },
      headers: {
        Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml",
        "User-Agent": "FirstDownScotland/1.0 (https://first-down-scotland.vercel.app)",
      },
    });

    if (!response.ok) {
      throw new Error(`${feed.label} returned ${response.status}`);
    }

    return await response.text();
  } finally {
    clearTimeout(timer);
  }
}

function titleKey(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

const OTHER_SPORT =
  /baseball|mlb|nba|nhl|soccer|premier league|nascar|wnba|\bf1\b|formula 1|college fantasy football|\bcfb\b/i;
const NFL_FANTASY =
  /nfl|fantasy football|american football|quarterback|running back|wide receiver|tight end|waiver|start.?sit|touchdown|draft/i;

export function isNflFantasyItem(item: Pick<ParsedRssItem, "title" | "snippet">): boolean {
  const text = `${item.title} ${item.snippet}`;
  if (OTHER_SPORT.test(text)) return false;
  return NFL_FANTASY.test(text);
}

async function getNewsFromFeeds(
  feeds: NewsFeed[],
  cacheTag: string,
  keep?: (item: ParsedRssItem, feed: NewsFeed) => boolean,
): Promise<NewsResult> {
  const fetchedAt = new Date().toISOString();
  const failedSources: string[] = [];
  const collected: NewsArticle[] = [];

  const results = await Promise.all(
    feeds.map(async (feed) => {
      try {
        const items = parseFeedItems(await fetchFeedXml(feed, cacheTag));
        return { feed, items: keep ? items.filter((item) => keep(item, feed)) : items };
      } catch {
        return { feed, items: [] as ParsedRssItem[] };
      }
    }),
  );

  for (const { feed, items } of results) {
    if (items.length === 0) {
      failedSources.push(feed.label);
      continue;
    }

    for (const item of items) {
      collected.push({
        id: `${feed.id}:${item.url}`,
        title: item.title,
        url: item.url,
        snippet: item.snippet,
        imageUrl: item.imageUrl,
        source: feed.label,
        sourceId: feed.id,
        publishedAt: item.publishedAt,
      });
    }
  }

  const seenUrls = new Set<string>();
  const seenTitles = new Set<string>();
  const articles = collected
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""))
    .filter((article) => {
      const url = article.url;
      const title = titleKey(article.title);
      if (seenUrls.has(url) || (title && seenTitles.has(title))) return false;
      seenUrls.add(url);
      if (title) seenTitles.add(title);
      return true;
    })
    .slice(0, NEWS_ITEM_LIMIT);

  const withImages = await attachOgImages(articles, cacheTag);

  if (withImages.length === 0) {
    return {
      ok: false,
      fetchedAt,
      failedSources: feeds.map((feed) => feed.label),
      error:
        "None of the public news feeds answered just now. Headlines are not typed in by hand — try again in a few minutes.",
    };
  }

  return {
    ok: true,
    fetchedAt,
    articles: withImages,
    failedSources,
  };
}

async function fetchOgImage(articleUrl: string, cacheTag: string): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), OG_IMAGE_TIMEOUT_MS);

  try {
    const response = await fetch(articleUrl, {
      signal: controller.signal,
      next: {
        revalidate: NEWS_REVALIDATE_SECONDS,
        tags: [cacheTag],
      },
      headers: {
        Accept: "text/html",
        "User-Agent": "FirstDownScotland/1.0 (https://first-down-scotland.vercel.app)",
      },
    });
    if (!response.ok) return null;
    return extractOgImage(await response.text());
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function attachOgImages(
  articles: NewsArticle[],
  cacheTag: string,
): Promise<NewsArticle[]> {
  return Promise.all(
    articles.map(async (article) => {
      if (article.imageUrl) return article;
      const imageUrl = await fetchOgImage(article.url, cacheTag);
      return imageUrl ? { ...article, imageUrl } : article;
    }),
  );
}

export function getNflNews(): Promise<NewsResult> {
  return getNewsFromFeeds(nflNewsFeeds, NEWS_CACHE_TAG);
}

export function getFantasyNews(): Promise<NewsResult> {
  return getNewsFromFeeds(fantasyNewsFeeds, FANTASY_NEWS_CACHE_TAG, (item, feed) => {
    if (feed.id !== "espn-fantasy") return true;
    return isNflFantasyItem(item);
  });
}
