import type { Metadata } from "next";
import Link from "next/link";
import { DiscordCta } from "@/components/DiscordCta";
import { PageIntro } from "@/components/PageIntro";

export const metadata: Metadata = {
  title: "Community",
  description:
    "A First Down Scotland Discord is coming soon: general chat and a channel per NFL team for Scottish and UK beginners.",
};

const howItWorks = [
  "When the invite is up, join the server, say hello in #general, and pick a team channel, or lurk until you have a side.",
  "Be decent. It is meant to be a small UK room for people still learning the sport, not a US sports-radio shout.",
  "If someone asks for no spoilers, don’t post the score. Easy.",
  "Beginners are the point. “What does 3rd & 12 mean?” will be a good question there.",
];

const houseRules = [
  "Be sound. Disagreement is fine; being a pain is not.",
  "No hate, slurs, or pile-ons. This is a wee learning community, not a comment section.",
  "No spam, and no betting tips or odds-pushing. We do not do that on the site either.",
  "Beginners are welcome. Explain, don’t sneer.",
  "Don’t spoil a game if people have asked you not to: UK kick-offs mean someone is always catching up.",
];

const exampleChannels = ["#general", "#nfl", "#chargers", "#seahawks", "#chiefs"];

export default function CommunityPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <PageIntro eyebrow="People" title="Community">
        <p>
          The site is for learning. Discord will be for people: other Scottish and
          UK fans who are getting into the NFL and would rather ask a daft question
          than sit through another American broadcast pretending they already knew.
        </p>
      </PageIntro>

      <div className="mt-8">
        <DiscordCta />
      </div>

      <div className="mt-12 space-y-6 text-base leading-7 text-cream-dim">
        <p>
          One First Down Scotland server is planned: general chat for beginners,
          an NFL room for the week’s games, and a channel per team so you can hang
          with fans of your side. That is the shape of it. The invite itself is
          not live yet.
        </p>
        <p>
          Lessons, the glossary, fixtures and where to watch stay here. We are not
          building in-app chat. Discord already does rooms; we would only make a
          worse version.
        </p>
      </div>

      <section className="mt-12">
        <h2 className="font-display text-3xl text-cream">Team channels, when it opens</h2>
        <p className="mt-4 text-base leading-7 text-cream-dim">
          All 32 teams will have their own channel. You will not find a wall of
          logos on this page: just pick your room once you are in. A few names we
          expect:
        </p>
        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Planned Discord channels">
          {exampleChannels.map((name) => (
            <li
              key={name}
              className="rounded-full border border-line bg-navy-2 px-3 py-1.5 font-mono text-sm text-gold-soft"
            >
              {name}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm leading-6 text-cream-dim">
          Plus one for every other club. If you have not chosen a team yet,
          #general will be the right place.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-3xl text-cream">How it will work</h2>
        <ol className="mt-5 list-decimal space-y-3 pl-5 text-base leading-7 text-cream-dim">
          {howItWorks.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-3xl text-cream">House rules</h2>
        <p className="mt-3 text-sm text-cream-dim">
          These will apply from day one. Five things, then we’re away.
        </p>
        <ul className="mt-5 list-disc space-y-3 pl-5 text-base leading-7 text-cream-dim">
          {houseRules.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <p className="mt-12 text-sm leading-6 text-cream-dim">
        New to the sport?{" "}
        <Link href="/learn" className="text-gold">
          Start the lessons
        </Link>{" "}
        in the meantime. If a game is on,{" "}
        <Link href="/this-week" className="text-gold">
          this week’s kick-offs
        </Link>{" "}
        are in UK time.
      </p>
    </div>
  );
}
