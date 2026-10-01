/**
 * Google AdSense publisher id.
 * The root layout always emits the google-adsense-account meta tag and
 * adsbygoogle.js. public/ads.txt stays in place. No ad units are rendered.
 */
export const ADSENSE_META_NAME = "google-adsense-account";

export const ADSENSE_CLIENT = "ca-pub-1747465358377243";

export function adsenseScriptSrc(): string {
  return `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
}
