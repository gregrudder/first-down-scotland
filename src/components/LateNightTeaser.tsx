import Link from "next/link";
import type { NflGame } from "@/lib/espn";
import { isLateUkGame } from "@/lib/late-night-diary";
import { formatUkTime, ukWeekdayShort } from "@/lib/time";

export function LateNightTeaser({ games }: { games: NflGame[] }) {
  const late = games.filter(isLateUkGame);

  return (
    <aside className="rounded-2xl border border-gold/30 bg-navy-3 px-5 py-4">
      <p className="text-sm font-semibold text-gold">Late Night Diary</p>
      <p className="mt-2 text-sm leading-6 text-cream">
        Games that kick off at 9pm UK or later, or in the small hours — so you can
        plan a nap or a day off.
      </p>
      {late.length === 0 ? (
        <p className="mt-3 text-sm leading-6 text-cream-dim">
          Nothing late on this week’s slate. The early Sunday window stays on the
          list below.
        </p>
      ) : (
        <ul className="mt-3 divide-y divide-line">
          {late.map((game) => (
            <li key={game.id} className="flex items-center justify-between gap-3 py-2 text-sm">
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
      <p className="mt-3 text-xs leading-5 text-cream-dim">
        This week’s late ones only. The diary has the full slate from today —
        schedule subject to change.
      </p>
      <Link href="/late-night-diary" className="mt-2 inline-block text-sm font-semibold text-gold">
        Open the full Late Night Diary →
      </Link>
    </aside>
  );
}
