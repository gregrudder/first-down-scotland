import type { Metadata } from "next";
import Link from "next/link";
import { DiscordCta } from "@/components/DiscordCta";
import { PageIntro } from "@/components/PageIntro";
import { PubDirectory } from "@/components/PubDirectory";
import { contactEmail, listingMailto } from "@/lib/contact";
import { getPublicPubs } from "@/lib/pubs";

export const metadata: Metadata = {
  title: "Pubs showing NFL",
  description:
    "Scottish bars checked as showing NFL this season, grouped by town. Each listing says what they show, links to the source, and the date we checked. Check with the bar before you go.",
};

export default function WatchNearYouPage() {
  const pubs = getPublicPubs();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <PageIntro eyebrow="Scotland" title="Pubs showing the NFL">
        <p>
          A directory of Scottish bars we have checked as showing NFL this season.
          A bar is listed only after that check: the name, the town, the address,
          what they show, a booking or contact link, the page we checked, and the
          date. We do not copy lists from other sites.
        </p>
        <p>Check with the bar before you go. A listing is not a promise the screen is on tonight.</p>
      </PageIntro>

      <PubDirectory pubs={pubs} />

      <section className="mt-12 rounded-2xl border border-line bg-navy-2 p-6">
        <h2 className="font-display text-2xl text-cream">Tell us about a bar</h2>
        <p className="mt-3 text-sm leading-6 text-cream-dim">
          If you run a bar that shows the NFL, or you think a listing is out of date,
          write to us with the pub, the town, what is on the screens, and a page we
          can check. We will not add a venue until that check is done.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-gold-ink hover:bg-gold-soft"
          >
            Contact
          </Link>
          <a
            href={listingMailto()}
            className="inline-flex items-center justify-center rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-cream hover:border-gold/50"
          >
            Email a listing
          </a>
        </div>
        <p className="mt-3 text-xs text-cream-dim">{contactEmail()}</p>
      </section>

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
        .
      </p>
    </div>
  );
}
