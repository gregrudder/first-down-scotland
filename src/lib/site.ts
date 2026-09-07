export const site = {
  name: "First Down Scotland",
  shortName: "First Down",
  tagline: "Built in Scotland, for anyone in the UK getting into the NFL.",
  description:
    "A learn-the-NFL guide for Scottish and UK beginners — clear lessons, a jargon decoder, this week’s kick-offs in UK time, and honest notes on where to watch.",
  locale: "en-GB",
  timeZone: "Europe/London",
} as const;

export const navItems = [
  { href: "/learn", label: "Learn" },
  { href: "/history", label: "History" },
  { href: "/teams", label: "Teams" },
  { href: "/glossary", label: "Glossary" },
  { href: "/this-week", label: "This week" },
  { href: "/news", label: "News" },
  { href: "/watch", label: "Watch" },
  { href: "/community", label: "Community" },
  { href: "/pick-your-team", label: "Pick my team" },
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

export function siteOrigin(): string {
  const candidates = [
    firstNonEmpty(process.env.NEXT_PUBLIC_SITE_URL),
    firstNonEmpty(process.env.VERCEL_URL),
    process.env.VERCEL ? FALLBACK_PRODUCTION : FALLBACK_LOCAL,
    FALLBACK_PRODUCTION,
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;
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
