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
  {
    date: "2026-09-30",
    headline: "Tonight's TNF injury news is a mess for Pittsburgh",
    take: "Joey Porter Jr. is ruled out again for the Browns game despite being listed as a full participant on Monday and Tuesday, and his contract row rumbles on. Jalen Ramsey is questionable even though he says he's broken his wrist. Kick-off is 1:15am UK time on Friday, so check the inactives before you stay up for it.",
    author: OUR_TAKE_AUTHOR,
    sources: [{ name: "ESPN" }, { name: "NFL.com" }],
    expires_at: "2026-10-02T01:15+01:00",
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
