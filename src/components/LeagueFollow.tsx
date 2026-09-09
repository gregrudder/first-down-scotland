import Link from "next/link";

const cards = [
  {
    href: "/scores",
    kicker: "Live scores",
    title: "Who is winning tonight",
    body: "A Flashscore-style board for the current week: Scheduled, Live, Final or Bye. It polls while games are on.",
  },
  {
    href: "/standings",
    kicker: "Standings",
    title: "The table, by division",
    body: "AFC and NFC, four clubs each. Wins, losses, ties, and who sits first in the division.",
  },
  {
    href: "/rookies",
    kicker: "Rookie Watch",
    title: "This year’s drafted class",
    body: "This season’s drafted rookies: team, position, round, and season stats when the feed has them.",
  },
  {
    href: "/score-history",
    kicker: "Score history",
    title: "Has this final happened before?",
    body: "Type two totals and see how often that scoreline appears in our public historical table.",
  },
] as const;

export function LeagueFollow() {
  return (
    <section aria-label="Follow the league" className="mx-auto max-w-6xl px-4 pb-14 sm:px-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
            Follow the league
          </p>
          <h2 className="mt-2 font-display text-3xl text-cream">Scores, table, rookies, scorelines</h2>
        </div>
        <Link href="/this-week" className="hidden text-sm text-gold sm:inline">
          This week →
        </Link>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="flex h-full flex-col rounded-2xl border border-line bg-navy-2 p-5 transition hover:border-gold/50 hover:bg-navy-3"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
              {card.kicker}
            </p>
            <h3 className="mt-2 font-display text-xl text-cream">{card.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-6 text-cream-dim">{card.body}</p>
            <span className="mt-4 text-sm font-medium text-gold">Open →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
