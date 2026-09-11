import Link from "next/link";
import type { FixturesResult } from "@/lib/espn";
import { formatUkTime, ukWeekdayShort } from "@/lib/time";

export function GamesTeaser({ fixtures }: { fixtures: FixturesResult }) {
  if (!fixtures.ok) {
    return (
      <aside className="rounded-2xl border border-line bg-navy-2 p-5">
        <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">This week</h2>
        <p className="mt-3 text-sm leading-6 text-cream-dim">{fixtures.error}</p>
        <Link href="/this-week" className="mt-4 inline-block text-sm text-gold">
          Open this week →
        </Link>
      </aside>
    );
  }

  const preview = fixtures.games.slice(0, 4);

  return (
    <aside className="rounded-2xl border border-line bg-navy-2 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
            Games this week
          </h2>
          <p className="mt-1 text-sm text-cream-dim">
            {fixtures.seasonTypeName} {fixtures.weekLabel} · UK times
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1 text-sm">
          <Link href="/this-week" className="text-gold">
            Full slate →
          </Link>
          <Link href="/late-night-diary" className="text-gold">
            Late nights →
          </Link>
          <Link href="/scores" className="text-gold">
            Live scores →
          </Link>
          <Link href="/score-history" className="text-gold">
            Score history →
          </Link>
        </div>
      </div>

      {preview.length === 0 ? (
        <p className="mt-4 text-sm leading-6 text-cream-dim">
          No games are listed on the live feed just now: the week may be between slates.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-line">
          {preview.map((game) => (
            <li key={game.id} className="flex items-center justify-between gap-3 py-3 text-sm">
              <span className="font-medium text-cream">
                {game.away.abbreviation} @ {game.home.abbreviation}
              </span>
              <span className="text-cream-dim">
                {ukWeekdayShort(game.kickoffUtc)} {formatUkTime(game.kickoffUtc)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
