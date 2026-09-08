import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { PubCard } from "@/components/PubCard";
import {
  comingSoonPlaces,
  demoPubs,
  livePubs,
  pubsDisclaimer,
} from "@/data/pubs";
import { contactEmail, listingMailto } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Watch near you",
  description:
    "Scottish pubs that show the NFL, so you can meet fans of the team you support. Call ahead, then arrange who is going in Discord when it is live.",
};

export default function WatchNearYouPage() {
  const demo = demoPubs();
  const live = livePubs();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <PageIntro eyebrow="Meet your team" title="Watch near you">
        <p>
          These are pubs that put the NFL on, so you can sit with fans of the
          same side you picked rather than shouting at the sofa on your own. Use
          Discord (when the invite is live) to arrange who is going. Television
          rights are one thing. Finding a room that will actually put RedZone on
          is another.
        </p>
        <p>
          Always call ahead. Packages change, Sundays get busy, and a listing here
          is not a promise they have your game this week.
        </p>
      </PageIntro>

      <section className="mt-10">
        <h2 className="font-display text-2xl text-cream">How this works</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-cream-dim">
          <li>Free listings for pubs we can confirm show the NFL, so fans of the same team can find each other.</li>
          <li>
            Featured spots (badge, extra detail) will be available for bar owners
            who want to stand out. Not a hard sell, just a clearer card.
          </li>
          <li>We will not invent venues. If it is a demo, it says so loudly.</li>
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-3xl text-cream">Sample listing</h2>
        <p className="mt-2 text-sm leading-6 text-cream-dim">
          This is what a featured card will look like. It is fiction. Do not go
          to Sampletown.
        </p>
        <div className="mt-5 grid gap-4">
          {demo.map((pub) => (
            <PubCard key={pub.id} pub={pub} />
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-3xl text-cream">Pubs we can point you at</h2>
        <p className="mt-2 text-sm leading-6 text-cream-dim">{pubsDisclaimer}</p>
        <div className="mt-5 grid gap-4">
          {live.map((pub) => (
            <PubCard key={pub.id} pub={pub} />
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-3xl text-cream">Coming soon</h2>
        <p className="mt-2 text-sm leading-6 text-cream-dim">
          Real listings for more of Edinburgh, Glasgow and the rest of Scotland
          are being added. If you run a pub (or you have a reliable regular) get
          in touch and we will check it rather than guess.
        </p>
        <ul className="mt-5 grid gap-3">
          {comingSoonPlaces.map((place) => (
            <li
              key={place.city}
              className="rounded-2xl border border-dashed border-line bg-navy-2 px-5 py-4"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                Coming soon
              </p>
              <p className="mt-1 font-display text-xl text-cream">{place.city}</p>
              <p className="mt-1 text-sm leading-6 text-cream-dim">{place.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 rounded-2xl border border-line bg-navy-2 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
          For bar owners
        </p>
        <h2 className="mt-2 font-display text-2xl text-cream">Get listed, or featured</h2>
        <p className="mt-3 text-sm leading-6 text-cream-dim">
          If you already put the NFL on, a free listing helps fans of the same
          team find a table together, instead of another Facebook hunt. Featured
          cards (like the sample above) are for pubs that want a bit more room:
          screens, booking notes, a Sunday pitch. No hard sell, just a clearer
          page for people who will actually turn up and order wings.
        </p>
        <a
          href={listingMailto()}
          className="mt-5 inline-flex items-center justify-center rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-gold-ink hover:bg-gold-soft"
        >
          Get in touch
        </a>
        <p className="mt-3 text-xs text-cream-dim">{contactEmail()}</p>
      </section>

      <p className="mt-10 text-sm leading-6 text-cream-dim">
        Looking for Sky, Channel 5 or Game Pass rather than a pint?{" "}
        <Link href="/watch" className="text-gold">
          Where to watch in the UK
        </Link>
        . Chat with fans of your team:{" "}
        <Link href="/community" className="text-gold">
          Community
        </Link>
        . Films that teach the sport:{" "}
        <Link href="/film-room" className="text-gold">
          Film room
        </Link>
        . Kick-off times:{" "}
        <Link href="/this-week" className="text-gold">
          this week’s games
        </Link>
        .
      </p>
    </div>
  );
}
