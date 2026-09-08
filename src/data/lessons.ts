export type LessonBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "list"; items: string[] }
  | { type: "callout"; title: string; text: string }
  | { type: "terms"; items: { term: string; def: string }[] }
  | { type: "diagram"; id: string };

export type Lesson = {
  slug: string;
  number: number;
  title: string;
  summary: string;
  minutes: number;
  blocks: LessonBlock[];
};

export const lessons: Lesson[] = [
  {
    slug: "what-youre-watching",
    number: 1,
    title: "What you’re watching",
    summary:
      "The field, the two teams, and the one job that matters: move the ball into the other end zone.",
    minutes: 6,
    blocks: [
      {
        type: "p",
        text: "If you grew up on football — the round-ball kind — the NFL looks busy on purpose. Lots of stopping. Lots of people swapping. A pitch marked in yards. Once you know what everyone is actually trying to do, the noise drops away.",
      },
      {
        type: "h2",
        text: "The field",
      },
      {
        type: "p",
        text: "The playing field is 100 yards long, with an end zone 10 yards deep at each end. Those end zones are the goal. The white lines across the field are yard lines. The big numbers (10, 20, 30…) tell you how far a team is from the nearest end zone.",
      },
      {
        type: "list",
        items: [
          "A yard is a bit shorter than a metre — about 91cm. You do not need to convert it in your head.",
          "Hash marks are the short dashes near the middle. The ball is spotted on or between them after each play.",
          "Goalposts sit at the back of each end zone. They are only used for kicks.",
        ],
      },
      { type: "diagram", id: "the-field" },
      {
        type: "callout",
        title: "The yellow line is a TV graphic",
        text: "The bright line you see on the broadcast is the first-down line. It is not painted on the grass. It tells you how far the team with the ball still has to go.",
      },
      {
        type: "h2",
        text: "Two teams, 11 on the field",
      },
      {
        type: "p",
        text: "Each side can have 11 players on the field at once. They are not the same 11 all afternoon. American football is a game of specialists: one unit attacks, one defends, and a third handles kicks. Players jog on and off constantly. That is normal, not chaos.",
      },
      {
        type: "p",
        text: "There are 32 clubs, split into two conferences (AFC and NFC) and eight small divisions. The regular season is 18 weeks. The winners and the best of the rest go into the play-offs, which end at the Super Bowl.",
      },
      {
        type: "h2",
        text: "The one job",
      },
      {
        type: "p",
        text: "The team with the ball (the offence) is trying to reach the other team’s end zone. The defence is trying to stop them, or take the ball off them. That is the whole sport, dressed up in pads and jargon.",
      },
      {
        type: "terms",
        items: [
          {
            term: "Offence",
            def: "The team that currently has the ball. US commentary says “offense”.",
          },
          {
            term: "Defence",
            def: "The team without the ball. US commentary says “defense”.",
          },
          {
            term: "Drive",
            def: "A sequence of plays by one offence, starting from where they get the ball and ending when they score, punt, or turn it over.",
          },
        ],
      },
      {
        type: "callout",
        title: "What to do with this",
        text: "Next time a game is on, ignore the commentary for two minutes. Find the ball, find the end zone they are attacking, and notice which team is lined up over it. That is enough to start.",
      },
    ],
  },
  {
    slug: "downs-and-distance",
    number: 2,
    title: "Downs and distance",
    summary:
      "Four chances to gain 10 yards. This is the rule that makes the NFL make sense.",
    minutes: 7,
    blocks: [
      {
        type: "p",
        text: "This is the idea that unlocks everything else. The offence does not get unlimited time with the ball. They get four attempts — called downs — to gain 10 yards. Manage that, and they get a fresh set of four. Fail, and the other lot usually get the ball.",
      },
      {
        type: "h2",
        text: "How a set of downs works",
      },
      {
        type: "list",
        items: [
          "1st & 10 means first down, 10 yards still needed. Almost every drive starts here.",
          "If they gain 4 yards, it becomes 2nd & 6: second attempt, 6 yards to go.",
          "Gain those 6 (or more) and the referee signals a first down. The count resets to 1st & 10.",
          "If they reach fourth down still short, they have a decision to make.",
        ],
      },
      { type: "diagram", id: "first-and-ten" },
      {
        type: "p",
        text: "On television you will hear this constantly: “second and seven”, “third and inches”. The first number is which attempt they are on. The second is how far they still need. Once you can read that, you can read the game.",
      },
      {
        type: "h2",
        text: "What happens on fourth down",
      },
      {
        type: "p",
        text: "Fourth down is the fork in the road. Teams usually pick one of three options:",
      },
      {
        type: "list",
        items: [
          "Punt — kick the ball away so the other team starts further back. The safe, common choice.",
          "Field goal — if they are close enough, try to kick it through the posts for 3 points.",
          "Go for it — run or pass and try to get the remaining yards. Fail, and the defence takes over on the spot.",
        ],
      },
      {
        type: "callout",
        title: "Turnover on downs",
        text: "If a team goes for it on fourth down and comes up short, the other side gets the ball where the play ended. No kick. No second chance. That is why fourth-down bravado makes crowds roar — and groan.",
      },
      {
        type: "h2",
        text: "The line of scrimmage",
      },
      {
        type: "p",
        text: "Each play starts with the ball on a line. That is the line of scrimmage. Nobody on the offence (except the person who will snap the ball) can cross it until the ball is snapped. Think of it as the scrum put-in: a restart line, not a moving ruck.",
      },
      {
        type: "terms",
        items: [
          {
            term: "Snap",
            def: "The moment the ball is passed back from the ground to start a play — usually to the quarterback.",
          },
          {
            term: "Line of scrimmage",
            def: "The imaginary line through the ball at the start of a play. Both teams line up either side of it.",
          },
          {
            term: "First down",
            def: "A fresh set of four attempts, earned by gaining the required yards — or given after a penalty or kick-off.",
          },
        ],
      },
    ],
  },
  {
    slug: "how-you-score",
    number: 3,
    title: "How you score",
    summary:
      "Touchdowns, kicks, and the rare safety. Why 24–17 is a perfectly normal Saturday night.",
    minutes: 6,
    blocks: [
      {
        type: "p",
        text: "Scoring looks odd if you expect rugby’s five or football’s one. NFL scores pile up in sixes and threes, then get a little extra tacked on. A 27–24 game is a thriller, not a basketball match that escaped.",
      },
      {
        type: "h2",
        text: "The ways to put points on the board",
      },
      {
        type: "list",
        items: [
          "Touchdown — 6 points. Carry or catch the ball in the opponent’s end zone, or recover it there.",
          "Extra point — usually 1 more, a short kick after a touchdown. Almost automatic, until it isn’t.",
          "Two-point conversion — instead of the kick, try to run or pass into the end zone from the 2-yard line for 2.",
          "Field goal — 3 points. Kick the ball through the posts, usually on fourth down when a touchdown looks unlikely.",
          "Safety — 2 points to the defence, if they tackle an attacker in their own end zone. Rare, and very loud.",
        ],
      },
      { type: "diagram", id: "scoring-end-zone" },
      {
        type: "callout",
        title: "After a touchdown, the game does not just restart",
        text: "The scoring team tries the extra point or two-point conversion, then kicks off to the other side. That is why you see a mini-play after every six-pointer.",
      },
      {
        type: "h2",
        text: "A typical scoring drive",
      },
      {
        type: "p",
        text: "A team gets the ball around their own 25. They string together first downs — a run here, a catch there — and slowly eat up the field. Inside the 20 they have reached the red zone, where scores become likely. They either punch it in for a touchdown or settle for a field goal. Then the other team has a turn.",
      },
      {
        type: "p",
        text: "Some drives last eight minutes. Some last 12 seconds because someone throws an interception. Both are legal. Both happen in the same quarter.",
      },
      {
        type: "h2",
        text: "Reading a scoreline",
      },
      {
        type: "p",
        text: "If you see 17–10 at half-time, you do not need to reverse-engineer it live. A 7 usually means a touchdown plus the extra-point kick. A 3 is a field goal. So 17 is often two scores and a kick (7 + 3 + 7), and 10 is a touchdown plus a field goal.",
      },
      {
        type: "terms",
        items: [
          {
            term: "Red zone",
            def: "The last 20 yards before the end zone. Coaches obsess over scoring once they get here.",
          },
          {
            term: "Walk-off",
            def: "A kick or score as time expires that wins the game on the spot.",
          },
        ],
      },
    ],
  },
  {
    slug: "offence-and-defence",
    number: 4,
    title: "Offence vs defence",
    summary:
      "Who does what, without a 40-page playbook. Quarterbacks, the pocket, and why the other lot keep substituting.",
    minutes: 8,
    blocks: [
      {
        type: "p",
        text: "You do not need every position name to enjoy a game. You do need a rough map: who is trying to move the ball, who is trying to flatten that plan, and why 22 people keep changing.",
      },
      {
        type: "h2",
        text: "The offence, in plain language",
      },
      {
        type: "list",
        items: [
          "Quarterback (QB) — the organiser. Takes the snap, then hands off, runs, or throws.",
          "Running back (RB) — takes hand-offs and short passes. Often the person bursting through the middle.",
          "Wide receivers (WR) — the sprinters out wide, trying to get open for a catch.",
          "Tight end (TE) — a hybrid: blocks like a lineman, catches like a receiver.",
          "Offensive line (OL) — five big people whose job is mostly thankless: protect the QB and open holes for runners.",
        ],
      },
      { type: "diagram", id: "eleven-v-eleven" },
      {
        type: "p",
        text: "Most plays are either a run (the ball is carried) or a pass (it is thrown). Play-action is a bit of theatre: the QB pretends to hand it off, then throws, hoping the defence bites.",
      },
      {
        type: "h2",
        text: "The defence",
      },
      {
        type: "list",
        items: [
          "Defensive line (DL) — try to shove the offensive line backwards, sack the QB, or stuff the run.",
          "Linebackers (LB) — the all-rounders behind the line. Tackle, cover, blitz.",
          "Cornerbacks (CB) — mark the wide receivers.",
          "Safeties (S) — the last line, deeper down the field.",
        ],
      },
      {
        type: "callout",
        title: "The pocket",
        text: "The little protected space the offensive line tries to keep around the quarterback. When it collapses, the QB either gets sacked, throws it away, or scrambles into the open. A lot of the game is just: does the pocket hold?",
      },
      { type: "diagram", id: "the-pocket" },
      {
        type: "h2",
        text: "Why they keep changing players",
      },
      {
        type: "p",
        text: "Because the jobs are different. A 140kg lineman is not asked to chase a receiver for 40 yards. A receiver is not asked to stop a running back in a phone box. Coaches swap packages the way a cricket captain changes the field: more tall people if they expect a pass, more heavy people if they expect a run.",
      },
      {
        type: "terms",
        items: [
          {
            term: "Sack",
            def: "Tackling the quarterback behind the line of scrimmage, before they throw or hand the ball off.",
          },
          {
            term: "Blitz",
            def: "Sending extra defenders after the quarterback, gambling that you hit them before they find a receiver.",
          },
          {
            term: "Coverage",
            def: "How the defence marks receivers — man-to-man, or a zone where each defender patrols an area.",
          },
        ],
      },
    ],
  },
  {
    slug: "plays",
    number: 5,
    title: "Common plays",
    summary:
      "Coach-board X’s and O’s for the shapes you see every Sunday: runs, a draw, screens, slants, a deep ball, and a basic blitz.",
    minutes: 8,
    blocks: [
      {
        type: "p",
        text: "This lesson lives with the diagrams. Open the common plays board to see each shape drawn out.",
      },
    ],
  },
  {
    slug: "turnovers",
    number: 6,
    title: "Turnovers",
    summary:
      "The ball changes hands without a kick. Interceptions, fumbles, and why the crowd loses its mind.",
    minutes: 5,
    blocks: [
      {
        type: "p",
        text: "Most of the time, possession changes in an orderly way: you score, you punt, or the half ends. A turnover is when the defence steals the ball in the middle of a play. It is the NFL’s version of a goalkeeper spilling it on the edge of the box.",
      },
      {
        type: "h2",
        text: "The two you will hear every week",
      },
      {
        type: "list",
        items: [
          "Interception — the defence catch a pass meant for an attacker. The player who caught it can run the other way until they are tackled.",
          "Fumble — the ball-carrier drops it, or has it knocked free. Whoever falls on it, owns it. Recovery is a scramble, not a tidy rugby ruck.",
        ],
      },
      { type: "diagram", id: "interception" },
      {
        type: "p",
        text: "There is also a turnover on downs, which is not a steal so much as a failed fourth-down gamble. The offence came up short; the defence simply takes over.",
      },
      {
        type: "h2",
        text: "Why they matter so much",
      },
      {
        type: "p",
        text: "A team can spend five careful minutes moving 60 yards, then lose the lot on one loose pass. The defence that was pinned near their own end zone is suddenly attacking with a short field. Commentators talk about “momentum” because it is visible: one play can flip who is favourite.",
      },
      {
        type: "callout",
        title: "Pick-six",
        text: "An interception returned all the way for a touchdown. Six points, and the other attack never even got a down. Learn this phrase; you will hear it yelled with joy.",
      },
      {
        type: "terms",
        items: [
          {
            term: "Takeaway",
            def: "Another word for a turnover caused by the defence — an interception or a fumble recovery.",
          },
          {
            term: "Loose ball",
            def: "A ball that is live on the ground after a fumble. Anyone can recover it, including the original team.",
          },
        ],
      },
    ],
  },
  {
    slug: "the-clock",
    number: 7,
    title: "The clock and game length",
    summary:
      "Four quarters of 15 minutes that somehow last three hours. Timeouts, stoppages, and the two-minute warning.",
    minutes: 6,
    blocks: [
      {
        type: "p",
        text: "A match is four quarters of 15 minutes. That is one hour of game clock. It is not one hour of your Sunday. Between plays, stoppages, adverts, and a long half-time, a typical broadcast sits around three hours. That is the design, not a delay.",
      },
      {
        type: "h2",
        text: "When the clock runs — and when it does not",
      },
      {
        type: "p",
        text: "The clock generally runs after a running play that stays in bounds. It stops after an incomplete pass, when a player steps out of bounds, after most scores, and for a pile of administrative reasons (penalties, reviews, injuries). Late in each half, teams that are behind will throw more, on purpose, because incompletions stop the clock.",
      },
      {
        type: "list",
        items: [
          "Timeouts — each team gets three per half. They freeze the clock and let coaches talk.",
          "Two-minute warning — an automatic timeout when two minutes remain in the second and fourth quarters.",
          "Half-time — about 12–13 minutes. Long enough to put the kettle on.",
          "Overtime — if it is tied after four quarters, they play extra time with its own rules. Regular-season overtime is shorter than the play-offs.",
        ],
      },
      {
        type: "h2",
        text: "Why endings feel frantic",
      },
      {
        type: "p",
        text: "Inside two minutes, a trailing team can still travel the length of the field if they manage the clock: spike the ball to stop it, get out of bounds, use timeouts. A leading team will run the ball, stay in bounds, and let the seconds die. The same scoreline can feel sleepy or unhinged depending on the clock.",
      },
      {
        type: "callout",
        title: "UK kick-off times",
        text: "Most regular-season games land on a Sunday evening or late into Monday morning UK time. Thursday-night football usually starts in the small hours on Friday. Always check Europe/London, not the US graphic on the telly.",
      },
      {
        type: "terms",
        items: [
          {
            term: "Spike",
            def: "The quarterback throws the ball into the ground immediately after the snap to stop the clock. It costs a down.",
          },
          {
            term: "Kneel",
            def: "The quarterback takes the snap and takes a knee, using up seconds while they still lead. Legal, and slightly boring on purpose.",
          },
        ],
      },
    ],
  },
  {
    slug: "special-teams",
    number: 8,
    title: "Special teams",
    summary:
      "Kick-offs, punts and field goals: the third team on the pitch, in one sitting.",
    minutes: 6,
    blocks: [
      {
        type: "p",
        text: "Special teams are the kicking units. They are “special” only because they are not the ordinary offence or defence. For a few plays each game they decide field position — and sometimes the result.",
      },
      {
        type: "h2",
        text: "Kick-off",
      },
      {
        type: "p",
        text: "The game starts with a kick-off, and so does the second half. After most scores, the team that just scored also kicks off. The other side either catches it and runs, or takes a touchback and starts at a set yard line. Modern kick-off rules keep changing to make returns a bit safer; the idea stays the same: restart, then play.",
      },
      { type: "diagram", id: "kickoff" },
      {
        type: "h2",
        text: "Punt",
      },
      {
        type: "p",
        text: "On fourth down, if you are too far away to kick a field goal and not brave enough to go for it, you punt. A specialist drop-kicks the ball as far downfield as they can. The other team’s returner tries to catch it and run. Or they call a fair catch — a wee wave of the hand that says “I will catch this, nobody hit me, and I will not run.”",
      },
      {
        type: "h2",
        text: "Field goals and extra points",
      },
      {
        type: "p",
        text: "The kicker, holder and long snapper come on. The snap has to be clean, the hold has to be tidy, and the kicker has to send it between the posts. From the stands it looks simple. From 50 yards, with a rush coming, it is not.",
      },
      {
        type: "callout",
        title: "Hidden yards",
        text: "A great punt can pin the other team on their own 5-yard line. A clumsy one can hand them a short field. Special teams rarely fill highlight reels, but coaches notice them every Monday.",
      },
      {
        type: "terms",
        items: [
          {
            term: "Touchback",
            def: "The kicked ball reaches the end zone and is downed there. The receiving team starts at a fixed spot, with no return.",
          },
          {
            term: "Fair catch",
            def: "The returner signals they will catch the punt without being tackled, and cannot advance the ball.",
          },
          {
            term: "Blocked kick",
            def: "The defence get a hand on a punt or field goal. Chaos usually follows.",
          },
        ],
      },
    ],
  },
  {
    slug: "penalties",
    number: 9,
    title: "Penalties",
    summary:
      "The yellow flag, who the yards hurt, and the handful of calls you will hear every Sunday.",
    minutes: 7,
    blocks: [
      {
        type: "p",
        text: "Sooner or later a yellow cloth flies, the play dies, and everyone stands around while a referee talks into a microphone. That is a penalty. It looks like a row. It is usually just a yardage tax — annoying, then over.",
      },
      {
        type: "h2",
        text: "What a penalty actually is",
      },
      {
        type: "p",
        text: "An official has spotted something illegal. They throw a yellow flag so the play can be marked, then they walk off yards against the team that broke the rule. Sometimes they also award an automatic first down, or replay the same down. The clock often stops while this is sorted.",
      },
      {
        type: "list",
        items: [
          "The flag is the signal. One flag, or several, landing during a play.",
          "The stoppage is the wait: whistle, huddle of officials, announcement.",
          "The yards are the punishment. Five, ten or fifteen is typical. A few calls can be more.",
        ],
      },
      {
        type: "callout",
        title: "Watch the flag, then the referee",
        text: "On television the yellow flag is your cue that the result of the play might not stand. Ignore the crowd for a moment. The referee will say who did what, how many yards it costs, and whether the down is replayed. That sentence is the whole story.",
      },
      {
        type: "h2",
        text: "Who the yards hurt",
      },
      {
        type: "p",
        text: "Yards are walked off against the guilty team. If the offence is flagged, they usually get shoved backwards — further from the end zone they want. If the defence is flagged, the offence is moved forward, and many defensive penalties also give a first down. That is why a defensive flag late in a drive can feel like a gift.",
      },
      {
        type: "p",
        text: "A simple check: after the announcement, look at the ball and the yellow first-down line. If the offence just went backwards, it was probably on them. If they suddenly have a fresh 1st & 10, it was probably on the defence.",
      },
      {
        type: "h2",
        text: "The ones you will keep hearing",
      },
      {
        type: "p",
        text: "You do not need the whole book. These cover most of a beginner’s Sundays:",
      },
      {
        type: "list",
        items: [
          "False start — an attacker twitches or moves before the snap. Almost always 5 yards. Dead ball: the play never really starts.",
          "Offside / neutral zone — a defender is across the line when the ball is snapped, or lined up in that slim gap the width of the ball. Usually 5 yards.",
          "Holding — grabbing a player you are not allowed to hold. Offensive holding is typically 10 yards. Defensive holding is usually 5 and a first down.",
          "Pass interference — illegally stopping a catch, often by grabbing or bumping a receiver before the ball arrives. Defensive PI can be a long walk and a first down. Offensive PI is usually 10 yards.",
          "Delay of game — the offence did not snap before the play clock hit zero. Five yards, and a wee bit of embarrassment.",
          "Personal foul / roughing — a dangerous or late hit: helmet to helmet, hitting the kicker, or roughing the passer after they have thrown. Usually 15 yards, and often a first down if the defence did it.",
        ],
      },
      { type: "diagram", id: "offside" },
      { type: "diagram", id: "holding" },
      { type: "diagram", id: "pass-interference" },
      {
        type: "callout",
        title: "Same name, different pain",
        text: "Holding on the offence and holding on the defence are not the same bill. One shoves you back. The other can hand the other lot a first down. Listen for “on the offence” or “on the defence” in the announcement.",
      },
      {
        type: "h2",
        text: "Accepting or declining",
      },
      {
        type: "p",
        text: "The team that was fouled can take the penalty, or decline it and keep the play as it stood. They pick whichever helps more. If a defence is flagged but the offence just scored a touchdown anyway, they will often decline the yards and take the six points. You will hear “declined” now and then. You do not have to do the arithmetic; the overlay will show the result.",
      },
      {
        type: "h2",
        text: "What to look for when a flag flies",
      },
      {
        type: "list",
        items: [
          "Did the play “count”? Wait for the announcement before celebrating or groaning.",
          "Who was it on — offence or defence? That tells you which way the ball will move.",
          "How many yards, and is it a first down? Those two facts reset the down-and-distance graphic.",
          "If two flags fly, officials may offset them (both cancel) or pick the more serious one. Rare, and they will say so.",
        ],
      },
      {
        type: "terms",
        items: [
          {
            term: "Flag",
            def: "The yellow cloth an official throws to mark a penalty. US commentary just says “flag”.",
          },
          {
            term: "Dead-ball foul",
            def: "A penalty before or after the play (false start, delay of game). The down is usually replayed after the yards.",
          },
          {
            term: "Personal foul",
            def: "A 15-yard penalty for a dangerous or unsportsmanlike hit. Roughing the passer is the famous version.",
          },
        ],
      },
    ],
  },
  {
    slug: "what-to-look-for",
    number: 10,
    title: "What to look for when you put a game on",
    summary:
      "A simple watching guide: the score bug, the yellow line, and when to ignore the noise.",
    minutes: 6,
    blocks: [
      {
        type: "p",
        text: "You now have enough to sit down with a match and follow it. This last lesson is a checklist — the things that actually help, rather than a demand that you become a coach overnight.",
      },
      {
        type: "h2",
        text: "Start with the score bug",
      },
      {
        type: "p",
        text: "Every broadcast keeps a little graphic on screen. It is your friend. Read it in this order:",
      },
      {
        type: "list",
        items: [
          "Who is winning, and by how many.",
          "Which quarter it is, and how much time is left.",
          "Who has the ball.",
          "The down and distance (1st & 10, 3rd & 4, and so on).",
          "Which yard line the ball is on.",
        ],
      },
      {
        type: "p",
        text: "If you only watch those five things, you will understand 80% of what is happening. The yellow first-down line does the rest.",
      },
      {
        type: "h2",
        text: "Where to put your eyes",
      },
      {
        type: "list",
        items: [
          "On a passing play, glance at the quarterback first — then find where they are looking.",
          "On a running play, watch the gap the runner is aiming at, not the crowd of bodies.",
          "In the red zone, expect tighter throws and more motion. Everyone is compressed.",
          "After a big play, check whether the clock is running. That tells you how urgent the next snap is.",
        ],
      },
      {
        type: "h2",
        text: "Penalties look worse than they are",
      },
      {
        type: "p",
        text: "A yellow flag lands, everyone argues, and 40 seconds vanish. The last lesson covers the common calls. In the moment, just wait for the referee: who did what, how many yards, and whether it is a first down. The glossary is there when a new phrase appears.",
      },
      {
        type: "callout",
        title: "You are allowed to be a beginner",
        text: "US commentary assumes you have been watching since childhood. You have not. Pause, look up a word, skip a blowout if you like. The sport is better once you know the shape of it — not because you pretended you always did.",
      },
      {
        type: "h2",
        text: "A good first watch",
      },
      {
        type: "p",
        text: "Pick a game this week that kicks off at a civilised UK hour. Keep this site open on the glossary. Follow one team’s quarterback for a quarter, then just enjoy the noise. If a London game is on the slate, even better — the crowd will sound like home.",
      },
    ],
  },
];

export function getLesson(slug: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.slug === slug);
}

export function getLessonSlugs(): string[] {
  return lessons.map((lesson) => lesson.slug);
}

export function getNextLesson(slug: string): Lesson | undefined {
  const index = lessons.findIndex((lesson) => lesson.slug === slug);
  if (index === -1) return undefined;
  return lessons[index + 1];
}

export function getPreviousLesson(slug: string): Lesson | undefined {
  const index = lessons.findIndex((lesson) => lesson.slug === slug);
  if (index <= 0) return undefined;
  return lessons[index - 1];
}
