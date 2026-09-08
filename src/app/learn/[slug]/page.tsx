import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CompactLessonProgress } from "@/components/LearnProgress";
import { LessonArticle } from "@/components/LessonArticle";
import { MarkLessonDone } from "@/components/MarkLessonDone";
import {
  getLesson,
  getLessonSlugs,
  getNextLesson,
  getPreviousLesson,
  lessons,
} from "@/data/lessons";

type LessonPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getLessonSlugs()
    .filter((slug) => slug !== "plays")
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) return { title: "Lesson" };
  return {
    title: lesson.title,
    description: lesson.summary,
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();

  const next = getNextLesson(slug);
  const previous = getPreviousLesson(slug);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
        Lesson {lesson.number} of {lessons.length} · {lesson.minutes} min
      </p>
      <h1 className="mt-3 font-display text-4xl leading-tight text-cream sm:text-5xl">
        {lesson.title}
      </h1>
      <p className="mt-4 text-lg leading-8 text-cream-dim">{lesson.summary}</p>
      <CompactLessonProgress slug={lesson.slug} />
      <div className="gold-rule my-8" />
      <LessonArticle lesson={lesson} />

      {slug === "the-draft" ? (
        <div className="mt-12 rounded-2xl border border-line bg-navy-2 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
            2027 class
          </p>
          <p className="mt-2 text-sm leading-6 text-cream-dim">
            Twelve names on the early boards: rank, college, and why they matter. Rankings
            move every Saturday.
          </p>
          <Link href="/learn/draft-prospects" className="mt-3 inline-block text-sm font-semibold text-gold">
            Top 2027 prospects →
          </Link>
        </div>
      ) : null}

      {slug === "fantasy-football" ? (
        <div className="mt-12 rounded-2xl border border-line bg-navy-2 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
            Headlines
          </p>
          <p className="mt-2 text-sm leading-6 text-cream-dim">
            Once you know the shape of a league, the fantasy news tab is for start/sit
            noise and injury chatter. It is NFL fantasy, not Scottish football.
          </p>
          <Link href="/news/fantasy" className="mt-3 inline-block text-sm font-semibold text-gold">
            Fantasy news →
          </Link>
        </div>
      ) : null}

      <MarkLessonDone
        slug={lesson.slug}
        nextHref={next ? `/learn/${next.slug}` : "/learn/quiz"}
        nextLabel={next ? `Next: ${next.title} →` : "Take the 20-question quiz →"}
      />

      <nav className="mt-8 flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:justify-between">
        {previous ? (
          <Link href={`/learn/${previous.slug}`} className="text-sm text-cream-dim hover:text-gold">
            ← {previous.title}
          </Link>
        ) : (
          <Link href="/learn" className="text-sm text-cream-dim hover:text-gold">
            ← All lessons
          </Link>
        )}
        {next ? (
          <Link href={`/learn/${next.slug}`} className="text-sm font-semibold text-gold sm:text-right">
            Next: {next.title} →
          </Link>
        ) : (
          <Link href="/glossary" className="text-sm font-semibold text-gold sm:text-right">
            Browse the glossary →
          </Link>
        )}
      </nav>
    </div>
  );
}
