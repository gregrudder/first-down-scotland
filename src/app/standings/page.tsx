import type { Metadata } from "next";
import Link from "next/link";
import { LeagueTabs } from "@/components/LeagueTabs";
import { PageIntro } from "@/components/PageIntro";
import { StandingsBoard } from "@/components/StandingsBoard";
import { getNflStandings } from "@/lib/standings";
import { formatFetchedAt } from "@/lib/time";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "NFL standings",
  description:
    "Current NFL table for UK beginners: AFC and NFC by division, with wins, losses, ties and division rank.",
};

export default async function StandingsPage() {
  const standings = await getNflStandings();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <PageIntro eyebrow="This week for you" title="Standings">
        <p>
          Who is winning their division, in plain English. W-L-T means wins, losses
          and ties. A tie is rare: the game finished level after overtime. We read
          ESPN’s public table and refresh it about every five minutes, so this is
          not a spreadsheet we typed in August and forgot.
        </p>
      </PageIntro>
      <LeagueTabs active="standings" />

      {!standings.ok ? (
        <div className="mt-8 rounded-2xl border border-live/40 bg-navy-2 p-6">
          <h2 className="font-display text-2xl text-cream">The table is unavailable</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-cream-dim">{standings.error}</p>
          <p className="mt-3 text-xs text-cream-dim">
            Last attempt {formatFetchedAt(standings.fetchedAt)}. You can still check{" "}
            <Link href="/scores" className="text-gold">
              live scores
            </Link>{" "}
            or{" "}
            <Link href="/this-week" className="text-gold">
              this week’s games
            </Link>
            .
          </p>
        </div>
      ) : (
        <>
          <div className="mt-8 flex flex-wrap items-end justify-between gap-3">
            <p className="text-sm text-cream-dim">{standings.seasonLabel}</p>
            <p className="text-xs text-cream-dim">
              Refreshed {formatFetchedAt(standings.fetchedAt)}
            </p>
          </div>
          <div className="mt-6">
            <StandingsBoard divisions={standings.divisions} />
          </div>
        </>
      )}

      <p className="mt-10 max-w-2xl text-sm leading-6 text-cream-dim">
        Division rank is first in that group of four. Play-off seeds appear once
        the league starts publishing them. For this year’s drafted rookies, see{" "}
        <Link href="/rookies" className="text-gold">
          Rookie Watch
        </Link>
        .
      </p>
    </div>
  );
}
