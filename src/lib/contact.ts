const DEFAULT_CONTACT = "info@g4-marketing.net";

export function contactEmail(): string {
  const fromEnv = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();
  if (fromEnv && fromEnv.includes("@")) return fromEnv;
  return DEFAULT_CONTACT;
}

export function listingMailto(): string {
  const subject = encodeURIComponent("Meetup partner: First Down Scotland");
  const body = encodeURIComponent(
    "Hi Greg: we would like to be the Glasgow / Edinburgh meetup partner for First Down Scotland — a city home for Scottish NFL fans, not a free-tab pitch.\n\nPub name:\nCity (Glasgow or Edinburgh):\nWhat you already show (e.g. RedZone Sundays):\n",
  );
  return `mailto:${contactEmail()}?subject=${subject}&body=${body}`;
}
