import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { ADSENSE_CLIENT, adsenseScriptSrc, isAdsenseEnabled } from "./adsense";

const ORIGINAL = process.env.NEXT_PUBLIC_ADSENSE_ENABLED;

afterEach(() => {
  if (ORIGINAL === undefined) {
    delete process.env.NEXT_PUBLIC_ADSENSE_ENABLED;
  } else {
    process.env.NEXT_PUBLIC_ADSENSE_ENABLED = ORIGINAL;
  }
});

describe("AdSense gate", () => {
  it("stays off unless the flag is exactly true", () => {
    delete process.env.NEXT_PUBLIC_ADSENSE_ENABLED;
    assert.equal(isAdsenseEnabled(), false);

    process.env.NEXT_PUBLIC_ADSENSE_ENABLED = "";
    assert.equal(isAdsenseEnabled(), false);

    process.env.NEXT_PUBLIC_ADSENSE_ENABLED = "false";
    assert.equal(isAdsenseEnabled(), false);

    process.env.NEXT_PUBLIC_ADSENSE_ENABLED = "1";
    assert.equal(isAdsenseEnabled(), false);

    process.env.NEXT_PUBLIC_ADSENSE_ENABLED = "TRUE";
    assert.equal(isAdsenseEnabled(), false);

    process.env.NEXT_PUBLIC_ADSENSE_ENABLED = "true";
    assert.equal(isAdsenseEnabled(), true);
  });

  it("points the publisher script at the ads.txt client", () => {
    assert.equal(ADSENSE_CLIENT, "ca-pub-1747465358377243");
    assert.equal(
      adsenseScriptSrc(),
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1747465358377243",
    );
  });
});
