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
  description?: string;
  primary?: boolean;
};

export type NavGroup = {
  id: string;
  label: string;
  column: 1 | 2 | 3;
  priority?: "low";
  items: readonly NavItem[];
};

export const navHome: NavItem = { href: "/", label: "Home" };

export const navGroups: readonly NavGroup[] = [
  {
    id: "started",
    label: "Get started",
    column: 1,
    items: [
      { href: "/learn", label: "Learn the NFL", primary: true },
      {
        href: "/learn/rivalries",
        label: "Rivalries",
        description: "Who plays whom, and why some Sundays feel personal.",
      },
      {
        href: "/learn/famous-players",
        label: "Famous players",
        description: "Short bios of names the broadcast assumes you know.",
      },
      {
        href: "/mini-games",
        label: "Mini Games",
        description: "Short quizzes. Separate from the lessons.",
        primary: true,
      },
      { href: "/pick-your-team", label: "Pick My Team", primary: true },
      { href: "/glossary", label: "Glossary" },
    ],
  },
  {
    id: "community",
    label: "Community",
    column: 1,
    items: [
      {
        href: "/community",
        label: "Community",
        description: "Connect with other NFL fans.",
        primary: true,
      },
      {
        href: "/watch-near-you",
        label: "Pubs",
        description: "Find places showing NFL games.",
      },
    ],
  },
  {
    id: "history",
    label: "History",
    column: 1,
    items: [{ href: "/history", label: "History" }],
  },
  {
    id: "follow",
    label: "Follow the NFL",
    column: 2,
    items: [
      {
        href: "/this-week",
        label: "This Week",
        description: "Games, fixtures and what is coming up.",
        primary: true,
      },
      {
        href: "/scores",
        label: "Scores",
        description: "Live and completed game scores.",
        primary: true,
      },
      {
        href: "/score-history",
        label: "Score history",
        description: "Has this final happened before?",
      },
      {
        href: "/standings",
        label: "Standings",
        description: "AFC and NFC tables.",
      },
      {
        href: "/news",
        label: "News",
        description: "Latest NFL news.",
      },
      {
        href: "/rookies",
        label: "Rookies",
        description: "This year’s rookie class.",
      },
    ],
  },
  {
    id: "watch",
    label: "Watch & listen",
    column: 3,
    items: [
      {
        href: "/watch",
        label: "Watch",
        description: "Where and how to watch NFL games.",
      },
      {
        href: "/film-room",
        label: "Film Room",
        description: "Breakdowns and analysis.",
      },
      {
        href: "/podcasts",
        label: "Podcasts",
        description: "NFL podcasts and audio content.",
      },
    ],
  },
  {
    id: "teams",
    label: "Teams",
    column: 3,
    items: [{ href: "/teams", label: "Teams" }],
  },
  {
    id: "about",
    label: "About",
    column: 3,
    priority: "low",
    items: [
      { href: "/about", label: "About" },
      { href: "/feedback", label: "Feedback" },
    ],
  },
];

export const navColumns = [1, 2, 3] as const;

export const navItems: readonly NavItem[] = [
  navHome,
  ...navGroups.flatMap((group) => group.items),
];

export function isCurrentNav(
  pathname: string,
  href: string,
  extraHrefs: readonly string[] = [],
): boolean {
  if (href === "/") return pathname === "/";
  if (pathname !== href && !pathname.startsWith(`${href}/`)) return false;
  const others = [...navItems.map((item) => item.href), ...extraHrefs];
  return !others.some(
    (other) =>
      other !== href &&
      other.length > href.length &&
      (pathname === other || pathname.startsWith(`${other}/`)),
  );
}

const FALLBACK_PRODUCTION = "https://www.firstdownscotland.com";
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
