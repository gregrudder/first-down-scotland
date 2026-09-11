import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { UkKickoffHelper } from "@/components/UkKickoffHelper";
import { watchDisclaimer, watchOptions, watchTips } from "@/data/watch";

export const metadata: Metadata = {
  title: "Where to watch",
  description:
    "Honest high-level guidance on watching the NFL in the UK (Sky, Channel 5, Game Pass), plus pubs if you would rather meet fans of your team.",
};

export default function WatchPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <PageIntro eyebrow="United Kingdom" title="Where to watch">
        <p>{watchDisclaimer}</p>
        <p>
          Watch info for your team, in the same app as the lessons and the
          community. If you would rather sit with fans of the side you picked,
          open{" "}
          <Link href="/watch-near-you" className="text-gold">
            Watch near you
          </Link>
          .
        </p>
      </PageIntro>

      <div className="mt-10">
        <UkKickoffHelper showFixturesLink />
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {watchOptions.map((option) => (
          <article key={option.name} className="rounded-2xl border border-line bg-navy-2 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
              {option.kind}
            </p>
            <h2 className="mt-2 font-display text-2xl text-cream">{option.name}</h2>
            <p className="mt-3 text-sm leading-6 text-cream-dim">{option.summary}</p>
            <p className="mt-3 text-sm leading-6 text-cream">
              <span className="text-cream-dim">Typically: </span>
              {option.typical}
            </p>
          </article>
        ))}
      </div>

      <section className="mt-12 max-w-3xl">
        <h2 className="font-display text-3xl text-cream">How to use this without going mad</h2>
        <ul className="mt-5 list-disc space-y-3 pl-5 text-base leading-7 text-cream-dim">
          {watchTips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
        <p className="mt-6 text-sm leading-6 text-cream-dim">
          Want the kick-off times first?{" "}
          <Link href="/this-week" className="text-gold">
            This week’s games
          </Link>{" "}
          are automatic. Planning a nap around Sunday night or Monday night? The{" "}
          <Link href="/late-night-diary" className="text-gold">
            Late Night Diary
          </Link>{" "}
          lists only the late UK kick-offs. Looking for a pub in Scotland to meet fans of your team?{" "}
          <Link href="/watch-near-you" className="text-gold">
            Watch near you
          </Link>
          . Chat lives on{" "}
          <Link href="/community" className="text-gold">
            Community
          </Link>
          . For films and series that teach the sport, open the{" "}
          <Link href="/film-room" className="text-gold">
            Film room
          </Link>
          . If you are still learning the sport, start with{" "}
          <Link href="/learn" className="text-gold">
            the lessons
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
