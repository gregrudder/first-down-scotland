import type { Metadata } from "next";
import Link from "next/link";
import { KickoffGameCard } from "@/components/KickoffGameCard";
import { PageIntro } from "@/components/PageIntro";
import { kickoffIntroParagraphs } from "@/data/kickoff-planner-copy";
import { discordInviteUrl } from "@/lib/discord";
import { absoluteUrl } from "@/lib/site";
import { teamProfilePath } from "@/data/teams";
import {
  VIEWING_WINDOWS,
  findTeam,
  formatKickoffUk,
  gamesForWeek,
  kickoffScheduleSource,
  londonParts,
  seasonRows,
  teamChoices,
  weekForInstant,
  type KickoffGame,
} from "@/lib/uk-kickoff";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "UK kick-off planner",
  description:
    "Every 2026 NFL regular-season kick-off in UK time. Pick any of the 32 teams, or see this week’s full slate, tagged as afternoon, tea-time, evening, late night or overnight.",
  alternates: {
    canonical: absoluteUrl("/kick-off-planner"),
  },
};

function groupByLondonDate(games: KickoffGame[]) {
  const groups: { dateKey: string; label: string; games: KickoffGame[] }[] = [];
  for (const game of games) {
    const parts = londonParts(new Date(game.kickoffUtc));
    const label = formatKickoffUk(game.kickoffUtc).split(" · ")[0] ?? parts.dateKey;
    const last = groups[groups.length - 1];
    if (!last || last.dateKey !== parts.dateKey) {
      groups.push({ dateKey: parts.dateKey, label, games: [game] });
    } else {
      last.games.push(game);
    }
  }
  return groups;
}

export default async function KickoffPlannerPage({
  searchParams,
}: {
  searchParams: Promise<{ team?: string }>;
}) {
  const { team: teamQuery } = await searchParams;
  const team = findTeam(teamQuery);
  const invite = discordInviteUrl();
  const week = weekForInstant(new Date());
  const weekGames = gamesForWeek(week);
  const groups = groupByLondonDate(weekGames);
  const rows = team ? seasonRows(team.abbreviation) : [];
  const choices = teamChoices();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <PageIntro eyebrow="Follow the NFL from Scotland" title="UK kick-off planner">
        {kickoffIntroParagraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </PageIntro>

      <div className="mt-8 rounded-2xl border border-gold/30 bg-navy-2 p-5">
        <p className="text-xs font-semibold tracking-[0.16em] text-gold uppercase">Discord</p>
        <p className="mt-2 font-display text-2xl text-cream">Watch the awkward ones together</p>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-cream-dim">
          Tea-time can be a solo watch. The overnight games are easier with the{" "}
          <Link href="/pickem" className="text-gold">
            weekly Pick&apos;em
          </Link>{" "}
          and the team channel. The invite is the same one used across the site.
        </p>
        <a
          href={invite}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex min-h-12 items-center justify-center rounded-full bg-gold px-6 py-3 text-sm font-semibold text-gold-ink hover:bg-gold-soft"
        >
          Join the Discord
        </a>
      </div>

      <section className="mt-12" aria-labelledby="window-legend">
        <h2 id="window-legend" className="font-display text-3xl text-cream">
          Viewing windows
        </h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {Object.values(VIEWING_WINDOWS).map((window) => (
            <li
              key={window.label}
              className="rounded-xl border border-line bg-navy-2 px-3 py-2 text-sm leading-6 text-cream"
            >
              <span className="font-semibold">{window.label}</span>
              <span className="text-cream-dim"> · {window.hint}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12" aria-labelledby="this-week-heading">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="this-week-heading" className="font-display text-3xl text-cream">
            This week’s games in UK time
          </h2>
          <a
            href={`/kick-off-planner/calendar?week=${week}`}
            className="text-sm font-semibold text-gold hover:text-gold-soft"
          >
            Add Week {week} to your calendar
          </a>
        </div>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-cream-dim">
          Week {week}, all 32 clubs. Times are Europe/London.{" "}
          <Link href="/this-week" className="text-gold">
            This week
          </Link>{" "}
          has the live card, and the{" "}
          <Link href="/late-night-diary" className="text-gold">
            Late Night Diary
          </Link>{" "}
          is the 9pm-and-after list.
        </p>
        {groups.map((group) => (
          <div key={group.dateKey} className="mt-8">
            <h3 className="font-display text-2xl text-cream">{group.label}</h3>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {group.games.map((game) => (
                <KickoffGameCard key={game.id} game={game} weekLabel={false} />
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="mt-14" aria-labelledby="team-schedule-heading">
        <h2 id="team-schedule-heading" className="font-display text-3xl text-cream">
          One team’s season
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-cream-dim">
          Pick any of the 32 clubs for the full 2026 regular season, including the bye.
          Home, away, or a neutral site, plus the venue. International Series games are flagged.
        </p>
        <form method="get" action="/kick-off-planner" className="mt-5 max-w-md">
          <label htmlFor="kickoff-team" className="text-sm font-semibold text-cream">
            Team
          </label>
          <select
            id="kickoff-team"
            name="team"
            defaultValue={team?.abbreviation ?? ""}
            className="mt-2 w-full rounded-xl border border-line bg-navy-2 px-3 py-3 text-base text-cream"
            style={{ colorScheme: "dark" }}
          >
            <option value="">Choose a team</option>
            {choices.map((choice) => (
              <option key={choice.abbreviation} value={choice.abbreviation}>
                {choice.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="mt-3 inline-flex min-h-12 items-center justify-center rounded-full bg-gold px-6 py-3 text-sm font-semibold text-gold-ink hover:bg-gold-soft"
          >
            Show the season
          </button>
        </form>

        {team ? (
          <div className="mt-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h3 className="font-display text-2xl text-cream">{team.name} in UK time</h3>
              <a
                href={`/kick-off-planner/calendar?team=${team.abbreviation}`}
                className="text-sm font-semibold text-gold hover:text-gold-soft"
              >
                Download the season (.ics)
              </a>
            </div>
            <p className="mt-2 text-sm text-cream-dim">
              <Link href={teamProfilePath(team.abbreviation)} className="text-gold">
                {team.shortName} club page
              </Link>
            </p>
            <ol className="mt-4 grid list-none gap-4 lg:grid-cols-2">
              {rows.map((row) =>
                row.kind === "bye" ? (
                  <li
                    key={`bye-${row.week}`}
                    className="rounded-2xl border border-dashed border-line px-4 py-4 text-sm text-cream-dim"
                  >
                    Week {row.week} · Bye
                  </li>
                ) : (
                  <li key={row.game.id}>
                    <KickoffGameCard game={row.game} teamAbbr={team.abbreviation} />
                  </li>
                ),
              )}
            </ol>
          </div>
        ) : (
          <p className="mt-6 max-w-2xl text-sm leading-6 text-cream-dim">
            Choose a club to see all 17 games and the bye week. Each game can be saved on its own,
            or the whole season can be downloaded once a team is selected.
          </p>
        )}
      </section>

      <p className="mt-12 max-w-3xl text-sm leading-6 text-cream-dim">
        Times are the US Eastern kick-offs in the public{" "}
        <a href={kickoffScheduleSource.sourceRepo} className="text-gold">
          nflverse schedule file
        </a>{" "}
        ({kickoffScheduleSource.sourceName}), stored in this repo and converted to Europe/London.
        Week 4 was checked against ESPN’s scoreboard: Colts vs Commanders at Tottenham, 14:30 BST
        on Sunday 4 October; Steelers @ Browns, 01:15 BST on Friday 2 October; Lions @ Panthers,
        01:20 BST on Monday 5 October; Falcons @ Saints, 01:15 BST on Tuesday 6 October. When the
        NFL flexes a game, refresh the file with{" "}
        <code className="text-cream">node scripts/build-kickoff-schedule.mjs</code>. The snapshot
        was generated {kickoffScheduleSource.generatedAt.slice(0, 10)}.
      </p>
    </div>
  );
}
