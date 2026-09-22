import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getGuide,
  getGuideSlugs,
  guideHrefs,
  guidePlainText,
  guides,
  guideWordCount,
} from "./index";

const HUBS = ["/learn", "/fan-map", "/community", "/late-night-diary", "/watch", "/this-week"];

describe("NFL guides", () => {
  it("publishes at least eight unique long reads", () => {
    assert.ok(guides.length >= 8);
    const slugs = getGuideSlugs();
    assert.equal(new Set(slugs).size, slugs.length);
    for (const slug of slugs) {
      assert.equal(getGuide(slug)?.slug, slug);
    }
  });

  it("keeps each guide in the length we promised, without dash punctuation", () => {
    for (const guide of guides) {
      const prose = guidePlainText(guide);
      assert.ok(
        guideWordCount(guide) >= 800,
        `${guide.slug} is only ${guideWordCount(guide)} words`,
      );
      assert.equal(prose.includes("\u2014"), false, `${guide.slug} has an em dash`);
      assert.equal(prose.includes("\u2013"), false, `${guide.slug} has an en dash`);
      assert.ok(guide.title.length > 10);
      assert.ok(guide.description.length > 40);
      assert.ok(guide.blurb.length > 40);
      assert.ok(guide.blocks.some((block) => block.type === "h2"));
    }
  });

  it("links the guides into the rest of the site", () => {
    const all = new Set(guides.flatMap((guide) => guideHrefs(guide)));
    for (const hub of HUBS) {
      assert.ok(all.has(hub), `missing hub link ${hub}`);
    }
    for (const guide of guides) {
      const hrefs = guideHrefs(guide);
      assert.ok(hrefs.length >= 4, `${guide.slug} is thin on internal links`);
      for (const href of hrefs) {
        assert.match(href, /^\/[a-z0-9/-]+$/);
      }
    }
  });
});
