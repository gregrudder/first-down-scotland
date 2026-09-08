export type FilmTitle = {
  id: string;
  title: string;
  alsoCalled?: string;
  kind: string;
  why: string;
  watchHint: string;
  officialUrl?: string;
  officialLabel?: string;
};

export const filmRoomDisclaimer =
  "This is a watch-to-learn list, not a pirate den. We do not host matches or scrape streams. Rights move: a title that is on Netflix this month can vanish next. Trust the app on your telly, not this page, for whether something is actually there.";

export const filmTitles: FilmTitle[] = [
  {
    id: "americas-game",
    title: "America’s Game",
    kind: "NFL Films · one Super Bowl team per film",
    why: "The cleanest way to watch a whole season as a story. One club, one year, one Super Bowl. You hear why a drive mattered without needing the live score bug. Start with any recent winner you have heard of.",
    watchHint:
      "Catalogue rotates. Search the official NFL or NFL Films YouTube for “America’s Game”, and check NFL Game Pass on DAZN. Individual films also turn up to buy on the usual stores. We will not point you at a random upload.",
    officialUrl: "https://www.youtube.com/results?search_query=America%27s+Game+NFL+Films",
    officialLabel: "Search official NFL YouTube",
  },
  {
    id: "hard-knocks",
    title: "Hard Knocks",
    kind: "HBO × NFL Films · training camp",
    why: "This is how a 53-man roster actually gets made. You see practice, cuts, and why a “practice squad” is a real job. Useful after the offence-vs-defence lesson: the pads are on, but it is still August.",
    watchHint:
      "The US home is HBO / Max. In the UK it has appeared on Sky / NOW and on Max; a new camp season can land late, or not at all. Search those apps for the current team. Game Pass sometimes carries older years. Do not expect Channel 5.",
  },
  {
    id: "all-or-nothing",
    title: "All or Nothing",
    alsoCalled: "A season with one club, door to door.",
    kind: "Amazon × NFL Films · full season",
    why: "Hard Knocks is camp. This is the regular season: wins, injuries, and the Monday meeting. Pick a season of a team you already like, or the Cardinals / Rams years if you want the original flavour.",
    watchHint:
      "Usually Prime Video in the UK. Seasons are listed under different club names: search “All or Nothing” plus the team. If a year is missing, it has been pulled, not hidden behind a dodgy link.",
    officialUrl: "https://www.amazon.co.uk/s?k=All+or+Nothing+NFL",
    officialLabel: "Search Prime Video UK",
  },
  {
    id: "quarterback",
    title: "Quarterback",
    kind: "Netflix × NFL Films · the position",
    why: "Helmets, headphones, and why everyone stares at one person. You will understand the pocket, the play clock, and why an incompletion can be a good decision. Watch this after the downs lesson.",
    watchHint:
      "Made for Netflix. The UK Netflix page exists: search “Quarterback”. Series and seasons can still be geo-locked or delayed. If it is not in your app, it is not on. We will not suggest a VPN.",
    officialUrl: "https://www.netflix.com/gb/title/81482895",
    officialLabel: "Netflix (UK page)",
  },
  {
    id: "wide-receiver",
    title: "Wide Receiver",
    alsoCalled: "Titled Receiver on Netflix.",
    kind: "Netflix × NFL Films · the other lot",
    why: "Routes, hands, and the quiet work that makes a slant look easy. If Quarterback is the person throwing, this is who they are looking for. Pair it with the common-plays diagrams.",
    watchHint:
      "Also a Netflix series. In the app it is usually filed as Receiver, not “Wide Receiver”. Same rule: if the UK row is empty, wait. Do not go hunting unofficial files.",
    officialUrl: "https://www.netflix.com/gb/title/81733809",
    officialLabel: "Netflix (UK page)",
  },
];

export const filmRoomLater = [
  "A Super Bowl film night (the game, then America’s Game for that year).",
  "Hard Knocks in-season editions, when they exist.",
  "A London-game documentary, if NFL Films cut one worth pointing at.",
  "Quarterback / Receiver follow-up seasons as they land in the UK app.",
];
