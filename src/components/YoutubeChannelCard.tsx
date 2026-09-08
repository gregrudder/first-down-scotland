import { MediaThumb } from "@/components/MediaThumb";
import type { TeamYoutube } from "@/data/team-youtube";

export function YoutubeChannelCard({
  channel,
  fallbackSrc,
}: {
  channel: TeamYoutube;
  fallbackSrc?: string;
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-line bg-navy-2">
      <div className="sm:flex sm:items-stretch">
        <MediaThumb src={channel.artworkUrl} fallbackSrc={fallbackSrc} alt="" />
        <div className="min-w-0 flex-1 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
            Official YouTube
          </p>
          <h3 className="mt-2 font-display text-xl text-cream">{channel.handle}</h3>
          <p className="mt-2 text-sm leading-6 text-cream-dim">
            Club-made highlights and shows. We link out — we do not embed the player.
          </p>
          <p className="mt-4">
            <a
              href={channel.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-full bg-gold px-4 py-2 text-sm font-semibold text-navy hover:bg-gold-soft"
            >
              Watch on YouTube →
            </a>
          </p>
        </div>
      </div>
    </article>
  );
}
