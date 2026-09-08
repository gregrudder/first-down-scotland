import type { PubListing } from "@/data/pubs";

export function PubCard({ pub }: { pub: PubListing }) {
  const demo = pub.status === "demo";

  return (
    <article
      className={`relative overflow-hidden rounded-2xl border p-5 ${
        demo
          ? "border-dashed border-gold/60 bg-navy-2"
          : "border-line bg-navy-2"
      }`}
    >
      {demo ? (
        <p
          className="pointer-events-none absolute inset-0 flex items-center justify-center text-center text-2xl font-semibold uppercase tracking-[0.2em] text-gold/15"
          aria-hidden
        >
          Demo (not a real pub)
        </p>
      ) : null}

      <div className="relative flex flex-wrap items-center gap-2">
        {pub.featured ? (
          <span className="rounded-full bg-gold px-2.5 py-0.5 text-xs font-semibold text-navy">
            Featured
          </span>
        ) : null}
        {demo ? (
          <span className="rounded-full border border-gold px-2.5 py-0.5 text-xs font-semibold text-gold">
            Demo (not a real pub)
          </span>
        ) : (
          <span className="rounded-full border border-line px-2.5 py-0.5 text-xs text-cream-dim">
            {pub.city}
          </span>
        )}
      </div>

      <h3 className="relative mt-3 font-display text-2xl text-cream">{pub.name}</h3>
      <p className="relative mt-1 text-sm text-cream-dim">
        {pub.area}, {pub.city}
      </p>
      <p className="relative mt-1 text-sm text-cream-dim">
        {pub.address}, {pub.postcode}
      </p>

      <dl className="relative mt-4 space-y-2 text-sm leading-6">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
            What they show
          </dt>
          <dd className="text-cream">{pub.shows}</dd>
        </div>
        {pub.screens ? (
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
              Screens
            </dt>
            <dd className="text-cream-dim">{pub.screens}</dd>
          </div>
        ) : null}
        {pub.bookingNote ? (
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
              Booking
            </dt>
            <dd className="text-cream-dim">{pub.bookingNote}</dd>
          </div>
        ) : null}
      </dl>

      {pub.website ? (
        <p className="relative mt-4 text-sm">
          <a
            href={pub.website}
            className="font-semibold text-gold"
            target="_blank"
            rel="noreferrer"
          >
            Pub website →
          </a>
        </p>
      ) : null}
    </article>
  );
}
