import type { MetadataRoute } from "next";
import { getGuideSlugs } from "@/data/guides";
import { getLessonSlugs } from "@/data/lessons";
import { getMiniGameSlugs } from "@/data/mini-games";
import { getPlaySlugs } from "@/data/plays";
import { thinSitemapPathSet } from "@/lib/indexing";
import { absoluteUrl } from "@/lib/site";

/**
 * Club templates (/teams/[slug]) and the live-data shells in thinSitemapPaths
 * stay in the app for fans. They are noindex and omitted here so crawl focuses
 * on lessons, guides, the fan map, and About / Privacy / Terms / Contact.
 */
const staticRoutes = [
  "/",
  "/guides",
  "/learn",
  "/learn/quiz",
  "/learn/draft-prospects",
  "/mini-games",
  "/glossary",
  "/score-history",
  "/standings",
  "/rookies",
  "/news",
  "/podcasts",
  "/watch",
  "/film-room",
  "/watch-near-you",
  "/community",
  "/fan-map",
  "/fan-map/add",
  "/contact",
  "/privacy",
  "/terms",
  "/history",
  "/teams",
  "/pick-your-team",
  "/pick-your-team/choose",
  "/about",
].filter((path) => !thinSitemapPathSet.has(path));

const hourlyPaths = new Set<string>([
  "/standings",
  "/rookies",
  "/news",
  "/learn/draft-prospects",
]);

function slugRoutes(load: () => string[], prefix: string): string[] {
  try {
    const slugs = load();
    if (!Array.isArray(slugs)) return [];
    return slugs.flatMap((slug) => {
      if (typeof slug !== "string") return [];
      const clean = slug.trim();
      if (!clean || /[/?#]/.test(clean)) return [];
      return [`${prefix}/${clean}`];
    });
  } catch (error) {
    console.error(`sitemap: ${prefix} slugs failed`, error);
    return [];
  }
}

function sitemapEntry(path: string): MetadataRoute.Sitemap[number] | null {
  try {
    return {
      url: absoluteUrl(path),
      changeFrequency: hourlyPaths.has(path) ? "hourly" : "weekly",
      priority: path === "/" ? 1 : 0.7,
    };
  } catch (error) {
    console.error("sitemap: skipped path", path, error);
    return null;
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...staticRoutes,
    ...slugRoutes(getGuideSlugs, "/guides"),
    ...slugRoutes(getLessonSlugs, "/learn"),
    ...slugRoutes(getPlaySlugs, "/learn/plays"),
    ...slugRoutes(getMiniGameSlugs, "/mini-games"),
  ];

  const entries = paths
    .map(sitemapEntry)
    .filter((entry): entry is MetadataRoute.Sitemap[number] => entry !== null);

  if (entries.length > 0) return entries;

  return [
    {
      url: absoluteUrl("/"),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
