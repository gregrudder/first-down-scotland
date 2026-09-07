const DEFAULT_CONTACT = "info@g4-marketing.net";

export function contactEmail(): string {
  const fromEnv = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();
  if (fromEnv && fromEnv.includes("@")) return fromEnv;
  return DEFAULT_CONTACT;
}

export function listingMailto(): string {
  const subject = encodeURIComponent("NFL pub listing — First Down Scotland");
  const body = encodeURIComponent(
    "Hi Greg — we’d like to be listed / featured as a pub that shows the NFL.\n\nPub name:\nTown / area:\nWhat you show (e.g. RedZone Sundays):\n",
  );
  return `mailto:${contactEmail()}?subject=${subject}&body=${body}`;
}
