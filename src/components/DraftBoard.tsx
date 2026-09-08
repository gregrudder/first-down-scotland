export function DraftBoard() {
  return (
    <figure className="overflow-hidden rounded-2xl border border-line bg-navy">
      <div className="grid gap-3 p-4 sm:grid-cols-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">
            Round 1, pick 1
          </p>
          <p className="mt-2 font-display text-2xl text-cream">Worst record</p>
          <p className="mt-2 text-sm leading-6 text-cream-dim">
            The club that won the fewest games last season usually picks first. That is
            the consolation prize for a rough year: a shot at the best available player.
          </p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">
            Round 1, pick 32
          </p>
          <p className="mt-2 font-display text-2xl text-cream">Super Bowl winners</p>
          <p className="mt-2 text-sm leading-6 text-cream-dim">
            The champions pick last in each round. Everyone else slots in by last
            season’s record, then by a few tie-breakers you do not need to memorise.
          </p>
        </div>
      </div>
      <div className="border-t border-line px-4 py-4">
        <div className="flex h-3 overflow-hidden rounded-full">
          <div className="w-[8%] bg-gold" />
          <div className="w-[24%] bg-gold-soft/80" />
          <div className="w-[36%] bg-navy-3" />
          <div className="w-[32%] bg-navy-2" />
        </div>
        <div className="mt-2 flex justify-between text-[11px] uppercase tracking-[0.12em] text-cream-dim">
          <span>Pick 1</span>
          <span>Pick 32</span>
        </div>
      </div>
      <figcaption className="border-t border-line px-4 py-3 text-sm leading-6 text-cream-dim">
        Seven rounds. Thirty-two clubs. The order mostly repeats each round, then extra
        “compensatory” picks get tacked on later. Teams can swap any of those slots.
      </figcaption>
    </figure>
  );
}
