import type { Metadata } from "next";
import Link from "next/link";
import { AddYourselfForm } from "@/components/fan-map/AddYourselfForm";
import { PageIntro } from "@/components/PageIntro";
import { getMe } from "@/lib/fan-map/auth";
import { turnstileSiteKey } from "@/lib/fan-map/turnstile";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Put your team on the map",
  description:
    "Add your NFL team and UK town to the First Down Scotland fan map. No account. Town centre only.",
};

export default async function AddFanPage() {
  const me = await getMe();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <PageIntro eyebrow="Put your team on the map" title="Add yourself">
        <p>
          Pick a club, pick a UK town from the list, and we drop a pin on that
          town centre. No email, no password. One pin per browser. Update it
          whenever you move or switch sides.
        </p>
        <p>
          <Link href="/fan-map" className="text-gold">
            ← Back to the fan map
          </Link>
        </p>
      </PageIntro>
      <div className="mt-10">
        <AddYourselfForm initialMe={me} turnstileSiteKey={turnstileSiteKey()} />
      </div>
    </div>
  );
}
