import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { filmRoomDisclaimer, filmRoomLater, filmTitles } from "@/data/film-room";

export const metadata: Metadata = {
  title: "Film room",
  description:
    "Curated NFL films and series for UK beginners: America’s Game, Hard Knocks, All or Nothing, Quarterback and Wide Receiver, with honest notes on where they usually live. Talk it through with fans of your team later.",
};

export default function FilmRoomPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <PageIntro eyebrow="Watch to learn" title="Film room">
        <p>
          Live games are chaotic if you are still on lesson two. These are the series
          that teach the sport while you sit on the sofa. Five to start with. More
          will land here when they are worth a beginner’s Sunday. Talk it through in
          your team channel later, once Discord is live.
        </p>
        <p>{filmRoomDisclaimer}</p>
      </PageIntro>

      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        {filmTitles.map((title) => (
          <article key={title.id} className="flex flex-col rounded-2xl border border-line bg-navy-2 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
              {title.kind}
            </p>
            <h2 className="mt-2 font-display text-2xl text-cream">{title.title}</h2>
            {title.alsoCalled ? (
              <p className="mt-1 text-sm text-cream-dim">{title.alsoCalled}</p>
            ) : null}
            <p className="mt-4 text-sm leading-6 text-cream">
              <span className="text-cream-dim">Why it helps: </span>
              {title.why}
            </p>
            <p className="mt-3 text-sm leading-6 text-cream-dim">
              <span className="text-cream">UK availability: </span>
              {title.watchHint}
            </p>
            {title.officialUrl ? (
              <p className="mt-4">
                <a
                  href={title.officialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-semibold text-gold"
                >
                  {title.officialLabel} →
                </a>
              </p>
            ) : null}
          </article>
        ))}
      </div>

      <section className="mt-12 max-w-3xl rounded-2xl border border-dashed border-line bg-navy-2/60 p-5">
        <h2 className="font-display text-2xl text-cream">On the list</h2>
        <p className="mt-2 text-sm leading-6 text-cream-dim">
          Room for more. Nothing here is a promise: just what we would add next
          without stuffing the page.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-cream-dim">
          {filmRoomLater.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <p className="mt-10 max-w-3xl text-sm leading-6 text-cream-dim">
        Live kick-offs and channel maps stay on{" "}
        <Link href="/watch" className="text-gold">
          Where to watch
        </Link>
        . Meet fans of your team on{" "}
        <Link href="/community" className="text-gold">
          Community
        </Link>
        . If you have not done the path yet, start with{" "}
        <Link href="/learn" className="text-gold">
          the lessons
        </Link>
        .
      </p>
    </div>
  );
}
