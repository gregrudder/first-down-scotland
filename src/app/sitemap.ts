import type { MetadataRoute } from "next";
import { getLessonSlugs } from "@/data/lessons";
import { getPlaySlugs } from "@/data/plays";
import { getTeamSlugs } from "@/data/team-profiles";
import { absoluteUrl } from "@/lib/site";

const staticRoutes = [
  "/",
  "/learn",
  "/learn/quiz",
  "/learn/draft-prospects",
  "/mini-games",
  "/mini-games/rules",
  "/mini-games/who-am-i",
  "/mini-games/downs",
  "/mini-games/rivalries",
  "/glossary",
  "/this-week",
  "/late-night-diary",
  "/scores",
  "/score-history",
  "/standings",
  "/rookies",
  "/news",
  "/news/fantasy",
  "/podcasts",
  "/watch",
  "/film-room",
  "/watch-near-you",
  "/community",
  "/fan-map",
  "/fan-map/add",
  "/feedback",
  "/privacy",
  "/history",
  "/teams",
  "/pick-your-team",
  "/pick-your-team/choose",
  "/about",
] as const;

const hourlyPaths = new Set<string>([
  "/this-week",
  "/late-night-diary",
  "/scores",
  "/standings",
  "/rookies",
  "/news",
  "/news/fantasy",
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
    ...slugRoutes(getLessonSlugs, "/learn"),
    ...slugRoutes(getPlaySlugs, "/learn/plays"),
    ...slugRoutes(getTeamSlugs, "/teams"),
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
