import Link from "next/link";
import { SundayCard } from "@/components/SundayCard";
import { DraftProspectsTeaser } from "@/components/DraftProspectsTeaser";
import { GamesTeaser } from "@/components/GamesTeaser";
import { LessonCard } from "@/components/LessonCard";
import { lessons } from "@/data/lessons";
import { getDraftProspects } from "@/lib/draft-prospects";
import { getNflFixtures } from "@/lib/espn";
import { site } from "@/lib/site";

export const revalidate = 300;

export default async function HomePage() {
  const [fixtures, draftBoard] = await Promise.all([getNflFixtures(), getDraftProspects()]);
  const start = lessons[0];

  return (
    <div>
      <section className="field-grid border-b border-line">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Scotland · United Kingdom
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.1] text-cream sm:text-6xl">
            Learn the game. Meet fans of your team.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-cream-dim">{site.tagline}</p>
          <p className="mt-3 max-w-2xl text-base leading-7 text-cream-dim">
            Beginner lessons in UK English, then a place to find people who support
            the same club: Discord for chat, and Scottish pubs for real-world meetups.
            Fixtures, watch notes and news stay as helpers. This is not a listings
            site wearing a Saltire.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={start ? `/learn/${start.slug}` : "/learn"}
              className="inline-flex items-center justify-center rounded-full bg-gold px-6 py-3 text-sm font-semibold text-navy hover:bg-gold-soft"
            >
              Start learning
            </Link>
            <Link
              href="/community"
              className="inline-flex items-center justify-center rounded-full border border-line px-6 py-3 text-sm font-semibold text-cream hover:border-gold/50"
            >
              Meet your team
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                Start here
              </p>
              <h2 className="mt-2 font-display text-3xl text-cream">The beginner journey</h2>
            </div>
            <Link href="/learn" className="hidden text-sm text-gold sm:inline">
              All lessons →
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {lessons.map((lesson) => (
              <LessonCard key={lesson.slug} lesson={lesson} featured={lesson.number === 1} />
            ))}
          </div>
        </div>
        <div className="space-y-4 lg:pt-16">
          <SundayCard fixtures={fixtures} compact />
          <GamesTeaser fixtures={fixtures} />
          <DraftProspectsTeaser board={draftBoard} compact />
          <div className="rounded-2xl border border-line bg-navy-2 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
              Also useful
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/community" className="text-cream hover:text-gold">
                  Community: Discord for your team →
                </Link>
                <p className="mt-1 text-xs leading-5 text-cream-dim">
                  The chat home for Scottish and UK fans of the side you picked.
                  Invite when it is ready, not a dead link.
                </p>
              </li>
              <li>
                <Link href="/watch-near-you" className="text-cream hover:text-gold">
                  Pubs: meet fans of your team →
                </Link>
                <p className="mt-1 text-xs leading-5 text-cream-dim">
                  Places that put the NFL on, so you can sit with your lot rather
                  than shout at the sofa on your own.
                </p>
              </li>
              <li>
                <Link href="/pick-your-team" className="text-cream hover:text-gold">
                  Pick my team →
                </Link>
              </li>
              <li>
                <Link href="/this-week#your-sunday" className="text-cream hover:text-gold">
                  Your Sunday →
                </Link>
              </li>
              <li>
                <Link href="/learn/draft-prospects" className="text-cream hover:text-gold">
                  2027 draft prospects →
                </Link>
              </li>
              <li>
                <Link href="/glossary" className="text-cream hover:text-gold">
                  Jargon decoder →
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-cream hover:text-gold">
                  NFL news (helper) →
                </Link>
              </li>
              <li>
                <Link href="/podcasts" className="text-cream hover:text-gold">
                  Podcasts to lock onto →
                </Link>
              </li>
              <li>
                <Link href="/news/fantasy" className="text-cream hover:text-gold">
                  NFL fantasy news (not Scottish football) →
                </Link>
              </li>
              <li>
                <Link href="/watch" className="text-cream hover:text-gold">
                  Where to watch in the UK →
                </Link>
              </li>
              <li>
                <Link href="/film-room" className="text-cream hover:text-gold">
                  Film room: watch to learn →
                </Link>
              </li>
              <li>
                <Link href="/history" className="text-cream hover:text-gold">
                  NFL history →
                </Link>
              </li>
              <li>
                <Link href="/teams" className="text-cream hover:text-gold">
                  All 32 teams →
                </Link>
              </li>
              <li>
                <Link href="/feedback" className="text-cream hover:text-gold">
                  Feedback →
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
