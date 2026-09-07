import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PlayDiagram, PlayLegend } from "@/components/PlayDiagram";
import { getNextLesson } from "@/data/lessons";
import { getNextPlay, getPlay, getPlaySlugs, getPreviousPlay, plays } from "@/data/plays";

type PlayPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getPlaySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PlayPageProps): Promise<Metadata> {
  const { slug } = await params;
  const play = getPlay(slug);
  if (!play) return { title: "Play" };
  return {
    title: play.title,
    description: play.summary,
  };
}

export default async function PlayPage({ params }: PlayPageProps) {
  const { slug } = await params;
  const play = getPlay(slug);
  if (!play) notFound();

  const previous = getPreviousPlay(slug);
  const next = getNextPlay(slug);
  const index = plays.findIndex((entry) => entry.slug === slug);
  const afterPlays = getNextLesson("plays");

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
        Common plays · {index + 1} of {plays.length} · {play.minutes} min
      </p>
      <p className="mt-3">
        <Link href="/learn/plays" className="text-sm text-cream-dim hover:text-gold">
          ← All diagrams
        </Link>
      </p>
      <h1 className="mt-3 font-display text-4xl leading-tight text-cream sm:text-5xl">
        {play.title}
      </h1>
      <p className="mt-3 text-base leading-7 text-cream-dim">{play.alsoCalled}</p>
      <div className="gold-rule my-8" />

      <div className="space-y-5 text-base leading-7 text-cream-dim">
        <p>{play.summary}</p>
        <aside className="rounded-2xl border border-gold/30 bg-navy-3 px-5 py-4">
          <p className="text-sm font-semibold text-gold">What to watch on telly</p>
          <p className="mt-2 text-sm leading-6 text-cream">{play.watch}</p>
        </aside>
      </div>

      <div className="mt-8">
        <PlayLegend />
      </div>
      <div className="mt-4">
        <PlayDiagram play={play} />
      </div>

      <nav className="mt-10 flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:justify-between">
        {previous ? (
          <Link
            href={`/learn/plays/${previous.slug}`}
            className="text-sm text-cream-dim hover:text-gold"
          >
            ← {previous.title}
          </Link>
        ) : (
          <Link href="/learn/plays" className="text-sm text-cream-dim hover:text-gold">
            ← All common plays
          </Link>
        )}
        {next ? (
          <Link
            href={`/learn/plays/${next.slug}`}
            className="text-sm font-semibold text-gold sm:text-right"
          >
            Next: {next.title} →
          </Link>
        ) : afterPlays ? (
          <Link href={`/learn/${afterPlays.slug}`} className="text-sm font-semibold text-gold sm:text-right">
            Next lesson: {afterPlays.title} →
          </Link>
        ) : (
          <Link href="/learn" className="text-sm font-semibold text-gold sm:text-right">
            Back to the path →
          </Link>
        )}
      </nav>
    </div>
  );
}
