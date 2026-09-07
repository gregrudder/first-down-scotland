import { decodeEntities } from "@/lib/html-entities";

const IMAGE_HOST_SUFFIXES = [
  ".espncdn.com",
  ".bbci.co.uk",
  ".bbcimg.co.uk",
  ".guim.co.uk",
  ".pcdn.co",
  ".wp.com",
  ".rotowire.com",
  ".thefantasyfootballers.com",
];

const IMAGE_HOSTS = new Set([
  "a.espncdn.com",
  "ichef.bbci.co.uk",
  "i.guim.co.uk",
  "thefantasyfootballers.com",
  "www.thefantasyfootballers.com",
  "www.rotowire.com",
]);

export function sanitizeImageUrl(raw: string | undefined | null): string | null {
  if (!raw) return null;
  let value = decodeEntities(raw).trim();
  if (!value) return null;
  if (/^\/\//.test(value)) value = `https:${value}`;
  if (/^http:\/\//i.test(value)) value = `https://${value.slice(7)}`;
  if (!/^https:\/\//i.test(value) || value.length > 2000) return null;

  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return null;
    if (!url.hostname.includes(".")) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function isAllowedNewsImageHost(src: string): boolean {
  try {
    const host = new URL(src).hostname.toLowerCase();
    if (IMAGE_HOSTS.has(host)) return true;
    return IMAGE_HOST_SUFFIXES.some((suffix) => host.endsWith(suffix));
  } catch {
    return false;
  }
}

type ImageCandidate = {
  url: string;
  width: number;
};

function attr(tag: string, name: string): string {
  const match = tag.match(new RegExp(`${name}\\s*=\\s*["']([^"']+)["']`, "i"));
  return match?.[1] ? decodeEntities(match[1]) : "";
}

function looksLikeImage(url: string, type: string): boolean {
  const lowerType = type.toLowerCase();
  if (lowerType.startsWith("video/") || lowerType.startsWith("audio/")) return false;
  if (lowerType.startsWith("image/")) return true;
  if (/\.(jpe?g|png|gif|webp|avif)(\?|#|$)/i.test(url)) return true;
  return !lowerType;
}

function pickBestImage(candidates: ImageCandidate[]): string | null {
  if (candidates.length === 0) return null;
  const scored = [...candidates].sort((a, b) => {
    const score = (width: number) => -Math.abs((width || 480) - 640);
    return score(b.width) - score(a.width);
  });
  return scored[0]?.url ?? null;
}

function imagesFromMediaTags(block: string): ImageCandidate[] {
  const tags = [
    ...block.matchAll(
      /<(media:content|media:thumbnail|enclosure|itunes:image)\b([^>]*?)\/?>/gi,
    ),
  ];

  const found: ImageCandidate[] = [];
  for (const match of tags) {
    const attrs = match[2] ?? "";
    const url = sanitizeImageUrl(
      attr(attrs, "url") || attr(attrs, "href"),
    );
    if (!url) continue;
    const type = attr(attrs, "type") || attr(attrs, "medium");
    if (!looksLikeImage(url, type === "image" ? "image/" : type)) continue;
    const width = Number(attr(attrs, "width")) || 0;
    found.push({ url, width });
  }
  return found;
}

function firstHtmlImage(markup: string): string | null {
  const decoded = decodeEntities(markup);
  const images = [...decoded.matchAll(/<img\b[^>]*>/gi)];
  for (const match of images) {
    const tag = match[0];
    const url = sanitizeImageUrl(attr(tag, "src") || attr(tag, "data-src"));
    if (!url) continue;
    const width = Number(attr(tag, "width")) || 0;
    const height = Number(attr(tag, "height")) || 0;
    if ((width && width < 80) || (height && height < 80)) continue;
    if (/pixel|spacer|tracking|1x1|gravatar|emoji/i.test(url)) continue;
    return url;
  }
  return null;
}

function rawInnerTag(block: string, name: string): string {
  const match = block.match(
    new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, "i"),
  );
  return match?.[1] ?? "";
}

export function extractFeedImage(block: string): string | null {
  const fromMedia = pickBestImage(imagesFromMediaTags(block));
  if (fromMedia) return fromMedia;

  const html =
    rawInnerTag(block, "content:encoded") ||
    rawInnerTag(block, "description") ||
    rawInnerTag(block, "content") ||
    rawInnerTag(block, "summary");
  return firstHtmlImage(html);
}

export function extractOgImage(html: string): string | null {
  const head = html.slice(0, 80_000);
  const tags = [...head.matchAll(/<meta\b[^>]*>/gi)].map((match) => match[0]);
  for (const tag of tags) {
    const property = (attr(tag, "property") || attr(tag, "name")).toLowerCase();
    if (property !== "og:image" && property !== "twitter:image") continue;
    const url = sanitizeImageUrl(attr(tag, "content"));
    if (url) return url;
  }
  return null;
}
