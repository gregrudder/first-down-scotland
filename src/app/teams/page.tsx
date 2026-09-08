import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { TeamIndexCard } from "@/components/TeamIndexCard";
import { TrademarkNote } from "@/components/TrademarkNote";
import { divisions, teamProfileNote, teamsInDivision } from "@/data/team-profiles";

export const metadata: Metadata = {
  title: "NFL teams",
  description:
    "All 32 NFL teams by conference and division — stadium, colours, Super Bowls, and a short beginner brief.",
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
          first. Profiles are snapshots for the 2026 season — stadiums get renamed.
          Each club page also has a live depth chart, the official YouTube, and a
          pod or two to follow.
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
