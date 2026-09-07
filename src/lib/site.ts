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
  { href: "/glossary", label: "Glossary" },
  { href: "/this-week", label: "This week" },
  { href: "/watch", label: "Watch" },
  { href: "/about", label: "About" },
] as const;

export function absoluteUrl(path = "/"): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return new URL(path, base).toString();
}
