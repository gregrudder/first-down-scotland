import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { TrademarkNote } from "@/components/TrademarkNote";
import { historyBeats, historyIntro, historySourcesNote } from "@/data/nfl-history";

export const metadata: Metadata = {
  title: "NFL history",
  description:
    "A short NFL history for UK beginners: origins, the AFL-NFL merger, the Super Bowl era, expansion, and London games.",
};

export default function HistoryPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <PageIntro eyebrow={historyIntro.eyebrow} title={historyIntro.title}>
        <p>{historyIntro.lead}</p>
      </PageIntro>

      <ol className="relative mt-12 space-y-8 border-l border-line pl-6 sm:pl-8">
        {historyBeats.map((beat) => (
          <li key={beat.year} className="relative">
            <span
              className="absolute -left-[1.85rem] top-1.5 h-3 w-3 rounded-full bg-gold sm:-left-[2.35rem]"
              aria-hidden
            />
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
              {beat.year}
            </p>
            <h2 className="mt-1 font-display text-2xl text-cream">{beat.title}</h2>
            <p className="mt-2 text-base leading-7 text-cream-dim">{beat.body}</p>
          </li>
        ))}
      </ol>

      <div className="mt-12 rounded-2xl border border-line bg-navy-2 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
          Then pick a side
        </p>
        <h2 className="mt-2 font-display text-2xl text-cream">All 32 clubs</h2>
        <p className="mt-2 text-sm leading-6 text-cream-dim">
          Stadium, colours, a handful of names, Super Bowls at a glance. Written for
          people who did not grow up arguing about the 1985 Bears.
        </p>
        <Link
          href="/teams"
          className="mt-4 inline-block text-sm font-semibold text-gold"
        >
          Browse teams →
        </Link>
      </div>

      <p className="mt-10 text-sm leading-6 text-cream-dim">
        Still learning the sport itself?{" "}
        <Link href="/learn" className="text-gold">
          Start the path
        </Link>
        .
      </p>
      <p className="mt-6 text-xs leading-5 text-cream-dim">{historySourcesNote}</p>
      <div className="mt-6">
        <TrademarkNote />
      </div>
    </div>
  );
}
