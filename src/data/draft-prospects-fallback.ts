export type DraftProspect = {
  id: string;
  rank: number;
  name: string;
  position: string;
  college: string;
  why: string;
};

/** Early consensus top 12, late summer 2026. Rankings move — this is a snapshot, not a promise. */
export const fallbackProspects: DraftProspect[] = [
  {
    id: "jeremiah-smith",
    rank: 1,
    name: "Jeremiah Smith",
    position: "WR",
    college: "Ohio State",
    why: "The name most boards put first: a receiver who already looks like a Sunday problem. If only one college player is on UK highlights, it is usually him.",
  },
  {
    id: "leonard-moore",
    rank: 2,
    name: "Leonard Moore",
    position: "CB",
    college: "Notre Dame",
    why: "A long corner who plays the ball. Defence-first clubs at the top of the Draft often fall in love with this type.",
  },
  {
    id: "arch-manning",
    rank: 3,
    name: "Arch Manning",
    position: "QB",
    college: "Texas",
    why: "The famous surname, and the most talked-about quarterback. Some boards have him first; others wait to see a full clean season. Either way, you will hear the name.",
  },
  {
    id: "dylan-stewart",
    rank: 4,
    name: "Dylan Stewart",
    position: "EDGE",
    college: "South Carolina",
    why: "A pass rusher with bend — the kind of player who wrecks a pocket. Edge rushers go early because they change quarterbacks’ nights.",
  },
  {
    id: "cam-coleman",
    rank: 5,
    name: "Cam Coleman",
    position: "WR",
    college: "Texas",
    why: "The other Texas wideout. Tall, catch-radius, red-zone threat. In a class without Smith he would be the WR everyone argues about.",
  },
  {
    id: "dante-moore",
    rank: 6,
    name: "Dante Moore",
    position: "QB",
    college: "Oregon",
    why: "The calm Oregon quarterback. Some writers prefer him to Manning. That argument will run until April.",
  },
  {
    id: "colin-simmons",
    rank: 7,
    name: "Colin Simmons",
    position: "EDGE",
    college: "Texas",
    why: "A twitchy front-seven piece: can rush, drop, and chase. Texas keeps producing these hybrid defenders.",
  },
  {
    id: "trevor-goosby",
    rank: 8,
    name: "Trevor Goosby",
    position: "OT",
    college: "Texas",
    why: "A big left tackle with light feet. Blind-side tackles protect the quarterback’s back — clubs pay for that.",
  },
  {
    id: "charlie-becker",
    rank: 9,
    name: "Charlie Becker",
    position: "WR",
    college: "Indiana",
    why: "Burst onto boards after a big Indiana season. Contested catches and long speed — the “where did he come from?” name.",
  },
  {
    id: "yhonzae-pierre",
    rank: 10,
    name: "Yhonzae Pierre",
    position: "EDGE",
    college: "Alabama",
    why: "Alabama edge rusher. If you hear “get-off” on a broadcast, that is the first step off the line — his selling point.",
  },
  {
    id: "lanorris-sellers",
    rank: 11,
    name: "LaNorris Sellers",
    position: "QB",
    college: "South Carolina",
    why: "A big, improvised playmaker. Stayed in school; the tape is chaotic and exciting. UK viewers will see him on Saturday highlights.",
  },
  {
    id: "jordan-seaton",
    rank: 12,
    name: "Jordan Seaton",
    position: "OT",
    college: "LSU",
    why: "An LSU tackle with length and punch. Offensive line names are quieter on telly; clubs still draft them high.",
  },
];

export const fallbackSource = {
  label: "The Athletic / Yahoo Sports big boards (late summer 2026)",
  href: "https://www.nytimes.com/athletic/7536774/2026/08/26/nfl-draft-2027-rankings-smith-leonard-moore/",
};
