import type { TouchdownScorer } from "@/lib/espn";

function lineBits(td: TouchdownScorer): { prefix: string; rest: string } {
  const yards = typeof td.yards === "number" ? ` ${td.yards} yd` : "";
  const quarter = td.quarter ? ` · ${td.quarter}` : "";
  return {
    prefix: `${td.teamAbbreviation} TD`,
    rest: `: ${td.playerName}${yards}${quarter}`,
  };
}

export function TouchdownScorers({
  touchdowns,
}: {
  touchdowns?: TouchdownScorer[];
}) {
  if (!touchdowns?.length) return null;

  return (
    <ul className="mt-3 space-y-0.5" aria-label="Touchdown scorers">
      {touchdowns.map((td) => {
        const { prefix, rest } = lineBits(td);
        return (
          <li key={td.id} className="text-xs leading-5 text-cream-dim">
            <span className="font-semibold text-cream">{prefix}</span>
            {rest}
          </li>
        );
      })}
    </ul>
  );
}
