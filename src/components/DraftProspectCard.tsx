import { labelForPosition } from "@/lib/draft-prospects";
import type { DraftProspect } from "@/data/draft-prospects-fallback";

export function DraftProspectCard({ prospect }: { prospect: DraftProspect }) {
  return (
    <article className="flex gap-4 rounded-2xl border border-line bg-navy-2 p-5">
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-navy-3 font-display text-lg text-gold"
        aria-label={`Rough rank ${prospect.rank}`}
      >
        {prospect.rank}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
          {labelForPosition(prospect.position)} · {prospect.college}
        </p>
        <h2 className="mt-1 font-display text-2xl text-cream">{prospect.name}</h2>
        <p className="mt-2 text-sm leading-6 text-cream-dim">{prospect.why}</p>
      </div>
    </article>
  );
}
