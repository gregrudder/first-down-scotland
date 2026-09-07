import { discordInviteUrl } from "@/lib/discord";

export function DiscordCta() {
  const invite = discordInviteUrl();

  if (!invite) {
    return (
      <div className="rounded-2xl border border-line bg-navy-2 p-5">
        <p className="text-sm font-semibold text-cream">Invite link coming soon</p>
        <p className="mt-2 text-sm leading-6 text-cream-dim">
          The Discord is being set up. This button will light up once Greg posts the
          invite — no dead links in the meantime.
        </p>
      </div>
    );
  }

  return (
    <a
      href={invite}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center rounded-full bg-gold px-6 py-3 text-sm font-semibold text-navy hover:bg-gold-soft"
    >
      Join the Discord
    </a>
  );
}
