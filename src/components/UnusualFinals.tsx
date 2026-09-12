import Link from "next/link";
import type { NflGame } from "@/lib/espn";
import {
  isUnusualLookup,
  rarityLabel,
  scoreHistoryMeta,
  unusualFinals,
} from "@/lib/score-history";
import { scoreHistoryPath } from "@/lib/score-history-path";

export function UnusualFinals({
  games,
  compact = false,
}: {
  games: NflGame[];
  compact?: boolean;
}) {
  const rows = unusualFinals(games);
  if (rows.length === 0) return null;

  const unusual = rows.filter((row) => isUnusualLookup(row.lookup));
  const shown = unusual.length > 0 ? unusual : rows.slice(0, 3);

  return (
    <aside className="fds-spoiler rounded-2xl border border-line bg-navy-2 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
        Score history
      </p>
      <h2 className="mt-2 font-display text-xl text-cream">
        {unusual.length > 0 ? "Unusual finals this week" : "This week’s finals in our table"}
      </h2>
      <p className="mt-2 text-sm leading-6 text-cream-dim">
        {unusual.length > 0
          ? `Compared with completed regular-season and play-off games from ${scoreHistoryMeta.seasonFrom} to ${scoreHistoryMeta.seasonTo}. Rare here means rare in that snapshot, not “never in NFL history”.`
          : `No first-time or once-in-a-blue-moon finals in this slate, against our ${scoreHistoryMeta.seasonFrom}-${scoreHistoryMeta.seasonTo} table. Common scorelines still have a history if you want to look them up.`}
      </p>
      <ul className="mt-4 divide-y divide-line">
        {shown.map((row) => (
          <li key={row.game.id} className="py-3">
            <Link
              href={scoreHistoryPath(row.homeScore, row.awayScore)}
              className="block no-underline"
            >
              <p className="font-semibold text-cream">
                {row.game.away.shortName} {row.awayScore} at {row.game.home.shortName}{" "}
                {row.homeScore}
              </p>
              <p className="mt-1 text-sm text-cream-dim">
                {row.lookup.high}-{row.lookup.low} · {rarityLabel(row.lookup.count)}
                {row.lookup.count > 0 ? ` · ${row.lookup.count.toLocaleString("en-GB")} times` : ""}
              </p>
            </Link>
          </li>
        ))}
      </ul>
      {!compact ? (
        <p className="mt-4 text-sm">
          <Link href="/score-history" className="text-gold">
            Look up any final →
          </Link>
        </p>
      ) : null}
    </aside>
  );
}
