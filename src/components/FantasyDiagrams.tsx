const slots = [
  { id: "QB", label: "Quarterback", hint: "Usually one" },
  { id: "RB", label: "Running back", hint: "Often two" },
  { id: "WR", label: "Wide receiver", hint: "Often two or three" },
  { id: "TE", label: "Tight end", hint: "Usually one" },
  { id: "FLEX", label: "Flex", hint: "Extra RB, WR or TE" },
  { id: "K", label: "Kicker", hint: "Some leagues skip this" },
  { id: "DEF", label: "Team defence", hint: "A whole NFL club, not one player" },
] as const;

const snakeRounds = [
  { round: "Round 1", picks: ["You", "Mo", "Sam", "Ali"] },
  { round: "Round 2", picks: ["Ali", "Sam", "Mo", "You"] },
];

export function FantasyLineup() {
  return (
    <figure className="rounded-2xl border border-line bg-navy-2 p-4 sm:p-5">
      <figcaption className="text-sm font-semibold text-cream">
        A typical starting lineup
      </figcaption>
      <p className="mt-1 text-sm leading-6 text-cream-dim">
        Your league’s app will spell this out. Counts vary. Bench spots sit under
        these, for players you rotate in.
      </p>
      <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {slots.map((slot) => (
          <li
            key={slot.id}
            className="rounded-xl border border-gold/35 bg-navy-3 px-3 py-3"
          >
            <p className="font-mono text-xs font-semibold tracking-wide text-gold">{slot.id}</p>
            <p className="mt-1 text-sm font-semibold text-cream">{slot.label}</p>
            <p className="mt-0.5 text-xs leading-5 text-cream-dim">{slot.hint}</p>
          </li>
        ))}
      </ul>
    </figure>
  );
}

export function SnakeDraft() {
  return (
    <figure className="rounded-2xl border border-line bg-navy-2 p-4 sm:p-5">
      <figcaption className="text-sm font-semibold text-cream">A snake draft</figcaption>
      <p className="mt-1 text-sm leading-6 text-cream-dim">
        Four managers, two rounds. Round 1 runs left to right. Round 2 snakes back
        the other way, so last pick in round 1 goes first in round 2. Real drafts
        keep snaking until every roster is full.
      </p>
      <div className="mt-4 space-y-3">
        {snakeRounds.map((row) => (
          <div key={row.round}>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
              {row.round}
            </p>
            <ol className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {row.picks.map((name, index) => (
                <li
                  key={`${row.round}-${name}`}
                  className="rounded-xl border border-line bg-navy-3 px-3 py-2 text-sm text-cream"
                >
                  <span className="font-mono text-xs text-gold">{index + 1}.</span> {name}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </figure>
  );
}
