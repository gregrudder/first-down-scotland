import type { Metadata } from "next";
import Link from "next/link";
import { LeagueTabs } from "@/components/LeagueTabs";
import { LiveScoreboard } from "@/components/LiveScoreboard";
import { PageIntro } from "@/components/PageIntro";
import { UkKickoffTip } from "@/components/UkKickoffTip";
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
      <UkKickoffTip compact className="mt-6" />
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
        .
      </p>
    </div>
  );
}
