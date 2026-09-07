import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { PodcastCard } from "@/components/PodcastCard";
import { allTeamPodcasts, generalPodcasts } from "@/data/podcasts";
import { divisions, teamsInDivision } from "@/data/team-profiles";
import { espnTeamLogo } from "@/lib/team-logo";

export const metadata: Metadata = {
  title: "NFL podcasts",
  description:
    "Recommended NFL podcasts for UK beginners — general league shows plus a daily independent pod for each of the 32 teams.",
};

export default function PodcastsPage() {
  const showsBySlug = new Map(allTeamPodcasts().map((entry) => [entry.slug, entry.shows]));
  const byDivision = divisions.map((row) => ({
    ...row,
    teams: teamsInDivision(row.conference, row.division).map((team) => ({
      team,
      shows: showsBySlug.get(team.slug) ?? [],
    })),
  }));

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <PageIntro eyebrow="Listen" title="Podcasts to lock onto">
        <p>
          A short list, not a directory of everything ever recorded. Start with a UK
          or beginner league show, then pick a daily team pod once you have a side.
          Labels say whether a show is official, independent, or fan-run. We link out
          — we do not embed players.
        </p>
      </PageIntro>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-cream">League shows</h2>
        <p className="mt-2 text-sm leading-6 text-cream-dim">
          Good first follows if you are still learning the sport, not just one club.
        </p>
        <div className="mt-6 grid gap-4">
          {generalPodcasts.map((show) => (
            <PodcastCard key={show.id} show={show} />
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-2xl text-cream">Shows by club</h2>
        <p className="mt-2 text-sm leading-6 text-cream-dim">
          Every team has a Locked On daily show (independent network). A handful of
          clubs also have a well-known official or beat pod we could verify. If you
          want pictures rather than chat, use the official YouTube on each{" "}
          <Link href="/teams" className="text-gold">
            team profile
          </Link>
          .
        </p>
        <div className="mt-8 space-y-10">
          {byDivision.map(({ conference, division, teams }) => (
            <div key={`${conference}-${division}`}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                {conference} {division}
              </h3>
              <div className="mt-4 space-y-6">
                {teams.map(({ team, shows }) => (
                  <div key={team.slug}>
                    <p className="font-medium text-cream">
                      <Link href={`/teams/${team.slug}`} className="hover:text-gold">
                        {team.name}
                      </Link>
                    </p>
                    {shows.length > 0 ? (
                      <div className="mt-3 grid gap-3">
                        {shows.map((show) => (
                          <PodcastCard
                            key={show.id}
                            show={show}
                            fallbackSrc={espnTeamLogo(team.abbreviation)}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="mt-2 text-sm text-cream-dim">
                        No dedicated pod listed — try the league shows above and the
                        club YouTube.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
