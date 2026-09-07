import type { Metadata } from "next";
import Link from "next/link";
import { FootballSpin } from "@/components/FootballSpin";
import { TrademarkNote } from "@/components/TeamResultCard";

export const metadata: Metadata = {
  title: "Spin the football",
  description: "Let a spinning American football pick a random NFL team.",
};

export default function TeamSpinPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
        Surprise me
      </p>
      <h1 className="mt-3 font-display text-4xl text-cream">Spin the football</h1>
      <p className="mt-3">
        <Link href="/pick-your-team" className="text-sm text-cream-dim hover:text-gold">
          ← Both options
        </Link>
      </p>
      <p className="mt-4 text-base leading-7 text-cream-dim">
        No science. The ball tumbles, a name flickers, and you live with it — or
        spin again like a coward. (Allowed.)
      </p>
      <div className="mt-10">
        <FootballSpin />
      </div>
      <div className="mt-12">
        <TrademarkNote />
      </div>
    </div>
  );
}
