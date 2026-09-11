import Link from "next/link";
import { getPublicFanMap } from "@/lib/fan-map/data";

export async function FanMapHomeSection() {
  const data = await getPublicFanMap();
  const showCounts = data.configured && data.counters.fans > 0;
  const owner = data.whoOwnsScotland.owner;
  const latestFlip = data.whoOwnsScotland.flips[0];
  const townsLeader = data.whoOwnsScotland.townsLed[0];

  return (
    <section
      aria-label="NFL UK fan map"
      className="border-y border-line bg-navy-2"
    >
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
        <p className="text-xs font-semibold tracking-[0.16em] text-gold uppercase">
          Fan map · Scotland first
        </p>
        <h2 className="mt-2 max-w-3xl font-display text-3xl text-cream sm:text-4xl">
          Who owns Scotland?
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-7 text-cream-dim">
          Put your team on the map. No sign-up. Choose a club, pick your town,
          and fight a live Who Owns Scotland competition — towns flip when the
          leading scheme changes — then the rest of the UK.
        </p>
        {showCounts ? (
          <dl className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-line bg-navy px-4 py-3">
              <dt className="text-xs font-semibold tracking-[0.16em] text-gold uppercase">
                Fans on the map
              </dt>
              <dd className="mt-1 font-display text-2xl text-cream">{data.counters.fans}</dd>
            </div>
            <div className="rounded-2xl border border-line bg-navy px-4 py-3">
              <dt className="text-xs font-semibold tracking-[0.16em] text-gold uppercase">
                Towns
              </dt>
              <dd className="mt-1 font-display text-2xl text-cream">{data.counters.towns}</dd>
            </div>
            <div className="rounded-2xl border border-line bg-navy px-4 py-3">
              <dt className="text-xs font-semibold tracking-[0.16em] text-gold uppercase">
                Scotland leader
              </dt>
              <dd className="mt-1 font-display text-2xl text-cream">
                {townsLeader
                  ? `${townsLeader.shortName} · ${townsLeader.townCount} towns`
                  : owner
                    ? owner.shortName
                    : "Too early"}
              </dd>
            </div>
          </dl>
        ) : (
          <p className="mt-5 text-sm leading-6 text-cream-dim">
            The map starts from zero. No demo fans. Live numbers appear here once
            real people put a town on it.
          </p>
        )}
        {latestFlip ? (
          <p className="mt-4 text-sm leading-6 text-cream">
            Latest flip: {latestFlip.message}
          </p>
        ) : null}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/fan-map/add"
            className="inline-flex items-center justify-center rounded-full bg-gold px-6 py-3 text-sm font-semibold text-gold-ink hover:bg-gold-soft"
          >
            Put your team on the map
          </Link>
          <Link
            href="/fan-map#who-owns-scotland"
            className="inline-flex items-center justify-center rounded-full border border-line px-6 py-3 text-sm font-semibold text-cream hover:border-gold/50"
          >
            Open the fan map
          </Link>
        </div>
      </div>
    </section>
  );
}
