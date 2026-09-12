import type { Metadata } from "next";
import { FanMapExplorer } from "@/components/fan-map/FanMapExplorer";
import { PageIntro } from "@/components/PageIntro";
import { getPublicFanMap } from "@/lib/fan-map/data";
import { absoluteUrl, schemeBattlesHook } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "NFL Scheme Battles",
  description:
    "NFL Scheme Battles: which team runs the scheme? Choose your team, put your town on the map, and find your NFL community in Wishaw, Motherwell, East Kilbride, Paisley, Dundee and across the UK.",
  alternates: { canonical: absoluteUrl("/fan-map") },
};

export default async function FanMapPage() {
  const data = await getPublicFanMap();
  const thresholdFans =
    data.privacyThreshold === 1 ? "1 fan" : `${data.privacyThreshold} fans`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <PageIntro eyebrow="NFL Scheme Battles" title={schemeBattlesHook}>
        <p>
          Choose your team. Put your town on the map. Find your NFL community.
          Scotland first, then the rest of the UK: Wishaw, Motherwell, East
          Kilbride, Paisley and Dundee, not just the big cities.
        </p>
        <p>
          NFL Scheme Battles is the live fight. A town (a scheme) that reaches{" "}
          {thresholdFans} is owned by the leading club. Flips hit the territory
          feed. No sign-up.
        </p>
      </PageIntro>
      <div className="mt-10">
        <FanMapExplorer data={data} />
      </div>
    </div>
  );
}
