/**
 * Google AdSense publisher script.
 *
 * Off unless NEXT_PUBLIC_ADSENSE_ENABLED is exactly "true".
 * Leave it unset until the site is approved. public/ads.txt stays either way.
 * This flag only loads the publisher script. It does not render ad units.
 */
export function isAdsenseEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true";
}

export const ADSENSE_CLIENT = "ca-pub-1747465358377243";

export function adsenseScriptSrc(): string {
  return `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
}
