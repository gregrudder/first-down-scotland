export type Rivalry = {
  id: string;
  home: string;
  away: string;
  title: string;
  division: string;
  why: string;
  moments: string[];
};

export const rivalriesIntro = {
  eyebrow: "The grudges",
  title: "NFL rivalries",
  lead:
    "A rivalry is not just two clubs on the same fixture list. It is a game the supporters mark in the calendar, the commentary treats as personal, and the players still talk about years later. You do not need to pick a side tonight. You do need to know why some Sundays sound louder than others.",
};

/**
 * Well-known, widely reported rivalries and moments only.
 * Scores and dates follow published championship / play-off games.
 * We do not invent stats or “greatest ever” rankings.
 */
export const rivalries: Rivalry[] = [
  {
    id: "packers-bears",
    home: "GB",
    away: "CHI",
    title: "Packers v Bears",
    division: "NFC North · the oldest one",
    why: "This is the league’s longest-running club rivalry. Green Bay and Chicago first met in 1921, when the NFL was still finding its feet. They play twice most seasons, in the same division, and the history is the point: frozen midwestern afternoons, old stadiums, and two sets of supporters who have been arguing for a century. If someone says “the oldest rivalry in football”, they mean this, not a Premier League derby.",
    moments: [
      "First official meeting: 1921. Chicago won that one. The series has been running ever since.",
      "They have played each other more times than any other pair of NFL clubs.",
      "The 2010 NFC Championship was a rare title-game meeting: the Packers won in Chicago and went on to Super Bowl XLV.",
    ],
  },
  {
    id: "cowboys-eagles",
    home: "DAL",
    away: "PHI",
    title: "Cowboys v Eagles",
    division: "NFC East · twice a year, no love lost",
    why: "Dallas and Philadelphia share a division, so they see each other every season. Dallas spent decades marketed as “America’s Team”. Philadelphia’s crowd is famous for being unforgiving. Put those two facts in one stadium and you get a fixture that feels like a cup tie even in week four. Commentators will talk about “NFC East football”: messy, physical, and rarely polite.",
    moments: [
      "The 1980 NFC Championship: Philadelphia beat Dallas and reached Super Bowl XV.",
      "Thanksgiving 1989 is remembered as the Bounty Bowl: the Eagles won 27–0 in Dallas, and Philadelphia’s coach Buddy Ryan was accused of putting money on hurting Cowboys players. A rematch later that season kept the row going.",
      "The clubs have met in the play-offs more than once since. The dislike does not need a final to stay warm.",
    ],
  },
  {
    id: "cowboys-49ers",
    home: "DAL",
    away: "SF",
    title: "Cowboys v 49ers",
    division: "NFC · 1980s and 1990s title fights",
    why: "They are not in the same division, so they do not meet every week. When they do, the history is heavy. In the 1980s and 1990s these were often the two best sides in the NFC, and the winner went to the Super Bowl. UK viewers still hear “The Catch” as if everyone was there. You were not. Here is what it was.",
    moments: [
      "January 1982, NFC Championship (1981 season): Joe Montana threw to Dwight Clark in the back of the end zone. San Francisco beat Dallas 28–27. That play is simply called The Catch. The 49ers then won Super Bowl XVI.",
      "The early 1990s: Dallas won NFC Championship meetings in the 1992 and 1993 seasons. San Francisco won the 1994 meeting. Each winner took the Super Bowl that year.",
    ],
  },
  {
    id: "packers-cowboys",
    home: "GB",
    away: "DAL",
    title: "Packers v Cowboys",
    division: "NFC · the Ice Bowl",
    why: "Green Bay and Dallas have a title-game past that still gets replayed every December. The Ice Bowl is the one you will hear. It is not a nickname for “a bit chilly”. It is the coldest NFL game on record, and it decided the 1967 NFL championship.",
    moments: [
      "31 December 1967 at Lambeau Field: kick-off temperature about −25°C (Americans quote −13°F). Green Bay 21–17 Dallas.",
      "With seconds left, Bart Starr sneaked over the goal line behind a block from Jerry Kramer and Ken Bowman. Vince Lombardi’s Packers went on to Super Bowl II.",
      "Later generations still treat a Packers–Cowboys Sunday as a throwback, even when neither side is chasing a trophy.",
    ],
  },
  {
    id: "steelers-ravens",
    home: "PIT",
    away: "BAL",
    title: "Steelers v Ravens",
    division: "AFC North · the physical one",
    why: "Pittsburgh and Baltimore play in the same division and both built their reputations on defence. The games are often low-scoring, late-hitting, and decided by a turnover rather than a 40-yard dance. If you want to see what “AFC North football” means, start here. Ray Lewis’s Ravens and the Steelers’ linebacker tradition are the names people still attach to it.",
    moments: [
      "Both clubs have won multiple Super Bowls. The rivalry is about who owns the North, not one famous play.",
      "They have met in the play-offs several times in the 2000s and 2010s, including AFC Championship and divisional games. The 2008 AFC Championship went to Pittsburgh, who then won Super Bowl XLIII.",
      "Expect commentators to talk about “hits” more than “scheme”. That is the culture of this fixture.",
    ],
  },
  {
    id: "steelers-raiders",
    home: "PIT",
    away: "LV",
    title: "Steelers v Raiders",
    division: "AFC · 1970s bad blood",
    why: "This one peaked in the 1970s, when both sides were excellent and both liked to hit people. The clubs have moved cities and decades since, but one play still defines the grudge: the Immaculate Reception. Raiders supporters will tell you it should not have counted. Steelers supporters will tell you it did. That argument is the rivalry.",
    moments: [
      "23 December 1972, AFC play-off in Pittsburgh: Terry Bradshaw’s pass was deflected. Franco Harris scooped the ball just above the turf and ran for a touchdown. Steelers 13–7 Raiders. Officials allowed it. Oakland never quite forgave them.",
      "They then met in the play-offs in several of the next seasons. Pittsburgh beat Oakland in the 1974 and 1975 AFC Championships on the way to Super Bowls IX and X. The Raiders won the 1976 AFC Championship and Super Bowl XI.",
    ],
  },
  {
    id: "chiefs-raiders",
    home: "KC",
    away: "LV",
    title: "Chiefs v Raiders",
    division: "AFC West · AFL originals",
    why: "Kansas City and the Raiders have been at this since the 1960s American Football League, before the Super Bowl was a normal word. Lamar Hunt’s Chiefs and Al Davis’s Raiders were two of that league’s loudest personalities. They still share a division. The cities have changed (the Raiders went Oakland to Los Angeles to Las Vegas), the dislike did not.",
    moments: [
      "AFL-era meetings helped make the West a weekly argument, not a regional afterthought.",
      "The clubs have traded division titles for decades. In the late 2010s and early 2020s Kansas City, with Patrick Mahomes, usually had the better of it.",
      "You will still hear older supporters talk about “Raider week” in Kansas City as if it were a bank holiday.",
    ],
  },
  {
    id: "49ers-seahawks",
    home: "SF",
    away: "SEA",
    title: "49ers v Seahawks",
    division: "NFC West · 2010s peak",
    why: "San Francisco and Seattle share the NFC West. The rivalry boiled over in the early 2010s, when Jim Harbaugh’s 49ers and Pete Carroll’s Seahawks were both Super Bowl sides and both very sure of themselves. Richard Sherman, Colin Kaepernick, Marshawn Lynch: if you watched any NFL in Britain that decade, you saw these games.",
    moments: [
      "January 2014, NFC Championship (2013 season) in Seattle: Richard Sherman tipped Colin Kaepernick’s pass intended for Michael Crabtree. Malcolm Smith intercepted it. Seattle 23–17 San Francisco. The Seahawks then won Super Bowl XLVIII.",
      "Fans still call that tip the Immaculate Deflection, as a nod to the older Pittsburgh play.",
      "They keep meeting in December with a division title on the line. The 2010s noise is what UK viewers remember.",
    ],
  },
  {
    id: "patriots-jets",
    home: "NE",
    away: "NYJ",
    title: "Patriots v Jets",
    division: "AFC East · the neighbours",
    why: "New England and the New York Jets sit in the same division and, roughly, the same corner of the country. For twenty years the story was Tom Brady and Bill Belichick against whoever the Jets had hired to stop them. The Jets have Super Bowl history of their own (Joe Namath, Super Bowl III), which is why the gap in the Brady years stung.",
    moments: [
      "The 2000s and 2010s were mostly New England’s era. Jets–Patriots week was when New York tried to be the team that spoiled it.",
      "Rex Ryan’s Jets sides in 2009–2010 reached AFC Championship games and made beating New England a personality trait.",
      "Thanksgiving 2012 in Detroit: a Jets fumble by Mark Sanchez, colliding with his own lineman, became a clip people still send around. The Patriots won that game. The clip outlived the scoreline.",
    ],
  },
  {
    id: "giants-eagles",
    home: "NYG",
    away: "PHI",
    title: "Giants v Eagles",
    division: "NFC East · New York and Philadelphia",
    why: "Two big cities, one division, a short train ride, and a long memory. New York and Philadelphia already dislike each other in other sports. The NFL version is the same energy in pads. When both are decent, the late-season meeting can decide who gets into the play-offs.",
    moments: [
      "19 December 2010: the Miracle at the New Meadowlands. Philadelphia trailed 31–10 and won 38–31. DeSean Jackson returned a punt for a touchdown as the clock hit zero.",
      "The clubs have swapped the NFC East title many times. The fixture does not need a Super Bowl to matter.",
    ],
  },
  {
    id: "cowboys-commanders",
    home: "DAL",
    away: "WSH",
    title: "Cowboys v Commanders",
    division: "NFC East · an old Washington–Dallas fight",
    why: "Before the Washington club was called the Commanders, this was one of the NFL’s headline rivalries: Dallas against Washington, often with a division title in the middle. Tom Landry’s Cowboys and the Washington sides of George Allen and later Joe Gibbs filled American television in the 1970s and 1980s. The name on the helmet changed in 2022. The fixture is still on the calendar twice a year.",
    moments: [
      "The 1970s and 1980s meetings were regular national television events, not just local derbies.",
      "Joe Gibbs’s Washington sides won three Super Bowls (XVII, XXII, XXVI) in an era when Dallas was a constant measuring stick.",
      "Today it is still an NFC East game: two old clubs, two home crowds that remember the older name for the grudge even if they use the new one on the shirt.",
    ],
  },
  {
    id: "saints-falcons",
    home: "NO",
    away: "ATL",
    title: "Saints v Falcons",
    division: "NFC South · the Southern derby",
    why: "New Orleans and Atlanta are the two big NFC South cities that sit close enough to visit and far enough to sneer. The Who Dat crowd and the Dirty Birds treat this as their local final. It is not as old as Packers–Bears. It is as loud as a Saturday night on Bourbon Street when both sides are in it.",
    moments: [
      "They have been division rivals since the NFC South was created in 2002, and they played each other for decades before that.",
      "The 2010s, with Drew Brees in New Orleans and Matt Ryan in Atlanta, produced a run of high-scoring games that often decided the South.",
      "Neither club needs a historic nickname for the fixture. “Saints–Falcons week” is enough in both cities.",
    ],
  },
  {
    id: "rams-49ers",
    home: "LAR",
    away: "SF",
    title: "Rams v 49ers",
    division: "NFC West · California, twice",
    why: "Two California clubs (the Rams now in Los Angeles, after years in St. Louis) sharing a division. The 1980s had a West Coast edge. The 2010s and 2020s brought it back: Sean McVay’s Rams and the 49ers under Kyle Shanahan have met with Super Bowl places on the line.",
    moments: [
      "They have shared a division, off and on, for most of the Super Bowl era. The geography makes it a natural grudge.",
      "The 2021 NFC Championship: Los Angeles beat San Francisco, then won Super Bowl LVI at home in SoFi Stadium.",
      "They keep meeting in January. If you hear “NFC West is a dogfight”, this fixture is usually why.",
    ],
  },
  {
    id: "browns-steelers",
    home: "CLE",
    away: "PIT",
    title: "Browns v Steelers",
    division: "AFC North · Ohio and Pennsylvania",
    why: "Cleveland and Pittsburgh are close, industrial, and unsentimental. They have been playing since the 1950s. The Steelers became the trophy side. The Browns became the club that kept turning up anyway. The games are often ugly in a way supporters of both sides would take as a compliment.",
    moments: [
      "The series dates to 1950, when the Browns joined the NFL. That is proper history, not a marketing slogan.",
      "Pittsburgh’s 1970s dynasty made the fixture lopsided for a while. Cleveland still treats a win in Pittsburgh as a season highlight.",
      "It is a division game twice a year. Weather, defence, and a short trip: very AFC North.",
    ],
  },
];

export const rivalriesSourcesNote =
  "Championship scores and famous play names follow published NFL and Pro Football Hall of Fame accounts (Ice Bowl, The Catch, Immaculate Reception, 2013 NFC Championship, Miracle at the New Meadowlands, Bounty Bowl). Franchise moves and Super Bowl numbers follow the league’s own records. We skip disputed stats and anything we cannot pin to a well-known game.";
