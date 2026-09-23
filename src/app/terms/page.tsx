import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { contactEmail } from "@/lib/contact";
import { absoluteUrl, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of use",
  description:
    "Terms of use for First Down Scotland: an independent NFL learning and community site for fans in the UK.",
  alternates: { canonical: absoluteUrl("/terms") },
};

const LAST_UPDATED = "23 September 2026";

export default function TermsPage() {
  const email = contactEmail();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <PageIntro eyebrow="Terms" title="Terms of use">
        <p>Last updated {LAST_UPDATED}.</p>
        <p>
          These terms cover your use of {site.name} at{" "}
          <a href="https://www.firstdownscotland.com" className="text-gold">
            www.firstdownscotland.com
          </a>
          . They are written in plain UK English. They are not advice from a
          solicitor.
        </p>
      </PageIntro>

      <div className="mt-10 space-y-10 text-base leading-7 text-cream-dim">
        <section>
          <h2 className="font-display text-3xl text-cream">Who we are</h2>
          <p className="mt-4">
            {site.name} is an independent learning and community project about
            American football, built in Scotland for fans in the UK. It is
            Greg’s site. We are not the NFL, a club, a broadcaster, or a
            company with a published number.
          </p>
          <p className="mt-3">
            Questions about these terms: the{" "}
            <Link href="/contact" className="text-gold">
              contact page
            </Link>{" "}
            or{" "}
            <a href={`mailto:${email}`} className="text-gold">
              {email}
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="font-display text-3xl text-cream">The agreement</h2>
          <p className="mt-4">
            By using the site you agree to these terms and to the{" "}
            <Link href="/privacy" className="text-gold">
              Privacy Policy
            </Link>
            . If you do not agree, please do not use the site.
          </p>
        </section>

        <section>
          <h2 className="font-display text-3xl text-cream">What the site is</h2>
          <p className="mt-4">
            We publish original lessons and guides, a fan map, pointers to
            Discord and to pubs, and practical tools such as kick-off times,
            scores and standings. Times and live numbers come from public feeds,
            including ESPN, and are shown in Europe/London. They can be late,
            wrong, or missing. If our TV notes disagree with a broadcaster, the
            broadcaster’s own schedule wins.
          </p>
          <p className="mt-3">
            News cards are a headline and a short snippet, then a link to the
            publisher. We do not reprint their articles.
          </p>
        </section>

        <section>
          <h2 className="font-display text-3xl text-cream">Using the site</h2>
          <p className="mt-4">
            You may read the pages, pick a team in your browser, put a town on
            the fan map, and send us a note. Please do not misuse the site. In
            particular, do not:
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5">
            <li>break the law, or ask us to</li>
            <li>scrape the site in a way that degrades it for other people</li>
            <li>
              stuff the fan map, the contact form, or any other form with fake
              or bulk entries
            </li>
            <li>pretend to be us, the NFL, a club, or a broadcaster</li>
            <li>
              send anything unlawful or abusive, or someone else’s personal
              data without a good reason
            </li>
            <li>try to break, probe, or overload the site</li>
          </ul>
          <p className="mt-4">
            We may remove a fan-map pin, ignore a note, or block a browser that
            breaks these rules.
          </p>
        </section>

        <section>
          <h2 className="font-display text-3xl text-cream">Notes you send us</h2>
          <p className="mt-4">
            If you send a note or register a town on the fan map, you confirm
            the details are yours to give. A fan-map pin is a club and a town,
            not a personal profile. We do not ask for your name on that form.
          </p>
          <p className="mt-3">
            You keep any rights in the words you send us. You allow us to read
            them, store them as described in the Privacy Policy, and use a
            correction to fix a page. We do not publish your note as a public
            comment.
          </p>
        </section>

        <section>
          <h2 className="font-display text-3xl text-cream">Our content</h2>
          <p className="mt-4">
            Lessons, guides, and the way the site is written and designed belong
            to {site.name} unless we say otherwise. You may share a link. You
            may quote a short passage with credit and a link, for discussion
            that is not commercial. Please do not copy a whole guide, republish
            the lessons as your own, or use the site to train a public model
            without asking.
          </p>
          <p className="mt-3">
            Team names, logos, and broadcast marks belong to their owners. We
            use them so fans can recognise a club. That is not an endorsement.
          </p>
          <p className="mt-3">
            Scores, headlines, and historical finals come from the sources named
            on the relevant page and in the Privacy Policy. Those sources keep
            their own rights.
          </p>
        </section>

        <section>
          <h2 className="font-display text-3xl text-cream">Community</h2>
          <p className="mt-4">
            Discord is the chat home. It sits on Discord’s own site, under
            Discord’s terms and our house rules. We do not run in-app chat.
            A pub listing, when we have one, is a meetup pointer. It is not a
            promise that a venue will show a particular game.
          </p>
        </section>

        <section>
          <h2 className="font-display text-3xl text-cream">Fan map</h2>
          <p className="mt-4">
            One pin per browser. The public map shows town totals, not people.
            You can ask us to delete a pin from the{" "}
            <Link href="/contact" className="text-gold">
              contact page
            </Link>
            . The Privacy Policy has the detail.
          </p>
        </section>

        <section>
          <h2 className="font-display text-3xl text-cream">Advertising</h2>
          <p className="mt-4">
            We may show ads, including Google AdSense, to help fund the
            project. Ads are off until we switch them on. If they are on, the
            Privacy Policy explains cookies and consent. An ad is not our
            recommendation, and it is not an endorsement by the advertiser of
            this site.
          </p>
        </section>

        <section>
          <h2 className="font-display text-3xl text-cream">No betting</h2>
          <p className="mt-4">
            We do not offer betting tips, odds, or a bookmaker product.
          </p>
        </section>

        <section>
          <h2 className="font-display text-3xl text-cream">Children</h2>
          <p className="mt-4">
            The site is not directed at children under 13. If you are under 16
            in the UK, use it with a parent or guardian. Do not send us a
            child’s name or contact details.
          </p>
        </section>

        <section>
          <h2 className="font-display text-3xl text-cream">Liability</h2>
          <p className="mt-4">
            This is a fan project. Lessons and guides are for learning the
            sport, not for a decision that needs professional advice. We take
            care with facts and we correct mistakes when you tell us. We do not
            promise that the site will always be available, complete, or up to
            date.
          </p>
          <p className="mt-3">
            To the extent the law allows, we are not liable for loss that comes
            from using the site, from a score or kick-off that was wrong, or
            from a third-party site you open from here (including Discord,
            YouTube, a publisher, a broadcaster, or a pub). We do not exclude
            liability that UK law does not let us exclude, including liability
            for death or personal injury caused by negligence, or for fraud.
          </p>
        </section>

        <section>
          <h2 className="font-display text-3xl text-cream">Changes</h2>
          <p className="mt-4">
            We may update these terms. The date at the top will change. If you
            keep using the site after that, the new terms apply. A material
            change will be described in plain English on this page.
          </p>
        </section>

        <section>
          <h2 className="font-display text-3xl text-cream">Which law applies</h2>
          <p className="mt-4">
            These terms are governed by the law of Scotland. The courts of
            Scotland deal with disputes, except where UK law gives you the
            right to bring a claim in another UK court.
          </p>
        </section>

        <section>
          <h2 className="font-display text-3xl text-cream">Contact</h2>
          <p className="mt-4">{site.name}, Scotland, United Kingdom.</p>
          <ul className="mt-4 list-disc space-y-2 pl-5">
            <li>
              <Link href="/contact" className="text-gold">
                Contact page
              </Link>
            </li>
            <li>
              <a href={`mailto:${email}`} className="text-gold">
                {email}
              </a>
            </li>
            <li>
              <Link href="/privacy" className="text-gold">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-gold">
                About
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
