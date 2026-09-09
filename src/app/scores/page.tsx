import type { Metadata } from "next";
import Link from "next/link";
import { LeagueTabs } from "@/components/LeagueTabs";
import { LiveScoreboard } from "@/components/LiveScoreboard";
import { PageIntro } from "@/components/PageIntro";
import { UkKickoffHelper } from "@/components/UkKickoffHelper";
import { UnusualFinals } from "@/components/UnusualFinals";
import { getNflLiveScoreboard, teamsOnBye } from "@/lib/espn";

export const revalidate = 20;

export const metadata: Metadata = {
  title: "Live scores",
  description:
    "Near-live NFL scores for the current week, with UK kick-off times, quarter and clock when a game is on, plus byes.",
};

export default async function ScoresPage() {
  const fixtures = await getNflLiveScoreboard();
  const byes = fixtures.ok ? teamsOnBye(fixtures) : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <PageIntro eyebrow="This week for you" title="Live scores">
        <p>
          A simple scoreboard for the current NFL week: who is playing, the score,
          and whether it is Scheduled, Live, Final or a Bye. While games are on we
          poll ESPN’s public scoreboard about every 20 seconds. Midweek it slows
          down so we are not refreshing an empty Sunday for no reason.
        </p>
      </PageIntro>
      <LeagueTabs active="scores" />
      <div className="mt-8">
        <UkKickoffHelper showFixturesLink />
      </div>
      <div className="mt-8 rounded-2xl border border-line bg-navy-2 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
          Fun
        </p>
        <h2 className="mt-2 font-display text-xl text-cream">Has this final happened before?</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-cream-dim">
          Scoreography is asking whether a full-time scoreline has turned up before.
          Look up any two totals, or check this week’s finished games against our
          historical table.
        </p>
        <Link href="/score-history" className="mt-3 inline-block text-sm font-semibold text-gold">
          Open score history →
        </Link>
      </div>
      {fixtures.ok ? (
        <div className="mt-8">
          <UnusualFinals games={fixtures.games} />
        </div>
      ) : null}
      <LiveScoreboard initial={{ fixtures, byes }} />
      <p className="mt-10 max-w-2xl text-sm leading-6 text-cream-dim">
        This is a scoreboard, not a play-by-play machine. For kick-off explainers
        and post-match notes, use{" "}
        <Link href="/this-week" className="text-gold">
          This week’s games
        </Link>
        . For the table, open{" "}
        <Link href="/standings" className="text-gold">
          Standings
        </Link>
        . To ask whether a full-time scoreline has turned up before, use{" "}
        <Link href="/score-history" className="text-gold">
          score history
        </Link>
        .
      </p>
    </div>
  );
}
