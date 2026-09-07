function firstNonEmpty(...values: Array<string | undefined>): string | undefined {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return undefined;
}

export function discordInviteUrl(): string | null {
  const raw = firstNonEmpty(process.env.NEXT_PUBLIC_DISCORD_INVITE);
  if (!raw) return null;

  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    const host = url.hostname.replace(/^www\./, "").toLowerCase();
    const allowed =
      host === "discord.gg" || host === "discord.com" || host.endsWith(".discord.com");
    return allowed ? url.toString() : null;
  } catch {
    return null;
  }
}
