import type { Metadata } from "next";

/**
 * Templated club pages and live-data shells.
 * Fans can still open them. Crawlers should follow links and not index the URL.
 */
export const thinPageRobots: NonNullable<Metadata["robots"]> = {
  index: false,
  follow: true,
};

/**
 * Omitted from sitemap.xml. /teams itself stays; /teams/[slug] is excluded in the sitemap builder.
 */
export const thinSitemapPaths = [
  "/this-week",
  "/late-night-diary",
  "/scores",
  "/news/fantasy",
] as const;

export const thinSitemapPathSet = new Set<string>(thinSitemapPaths);
