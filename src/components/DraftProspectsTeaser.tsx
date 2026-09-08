import Link from "next/link";
import type { DraftProspectsResult } from "@/lib/draft-prospects";
import { labelForPosition } from "@/lib/draft-prospects";

export function DraftProspectsTeaser({
  board,
  compact = false,
}: {
  board: DraftProspectsResult;
  compact?: boolean;
}) {
  const preview = board.prospects.slice(0, 4);

  return (
    <aside
      className={
        compact
          ? "rounded-2xl border border-line bg-navy-2 p-5"
          : "rounded-2xl border border-gold/30 bg-navy-2 p-5 sm:p-6"
      }
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
            2027 class
          </p>
          <h2 className="mt-2 font-display text-xl text-cream">Top draft prospects</h2>
        </div>
        <Link href="/learn/draft-prospects" className="shrink-0 text-sm font-semibold text-gold">
          Full board →
        </Link>
      </div>
      <p className="mt-2 text-sm leading-6 text-cream-dim">
        Names you will hear between now and April. Rough rank only — boards move
        after every Saturday.
      </p>
      <ol className="mt-4 divide-y divide-line">
        {preview.map((prospect) => (
          <li key={prospect.id} className="flex items-baseline justify-between gap-3 py-2.5 text-sm">
            <span className="min-w-0 font-medium text-cream">
              <span className="text-gold">#{prospect.rank}</span> {prospect.name}
            </span>
            <span className="shrink-0 text-cream-dim">
              {labelForPosition(prospect.position)}
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-sm">
        <Link href="/learn/the-draft" className="text-gold">
          What the Draft is →
        </Link>
      </p>
    </aside>
  );
}
