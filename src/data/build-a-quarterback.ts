import type { BuildMiniGame } from "@/data/mini-game-types";

/**
 * Pool for Build a Quarterback.
 * Trait numbers are editorial game ratings, not official stats.
 * A `fact` is a career note we can stand behind. If it is missing, we left it out.
 */

export const TRAIT_IDS = [
  "arm",
  "accuracy",
  "pocket",
  "mobility",
  "iq",
  "clutch",
  "durability",
  "leadership",
] as const;

export type TraitId = (typeof TRAIT_IDS)[number];

export type TraitRatings = Record<TraitId, number>;

export type TraitSlot = {
  id: TraitId;
  label: string;
  blurb: string;
};

export const TRAITS: readonly TraitSlot[] = [
  {
    id: "arm",
    label: "Arm strength",
    blurb: "How hard and how far the ball can go.",
  },
  {
    id: "accuracy",
    label: "Accuracy",
    blurb: "Whether it arrives where the hands are.",
  },
  {
    id: "pocket",
    label: "Pocket presence",
    blurb: "The calm to slide and still throw as the rush arrives.",
  },
  {
    id: "mobility",
    label: "Mobility",
    blurb: "The scramble that keeps a drive alive.",
  },
  {
    id: "iq",
    label: "Football IQ",
    blurb: "Reading the defence before the snap, and again after it.",
  },
  {
    id: "clutch",
    label: "Clutch",
    blurb: "The late drive, when the pub has gone quiet.",
  },
  {
    id: "durability",
    label: "Durability",
    blurb: "Still the starter when December comes.",
  },
  {
    id: "leadership",
    label: "Leadership",
    blurb: "The part of the job you cannot draw on a whiteboard.",
  },
];

export type Quarterback = {
  id: string;
  name: string;
  knownFor: string;
  fact?: string;
  ratings: TraitRatings;
};

function ratings(
  arm: number,
  accuracy: number,
  pocket: number,
  mobility: number,
  iq: number,
  clutch: number,
  durability: number,
  leadership: number,
): TraitRatings {
  return { arm, accuracy, pocket, mobility, iq, clutch, durability, leadership };
}

export const quarterbacks: readonly Quarterback[] = [
  {
    id: "patrick-mahomes",
    name: "Patrick Mahomes",
    knownFor: "Kansas City Chiefs",
    fact: "Three Super Bowl wins with Kansas City: LIV, LVII and LVIII.",
    ratings: ratings(96, 94, 97, 90, 98, 99, 88, 96),
  },
  {
    id: "tom-brady",
    name: "Tom Brady",
    knownFor: "New England, then Tampa Bay",
    fact: "Seven Super Bowl wins: six with New England and one with Tampa Bay.",
    ratings: ratings(86, 94, 99, 62, 99, 99, 97, 99),
  },
  {
    id: "joe-montana",
    name: "Joe Montana",
    knownFor: "San Francisco 49ers",
    fact: "Four Super Bowl wins with the 49ers, and he never lost one.",
    ratings: ratings(84, 96, 98, 76, 97, 99, 82, 98),
  },
  {
    id: "peyton-manning",
    name: "Peyton Manning",
    knownFor: "Indianapolis, then Denver",
    fact: "Five regular-season MVPs. Won a Super Bowl with the Colts and another with the Broncos.",
    ratings: ratings(90, 97, 94, 60, 99, 90, 78, 95),
  },
  {
    id: "aaron-rodgers",
    name: "Aaron Rodgers",
    knownFor: "Green Bay, later the Jets and the Steelers",
    fact: "Won Super Bowl XLV with Green Bay, and was regular-season MVP four times.",
    ratings: ratings(95, 97, 96, 82, 96, 91, 80, 84),
  },
  {
    id: "josh-allen",
    name: "Josh Allen",
    knownFor: "Buffalo Bills",
    fact: "2024 NFL Most Valuable Player.",
    ratings: ratings(99, 86, 88, 92, 86, 94, 90, 92),
  },
  {
    id: "lamar-jackson",
    name: "Lamar Jackson",
    knownFor: "Baltimore Ravens",
    fact: "NFL MVP in 2019 and again in 2023.",
    ratings: ratings(90, 86, 84, 99, 88, 90, 78, 90),
  },
  {
    id: "joe-burrow",
    name: "Joe Burrow",
    knownFor: "Cincinnati Bengals",
    fact: "Took the Bengals to Super Bowl LVI.",
    ratings: ratings(92, 96, 90, 74, 94, 91, 70, 90),
  },
  {
    id: "justin-herbert",
    name: "Justin Herbert",
    knownFor: "Los Angeles Chargers",
    ratings: ratings(97, 90, 86, 78, 86, 82, 88, 80),
  },
  {
    id: "jalen-hurts",
    name: "Jalen Hurts",
    knownFor: "Philadelphia Eagles",
    fact: "Won Super Bowl LIX with Philadelphia.",
    ratings: ratings(90, 88, 86, 93, 86, 94, 88, 94),
  },
  {
    id: "jared-goff",
    name: "Jared Goff",
    knownFor: "Detroit Lions",
    fact: "Lost Super Bowl LIII with the Rams.",
    ratings: ratings(88, 90, 84, 62, 86, 84, 90, 84),
  },
  {
    id: "brock-purdy",
    name: "Brock Purdy",
    knownFor: "San Francisco 49ers",
    fact: "Last pick of the 2022 draft. Lost Super Bowl LVIII.",
    ratings: ratings(84, 90, 88, 80, 88, 84, 72, 86),
  },
  {
    id: "jayden-daniels",
    name: "Jayden Daniels",
    knownFor: "Washington Commanders",
    fact: "2024 Offensive Rookie of the Year.",
    ratings: ratings(86, 88, 84, 96, 86, 88, 74, 86),
  },
  {
    id: "baker-mayfield",
    name: "Baker Mayfield",
    knownFor: "Tampa Bay Buccaneers",
    fact: "First overall pick in the 2018 draft.",
    ratings: ratings(88, 84, 86, 76, 84, 90, 86, 88),
  },
  {
    id: "matthew-stafford",
    name: "Matthew Stafford",
    knownFor: "Detroit, then the Los Angeles Rams",
    fact: "Won Super Bowl LVI with the Rams.",
    ratings: ratings(96, 90, 88, 64, 90, 93, 78, 88),
  },
  {
    id: "russell-wilson",
    name: "Russell Wilson",
    knownFor: "Seattle Seahawks",
    fact: "Won Super Bowl XLVIII with Seattle.",
    ratings: ratings(86, 88, 84, 92, 88, 90, 86, 88),
  },
  {
    id: "drew-brees",
    name: "Drew Brees",
    knownFor: "New Orleans Saints",
    fact: "Won Super Bowl XLIV with the Saints.",
    ratings: ratings(84, 99, 93, 60, 96, 92, 86, 95),
  },
  {
    id: "dan-marino",
    name: "Dan Marino",
    knownFor: "Miami Dolphins",
    fact: "1984 NFL MVP. Lost Super Bowl XIX.",
    ratings: ratings(97, 95, 90, 60, 93, 86, 94, 88),
  },
  {
    id: "john-elway",
    name: "John Elway",
    knownFor: "Denver Broncos",
    fact: "Won two Super Bowls with Denver after losing three earlier.",
    ratings: ratings(98, 84, 88, 86, 88, 94, 92, 96),
  },
  {
    id: "brett-favre",
    name: "Brett Favre",
    knownFor: "Green Bay Packers",
    fact: "Three NFL MVPs in a row. Won Super Bowl XXXI with Green Bay.",
    ratings: ratings(96, 82, 86, 80, 84, 93, 99, 94),
  },
  {
    id: "steve-young",
    name: "Steve Young",
    knownFor: "San Francisco 49ers",
    fact: "Won Super Bowl XXIX. NFL MVP in 1992 and 1994.",
    ratings: ratings(88, 94, 90, 94, 93, 95, 74, 90),
  },
  {
    id: "troy-aikman",
    name: "Troy Aikman",
    knownFor: "Dallas Cowboys",
    fact: "Three Super Bowl wins with Dallas.",
    ratings: ratings(88, 90, 92, 66, 90, 91, 80, 96),
  },
  {
    id: "kurt-warner",
    name: "Kurt Warner",
    knownFor: "St. Louis Rams, then Arizona",
    fact: "Won Super Bowl XXXIV with the Rams. Two-time NFL MVP.",
    ratings: ratings(90, 93, 88, 64, 90, 94, 70, 92),
  },
  {
    id: "joe-namath",
    name: "Joe Namath",
    knownFor: "New York Jets",
    fact: "Guaranteed a win, then the Jets beat the Colts in Super Bowl III.",
    ratings: ratings(92, 78, 80, 70, 82, 90, 64, 88),
  },
  {
    id: "johnny-unitas",
    name: "Johnny Unitas",
    knownFor: "Baltimore Colts",
    fact: "Three-time NFL Most Valuable Player with the Baltimore Colts.",
    ratings: ratings(88, 92, 95, 64, 95, 94, 88, 97),
  },
  {
    id: "roger-staubach",
    name: "Roger Staubach",
    knownFor: "Dallas Cowboys",
    fact: "Two Super Bowl wins with Dallas. Known as Captain Comeback.",
    ratings: ratings(90, 88, 90, 82, 90, 97, 84, 98),
  },
  {
    id: "terry-bradshaw",
    name: "Terry Bradshaw",
    knownFor: "Pittsburgh Steelers",
    fact: "Four Super Bowl wins with Pittsburgh.",
    ratings: ratings(94, 80, 84, 76, 78, 93, 90, 92),
  },
  {
    id: "bart-starr",
    name: "Bart Starr",
    knownFor: "Green Bay Packers",
    fact: "Won the first two Super Bowls with Green Bay, and was MVP of both.",
    ratings: ratings(82, 90, 93, 68, 94, 96, 86, 97),
  },
  {
    id: "fran-tarkenton",
    name: "Fran Tarkenton",
    knownFor: "Minnesota Vikings",
    fact: "Reached three Super Bowls with Minnesota and lost them all.",
    ratings: ratings(80, 84, 82, 96, 90, 84, 92, 88),
  },
  {
    id: "warren-moon",
    name: "Warren Moon",
    knownFor: "Houston Oilers",
    fact: "The first Black quarterback inducted into the Pro Football Hall of Fame.",
    ratings: ratings(90, 91, 88, 74, 92, 86, 90, 90),
  },
  {
    id: "michael-vick",
    name: "Michael Vick",
    knownFor: "Atlanta, then Philadelphia",
    ratings: ratings(94, 76, 74, 99, 78, 84, 74, 82),
  },
  {
    id: "cam-newton",
    name: "Cam Newton",
    knownFor: "Carolina Panthers",
    fact: "2015 NFL MVP. Lost Super Bowl 50.",
    ratings: ratings(96, 78, 80, 95, 80, 88, 72, 90),
  },
  {
    id: "andrew-luck",
    name: "Andrew Luck",
    knownFor: "Indianapolis Colts",
    fact: "Retired in 2019.",
    ratings: ratings(94, 92, 90, 84, 94, 88, 66, 92),
  },
  {
    id: "otto-graham",
    name: "Otto Graham",
    knownFor: "Cleveland Browns",
    fact: "Won seven league championships with the Cleveland Browns.",
    ratings: ratings(86, 90, 92, 80, 94, 95, 88, 96),
  },
  {
    id: "eli-manning",
    name: "Eli Manning",
    knownFor: "New York Giants",
    fact: "Two Super Bowl wins with the Giants, both against the Patriots.",
    ratings: ratings(88, 82, 84, 66, 86, 96, 93, 86),
  },
  {
    id: "ben-roethlisberger",
    name: "Ben Roethlisberger",
    knownFor: "Pittsburgh Steelers",
    fact: "Two Super Bowl wins with Pittsburgh.",
    ratings: ratings(94, 86, 92, 74, 88, 92, 90, 90),
  },
];

export const buildAQuarterbackGame: BuildMiniGame = {
  slug: "build-a-quarterback",
  title: "Build a Quarterback",
  summary: "One trait from a different quarterback, under a salary cap.",
  minutes: 5,
  kind: "build",
};

function assertPool(pool: readonly Quarterback[]) {
  if (pool.length < 30 || pool.length > 40) {
    throw new Error(`Quarterback pool should be 30-40 names, got ${pool.length}`);
  }
  const ids = new Set<string>();
  const names = new Set<string>();
  for (const qb of pool) {
    if (ids.has(qb.id)) throw new Error(`Duplicate quarterback id ${qb.id}`);
    if (names.has(qb.name)) throw new Error(`Duplicate quarterback name ${qb.name}`);
    ids.add(qb.id);
    names.add(qb.name);
    if (!qb.knownFor.trim()) throw new Error(`${qb.id} needs a known-for line`);
    for (const trait of TRAIT_IDS) {
      const rating = qb.ratings[trait];
      if (!Number.isInteger(rating) || rating < 60 || rating > 99) {
        throw new Error(`${qb.id} ${trait} rating ${rating} is outside 60-99`);
      }
    }
  }
}

assertPool(quarterbacks);
