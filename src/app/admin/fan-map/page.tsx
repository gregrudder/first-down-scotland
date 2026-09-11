import type { Metadata } from "next";
import { AdminFanMapClient } from "@/components/fan-map/AdminFanMapClient";
import { PageIntro } from "@/components/PageIntro";
import { getAdminSecret } from "@/lib/fan-map/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Fan map admin",
  robots: { index: false, follow: false },
};

export default function AdminFanMapPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <PageIntro eyebrow="Private" title="Fan map analytics">
        <p>
          Aggregates, growth, a radius hotspot, and tools to hide or delete
          stuffed pins. No emails, names or cookie ids. Gated by{" "}
          <code className="text-cream">FAN_MAP_ADMIN_SECRET</code>.
        </p>
      </PageIntro>
      <div className="mt-10">
        <AdminFanMapClient adminConfigured={Boolean(getAdminSecret())} />
      </div>
    </div>
  );
}
