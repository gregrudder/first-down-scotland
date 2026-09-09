import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PageIntro } from "@/components/PageIntro";
import { ScoreHistoryExplorer } from "@/components/ScoreHistoryExplorer";
import { TrademarkNote } from "@/components/TrademarkNote";
import { UnusualFinals } from "@/components/UnusualFinals";
import { getNflFixtures } from "@/lib/espn";
import { scoreHistoryMeta } from "@/lib/score-history";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Has this score happened before?",
  description:
    "Look up an NFL final scoreline and see whether it appears in our historical table, how often, and a few example games. Built for UK beginners.",
};

export default async function ScoreHistoryPage() {
  const fixtures = await getNflFixtures();
  const finals = fixtures.ok ? fixtures.games : [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <PageIntro eyebrow="Follow the NFL · Fun" title="Has this score happened before?">
        <p>
          Scoreography is the habit of asking whether a final scoreline has turned up
          before, and how rare it is. Type two totals and we look them up in a
          public historical table.
        </p>
        <p>
          This is our own page, for beginners, not a copy of anyone else’s
          score-history site. The numbers come from a stored snapshot of completed
          NFL games, not a live scrape.
        </p>
      </PageIntro>

      {finals.length > 0 ? (
        <div className="mt-10">
          <UnusualFinals games={finals} compact />
        </div>
      ) : null}

      <Suspense
        fallback={
          <p className="mt-10 text-sm text-cream-dim">Loading the lookup…</p>
        }
      >
        <ScoreHistoryExplorer />
      </Suspense>

      <div className="mt-12 rounded-2xl border border-line bg-navy-2 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
          Where the numbers come from
        </p>
        <h2 className="mt-2 font-display text-2xl text-cream">A stored table, not a guess</h2>
        <p className="mt-3 text-sm leading-6 text-cream-dim">
          {scoreHistoryMeta.gameCount.toLocaleString("en-GB")} completed games,{" "}
          {scoreHistoryMeta.seasonFrom}–{scoreHistoryMeta.seasonTo}, from the public{" "}
          <a href={scoreHistoryMeta.sourceRepo} className="text-gold">
            nflverse / nfldata
          </a>{" "}
          schedule file (Lee Sharpe). Regular season and play-offs. Preseason is not
          in that file. The snapshot was built on {scoreHistoryMeta.builtAt}. If a
          2026 final is missing, that is because the file has not listed it yet.
        </p>
        <p className="mt-3 text-sm leading-6 text-cream-dim">{scoreHistoryMeta.includes}</p>
        <p className="mt-3 text-sm leading-6 text-cream-dim">
          Still learning how those points get on the board?{" "}
          <Link href="/learn/how-you-score" className="text-gold">
            How you score
          </Link>
          . For this week’s kick-offs,{" "}
          <Link href="/this-week" className="text-gold">
            This week’s games
          </Link>
          , or the{" "}
          <Link href="/scores" className="text-gold">
            live scoreboard
          </Link>
          .
        </p>
      </div>
      <div className="mt-8">
        <TrademarkNote />
      </div>
    </div>
  );
}
