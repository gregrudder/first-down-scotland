import type { Metadata } from "next";
import Link from "next/link";
import { DiscordCta } from "@/components/DiscordCta";
import { EditorialNote } from "@/components/EditorialNote";
import { GuideTeaser } from "@/components/GuideTeaser";
import { PageIntro } from "@/components/PageIntro";
import { meetupPartnerCities } from "@/data/pubs";
import { contactEmail, listingMailto } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Watch near you",
  description:
    "First Down Scotland is looking for one meetup partner in Glasgow and one in Edinburgh: a city home for Scottish NFL fans. Get in touch if you run a pub.",
};

export default function WatchNearYouPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <PageIntro eyebrow="Meet your team" title="Watch near you">
        <p>
          First Down Scotland is looking for one meetup partner (a home bar)
          in Glasgow, and one in Edinburgh. This is about a city home for
          Scottish NFL fans: a regular room where people who picked the same
          side can actually turn up. It is not a directory of every screen in
          Scotland, and it is not a pitch for free tabs.
        </p>
        <p>
          A Glasgow and Edinburgh partner list will go here once those homes
          are confirmed. Until then, Discord is the easiest way to find other
          fans this Sunday.
        </p>
        <p>
          Until those homes exist, the useful move is specific: ask a bar which
          NFL window they actually show, and use Discord to see who else is
          going. A blog list of venues we have not checked will not be copied
          onto this page. Empty, here, means we have not agreed a partner yet.
        </p>
        <EditorialNote />
      </PageIntro>

      <section className="mt-10">
        <h2 className="font-display text-2xl text-cream">Two cities first</h2>
        <p className="mt-2 text-sm leading-6 text-cream-dim">
          One partner in each city. When they are confirmed, they will be the
          places we point fans to.
        </p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {meetupPartnerCities.map((place) => (
            <li
              key={place.city}
              className="rounded-2xl border border-dashed border-line bg-navy-2 px-5 py-4"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                Looking for a partner
              </p>
              <p className="mt-1 font-display text-xl text-cream">{place.city}</p>
              <p className="mt-1 text-sm leading-6 text-cream-dim">{place.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 rounded-2xl border border-gold/35 bg-navy-2 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
          For pubs and bars
        </p>
        <h2 className="mt-2 font-display text-2xl text-cream">
          Get in touch if you would like to be that home
        </h2>
        <p className="mt-3 text-sm leading-6 text-cream-dim">
          If you already put the NFL on, or you would like a weekly room for
          Scottish fans, we would like to hear from you. Use the Contact page,
          or send a short email. Tell us the pub, the city, and what you already
          show. We will take it from there.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-gold-ink hover:bg-gold-soft"
          >
            Get in touch
          </Link>
          <a
            href={listingMailto()}
            className="inline-flex items-center justify-center rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-cream hover:border-gold/50"
          >
            Email a bar enquiry
          </a>
        </div>
        <p className="mt-3 text-xs text-cream-dim">{contactEmail()}</p>
      </section>

      <section className="mt-12 space-y-4 text-base leading-7 text-cream-dim">
        <h2 className="font-display text-2xl text-cream">While the list is empty</h2>
        <p>
          Phone the bar, or walk in, and ask a narrow question. Which Sunday
          window, on which service, and is that the plan this week. A Super
          Bowl once a year is not the same as a 6pm or 9pm habit. The 1am
          kick-offs are a different problem again: most rooms are shut, and
          that is fine. Watch those from the house, or not at all.
        </p>
        <p>
          If you find a room that works, say so in your team channel rather
          than waiting for us to bless it. If you run a pub in Glasgow or
          Edinburgh and you want to be the home we point people to, use{" "}
          <Link href="/contact" className="text-gold">
            Contact
          </Link>{" "}
          or the email above. Other cities: tell us when a weekly habit is real. We
          will not paint a maybe onto the site to make the page look busy.
        </p>
      </section>

      <div className="mt-8">
        <GuideTeaser slug="nfl-pubs-and-discord-scotland" />
      </div>

      <div className="mt-12">
        <DiscordCta />
      </div>

      <p className="mt-10 text-sm leading-6 text-cream-dim">
        Curious which NFL team owns your town?{" "}
        <Link href="/fan-map" className="text-gold">
          NFL Scheme Battles
        </Link>
        . Looking for Sky, Channel 5 or Game Pass rather than a pint?{" "}
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
