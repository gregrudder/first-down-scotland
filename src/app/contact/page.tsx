import type { Metadata } from "next";
import Link from "next/link";
import { FeedbackForm } from "@/components/FeedbackForm";
import { PageIntro } from "@/components/PageIntro";
import { contactEmail } from "@/lib/contact";
import { absoluteUrl, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact First Down Scotland: corrections, privacy requests, pub partnerships, and notes on the lessons. Email or the form on this page.",
  alternates: { canonical: absoluteUrl("/contact") },
};

export default function ContactPage() {
  const email = contactEmail();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <PageIntro eyebrow="Contact" title="Contact">
        <p>
          This is how you reach {site.name}. Use it for a correction to a guide
          or lesson, a privacy request, a Glasgow or Edinburgh pub that wants to
          be a meetup partner, or a note on whether the lessons made sense.
        </p>
        <p>
          A couple of honest lines is enough. Nothing here is a public comment
          thread. What we do with a note is on the{" "}
          <Link href="/privacy" className="text-gold">
            Privacy Policy
          </Link>
          . How you may use the site is on the{" "}
          <Link href="/terms" className="text-gold">
            Terms of use
          </Link>
          .
        </p>
      </PageIntro>

      <section className="mt-10 rounded-2xl border border-line bg-navy-2 p-6">
        <h2 className="font-display text-3xl text-cream">Email</h2>
        <p className="mt-4 text-base leading-7 text-cream-dim">
          <a href={`mailto:${email}`} className="text-gold">
            {email}
          </a>
        </p>
        <p className="mt-3 text-sm leading-6 text-cream-dim">
          {site.name}, Scotland, United Kingdom. We do not publish a street
          address or a personal inbox.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-3xl text-cream">Or send a note</h2>
        <p className="mt-4 text-base leading-7 text-cream-dim">
          The form asks a few short questions, including whether a couple of
          pounds a month would feel fair. That question is research. It is not
          a checkout. You can also say what was confusing, or suggest something
          that is missing.
        </p>
        <div className="mt-8">
          <FeedbackForm />
        </div>
      </section>
    </div>
  );
}
