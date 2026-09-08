export const site = {
  name: "First Down Scotland",
  shortName: "First Down",
  tagline: "Built in Scotland, for anyone in the UK getting into the NFL.",
  description:
    "A learn-the-NFL guide for Scottish and UK beginners: clear lessons, a jargon decoder, this week’s kick-offs in UK time, a Sunday card for your team, and honest notes on where to watch.",
  locale: "en-GB",
  timeZone: "Europe/London",
} as const;

export const navItems = [
  { href: "/learn", label: "Learn" },
  { href: "/pick-your-team", label: "Pick my team" },
  { href: "/this-week", label: "This week" },
  { href: "/watch", label: "Watch" },
  { href: "/film-room", label: "Film room" },
  { href: "/watch-near-you", label: "Pubs" },
  { href: "/news", label: "News" },
  { href: "/podcasts", label: "Podcasts" },
  { href: "/history", label: "History" },
  { href: "/teams", label: "Teams" },
  { href: "/glossary", label: "Glossary" },
  { href: "/community", label: "Community" },
  { href: "/feedback", label: "Feedback" },
  { href: "/about", label: "About" },
] as const;

const FALLBACK_PRODUCTION = "https://first-down-scotland.vercel.app";
const FALLBACK_LOCAL = "http://localhost:3000";

function firstNonEmpty(...values: Array<string | undefined>): string | undefined {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return undefined;
}

function withProtocol(hostOrUrl: string): string {
  return /^https?:\/\//i.test(hostOrUrl) ? hostOrUrl : `https://${hostOrUrl}`;
}

/** Unique Vercel preview hosts are SSO-gated: never use them for canonical URLs. */
function isVercelPreviewHost(hostOrUrl: string): boolean {
  try {
    const host = new URL(withProtocol(hostOrUrl)).hostname.toLowerCase();
    if (!host.endsWith(".vercel.app")) return false;
    return host.includes("-git-") || /-[a-z0-9]{7,}-/.test(host);
  } catch {
    return false;
  }
}

/**
 * Public origin for robots, sitemap, and Open Graph.
 * Prefer an explicit canonical, then the project production domain: never a preview deployment URL.
 */
export function siteOrigin(): string {
  const onVercel = Boolean(process.env.VERCEL);
  const productionDeployment =
    process.env.VERCEL_ENV === "production"
      ? firstNonEmpty(process.env.VERCEL_URL)
      : undefined;

  const candidates = [
    firstNonEmpty(process.env.NEXT_PUBLIC_SITE_URL),
    firstNonEmpty(process.env.VERCEL_PROJECT_PRODUCTION_URL),
    productionDeployment,
    onVercel ? FALLBACK_PRODUCTION : FALLBACK_LOCAL,
    FALLBACK_PRODUCTION,
  ];

  for (const candidate of candidates) {
    if (!candidate || isVercelPreviewHost(candidate)) continue;
    try {
      return new URL(withProtocol(candidate)).origin;
    } catch {
      // try the next candidate
    }
  }

  return FALLBACK_PRODUCTION;
}

export function absoluteUrl(path = "/"): string {
  return new URL(path || "/", `${siteOrigin()}/`).toString();
}
