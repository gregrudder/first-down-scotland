import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { StartSitTool } from "@/components/StartSitTool";
import { discordInviteUrl } from "@/lib/discord";
import { getStartSitComparison } from "@/lib/start-sit";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Start/Sit",
  description:
    "Compare two NFL fantasy players side by side using Sleeper’s public projections, injury status, bye week and matchup. Waiver Wire’s verdict appears only when we have written one for that pair.",
};

export default async function StartSitPage({
  searchParams,
}: {
  searchParams: Promise<{ a?: string; b?: string }>;
}) {
  const { a, b } = await searchParams;
  const comparison = await getStartSitComparison(a, b);
  const discord = discordInviteUrl();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <PageIntro eyebrow="Fantasy" title="Start/Sit">
        <p>
          Pick two players. The columns are Sleeper’s public data for this week: position,
          team, injury status, bye, matchup and projections. A lean taken from those
          projections is labelled as such. It is not a guarantee, and PPR, half-PPR or
          standard scoring changes it.
        </p>
        <p>
          When we have a written call for that pair this week, it is labelled{" "}
          {"Waiver Wire's verdict"}. If we have not written one, you get the numbers only.
        </p>
        <p>
          Roster questions belong in{" "}
          <a href={discord} className="text-gold" target="_blank" rel="noreferrer">
            Discord #start-sit
          </a>
          .
        </p>
      </PageIntro>
      <StartSitTool aId={a ?? ""} bId={b ?? ""} comparison={comparison} />
    </div>
  );
}
