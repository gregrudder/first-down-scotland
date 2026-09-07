import Link from "next/link";
import type { Lesson } from "@/data/lessons";

export function LessonCard({ lesson, featured = false }: { lesson: Lesson; featured?: boolean }) {
  return (
    <Link
      href={`/learn/${lesson.slug}`}
      className={`group flex h-full flex-col rounded-2xl border border-line bg-navy-2 p-5 transition hover:border-gold/50 hover:bg-navy-3 ${
        featured ? "sm:p-6" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
          Lesson {lesson.number}
        </span>
        <span className="text-xs text-cream-dim">{lesson.minutes} min</span>
      </div>
      <h3 className="mt-3 font-display text-xl text-cream group-hover:text-gold-soft">
        {lesson.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-cream-dim">{lesson.summary}</p>
      <span className="mt-4 text-sm font-medium text-gold">
        {lesson.number === 1 ? "Start here" : "Open lesson"} →
      </span>
    </Link>
  );
}
