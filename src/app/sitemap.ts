import type { MetadataRoute } from "next";
import { getLessonSlugs } from "@/data/lessons";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "/",
    "/learn",
    "/glossary",
    "/this-week",
    "/watch",
    "/community",
    "/pick-your-team",
    "/about",
  ];
  const lessonRoutes = getLessonSlugs().map((slug) => `/learn/${slug}`);

  return [...staticRoutes, ...lessonRoutes].map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: path === "/this-week" ? "hourly" : "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
