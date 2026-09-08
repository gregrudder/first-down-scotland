import { discordInviteUrl } from "@/lib/discord";

export function DiscordCta() {
  const invite = discordInviteUrl();

  return (
    <div className="rounded-2xl border border-gold/30 bg-navy-2 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
        Discord
      </p>
      <p className="mt-2 font-display text-2xl text-cream">Join the Discord</p>
      <p className="mt-2 text-sm leading-6 text-cream-dim">
        Meet fans of your team. One server for Scottish and UK supporters:
        say hello in #general, then pick the channel for the club you follow.
        Lessons stay free on the site.
      </p>
      <a
        href={invite}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex items-center justify-center rounded-full bg-gold px-6 py-3 text-sm font-semibold text-gold-ink hover:bg-gold-soft"
      >
        Join the Discord
      </a>
    </div>
  );
}
