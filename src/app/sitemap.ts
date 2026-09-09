import type { MetadataRoute } from "next";
import { getLessonSlugs } from "@/data/lessons";
import { getPlaySlugs } from "@/data/plays";
import { getTeamSlugs } from "@/data/team-profiles";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "/",
    "/learn",
    "/learn/quiz",
    "/learn/draft-prospects",
    "/glossary",
    "/this-week",
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
    "/feedback",
    "/history",
    "/teams",
    "/pick-your-team",
    "/pick-your-team/choose",
    "/about",
  ];
  const lessonRoutes = getLessonSlugs().map((slug) => `/learn/${slug}`);
  const playRoutes = getPlaySlugs().map((slug) => `/learn/plays/${slug}`);
  const teamRoutes = getTeamSlugs().map((slug) => `/teams/${slug}`);

  return [...staticRoutes, ...lessonRoutes, ...playRoutes, ...teamRoutes].map((path) => ({
    url: absoluteUrl(path),
    changeFrequency:
      path === "/this-week" ||
      path === "/scores" ||
      path === "/standings" ||
      path === "/rookies" ||
      path === "/news" ||
      path === "/news/fantasy" ||
      path === "/learn/draft-prospects"
        ? "hourly"
        : "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
