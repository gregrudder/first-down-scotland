const DEFAULT_CONTACT = "info@g4-marketing.net";

export function contactEmail(): string {
  const fromEnv = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();
  if (fromEnv && fromEnv.includes("@")) return fromEnv;
  return DEFAULT_CONTACT;
}

export function listingMailto(): string {
  const subject = encodeURIComponent("NFL pub listing: First Down Scotland");
  const body = encodeURIComponent(
    "Pub name:\nTown:\nAddress:\nWhat you show:\nBooking or contact link:\nA page we can check:\n",
  );
  return `mailto:${contactEmail()}?subject=${subject}&body=${body}`;
}
