"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { TeamLogo } from "@/components/TeamLogo";
import type { FixturesResult, NflGame } from "@/lib/espn";
import { getTeamProfileByAbbr } from "@/data/team-profiles";
import {
  SUNDAY_CARD_IS_FREE,
  buildSundayExplainer,
  byeWeekExplainer,
  findTeamGame,
  type SundayExplainer,
} from "@/lib/sunday-card";
import { formatUkDateTime } from "@/lib/time";
import { savedTeamRecord } from "@/lib/team-storage";

type DepthNote = {
  qb: string;
  nextUp: string | null;
};

function useSavedTeam() {
  const [record, setRecord] = useState<ReturnType<typeof savedTeamRecord>>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setRecord(savedTeamRecord());
    sync();
    setReady(true);
    window.addEventListener("storage", sync);
    window.addEventListener("fds-team-change", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("fds-team-change", sync);
    };
  }, []);

  return { record, ready };
}

function DepthLine({ abbreviation }: { abbreviation: string }) {
  const [note, setNote] = useState<DepthNote | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setNote(null);
    setFailed(false);

    fetch(`/api/depth-note?team=${encodeURIComponent(abbreviation)}`)
      .then((response) => response.json())
      .then((payload: { ok?: boolean; qb?: string; nextUp?: string | null }) => {
        if (cancelled) return;
        if (payload?.ok && payload.qb) {
          setNote({ qb: payload.qb, nextUp: payload.nextUp ?? null });
        } else {
          setFailed(true);
        }
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [abbreviation]);

  if (failed) return null;
  if (!note) {
    return <p className="text-sm leading-6 text-cream-dim">Checking ESPN’s public depth chart…</p>;
  }

  return (
    <p className="text-sm leading-6 text-cream-dim">
      ESPN lists <span className="font-medium text-cream">{note.qb}</span> as the starting
      quarterback
      {note.nextUp ? ` (${note.nextUp} next on the chart)` : ""}. Snapshot only: injuries
      and selection move it.
    </p>
  );
}

function ExplainerBlock({
  explainer,
  compact,
}: {
  explainer: SundayExplainer;
  compact?: boolean;
}) {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
          What to watch for
        </p>
        <p className="mt-1 text-sm leading-6 text-cream">{explainer.watchFor}</p>
      </div>
      {!compact ? (
        <>
          <p className="text-sm leading-6 text-cream-dim">{explainer.watchHint}</p>
          <p className="text-sm leading-6 text-cream-dim">{explainer.pubHint}</p>
          <p className="text-sm leading-6">
            <Link href="/community" className="text-gold hover:text-gold-soft">
              Meet your team
            </Link>
            <span className="text-cream-dim"> · </span>
            <Link href="/watch-near-you" className="text-gold hover:text-gold-soft">
              Pubs near you
            </Link>
            <span className="text-cream-dim"> · </span>
            <Link href="/watch" className="text-gold hover:text-gold-soft">
              Where to watch
            </Link>
          </p>
        </>
      ) : null}
      <p className="text-sm leading-6 text-cream-dim">
        <span className="font-semibold text-cream">Learn it: </span>
        <Link href={explainer.learn.href} className="text-gold hover:text-gold-soft">
          {explainer.learn.label} →
        </Link>
        <span> {explainer.learn.why}</span>
      </p>
    </div>
  );
}

export function SundayCard({
  fixtures,
  compact = false,
}: {
  fixtures: FixturesResult;
  compact?: boolean;
}) {
  const { record, ready } = useSavedTeam();
  const games: NflGame[] = fixtures.ok ? fixtures.games : [];
  const weekLabel = fixtures.ok
    ? [fixtures.seasonTypeName, fixtures.weekLabel].filter(Boolean).join(" · ")
    : "This week";

  const match = useMemo(
    () => (record ? findTeamGame(games, record.team.abbreviation) : null),
    [games, record],
  );

  const explainer = useMemo(() => {
    if (!record) return null;
    const weekNumber = fixtures.ok ? fixtures.weekNumber : null;
    if (!match) return byeWeekExplainer(record.team, weekNumber);
    return buildSundayExplainer(record.team, match, weekNumber);
  }, [fixtures, match, record]);

  if (!ready) {
    return (
      <section
        id="your-sunday"
        className="scroll-mt-24 rounded-2xl border border-line bg-navy-2 p-5 sm:p-6"
      >
        <p className="text-sm text-cream-dim">Loading your Sunday…</p>
      </section>
    );
  }

  if (!record) {
    return (
      <section
        id="your-sunday"
        className="scroll-mt-24 rounded-2xl border border-gold/35 bg-navy-2 p-5 sm:p-6"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
          Your Sunday
        </p>
        <h2 className="mt-2 font-display text-2xl text-cream sm:text-3xl">
          Pick a team, find your lot
        </h2>
        <p className="mt-3 text-sm leading-6 text-cream-dim">
          A weekly card for the club you support: kick-off in UK time, one
          plain-English thing to look for, depth, and pubs where fans of that
          side might gather. News, pods and watch notes for that team live in
          the same app. Discord is the chat home when the invite is ready.
        </p>
        <Link
          href="/pick-your-team"
          className="mt-4 inline-flex rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-navy hover:bg-gold-soft"
        >
          Pick my team →
        </Link>
      </section>
    );
  }

  const team = record.team;
  const profile = getTeamProfileByAbbr(team.abbreviation);
  const profileHref = profile ? `/teams/${profile.slug}` : "/teams";

  return (
    <section
      id="your-sunday"
      className="scroll-mt-24 rounded-2xl border border-gold/35 bg-navy-2 p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
            Your Sunday
          </p>
          <p className="mt-1 text-xs text-cream-dim">{weekLabel}</p>
        </div>
        <Link href="/pick-your-team" className="text-xs text-gold hover:text-gold-soft">
          Change team
        </Link>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <TeamLogo team={team} size={compact ? 40 : 52} />
        <div className="min-w-0">
          <h2 className="font-display text-2xl leading-tight text-cream sm:text-3xl">
            {team.name}
          </h2>
          <p className="text-sm text-cream-dim">{team.abbreviation}</p>
        </div>
      </div>

      {!fixtures.ok ? (
        <p className="mt-4 text-sm leading-6 text-cream-dim">
          {fixtures.error} The card still knows your side. The slate will be back when the
          feed is.
        </p>
      ) : match ? (
        <div className="mt-4 space-y-1">
          <p className="font-medium text-cream">
            {match.game.away.shortName} @ {match.game.home.shortName}
          </p>
          <p className="text-sm text-gold">{formatUkDateTime(match.game.kickoffUtc)}</p>
          {match.game.venue || match.game.venueCity ? (
            <p className="text-xs text-cream-dim">
              {[match.game.venue, match.game.venueCity].filter(Boolean).join(" · ")}
            </p>
          ) : null}
        </div>
      ) : (
        <p className="mt-4 text-sm font-medium text-cream">No {team.shortName} game listed this week</p>
      )}

      {explainer ? (
        <div className="mt-4 border-t border-line pt-4">
          <ExplainerBlock explainer={explainer} compact={compact} />
        </div>
      ) : null}

      {!compact ? (
        <div className="mt-4 border-t border-line pt-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
            Depth snapshot
          </p>
          <div className="mt-1">
            <DepthLine abbreviation={team.abbreviation} />
          </div>
          <Link
            href={profileHref}
            className="mt-2 inline-block text-sm text-gold hover:text-gold-soft"
          >
            Full team profile →
          </Link>
        </div>
      ) : null}

      {compact ? (
        <p className="mt-4 text-sm leading-6">
          <Link href="/this-week#your-sunday" className="font-semibold text-gold">
            Open the full card →
          </Link>
          <span className="text-cream-dim"> · </span>
          <Link href="/community" className="text-gold hover:text-gold-soft">
            Meet your team
          </Link>
        </p>
      ) : (
        <div className="mt-4 border-t border-line pt-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
            Meet your lot
          </p>
          <p className="mt-1 text-sm leading-6 text-cream-dim">
            Chat with other UK fans of {team.shortName} on Discord when it opens,
            or find a pub that will put the game on. News, pods and the depth
            chart for this club live in the same app.
          </p>
          <p className="mt-2 text-sm leading-6">
            <Link href="/community" className="text-gold hover:text-gold-soft">
              Community →
            </Link>
            <span className="text-cream-dim"> · </span>
            <Link href="/watch-near-you" className="text-gold hover:text-gold-soft">
              Pubs near you →
            </Link>
          </p>
          {SUNDAY_CARD_IS_FREE ? (
            <p className="mt-3 text-xs leading-5 text-cream-dim">
              Free weekly card. The games list underneath is the same for everyone.
            </p>
          ) : null}
        </div>
      )}
    </section>
  );
}
