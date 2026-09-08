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
 * Listings are either a clearly fictional demo, or real venues we could
 * confirm from the pub’s own site. Add new live rows here: do not invent
 * names or addresses.
 */
export const pubs: PubListing[] = [
  {
    id: "gridiron-arms-sample",
    name: "The Gridiron Arms (sample)",
    area: "High Street",
    city: "Sampletown",
    address: "1 Fake Kickoff Lane",
    postcode: "G0 0FD",
    shows: "RedZone Sundays, plus a late-night primetime screen if the kettle allows",
    screens: "Two imaginary TVs and one decorative helmet",
    bookingNote: "Book the window table with your imaginary dog. This is not a real pub.",
    featured: true,
    status: "demo",
  },
  {
    id: "dukes-leith",
    name: "Duke’s Leith",
    area: "Leith",
    city: "Edinburgh",
    address: "31 Duke Street, Leith",
    postcode: "EH6 8HH",
    shows: "NFL RedZone on Sundays in season",
    screens: "Three 50-inch screens (as advertised on their site)",
    bookingNote: "Popular on Sundays: call or book ahead.",
    website: "https://www.dukesleith.co.uk/live-sport",
    status: "live",
    sourceNote: "Confirmed on dukesleith.co.uk (live sport / NFL RedZone Sundays).",
  },
  {
    id: "malones-edinburgh",
    name: "Malones Edinburgh",
    area: "Haymarket",
    city: "Edinburgh",
    address: "242 Morrison Street",
    postcode: "EH3 8DT",
    shows: "NFL including Super Bowl watch parties; confirm regular Sundays",
    screens: "HD screens over two floors (as advertised on their site)",
    bookingNote: "Super Bowl nights sell out. Call ahead for a regular Sunday.",
    website: "https://malonesedinburgh.com/sport/",
    status: "live",
    sourceNote:
      "Confirmed as a live-sport bar with Super Bowl parties on malonesedinburgh.com. Weekly NFL Sundays are less clearly advertised: check with the pub.",
  },
  {
    id: "malones-glasgow",
    name: "Malones Glasgow",
    area: "City centre",
    city: "Glasgow",
    address: "57–59 Sauchiehall Lane",
    postcode: "G2 4AB",
    shows: "NFL Sundays in season",
    screens: "Three floors with HD / 4K screens (as advertised on their site)",
    bookingNote: "Central and busy: worth checking they have the game you want.",
    website: "https://malonesbarglasgow.com/nfl-american-football-glasgow/",
    status: "live",
    sourceNote: "Confirmed on malonesbarglasgow.com (NFL Sundays page).",
  },
  {
    id: "ark-glasgow",
    name: "Ark Glasgow",
    area: "City centre",
    city: "Glasgow",
    address: "46 North Frederick Street",
    postcode: "G1 2BS",
    shows: "NFL Sundays and Super Bowl (as advertised)",
    screens: "HD screens (as advertised on their site)",
    bookingNote: "They mention pre-bookable NFL packages: confirm what’s on this week.",
    website: "https://www.socialpubandkitchen.co.uk/ark-glasgow/live-sport-pub",
    status: "live",
    sourceNote: "Confirmed on the Ark / Social Pub & Kitchen live-sport page (NFL Sundays).",
  },
];

export const comingSoonPlaces = [
  {
    city: "Edinburgh",
    note: "More neighbourhood listings after Leith and Haymarket: Stockbridge, the Southside, and out of town.",
  },
  {
    city: "Glasgow",
    note: "West End, Southside, and beyond the city-centre two we already have.",
  },
  {
    city: "Aberdeen, Dundee, Inverness & the rest",
    note: "If your local shows the NFL, we want them on here. Bar owners can enquire.",
  },
];

export const pubsDisclaimer =
  "Listings are a starting point, not a guarantee. Pubs change Sky packages, opening hours and what they put on the big screen. Always call or check the pub before you travel. First Down Scotland is not affiliated with these venues.";

export function demoPubs(): PubListing[] {
  return pubs.filter((pub) => pub.status === "demo");
}

export function livePubs(): PubListing[] {
  return pubs.filter((pub) => pub.status === "live");
}
