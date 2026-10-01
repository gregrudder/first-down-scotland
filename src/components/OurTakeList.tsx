import {
  isOurTakeCurrent,
  ourTakeAuthor,
  sortedOurTakes,
  type OurTakeItem,
} from "@/data/our-take";
import { formatUkDay } from "@/lib/format-date";

export function OurTakeList({ items, now }: { items: OurTakeItem[]; now: Date }) {
  const visible = sortedOurTakes(items).filter((item) => isOurTakeCurrent(item, now));
  if (visible.length === 0) return null;

  return (
    <div className="mt-10 grid gap-4">
      {visible.map((item) => (
        <article key={`${item.date}-${item.headline}`} className="rounded-2xl border border-line bg-navy-2 p-5">
          <time dateTime={item.date} className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
            {formatUkDay(item.date)}
          </time>
          <h2 className="mt-2 font-display text-2xl text-cream">{item.headline}</h2>
          <p className="mt-3 text-base leading-7 text-cream-dim">{item.take}</p>
          <p className="mt-4 text-sm text-cream">{ourTakeAuthor(item)}</p>
          {item.sources.length > 0 ? (
            <p className="mt-2 text-sm leading-6 text-cream-dim">
              <span className="font-semibold text-cream">Source: </span>
              {item.sources.map((source, index) => (
                <span key={`${source.name}-${index}`}>
                  {index > 0 ? ", " : null}
                  {source.url ? (
                    <a href={source.url} className="text-gold" target="_blank" rel="noreferrer">
                      {source.name}
                    </a>
                  ) : (
                    source.name
                  )}
                </span>
              ))}
            </p>
          ) : null}
        </article>
      ))}
    </div>
  );
}
