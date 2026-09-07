import Link from "next/link";
import { GamesTeaser } from "@/components/GamesTeaser";
import { HomeTeamCard } from "@/components/TeamMark";
import { LessonCard } from "@/components/LessonCard";
import { lessons } from "@/data/lessons";
import { getNflFixtures } from "@/lib/espn";
import { site } from "@/lib/site";

export const revalidate = 300;

export default async function HomePage() {
  const fixtures = await getNflFixtures();
  const start = lessons[0];

  return (
    <div>
      <section className="field-grid border-b border-line">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Scotland · United Kingdom
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.1] text-cream sm:text-6xl">
            Learn the NFL first. Then see what’s on this week.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-cream-dim">{site.tagline}</p>
          <p className="mt-3 max-w-2xl text-base leading-7 text-cream-dim">
            A beginner path in UK English — downs, scoring, the clock — plus automatic
            fixtures in London time and an honest note on Sky, Channel 5 and the rest.
            Learning is the point. The telly bit is extra.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={start ? `/learn/${start.slug}` : "/learn"}
              className="inline-flex items-center justify-center rounded-full bg-gold px-6 py-3 text-sm font-semibold text-navy hover:bg-gold-soft"
            >
              Start learning
            </Link>
            <Link
              href="/this-week"
              className="inline-flex items-center justify-center rounded-full border border-line px-6 py-3 text-sm font-semibold text-cream hover:border-gold/50"
            >
              Games this week
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
          <HomeTeamCard />
          <GamesTeaser fixtures={fixtures} />
          <div className="rounded-2xl border border-line bg-navy-2 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
              Also useful
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/glossary" className="text-cream hover:text-gold">
                  Jargon decoder →
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-cream hover:text-gold">
                  What’s going on — NFL news →
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
                <Link href="/watch-near-you" className="text-cream hover:text-gold">
                  Watch near you — Scottish pubs →
                </Link>
              </li>
              <li>
                <Link href="/pick-your-team" className="text-cream hover:text-gold">
                  Pick your team →
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-cream hover:text-gold">
                  Community — Discord coming soon →
                </Link>
                <p className="mt-1 text-xs leading-5 text-cream-dim">
                  Meet other UK beginners. Learning stays here; chat is next door.
                </p>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
