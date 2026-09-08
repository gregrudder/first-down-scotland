import Link from "next/link";

export function NewsTabs({ active }: { active: "nfl" | "fantasy" }) {
  const tabs = [
    { id: "nfl" as const, href: "/news", label: "NFL" },
    { id: "fantasy" as const, href: "/news/fantasy", label: "Fantasy" },
  ];

  return (
    <nav
      className="mt-8 flex gap-2 rounded-full border border-line bg-navy-2 p-1"
      aria-label="News sections"
    >
      {tabs.map((tab) => {
        const selected = tab.id === active;
        return (
          <Link
            key={tab.id}
            href={tab.href}
            aria-current={selected ? "page" : undefined}
            className={`flex-1 rounded-full px-4 py-2 text-center text-sm font-semibold ${
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
