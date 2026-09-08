export type DraftProspect = {
  id: string;
  rank: number;
  name: string;
  position: string;
  college: string;
  why: string;
};

/**
 * Rough top 12 from names that sit on at least two early 2027 boards
 * (The Athletic 26 Aug 2026, Yahoo Sports 2 Sept 2026, Sporting News).
 * Order is a consensus average, not one scout’s mock. Rankings move.
 */
export const fallbackProspects: DraftProspect[] = [
  {
    id: "jeremiah-smith",
    rank: 1,
    name: "Jeremiah Smith",
    position: "WR",
    college: "Ohio State",
    why: "The name most boards still put first: a receiver who already looks like a Sunday problem. If only one college player is on UK highlights, it is usually him.",
  },
  {
    id: "arch-manning",
    rank: 2,
    name: "Arch Manning",
    position: "QB",
    college: "Texas",
    why: "The famous surname, and the most talked-about quarterback. Yahoo had him first in September; others wait on a full clean season. You will hear the name either way.",
  },
  {
    id: "leonard-moore",
    rank: 3,
    name: "Leonard Moore",
    position: "CB",
    college: "Notre Dame",
    why: "A long corner who plays the ball. Defence-first clubs at the top of the Draft often fall in love with this type.",
  },
  {
    id: "dylan-stewart",
    rank: 4,
    name: "Dylan Stewart",
    position: "EDGE",
    college: "South Carolina",
    why: "A pass rusher with bend, the kind of player who wrecks a pocket. Edge rushers go early because they change quarterbacks’ nights.",
  },
  {
    id: "dante-moore",
    rank: 5,
    name: "Dante Moore",
    position: "QB",
    college: "Oregon",
    why: "The calm Oregon quarterback. Some writers prefer him to Manning. That argument will run until April.",
  },
  {
    id: "colin-simmons",
    rank: 6,
    name: "Colin Simmons",
    position: "EDGE",
    college: "Texas",
    why: "A twitchy front-seven piece: can rush, drop, and chase. Sporting News had him inside the top five; others have him a bit later.",
  },
  {
    id: "cam-coleman",
    rank: 7,
    name: "Cam Coleman",
    position: "WR",
    college: "Texas",
    why: "The other Texas wideout. Tall, catch-radius, red-zone threat. In a class without Smith he would be the WR everyone argues about.",
  },
  {
    id: "lanorris-sellers",
    rank: 8,
    name: "LaNorris Sellers",
    position: "QB",
    college: "South Carolina",
    why: "A big, improvised playmaker. Stayed in school; the tape is chaotic and exciting. UK viewers will see him on Saturday highlights.",
  },
  {
    id: "trevor-goosby",
    rank: 9,
    name: "Trevor Goosby",
    position: "OT",
    college: "Texas",
    why: "A big left tackle with light feet. Blind-side tackles protect the quarterback’s back: clubs pay for that.",
  },
  {
    id: "jordan-seaton",
    rank: 10,
    name: "Jordan Seaton",
    position: "OT",
    college: "LSU",
    why: "An LSU tackle with length and punch. Offensive line names are quieter on telly; clubs still draft them high.",
  },
  {
    id: "cayden-green",
    rank: 11,
    name: "Cayden Green",
    position: "OT",
    college: "Missouri",
    why: "A versatile lineman who has started at guard and tackle. Quiet on broadcasts; the sort of player clubs circle because he can play more than one spot.",
  },
  {
    id: "charlie-becker",
    rank: 12,
    name: "Charlie Becker",
    position: "WR",
    college: "Indiana",
    why: "Burst onto boards after a big Indiana season. Contested catches and long speed: the “where did he come from?” name.",
  },
];

export const fallbackSources = [
  {
    label: "The Athletic (Dane Brugler, 26 Aug 2026)",
    href: "https://www.nytimes.com/athletic/7536774/2026/08/26/nfl-draft-2027-rankings-smith-leonard-moore/",
  },
  {
    label: "Yahoo Sports (Nate Tice, 2 Sept 2026)",
    href: "https://sports.yahoo.com/nfl/article/arch-manning-jeremiah-smith-and-2-more-qbs-in-the-top-10-2027-nfl-draft-big-board-entering-week-1-061222683.html",
  },
  {
    label: "Sporting News big board",
    href: "https://www.sportingnews.com/us/nfl/news/nfl-draft-prospects-2027-big-board-rankings/6c51c34950e99dedfe03b353",
  },
] as const;

export const fallbackSource = {
  label: "The Athletic, Yahoo Sports and Sporting News (late Aug–early Sept 2026)",
  href: fallbackSources[0].href,
};
