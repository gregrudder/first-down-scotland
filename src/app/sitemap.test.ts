import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getGuideSlugs } from "@/data/guides";
import { getLessonSlugs } from "@/data/lessons";
import { getTeamSlugs } from "@/data/team-profiles";
import { thinSitemapPaths } from "@/lib/indexing";
import sitemap from "./sitemap";

function pathOf(url: string): string {
  const pathname = new URL(url).pathname;
  if (pathname.length > 1 && pathname.endsWith("/")) return pathname.slice(0, -1);
  return pathname;
}

describe("sitemap", () => {
  it("omits thin shells and keeps the pages worth indexing", () => {
    const paths = new Set(sitemap().map((entry) => pathOf(entry.url)));

    for (const thin of thinSitemapPaths) {
      assert.equal(paths.has(thin), false, `${thin} should be out of the sitemap`);
    }
    for (const slug of getTeamSlugs()) {
      assert.equal(paths.has(`/teams/${slug}`), false, `/teams/${slug} should be out of the sitemap`);
    }
    assert.equal(paths.has("/feedback"), false);

    for (const rich of [
      "/",
      "/guides",
      "/learn",
      "/about",
      "/privacy",
      "/terms",
      "/contact",
      "/fan-map",
      "/teams",
    ]) {
      assert.equal(paths.has(rich), true, `${rich} should stay in the sitemap`);
    }
    for (const slug of getGuideSlugs()) {
      assert.equal(paths.has(`/guides/${slug}`), true, `/guides/${slug}`);
    }
    for (const slug of getLessonSlugs()) {
      assert.equal(paths.has(`/learn/${slug}`), true, `/learn/${slug}`);
    }
  });
});
