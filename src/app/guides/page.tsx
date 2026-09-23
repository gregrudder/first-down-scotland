import type { Metadata } from "next";
import Link from "next/link";
import { EditorialNote } from "@/components/EditorialNote";
import { PageIntro } from "@/components/PageIntro";
import {
  guideHref,
  guideReadingMinutes,
  guideUpdatedLabel,
  guides,
} from "@/data/guides";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Guides",
  description:
    "The Learn lessons stay short on purpose. These go further: where to watch in Britain, how the jargon lands if you grew up with football or rugby, how to handle a 1am kick-off, and how to find people in Scotland who care about your team.",
  alternates: { canonical: absoluteUrl("/guides") },
};

export default function GuidesIndexPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <PageIntro eyebrow="Guides" title="Longer reads for Scottish and UK NFL fans">
        <p>
          The Learn lessons stay short on purpose. These go further: where to
          watch in Britain, how the jargon lands if you grew up with football or
          rugby, how to handle a 1am kick-off, and how to find people in Scotland
          who care about your team.
        </p>
        <EditorialNote updatedLabel={guideUpdatedLabel} />
      </PageIntro>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {guides.map((guide) => (
          <Link
            key={guide.slug}
            href={guideHref(guide.slug)}
            className="flex h-full flex-col rounded-2xl border border-line bg-navy-2 p-5 transition hover:border-gold/50 hover:bg-navy-3"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
              About {guideReadingMinutes(guide)} min
            </p>
            <h2 className="mt-2 font-display text-2xl text-cream">{guide.title}</h2>
            <p className="mt-2 flex-1 text-sm leading-6 text-cream-dim">{guide.blurb}</p>
            <span className="mt-4 text-sm font-medium text-gold">Read the guide →</span>
          </Link>
        ))}
      </div>

      <p className="mt-10 max-w-3xl text-sm leading-6 text-cream-dim">
        New to the sport? Start with{" "}
        <Link href="/learn" className="text-gold">
          the lessons
        </Link>
        , then come back. Who writes these, and what we refuse to invent, is on{" "}
        <Link href="/about" className="text-gold">
          About
        </Link>
        . If a sentence is wrong,{" "}
        <Link href="/contact" className="text-gold">
          tell us
        </Link>
        .
      </p>
    </div>
  );
}
