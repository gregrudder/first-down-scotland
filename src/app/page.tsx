import type { Metadata } from "next";
import Link from "next/link";
import { FanMapHomeSection } from "@/components/fan-map/FanMapHomeSection";
import { GamesTeaser } from "@/components/GamesTeaser";
import { JsonLd } from "@/components/JsonLd";
import { LeagueFollow } from "@/components/LeagueFollow";
import { LessonCard } from "@/components/LessonCard";
import { SundayCard } from "@/components/SundayCard";
import { lessons } from "@/data/lessons";
import { getGameReports } from "@/lib/game-report";
import { getNflFixtures } from "@/lib/espn";
import { absoluteUrl, homeSeo, site } from "@/lib/site";

export const revalidate = 300;

const ogImage = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: homeSeo.heading,
};

export const metadata: Metadata = {
  title: { absolute: homeSeo.title },
  description: homeSeo.description,
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    title: homeSeo.heading,
    description: homeSeo.description,
    url: absoluteUrl("/"),
    locale: "en_GB",
    type: "website",
    siteName: site.name,
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: homeSeo.heading,
    description: homeSeo.description,
    images: [ogImage.url],
  },
};

const pillars = [
  {
    href: "/learn",
    kicker: "1. Learn the game",
    title: "From first down to Super Bowl, in plain English",
    body: "Short lessons, a glossary, quizzes, diagrams, rivalries and famous players. Mini Games sit next door if you want a score — rules for beginners, and fun trivia just for a laugh. Built for UK beginners who keep hearing yards, downs and flags and want them explained without the jargon first.",
    cta: "Open Learn",
  },
  {
    href: "/community",
    kicker: "2. Meet fans of your team",
    title: "Discord for the chat. Pubs for kick-off.",
    body: "Find Scottish and UK supporters of the same NFL team. Talk in Discord instead of hoping a Facebook group still exists. When you want the game in the room, use the pub list and watch it together.",
    cta: "Open Community",
  },
] as const;

export default async function HomePage() {
  const fixtures = await getNflFixtures();
  const reports = fixtures.ok ? await getGameReports(fixtures.games) : {};
  const firstLesson = lessons[0];

  return (
    <div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: site.name,
          alternateName: homeSeo.heading,
          url: absoluteUrl("/"),
          description: homeSeo.description,
          inLanguage: site.locale,
          publisher: {
            "@type": "Organization",
            name: site.name,
            url: absoluteUrl("/"),
            logo: absoluteUrl("/logo.png"),
          },
        }}
      />
      <section className="field-grid border-b border-line">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Home · Scotland · United Kingdom
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-4xl font-bold leading-[1.05] tracking-tight text-cream sm:text-6xl">
            {homeSeo.heading}
          </h1>
          <p className="mt-5 max-w-3xl font-display text-xl leading-snug text-cream sm:text-3xl">
            Learn the game. Meet fans of your team. Keep that club in one place.
          </p>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-cream-dim">
            This is the front door. If you are new to American football, or already
            a fan looking for people who actually follow the same side, start here.
            Everything you normally get from six different sites, all in one place,
            explained so it is easy to understand. No American jargon, and nobody
            using the word fanny with a different meaning.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/learn"
              className="inline-flex items-center justify-center rounded-full bg-gold px-6 py-3 text-sm font-semibold text-gold-ink hover:bg-gold-soft"
            >
              Start learning
            </Link>
            <Link
              href="/mini-games"
              className="inline-flex items-center justify-center rounded-full border border-line px-6 py-3 text-sm font-semibold text-cream hover:border-gold/50"
            >
              Mini Games
            </Link>
            <Link
              href="/pick-your-team"
              className="inline-flex items-center justify-center rounded-full border border-line px-6 py-3 text-sm font-semibold text-cream hover:border-gold/50"
            >
              Pick my team
            </Link>
            <Link
              href="/community"
              className="inline-flex items-center justify-center rounded-full border border-line px-6 py-3 text-sm font-semibold text-cream hover:border-gold/50"
            >
              Community
            </Link>
            <Link
              href="/watch-near-you"
              className="inline-flex items-center justify-center rounded-full border border-line px-6 py-3 text-sm font-semibold text-cream hover:border-gold/50"
            >
              Find a pub
            </Link>
            <Link
              href="/fan-map"
              className="inline-flex items-center justify-center rounded-full border border-line px-6 py-3 text-sm font-semibold text-cream hover:border-gold/50"
            >
              Fan map
            </Link>
          </div>
        </div>
      </section>

      <FanMapHomeSection />

      <section
        aria-label="What this site is for"
        className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14"
      >
        <div className="grid gap-4 md:grid-cols-3">
          {pillars.map((pillar) => (
            <Link
              key={pillar.href}
              href={pillar.href}
              className="flex h-full flex-col rounded-2xl border border-line bg-navy-2 p-5 transition hover:border-gold/50 hover:bg-navy-3"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                {pillar.kicker}
              </p>
              <h2 className="mt-2 font-display text-xl text-cream">{pillar.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-6 text-cream-dim">{pillar.body}</p>
              <span className="mt-4 text-sm font-medium text-gold">{pillar.cta} →</span>
            </Link>
          ))}

          <div className="flex h-full flex-col rounded-2xl border border-line bg-navy-2 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
              3. One stop for your team
            </p>
            <h2 className="mt-2 font-display text-xl text-cream">
              News, fantasy, pods, roster and where to watch
            </h2>
            <p className="mt-2 flex-1 text-sm leading-6 text-cream-dim">
              Pick a favourite and we keep that club in one place: headlines,
              fantasy, podcasts, depth chart, and this week’s kick-off. Less
              tab-hopping. More actually following the side you chose.
            </p>
            <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-sm">
              <li>
                <Link href="/news" className="text-gold hover:text-gold-soft">
                  News
                </Link>
              </li>
              <li>
                <Link href="/news/fantasy" className="text-gold hover:text-gold-soft">
                  Fantasy
                </Link>
              </li>
              <li>
                <Link href="/podcasts" className="text-gold hover:text-gold-soft">
                  Podcasts
                </Link>
              </li>
              <li>
                <Link href="/teams" className="text-gold hover:text-gold-soft">
                  Roster
                </Link>
              </li>
              <li>
                <Link href="/watch" className="text-gold hover:text-gold-soft">
                  Watch
                </Link>
              </li>
              <li>
                <Link href="/standings" className="text-gold hover:text-gold-soft">
                  Standings
                </Link>
              </li>
              <li>
                <Link href="/scores" className="text-gold hover:text-gold-soft">
                  Scores
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 pb-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-6">
          {firstLesson ? (
            <div>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                    Start here
                  </p>
                  <h2 className="mt-2 font-display text-3xl text-cream">Lesson one</h2>
                </div>
                <Link href="/learn" className="hidden text-sm text-gold sm:inline">
                  All lessons →
                </Link>
              </div>
              <div className="mt-6 max-w-xl">
                <LessonCard lesson={firstLesson} featured />
              </div>
              <Link href="/learn" className="mt-4 inline-block text-sm text-gold sm:hidden">
                All lessons →
              </Link>
            </div>
          ) : null}

          <div className="rounded-2xl border border-line bg-navy-2 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
              Pick a side
            </p>
            <h2 className="mt-2 font-display text-2xl text-cream">
              Choose a favourite so the site can follow with you
            </h2>
            <p className="mt-2 text-sm leading-6 text-cream-dim">
              Thirty-two clubs. One pick. We use it for news, fantasy, the Sunday
              card, and to point you at fans of the same team.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/pick-your-team"
                className="inline-flex items-center justify-center rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-gold-ink hover:bg-gold-soft"
              >
                Pick my team
              </Link>
              <Link
                href="/this-week#your-sunday"
                className="inline-flex items-center justify-center rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-cream hover:border-gold/50"
              >
                Sunday card
              </Link>
            </div>
          </div>
        </div>

        <aside className="space-y-4 lg:pt-2">
          <SundayCard fixtures={fixtures} reports={reports} compact />
          <GamesTeaser fixtures={fixtures} />
        </aside>
      </section>
      <LeagueFollow />
    </div>
  );
}
