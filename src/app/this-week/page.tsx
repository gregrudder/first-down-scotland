import type { Metadata } from "next";
import Link from "next/link";
import { SundayCard } from "@/components/SundayCard";
import { GameCard } from "@/components/GameCard";
import { LeagueTabs } from "@/components/LeagueTabs";
import { SpoilerFreeToggle } from "@/components/SpoilerFreeToggle";
import { PageIntro } from "@/components/PageIntro";
import { UkKickoffHelper } from "@/components/UkKickoffHelper";
import { UnusualFinals } from "@/components/UnusualFinals";
import { getNflFixtures, groupGamesByUkDate, weekHeading } from "@/lib/espn";
import { getGameReports, type GameReport } from "@/lib/game-report";
import { withTouchdownScorers } from "@/lib/touchdowns";
import { formatFetchedAt } from "@/lib/time";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "This week’s games",
  description:
    "This week’s NFL kick-offs in UK time, with a short preview or post-match report on each game, plus a Sunday card if you have picked a team: what to watch for, depth, and where fans of that side might meet.",
};

export default async function ThisWeekPage() {
  const rawFixtures = await getNflFixtures();
  const [fixtures, reports] = await Promise.all([
    withTouchdownScorers(rawFixtures),
    rawFixtures.ok ? getGameReports(rawFixtures.games) : Promise.resolve({} as Record<string, GameReport>),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <PageIntro eyebrow="This week for you" title="This week’s games">
        <p>
          Kick-offs are converted to the UK so you know when your side is on,
          without another American tab. Each game has a short preview, or a
          post-match report after full time (or a clear “report coming” note until
          a feed publishes one). We link out for the full piece. Scores appear if
          the feed has them, and live or finished cards list who scored the
          touchdowns when ESPN’s game summary includes them. Spoiler-free mode
          hides those until you have watched. Live and finished cards can play
          an official highlight in the app; spoiler-free keeps YouTube’s title
          and thumbnail behind a tap. We do not type these
          in by hand: if ESPN’s public scoreboard hiccups, you will see that here
          instead of a stale spreadsheet.
          If you have picked a team, your Sunday card sits at the top: what to look
          for, depth, and where fans of that club might meet. The full list stays
          open for everyone.
        </p>
      </PageIntro>
      <LeagueTabs active="games" />
      <SpoilerFreeToggle />

      <div className="mt-8">
        <UkKickoffHelper />
      </div>

      <div className="mt-8">
        <SundayCard fixtures={fixtures} reports={reports} />
      </div>
      {fixtures.ok ? (
        <div className="mt-8">
          <UnusualFinals games={fixtures.games} />
        </div>
      ) : null}

      {!fixtures.ok ? (
        <div className="mt-10 rounded-2xl border border-live/40 bg-navy-2 p-6">
          <h2 className="font-display text-2xl text-cream">The feed is unavailable</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-cream-dim">{fixtures.error}</p>
          <p className="mt-3 text-xs text-cream-dim">
            Last attempt {formatFetchedAt(fixtures.fetchedAt)}. You can still{" "}
            <Link href="/learn" className="text-gold">
              keep learning
            </Link>
            ,{" "}
            <Link href="/community" className="text-gold">
              meet your team
            </Link>
            , or read{" "}
            <Link href="/watch" className="text-gold">
              where to watch
            </Link>
            .
          </p>
        </div>
      ) : (
        <>
          <div className="mt-8 flex flex-wrap items-end justify-between gap-3">
            <p className="text-sm text-cream-dim">{weekHeading(fixtures)}</p>
            <p className="text-xs text-cream-dim">
              Refreshed {formatFetchedAt(fixtures.fetchedAt)} · times in Europe/London
            </p>
          </div>

          {fixtures.games.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-line bg-navy-2 p-6">
              <h2 className="font-display text-2xl text-cream">No games listed just now</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-cream-dim">
                The live scoreboard has nothing for the current NFL week. That usually
                means an off-week, a gap between the preseason and Week 1, or a quiet
                moment while the next slate is published.
              </p>
            </div>
          ) : (
            <div className="mt-8 space-y-10">
              {groupGamesByUkDate(fixtures.games).map((group) => (
                <section key={group.dateKey}>
                  <h2 className="font-display text-2xl text-cream">{group.heading}</h2>
                  <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    {group.games.map((game) => (
                      <GameCard key={game.id} game={game} report={reports[game.id]} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </>
      )}

      <p className="mt-10 max-w-2xl text-sm leading-6 text-cream-dim">
        Light watch hints are guesses from kick-off windows and the US broadcast
        tag, not a rights guarantee. For the honest map, see{" "}
        <Link href="/watch" className="text-gold">
          Where to watch
        </Link>
        . To sit with fans of your team, try{" "}
        <Link href="/watch-near-you" className="text-gold">
          pubs near you
        </Link>
        . For a board that polls while games are on, use{" "}
        <Link href="/scores" className="text-gold">
          live scores
        </Link>
        . The table is on{" "}
        <Link href="/standings" className="text-gold">
          Standings
        </Link>
        . Finished scorelines can be looked up on{" "}
        <Link href="/score-history" className="text-gold">
          score history
        </Link>
        .
      </p>
    </div>
  );
}
