import type { Metadata } from "next";
import { LessonCard } from "@/components/LessonCard";
import { PageIntro } from "@/components/PageIntro";
import { lessons } from "@/data/lessons";

export const metadata: Metadata = {
  title: "Learn the NFL",
  description:
    "A short, ordered path for UK beginners: the field, downs, scoring, common plays with diagrams, turnovers, the clock, penalties, and what to look for on telly.",
};

export default function LearnIndexPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <PageIntro eyebrow="Learning path" title="Ten short lessons. Start at one.">
        <p>
          Read them in order if you are brand new. Skip ahead if a word on the broadcast
          sent you here. Each one is written in UK English, for people who did not grow
          up with Friday-night lights.
        </p>
      </PageIntro>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {lessons.map((lesson) => (
          <LessonCard key={lesson.slug} lesson={lesson} />
        ))}
      </div>
    </div>
  );
}
