import { discordInviteUrl } from "@/lib/discord";

export function DiscordCta() {
  const invite = discordInviteUrl();

  if (!invite) {
    return (
      <div className="rounded-2xl border border-gold/30 bg-navy-2 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
          Discord
        </p>
        <p className="mt-2 font-display text-2xl text-cream">Coming soon</p>
        <p className="mt-2 text-sm leading-6 text-cream-dim">
          The invite is not live yet. We would rather wait than send you to a
          dead link. Until then, pick a team and use the pub list to find places
          you could meet other fans of that side. Lessons stay on the site.
        </p>
      </div>
    );
  }

  return (
    <a
      href={invite}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center rounded-full bg-gold px-6 py-3 text-sm font-semibold text-gold-ink hover:bg-gold-soft"
    >
      Join the Discord
    </a>
  );
}
