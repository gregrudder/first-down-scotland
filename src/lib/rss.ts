import { decodeEntities } from "@/lib/html-entities";
import { extractFeedImage } from "@/lib/news-image";

export { decodeEntities };

export function stripMarkup(value: string): string {
  return decodeEntities(value)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function innerTag(block: string, name: string): string {
  const match = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, "i"));
  return match ? stripMarkup(match[1] ?? "") : "";
}

function atomLink(block: string): string {
  const href = block.match(/<link[^>]*href=["']([^"']+)["'][^>]*\/?>/i);
  return href?.[1] ? stripMarkup(href[1]) : "";
}

export function normalizeArticleUrl(raw: string): string {
  try {
    const url = new URL(raw.trim());
    url.hash = "";
    for (const key of [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "at_medium",
      "at_campaign",
    ]) {
      url.searchParams.delete(key);
    }
    return url.toString();
  } catch {
    return raw.trim();
  }
}

export type ParsedRssItem = {
  title: string;
  url: string;
  snippet: string;
  imageUrl: string | null;
  publishedAt: string | null;
};

function toIso(raw: string): string | null {
  if (!raw) return null;
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function parseFeedItems(xml: string): ParsedRssItem[] {
  const blocks = [
    ...xml.matchAll(/<item\b[\s\S]*?<\/item>/gi),
    ...xml.matchAll(/<entry\b[\s\S]*?<\/entry>/gi),
  ].map((match) => match[0]);

  return blocks
    .map((block) => {
      const title = innerTag(block, "title");
      const url =
        innerTag(block, "link") ||
        atomLink(block) ||
        innerTag(block, "guid") ||
        innerTag(block, "id");
      const snippet =
        innerTag(block, "description") ||
        innerTag(block, "summary") ||
        innerTag(block, "content");
      const publishedAt = toIso(
        innerTag(block, "pubDate") ||
          innerTag(block, "published") ||
          innerTag(block, "updated") ||
          innerTag(block, "dc:date"),
      );

      if (!title || !url || !/^https?:\/\//i.test(url)) return null;

      return {
        title,
        url: normalizeArticleUrl(url),
        snippet: snippet.slice(0, 280),
        imageUrl: extractFeedImage(block),
        publishedAt,
      };
    })
    .filter((item): item is ParsedRssItem => item !== null);
}
