import type { MetadataRoute } from "next";
import { getLessonSlugs } from "@/data/lessons";
import { getPlaySlugs } from "@/data/plays";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "/",
    "/learn",
    "/glossary",
    "/this-week",
    "/news",
    "/news/fantasy",
    "/watch",
    "/community",
    "/about",
  ];
  const lessonRoutes = getLessonSlugs().map((slug) => `/learn/${slug}`);
  const playRoutes = getPlaySlugs().map((slug) => `/learn/plays/${slug}`);

  return [...staticRoutes, ...lessonRoutes, ...playRoutes].map((path) => ({
    url: absoluteUrl(path),
    changeFrequency:
      path === "/this-week" || path === "/news" || path === "/news/fantasy"
        ? "hourly"
        : "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
