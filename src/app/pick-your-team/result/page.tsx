"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo } from "react";
import { TeamResultCard, TrademarkNote } from "@/components/TeamResultCard";
import { getTeam } from "@/data/teams";
import { isTeamTag, whyThisFits } from "@/data/team-quiz";
import { saveTeam } from "@/lib/team-storage";

function ResultBody() {
  const params = useSearchParams();
  const abbreviation = params.get("team") ?? "";
  const viaRaw = params.get("via");
  const via = viaRaw === "spin" || viaRaw === "choose" ? viaRaw : "quiz";
  const tags = (params.get("tags") ?? "")
    .split(",")
    .filter(isTeamTag);
  const also = (params.get("also") ?? "")
    .split(",")
    .map((value) => getTeam(value))
    .filter((team): team is NonNullable<typeof team> => Boolean(team));
  const team = getTeam(abbreviation);

  useEffect(() => {
    if (team) saveTeam(team.abbreviation, via);
  }, [team, via]);

  const story = useMemo(() => {
    if (!team) return "";
    if (via === "spin") return team.oneLiner;
    if (via === "choose") return team.oneLiner;
    return whyThisFits(team, tags);
  }, [team, via, tags]);

  if (!team) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="font-display text-3xl text-cream">That team wandered off</h1>
        <p className="mt-3 text-cream-dim">
          We couldn’t match that result.{" "}
          <Link href="/pick-your-team" className="text-gold">
            Pick again
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <TeamResultCard
        team={team}
        eyebrow={
          via === "spin" ? "The ball has spoken" : via === "choose" ? "Your pick" : "Your match"
        }
        story={story}
      />

      {via === "quiz" && also.length > 0 ? (
        <section className="mt-8">
          <h2 className="font-display text-2xl text-cream">Near misses</h2>
          <ul className="mt-3 space-y-2 text-sm text-cream-dim">
            {also.map((entry) => (
              <li key={entry.abbreviation}>
                <Link
                  href={`/pick-your-team/result?team=${entry.abbreviation}&via=quiz&tags=${tags.join(",")}`}
                  className="text-cream hover:text-gold"
                >
                  {entry.name}
                </Link>
                <span>: {entry.oneLiner}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <p className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm">
        <Link href="/community" className="font-semibold text-gold">
          Meet fans of this team →
        </Link>
        <Link href="/watch-near-you" className="text-gold">
          Pubs near you →
        </Link>
        <Link href="/this-week#your-sunday" className="text-gold">
          Your Sunday →
        </Link>
        <Link href="/pick-your-team" className="text-gold">
          Pick again →
        </Link>
      </p>
      <div className="mt-8">
        <TrademarkNote />
      </div>
    </div>
  );
}

export default function TeamResultPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl px-4 py-16 text-cream-dim">Loading your team…</div>
      }
    >
      <ResultBody />
    </Suspense>
  );
}
