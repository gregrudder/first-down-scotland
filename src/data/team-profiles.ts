export type Conference = "AFC" | "NFC";
export type Division = "East" | "North" | "South" | "West";

export type TeamProfile = {
  slug: string;
  abbreviation: string;
  name: string;
  shortName: string;
  city: string;
  conference: Conference;
  division: Division;
  primary: string;
  secondary: string;
  nicknames: string;
  stadium: {
    name: string;
    location: string;
    capacity: number;
    opened: number;
    note?: string;
  };
  founded: string;
  notablePlayers: string[];
  achievements: string[];
  scotlandHook: string;
};

export const teamProfiles: TeamProfile[] = [
  {
    slug: "arizona-cardinals",
    abbreviation: "ARI",
    name: "Arizona Cardinals",
    shortName: "Cardinals",
    city: "Phoenix",
    conference: "NFC",
    division: "West",
    primary: "#97233F",
    secondary: "#FFB612",
    nicknames:
      "Officially the Cardinals. Often called the Cards or Big Red. The bird on the helmet is a cardinal, not a Catholic official.",
    stadium: {
      name: "State Farm Stadium",
      location: "Glendale, Arizona",
      capacity: 63400,
      opened: 2006,
      note: "Retractable roof; the grass tray rolls in from outside.",
    },
    founded:
      "Oldest continuously run pro football club in the US — roots in 1898 Chicago. Charter NFL member in 1920. Moved to St. Louis in 1960, Arizona in 1988.",
    notablePlayers: ["Larry Fitzgerald", "Kurt Warner", "Pat Tillman", "Anquan Boldin"],
    achievements: [
      "NFL championships in 1925 and 1947 (pre–Super Bowl).",
      "One Super Bowl appearance: lost XLIII in February 2009.",
    ],
    scotlandHook:
      "A desert bird in a retractable-roof ground — late UK kick-offs, but the red-and-yellow kit is unmistakable on a grey Sunday.",
  },
  {
    slug: "atlanta-falcons",
    abbreviation: "ATL",
    name: "Atlanta Falcons",
    shortName: "Falcons",
    city: "Atlanta",
    conference: "NFC",
    division: "South",
    primary: "#A71930",
    secondary: "#000000",
    nicknames:
      "Officially the Falcons. Fans and headlines often say Dirty Birds after a late-1990s play-off run. That is a nickname, not the club name.",
    stadium: {
      name: "Mercedes-Benz Stadium",
      location: "Atlanta, Georgia",
      capacity: 71000,
      opened: 2017,
      note: "Retractable petal roof; shares the building with MLS’s Atlanta United.",
    },
    founded: "Expansion club, 1966. NFC South since the 2002 realignment.",
    notablePlayers: ["Julio Jones", "Matt Ryan", "Deion Sanders", "Michael Vick"],
    achievements: [
      "Two Super Bowl appearances: lost XXXIII (1999) and LI (2017).",
      "Super Bowl LI is the 28–3 collapse — still the first fact many UK viewers learn about them.",
    ],
    scotlandHook:
      "A big southern city, a falcon on the helmet, and a stadium that looks like a spaceship. Easy to explain in the pub.",
  },
  {
    slug: "baltimore-ravens",
    abbreviation: "BAL",
    name: "Baltimore Ravens",
    shortName: "Ravens",
    city: "Baltimore",
    conference: "AFC",
    division: "North",
    primary: "#241773",
    secondary: "#9E7C0C",
    nicknames:
      "Officially the Ravens — named for Edgar Allan Poe, who died in Baltimore. Often just called Baltimore or the Purple.",
    stadium: {
      name: "M&T Bank Stadium",
      location: "Baltimore, Maryland",
      capacity: 71008,
      opened: 1998,
    },
    founded:
      "1996 expansion after the old Cleveland Browns relocated. The Ravens are a new franchise; Cleveland kept the Browns name and history.",
    notablePlayers: ["Ray Lewis", "Ed Reed", "Jonathan Ogden", "Joe Flacco"],
    achievements: [
      "Two Super Bowl titles: XXXV (February 2001) and XLVII (February 2013).",
      "Famous for defence first — Lewis and Reed are the poster names.",
    ],
    scotlandHook:
      "Purple, a literary bird, and a mean defence. Very on-brand if you liked English at school and rain on a Saturday.",
  },
  {
    slug: "buffalo-bills",
    abbreviation: "BUF",
    name: "Buffalo Bills",
    shortName: "Bills",
    city: "Buffalo",
    conference: "AFC",
    division: "East",
    primary: "#00338D",
    secondary: "#C60C30",
    nicknames:
      "Officially the Bills. The fan culture is often called Bills Mafia — a fan nickname, not a club department. Table-breaking after wins is a supporter tradition, not a rule.",
    stadium: {
      name: "Highmark Stadium",
      location: "Orchard Park, New York",
      capacity: 60108,
      opened: 2026,
      note: "New open-air ground for the 2026 season; replaced the previous Highmark Stadium across the road. Smallest listed NFL capacity.",
    },
    founded: "AFL original, 1960. Joined the NFL in the 1970 merger. Still in the AFC East.",
    notablePlayers: ["Jim Kelly", "Thurman Thomas", "Bruce Smith", "Andre Reed"],
    achievements: [
      "Two AFL titles in the mid-1960s.",
      "Four straight Super Bowl appearances (XXV–XXVIII) — all losses. Still waiting on a Lombardi Trophy.",
    ],
    scotlandHook:
      "Snow, tea-time kick-offs, and a new 2026 stadium. The most British kind of sporting heartbreak, with better snacks.",
  },
  {
    slug: "carolina-panthers",
    abbreviation: "CAR",
    name: "Carolina Panthers",
    shortName: "Panthers",
    city: "Charlotte",
    conference: "NFC",
    division: "South",
    primary: "#0085CA",
    secondary: "#101820",
    nicknames:
      "Officially the Panthers. Keep Pounding is the club motto, often treated like a nickname on merchandise.",
    stadium: {
      name: "Bank of America Stadium",
      location: "Charlotte, North Carolina",
      capacity: 75037,
      opened: 1996,
    },
    founded: "1995 expansion, with the Jaguars. NFC South.",
    notablePlayers: ["Cam Newton", "Steve Smith Sr.", "Luke Kuechly", "Julius Peppers"],
    achievements: [
      "Two Super Bowl appearances: lost XXXVIII (2004) and 50 (2016).",
      "Cam Newton’s 2015 MVP season is the high-water mark most beginners hear about.",
    ],
    scotlandHook:
      "Electric blue and a big cat. Quietly stylish, rarely the favourite — a solid “I just liked the shirt” pick.",
  },
  {
    slug: "chicago-bears",
    abbreviation: "CHI",
    name: "Chicago Bears",
    shortName: "Bears",
    city: "Chicago",
    conference: "NFC",
    division: "North",
    primary: "#0B162A",
    secondary: "#C83803",
    nicknames:
      "Officially the Bears. Monsters of the Midway is a historic nickname for the club, especially the old defensive sides — often used, not official.",
    stadium: {
      name: "Soldier Field",
      location: "Chicago, Illinois",
      capacity: 62500,
      opened: 1924,
      note: "Oldest stadium in the league; the Bears moved in in 1971. Bowl rebuilt in 2003. A new ground is planned for the 2030s.",
    },
    founded: "1920 as the Decatur Staleys; Bears from 1922. Charter NFL club.",
    notablePlayers: ["Walter Payton", "Dick Butkus", "Mike Ditka", "Brian Urlacher"],
    achievements: [
      "Nine NFL championships, most of them before the Super Bowl.",
      "One Super Bowl title: XX in January 1986, the ’85 defence still on highlight reels.",
    ],
    scotlandHook:
      "Navy, orange, and a city that understands winter. Proper old-club energy — like supporting a 19th-century football side that also invented the league.",
  },
  {
    slug: "cincinnati-bengals",
    abbreviation: "CIN",
    name: "Cincinnati Bengals",
    shortName: "Bengals",
    city: "Cincinnati",
    conference: "AFC",
    division: "North",
    primary: "#FB4F14",
    secondary: "#000000",
    nicknames:
      "Officially the Bengals. Who Dey is the fan chant and a common nickname. Bungles is an old insult, not used kindly.",
    stadium: {
      name: "Paycor Stadium",
      location: "Cincinnati, Ohio",
      capacity: 65515,
      opened: 2000,
      note: "Formerly Paul Brown Stadium.",
    },
    founded: "1968 AFL expansion; NFL from 1970. Founded by Paul Brown after he left Cleveland.",
    notablePlayers: ["Anthony Muñoz", "Ken Anderson", "Joe Burrow", "Ja'Marr Chase"],
    achievements: [
      "Three Super Bowl appearances: lost XVI, XXIII, and LVI (February 2022).",
      "No Super Bowl title yet. The 2020s Burrow–Chase sides brought them back into the conversation.",
    ],
    scotlandHook:
      "Tiger stripes you will never lose in a crowd. A midwestern club with late-game drama and a chant you can learn in ten seconds.",
  },
  {
    slug: "cleveland-browns",
    abbreviation: "CLE",
    name: "Cleveland Browns",
    shortName: "Browns",
    city: "Cleveland",
    conference: "AFC",
    division: "North",
    primary: "#311D00",
    secondary: "#FF3C00",
    nicknames:
      "Officially the Browns — named for coach Paul Brown, not the colour, though the kit is brown. The Dawg Pound is the famous end-zone crowd, often used as a fan nickname.",
    stadium: {
      name: "Huntington Bank Field",
      location: "Cleveland, Ohio",
      capacity: 67895,
      opened: 1999,
      note: "Has had several names (including FirstEnergy Stadium). A new indoor stadium is planned later this decade.",
    },
    founded:
      "1946 in the AAFC; joined the NFL in 1950. The club left for Baltimore in 1996; Cleveland kept the name, colours and history and restarted in 1999.",
    notablePlayers: ["Jim Brown", "Otto Graham", "Ozzie Newsome", "Joe Thomas"],
    achievements: [
      "Four AAFC titles and four NFL championships, all before the Super Bowl era.",
      "No Super Bowl appearances. The modern Browns are defined as much by waiting as by Jim Brown’s films.",
    ],
    scotlandHook:
      "No logo on the helmet, just grit. The ultimate “we’ve been through it” pick — very Scottish, if you squint.",
  },
  {
    slug: "dallas-cowboys",
    abbreviation: "DAL",
    name: "Dallas Cowboys",
    shortName: "Cowboys",
    city: "Dallas",
    conference: "NFC",
    division: "East",
    primary: "#041E42",
    secondary: "#869397",
    nicknames:
      "Officially the Cowboys. America’s Team is a 1970s media nickname that stuck — many fans of other clubs reject it. Often just Dallas.",
    stadium: {
      name: "AT&T Stadium",
      location: "Arlington, Texas",
      capacity: 80000,
      opened: 2009,
      note: "Listed seating 80,000; standing room can push attendance over 100,000.",
    },
    founded: "1960 NFL expansion. NFC East.",
    notablePlayers: ["Troy Aikman", "Emmitt Smith", "Roger Staubach", "Michael Irvin"],
    achievements: [
      "Five Super Bowl titles: VI, XII, XXVII, XXVIII and XXX.",
      "The 1990s three-in-four-years run is the dynasty people still argue about.",
    ],
    scotlandHook:
      "Silver star, huge stadium, everyone has an opinion. Instant recognition — like mentioning Manchester United to someone who does not watch football.",
  },
  {
    slug: "denver-broncos",
    abbreviation: "DEN",
    name: "Denver Broncos",
    shortName: "Broncos",
    city: "Denver",
    conference: "AFC",
    division: "West",
    primary: "#FB4F14",
    secondary: "#002244",
    nicknames:
      "Officially the Broncos. Orange Crush was the nickname of a 1970s defence; people still use it for the kit. Mile High refers to the city altitude, not a second club name.",
    stadium: {
      name: "Empower Field at Mile High",
      location: "Denver, Colorado",
      capacity: 76125,
      opened: 2001,
      note: "A new retractable-roof stadium is planned for around 2031.",
    },
    founded: "AFL original, 1960. NFL from 1970. AFC West.",
    notablePlayers: ["John Elway", "Peyton Manning", "Terrell Davis", "Champ Bailey"],
    achievements: [
      "Three Super Bowl titles: XXXII and XXXIII (1998–99) plus 50 (February 2016).",
      "Elway’s late-career titles and Manning’s last season are the two eras beginners meet first.",
    ],
    scotlandHook:
      "Orange at altitude. Kick-offs will test your kettle — mountain time is late in the UK.",
  },
  {
    slug: "detroit-lions",
    abbreviation: "DET",
    name: "Detroit Lions",
    shortName: "Lions",
    city: "Detroit",
    conference: "NFC",
    division: "North",
    primary: "#0076B6",
    secondary: "#B0B7BC",
    nicknames:
      "Officially the Lions. Honolulu blue is the colour nickname for the kit, not the club.",
    stadium: {
      name: "Ford Field",
      location: "Detroit, Michigan",
      capacity: 65000,
      opened: 2002,
    },
    founded: "1930 as the Portsmouth Spartans; moved to Detroit in 1934.",
    notablePlayers: ["Barry Sanders", "Calvin Johnson", "Joe Schmidt", "Matthew Stafford"],
    achievements: [
      "Four NFL championships, last in 1957 — all before the Super Bowl.",
      "No Super Bowl appearances as of 2026. The 2020s sides finally made them relevant again.",
    ],
    scotlandHook:
      "Decades of pain, then a roar. Honolulu blue is having a moment — and Detroit in winter feels familiar.",
  },
  {
    slug: "green-bay-packers",
    abbreviation: "GB",
    name: "Green Bay Packers",
    shortName: "Packers",
    city: "Green Bay",
    conference: "NFC",
    division: "North",
    primary: "#203731",
    secondary: "#FFB612",
    nicknames:
      "Officially the Packers. Titletown is a city/club nickname from the 1960s. Cheeseheads is a fan nickname (the foam hats), not the team name. Often just the Pack.",
    stadium: {
      name: "Lambeau Field",
      location: "Green Bay, Wisconsin",
      capacity: 81441,
      opened: 1957,
      note: "Oldest continuously operating NFL stadium. No corporate name on the building.",
    },
    founded:
      "1919; NFL from 1921. Community-owned — there is no billionaire owner, which is unique in the league.",
    notablePlayers: ["Vince Lombardi (coach)", "Bart Starr", "Brett Favre", "Aaron Rodgers"],
    achievements: [
      "13 NFL championships, including Super Bowls I, II, XXXI and XLV.",
      "The Lombardi Trophy is named for their 1960s coach.",
    ],
    scotlandHook:
      "Frozen grass, a town closer to Perth than to London in scale, and the most famous green in the sport. Community-owned, like a well-run supporters’ trust that actually won things.",
  },
  {
    slug: "houston-texans",
    abbreviation: "HOU",
    name: "Houston Texans",
    shortName: "Texans",
    city: "Houston",
    conference: "AFC",
    division: "South",
    primary: "#03202F",
    secondary: "#A71930",
    nicknames: "Officially the Texans. Bulls is sometimes used around the charging-bull logo.",
    stadium: {
      name: "Reliant Stadium",
      location: "Houston, Texas",
      capacity: 72220,
      opened: 2002,
      note: "Opened as Reliant, named NRG Stadium from 2014, briefly Houston Stadium during the 2026 World Cup, then Reliant again for the 2026 NFL season.",
    },
    founded: "2002 expansion — the league’s newest club. Replaced the Oilers after they left for Tennessee.",
    notablePlayers: ["Andre Johnson", "J.J. Watt", "Arian Foster", "DeAndre Hopkins"],
    achievements: [
      "No Super Bowl appearances as of 2026.",
      "Several AFC South titles; Watt’s defensive peak is the era most highlights still show.",
    ],
    scotlandHook:
      "A modern club still writing its story, in a ground that has had three names in one calendar year. Relatable, if you follow stadium sponsorships.",
  },
  {
    slug: "indianapolis-colts",
    abbreviation: "IND",
    name: "Indianapolis Colts",
    shortName: "Colts",
    city: "Indianapolis",
    conference: "AFC",
    division: "South",
    primary: "#002C5F",
    secondary: "#A2AAAD",
    nicknames: "Officially the Colts. The Horseshoe is a logo nickname used in headlines.",
    stadium: {
      name: "Lucas Oil Stadium",
      location: "Indianapolis, Indiana",
      capacity: 67000,
      opened: 2008,
      note: "Retractable roof.",
    },
    founded:
      "1953 as the Baltimore Colts (the second club of that name). Moved to Indianapolis in 1984 — still a sore subject in Baltimore.",
    notablePlayers: ["Peyton Manning", "Johnny Unitas", "Marvin Harrison", "Reggie Wayne"],
    achievements: [
      "Two Super Bowl titles: V (January 1971, as Baltimore) and XLI (February 2007, as Indianapolis).",
      "The Manning–Dungy years are the modern peak.",
    ],
    scotlandHook:
      "Royal blue horseshoes. Clean, tidy, and usually on at a human hour for UK viewers.",
  },
  {
    slug: "jacksonville-jaguars",
    abbreviation: "JAX",
    name: "Jacksonville Jaguars",
    shortName: "Jaguars",
    city: "Jacksonville",
    conference: "AFC",
    division: "South",
    primary: "#006778",
    secondary: "#D7A22A",
    nicknames:
      "Officially the Jaguars. Often Jags. Duval is a local/fan nickname from the county name, not the club.",
    stadium: {
      name: "EverBank Stadium",
      location: "Jacksonville, Florida",
      capacity: 69132,
      opened: 1995,
      note: "Has changed sponsor names (Alltel, EverBank, TIAA Bank, EverBank again).",
    },
    founded: "1995 expansion. The most regular NFL “home” side in London for years.",
    notablePlayers: ["Fred Taylor", "Tony Boselli", "Maurice Jones-Drew", "Jimmy Smith"],
    achievements: [
      "No Super Bowl appearances as of 2026.",
      "Reached the AFC Championship Game in the 1990s and again in the 2010s.",
    ],
    scotlandHook:
      "If you have been to an NFL game at Wembley, there is a decent chance they were one of the sides. Teal jaguar, Florida heat, left-field pick.",
  },
  {
    slug: "kansas-city-chiefs",
    abbreviation: "KC",
    name: "Kansas City Chiefs",
    shortName: "Chiefs",
    city: "Kansas City",
    conference: "AFC",
    division: "West",
    primary: "#E31837",
    secondary: "#FFB81C",
    nicknames:
      "Officially the Chiefs. Chiefs Kingdom is a fan/marketing nickname. The tomahawk chop chant is widely used and also widely criticised — know it exists; it is not “the official song”.",
    stadium: {
      name: "Arrowhead Stadium",
      location: "Kansas City, Missouri",
      capacity: 73426,
      opened: 1972,
      note: "One of three NFL stadiums without a corporate building name (with Lambeau and Soldier Field). The field had a GEHA sponsor name in recent seasons. A new stadium across the state line is planned for around 2031.",
    },
    founded: "1960 AFL as the Dallas Texans; moved to Kansas City in 1963. NFL from 1970.",
    notablePlayers: ["Patrick Mahomes", "Travis Kelce", "Lenny Dawson", "Tony Gonzalez"],
    achievements: [
      "Four Super Bowl titles: IV (January 1970), LIV (2020), LVII (2023) and LVIII (2024).",
      "Lost LIX to Philadelphia in February 2025, ending the three-peat bid.",
    ],
    scotlandHook:
      "Red, gold, and the side UK viewers could not avoid in the early 2020s. If you only know one current quarterback, it is probably theirs.",
  },
  {
    slug: "las-vegas-raiders",
    abbreviation: "LV",
    name: "Las Vegas Raiders",
    shortName: "Raiders",
    city: "Las Vegas",
    conference: "AFC",
    division: "West",
    primary: "#000000",
    secondary: "#A5ACAF",
    nicknames:
      "Officially the Raiders. Raider Nation and Silver and Black are fan nicknames used everywhere. Commitment to Excellence was an Al Davis slogan, often treated like a motto.",
    stadium: {
      name: "Allegiant Stadium",
      location: "Paradise, Nevada",
      capacity: 66000,
      opened: 2020,
      note: "Fixed roof with a skylight; just off the Las Vegas Strip.",
    },
    founded:
      "1960 AFL in Oakland. Los Angeles 1982–94, Oakland again 1995–2019, Las Vegas from 2020. Same franchise throughout.",
    notablePlayers: ["Howie Long", "Marcus Allen", "Tim Brown", "Charles Woodson"],
    achievements: [
      "Three Super Bowl titles: XI, XV and XVIII (1970s–80s).",
      "Last Super Bowl appearance: XXXVII (lost, 2003).",
    ],
    scotlandHook:
      "Black and silver. Always the coolest kit in the room, whatever the score — the leather-jacket option.",
  },
  {
    slug: "los-angeles-chargers",
    abbreviation: "LAC",
    name: "Los Angeles Chargers",
    shortName: "Chargers",
    city: "Los Angeles",
    conference: "AFC",
    division: "West",
    primary: "#0080C6",
    secondary: "#FFC20E",
    nicknames:
      "Officially the Chargers. Bolts is a common nickname from the lightning logo. Often just L.A. Chargers to separate them from the Rams.",
    stadium: {
      name: "SoFi Stadium",
      location: "Inglewood, California",
      capacity: 70000,
      opened: 2020,
      note: "Shared with the Rams. Listed capacity 70,000; can expand toward 100,000 for huge events.",
    },
    founded: "1960 AFL in Los Angeles, San Diego 1961–2016, back to Los Angeles in 2017.",
    notablePlayers: ["Dan Fouts", "LaDainian Tomlinson", "Junior Seau", "Philip Rivers"],
    achievements: [
      "AFL title in 1963. No Super Bowl wins.",
      "One Super Bowl appearance: lost XXIX in January 1995.",
    ],
    scotlandHook:
      "Powder blue lightning. Beautiful shirts, uncivilised Pacific-time kick-offs. Share a palace with the Rams.",
  },
  {
    slug: "los-angeles-rams",
    abbreviation: "LAR",
    name: "Los Angeles Rams",
    shortName: "Rams",
    city: "Los Angeles",
    conference: "NFC",
    division: "West",
    primary: "#003594",
    secondary: "#FFA300",
    nicknames:
      "Officially the Rams. The Greatest Show on Turf was a nickname for the early-2000s St. Louis offence — an era, not the current club name.",
    stadium: {
      name: "SoFi Stadium",
      location: "Inglewood, California",
      capacity: 70000,
      opened: 2020,
      note: "Shared with the Chargers.",
    },
    founded:
      "1936 in Cleveland; NFL in 1937. Los Angeles 1946–94, St. Louis 1995–2015, Los Angeles again from 2016.",
    notablePlayers: ["Merlin Olsen", "Eric Dickerson", "Marshall Faulk", "Aaron Donald"],
    achievements: [
      "Two Super Bowl titles: XXXIV (January 2000, as St. Louis) and LVI (February 2022, as Los Angeles).",
      "NFL championships in 1945 and 1951 as well.",
    ],
    scotlandHook:
      "Royal blue and a horn on the helmet. Hollywood, but with pads — and a Super Bowl in living memory.",
  },
  {
    slug: "miami-dolphins",
    abbreviation: "MIA",
    name: "Miami Dolphins",
    shortName: "Dolphins",
    city: "Miami",
    conference: "AFC",
    division: "East",
    primary: "#008E97",
    secondary: "#FC4C02",
    nicknames:
      "Officially the Dolphins. Often Fins or the Phins. The Perfect Season refers to 1972, not a nickname for the current team.",
    stadium: {
      name: "Hard Rock Stadium",
      location: "Miami Gardens, Florida",
      capacity: 65326,
      opened: 1987,
    },
    founded: "1966 AFL expansion; NFL from 1970.",
    notablePlayers: ["Dan Marino", "Larry Csonka", "Jason Taylor", "Zach Thomas"],
    achievements: [
      "Two Super Bowl titles: VII and VIII (January 1973 and 1974).",
      "1972 remains the only complete perfect season (wins in every game, including the Super Bowl) in NFL history.",
    ],
    scotlandHook:
      "Aqua and sunshine. The kit alone will get you through a grey Glasgow week, and they are often on at a civilised UK hour.",
  },
  {
    slug: "minnesota-vikings",
    abbreviation: "MIN",
    name: "Minnesota Vikings",
    shortName: "Vikings",
    city: "Minneapolis",
    conference: "NFC",
    division: "North",
    primary: "#4F2683",
    secondary: "#FFC62F",
    nicknames:
      "Officially the Vikings. Skol is the chant, borrowed from a Scandinavian toast — a fan cry, not the club name. Purple People Eaters was a 1970s defensive line nickname.",
    stadium: {
      name: "U.S. Bank Stadium",
      location: "Minneapolis, Minnesota",
      capacity: 66655,
      opened: 2016,
      note: "Fixed translucent roof.",
    },
    founded: "1961 NFL expansion.",
    notablePlayers: ["Alan Page", "Randy Moss", "Fran Tarkenton", "Adrian Peterson"],
    achievements: [
      "One NFL championship (1969, the last before the merger season).",
      "Four Super Bowl appearances — all losses (IV, VIII, IX, XI). Still waiting on the Lombardi.",
    ],
    scotlandHook:
      "Purple, horns, and weather that will make you feel at home. The Nordic branding writes itself north of Berwick.",
  },
  {
    slug: "new-england-patriots",
    abbreviation: "NE",
    name: "New England Patriots",
    shortName: "Patriots",
    city: "Foxborough",
    conference: "AFC",
    division: "East",
    primary: "#002244",
    secondary: "#C60C30",
    nicknames:
      "Officially the Patriots. Often the Pats. Flying Elvis is a nickname for the old helmet logo. The Brady–Belichick years are an era, not a second name.",
    stadium: {
      name: "Gillette Stadium",
      location: "Foxborough, Massachusetts",
      capacity: 66829,
      opened: 2002,
    },
    founded: "1960 AFL as the Boston Patriots; New England from 1971.",
    notablePlayers: ["Tom Brady", "Rob Gronkowski", "John Hannah", "Andre Tippett"],
    achievements: [
      "Six Super Bowl titles: XXXVI, XXXVIII, XXXIX, XLIX, LI and LIII — tied with Pittsburgh for the most.",
      "Lost Super Bowl LX in February 2026 (29–13 to Seattle), falling short of a record seventh.",
    ],
    scotlandHook:
      "Navy, a flying Elvis, and two decades of winning that still annoys people. If you started watching in the 2000s, you already know them.",
  },
  {
    slug: "new-orleans-saints",
    abbreviation: "NO",
    name: "New Orleans Saints",
    shortName: "Saints",
    city: "New Orleans",
    conference: "NFC",
    division: "South",
    primary: "#D3BC8D",
    secondary: "#101820",
    nicknames:
      "Officially the Saints. Who Dat is the fan chant and a common nickname. Black and Gold describes the kit. The Dome Patrol was a 1980s linebacker group.",
    stadium: {
      name: "Caesars Superdome",
      location: "New Orleans, Louisiana",
      capacity: 73208,
      opened: 1975,
      note: "Indoor dome; hosted Super Bowl LIX in February 2025.",
    },
    founded: "1967 NFL expansion, on All Saints' Day — hence the name.",
    notablePlayers: ["Drew Brees", "Rickey Jackson", "Willie Roaf", "Marques Colston"],
    achievements: [
      "One Super Bowl title: XLIV (February 2010), four years after Hurricane Katrina.",
      "That 2009 season is still the emotional centre of the club’s modern story.",
    ],
    scotlandHook:
      "Gold fleur-de-lis and a city that knows how to throw a party. The post-Katrina Super Bowl is one of the better sports films you did not know was a sports film.",
  },
  {
    slug: "new-york-giants",
    abbreviation: "NYG",
    name: "New York Giants",
    shortName: "Giants",
    city: "New York",
    conference: "NFC",
    division: "East",
    primary: "#0B2265",
    secondary: "#A71930",
    nicknames:
      "Officially the Giants. G-Men and Big Blue are common nicknames. Play in New Jersey; “New York” is the market name.",
    stadium: {
      name: "MetLife Stadium",
      location: "East Rutherford, New Jersey",
      capacity: 82500,
      opened: 2010,
      note: "Shared with the Jets. Largest listed seating capacity in the NFL.",
    },
    founded: "1925. One of the league’s oldest surviving clubs.",
    notablePlayers: ["Lawrence Taylor", "Eli Manning", "Michael Strahan", "Phil Simms"],
    achievements: [
      "Four Super Bowl titles: XXI, XXV, XLII and XLVI.",
      "XLII and XLVI were the two giant-killings of the Brady Patriots. Also several pre–Super Bowl NFL titles.",
    ],
    scotlandHook:
      "Big-city classic. The royal blue from the old Super Bowl clips — and they played in the first regular-season NFL game in London (Wembley, 2007).",
  },
  {
    slug: "new-york-jets",
    abbreviation: "NYJ",
    name: "New York Jets",
    shortName: "Jets",
    city: "New York",
    conference: "AFC",
    division: "East",
    primary: "#125740",
    secondary: "#000000",
    nicknames:
      "Officially the Jets. Gang Green is a common nickname. Also play at MetLife in New Jersey.",
    stadium: {
      name: "MetLife Stadium",
      location: "East Rutherford, New Jersey",
      capacity: 82500,
      opened: 2010,
      note: "Shared with the Giants.",
    },
    founded: "1960 AFL as the Titans of New York; Jets from 1963. NFL from 1970.",
    notablePlayers: ["Joe Namath", "Don Maynard", "Curtis Martin", "Darrelle Revis"],
    achievements: [
      "One Super Bowl title: III (January 1969), when Joe Namath “guaranteed” the AFL win over the Colts.",
      "No Super Bowl appearances since. The guarantee is still the first story anyone tells.",
    ],
    scotlandHook:
      "Gotham green and a long wait for glory. Banter comes included — the other New York club, on at a decent UK hour.",
  },
  {
    slug: "philadelphia-eagles",
    abbreviation: "PHI",
    name: "Philadelphia Eagles",
    shortName: "Eagles",
    city: "Philadelphia",
    conference: "NFC",
    division: "East",
    primary: "#004C54",
    secondary: "#A5ACAF",
    nicknames:
      "Officially the Eagles. Often the Birds. Fly, Eagles, Fly is the fight song, not a second name. The crowd’s reputation is part of the brand.",
    stadium: {
      name: "Lincoln Financial Field",
      location: "Philadelphia, Pennsylvania",
      capacity: 69596,
      opened: 2003,
    },
    founded: "1933, replacing the Frankford Yellow Jackets in the NFL.",
    notablePlayers: ["Reggie White", "Brian Dawkins", "Chuck Bednarik", "Jason Kelce"],
    achievements: [
      "Two Super Bowl titles: LII (February 2018) and LIX (February 2025).",
      "LIX was 40–22 over the Chiefs in New Orleans, stopping a Kansas City three-peat.",
    ],
    scotlandHook:
      "Midnight green and a famously loyal crowd. They will adopt you if you adopt them — the loud-end, scarf-up option.",
  },
  {
    slug: "pittsburgh-steelers",
    abbreviation: "PIT",
    name: "Pittsburgh Steelers",
    shortName: "Steelers",
    city: "Pittsburgh",
    conference: "AFC",
    division: "North",
    primary: "#FFB612",
    secondary: "#101820",
    nicknames:
      "Officially the Steelers. Black and Gold is kit shorthand. Steeler Nation is a fan nickname. The Steel Curtain was the 1970s defence.",
    stadium: {
      name: "Acrisure Stadium",
      location: "Pittsburgh, Pennsylvania",
      capacity: 68984,
      opened: 2001,
      note: "Formerly Heinz Field; the mustard-and-ketchup vibe is still in the city, not the naming rights.",
    },
    founded: "1933 as the Pirates; Steelers from 1940.",
    notablePlayers: ["Joe Greene", "Terry Bradshaw", "Jack Lambert", "Troy Polamalu"],
    achievements: [
      "Six Super Bowl titles: IX, X, XIII, XIV, XL and XLIII — tied with New England for the most.",
      "The 1970s four-in-six-years run is the original TV dynasty.",
    ],
    scotlandHook:
      "Black and gold in a steel town. If you grew up near a shipyard or a pit village, this will click without a brochure.",
  },
  {
    slug: "san-francisco-49ers",
    abbreviation: "SF",
    name: "San Francisco 49ers",
    shortName: "49ers",
    city: "Santa Clara",
    conference: "NFC",
    division: "West",
    primary: "#AA0000",
    secondary: "#B3995D",
    nicknames:
      "Officially the 49ers (named for the 1849 Gold Rush). Often Niners. The Catch is a famous 1982 play, not a nickname for the team.",
    stadium: {
      name: "Levi's Stadium",
      location: "Santa Clara, California",
      capacity: 68500,
      opened: 2014,
      note: "Hosted Super Bowl LX in February 2026. The club is San Francisco; the ground is in Santa Clara.",
    },
    founded: "1946 AAFC; joined the NFL in 1950.",
    notablePlayers: ["Joe Montana", "Jerry Rice", "Steve Young", "Ronnie Lott"],
    achievements: [
      "Five Super Bowl titles: XVI, XIX, XXIII, XXIV and XXIX.",
      "Lost LVIII (2024) to Kansas City. The 1980s West Coast offence still shapes how the sport is taught.",
    ],
    scotlandHook:
      "Gold and scarlet from the Bay. Beautiful kit; Pacific-time kick-offs will wreck a Monday. Five Super Bowls is a serious institution.",
  },
  {
    slug: "seattle-seahawks",
    abbreviation: "SEA",
    name: "Seattle Seahawks",
    shortName: "Seahawks",
    city: "Seattle",
    conference: "NFC",
    division: "West",
    primary: "#002244",
    secondary: "#69BE28",
    nicknames:
      "Officially the Seahawks. Often Hawks. The 12s (or 12th Man) is a fan nickname — Seattle retired the number 12 for supporters. Legion of Boom was the 2010s secondary.",
    stadium: {
      name: "Lumen Field",
      location: "Seattle, Washington",
      capacity: 69000,
      opened: 2002,
      note: "Formerly Qwest / CenturyLink Field. Known for noise.",
    },
    founded: "1976 expansion, with Tampa Bay.",
    notablePlayers: ["Steve Largent", "Walter Jones", "Richard Sherman", "Russell Wilson"],
    achievements: [
      "Two Super Bowl titles: XLVIII (February 2014) and LX (February 2026).",
      "LX was 29–13 over New England at Levi’s Stadium; Kenneth Walker III was named MVP. Lost XLIX on the famous goal-line interception.",
    ],
    scotlandHook:
      "Rain, navy, and that wild neon green. The most Pacific-Northwest, almost-Scottish pick — and the reigning champions as the 2026 season opened.",
  },
  {
    slug: "tampa-bay-buccaneers",
    abbreviation: "TB",
    name: "Tampa Bay Buccaneers",
    shortName: "Buccaneers",
    city: "Tampa",
    conference: "NFC",
    division: "South",
    primary: "#D50A0A",
    secondary: "#FF7900",
    nicknames:
      "Officially the Buccaneers. Almost always Bucs. Pewter Pirates is a kit-era nickname. Creampoles was an insult for the old orange uniforms.",
    stadium: {
      name: "Raymond James Stadium",
      location: "Tampa, Florida",
      capacity: 65890,
      opened: 1998,
      note: "Pirate ship in the end zone is a stadium feature, not a second ground.",
    },
    founded: "1976 expansion.",
    notablePlayers: ["Warren Sapp", "Derrick Brooks", "John Lynch", "Mike Alstott"],
    achievements: [
      "Two Super Bowl titles: XXXVII (January 2003) and LV (February 2021).",
      "LV was Tom Brady’s seventh ring, in his first Tampa season — still the clip UK highlights use.",
    ],
    scotlandHook:
      "Pewter, red, and a pirate flag. Sunshine football with a wink, and a Super Bowl you probably saw on telly.",
  },
  {
    slug: "tennessee-titans",
    abbreviation: "TEN",
    name: "Tennessee Titans",
    shortName: "Titans",
    city: "Nashville",
    conference: "AFC",
    division: "South",
    primary: "#0C2340",
    secondary: "#4B92DB",
    nicknames:
      "Officially the Titans (since 1999). The same franchise was the Houston Oilers — older fans still say Oilers. That is history, not the current name.",
    stadium: {
      name: "Nissan Stadium",
      location: "Nashville, Tennessee",
      capacity: 69143,
      opened: 1999,
      note: "A new enclosed stadium is planned for 2027; 2026 is still Nissan Stadium.",
    },
    founded: "1960 AFL as the Houston Oilers; Tennessee from 1997; Titans name in 1999.",
    notablePlayers: ["Earl Campbell", "Warren Moon", "Steve McNair", "Eddie George"],
    achievements: [
      "Two AFL titles as the Oilers (1960, 1961).",
      "One Super Bowl appearance: lost XXXIV in January 2000 (one yard short).",
    ],
    scotlandHook:
      "Sword-swinging logo and a quieter Sunday. A solid “I just picked a side” club, with Music City as the postcard.",
  },
  {
    slug: "washington-commanders",
    abbreviation: "WSH",
    name: "Washington Commanders",
    shortName: "Commanders",
    city: "Washington",
    conference: "NFC",
    division: "East",
    primary: "#5A1414",
    secondary: "#FFB612",
    nicknames:
      "Officially the Commanders (since 2022). The franchise was the Boston Braves, then the Washington club long known by a Native American name that was retired. Burgundy and Gold is kit shorthand. Some older broadcasts still slip; the current name is Commanders.",
    stadium: {
      name: "Northwest Stadium",
      location: "Landover, Maryland",
      capacity: 64000,
      opened: 1997,
      note: "Formerly FedExField. A new stadium on the old RFK Campus in Washington, D.C. is planned for around 2030.",
    },
    founded: "1932 in Boston; Washington from 1937. Commanders name from 2022.",
    notablePlayers: ["Joe Gibbs (coach)", "John Riggins", "Darrell Green", "Art Monk"],
    achievements: [
      "Three Super Bowl titles: XVII, XXII and XXVI (1980s–early 90s), all under Joe Gibbs.",
      "No Super Bowl appearances in the 2000s or 2010s.",
    ],
    scotlandHook:
      "Burgundy and gold in the capital. A club still introducing its new name, which is fine — you can start on the same page.",
  },
];

export const teamProfileNote =
  "Stadium names and listed seating capacities are for the 2026 NFL season, mainly from Wikipedia’s current NFL stadiums list (cited there to club media guides and reporting). Super Bowl counts are after Super Bowl LX (8 February 2026). Naming rights, renovations and new builds change — treat figures as a snapshot, not a deed.";

export const divisions: { conference: Conference; division: Division }[] = [
  { conference: "AFC", division: "East" },
  { conference: "AFC", division: "North" },
  { conference: "AFC", division: "South" },
  { conference: "AFC", division: "West" },
  { conference: "NFC", division: "East" },
  { conference: "NFC", division: "North" },
  { conference: "NFC", division: "South" },
  { conference: "NFC", division: "West" },
];

export function getTeamProfile(slug: string): TeamProfile | undefined {
  return teamProfiles.find((team) => team.slug === slug);
}

export function getTeamProfileByAbbr(abbreviation: string): TeamProfile | undefined {
  return teamProfiles.find(
    (team) => team.abbreviation.toLowerCase() === abbreviation.toLowerCase(),
  );
}

export function getTeamSlugs(): string[] {
  return teamProfiles.map((team) => team.slug);
}

export function teamsInDivision(conference: Conference, division: Division): TeamProfile[] {
  return teamProfiles.filter(
    (team) => team.conference === conference && team.division === division,
  );
}

export function teamProfilePath(team: Pick<TeamProfile, "slug">): string {
  return `/teams/${team.slug}`;
}
