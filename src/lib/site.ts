export const site = {
  name: "First Down Scotland",
  shortName: "First Down",
  tagline: "Learn the NFL. Meet fans of your team. Follow that club in one place. Built in Scotland, for the UK.",
  description:
    "A learning hub for Scottish and UK NFL beginners, a community to meet fans of the team you picked, and a one-stop shop for that club: news, fantasy, podcasts, depth and where to watch. Discord for chat, pubs for real-world meetups.",
  locale: "en-GB",
  timeZone: "Europe/London",
} as const;

/** Home H1 and document title. Kept in one place so the visible heading matches metadata. */
export const homeSeo = {
  heading: "FIRST DOWN SCOTLAND NFL",
  title: "FIRST DOWN SCOTLAND NFL | Learn American football in the UK",
  description:
    "FIRST DOWN SCOTLAND NFL is a Scotland-built hub for UK beginners: learn American football in plain English, meet fans of your team, and follow that club in one place.",
} as const;

export type NavItem = {
  href: string;
  label: string;
};

export type NavGroup = {
  id: string;
  label: string;
  items: readonly NavItem[];
};

export const navHome: NavItem = { href: "/", label: "Home" };

/** Three site jobs, shown as a short desktop bar beside the hamburger. */
export const navShortcuts: readonly NavItem[] = [
  { href: "/learn", label: "Learn" },
  { href: "/this-week", label: "This week" },
  { href: "/community", label: "Community" },
];

export const navGroups: readonly NavGroup[] = [
  {
    id: "learn",
    label: "Learn",
    items: [
      { href: "/learn", label: "Lessons" },
      { href: "/learn/plays", label: "Playbook" },
      { href: "/learn/quiz", label: "Quiz" },
      { href: "/glossary", label: "Glossary" },
      { href: "/film-room", label: "Film room" },
      { href: "/learn/draft-prospects", label: "Draft prospects" },
    ],
  },
  {
    id: "league",
    label: "Follow the league",
    items: [
      { href: "/this-week", label: "This week" },
      { href: "/scores", label: "Scores" },
      { href: "/standings", label: "Standings" },
      { href: "/rookies", label: "Rookie Watch" },
    ],
  },
  {
    id: "team",
    label: "Your team",
    items: [
      { href: "/pick-your-team", label: "Pick my team" },
      { href: "/teams", label: "Teams" },
      { href: "/news", label: "News" },
      { href: "/news/fantasy", label: "Fantasy" },
      { href: "/podcasts", label: "Podcasts" },
    ],
  },
  {
    id: "community",
    label: "Community",
    items: [
      { href: "/community", label: "Community" },
      { href: "/watch-near-you", label: "Pubs" },
    ],
  },
  {
    id: "more",
    label: "Watch and more",
    items: [
      { href: "/watch", label: "Watch" },
      { href: "/history", label: "History" },
      { href: "/feedback", label: "Feedback" },
      { href: "/about", label: "About" },
    ],
  },
];

export const navItems: readonly NavItem[] = [
  navHome,
  ...navGroups.flatMap((group) => group.items),
];

export function isCurrentNav(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  if (pathname !== href && !pathname.startsWith(`${href}/`)) return false;
  return !navItems.some(
    (item) =>
      item.href !== href &&
      item.href.length > href.length &&
      (pathname === item.href || pathname.startsWith(`${item.href}/`)),
  );
}

export function navGroupIdForPath(pathname: string): string | null {
  for (const group of navGroups) {
    if (group.items.some((item) => isCurrentNav(pathname, item.href))) {
      return group.id;
    }
  }
  return null;
}

export function isShortcutCurrent(pathname: string, href: string): boolean {
  if (href === "/learn") return navGroupIdForPath(pathname) === "learn";
  return isCurrentNav(pathname, href);
}

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
