import type { Metadata } from "next";
import Link from "next/link";
import { GameCard } from "@/components/GameCard";
import { PageIntro } from "@/components/PageIntro";
import { getNflFixtures, groupGamesByUkDate, weekHeading } from "@/lib/espn";
import { formatFetchedAt } from "@/lib/time";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "This week’s games",
  description:
    "This week’s NFL kick-offs in Europe/London time, pulled automatically from ESPN.",
};

export default async function ThisWeekPage() {
  const fixtures = await getNflFixtures();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <PageIntro eyebrow="Fixtures" title="This week’s games">
        <p>
          Kick-offs are converted to the UK. Scores appear if the feed has them. We
          do not type these in by hand — if ESPN’s public scoreboard hiccups, you
          will see that here instead of a stale spreadsheet.
        </p>
      </PageIntro>

      {!fixtures.ok ? (
        <div className="mt-10 rounded-2xl border border-live/40 bg-navy-2 p-6">
          <h2 className="font-display text-2xl text-cream">The feed is unavailable</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-cream-dim">{fixtures.error}</p>
          <p className="mt-3 text-xs text-cream-dim">
            Last attempt {formatFetchedAt(fixtures.fetchedAt)}. You can still{" "}
            <Link href="/learn" className="text-gold">
              keep learning
            </Link>{" "}
            or read{" "}
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
                      <GameCard key={game.id} game={game} />
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
        tag — not a rights guarantee. For the honest map, see{" "}
        <Link href="/watch" className="text-gold">
          Where to watch
        </Link>
        .
      </p>
    </div>
  );
}
