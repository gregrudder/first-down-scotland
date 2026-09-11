import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { HubSavedTeam } from "@/components/TeamMark";
import { TrademarkNote } from "@/components/TeamResultCard";

export const metadata: Metadata = {
  title: "Pick my team",
  description:
    "Pick an NFL team so you can find other Scottish and UK fans of that side: choose from the 32, take a short quiz, or spin the ball.",
};

export default function PickYourTeamPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <PageIntro eyebrow="Find your lot" title="Pick my team">
        <p>
          You do not need a childhood in Ohio. You need a side so you can find
          other Scottish and UK fans of that club: on Discord, and
          in the pubs we list. If you already support a team, pick it from the 32.
          Or take a short quiz, or spin the ball. Saved on this device only. Pick
          again whenever you like.
        </p>
      </PageIntro>

      <HubSavedTeam />

      <Link
        href="/pick-your-team/choose"
        className="mt-10 block rounded-2xl border border-gold/40 bg-navy-2 p-6 transition hover:border-gold/60 hover:bg-navy-3"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
          I already have a team
        </p>
        <h2 className="mt-2 font-display text-2xl text-cream">Pick from the 32</h2>
        <p className="mt-3 text-sm leading-6 text-cream-dim">
          Browse or search every club. Tap the one you support. Colours and your
          Sunday card follow.
        </p>
        <p className="mt-4 text-sm font-semibold text-gold">Choose a club →</p>
      </Link>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Link
          href="/pick-your-team/quiz"
          className="rounded-2xl border border-line bg-navy-2 p-6 transition hover:border-gold/50 hover:bg-navy-3"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">Quiz</p>
          <h2 className="mt-2 font-display text-2xl text-cream">Answer eight questions</h2>
          <p className="mt-3 text-sm leading-6 text-cream-dim">
            Colours, kick-off times, underdogs, weather. We narrow it toward one of
            the 32, plus a couple of near-misses.
          </p>
          <p className="mt-4 text-sm font-semibold text-gold">Start the quiz →</p>
        </Link>
        <Link
          href="/pick-your-team/spin"
          className="rounded-2xl border border-line bg-navy-2 p-6 transition hover:border-gold/50 hover:bg-navy-3"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
            Surprise me
          </p>
          <h2 className="mt-2 font-display text-2xl text-cream">Spin the football</h2>
          <p className="mt-3 text-sm leading-6 text-cream-dim">
            A tumbling American football, then a random club. No personality test.
            Pure chaos.
          </p>
          <p className="mt-4 text-sm font-semibold text-gold">Spin the ball →</p>
        </Link>
      </div>

      <Link
        href="/score-history"
        className="mt-4 block rounded-2xl border border-line bg-navy-2 p-6 transition hover:border-gold/50 hover:bg-navy-3"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
          Fun
        </p>
        <h2 className="mt-2 font-display text-2xl text-cream">Has this score happened before?</h2>
        <p className="mt-3 text-sm leading-6 text-cream-dim">
          A small scoreography toy next to the quiz and the spin: type a final
          and see how often that scoreline appears in our table.
        </p>
        <p className="mt-4 text-sm font-semibold text-gold">Look up a final →</p>
      </Link>

      <p className="mt-10 text-sm leading-6 text-cream-dim">
        Already learning?{" "}
        <Link href="/learn" className="text-gold">
          Stay on the path
        </Link>
        . Once you have a side,{" "}
        <Link href="/community" className="text-gold">
          Community
        </Link>
        , the{" "}
        <Link href="/fan-map" className="text-gold">
          fan map
        </Link>
        , and{" "}
        <Link href="/watch-near-you" className="text-gold">
          pubs near you
        </Link>{" "}
        are how you meet people who picked the same club.
      </p>
      <div className="mt-8">
        <TrademarkNote />
      </div>
    </div>
  );
}
