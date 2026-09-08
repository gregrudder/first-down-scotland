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
  artworkUrl?: string;
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
    artworkUrl:
      "https://is1-ssl.mzstatic.com/image/thumb/Podcasts221/v4/ec/b9/2b/ecb92b64-818a-f036-7357-15621d12b50c/mza_16073576748959707763.jpg/600x600bb.jpg",
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
    artworkUrl:
      "https://rookieplaybook.co.uk/wp-content/uploads/2020/02/cropped-RPB-Logo-New-e1582375854775.png",
    links: [{ label: "Website", href: "https://rookieplaybook.co.uk/" }],
  },
  {
    id: "athletic-football-show",
    title: "The Athletic Football Show",
    blurb:
      "Serious NFL reporting from The Athletic — scheme, roster building, the draft. US-hosted; still one of the clearest league pods.",
    kind: "independent",
    artworkUrl:
      "https://is1-ssl.mzstatic.com/image/thumb/Podcasts211/v4/ea/63/c8/ea63c86c-3dbe-d92a-ce16-b602d4abf094/mza_10236654564714042422.jpeg/600x600bb.jpg",
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
    artworkUrl:
      "https://is1-ssl.mzstatic.com/image/thumb/Podcasts211/v4/30/fd/5b/30fd5bf7-5b7e-5a3b-bfb6-199ac82ae568/mza_2301285023500055218.jpg/600x600bb.jpg",
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
    artworkUrl:
      "https://is1-ssl.mzstatic.com/image/thumb/Podcasts211/v4/e4/4e/d6/e44ed62e-77b5-39ef-7b90-e565565f6c99/mza_7522118139460873751.jpg/600x600bb.jpg",
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
    artworkUrl:
      "https://is1-ssl.mzstatic.com/image/thumb/Podcasts112/v4/01/40/2c/01402cd3-e2e8-23af-d158-6fb78e07744a/mza_15840960386776504347.jpg/600x600bb.jpg",
    links: [
      { label: "Website", href: "https://lockedonpodcasts.com/podcasts/locked-on-nfl/" },
      { label: "Apple", href: "https://podcasts.apple.com/gb/podcast/locked-on-nfl-daily-podcast-on-the-national-football-league/id1139967050" },
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

/** Apple Podcasts artwork (mzstatic) looked up from the matching Locked On show. */
const lockedOnArtwork: Record<string, string> = {
  "arizona-cardinals":
    "https://is1-ssl.mzstatic.com/image/thumb/Podcasts112/v4/bc/53/19/bc5319d3-6e40-d59f-a8d4-4c37ed93cc19/mza_5862787992261331334.jpg/600x600bb.jpg",
  "atlanta-falcons":
    "https://is1-ssl.mzstatic.com/image/thumb/Podcasts122/v4/89/e3/e9/89e3e98b-d74f-56f8-4519-32b82965fc67/mza_17207893521795438404.jpg/600x600bb.jpg",
  "baltimore-ravens":
    "https://is1-ssl.mzstatic.com/image/thumb/Podcasts122/v4/12/a9/9d/12a99d1f-a140-b524-a32e-dcc77218e3db/mza_15888047331768927222.jpg/600x600bb.jpg",
  "buffalo-bills":
    "https://is1-ssl.mzstatic.com/image/thumb/Podcasts122/v4/ee/d8/fb/eed8fb20-1eee-5056-153d-5e961a648130/mza_2064787666452726245.jpg/600x600bb.jpg",
  "carolina-panthers":
    "https://is1-ssl.mzstatic.com/image/thumb/Podcasts122/v4/1d/a1/17/1da1178e-87ed-440c-a844-2a2471ca7a8f/mza_4393349406579144163.jpg/600x600bb.jpg",
  "chicago-bears":
    "https://is1-ssl.mzstatic.com/image/thumb/Podcasts112/v4/e9/58/f1/e958f1ce-be6b-c29a-d3ea-8feda1038f15/mza_11238209768261625952.jpg/600x600bb.jpg",
  "cincinnati-bengals":
    "https://is1-ssl.mzstatic.com/image/thumb/Podcasts112/v4/30/98/44/30984476-26de-250d-e8e5-f590b3ced6cc/mza_1075762000797244198.jpg/600x600bb.jpg",
  "cleveland-browns":
    "https://is1-ssl.mzstatic.com/image/thumb/Podcasts122/v4/10/6d/43/106d43ad-fd8c-6e60-5dda-6fe02d487ee8/mza_12975464127955923763.jpg/600x600bb.jpg",
  "dallas-cowboys":
    "https://is1-ssl.mzstatic.com/image/thumb/Podcasts112/v4/8a/b2/65/8ab2655d-bb8d-f9aa-3e51-32812fe16309/mza_3488372169603760881.jpg/600x600bb.jpg",
  "denver-broncos":
    "https://is1-ssl.mzstatic.com/image/thumb/Podcasts122/v4/79/c8/2a/79c82a59-65db-3f20-f197-bacc26af9bc4/mza_18208119125329315693.jpg/600x600bb.jpg",
  "detroit-lions":
    "https://is1-ssl.mzstatic.com/image/thumb/Podcasts112/v4/6e/cf/76/6ecf76dc-5c50-d1f5-6522-c0beee7beb93/mza_10179336279226318045.jpg/600x600bb.jpg",
  "green-bay-packers":
    "https://is1-ssl.mzstatic.com/image/thumb/Podcasts122/v4/1a/71/40/1a7140e3-4b25-6f5a-e268-1bf9d6ddf1dc/mza_17077657665650405822.jpg/600x600bb.jpg",
  "houston-texans":
    "https://is1-ssl.mzstatic.com/image/thumb/Podcasts122/v4/47/cd/4d/47cd4d70-5c8e-c680-384a-115d15c5cefe/mza_2655695750801309032.jpg/600x600bb.jpg",
  "indianapolis-colts":
    "https://is1-ssl.mzstatic.com/image/thumb/Podcasts122/v4/8b/44/c5/8b44c51a-396c-664f-d3bb-1e3b7f231b29/mza_17349827388397837920.jpg/600x600bb.jpg",
  "jacksonville-jaguars":
    "https://is1-ssl.mzstatic.com/image/thumb/Podcasts112/v4/97/d5/52/97d5520e-dd87-b790-97d5-ba8cb332beda/mza_2880168282870913865.jpg/600x600bb.jpg",
  "kansas-city-chiefs":
    "https://is1-ssl.mzstatic.com/image/thumb/Podcasts112/v4/a7/ed/b1/a7edb17b-43f5-bc95-e1b0-0ef00b328dd3/mza_13257794304381185548.jpg/600x600bb.jpg",
  "las-vegas-raiders":
    "https://is1-ssl.mzstatic.com/image/thumb/Podcasts122/v4/23/ca/cc/23cacc10-b6b1-3d4a-07f4-d56332bfc8a6/mza_11375532871087976353.jpg/600x600bb.jpg",
  "los-angeles-chargers":
    "https://is1-ssl.mzstatic.com/image/thumb/Podcasts112/v4/4e/af/f6/4eaff656-8e7d-e737-b547-6a5ac414d552/mza_12149479948034064833.jpg/600x600bb.jpg",
  "los-angeles-rams":
    "https://is1-ssl.mzstatic.com/image/thumb/Podcasts122/v4/00/88/8e/00888e5c-287d-7f27-2cd9-fa530f2d5981/mza_5396726408017298124.jpg/600x600bb.jpg",
  "miami-dolphins":
    "https://is1-ssl.mzstatic.com/image/thumb/Podcasts122/v4/3e/e3/5f/3ee35fd4-8956-1287-4cfd-52828af0a712/mza_11136962253020114605.jpg/600x600bb.jpg",
  "minnesota-vikings":
    "https://is1-ssl.mzstatic.com/image/thumb/Podcasts122/v4/6b/65/e2/6b65e217-f91c-3e43-ee53-838e9671bf96/mza_7582794120859410566.jpg/600x600bb.jpg",
  "new-england-patriots":
    "https://is1-ssl.mzstatic.com/image/thumb/Podcasts112/v4/54/72/a1/5472a1aa-a46f-2c70-0d72-3044482eaccd/mza_5379826296413758334.jpg/600x600bb.jpg",
  "new-orleans-saints":
    "https://is1-ssl.mzstatic.com/image/thumb/Podcasts112/v4/e2/d8/d8/e2d8d8b9-642e-7108-c0fe-e8e970baf5c5/mza_11287861227660812670.jpg/600x600bb.jpg",
  "new-york-giants":
    "https://is1-ssl.mzstatic.com/image/thumb/Podcasts122/v4/2e/97/87/2e97877c-66c4-c41b-5f57-edbfb57d4a77/mza_8472364093903252910.jpg/600x600bb.jpg",
  "new-york-jets":
    "https://is1-ssl.mzstatic.com/image/thumb/Podcasts112/v4/d9/19/bf/d919bf93-e799-c221-a67c-df0bd0d0ca1f/mza_1440374589601243224.jpg/600x600bb.jpg",
  "philadelphia-eagles":
    "https://is1-ssl.mzstatic.com/image/thumb/Podcasts112/v4/64/04/19/6404194c-be67-0203-6304-601e858fe6c3/mza_13968169527345820808.jpg/600x600bb.jpg",
  "pittsburgh-steelers":
    "https://is1-ssl.mzstatic.com/image/thumb/Podcasts112/v4/cc/b2/4c/ccb24c5f-7d57-d782-12b3-b4de95266b7d/mza_4050704953803715613.jpg/600x600bb.jpg",
  "san-francisco-49ers":
    "https://is1-ssl.mzstatic.com/image/thumb/Podcasts112/v4/0e/d3/6a/0ed36ab0-6611-777b-a25c-aec6a6cb8d9f/mza_1800402099958304952.jpg/600x600bb.jpg",
  "seattle-seahawks":
    "https://is1-ssl.mzstatic.com/image/thumb/Podcasts122/v4/43/48/f6/4348f69e-61d6-8ec2-80f2-e2b090d17789/mza_8715708506004177568.jpg/600x600bb.jpg",
  "tampa-bay-buccaneers":
    "https://is1-ssl.mzstatic.com/image/thumb/Podcasts112/v4/f1/72/35/f17235e3-fa66-7d24-0928-a06495efadde/mza_2805909275589411514.jpg/600x600bb.jpg",
  "tennessee-titans":
    "https://is1-ssl.mzstatic.com/image/thumb/Podcasts112/v4/8c/91/27/8c9127c3-ca5f-fd93-3b72-ac3f73469094/mza_2640564769394756855.jpg/600x600bb.jpg",
  "washington-commanders":
    "https://is1-ssl.mzstatic.com/image/thumb/Podcasts112/v4/50/6f/a7/506fa798-360b-5250-e673-7b49c768b829/mza_14223364697315557013.jpg/600x600bb.jpg",
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
    artworkUrl: lockedOnArtwork[teamSlug],
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
    artworkUrl:
      "https://is1-ssl.mzstatic.com/image/thumb/Podcasts112/v4/4d/12/9e/4d129ef3-e7cd-890c-ff4d-a14f1c912676/mza_15364112328119008883.jpg/600x600bb.jpg",
    links: [{ label: "Website", href: "https://www.packers.com/audio/packers-unscripted" }],
  },
  {
    id: "patriots-unfiltered",
    title: "Patriots Unfiltered",
    blurb: "The club’s official daily-style show from patriots.com — roster talk and presser reaction.",
    kind: "official",
    teamSlug: "new-england-patriots",
    artworkUrl:
      "https://is1-ssl.mzstatic.com/image/thumb/Podcasts211/v4/05/dc/f7/05dcf76f-0d78-4aa9-5949-488b1c2754e9/mza_11752285431019223546.jpg/600x600bb.jpg",
    links: [{ label: "Website", href: "https://www.patriots.com/audio/" }],
  },
  {
    id: "chargers-weekly",
    title: "Chargers Weekly",
    blurb: "Official Chargers podcast network flagship — guests from the radio booth and the beat.",
    kind: "official",
    teamSlug: "los-angeles-chargers",
    artworkUrl:
      "https://is1-ssl.mzstatic.com/image/thumb/Podcasts112/v4/8f/63/84/8f638416-31bd-fdad-5c76-659fc018c6ff/mza_1808720452877834985.jpg/600x600bb.jpg",
    links: [{ label: "Website", href: "https://www.chargers.com/audio/" }],
  },
  {
    id: "the-saloon",
    title: "The Saloon",
    blurb: "Official 49ers camp and roster show, hosted from 49ers.com audio.",
    kind: "official",
    teamSlug: "san-francisco-49ers",
    artworkUrl:
      "https://is1-ssl.mzstatic.com/image/thumb/Podcasts211/v4/41/cf/62/41cf629b-3810-82f8-16d5-18789c3a843f/mza_7450288911796877869.jpg/600x600bb.jpg",
    links: [{ label: "Website", href: "https://www.49ers.com/audio/" }],
  },
  {
    id: "hawk-talk",
    title: "Hawk Talk",
    blurb: "Official Seahawks preview and recap show with Michael Bumpus, on seahawks.com.",
    kind: "official",
    teamSlug: "seattle-seahawks",
    artworkUrl:
      "https://is1-ssl.mzstatic.com/image/thumb/Podcasts122/v4/54/3a/16/543a16a1-6e0f-183c-5179-fd7a6e91892b/mza_16498595738208658200.jpg/600x600bb.jpg",
    links: [{ label: "Website", href: "https://www.seahawks.com/audio/" }],
  },
  {
    id: "arrowhead-pride",
    title: "Arrowhead Pride",
    blurb: "Well-known Kansas City beat site and podcast. Fan / SB Nation, not Chiefs official.",
    kind: "fan",
    teamSlug: "kansas-city-chiefs",
    artworkUrl:
      "https://is1-ssl.mzstatic.com/image/thumb/Podcasts221/v4/54/1e/b0/541eb0e3-a7db-7461-6893-f6070842bae6/mza_17663850223678350551.jpeg/600x600bb.jpg",
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
