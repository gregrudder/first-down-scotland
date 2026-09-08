import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { getDraftProspects } from "@/lib/draft-prospects";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "2027 draft prospects",
  description:
    "A short, beginner-friendly look at the top names in the 2027 NFL Draft class — ranks move, this is not a betting slip.",
};

function formatFetched(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Europe/London",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default async function DraftProspectsPage() {
  const board = await getDraftProspects();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <PageIntro eyebrow="2027 class" title="Top draft prospects">
        <p>
          Twelve names you will hear between now and April. This is a beginner board,
          not a scout’s thesis. Rankings move after every Saturday. Nobody here is
          “yours” until a club calls the name.
        </p>
      </PageIntro>

      <aside className="mt-8 rounded-2xl border border-gold/30 bg-navy-3 px-5 py-4 text-sm leading-6 text-cream">
        {board.source === "espn" ? (
          <>
            Pulled from {board.sourceLabel}. We cache it for ten minutes and the daily
            Cron refreshes the tag.
          </>
        ) : (
          <>
            ESPN’s official 2027 athlete list is still empty — the Draft is months
            away — so this is an early consensus from {board.sourceLabel}. When ESPN
            publishes names, this page will switch over on its own.
          </>
        )}{" "}
        {board.sourceHref ? (
          <a href={board.sourceHref} target="_blank" rel="noreferrer" className="text-gold">
            Source →
          </a>
        ) : null}
        <span className="mt-2 block text-cream-dim">
          Checked {formatFetched(board.fetchedAt)} UK time.
        </span>
      </aside>

      <ol className="mt-8 space-y-4">
        {board.prospects.map((prospect) => (
          <li
            key={prospect.id}
            className="rounded-2xl border border-line bg-navy-2 p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                #{prospect.rank} · {prospect.position} · {prospect.college}
              </p>
            </div>
            <h2 className="mt-2 font-display text-2xl text-cream">{prospect.name}</h2>
            <p className="mt-2 text-sm leading-6 text-cream-dim">{prospect.why}</p>
          </li>
        ))}
      </ol>

      <p className="mt-10 text-sm leading-6 text-cream-dim">
        New to what any of this means?{" "}
        <Link href="/learn/the-draft" className="text-gold">
          The Draft lesson
        </Link>{" "}
        covers rounds, pick order, trades and UDFAs. Then come back here.
      </p>
    </div>
  );
}
