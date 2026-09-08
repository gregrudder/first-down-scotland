import type { Metadata } from "next";
import Link from "next/link";
import { TeamQuiz } from "@/components/TeamQuiz";

export const metadata: Metadata = {
  title: "Team quiz",
  description:
    "Eight beginner questions to nudge you toward an NFL team, so you can find other fans of that side.",
};

export default function TeamQuizPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
        Pick my team
      </p>
      <p className="mt-3">
        <Link href="/pick-your-team" className="text-sm text-cream-dim hover:text-gold">
          ← Pick my team
        </Link>
      </p>
      <div className="mt-6">
        <TeamQuiz />
      </div>
    </div>
  );
}
