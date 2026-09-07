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
    "/watch",
    "/watch-near-you",
    "/community",
    "/pick-your-team",
    "/about",
  ];
  const lessonRoutes = getLessonSlugs().map((slug) => `/learn/${slug}`);
  const playRoutes = getPlaySlugs().map((slug) => `/learn/plays/${slug}`);

  return [...staticRoutes, ...lessonRoutes, ...playRoutes].map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: path === "/this-week" ? "hourly" : "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
