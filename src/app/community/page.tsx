import type { Metadata } from "next";
import Link from "next/link";
import { DiscordCta } from "@/components/DiscordCta";
import { PageIntro } from "@/components/PageIntro";

export const metadata: Metadata = {
  title: "Community",
  description:
    "Discord is the chat home for First Down Scotland: meet Scottish and UK fans of the NFL team you support, then arrange pub meetups at the spots we list.",
};

const howItWorks = [
  "When the invite is up, join the server, say hello in #general, and pick the channel for the team you support. Lurk until you have a side if you need to.",
  "Use that team room to find other UK fans of the same club, and to arrange who is going to a pub from Watch near you.",
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
      <PageIntro eyebrow="Meet your team" title="Community">
        <p>
          This is the chat home. The First Down Scotland Discord is where Scottish and UK fans of the same NFL team can actually talk, instead of hoping a Facebook group still exists. Pair it with the pub list when you want to meet in person and watch the games together with like-minded fans.
        </p>
      </PageIntro>

      <div className="mt-8">
        <DiscordCta />
      </div>

      <div className="mt-12 space-y-6 text-base leading-7 text-cream-dim">
        <p>
          One First Down Scotland server is planned: general chat for beginners,
          an NFL room for the week’s games, and a channel per team so you hang
          with fans of your side. That is the shape of it. The invite itself is
          not live yet. We would rather say coming soon than send you to a dead
          door.
        </p>
        <p>
          We are not building in-app chat. Discord already does rooms; we would
          only make a worse version. Fixtures, news and where to watch stay
          here as helpers.
        </p>
      </div>

      <section className="mt-12 rounded-2xl border border-line bg-navy-2 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
          Same team, same pub
        </p>
        <h2 className="mt-2 font-display text-2xl text-cream">Meet in the real world</h2>
        <p className="mt-3 text-base leading-7 text-cream-dim">
          The Discord is for chat. The pub list is for turning up. Find a
          Scottish spot that shows the NFL, then (when the invite is live) use
          your team channel to see who else is going. You do not have to watch
          on your own.
        </p>
        <p className="mt-4 text-sm">
          <Link href="/watch-near-you" className="font-semibold text-gold">
            Pubs near you →
          </Link>
          <span className="text-cream-dim"> · </span>
          <Link href="/pick-your-team" className="text-gold">
            Pick my team →
          </Link>
        </p>
      </section>

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
          #general will be the right place, and{" "}
          <Link href="/pick-your-team" className="text-gold">
            Pick my team
          </Link>{" "}
          will give you a side to walk in with.
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
        </Link>
        . Kick-offs in UK time are a helper on{" "}
        <Link href="/this-week" className="text-gold">
          this week’s games
        </Link>
        .
      </p>
    </div>
  );
}
