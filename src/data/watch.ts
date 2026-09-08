export type WatchOption = {
  name: string;
  kind: "Free-to-air" | "Pay TV" | "Streaming";
  summary: string;
  typical: string;
};

export const watchDisclaimer =
  "UK NFL rights move around. This page is a high-level map for the 2026 season, not a per-game listings guide. Always check the channel’s own schedule before you stay up.";

export const watchOptions: WatchOption[] = [
  {
    name: "Channel 5 / 5",
    kind: "Free-to-air",
    summary:
      "The main free-to-air home. For 2026 the flagship Sunday show, NFL On 5, is built around a 9pm UK game.",
    typical: "Sunday night primetime game, plus selected international fixtures and the Super Bowl.",
  },
  {
    name: "5Action",
    kind: "Free-to-air",
    summary:
      "Channel 5’s sister channel. In 2026 the earlier Sunday game (around 6pm UK) lives here rather than on the main channel.",
    typical: "Sunday tea-time kick-off through the regular season.",
  },
  {
    name: "My5",
    kind: "Streaming",
    summary:
      "Channel 5’s free streaming home. Useful if you missed the live free-to-air game or want to watch on a laptop.",
    typical: "Catch-up for 5 / 5Action coverage, subject to their own windowing.",
  },
  {
    name: "Sky Sports",
    kind: "Pay TV",
    summary:
      "The biggest UK slate: more than half the games, RedZone, Thursday/Sunday/Monday night football, Thanksgiving, the play-offs and the Super Bowl.",
    typical: "Sunday double-headers, overnight US primetime, and the dedicated Sky Sports NFL channel.",
  },
  {
    name: "NFL Game Pass on DAZN",
    kind: "Streaming",
    summary:
      "The “watch every game” option. Live and on demand, plus NFL Network and condensed replays. It is a paid pass, not a free highlight show.",
    typical: "Out-of-market games, condensed “Game in 40”, and rewatching a London kick-off the next day.",
  },
  {
    name: "Netflix",
    kind: "Streaming",
    summary:
      "A small, advertised handful of regular-season games, not the whole league. If the US feed says Netflix, that is usually the UK home as well.",
    typical:
      "In 2026 that includes the Week 1 Australia game, a Thanksgiving Eve match, two Christmas Day games, and a Week 18 game.",
  },
];

export const watchTips = [
  "International games in London, and the other European venues, are usually shown across 5, Sky and Game Pass. Those are the easiest “put it on in the pub” Sundays.",
  "A US network name on the scoreboard (NBC, CBS, FOX, ESPN) is not a UK channel. Use it only as a clue that the game is a national US broadcast.",
  "RedZone is a Sky / Game Pass product that hops between scoring drives. Brilliant once you know the sport; chaotic if you are still on lesson two.",
  "We do not scrape per-game UK rights. If two apps disagree, trust the broadcaster, not a spreadsheet.",
];
