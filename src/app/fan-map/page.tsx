import type { Metadata } from "next";
import { FanMapExplorer } from "@/components/fan-map/FanMapExplorer";
import { PageIntro } from "@/components/PageIntro";
import { getPublicFanMap } from "@/lib/fan-map/data";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "NFL UK Fan Map",
  description:
    "Which NFL team owns Scotland? Put your town on the First Down Scotland fan map and find fans of your club across the UK.",
  alternates: { canonical: absoluteUrl("/fan-map") },
};

export default async function FanMapPage() {
  const data = await getPublicFanMap();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <PageIntro eyebrow="NFL UK Fan Map" title="Which NFL team owns Scotland?">
        <p>
          Choose your team. Put your town on the map. Find your NFL community.
          Scotland first, then the rest of the UK — down to Wishaw and Motherwell,
          not just the big cities.
        </p>
        <p>
          Who owns Scotland is a live fight: towns that reach {data.privacyThreshold}{" "}
          fans are owned by the leading scheme. Flips hit the territory feed.
          No sign-up.
        </p>
      </PageIntro>
      <div className="mt-10">
        <FanMapExplorer data={data} />
      </div>
    </div>
  );
}
