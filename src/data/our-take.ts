export const OUR_TAKE_AUTHOR = "Blitz, First Down Scotland";

export type OurTakeSource = {
  name: string;
  /** Optional. Omit when we are naming the source without a link. */
  url?: string;
};

/**
 * One daily note. Add a new object to `ourTakes` (this file only).
 * `date` is `YYYY-MM-DD`. Newest date is shown first. Same-day items keep
 * the order they appear in the array.
 * `expires_at` is an optional ISO datetime. Write the Europe/London offset
 * (`+00:00` or `+01:00`). The note is hidden once that moment has passed.
 */
export type OurTakeItem = {
  date: string;
  headline: string;
  take: string;
  author?: string;
  sources: OurTakeSource[];
  expires_at?: string;
};

export const ourTakes: OurTakeItem[] = [
  {
    date: "2026-10-02",
    headline: "Watson does it again as the Browns go top of the AFC North",
    take: "Andre Szmyt's career-long 56-yarder with 10 seconds left beat the Steelers 27-24, after Rodgers had tied it with a touchdown and a two-point sneak. That's a third straight game-winning drive from Deshaun Watson. The Browns are 3-1 and top of the division on their own for the first time since November 2014. Whatever you think of Watson, the comeback stat is real.",
    author: OUR_TAKE_AUTHOR,
    sources: [
      {
        name: "ESPN",
        url: "https://www.espn.com/nfl/story/_/id/50082906/watson-leads-third-straight-winning-drive-puts-browns-atop-north",
      },
      {
        name: "AP via CBS Sports",
        url: "https://www.cbssports.com/nfl/news/andre-szmyts-late-56-yard-fg-lifts-browns-past-steelers-27-24/",
      },
    ],
  },
  {
    date: "2026-10-02",
    headline: "Jerry Jones pays a second-rounder for Joey Porter Jr.",
    take: "Dallas sent a 2028 second and a 2027 sixth to Pittsburgh for a corner who hasn't played a snap this season because of a back injury and a contract standoff. With a 1-2 record and a pass defence ranked 31st in opponent QBR, the Cowboys are going all in now. The question is whether he's healthy enough to be worth it, because he's also due a big new contract.",
    author: OUR_TAKE_AUTHOR,
    sources: [
      {
        name: "ESPN",
        url: "https://www.espn.com/nfl/story/_/id/50074351/sources-steelers-trade-joey-porter-jr-cowboys",
      },
      {
        name: "CBS Sports",
        url: "https://www.cbssports.com/nfl/news/why-the-cowboys-traded-for-cb-joey-porter-jr/",
      },
    ],
  },
  {
    date: "2026-10-02",
    headline: "Jayden Reed's season is over",
    take: "Matt LaFleur has confirmed that Reed needs neck surgery and will miss the rest of 2026. LaFleur says it isn't career-threatening, which is the main thing after he was carted off in Week 2. On the field, it's now Christian Watson and Matthew Golden's offence, and Tucker Kraft should get more of the ball.",
    author: OUR_TAKE_AUTHOR,
    sources: [
      {
        name: "NFL.com",
        url: "https://www.nfl.com/news/packers-wr-jayden-reed-to-undergo-neck-surgery-miss-rest-of-2026-season",
      },
      {
        name: "CBS Sports",
        url: "https://www.cbssports.com/nfl/news/jayden-reed-injury-update-packers-wr-neck-surgery/",
      },
    ],
  },
  {
    date: "2026-10-02",
    headline: "Carolina lose both starting corners just before facing the Lions",
    take: "Jaycee Horn (quad) and Mike Jackson (groin, after surgery) are on injured reserve. Dave Canales expects them to be out for \"eight-ish weeks\". Rookie Will Lee and Akayleb Evans are expected to start against Detroit on Sunday night, which is 1:20am Monday in the UK. Detroit's offence will fancy that.",
    author: OUR_TAKE_AUTHOR,
    sources: [
      {
        name: "Panthers.com",
        url: "https://www.panthers.com/news/panthers-place-jaycee-horn-and-mike-jackson-on-injured-reserve",
      },
      {
        name: "WFAE",
        url: "https://www.wfae.org/sports/2026-10-01/panthers-place-jaycee-horn-mike-jackson-on-injured-reserve",
      },
    ],
    expires_at: "2026-10-05T01:20+01:00",
  },
  {
    date: "2026-09-30",
    headline: "NFL admits the Rams were robbed",
    take: "Sean McVay says the league told him the late pass interference call on Josh Wallace shouldn't have been thrown. That flag wiped out a game-sealing interception and set up Denver's winning touchdown in their 30-26 win. An apology doesn't change the result, though: the Rams are still 1-2, and Broncos fans will be happy to keep the win.",
    author: OUR_TAKE_AUTHOR,
    sources: [{ name: "AP" }, { name: "NBC Sports/PFT" }],
  },
  {
    date: "2026-09-30",
    headline: "J.J. McCarthy is a Giant, but don't expect him to start soon",
    take: "New York gave Minnesota a 2027 fifth-round pick for him after Jaxson Dart was lost for the season, and the deal is pending a physical. Jameis Winston is still the starter, and James Palmer reckons McCarthy is Week 7 to 9 at the earliest. For now it's a cheap punt on a former top-10 pick, not a QB change.",
    author: OUR_TAKE_AUTHOR,
    sources: [{ name: "Giants.com" }, { name: "Vikings.com" }, { name: "Heavy" }],
  },
  {
    date: "2026-09-30",
    headline: "Tampa hand it to an undrafted rookie",
    take: "Baker Mayfield is out for at least three weeks with a dislocated thumb, so Jalon Daniels starts against Green Bay on Sunday. He'll be the first quarterback other than Mayfield to start for the Bucs since Tom Brady, and the first undrafted rookie ever to start at QB in their 51 seasons. Tampa are 0-3, so there's no easing him in.",
    author: OUR_TAKE_AUTHOR,
    sources: [{ name: "Buccaneers.com" }, { name: "NFL.com" }],
  },
];

export function ourTakeAuthor(item: OurTakeItem): string {
  const author = item.author?.trim();
  return author || OUR_TAKE_AUTHOR;
}

/** Hidden once `expires_at` is reached. Unparseable values stay visible. */
export function isOurTakeCurrent(item: OurTakeItem, now: Date): boolean {
  if (!item.expires_at) return true;
  const expiry = new Date(item.expires_at);
  if (Number.isNaN(expiry.getTime())) return true;
  return now.getTime() < expiry.getTime();
}

/** Newest date first. Same-day items keep file order. */
export function sortedOurTakes(items: readonly OurTakeItem[] = ourTakes): OurTakeItem[] {
  return items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      if (a.item.date === b.item.date) return a.index - b.index;
      return a.item.date < b.item.date ? 1 : -1;
    })
    .map(({ item }) => item);
}
