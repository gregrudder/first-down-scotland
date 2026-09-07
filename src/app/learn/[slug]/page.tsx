import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LessonArticle } from "@/components/LessonArticle";
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
      <div className="gold-rule my-8" />
      <LessonArticle lesson={lesson} />

      <div className="mt-12 flex flex-col gap-3 rounded-2xl border border-line bg-navy-2 p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-cream-dim">Ready to try a real match?</p>
        <Link href="/this-week" className="text-sm font-semibold text-gold">
          See this week’s games →
        </Link>
      </div>

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
