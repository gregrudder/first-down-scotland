import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { ADSENSE_CLIENT, ADSENSE_META_NAME, adsenseScriptSrc } from "./adsense";

describe("AdSense publisher tags", () => {
  it("points the publisher script at the ads.txt client", () => {
    assert.equal(ADSENSE_CLIENT, "ca-pub-1747465358377243");
    assert.equal(ADSENSE_META_NAME, "google-adsense-account");
    assert.equal(
      adsenseScriptSrc(),
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1747465358377243",
    );
  });

  it("puts the meta tag and script in the root layout head", () => {
    const layout = readFileSync(new URL("../app/layout.tsx", import.meta.url), "utf8");
    assert.match(layout, /google-adsense-account/);
    assert.match(layout, /adsenseScriptSrc\(\)/);
    assert.equal(layout.includes("isAdsenseEnabled"), false);
    const ads = readFileSync(new URL("../../public/ads.txt", import.meta.url), "utf8");
    assert.match(ads, /google\.com, pub-1747465358377243, DIRECT, f08c47fec0942fa0/);
  });
});
