import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { contactEmail } from "@/lib/contact";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How First Down Scotland collects, uses and stores information: analytics, cookies, feedback, browser preferences, ads and your UK GDPR rights.",
};

const LAST_UPDATED = "11 September 2026";

export default function PrivacyPage() {
  const email = contactEmail();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <PageIntro eyebrow="Privacy" title="Privacy Policy">
        <p>Last updated {LAST_UPDATED}.</p>
        <p>
          This page explains what {site.name} does with information when you use
          the site. It is written for people in the United Kingdom, in UK
          English. It is not legal advice.
        </p>
      </PageIntro>

      <div className="mt-10 space-y-10 text-base leading-7 text-cream-dim">
        <section>
          <h2 className="font-display text-3xl text-cream">Who we are</h2>
          <p className="mt-4">
            {site.name} is an independent learning and community project about
            American football, built in Scotland for fans in the UK. It is
            Greg’s site. We are not the NFL, and we do not publish a company
            number.
          </p>
          <p className="mt-3">
            The public site is{" "}
            <a
              href="https://www.firstdownscotland.com"
              className="text-gold"
            >
              www.firstdownscotland.com
            </a>
            . For privacy questions, use the{" "}
            <Link href="/feedback" className="text-gold">
              feedback form
            </Link>{" "}
            or email{" "}
            <a href={`mailto:${email}`} className="text-gold">
              {email}
            </a>
            . That address is already on the pub-listing page. We do not
            publish a personal inbox on the site.
          </p>
        </section>

        <section>
          <h2 className="font-display text-3xl text-cream">What this policy covers</h2>
          <p className="mt-4">
            It covers the website: lessons, fixtures, scores, news headlines,
            team pages, the feedback form, the NFL UK Fan Map, and the links out
            to Discord, YouTube and other sites. It does not cover Discord
            itself, YouTube, ESPN, publishers we link to, geocoder providers we
            query only to standardise a town you picked, or any pub you visit
            from the listings.
          </p>
        </section>

        <section>
          <h2 className="font-display text-3xl text-cream">What we collect</h2>
          <p className="mt-4">
            The site does not ask you to create an account. The NFL UK Fan Map
            uses a signed browser cookie, a stricter IP rate limit on a first
            pin than on an update, a honeypot, a minimum form-fill time, and
            (when configured) a Cloudflare Turnstile captcha so one person
            cannot stuff the map. We do not collect an email for that.
          </p>
          <ul className="mt-4 list-disc space-y-3 pl-5">
            <li>
              <strong className="text-cream">Usage analytics.</strong> The
              layout includes Vercel Web Analytics and Vercel Speed Insights.
              They measure page views and performance. Vercel’s analytics are
              designed not to use advertising cookies; they identify a visit
              with a short-lived hash from the request rather than a lasting
              user id. We may still see aggregated location, browser and
              referrer data.
            </li>
            <li>
              <strong className="text-cream">Hosting logs.</strong> Vercel, who
              host the site, process technical data such as IP address, user
              agent, and the pages requested, so the site can run, stay secure
              and be debugged.
            </li>
            <li>
              <strong className="text-cream">Feedback form.</strong> If you send
              a note we store what you typed: how you found us, favourite bit,
              confusing or broken bits, whether £2 a month would feel fair,
              suggested features, optional name, optional team, and whether you
              would recommend the site. There is no email field on the form. A
              hidden “website” field is only there to catch bots and is
              discarded. We also record when you opened the form, so a
              too-quick send can be rejected.
            </li>
            <li>
              <strong className="text-cream">Rate limiting.</strong> The
              feedback API briefly remembers a hash of IP address and browser
              in server memory (about ten minutes) so the inbox cannot be
              flooded. That is not written to a database.
            </li>
            <li>
              <strong className="text-cream">Browser storage you choose.</strong>{" "}
              On your device only, we keep a favourite team (
              <code className="text-cream">fds-team</code>: club, how you
              picked it, and when), a spoiler-free preference (
              <code className="text-cream">fds-spoiler-free</code>), and lesson
              progress plus quiz score (
              <code className="text-cream">fds-learn</code>). None of that is
              sent to us unless you later include a team on the feedback form.
            </li>
            <li>
              <strong className="text-cream">Fan map pin.</strong> If you put a
              team on the map we store the NFL club you picked, a standardised
              UK town (country, nation, council or region, town name, and that
              town’s centre coordinates from a geocoder), plus optional years
              following the NFL and watch-party interest. We do not store your
              name, email, postcode, street, phone GPS or a free-text address.
              One pin per browser cookie; you can update it. The public map
              never shows individual pins — only town-level totals. A town
              needs at least three registrations (unless we raise that
              threshold) before we show which teams those fans support.
            </li>
            <li>
              <strong className="text-cream">What we do not collect as a
              product.</strong> No payment details (the £2 question is research,
              not a checkout). No location from your phone. No advertising
              profile of our own.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-3xl text-cream">How we use it</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5">
            <li>Run the site and keep it secure.</li>
            <li>See which pages help, and which are slow or unused.</li>
            <li>Read tester notes and decide what to build next.</li>
            <li>
              Remember your team, spoiler-free setting and lesson progress on
              this browser.
            </li>
            <li>
              Run the fan map: one pin per signed browser cookie, public town
              aggregates, Scheme Battles ownership, and a private admin view
              of those same aggregates.
            </li>
            <li>
              When ads are switched on, show advertising and (if you agree)
              personalised ads. See Advertising below.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-3xl text-cream">Legal bases</h2>
          <p className="mt-4">
            For UK GDPR we rely on:
          </p>
          <ul className="mt-4 list-disc space-y-3 pl-5">
            <li>
              <strong className="text-cream">Legitimate interests</strong> — to
              operate an independent fan site, keep the feedback inbox usable,
              and understand aggregated use through Vercel’s privacy-minded
              analytics. We do not think those interests override your rights:
              there is no account, and analytics are not used to advertise to
              you ourselves.
            </li>
            <li>
              <strong className="text-cream">Consent</strong> — for
              non-essential cookies and similar tech used for advertising,
              including Google AdSense and any Google consent / CMP tools,{" "}
              <em>when those are enabled</em>. You can withdraw that consent
              through the consent tool once it is live.
            </li>
            <li>
              Optional name and free-text on feedback are given because you
              chose to send them. We treat that as a request to read the note.
            </li>
            <li>
              Putting a pin on the fan map is a request to count that town
              and team. You can ask us to delete it.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-3xl text-cream">
            Cookies and similar technology
          </h2>
          <p className="mt-4">
            A cookie is a small file a site can store on your device. Similar
            tools include localStorage and pixels.
          </p>
          <ul className="mt-4 list-disc space-y-3 pl-5">
            <li>
              <strong className="text-cream">Strictly necessary (this
              site).</strong> Favourite team, spoiler-free and lesson progress
              live in localStorage so the page you asked for can remember a
              choice. They stay until you clear site data or change the
              setting. If you put a pin on the fan map we set an httpOnly cookie so
              this browser can update that one pin. The admin map uses a
              separate cookie after the admin password is entered. Cloudflare
              Turnstile, when enabled, is a captcha on the add form.
            </li>
            <li>
              <strong className="text-cream">Analytics (this site).</strong>{" "}
              Vercel Web Analytics and Speed Insights do not use advertising
              cookies. They still process a little technical data so we can see
              traffic and performance.
            </li>
            <li>
              <strong className="text-cream">YouTube.</strong> Live and finished
              game cards may embed an official clip via{" "}
              <code className="text-cream">youtube-nocookie.com</code>, or link
              out to YouTube. Playing a video, or following a YouTube link, is
              Google’s service: they may set cookies. Club YouTube on team
              pages is a link-out only.
            </li>
            <li>
              <strong className="text-cream">Advertising (when
              enabled).</strong> Google AdSense may set cookies to show ads,
              measure them, and — if you consent — personalise them. A Google
              consent / CMP banner will be the place to manage that once ads
              are live. The AdSense publisher script is on the site so Google can
              verify the property. Auto ads and a consent banner are not on yet.
            </li>
          </ul>
          <p className="mt-4">
            Fonts are bundled with the site at build time. We do not load Google
            Fonts from Google in your browser.
          </p>
        </section>

        <section>
          <h2 className="font-display text-3xl text-cream">Advertising</h2>
          <p className="mt-4">
            We may use Google AdSense to fund the project. AdSense can use
            cookies and similar tech. Personalised ads need your consent in the
            UK. Non-personalised ads may still use some technical data to serve
            and measure a slot. When a consent tool is on the site, use it to
            allow or refuse personalised ads. You can also use your browser
            controls, and Google’s own ad settings, to limit ads that use your
            activity.
          </p>
          <p className="mt-3">
            We do not sell your contact details. We do not run a betting or
            odds product, and the site is not aimed at children.
          </p>
        </section>

        <section>
          <h2 className="font-display text-3xl text-cream">Third parties</h2>
          <p className="mt-4">
            These organisations may process information because the site uses
            their services, or because you leave our pages:
          </p>
          <ul className="mt-4 list-disc space-y-3 pl-5">
            <li>
              <strong className="text-cream">Vercel</strong> — hosting, Web
              Analytics and Speed Insights.
            </li>
            <li>
              <strong className="text-cream">Formspree and/or Resend</strong> —
              deliver the feedback form to Greg. Which one runs depends
              on server settings.
            </li>
            <li>
              <strong className="text-cream">Neon / Vercel Postgres</strong> —
              stores anonymous fan-map pins and town-ownership flips when the
              map is wired up.
            </li>
            <li>
              <strong className="text-cream">Town search</strong> — Geoapify,
              Photon (Komoot) or Nominatim, depending on settings. They see the
              town name you typed so we can offer UK autocomplete. We do not
              send them your email.
            </li>
            <li>
              <strong className="text-cream">Cloudflare Turnstile</strong> —
              captcha on the fan-map add form when those keys are set. Cloudflare
              sees the captcha token, not your town choice.
            </li>
            <li>
              <strong className="text-cream">Google</strong> — YouTube embeds
              and search links today; AdSense and a consent / CMP{" "}
              <em>when enabled</em>.
            </li>
            <li>
              <strong className="text-cream">Discord</strong> — the community
              chat is off-site. Joining uses Discord’s own terms and privacy
              notice. We do not run in-app chat.
            </li>
            <li>
              <strong className="text-cream">ESPN, Sleeper, RSS
              publishers, nflverse</strong> — public scores, standings,
              rookies, news headlines and historical finals. Those calls are
              made by our servers for the page you asked for. They are not a
              way we send them your name.
            </li>
          </ul>
          <p className="mt-4">
            News cards show a headline and a short snippet from a public RSS
            feed, then link to the publisher. Full articles stay on their site.
          </p>
        </section>

        <section>
          <h2 className="font-display text-3xl text-cream">How long we keep it</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5">
            <li>
              Browser preferences stay on your device until you clear them.
            </li>
            <li>
              Feedback notes are kept long enough to read and act on them, then
              deleted or kept only in a short internal record if we still need
              the point (for example a bug).
            </li>
            <li>Feedback rate-limit keys drop after about ten minutes.</li>
            <li>
              Analytics and hosting logs follow Vercel’s retention for those
              products.
            </li>
            <li>
              Fan map town pins stay until you ask us to delete them, or we
              close the map. The pin cookie lasts about 30 days.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-3xl text-cream">Your rights</h2>
          <p className="mt-4">
            Under UK GDPR you can ask us to: access the personal data we hold
            about you; correct it; erase it; restrict how we use it; object to
            processing based on legitimate interests; and receive a copy in a
            portable form where that right applies. Where we rely on consent,
            you can withdraw it at any time. That does not undo processing
            already done.
          </p>
          <p className="mt-3">
            Write via{" "}
            <Link href="/feedback" className="text-gold">
              Feedback
            </Link>{" "}
            or {email}. Say you are making a privacy request. We may need to
            check it is you before we change or delete a feedback note.
          </p>
          <p className="mt-3">
            You can also complain to the Information Commissioner’s Office
            (ICO) at{" "}
            <a href="https://ico.org.uk" className="text-gold">
              ico.org.uk
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="font-display text-3xl text-cream">Children</h2>
          <p className="mt-4">
            The site is a general learning hub for the NFL. It is not directed
            at children under 13, and we do not knowingly collect personal data
            from anyone under 13. If you are under 16 in the UK, please only
            use the site with a parent or guardian. Do not send a feedback note
            with a child’s name or contact details. If you think a child has
            sent us personal data, tell us and we will delete it.
          </p>
        </section>

        <section>
          <h2 className="font-display text-3xl text-cream">International transfers</h2>
          <p className="mt-4">
            Vercel, Formspree, Resend and Google are organisations that may
            process data in the United States and other countries. Where that
            happens, those providers typically rely on the UK–US data bridge,
            Standard Contractual Clauses, or another lawful transfer tool. We
            do not run our own servers outside the host’s platform.
          </p>
        </section>

        <section>
          <h2 className="font-display text-3xl text-cream">Changes to this policy</h2>
          <p className="mt-4">
            If we change how we collect or use information — including turning
            on AdSense or a consent banner — we will update this page and the
            date at the top. Material changes will be described here in plain
            English.
          </p>
        </section>

        <section>
          <h2 className="font-display text-3xl text-cream">How to contact us</h2>
          <p className="mt-4">
            {site.name}, Scotland / United Kingdom.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5">
            <li>
              <Link href="/feedback" className="text-gold">
                Feedback form
              </Link>
            </li>
            <li>
              <a href={`mailto:${email}`} className="text-gold">
                {email}
              </a>
            </li>
          </ul>
          <p className="mt-4">
            More about the project is on{" "}
            <Link href="/about" className="text-gold">
              About
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
