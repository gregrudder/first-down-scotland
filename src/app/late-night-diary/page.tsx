import type { Metadata } from "next";
import Link from "next/link";
import { LateNightDiary } from "@/components/LateNightDiary";
import { LeagueTabs } from "@/components/LeagueTabs";
import { PageIntro } from "@/components/PageIntro";
import { UkKickoffHelper } from "@/components/UkKickoffHelper";
import { getNflFixturesAroundCurrent } from "@/lib/espn";
import { collectLateNightGames, fromCheckDayOnward } from "@/lib/late-night-diary";
import { absoluteUrl } from "@/lib/site";
import { formatFetchedAt, formatUkDate } from "@/lib/time";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Late Night Diary",
  description:
    "Full late NFL slate as of today for UK fans, in Europe/London time — 9pm or overnight games so you can plan a nap or a day off. Schedule subject to change.",
  alternates: {
    canonical: absoluteUrl("/late-night-diary"),
  },
};

export default async function LateNightDiaryPage() {
  const { current, slates } = await getNflFixturesAroundCurrent({
    behind: 0,
    remainder: true,
  });
  const { games: collected, error } = collectLateNightGames(slates);
  const fetchedAt = current.fetchedAt;
  const games = fromCheckDayOnward(collected, fetchedAt);
  const checkDayLabel = formatUkDate(fetchedAt);
  const weekLine = current.ok
    ? [current.seasonTypeName, current.weekLabel].filter(Boolean).join(" · ")
    : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <PageIntro eyebrow="UK kick-off planner" title="Late Night Diary">
        <p>
          For Scottish and UK fans who have a job in the morning. This is the
          late slate only: Sunday tea-time at 6pm UK stays on{" "}
          <Link href="/this-week" className="text-gold">
            This week
          </Link>
          . Here you get the 9pm-and-after window and the overnight primetime
          games, already converted to Europe/London, so you can decide whether to
          nap, finish early, or book the day off. The list is the full late slate
          as of today — All teams or your side only — and it is subject to change.
        </p>
      </PageIntro>
      <LeagueTabs active="late-nights" />

      <aside
        className="mt-8 rounded-2xl border border-gold/40 bg-navy-2 px-5 py-4"
        role="note"
      >
        <p className="text-sm font-semibold text-gold">Schedule subject to change</p>
        <p className="mt-2 text-sm leading-6 text-cream">
          NFL kick-off times, flex games and TV windows move. This is the late
          slate as listed today — use it to plan a nap or a day off, then check
          again before you book anything. The same note stays on All teams and
          Your team only.
        </p>
      </aside>

      <div className="mt-8">
        <UkKickoffHelper />
      </div>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
        <p className="text-sm text-cream-dim">
          {weekLine
            ? `${weekLine} · full late slate from ${checkDayLabel} forward`
            : `NFL late slate from ${checkDayLabel} forward`}
        </p>
        <p className="text-xs text-cream-dim">
          Refreshed {formatFetchedAt(fetchedAt)} · times in Europe/London
        </p>
      </div>

      <LateNightDiary
        games={games}
        checkDayLabel={checkDayLabel}
        feedError={!current.ok ? current.error : error?.error}
      />

      <p className="mt-10 max-w-2xl text-sm leading-6 text-cream-dim">
        Watch hints are guesses from the kick-off window and the US broadcast
        tag, not a rights guarantee. See{" "}
        <Link href="/watch" className="text-gold">
          Where to watch
        </Link>
        . If you have picked a team, we highlight their late games from the same
        browser preference as the Sunday card. For scores, use{" "}
        <Link href="/scores" className="text-gold">
          live scores
        </Link>{" "}
        — this diary will not leak them.
      </p>
    </div>
  );
}
