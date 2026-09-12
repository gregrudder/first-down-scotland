export type PubStatus = "live" | "demo" | "coming-soon";

export type PubListing = {
  id: string;
  name: string;
  area: string;
  city: string;
  address: string;
  postcode: string;
  shows: string;
  screens?: string;
  bookingNote?: string;
  website?: string;
  featured?: boolean;
  status: PubStatus;
  sourceNote?: string;
};

/**
 * Live partner listings go here once a Glasgow and Edinburgh home bar
 * are confirmed. Empty on purpose: Watch near you is a partner search,
 * not a venue directory.
 */
export const pubs: PubListing[] = [];

export const meetupPartnerCities = [
  {
    city: "Glasgow",
    note: "One meetup partner: a city home for Scottish NFL fans. The listing will land here once it is confirmed.",
  },
  {
    city: "Edinburgh",
    note: "One meetup partner: a city home for Scottish NFL fans. The listing will land here once it is confirmed.",
  },
] as const;

/** Alias kept so older imports still resolve. */
export const comingSoonPlaces = meetupPartnerCities;

export const pubsDisclaimer =
  "A Glasgow and Edinburgh partner list will appear here once those home bars are confirmed. First Down Scotland is not affiliated with any venue until that is agreed.";

export function demoPubs(): PubListing[] {
  return pubs.filter((pub) => pub.status === "demo");
}

export function livePubs(): PubListing[] {
  return pubs.filter((pub) => pub.status === "live");
}
