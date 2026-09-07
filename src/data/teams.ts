export type TeamTag =
  | "glory"
  | "underdog"
  | "colourful"
  | "classic"
  | "cold"
  | "warm"
  | "late-night"
  | "civilised"
  | "city"
  | "small-town"
  | "offence"
  | "defence"
  | "history"
  | "new-energy"
  | "bird"
  | "cat"
  | "water"
  | "scotland";

export type NflTeam = {
  abbreviation: string;
  name: string;
  shortName: string;
  city: string;
  conference: "AFC" | "NFC";
  primary: string;
  secondary: string;
  tags: TeamTag[];
  oneLiner: string;
};

export function espnTeamLogo(abbreviation: string): string {
  return `https://a.espncdn.com/i/teamlogos/nfl/500/${abbreviation.toLowerCase()}.png`;
}

export const teams: NflTeam[] = [
  {
    abbreviation: "ARI",
    name: "Arizona Cardinals",
    shortName: "Cardinals",
    city: "Phoenix",
    conference: "NFC",
    primary: "#97233F",
    secondary: "#FFB612",
    tags: ["warm", "bird", "underdog", "late-night", "colourful"],
    oneLiner: "Red, desert sun, and a bird that has been around longer than most clubs.",
  },
  {
    abbreviation: "ATL",
    name: "Atlanta Falcons",
    shortName: "Falcons",
    city: "Atlanta",
    conference: "NFC",
    primary: "#A71930",
    secondary: "#000000",
    tags: ["city", "bird", "warm", "offence"],
    oneLiner: "A big southern city and a falcon on the helmet. Easy to explain in the pub.",
  },
  {
    abbreviation: "BAL",
    name: "Baltimore Ravens",
    shortName: "Ravens",
    city: "Baltimore",
    conference: "AFC",
    primary: "#241773",
    secondary: "#9E7C0C",
    tags: ["defence", "bird", "glory", "civilised", "city"],
    oneLiner: "Purple, mean defence, and a literary bird. Very on-brand for a bookish UK fan.",
  },
  {
    abbreviation: "BUF",
    name: "Buffalo Bills",
    shortName: "Bills",
    city: "Buffalo",
    conference: "AFC",
    primary: "#00338D",
    secondary: "#C60C30",
    tags: ["cold", "civilised", "offence", "small-town", "underdog"],
    oneLiner: "Snow, table-breaking joy, and tea-time kick-offs. A very British kind of chaos.",
  },
  {
    abbreviation: "CAR",
    name: "Carolina Panthers",
    shortName: "Panthers",
    city: "Charlotte",
    conference: "NFC",
    primary: "#0085CA",
    secondary: "#101820",
    tags: ["cat", "underdog", "warm", "colourful"],
    oneLiner: "Electric blue and a big cat. Quietly stylish, rarely the favourite.",
  },
  {
    abbreviation: "CHI",
    name: "Chicago Bears",
    shortName: "Bears",
    city: "Chicago",
    conference: "NFC",
    primary: "#0B162A",
    secondary: "#C83803",
    tags: ["cold", "classic", "city", "history", "defence"],
    oneLiner: "Navy, orange, and a city that understands winter. Proper old-club energy.",
  },
  {
    abbreviation: "CIN",
    name: "Cincinnati Bengals",
    shortName: "Bengals",
    city: "Cincinnati",
    conference: "AFC",
    primary: "#FB4F14",
    secondary: "#000000",
    tags: ["cat", "colourful", "offence", "civilised"],
    oneLiner: "Tiger stripes and late-game drama. You will never lose them in a crowd.",
  },
  {
    abbreviation: "CLE",
    name: "Cleveland Browns",
    shortName: "Browns",
    city: "Cleveland",
    conference: "AFC",
    primary: "#311D00",
    secondary: "#FF3C00",
    tags: ["underdog", "cold", "classic", "civilised"],
    oneLiner: "No logo on the helmet, just grit. The ultimate “we’ve been through it” pick.",
  },
  {
    abbreviation: "DAL",
    name: "Dallas Cowboys",
    shortName: "Cowboys",
    city: "Dallas",
    conference: "NFC",
    primary: "#041E42",
    secondary: "#869397",
    tags: ["glory", "history", "city", "classic"],
    oneLiner: "Silver star, huge stadium, and everyone has an opinion. Instant recognition.",
  },
  {
    abbreviation: "DEN",
    name: "Denver Broncos",
    shortName: "Broncos",
    city: "Denver",
    conference: "AFC",
    primary: "#FB4F14",
    secondary: "#002244",
    tags: ["late-night", "cold", "history", "city"],
    oneLiner: "Orange crush at altitude. Kick-offs will test your kettle discipline.",
  },
  {
    abbreviation: "DET",
    name: "Detroit Lions",
    shortName: "Lions",
    city: "Detroit",
    conference: "NFC",
    primary: "#0076B6",
    secondary: "#B0B7BC",
    tags: ["underdog", "cat", "new-energy", "cold", "city"],
    oneLiner: "Decades of pain, then a roar. Honolulu blue is having a moment.",
  },
  {
    abbreviation: "GB",
    name: "Green Bay Packers",
    shortName: "Packers",
    city: "Green Bay",
    conference: "NFC",
    primary: "#203731",
    secondary: "#FFB612",
    tags: ["cold", "history", "small-town", "glory", "scotland"],
    oneLiner: "Frozen grass, a town the size of Perth, and the most famous green in the sport.",
  },
  {
    abbreviation: "HOU",
    name: "Houston Texans",
    shortName: "Texans",
    city: "Houston",
    conference: "AFC",
    primary: "#03202F",
    secondary: "#A71930",
    tags: ["warm", "city", "new-energy"],
    oneLiner: "Deep steel blue in a huge warm city. A modern club still writing its story.",
  },
  {
    abbreviation: "IND",
    name: "Indianapolis Colts",
    shortName: "Colts",
    city: "Indianapolis",
    conference: "AFC",
    primary: "#002C5F",
    secondary: "#A2AAAD",
    tags: ["civilised", "classic", "city"],
    oneLiner: "Royal blue horseshoes. Clean, tidy, and usually on at a human hour.",
  },
  {
    abbreviation: "JAX",
    name: "Jacksonville Jaguars",
    shortName: "Jaguars",
    city: "Jacksonville",
    conference: "AFC",
    primary: "#006778",
    secondary: "#D7A22A",
    tags: ["cat", "warm", "underdog", "small-town"],
    oneLiner: "Teal jaguar, Florida heat, and a club that always feels a bit left-field.",
  },
  {
    abbreviation: "KC",
    name: "Kansas City Chiefs",
    shortName: "Chiefs",
    city: "Kansas City",
    conference: "AFC",
    primary: "#E31837",
    secondary: "#FFB81C",
    tags: ["glory", "offence", "small-town", "civilised"],
    oneLiner: "Red, gold, and the current kings of the highlight reel.",
  },
  {
    abbreviation: "LV",
    name: "Las Vegas Raiders",
    shortName: "Raiders",
    city: "Las Vegas",
    conference: "AFC",
    primary: "#000000",
    secondary: "#A5ACAF",
    tags: ["classic", "late-night", "city", "underdog"],
    oneLiner: "Black and silver. Always the coolest kit in the room, whatever the score.",
  },
  {
    abbreviation: "LAC",
    name: "Los Angeles Chargers",
    shortName: "Chargers",
    city: "Los Angeles",
    conference: "AFC",
    primary: "#0080C6",
    secondary: "#FFC20E",
    tags: ["colourful", "warm", "late-night", "city"],
    oneLiner: "Powder blue lightning. Beautiful shirts, uncivilised kick-off times.",
  },
  {
    abbreviation: "LAR",
    name: "Los Angeles Rams",
    shortName: "Rams",
    city: "Los Angeles",
    conference: "NFC",
    primary: "#003594",
    secondary: "#FFA300",
    tags: ["city", "late-night", "glory", "warm"],
    oneLiner: "Royal blue and a horn on the helmet. Hollywood, but with pads.",
  },
  {
    abbreviation: "MIA",
    name: "Miami Dolphins",
    shortName: "Dolphins",
    city: "Miami",
    conference: "AFC",
    primary: "#008E97",
    secondary: "#FC4C02",
    tags: ["colourful", "warm", "water", "civilised", "offence"],
    oneLiner: "Aqua and sunshine. The kit alone will get you through a grey Glasgow week.",
  },
  {
    abbreviation: "MIN",
    name: "Minnesota Vikings",
    shortName: "Vikings",
    city: "Minneapolis",
    conference: "NFC",
    primary: "#4F2683",
    secondary: "#FFC62F",
    tags: ["cold", "colourful", "scotland", "city"],
    oneLiner: "Purple, horns, and weather that will make you feel at home.",
  },
  {
    abbreviation: "NE",
    name: "New England Patriots",
    shortName: "Patriots",
    city: "Foxborough",
    conference: "AFC",
    primary: "#002244",
    secondary: "#C60C30",
    tags: ["glory", "history", "civilised", "classic"],
    oneLiner: "Navy, a flying Elvis, and two decades of winning that still annoys people.",
  },
  {
    abbreviation: "NO",
    name: "New Orleans Saints",
    shortName: "Saints",
    city: "New Orleans",
    conference: "NFC",
    primary: "#D3BC8D",
    secondary: "#101820",
    tags: ["warm", "city", "history", "colourful"],
    oneLiner: "Gold fleur-de-lis and a city that knows how to throw a party.",
  },
  {
    abbreviation: "NYG",
    name: "New York Giants",
    shortName: "Giants",
    city: "New York",
    conference: "NFC",
    primary: "#0B2265",
    secondary: "#A71930",
    tags: ["city", "history", "classic", "civilised"],
    oneLiner: "Big-city classic. The royal blue you already know from the old Super Bowl clips.",
  },
  {
    abbreviation: "NYJ",
    name: "New York Jets",
    shortName: "Jets",
    city: "New York",
    conference: "AFC",
    primary: "#125740",
    secondary: "#000000",
    tags: ["city", "underdog", "civilised", "water"],
    oneLiner: "Gotham green and a long wait for glory. Banter comes included.",
  },
  {
    abbreviation: "PHI",
    name: "Philadelphia Eagles",
    shortName: "Eagles",
    city: "Philadelphia",
    conference: "NFC",
    primary: "#004C54",
    secondary: "#A5ACAF",
    tags: ["city", "bird", "new-energy", "defence", "civilised"],
    oneLiner: "Midnight green and a famously loyal crowd. They will adopt you if you adopt them.",
  },
  {
    abbreviation: "PIT",
    name: "Pittsburgh Steelers",
    shortName: "Steelers",
    city: "Pittsburgh",
    conference: "AFC",
    primary: "#FFB612",
    secondary: "#101820",
    tags: ["defence", "history", "classic", "glory", "scotland"],
    oneLiner: "Black and gold in a steel town. If you grew up near a shipyard, this will click.",
  },
  {
    abbreviation: "SEA",
    name: "Seattle Seahawks",
    shortName: "Seahawks",
    city: "Seattle",
    conference: "NFC",
    primary: "#002244",
    secondary: "#69BE28",
    tags: ["late-night", "bird", "colourful", "water", "scotland"],
    oneLiner: "Rain, navy, and that wild neon green. The most Pacific-Northwest, almost-Scottish pick.",
  },
  {
    abbreviation: "SF",
    name: "San Francisco 49ers",
    shortName: "49ers",
    city: "Santa Clara",
    conference: "NFC",
    primary: "#AA0000",
    secondary: "#B3995D",
    tags: ["late-night", "glory", "history", "city"],
    oneLiner: "Gold and scarlet from the Bay. Beautiful kit; your sleep schedule will suffer.",
  },
  {
    abbreviation: "TB",
    name: "Tampa Bay Buccaneers",
    shortName: "Buccaneers",
    city: "Tampa",
    conference: "NFC",
    primary: "#D50A0A",
    secondary: "#FF7900",
    tags: ["warm", "colourful", "water", "glory"],
    oneLiner: "Pewter, red, and a pirate flag. Sunshine football with a wink.",
  },
  {
    abbreviation: "TEN",
    name: "Tennessee Titans",
    shortName: "Titans",
    city: "Nashville",
    conference: "AFC",
    primary: "#0C2340",
    secondary: "#4B92DB",
    tags: ["underdog", "civilised", "small-town"],
    oneLiner: "Sword-swinging logo and a quieter Sunday. A solid “I just picked a side” club.",
  },
  {
    abbreviation: "WSH",
    name: "Washington Commanders",
    shortName: "Commanders",
    city: "Washington",
    conference: "NFC",
    primary: "#5A1414",
    secondary: "#FFB612",
    tags: ["city", "civilised", "underdog", "classic"],
    oneLiner: "Burgundy and gold in the capital. A club still introducing itself, which is fine.",
  },
];

const TEAM_PROFILE_SLUGS: Record<string, string> = {
  ARI: "arizona-cardinals",
  ATL: "atlanta-falcons",
  BAL: "baltimore-ravens",
  BUF: "buffalo-bills",
  CAR: "carolina-panthers",
  CHI: "chicago-bears",
  CIN: "cincinnati-bengals",
  CLE: "cleveland-browns",
  DAL: "dallas-cowboys",
  DEN: "denver-broncos",
  DET: "detroit-lions",
  GB: "green-bay-packers",
  HOU: "houston-texans",
  IND: "indianapolis-colts",
  JAX: "jacksonville-jaguars",
  KC: "kansas-city-chiefs",
  LV: "las-vegas-raiders",
  LAC: "los-angeles-chargers",
  LAR: "los-angeles-rams",
  MIA: "miami-dolphins",
  MIN: "minnesota-vikings",
  NE: "new-england-patriots",
  NO: "new-orleans-saints",
  NYG: "new-york-giants",
  NYJ: "new-york-jets",
  PHI: "philadelphia-eagles",
  PIT: "pittsburgh-steelers",
  SEA: "seattle-seahawks",
  SF: "san-francisco-49ers",
  TB: "tampa-bay-buccaneers",
  TEN: "tennessee-titans",
  WSH: "washington-commanders",
};

export function getTeam(abbreviation: string): NflTeam | undefined {
  return teams.find(
    (team) => team.abbreviation.toLowerCase() === abbreviation.toLowerCase(),
  );
}

export function teamProfilePath(abbreviation: string): string {
  const slug = TEAM_PROFILE_SLUGS[abbreviation.toUpperCase()];
  return slug ? `/teams/${slug}` : "/teams";
}

export function randomTeam(except?: string): NflTeam {
  const pool = except
    ? teams.filter((team) => team.abbreviation !== except)
    : teams;
  return pool[Math.floor(Math.random() * pool.length)] ?? teams[0]!;
}
