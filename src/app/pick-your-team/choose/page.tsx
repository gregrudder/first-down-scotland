import type { Metadata } from "next";
import Link from "next/link";
import { TeamPicker } from "@/components/TeamPicker";
import { TrademarkNote } from "@/components/TeamResultCard";

export const metadata: Metadata = {
  title: "Pick from the 32",
  description:
    "Already support an NFL team? Browse or search all 32 and tap the club you follow.",
};

export default function ChooseTeamPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
        I already have a team
      </p>
      <h1 className="mt-3 font-display text-4xl text-cream">Pick from the 32</h1>
      <p className="mt-3">
        <Link href="/pick-your-team" className="text-sm text-cream-dim hover:text-gold">
          ← Pick my team
        </Link>
      </p>
      <p className="mt-4 text-base leading-7 text-cream-dim">
        Search or scroll, then tap the club you actually support. Same save as the
        quiz and the spinning ball: colours, Sunday card, and the rest of the site
        follow that pick. Change it whenever you like.
      </p>
      <div className="mt-8">
        <TeamPicker />
      </div>
      <div className="mt-12">
        <TrademarkNote />
      </div>
    </div>
  );
}
