import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { discordInviteUrl } from "@/lib/discord";
import {
  entriesCloseAt,
  leaders,
  loadPickem,
  pickemMatchup,
  rankByScore,
  seasonSummary,
  type PickemWeek,
} from "@/lib/pickem";
import { absoluteUrl } from "@/lib/site";
import { VIEWING_WINDOWS, formatKickoffUk, venueLabel } from "@/lib/uk-kickoff";

export const metadata: Metadata = {
  title: "Weekly Pick'em",
  description:
    "The First Down Scotland Discord Pick'em: this week’s board in UK time, the season leaderboard after Weeks 1 and 3, and the Week 3 results. Enter free in #weekly-pickem.",
  alternates: {
    canonical: absoluteUrl("/pickem"),
  },
};

function EnterButton({ invite, channel }: { invite: string; channel: string }) {
  return (
    <a
      href={invite}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-14 w-full items-center justify-center rounded-full bg-gold px-8 py-4 text-base font-semibold text-gold-ink hover:bg-gold-soft sm:w-auto"
    >
      Enter in the Discord
      <span className="sr-only">, {channel}</span>
    </a>
  );
}

function ResultWriteUp({ week }: { week: PickemWeek }) {
  const ranked = rankByScore(week.scores, (row) => row.correct);
  const top = leaders(ranked, (row) => row.correct);
  const topNames = top.map((row) => row.name).join(" and ");
  const correct = top[0]?.correct ?? 0;
  const games = week.gamesCounted ?? 0;

  return (
    <article className="rounded-2xl border border-line bg-navy-2 p-5">
      <h3 className="font-display text-2xl text-cream">Week {week.week}</h3>
      <p className="mt-3 text-base leading-7 text-cream-dim">
        {topNames} led Week {week.week} with {correct} correct from {games}. {ranked.length}{" "}
        {ranked.length === 1 ? "person entered" : "people entered"}.
      </p>
      {week.caughtFolkOut ? (
        <p className="mt-3 text-base leading-7 text-cream">
          The pick that caught folk out: {week.caughtFolkOut}
        </p>
      ) : null}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[18rem] text-left text-sm">
          <caption className="sr-only">Week {week.week} Pick&apos;em results</caption>
          <thead>
            <tr className="border-b border-line text-xs tracking-[0.14em] text-gold uppercase">
              <th scope="col" className="py-2 pr-3 font-semibold">
                Place
              </th>
              <th scope="col" className="py-2 pr-3 font-semibold">
                Name
              </th>
              <th scope="col" className="py-2 text-right font-semibold">
                Correct
              </th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((row) => (
              <tr key={row.name} className="border-b border-line/70">
                <td className="py-2 pr-3 text-cream-dim">{row.rank}</td>
                <th scope="row" className="py-2 pr-3 font-medium text-cream">
                  {row.name}
                </th>
                <td className="py-2 text-right text-cream">
                  {row.correct}/{games}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}

export default function PickemPage() {
  const pickem = loadPickem();
  const invite = discordInviteUrl();
  const close = entriesCloseAt(pickem.board);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <PageIntro eyebrow="Discord Pick'em" title="Weekly Pick'em">
        <p>
          The First Down Scotland Discord runs a free weekly Pick&apos;em in {pickem.channel}. It
          is a straight winner-picker: one point for a correct pick, nothing for a miss, and no
          spread.
        </p>
        <p>
          {pickem.counts} A missed week scores {pickem.missedWeekPoints}. Season points are the
          weeks added together. Entries close at the first kick-off that counts.
        </p>
        <p>
          Picks are made in the Discord. This page is the board, the season table, and the
          write-ups. It is not an entry form.
        </p>
      </PageIntro>

      <div className="mt-8 rounded-2xl border border-gold/40 bg-navy-2 p-5 sm:p-6">
        <p className="text-xs font-semibold tracking-[0.16em] text-gold uppercase">
          {pickem.channel}
        </p>
        <p className="mt-2 font-display text-3xl text-cream">Enter this week in the Discord</p>
        <p className="mt-2 text-sm leading-6 text-cream-dim">
          Same invite as the rest of the site. Say hello, then post the card in {pickem.channel}.
        </p>
        <div className="mt-5">
          <EnterButton invite={invite} channel={pickem.channel} />
        </div>
      </div>

      <section className="mt-12" aria-labelledby="board-heading">
        <h2 id="board-heading" className="font-display text-3xl text-cream">
          Week {pickem.board.week} board
        </h2>
        <p className="mt-3 text-base leading-7 text-cream-dim">
          {pickem.board.countingGames.length} games.{" "}
          {close ? (
            <>
              Entries close at{" "}
              <time dateTime={close.kickoffUtc}>{formatKickoffUk(close.kickoffUtc)}</time>, the{" "}
              {pickemMatchup(close)} kick-off.
            </>
          ) : null}{" "}
          Times are Europe/London. The full slate, including games that do not count, is on the{" "}
          <Link href="/kick-off-planner" className="text-gold">
            UK kick-off planner
          </Link>
          .
        </p>
        <ol className="mt-6 space-y-3">
          {pickem.board.countingGames.map((game, index) => (
            <li key={game.id} className="rounded-2xl border border-line bg-navy-2 p-4">
              <p className="text-xs font-semibold tracking-[0.14em] text-gold uppercase">
                Game {index + 1} · {VIEWING_WINDOWS[game.windowId].label}
              </p>
              <h3 className="mt-1 font-display text-2xl text-cream">{pickemMatchup(game)}</h3>
              <p className="mt-1 text-sm leading-6 text-cream-dim">
                <time dateTime={game.kickoffUtc}>{formatKickoffUk(game.kickoffUtc)}</time>
                {" · "}
                {venueLabel(game)}
                {game.international ? " · International Series" : ""}
              </p>
            </li>
          ))}
        </ol>
        {pickem.board.excludedGames.length > 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-line px-4 py-3 text-sm leading-6 text-cream-dim">
            <p className="font-semibold text-cream">Not on this board</p>
            <p className="mt-1">Thursday and other overnight openers do not count.</p>
            <ul className="mt-2 space-y-1">
              {pickem.board.excludedGames.map((game) => (
                <li key={game.id}>
                  {pickemMatchup(game)},{" "}
                  <time dateTime={game.kickoffUtc}>{formatKickoffUk(game.kickoffUtc)}</time>.
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      <section className="mt-12" aria-labelledby="leaderboard-heading">
        <h2 id="leaderboard-heading" className="font-display text-3xl text-cream">
          Season leaderboard
        </h2>
        <p className="mt-3 text-base leading-7 text-cream-dim">{seasonSummary(pickem)}</p>
        <p className="mt-2 text-sm leading-6 text-cream-dim">
          Sorted by points, then by name. Tied scores share a place.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[18rem] text-left text-sm">
            <caption className="sr-only">Season Pick&apos;em leaderboard</caption>
            <thead>
              <tr className="border-b border-line text-xs tracking-[0.14em] text-gold uppercase">
                <th scope="col" className="py-2 pr-3 font-semibold">
                  Place
                </th>
                <th scope="col" className="py-2 pr-3 font-semibold">
                  Name
                </th>
                <th scope="col" className="py-2 text-right font-semibold">
                  Points
                </th>
              </tr>
            </thead>
            <tbody>
              {pickem.standings.map((row) => (
                <tr key={row.name} className="border-b border-line/70">
                  <td className="py-2 pr-3 text-cream-dim">{row.rank}</td>
                  <th scope="row" className="py-2 pr-3 font-medium text-cream">
                    {row.name}
                  </th>
                  <td className="py-2 text-right text-cream">{row.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-12" aria-labelledby="results-heading">
        <h2 id="results-heading" className="font-display text-3xl text-cream">
          Results
        </h2>
        <p className="mt-3 text-base leading-7 text-cream-dim">
          A write-up is shown only when that week’s table has been published.
        </p>
        <div className="mt-6 space-y-4">
          {pickem.results.map((week) => (
            <ResultWriteUp key={week.week} week={week} />
          ))}
        </div>
      </section>

      <div className="mt-10">
        <EnterButton invite={invite} channel={pickem.channel} />
      </div>
    </div>
  );
}
