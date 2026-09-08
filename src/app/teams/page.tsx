import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { TeamIndexCard } from "@/components/TeamIndexCard";
import { TrademarkNote } from "@/components/TrademarkNote";
import { divisions, teamProfileNote, teamsInDivision } from "@/data/team-profiles";

export const metadata: Metadata = {
  title: "NFL teams",
  description:
    "All 32 NFL teams in one place: stadium, colours, Super Bowls, a live depth chart, and a short beginner brief for the club you support.",
};

export default function TeamsIndexPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <PageIntro eyebrow="The 32" title="NFL teams">
        <p>
          Eight divisions, four clubs each. Start with a colour or a city you already
          know, or read the{" "}
          <Link href="/history" className="text-gold">
            short history
          </Link>{" "}
          first.{" "}
          <Link href="/pick-your-team" className="text-gold">
            Pick a side
          </Link>{" "}
          if you want to find other UK fans of that club. Each profile is the
          roster-and-depth stop in one place: 2026 snapshot, live ESPN depth chart,
          official YouTube, and a pod or two. The live{" "}
          <Link href="/standings" className="text-gold">
            standings table
          </Link>{" "}
          sits by division. Stadiums get renamed.
        </p>
      </PageIntro>

      <div className="mt-12 space-y-12">
        {divisions.map(({ conference, division }) => {
          const teams = teamsInDivision(conference, division);
          return (
            <section key={`${conference}-${division}`}>
              <h2 className="font-display text-2xl text-cream">
                {conference} {division}
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {teams.map((team) => (
                  <TeamIndexCard key={team.slug} team={team} />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <p className="mt-12 text-xs leading-5 text-cream-dim">{teamProfileNote}</p>
      <div className="mt-6">
        <TrademarkNote />
      </div>
    </div>
  );
}
