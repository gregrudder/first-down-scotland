import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { PodcastCard } from "@/components/PodcastCard";
import { allTeamPodcasts, generalPodcasts, ukScottishPodcasts } from "@/data/podcasts";
import { divisions, teamsInDivision } from "@/data/team-profiles";
import { espnTeamLogo } from "@/lib/team-logo";

export const metadata: Metadata = {
  title: "NFL podcasts",
  description:
    "NFL podcasts for UK fans: UK and Scottish shows, league-wide analysis, plus a daily pod for the team you support.",
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
          Split into three lists so a Scottish show is not sitting next to a
          US league circus, and so Pick-my-team pods stay with their club.
          Start with a UK or beginner show if you are still learning. Meeting
          fans of that club lives on{" "}
          <Link href="/community" className="text-gold">
            Community
          </Link>{" "}
          and in{" "}
          <Link href="/watch-near-you" className="text-gold">
            pubs
          </Link>
          . Labels say whether a show is official, independent, or fan-run. We
          link out: we do not embed players.
        </p>
      </PageIntro>

      <p className="mt-8 text-sm leading-6">
        <a href="#uk-scottish" className="font-semibold text-gold hover:text-gold-soft">
          UK and Scotland →
        </a>
        <span className="text-cream-dim"> · </span>
        <a href="#general" className="text-gold hover:text-gold-soft">
          General NFL →
        </a>
        <span className="text-cream-dim"> · </span>
        <a href="#by-club" className="text-gold hover:text-gold-soft">
          Team podcasts →
        </a>
      </p>

      <section id="uk-scottish" className="mt-12 scroll-mt-24">
        <h2 className="font-display text-2xl text-cream">UK and Scottish NFL podcasts</h2>
        <p className="mt-2 text-sm leading-6 text-cream-dim">
          Shows aimed at fans on this side of the pond. British voices, UK
          kick-off times, and less assumption that you grew up with Friday-night
          lights.
        </p>
        <div className="mt-6 grid gap-4">
          {ukScottishPodcasts.map((show) => (
            <PodcastCard key={show.id} show={show} />
          ))}
        </div>
      </section>

      <section id="general" className="mt-14 scroll-mt-24">
        <h2 className="font-display text-2xl text-cream">General NFL podcasts</h2>
        <p className="mt-2 text-sm leading-6 text-cream-dim">
          League-wide analysis and entertainment, not tied to one club. Mostly
          US-hosted, and useful once you want the full American conversation.
        </p>
        <div className="mt-6 grid gap-4">
          {generalPodcasts.map((show) => (
            <PodcastCard key={show.id} show={show} />
          ))}
        </div>
      </section>

      <section id="by-club" className="mt-14 scroll-mt-24">
        <h2 className="font-display text-2xl text-cream">Team podcasts</h2>
        <p className="mt-2 text-sm leading-6 text-cream-dim">
          Every club has a Locked On daily show (independent network). A handful
          also have a well-known official or beat pod we could verify. These stay
          here, and on each team hub after you{" "}
          <Link href="/pick-your-team" className="text-gold">
            pick a side
          </Link>
          , so they are not mixed into the league list. If you want pictures
          rather than chat, use the official YouTube on each{" "}
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
                        No dedicated pod listed: try the UK and league shows
                        above and the club YouTube.
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
