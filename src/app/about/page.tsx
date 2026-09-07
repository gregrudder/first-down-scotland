import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: "What First Down Scotland is for — and what it is not.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <PageIntro eyebrow="About" title={site.name}>
        <p>{site.tagline}</p>
      </PageIntro>

      <div className="mt-10 space-y-6 text-base leading-7 text-cream-dim">
        <p>
          This site is for people in Scotland and the rest of the UK who keep meaning
          to “get” American football and then bounce off the jargon. It is a learning
          app first: a short path, a glossary, and only then the week’s fixtures and a
          calm note on where those games might be on television.
        </p>
        <p>
          It is not a TV guide, a fantasy assistant, a betting tip sheet, or a live
          play-by-play machine. We will not pretend a rights list is perfect. Kick-off
          times come from ESPN’s public scoreboard and are shown in Europe/London. If
          that feed fails, we say so.
        </p>
        <p>
          The tone is meant to be welcoming rather than matey-American. We use UK
          spelling — defence, favourite, organised — and we explain US words when the
          broadcast will say them differently.
        </p>
      </div>

      <ul className="mt-10 space-y-3 text-sm">
        <li>
          <Link href="/learn" className="text-gold">
            Start the learning path →
          </Link>
        </li>
        <li>
          <Link href="/this-week" className="text-gold">
            This week’s games →
          </Link>
        </li>
        <li>
          <Link href="/watch" className="text-gold">
            Where to watch →
          </Link>
        </li>
        <li>
          <Link href="/history" className="text-gold">
            NFL history →
          </Link>
        </li>
        <li>
          <Link href="/teams" className="text-gold">
            Team profiles →
          </Link>
        </li>
        <li>
          <Link href="/pick-your-team" className="text-gold">
            Pick your team →
          </Link>
        </li>
        <li>
          <Link href="/community" className="text-gold">
            Community — Discord coming soon →
          </Link>
        </li>
      </ul>
    </div>
  );
}
