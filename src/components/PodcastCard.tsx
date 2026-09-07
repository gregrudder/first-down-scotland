import { podcastKindLabel, type Podcast } from "@/data/podcasts";

export function PodcastCard({ show }: { show: Podcast }) {
  return (
    <article className="rounded-2xl border border-line bg-navy-2 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
        {podcastKindLabel[show.kind]}
      </p>
      <h3 className="mt-2 font-display text-xl text-cream">{show.title}</h3>
      <p className="mt-2 text-sm leading-6 text-cream-dim">{show.blurb}</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {show.links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-full border border-line px-3 py-1.5 text-sm font-semibold text-gold hover:border-gold/50"
            >
              {link.label} →
            </a>
          </li>
        ))}
      </ul>
    </article>
  );
}
