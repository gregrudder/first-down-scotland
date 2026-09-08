import type { Metadata } from "next";
import Link from "next/link";
import { LeagueTabs } from "@/components/LeagueTabs";
import { PageIntro } from "@/components/PageIntro";
import { RookieWatch } from "@/components/RookieWatch";
import { getNflFixtures, seasonHasStarted } from "@/lib/espn";
import { getRookieWatch } from "@/lib/rookies";
import { formatFetchedAt } from "@/lib/time";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Rookie Watch",
  description:
    "Follow this season’s drafted NFL rookies: team, position, draft round and current season stats, updated from public feeds.",
};

export default async function RookiesPage({
  searchParams,
}: {
  searchParams: Promise<{ team?: string }>;
}) {
  const { team } = await searchParams;
  const fixtures = await getNflFixtures();
  const seasonYear = fixtures.ok && fixtures.seasonYear ? fixtures.seasonYear : 2026;
  const started = fixtures.ok ? seasonHasStarted(fixtures) : false;
  const board = await getRookieWatch({ seasonYear, seasonStarted: started });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <PageIntro eyebrow="This week for you" title="Rookie Watch">
        <p>
          The {seasonYear} draft class: this season’s rookies, not next year’s
          college board. Each card has the club that picked them, the position,
          and the round. Counting stats appear when the public feed has them. If
          a number is missing we say so. We do not invent box scores.
        </p>
      </PageIntro>
      <LeagueTabs active="rookies" />

      {!board.ok ? (
        <div className="mt-8 rounded-2xl border border-live/40 bg-navy-2 p-6">
          <h2 className="font-display text-2xl text-cream">Rookie Watch is unavailable</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-cream-dim">{board.error}</p>
          <p className="mt-3 text-xs text-cream-dim">
            Last attempt {formatFetchedAt(board.fetchedAt)}. The 2027 college board
            still lives under{" "}
            <Link href="/learn/draft-prospects" className="text-gold">
              draft prospects
            </Link>
            .
          </p>
        </div>
      ) : (
        <>
          <aside className="mt-8 rounded-2xl border border-gold/30 bg-navy-3 px-5 py-4 text-sm leading-6 text-cream">
            {board.rookies.length} players from {board.sourceLabel}. {board.statsNote}{" "}
            Stats source: {board.statsSourceLabel}.
            <span className="mt-3 block text-cream-dim">
              Checked {formatFetchedAt(board.fetchedAt)}.
            </span>
          </aside>
          <RookieWatch board={board} initialTeam={team} />
        </>
      )}

      <p className="mt-10 max-w-2xl text-sm leading-6 text-cream-dim">
        Names you will hear for the <em>next</em> draft sit on{" "}
        <Link href="/learn/draft-prospects" className="text-gold">
          the 2027 prospects board
        </Link>
        . For what the Draft is, read{" "}
        <Link href="/learn/the-draft" className="text-gold">
          the lesson
        </Link>
        .
      </p>
    </div>
  );
}
