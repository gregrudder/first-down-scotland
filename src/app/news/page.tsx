import type { Metadata } from "next";
import Link from "next/link";
import { NewsTabs } from "@/components/NewsTabs";
import { OurTakeList } from "@/components/OurTakeList";
import { PageIntro } from "@/components/PageIntro";
import { ourTakes } from "@/data/our-take";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Our take",
  description:
    "Our take on the NFL week, written by Blitz at First Down Scotland for Scottish and UK fans. Short notes with a date and named sources.",
};

export default function NewsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <PageIntro eyebrow="News" title="Our take">
        <p>
          Short notes on the NFL, written for fans in Scotland and the rest of the UK.
          Each one has a date, the writer, and the sources it came from. Newest first.
        </p>
      </PageIntro>
      <OurTakeList items={ourTakes} now={new Date()} />
      <p className="mt-8 text-sm leading-6 text-cream-dim">
        Headlines pulled from ESPN, BBC Sport and the Guardian are on a separate page:{" "}
        <Link href="/news/headlines" className="text-gold">
          wire headlines
        </Link>
        .
      </p>
      <NewsTabs active="nfl" />
    </div>
  );
}
