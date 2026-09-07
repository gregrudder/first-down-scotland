import {
  NEWS_CACHE_TAG,
  NEWS_ITEM_LIMIT,
  NEWS_REVALIDATE_SECONDS,
  nflNewsFeeds,
  type NewsFeed,
} from "@/data/news-feeds";
import { parseFeedItems } from "@/lib/rss";

const FETCH_TIMEOUT_MS = 8_000;

export type NewsArticle = {
  id: string;
  title: string;
  url: string;
  snippet: string;
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

async function fetchFeedXml(feed: NewsFeed): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(feed.url, {
      signal: controller.signal,
      next: {
        revalidate: NEWS_REVALIDATE_SECONDS,
        tags: [NEWS_CACHE_TAG],
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

export async function getNflNews(): Promise<NewsResult> {
  const fetchedAt = new Date().toISOString();
  const failedSources: string[] = [];
  const collected: NewsArticle[] = [];

  const results = await Promise.all(
    nflNewsFeeds.map(async (feed) => {
      try {
        return { feed, items: parseFeedItems(await fetchFeedXml(feed)) };
      } catch {
        return { feed, items: [] as ReturnType<typeof parseFeedItems> };
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

  if (articles.length === 0) {
    return {
      ok: false,
      fetchedAt,
      failedSources: nflNewsFeeds.map((feed) => feed.label),
      error:
        "None of the public news feeds answered just now. Headlines are not typed in by hand — try again in a few minutes.",
    };
  }

  return {
    ok: true,
    fetchedAt,
    articles,
    failedSources,
  };
}
