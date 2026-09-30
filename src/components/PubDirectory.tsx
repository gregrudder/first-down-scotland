"use client";

import { useMemo, useState } from "react";
import { PubCard } from "@/components/PubCard";
import { groupPubsByTown, type PublicPub } from "@/data/pub-directory";

export function PubDirectory({ pubs }: { pubs: PublicPub[] }) {
  const groups = useMemo(() => groupPubsByTown(pubs), [pubs]);
  const [town, setTown] = useState("all");
  const visible = town === "all" ? groups : groups.filter((group) => group.town === town);

  if (groups.length === 0) return null;

  return (
    <div className="mt-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-display text-2xl text-cream">By town</h2>
        <label className="text-sm text-cream-dim">
          <span className="mr-2">Town</span>
          <select
            value={town}
            onChange={(event) => setTown(event.target.value)}
            className="rounded-full border border-line bg-navy-2 px-4 py-2 text-sm text-cream"
          >
            <option value="all">All towns</option>
            {groups.map((group) => (
              <option key={group.town} value={group.town}>
                {group.town}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-8 space-y-10">
        {visible.map((group) => (
          <section key={group.town} aria-labelledby={`pubs-${group.town}`}>
            <h2 id={`pubs-${group.town}`} className="font-display text-3xl text-cream">
              {group.town}
            </h2>
            <div className="mt-4 grid gap-4">
              {group.pubs.map((pub) => (
                <PubCard key={`${pub.town}-${pub.name}-${pub.address}`} pub={pub} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
