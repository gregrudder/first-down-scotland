import Link from "next/link";

const tabs = [
  { href: "/this-week", label: "Games" },
  { href: "/late-night-diary", label: "Late nights" },
  { href: "/scores", label: "Live scores" },
  { href: "/standings", label: "Standings" },
  { href: "/rookies", label: "Rookie Watch" },
] as const;

const tabHrefs = {
  games: "/this-week",
  "late-nights": "/late-night-diary",
  scores: "/scores",
  standings: "/standings",
  rookies: "/rookies",
} as const;

export function LeagueTabs({
  active,
}: {
  active: keyof typeof tabHrefs;
}) {
  const current = tabHrefs[active];

  return (
    <nav
      className="mt-8 flex flex-wrap gap-2 rounded-2xl border border-line bg-navy-2 p-1"
      aria-label="This week and the league"
    >
      {tabs.map((tab) => {
        const selected = tab.href === current;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={selected ? "page" : undefined}
            className={`min-w-[7rem] flex-1 rounded-xl px-3 py-2 text-center text-sm font-semibold ${
              selected ? "bg-gold text-gold-ink" : "text-cream-dim hover:text-cream"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
