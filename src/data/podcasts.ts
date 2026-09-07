export type PodcastKind = "official" | "independent" | "fan";

export type PodcastLink = {
  label: "Website" | "Apple" | "Spotify" | "YouTube";
  href: string;
};

export type Podcast = {
  id: string;
  title: string;
  blurb: string;
  kind: PodcastKind;
  teamSlug?: string;
  links: PodcastLink[];
};

export const podcastKindLabel: Record<PodcastKind, string> = {
  official: "Official",
  independent: "Independent",
  fan: "Fan / beat",
};

export const generalPodcasts: Podcast[] = [
  {
    id: "nat-coombs",
    title: "The Nat Coombs Show",
    blurb:
      "The UK’s most familiar NFL voice. British accent, year-round, and written for people who did not grow up with Friday-night lights.",
    kind: "independent",
    links: [
      { label: "Website", href: "https://thencshow.co.uk/" },
      { label: "Apple", href: "https://podcasts.apple.com/gb/podcast/the-nat-coombs-nfl-show/id1478338224" },
      { label: "YouTube", href: "https://www.youtube.com/@TheNCShow" },
    ],
  },
  {
    id: "rookie-playbook",
    title: "The Rookie Playbook",
    blurb:
      "A UK beginner show that will pause to explain a nickel back. Good if the jargon still feels like a second language.",
    kind: "independent",
    links: [{ label: "Website", href: "https://rookieplaybook.co.uk/" }],
  },
  {
    id: "athletic-football-show",
    title: "The Athletic Football Show",
    blurb:
      "Serious NFL reporting from The Athletic — scheme, roster building, the draft. US-hosted; still one of the clearest league pods.",
    kind: "independent",
    links: [
      {
        label: "Apple",
        href: "https://podcasts.apple.com/gb/podcast/the-athletic-football-show-a-show-about-the-nfl/id1528622068",
      },
      { label: "Spotify", href: "https://open.spotify.com/show/24OG6Hat6fGkArLPCTfyWP" },
    ],
  },
  {
    id: "heed-the-call",
    title: "Heed the Call",
    blurb:
      "Dan Hanzus and Marc Sessler, the old Around the NFL pairing, now independent. News, jokes, and a weekly map of the league.",
    kind: "independent",
    links: [
      { label: "Website", href: "https://heedthecallpodcast.com/" },
      {
        label: "Apple",
        href: "https://podcasts.apple.com/gb/podcast/heed-the-call-nfl-podcast-with-dan-hanzus-marc-sessler/id1761190671",
      },
      { label: "YouTube", href: "https://www.youtube.com/@heedthecallpod" },
    ],
  },
  {
    id: "nfl-daily",
    title: "NFL Daily with Gregg Rosenthal",
    blurb:
      "Official NFL Media weekday catch-up. Fast, newsy, and a useful second listen once a UK show has explained the basics.",
    kind: "official",
    links: [
      { label: "Website", href: "https://www.nfl.com/podcasts/" },
      {
        label: "Apple",
        href: "https://podcasts.apple.com/gb/podcast/nfl-daily-with-gregg-rosenthal/id680904259",
      },
      { label: "Spotify", href: "https://open.spotify.com/show/659pdH7WFYgHMUuyg2MTBe" },
    ],
  },
  {
    id: "locked-on-nfl",
    title: "Locked On NFL",
    blurb:
      "Daily league show from the same independent network that makes a pod for every club. Short, newsy, not official NFL audio.",
    kind: "independent",
    links: [
      { label: "Website", href: "https://lockedonpodcasts.com/podcasts/locked-on-nfl/" },
      { label: "Apple", href: "https://podcasts.apple.com/us/podcast/id1139967050" },
    ],
  },
];

const lockedOnSlug: Record<string, { path: string; name: string }> = {
  "arizona-cardinals": { path: "locked-on-cardinals", name: "Cardinals" },
  "atlanta-falcons": { path: "locked-on-falcons", name: "Falcons" },
  "baltimore-ravens": { path: "locked-on-ravens", name: "Ravens" },
  "buffalo-bills": { path: "locked-on-bills", name: "Bills" },
  "carolina-panthers": { path: "locked-on-carolina-panthers", name: "Panthers" },
  "chicago-bears": { path: "locked-on-bears", name: "Bears" },
  "cincinnati-bengals": { path: "locked-on-bengals", name: "Bengals" },
  "cleveland-browns": { path: "locked-on-browns", name: "Browns" },
  "dallas-cowboys": { path: "locked-on-cowboys", name: "Cowboys" },
  "denver-broncos": { path: "locked-on-broncos", name: "Broncos" },
  "detroit-lions": { path: "locked-on-lions", name: "Lions" },
  "green-bay-packers": { path: "locked-on-packers", name: "Packers" },
  "houston-texans": { path: "locked-on-texans", name: "Texans" },
  "indianapolis-colts": { path: "locked-on-colts", name: "Colts" },
  "jacksonville-jaguars": { path: "locked-on-jaguars", name: "Jaguars" },
  "kansas-city-chiefs": { path: "locked-on-chiefs", name: "Chiefs" },
  "las-vegas-raiders": { path: "locked-on-raiders", name: "Raiders" },
  "los-angeles-chargers": { path: "locked-on-chargers", name: "Chargers" },
  "los-angeles-rams": { path: "locked-on-rams", name: "Rams" },
  "miami-dolphins": { path: "locked-on-dolphins", name: "Dolphins" },
  "minnesota-vikings": { path: "locked-on-vikings", name: "Vikings" },
  "new-england-patriots": { path: "locked-on-patriots", name: "Patriots" },
  "new-orleans-saints": { path: "locked-on-saints", name: "Saints" },
  "new-york-giants": { path: "locked-on-new-york-giants", name: "Giants" },
  "new-york-jets": { path: "locked-on-new-york-jets", name: "Jets" },
  "philadelphia-eagles": { path: "locked-on-eagles", name: "Eagles" },
  "pittsburgh-steelers": { path: "locked-on-steelers", name: "Steelers" },
  "san-francisco-49ers": { path: "locked-on-49ers", name: "49ers" },
  "seattle-seahawks": { path: "locked-on-seahawks", name: "Seahawks" },
  "tampa-bay-buccaneers": { path: "locked-on-bucs", name: "Bucs" },
  "tennessee-titans": { path: "locked-on-titans", name: "Titans" },
  "washington-commanders": { path: "locked-on-commanders", name: "Commanders" },
};

function lockedOnPodcast(teamSlug: string): Podcast | null {
  const entry = lockedOnSlug[teamSlug];
  if (!entry) return null;
  return {
    id: `locked-on-${teamSlug}`,
    title: `Locked On ${entry.name}`,
    blurb:
      "Independent daily show from the Locked On network — local beat talk, not the club’s official audio. About 25 minutes; good once you have picked a side.",
    kind: "independent",
    teamSlug,
    links: [{ label: "Website", href: `https://lockedonpodcasts.com/podcasts/${entry.path}/` }],
  };
}

/** Extra team shows we could verify. We do not invent official club podcasts. */
const extraTeamPodcasts: Podcast[] = [
  {
    id: "packers-unscripted",
    title: "Packers Unscripted",
    blurb: "The club’s own long-running audio show — pressers, roster talk, from packers.com.",
    kind: "official",
    teamSlug: "green-bay-packers",
    links: [{ label: "Website", href: "https://www.packers.com/audio/packers-unscripted" }],
  },
  {
    id: "patriots-unfiltered",
    title: "Patriots Unfiltered",
    blurb: "The club’s official daily-style show from patriots.com — roster talk and presser reaction.",
    kind: "official",
    teamSlug: "new-england-patriots",
    links: [{ label: "Website", href: "https://www.patriots.com/audio/" }],
  },
  {
    id: "chargers-weekly",
    title: "Chargers Weekly",
    blurb: "Official Chargers podcast network flagship — guests from the radio booth and the beat.",
    kind: "official",
    teamSlug: "los-angeles-chargers",
    links: [{ label: "Website", href: "https://www.chargers.com/audio/" }],
  },
  {
    id: "the-saloon",
    title: "The Saloon",
    blurb: "Official 49ers camp and roster show, hosted from 49ers.com audio.",
    kind: "official",
    teamSlug: "san-francisco-49ers",
    links: [{ label: "Website", href: "https://www.49ers.com/audio/" }],
  },
  {
    id: "hawk-talk",
    title: "Hawk Talk",
    blurb: "Official Seahawks preview and recap show with Michael Bumpus, on seahawks.com.",
    kind: "official",
    teamSlug: "seattle-seahawks",
    links: [{ label: "Website", href: "https://www.seahawks.com/audio/" }],
  },
  {
    id: "arrowhead-pride",
    title: "Arrowhead Pride",
    blurb: "Well-known Kansas City beat site and podcast. Fan / SB Nation, not Chiefs official.",
    kind: "fan",
    teamSlug: "kansas-city-chiefs",
    links: [{ label: "Website", href: "https://www.arrowheadpride.com/" }],
  },
];

export function podcastsForTeam(slug: string): Podcast[] {
  const locked = lockedOnPodcast(slug);
  const extras = extraTeamPodcasts.filter((show) => show.teamSlug === slug);
  return [...(locked ? [locked] : []), ...extras];
}

export function allTeamPodcasts(): { slug: string; shows: Podcast[] }[] {
  return Object.keys(lockedOnSlug).map((slug) => ({
    slug,
    shows: podcastsForTeam(slug),
  }));
}
