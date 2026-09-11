import { TeamLogo } from "@/components/TeamLogo";
import type { TeamCount } from "@/lib/fan-map/types";

export function Leaderboard({
  title,
  rows,
  empty,
}: {
  title: string;
  rows: TeamCount[];
  empty: string;
}) {
  return (
    <section className="rounded-2xl border border-line bg-navy-2 p-5">
      <h3 className="font-display text-2xl text-cream">{title}</h3>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm leading-6 text-cream-dim">{empty}</p>
      ) : (
        <ol className="mt-4 space-y-2">
          {rows.map((team, index) => (
            <li key={team.abbreviation} className="flex items-center gap-3">
              <span className="w-5 text-sm text-cream-dim">{index + 1}</span>
              <TeamLogo team={team} size={32} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-cream">{team.name}</span>
              </span>
              <span className="text-sm text-cream-dim">
                {team.count} · {team.percent}%
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
