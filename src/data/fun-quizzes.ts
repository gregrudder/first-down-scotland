import type { MiniGame } from "@/data/mini-game-types";

/**
 * Entertainment quizzes, just for fun.
 * Not a rules lesson: famous moments, banter, and pub-table recall.
 */
export const funQuizzes: MiniGame[] = [
  {
    slug: "super-bowl-that",
    title: "Which Super Bowl was that?",
    summary:
      "Famous finishes, MVPs, and the Roman numeral people actually mean. Recall, not a history lecture.",
    minutes: 4,
    kind: "fun",
    learnHref: "/history",
    learnLabel: "NFL history, quickly",
    questions: [
      {
        id: "helmet-catch",
        prompt: "David Tyree pinned a ball to his helmet. Which Super Bowl, and who won?",
        options: [
          "Super Bowl XLII: Giants beat the Patriots",
          "Super Bowl LI: Patriots beat the Falcons",
          "Super Bowl XLIX: Patriots beat the Seahawks",
          "Super Bowl LII: Eagles beat the Patriots",
        ],
        correctIndex: 0,
        explain:
          "February 2008. Eli Manning escaped the rush, Tyree trapped it on his helmet, and New York ruined New England’s 19-0 season. Super Bowl XLII, Giants 17-14.",
      },
      {
        id: "twenty-eight-three",
        prompt: "A side led 28-3 in a Super Bowl and still lost. Which one?",
        options: [
          "Super Bowl XLVIII, Broncos v Seahawks",
          "Super Bowl LI, Falcons v Patriots",
          "Super Bowl LII, Eagles v Patriots",
          "Super Bowl XXXVI, Rams v Patriots",
        ],
        correctIndex: 1,
        explain:
          "Atlanta 28-3 in Super Bowl LI. New England tied it, then won 34-28 in the first Super Bowl overtime. Brady took the MVP. Falcons supporters still feel it in their teeth.",
      },
      {
        id: "philly-special",
        prompt: "The Philly Special: a tight end threw a touchdown to the quarterback. Which Super Bowl?",
        options: [
          "Super Bowl LII: Eagles beat the Patriots",
          "Super Bowl XXXIX: Patriots beat the Eagles",
          "Super Bowl LVII: Chiefs beat the Eagles",
          "Super Bowl LIX: Eagles beat the Chiefs",
        ],
        correctIndex: 0,
        explain:
          "Super Bowl LII, February 2018. Direct snap, pitch, Trey Burton to Nick Foles. Philadelphia 41-33 New England, and Foles was MVP. They got the Chiefs later, in Super Bowl LIX. Different night.",
      },
      {
        id: "butler-pick",
        prompt: "Malcolm Butler’s goal-line interception stopped a famous “just run it” argument. Who lost?",
        options: [
          "The Patriots, Super Bowl XLIX",
          "The Seahawks, Super Bowl XLIX",
          "The 49ers, Super Bowl LIV",
          "The Rams, Super Bowl LIII",
        ],
        correctIndex: 1,
        explain:
          "February 2015, Super Bowl XLIX. Seattle, second and goal, late. Russell Wilson’s slant for Ricardo Lockette was picked by Butler. Patriots 28-24. Marshawn Lynch was on the field. The internet never left.",
      },
      {
        id: "the-tackle",
        prompt: "Mike Jones tackled Kevin Dyson one yard short as time expired. Which Super Bowl?",
        options: [
          "Super Bowl XXXIV: Rams beat the Titans",
          "Super Bowl XXXII: Broncos beat the Packers",
          "Super Bowl XLIII: Steelers beat the Cardinals",
          "Super Bowl XXV: Giants beat the Bills",
        ],
        correctIndex: 0,
        explain:
          "January 2000. Kurt Warner’s Rams, 23-16 Tennessee. Last play, Dyson stretched for the line and Jones wrapped him up. They still call it The Tackle.",
      },
      {
        id: "wide-right",
        prompt: "Scott Norwood’s kick sailed wide right. Which Super Bowl did the Bills lose?",
        options: [
          "Super Bowl XXV, to the Giants",
          "Super Bowl XXVI, to the Redskins",
          "Super Bowl XXVII, to the Cowboys",
          "Super Bowl XXVIII, to the Cowboys again",
        ],
        correctIndex: 0,
        explain:
          "January 1991, Super Bowl XXV. Giants 20-19. Norwood’s 47-yarder missed right. Buffalo then lost the next three Super Bowls as well. This is the miss people still mime.",
      },
      {
        id: "seattle-blowout",
        prompt: "Which Super Bowl was the 43-8 hammering, Seahawks defence over a record-breaking Broncos attack?",
        options: [
          "Super Bowl XLVIII",
          "Super Bowl XLIX",
          "Super Bowl XLV",
          "Super Bowl 50",
        ],
        correctIndex: 0,
        explain:
          "February 2014. Peyton Manning’s Broncos had just set scoring records. Seattle’s Legion of Boom won 43-8. Linebacker Malcolm Smith was MVP. Super Bowl XLIX, a year later, was the Butler game.",
      },
      {
        id: "brady-first",
        prompt: "Tom Brady’s first Super Bowl win, as the young Patriots starter. Which one?",
        options: [
          "Super Bowl XXXVI, Patriots beat the Rams",
          "Super Bowl XXXVIII, Patriots beat the Panthers",
          "Super Bowl XXXIX, Patriots beat the Eagles",
          "Super Bowl LI, Patriots beat the Falcons",
        ],
        correctIndex: 0,
        explain:
          "February 2002, Super Bowl XXXVI. New England 20-17 over “The Greatest Show on Turf”. Brady was Super Bowl MVP. The dynasty starts here, not with the later comeback nights.",
      },
    ],
  },
  {
    slug: "nfl-or-nonsense",
    title: "NFL or nonsense?",
    summary:
      "Real league lore versus things we invented in the kitchen. If it sounds too daft, check twice: some of the real ones are dafter.",
    minutes: 4,
    kind: "fun",
    learnHref: "/mini-games",
    learnLabel: "More quizzes",
    questions: [
      {
        id: "packers-owned",
        prompt: "The Green Bay Packers are a publicly owned club, with ordinary supporters holding shares. NFL, or nonsense?",
        options: ["NFL: that is real", "Nonsense: we made it up"],
        correctIndex: 0,
        explain:
          "Real. Green Bay Packers, Inc. is community-owned. It is the odd one out in a league of billionaire toys, and why “the fans own the team” is not just a scarf slogan there.",
      },
      {
        id: "super-bowl-50",
        prompt: "The Super Bowl is always written in Roman numerals. NFL, or nonsense?",
        options: ["NFL: always Roman", "Nonsense: they skipped it once"],
        correctIndex: 1,
        explain:
          "They bottled Super Bowl 50 and printed a nice big 50 instead of L. Then they went straight back to Roman numerals, because of course they did.",
      },
      {
        id: "steelers-one-side",
        prompt: "The Steelers only put their logo on one side of the helmet. NFL, or nonsense?",
        options: ["NFL: one side only", "Nonsense: both sides, like everyone else"],
        correctIndex: 0,
        explain:
          "Real. Logo on the right side, plain black on the left. It started as a temporary look and then became the most stubborn branding decision in Pittsburgh.",
      },
      {
        id: "lombardi-house",
        prompt: "The Super Bowl winner gets the Vince Lombardi Trophy and a free house in Texas. NFL, or nonsense?",
        options: ["NFL: trophy and the house", "Nonsense: just the trophy (and the rings)"],
        correctIndex: 1,
        explain:
          "Nonsense. You get the silver trophy, a ring, a parade, and a summer of shirt sales. Nobody hands you a bungalow in Austin. We checked. Sadly.",
      },
      {
        id: "super-ball",
        prompt: "The name “Super Bowl” started as a joke mixing college bowl games and a bouncy Super Ball toy. NFL, or nonsense?",
        options: ["NFL: Lamar Hunt really went there", "Nonsense: it was a focus group in 1994"],
        correctIndex: 0,
        explain:
          "Real. AFL founder Lamar Hunt coined it after the Super Ball craze. The league pretended it was a working title. Fifty-odd years later we are still saying it with a straight face.",
      },
      {
        id: "raiders-cities",
        prompt: "The Raiders have called three different cities home as the same franchise. NFL, or nonsense?",
        options: ["NFL: Oakland, Los Angeles, Las Vegas", "Nonsense: they have always been in Vegas"],
        correctIndex: 0,
        explain:
          "Real. Oakland, then Los Angeles, back to Oakland, then Las Vegas. Same pirate, different postcode. The kit stayed silver and black the whole time.",
      },
      {
        id: "london-regular",
        prompt: "London has hosted regular-season NFL games, not just friendlies. NFL, or nonsense?",
        options: ["NFL: Wembley and Tottenham, proper league games", "Nonsense: only pre-season tourist matches"],
        correctIndex: 0,
        explain:
          "Real since 2007: Giants v Dolphins at Wembley was the first regular-season game over here. Tottenham joined the rota later. The Jaguars have been the most regular London “home” side.",
      },
      {
        id: "halftime-kettle",
        prompt: "Which of these is nonsense we invented?",
        options: [
          "A Super Bowl has been decided in overtime",
          "Tom Brady was a sixth-round draft pick",
          "The Super Bowl trophy is refilled with Irn-Bru and passed along the front row",
          "The Browns wear an orange helmet with no logo",
        ],
        correctIndex: 2,
        explain:
          "The Irn-Bru one is ours. Super Bowl LI and LVIII both went to overtime, Brady really was pick 199, and Cleveland’s helmet is still a beautiful blank orange.",
      },
    ],
  },
  {
    slug: "name-the-catch",
    title: "Name the catch",
    summary:
      "Iconic grabs from a couple of clues. No diagrams. If you have seen the clip a hundred times, this is your moment.",
    minutes: 4,
    kind: "fun",
    learnHref: "/learn/famous-players",
    learnLabel: "Famous players",
    questions: [
      {
        id: "the-catch",
        prompt: "Name the catch.",
        clues: [
          "NFC Championship, January 1982.",
          "Joe Montana, rolling right, throws high to the back of the end zone.",
          "Dwight Clark goes up. Dallas lose. San Francisco go to Super Bowl XVI.",
        ],
        options: ["The Catch", "The Helmet Catch", "The Catch II", "The Immaculate Reception"],
        correctIndex: 0,
        explain:
          "Just “The Catch”. 49ers 28-27 Cowboys. Every later “Catch II” or “Catch III” is admitting this one got there first.",
      },
      {
        id: "helmet",
        prompt: "Name the catch.",
        clues: [
          "Super Bowl XLII.",
          "Eli Manning is almost sacked.",
          "David Tyree, Giants, traps the ball against his helmet for a first down.",
        ],
        options: ["The Helmet Catch", "The Catch", "The Tackle", "The Immaculate Reception"],
        correctIndex: 0,
        explain:
          "The Helmet Catch. It set up the Super Bowl-winning score. Tyree was not a star; the clip made him one anyway.",
      },
      {
        id: "immaculate",
        prompt: "Name the play.",
        clues: [
          "Play-off game, 1972, Pittsburgh v Oakland.",
          "A pass is deflected.",
          "Franco Harris scoops it off his shoe tops and scores.",
        ],
        options: ["The Immaculate Reception", "The Helmet Catch", "The Music City Miracle", "The Minneapolis Miracle"],
        correctIndex: 0,
        explain:
          "The Immaculate Reception. Steelers 13-7 Raiders. Oakland still argues whether it touched a Steeler first. Pittsburgh framed the argument and hung it in a museum.",
      },
      {
        id: "obj",
        prompt: "Name the catch.",
        clues: [
          "Giants v Cowboys, 2014, on Sunday night.",
          "Eli Manning throws it to the sideline.",
          "Odell Beckham Jr, falling backwards, one hand, three fingers, and a million replays.",
        ],
        options: [
          "Odell’s one-hander against Dallas",
          "The Catch",
          "Santonio Holmes’ Super Bowl toe-tap",
          "The Catch II",
        ],
        correctIndex: 0,
        explain:
          "November 2014. It did not win a title. It did win the internet. If someone says “the Odell catch” and does not specify, they mean this one.",
      },
      {
        id: "holmes",
        prompt: "Name the catch.",
        clues: [
          "Super Bowl XLIII, Steelers v Cardinals.",
          "Last minute, back corner of the end zone.",
          "Santonio Holmes gets both toes down. Pittsburgh 27-23.",
        ],
        options: [
          "Holmes’ Super Bowl toe-tap",
          "The Helmet Catch",
          "Lynn Swann in Super Bowl X",
          "The Minneapolis Miracle",
        ],
        correctIndex: 0,
        explain:
          "February 2009. Ben Roethlisberger to Holmes. The Cardinals had just taken the lead. Holmes tiptoed the chalk and the Steelers had their sixth title.",
      },
      {
        id: "diggs",
        prompt: "Name the play.",
        clues: [
          "NFC Divisional, January 2018.",
          "Vikings, Case Keenum, last seconds, down one to the Saints.",
          "Stefon Diggs catches it, stays in bounds, and walks into the end zone as time dies.",
        ],
        options: ["The Minneapolis Miracle", "The Music City Miracle", "The Catch II", "The Immaculate Reception"],
        correctIndex: 0,
        explain:
          "Minneapolis Miracle. Vikings 29-24 Saints. The next week Philadelphia ended the fairy tale 38-7. The clip still slaps.",
      },
      {
        id: "catch-two",
        prompt: "Name the catch.",
        clues: [
          "Wild-card game, January 1999, 49ers v Packers.",
          "Steve Young, last play.",
          "Terrell Owens, leaping in the end zone. San Francisco 30-27.",
        ],
        options: ["The Catch II", "The Catch", "The Helmet Catch", "The Minneapolis Miracle"],
        correctIndex: 0,
        explain:
          "The Catch II. Young to Owens. Green Bay had owned that rivalry in the 1990s; this was the night the 49ers stole one back on the last snap.",
      },
      {
        id: "dez",
        prompt: "Name the argument.",
        clues: [
          "Cowboys v Packers, NFC Divisional, January 2015.",
          "Dez Bryant goes up on fourth down, reaches the ball toward the goal line, and it comes loose as he hits the ground.",
          "Ruled incomplete. Dallas supporters have not moved on.",
        ],
        options: [
          "“Dez caught it”",
          "The Catch",
          "The Calvin Johnson rule, 2010 v Chicago",
          "The Helmet Catch",
        ],
        correctIndex: 0,
        explain:
          "“Dez caught it” is the chant, the meme, and the pub fight. The league later tweaked how it talks about going to the ground. Green Bay still advanced. Dallas still has the clip.",
      },
    ],
  },
  {
    slug: "rivalry-radar",
    title: "Rivalry radar",
    summary:
      "Match the grudge, the nickname, and the other lot. Not a lesson on why they hate each other, just who belongs with whom.",
    minutes: 4,
    kind: "fun",
    learnHref: "/learn/rivalries",
    learnLabel: "Rivalries, the reading",
    questions: [
      {
        id: "oldest-pair",
        prompt: "Green Bay’s oldest club rivalry, running since 1921, is with which side?",
        options: ["Chicago Bears", "Dallas Cowboys", "Minnesota Vikings", "Detroit Lions"],
        correctIndex: 0,
        explain:
          "Packers v Bears. They have played each other more than any other pair. Vikings and Lions are family rows. Chicago is the hundred-year one.",
      },
      {
        id: "americas-team",
        prompt: "Which club spent decades marketed as “America’s Team”?",
        options: ["Dallas Cowboys", "New England Patriots", "Green Bay Packers", "Pittsburgh Steelers"],
        correctIndex: 0,
        explain:
          "Dallas. The nickname is a television line that stuck, which is one reason Philadelphia enjoys beating them so much.",
      },
      {
        id: "battle-ohio",
        prompt: "The Battle of Ohio is which fixture?",
        options: [
          "Browns v Bengals",
          "Steelers v Ravens",
          "Colts v Titans",
          "Bills v Jets",
        ],
        correctIndex: 0,
        explain:
          "Cleveland v Cincinnati. Same state, same division, very little poetry. Steelers v Ravens is the other AFC North bloodbath, with a different nickname: just “that game”.",
      },
      {
        id: "afc-north-purple",
        prompt: "When the Steelers play the purple lot in the AFC North, who is coming to town?",
        options: ["Baltimore Ravens", "Minnesota Vikings", "Kansas City Chiefs", "Buffalo Bills"],
        correctIndex: 0,
        explain:
          "Ravens. Purple and black, same division, two defences that treat the other as a personal insult. Minnesota are purple too, but they live in the NFC North.",
      },
      {
        id: "afl-grudge",
        prompt: "The old AFL grudge that still shows up as Chiefs v ______?",
        options: ["Raiders", "Broncos", "Chargers", "Bills"],
        correctIndex: 0,
        explain:
          "Chiefs v Raiders. Lamar Hunt’s club against Al Davis’s club, from the 1960s AFL onward. The Raiders moved cities. The dislike did not need a forwarding address.",
      },
      {
        id: "iggles",
        prompt: "If the crowd is chanting “Iggles”, which club is at home?",
        options: ["Philadelphia Eagles", "Seattle Seahawks", "Atlanta Falcons", "Arizona Cardinals"],
        correctIndex: 0,
        explain:
          "Eagles. Philadelphia says it that way, on purpose. Seahawks fans have the “Sea-hawks” clap. Different noise, different city.",
      },
      {
        id: "harbaugh",
        prompt: "The Harbaugh Bowl Super Bowl was which pair of brothers’ clubs?",
        options: [
          "Ravens (John) v 49ers (Jim), Super Bowl XLVII",
          "Ravens (John) v Chargers (Jim), Super Bowl 50",
          "Steelers v Ravens, Super Bowl XLIII",
          "49ers v Chiefs, Super Bowl LIV",
        ],
        correctIndex: 0,
        explain:
          "February 2013. John Harbaugh’s Ravens beat Jim Harbaugh’s 49ers 34-31. Super Bowl 50 was Denver over Carolina, no brothers required.",
      },
      {
        id: "saints-falcons",
        prompt: "The Saints’ in-division “we see you twice a year and never wave” rival is?",
        options: ["Atlanta Falcons", "Dallas Cowboys", "Green Bay Packers", "Las Vegas Raiders"],
        correctIndex: 0,
        explain:
          "Falcons. NFC South, Georgia v Louisiana, Dirty Birds v Who Dat. Cowboys are a national event, not the neighbour.",
      },
    ],
  },
  {
    slug: "jersey-legends",
    title: "Jersey number legends",
    summary:
      "Famous numbers, famous backs. Who do people mean when they say 12, 80, or 56? Not a kit-history exam.",
    minutes: 4,
    kind: "fun",
    learnHref: "/learn/famous-players",
    learnLabel: "Famous players",
    questions: [
      {
        id: "brady-12",
        prompt: "If someone says “the Patriots 12” and means a religion, who are they talking about?",
        options: ["Tom Brady", "Tom Brady’s backup in 2001", "Julian Edelman", "Mac Jones"],
        correctIndex: 0,
        explain:
          "Tom Brady wore 12 in New England and Tampa Bay. Other people have worn it. Nobody else turned it into a census.",
      },
      {
        id: "rice-80",
        prompt: "Jerry Rice’s famous 49ers number?",
        options: ["80", "81", "88", "18"],
        correctIndex: 0,
        explain:
          "80. He wore it in San Francisco and later in Oakland. 88 is a different hallway of famous receivers.",
      },
      {
        id: "lt-56",
        prompt: "Lawrence Taylor’s Giants number: the one still used as a warning to left tackles?",
        options: ["56", "52", "55", "92"],
        correctIndex: 0,
        explain:
          "56. Ray Lewis was 52, Junior Seau 55, Reggie White 92. LT is the 56 people still mean.",
      },
      {
        id: "peyton-18",
        prompt: "Peyton Manning’s number with the Colts and the Broncos?",
        options: ["18", "16", "12", "10"],
        correctIndex: 0,
        explain:
          "18, both stops. Eli wore 10 in New York. Montana was 16. If you said 18 you have watched a Sunday.",
      },
      {
        id: "sanders-20",
        prompt: "Barry Sanders’ Lions number?",
        options: ["20", "34", "32", "22"],
        correctIndex: 0,
        explain:
          "20. Walter Payton was 34, Jim Brown 32, Emmitt Smith 22. Detroit retired 20 and still look a bit sad about it.",
      },
      {
        id: "payton-34",
        prompt: "Sweetness (Walter Payton) wore which number for the Bears?",
        options: ["34", "20", "40", "9"],
        correctIndex: 0,
        explain:
          "34. The Bears later put 34 on more merch than most cities put on a cathedral. Jim McMahon was the 9 from that Super Bowl side.",
      },
      {
        id: "montana-16",
        prompt: "Joe Montana’s 49ers number?",
        options: ["16", "15", "13", "8"],
        correctIndex: 0,
        explain:
          "16. Steve Young later made 8 famous in the same building. Mahomes is 15. Marino was 13. Montana is the 16.",
      },
      {
        id: "gronk-87",
        prompt: "Rob Gronkowski’s Patriots (and Super Bowl LV Buccaneers) number?",
        options: ["87", "85", "88", "81"],
        correctIndex: 0,
        explain:
          "87. Spike it, spike the answer, sit down. Plenty of tight ends wore 85. Gronk’s is the one that still gets shouted at weddings.",
      },
    ],
  },
  {
    slug: "draft-day-chaos",
    title: "Draft day chaos",
    summary:
      "Memorable picks, trades, and “wait, they took him where?” nights. Fair trivia, not a pile-on.",
    minutes: 4,
    kind: "fun",
    learnHref: "/learn/the-draft",
    learnLabel: "How the Draft works",
    questions: [
      {
        id: "brady-199",
        prompt: "Tom Brady, 2000 NFL Draft: which round, and roughly which pick?",
        options: [
          "Sixth round, pick 199",
          "First round, pick 1",
          "Third round, pick 64",
          "Undrafted",
        ],
        correctIndex: 0,
        explain:
          "Sixth round, 199th overall, New England. Six quarterbacks went before him. The clip of him looking slightly lost in a terrible shirt is a museum piece now.",
      },
      {
        id: "eli-trade",
        prompt: "In 2004 Eli Manning was drafted first overall by which club, then traded to the Giants?",
        options: ["San Diego Chargers", "New York Giants", "Indianapolis Colts", "Oakland Raiders"],
        correctIndex: 0,
        explain:
          "The Chargers called the name. Eli’s camp had already said he would not play there. Philip Rivers and extra picks went to San Diego; Eli went to New York. Both had long careers. The press conference was spicy.",
      },
      {
        id: "elway-colts",
        prompt: "John Elway was drafted first in 1983 by a club he refused to play for. Which one?",
        options: [
          "The Baltimore Colts",
          "The Denver Broncos",
          "The New York Yankees, as a quarterback",
          "The Houston Oilers",
        ],
        correctIndex: 0,
        explain:
          "The Colts, still in Baltimore then. Elway had baseball leverage with the Yankees and forced a trade to Denver. The Colts later moved to Indianapolis. Elway became a Broncos statue.",
      },
      {
        id: "rodgers-24",
        prompt: "2005: Alex Smith went first overall. Which quarterback slid to pick 24 and later won MVPs in Green Bay?",
        options: ["Aaron Rodgers", "Philip Rivers", "Eli Manning", "Ben Roethlisberger"],
        correctIndex: 0,
        explain:
          "Aaron Rodgers, Packers. The camera on him in the green room sat there for a long time. Smith had a good career of his own. The slide is still the clip.",
      },
      {
        id: "mahomes-2017",
        prompt: "2017: the Chiefs traded up for Patrick Mahomes. Who went first overall that year?",
        options: ["Myles Garrett", "Mitchell Trubisky", "Deshaun Watson", "Baker Mayfield"],
        correctIndex: 0,
        explain:
          "Myles Garrett to Cleveland, first overall. Mahomes went tenth, after Kansas City moved up with Buffalo. Trubisky went second to Chicago. Different careers, same first round.",
      },
      {
        id: "lamar-32",
        prompt: "2018: Lamar Jackson waited until pick 32. Who was the first name off the board that night?",
        options: ["Baker Mayfield", "Saquon Barkley", "Sam Darnold", "Josh Allen"],
        correctIndex: 0,
        explain:
          "Baker Mayfield to the Browns. Barkley went second, Darnold third, Allen seventh, Jackson 32nd to Baltimore. A quarterback class that still starts arguments in the pub.",
      },
      {
        id: "mr-irrelevant",
        prompt: "“Mr Irrelevant” is which draft honour?",
        options: [
          "The last pick of the entire draft",
          "The first pick of the seventh round",
          "Any undrafted rookie who makes a roster",
          "The player who skips the podium",
        ],
        correctIndex: 0,
        explain:
          "Last pick, full stop. It comes with a parade in Newport Beach and a nickname that is funnier when the player then starts in the NFC Championship (see Brock Purdy, 2022).",
      },
      {
        id: "leaf-1998",
        prompt: "1998: the Colts took Peyton Manning first. Who went second, in the draft night that became a cautionary tale?",
        options: ["Ryan Leaf", "Tom Brady", "Donovan McNabb", "Tim Couch"],
        correctIndex: 0,
        explain:
          "Ryan Leaf, Chargers. Manning became Manning. Leaf’s career did not last. The lesson people actually use is “two quarterbacks at the top is not a coin flip”. No need to pile on past that.",
      },
    ],
  },
  {
    slug: "uk-kickoff-survival",
    title: "UK kick-off survival",
    summary:
      "Late nights, early shifts, and the 6pm tea-time window. A bit of trivia, a bit of “what would a sensible Scot do?”",
    minutes: 5,
    kind: "fun",
    learnHref: "/late-night-diary",
    learnLabel: "Open Late Night Diary",
    questions: [
      {
        id: "one-et",
        prompt: "A 1:00pm ET Sunday game is usually what time in the UK?",
        options: ["6:00pm", "1:00pm", "11:00am", "3:00am"],
        correctIndex: 0,
        explain:
          "Add five hours, winter or summer. 1pm Eastern is the tea-time game: 6pm UK. That is the civilised one. Cherish it.",
      },
      {
        id: "snf",
        prompt: "Sunday Night Football, about 8:20pm ET, typically starts when for you?",
        options: [
          "About 1:20am UK",
          "8:20pm UK, nice and primetime",
          "Noon on Monday",
          "Half five on Saturday, if you squint",
        ],
        correctIndex: 0,
        explain:
          "1:20am. The US primetime window is our “why is the kettle on again” window. Late Night Diary exists so you can see that coming.",
      },
      {
        id: "four-twenty-five",
        prompt: "The 4:25pm ET Sunday window is usually what in Britain?",
        options: [
          "About 9:25pm: Channel 5’s comfort zone",
          "Breakfast, with toast",
          "Lunchtime in Aberdeen",
          "Tuesday, somehow",
        ],
        correctIndex: 0,
        explain:
          "9:25pm. That is the Sunday night game a lot of free-to-air coverage is built around. You can watch it and still meet Monday like an adult. Just.",
      },
      {
        id: "mnf-end",
        prompt: "Monday Night Football, if it stays on schedule, typically finishes around when in the UK?",
        options: [
          "Half four to 5am",
          "In time for the 10 o’clock news",
          "Before the watershed",
          "Never; it is filmed at 3pm in Florida for our convenience",
        ],
        correctIndex: 0,
        explain:
          "An 8:15pm ET kick-off is 1:15am UK and a three-hour game lands you near 4:30-5am. Overtime is how people end up texting “I’m fine” to their manager.",
      },
      {
        id: "super-bowl-uk",
        prompt: "A typical Super Bowl kick-off (around 6:30pm ET) is what for Scotland?",
        options: [
          "About 11:30pm",
          "6:30pm, a civilised Saturday tea",
          "Sunday breakfast",
          "Thursday lunch, because of the international date line",
        ],
        correctIndex: 0,
        explain:
          "11:30pm start, finish in the small hours. The halftime show is midnight-plus. Plan the snacks before the ads, not during.",
      },
      {
        id: "london-time",
        prompt: "A regular-season London game at Wembley or Tottenham is usually kick-off at…",
        options: [
          "A civilised afternoon, often about 2:30pm UK",
          "1:20am, to match Sunday Night Football",
          "6am, for the West Coast feed",
          "Whenever the referee’s flight lands",
        ],
        correctIndex: 0,
        explain:
          "Afternoon kick-off, proper daylight, pubs full of people who do not look like they have made a mistake. That is the point of the International Series.",
      },
      {
        id: "sensible-snf",
        prompt: "Sunday Night Football is on and you have a 9am shift in Edinburgh. What is the First Down move?",
        options: [
          "Check Late Night Diary, set a hard bedtime, watch the condensed game in the morning",
          "Watch every snap, then invent a new identity at work",
          "Phone your boss at 1:15am to explain fourth down",
          "Move to Miami so the kick-off is lunch",
        ],
        correctIndex: 0,
        explain:
          "That is the correct answer on this site, and also in life. The condensed game still has the touchdowns. Your shift still has you.",
      },
      {
        id: "add-five",
        prompt: "A US graphic only gives Eastern time. The rule of thumb this site uses is?",
        options: [
          "Add five hours for the UK",
          "Subtract five hours",
          "Add eight, always, because of California",
          "Ignore it and guess from the sky",
        ],
        correctIndex: 0,
        explain:
          "Eastern plus five. Central six, Mountain seven, Pacific eight. Daylight saving does not break that rule of thumb. Fixtures on this site are already in Europe/London.",
      },
    ],
  },
  {
    slug: "logo-colour-call",
    title: "Logo & colour call",
    summary:
      "Name the club from the kit, the badge, or the helmet habit. Text clues only, no clip art required.",
    minutes: 4,
    kind: "fun",
    learnHref: "/teams",
    learnLabel: "All 32 clubs",
    questions: [
      {
        id: "chargers-bolt",
        prompt: "Powder blue kit, a lightning bolt on the helmet. Who are you looking at?",
        options: ["Los Angeles Chargers", "Seattle Seahawks", "Carolina Panthers", "Buffalo Bills"],
        correctIndex: 0,
        explain:
          "Chargers. The bolt is the whole personality. They have worn navy too, but if someone says “powder blue”, they mean this lot.",
      },
      {
        id: "saints-fleur",
        prompt: "Black and gold, a fleur-de-lis on the helmet. Which club?",
        options: ["New Orleans Saints", "Baltimore Ravens", "Minnesota Vikings", "Pittsburgh Steelers"],
        correctIndex: 0,
        explain:
          "Saints. The fleur-de-lis is a New Orleans badge that predates the franchise. Who Dat is the noise that comes with it.",
      },
      {
        id: "cowboys-star",
        prompt: "Silver helmet, a single blue star. Whose hat is that?",
        options: ["Dallas Cowboys", "Houston Texans", "Tennessee Titans", "New England Patriots"],
        correctIndex: 0,
        explain:
          "Cowboys. The star is the brand. Houston has a bull, Tennessee has a flame-T, New England has the flying Elvis. Different hats.",
      },
      {
        id: "browns-blank",
        prompt: "Orange helmet, no logo at all. Which club leaned into the blank look?",
        options: ["Cleveland Browns", "Las Vegas Raiders", "Chicago Bears", "Washington Commanders"],
        correctIndex: 0,
        explain:
          "Browns. Plain orange. It is a choice, it is a tradition, and it is how you spot them from the sofa without reading the graphic.",
      },
      {
        id: "steelers-decals",
        prompt: "Which club is famous for putting the logo on only one side of the helmet?",
        options: ["Pittsburgh Steelers", "Oakland / Las Vegas Raiders", "New York Jets", "Green Bay Packers"],
        correctIndex: 0,
        explain:
          "Steelers. Hypocycloids (the three four-pointed diamonds) on the right side only. Everyone else went matching pair.",
      },
      {
        id: "eagles-green",
        prompt: "Midnight green, silver wings on the helmet. Which NFC East side?",
        options: ["Philadelphia Eagles", "New York Giants", "Dallas Cowboys", "Washington Commanders"],
        correctIndex: 0,
        explain:
          "Eagles. Midnight green is the specific brag. The Giants are blue, Dallas is silver-blue, Washington is burgundy and gold.",
      },
      {
        id: "vikings-horns",
        prompt: "Purple and gold, horns painted on the helmet. Who?",
        options: ["Minnesota Vikings", "Baltimore Ravens", "Tennessee Titans", "Los Angeles Rams"],
        correctIndex: 0,
        explain:
          "Vikings. Ravens are purple and black with a bird head, not horns. If you can see antlers-that-are-horns, you are in Minneapolis.",
      },
      {
        id: "jags-teal",
        prompt: "Teal, gold and black, a snarling jaguar on the helmet. Which club?",
        options: ["Jacksonville Jaguars", "Carolina Panthers", "Miami Dolphins", "Detroit Lions"],
        correctIndex: 0,
        explain:
          "Jaguars. Dolphins are aqua and orange with a dolphin. Panthers are black and blue with a cat that is not a jaguar. Jacksonville also keeps turning up in London, so you have seen this kit in person.",
      },
    ],
  },
  {
    slug: "one-season-wonders",
    title: "One-season wonders & storylines",
    summary:
      "The years people still bring up: 16-0, 28-3, Mr Irrelevant, Fail Mary. Storylines, not a film-room exam.",
    minutes: 4,
    kind: "fun",
    learnHref: "/history",
    learnLabel: "NFL history, quickly",
    questions: [
      {
        id: "sixteen-oh",
        prompt: "The 2007 Patriots went 16-0 in the regular season, then lost the Super Bowl. Who beat them?",
        options: ["New York Giants", "Philadelphia Eagles", "New York Jets", "Indianapolis Colts"],
        correctIndex: 0,
        explain:
          "Giants, Super Bowl XLII, 17-14. The helmet catch lived here. 19-0 died here. New England still won a pile of other Super Bowls. This is the one that got away.",
      },
      {
        id: "falcons-collapse",
        prompt: "2016 Falcons: 28-3 up in Super Bowl LI. How did the storyline end?",
        options: [
          "They lost to the Patriots in overtime",
          "They hung on 28-24",
          "The game was voided because of a power cut",
          "They won in overtime on a Matt Ryan run",
        ],
        correctIndex: 0,
        explain:
          "Lost 34-28 in OT. It is the collapse other collapses are compared to. Atlanta have not been allowed to forget the lead, or the play-calling jokes.",
      },
      {
        id: "foles-2017",
        prompt: "The 2017 Eagles started Nick Foles in Super Bowl LII because…",
        options: [
          "Carson Wentz was injured",
          "Foles had beaten Brady three times already",
          "Wentz was suspended",
          "They had traded Wentz to the Rams that morning",
        ],
        correctIndex: 0,
        explain:
          "Wentz tore his ACL late in the regular season. Foles took the side through the play-offs and won Super Bowl MVP. Backup-quarterback folklore does not get better.",
      },
      {
        id: "manning-55",
        prompt: "2013: Peyton Manning’s Broncos set scoring records, then met the Seahawks in Super Bowl XLVIII. Scoreline?",
        options: ["Seahawks 43-8", "Broncos 43-8", "Seahawks 24-21", "Broncos 35-31"],
        correctIndex: 0,
        explain:
          "43-8 Seattle. Manning threw 55 regular-season touchdowns, then ran into the Legion of Boom. The storyline was “unstoppable offence”. The film was a defensive highlight reel.",
      },
      {
        id: "fail-mary",
        prompt: "The 2012 “Fail Mary” (replacement refs, last play, simultaneous-catch chaos) was which two clubs?",
        options: [
          "Seahawks and Packers",
          "49ers and Saints",
          "Cowboys and Lions",
          "Steelers and Raiders",
        ],
        correctIndex: 0,
        explain:
          "Monday night in Seattle. Russell Wilson to Golden Tate, officials ruled a touchdown, Green Bay went home furious, and the regular refs came back soon after. The nickname is mean. The clip is eternal.",
      },
      {
        id: "no-call",
        prompt: "The 2018 NFC Championship “no-call” (pass interference that was not flagged) involved which two sides?",
        options: [
          "Saints and Rams",
          "Saints and Vikings",
          "Rams and Patriots",
          "Eagles and Vikings",
        ],
        correctIndex: 0,
        explain:
          "January 2019 in New Orleans. Nickell Robey-Coleman hit Tommylee Lewis early, no flag, Rams won in overtime and went to Super Bowl LIII. The league later made pass interference reviewable for a bit. Saints fans did not find that sufficient.",
      },
      {
        id: "purdy-run",
        prompt: "2022: Brock Purdy, last pick of the draft, took over in San Francisco and reached which game?",
        options: [
          "The NFC Championship (lost to the Eagles)",
          "Super Bowl LVII, which he won",
          "The AFC Championship in Kansas City",
          "A wild-card and no further",
        ],
        correctIndex: 0,
        explain:
          "NFC Championship in Philadelphia, January 2023. He left injured; the 49ers lost. Mr Irrelevant to a conference final in one winter is the storyline. The Super Bowl win that year was Kansas City over Philadelphia.",
      },
      {
        id: "lions-wait",
        prompt: "The 2023 Lions storyline: they finally won a play-off game for the first time since when?",
        options: ["1991", "2008", "2014", "They still have not"],
        correctIndex: 0,
        explain:
          "1991 was the previous one. In January 2024 they beat the Rams, then the Buccaneers, then lost the NFC Championship to San Francisco. Dan Campbell, roaring, and a city that had been waiting since the John Major years.",
      },
    ],
  },
];

export const funQuizSlugs = funQuizzes.map((quiz) => quiz.slug);

function assertFunQuizzes(quizzes: MiniGame[]) {
  for (const quiz of quizzes) {
    const count = quiz.questions.length;
    if (count < 6 || count > 10) {
      throw new Error(`${quiz.slug} should have 6-10 questions, got ${count}`);
    }
    if (quiz.kind !== "fun") {
      throw new Error(`${quiz.slug} must be kind: fun`);
    }
    const ids = new Set<string>();
    for (const question of quiz.questions) {
      if (ids.has(question.id)) {
        throw new Error(`${quiz.slug} duplicate question id ${question.id}`);
      }
      ids.add(question.id);
      if (question.options.length < 2) {
        throw new Error(`${quiz.slug}/${question.id} needs options`);
      }
      if (question.correctIndex < 0 || question.correctIndex >= question.options.length) {
        throw new Error(`${quiz.slug}/${question.id} bad correctIndex`);
      }
    }
  }
}

assertFunQuizzes(funQuizzes);
