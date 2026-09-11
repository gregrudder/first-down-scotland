import type { Metadata } from "next";
import Link from "next/link";
import { AddYourselfForm } from "@/components/fan-map/AddYourselfForm";
import { PageIntro } from "@/components/PageIntro";
import { getMe } from "@/lib/fan-map/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Put your team on the map",
  description:
    "Add your NFL team and UK town to the First Down Scotland fan map. One pin per person. Town centre only.",
};

export default async function AddFanPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; "signed-in"?: string }>;
}) {
  const params = await searchParams;
  const me = await getMe();
  const linkError =
    params.error === "expired" || params.error === "link" ? params.error : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <PageIntro eyebrow="Put your team on the map" title="Add yourself">
        <p>
          Pick a club, pick a UK town from the list, and we drop a pin on that
          town centre. One registration per email. Update it whenever you move
          or switch sides.
        </p>
        <p>
          <Link href="/fan-map" className="text-gold">
            ← Back to the fan map
          </Link>
        </p>
      </PageIntro>
      <div className="mt-10">
        <AddYourselfForm
          initialMe={me}
          signedIn={params["signed-in"] === "1"}
          linkError={linkError}
        />
      </div>
    </div>
  );
}
