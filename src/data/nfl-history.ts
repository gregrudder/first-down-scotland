export type HistoryBeat = {
  year: string;
  title: string;
  body: string;
};

export const historyIntro = {
  eyebrow: "A century, roughly",
  title: "How the NFL got here",
  lead:
    "You do not need the 1920 minutes. You need enough history to know why there are two conferences, why the Super Bowl is numbered in Roman numerals, and why a London Sunday in Tottenham is now a normal part of the calendar.",
};

export const historyBeats: HistoryBeat[] = [
  {
    year: "1920",
    title: "A meeting in Canton",
    body:
      "Club owners met in an Ohio car showroom and formed the American Professional Football Association. Two years later it took the name you hear now: the National Football League. Early sides came and went. Green Bay, Chicago and a few others lasted.",
  },
  {
    year: "1958",
    title: "The game that sold the sport",
    body:
      "The Baltimore Colts beat the New York Giants in sudden-death overtime on American television. It is often called the greatest game ever played — that is a nickname, not a scoreline — and it is the moment many histories use for “this is now a TV sport”.",
  },
  {
    year: "1960",
    title: "The AFL arrives",
    body:
      "A rival league, the American Football League, launched with new cities, flashier offence and a chequebook. For a decade the NFL and AFL fought over players and attention. The Super Bowl exists because those two leagues agreed to share a championship game.",
  },
  {
    year: "1966–70",
    title: "Merger, then one league",
    body:
      "The leagues announced a merger in 1966. Super Bowl I was played in January 1967 (Green Bay beat Kansas City). The full merger landed in 1970: one NFL, two conferences — the AFC (old AFL plus a few NFL clubs) and the NFC. That split is still how the fixture list is built.",
  },
  {
    year: "1970s–90s",
    title: "The Super Bowl era",
    body:
      "Prime-time games, bigger television money, and dynasties you still hear about: Steelers, 49ers, Cowboys, then the Patriots later on. The league expanded — Tampa Bay and Seattle in 1976, Carolina and Jacksonville in 1995, the Browns returning in 1999, Houston in 2002 — and settled on 32 clubs.",
  },
  {
    year: "2002",
    title: "Eight tidy divisions",
    body:
      "Realignment created eight divisions of four. That is why “winning the North” matters: it is a straight path into the play-offs. Conferences still meet in the Super Bowl each February.",
  },
  {
    year: "2007–",
    title: "London, then the world",
    body:
      "The first regular-season NFL game in London was Giants v Dolphins at Wembley in 2007. The International Series is now a fixture: Wembley and Tottenham Hotspur Stadium most years, plus games in Germany, Brazil and elsewhere. The Jaguars have been the most regular London “home” side. It is not a one-off stunt anymore — it is how a lot of UK fans first saw a game in person.",
  },
  {
    year: "2020s",
    title: "Seventeen games, new buildings, old trophies",
    body:
      "The regular season grew to 17 games. Clubs kept moving and renaming stadiums. The Chiefs won three Super Bowls in five seasons, the Eagles took Super Bowl LIX in February 2025, and the Seahawks won Super Bowl LX in February 2026 — their second title, 29–13 over the Patriots at Levi’s Stadium. Buffalo opened a new Highmark Stadium for the 2026 season. Houston’s ground went back to the Reliant Stadium name after years as NRG.",
  },
];

export const historySourcesNote =
  "High-level franchise and Super Bowl facts follow NFL.com, Associated Press match reports, and the league’s published history of the AFL–NFL merger. Stadium names and listed capacities follow Wikipedia’s current NFL stadiums list as of the 2026 season (itself cited to club media guides and reporting). Figures change — naming rights, renovations, new builds.";
