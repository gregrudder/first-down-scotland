import { splitContact, type PublicPub } from "@/data/pub-directory";

export function PubCard({ pub }: { pub: PublicPub }) {
  const contact = splitContact(pub.bookingOrContact);
  const source = /^https?:\/\//i.test(pub.sourceUrl) ? pub.sourceUrl : "";

  return (
    <article className="rounded-2xl border border-line bg-navy-2 p-5">
      <h3 className="font-display text-2xl text-cream">{pub.name}</h3>
      <p className="mt-1 text-sm text-gold">{pub.placeLabel}</p>
      {pub.address ? <p className="mt-1 text-sm leading-6 text-cream-dim">{pub.address}</p> : null}

      {pub.shows ? (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">What they show</p>
          <p className="mt-1 text-sm leading-6 text-cream">{pub.shows}</p>
        </div>
      ) : null}

      {contact.url || contact.detail ? (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">Booking / contact</p>
          <p className="mt-1 text-sm leading-6 text-cream">
            {contact.url ? (
              <a href={contact.url} className="font-semibold text-gold" target="_blank" rel="noreferrer">
                {contact.url}
              </a>
            ) : null}
            {contact.url && contact.detail ? " " : null}
            {contact.detail ? <span className="text-cream-dim">{contact.detail}</span> : null}
          </p>
        </div>
      ) : null}

      {source ? (
        <p className="mt-4 text-sm">
          <a href={source} className="font-semibold text-gold" target="_blank" rel="noreferrer">
            Source
          </a>
        </p>
      ) : null}

      {pub.checkedLabel ? <p className="mt-3 text-sm text-cream-dim">{pub.checkedLabel}</p> : null}
    </article>
  );
}
