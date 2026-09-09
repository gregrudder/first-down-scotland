export type LessonBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "list"; items: string[] }
  | { type: "callout"; title: string; text: string; href?: string; linkLabel?: string }
  | { type: "terms"; items: { term: string; def: string }[] }
  | { type: "diagram"; id: string }
  | { type: "draft-board" }
  | { type: "fantasy-lineup" }
  | { type: "snake-draft" };

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
        text: "If you grew up on football (the round-ball kind), the NFL looks busy on purpose. Lots of stopping. Lots of people swapping. A pitch marked in yards. Once you know what everyone is actually trying to do, the noise drops away.",
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
          "A yard is a bit shorter than a metre: about 91cm. You do not need to convert it in your head.",
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
        text: "This is the idea that unlocks everything else. The offence does not get unlimited time with the ball. They get four attempts (called downs) to gain 10 yards. Manage that, and they get a fresh set of four. Fail, and the other lot usually get the ball.",
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
          "Punt: kick the ball away so the other team starts further back. The safe, common choice.",
          "Field goal: if they are close enough, try to kick it through the posts for 3 points.",
          "Go for it: run or pass and try to get the remaining yards. Fail, and the defence takes over on the spot.",
        ],
      },
      {
        type: "callout",
        title: "Turnover on downs",
        text: "If a team goes for it on fourth down and comes up short, the other side gets the ball where the play ended. No kick. No second chance. That is why fourth-down bravado makes crowds roar, and groan.",
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
            def: "The moment the ball is passed back from the ground to start a play: usually to the quarterback.",
          },
          {
            term: "Line of scrimmage",
            def: "The imaginary line through the ball at the start of a play. Both teams line up either side of it.",
          },
          {
            term: "First down",
            def: "A fresh set of four attempts, earned by gaining the required yards, or given after a penalty or kick-off.",
          },
        ],
      },
      {
        type: "callout",
        title: "Offside / offsides",
        text: "Cross that line before the snap and it is offside. US commentary often says offsides. The Penalties lesson has the yellow flag, the yards, and the other calls you will hear every Sunday. This page is just the line itself.",
        href: "/learn/penalties",
        linkLabel: "Open the Penalties lesson →",
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
          "Touchdown: 6 points. Carry or catch the ball in the opponent’s end zone, or recover it there.",
          "Extra point: usually 1 more, a short kick after a touchdown. Almost automatic, until it isn’t.",
          "Two-point conversion: instead of the kick, try to run or pass into the end zone from the 2-yard line for 2.",
          "Field goal: 3 points. Kick the ball through the posts, usually on fourth down when a touchdown looks unlikely.",
          "Safety: 2 points to the defence, if they tackle an attacker in their own end zone. Rare, and very loud.",
        ],
      },
      {
        type: "callout",
        title: "A missed field goal can still be a touchdown",
        text: "If the defence catch a field goal attempt, including in the end zone, they can run it back. Get it the other way and it is six points, the same as any other return touchdown. The kick only counts if it goes through the posts.",
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
        text: "A team gets the ball around their own 25. They string together first downs (a run here, a catch there) and slowly eat up the field. Inside the 20 they have reached the red zone, where scores become likely. They either punch it in for a touchdown or settle for a field goal. Then the other team has a turn.",
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
        type: "callout",
        title: "Has this score happened before?",
        text: "Once the game is over, you can look up whether that exact final has turned up in our historical table, and how rare it is. That habit is called scoreography.",
        href: "/score-history",
        linkLabel: "Open score history",
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
          "Quarterback (QB): the organiser. Takes the snap, then hands off, runs, or throws.",
          "Running back (RB): takes hand-offs and short passes. Often the person bursting through the middle.",
          "Wide receivers (WR): the sprinters out wide, trying to get open for a catch.",
          "Tight end (TE): a hybrid: blocks like a lineman, catches like a receiver.",
          "Offensive line (OL): five big people whose job is mostly thankless: protect the QB and open holes for runners.",
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
          "Defensive line (DL): try to shove the offensive line backwards, sack the QB, or stuff the run.",
          "Linebackers (LB): the all-rounders behind the line. Tackle, cover, blitz.",
          "Cornerbacks (CB): mark the wide receivers.",
          "Safeties (S): the last line, deeper down the field.",
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
            def: "How the defence marks receivers: man-to-man, or a zone where each defender patrols an area.",
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
      "Coach-board X’s and O’s for the shapes you see every Sunday: runs, a draw, screens, slants, a deep ball, a Hail Mary, and a basic blitz.",
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
          "Interception: the defence catch a pass meant for an attacker. The player who caught it can run the other way until they are tackled.",
          "Fumble: the ball-carrier drops it, or has it knocked free. Whoever falls on it, owns it. Recovery is a scramble, not a tidy rugby ruck.",
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
            def: "Another word for a turnover caused by the defence: an interception or a fumble recovery.",
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
        text: "When the clock runs, and when it does not",
      },
      {
        type: "p",
        text: "The clock generally runs after a running play that stays in bounds. It stops after an incomplete pass, when a player steps out of bounds, after most scores, and for a pile of administrative reasons (penalties, reviews, injuries). Late in each half, teams that are behind will throw more, on purpose, because incompletions stop the clock.",
      },
      {
        type: "list",
        items: [
          "Timeouts: each team gets three per half. They freeze the clock and let coaches talk.",
          "Two-minute warning: an automatic timeout when two minutes remain in the second and fourth quarters.",
          "Half-time: about 12–13 minutes. Long enough to put the kettle on.",
          "Overtime: if it is tied after four quarters, they play extra time with its own rules. Regular-season overtime is shorter than the play-offs.",
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
        text: "Most regular-season games land on a Sunday evening or late into Monday morning UK time. Thursday-night football usually starts in the small hours on Friday. If a US graphic only gives a zone: Eastern add 5 hours, Central 6, Mountain 7, Pacific 8. That rule of thumb still works with daylight saving. This site’s fixtures are already in Europe/London.",
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
        text: "Special teams are the kicking units. They are “special” only because they are not the ordinary offence or defence. For a few plays each game they decide field position, and sometimes the result.",
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
        text: "On fourth down, if you are too far away to kick a field goal and not brave enough to go for it, you punt. A specialist drop-kicks the ball as far downfield as they can. The other team’s returner tries to catch it and run. Or they call a fair catch: a wee wave of the hand that says “I will catch this, nobody hit me, and I will not run.”",
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
        type: "p",
        text: "If the kick is short or wide, and a defender catches it, they can return it. That includes a catch in the end zone. Run it the length of the field and the defence have a touchdown. Beginners often think a missed kick is just a dead ball. It is not, unless they down it or it goes out of play.",
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
            def: "The defence get a hand on a punt or field goal. Chaos usually follows, and a return for a touchdown is legal.",
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
        text: "Sooner or later a yellow cloth flies, the play dies, and everyone stands around while a referee talks into a microphone. That is a penalty. It looks like a row. It is usually just a yardage tax: annoying, then over.",
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
        text: "Yards are walked off against the guilty team. If the offence is flagged, they usually get shoved backwards, further from the end zone they want. If the defence is flagged, the offence is moved forward, and many defensive penalties also give a first down. That is why a defensive flag late in a drive can feel like a gift.",
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
          "False start: an attacker twitches or moves before the snap. Almost always 5 yards. Dead ball: the play never really starts.",
          "Offside / neutral zone: a defender is across the line when the ball is snapped, or lined up in that slim gap the width of the ball. Usually 5 yards.",
          "Holding: grabbing a player you are not allowed to hold. Offensive holding is typically 10 yards. Defensive holding is usually 5 and a first down.",
          "Pass interference: illegally stopping a catch, often by grabbing or bumping a receiver before the ball arrives. Defensive PI can be a long walk and a first down. Offensive PI is usually 10 yards.",
          "Delay of game: the offence did not snap before the play clock hit zero. Five yards, and a wee bit of embarrassment.",
          "Personal foul / roughing: a dangerous or late hit: helmet to helmet, hitting the kicker, or roughing the passer after they have thrown. Usually 15 yards, and often a first down if the defence did it.",
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
          "Who was it on, offence or defence? That tells you which way the ball will move.",
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
        text: "You now have enough to sit down with a match and follow it. This last lesson is a checklist: the things that actually help, rather than a demand that you become a coach overnight.",
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
          "On a passing play, glance at the quarterback first, then find where they are looking.",
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
        text: "A yellow flag lands, everyone argues, and 40 seconds vanish. The penalties lesson covers the common calls. In the moment, just wait for the referee: who did what, how many yards, and whether it is a first down. The glossary is there when a new phrase appears.",
      },
      {
        type: "callout",
        title: "You are allowed to be a beginner",
        text: "US commentary assumes you have been watching since childhood. You have not. Pause, look up a word, skip a blowout if you like. The sport is better once you know the shape of it, not because you pretended you always did.",
      },
      {
        type: "h2",
        text: "A good first watch",
      },
      {
        type: "p",
        text: "Pick a game this week that kicks off at a civilised UK hour. Keep this site open on the glossary. Follow one team’s quarterback for a quarter, then just enjoy the noise. If a London game is on the slate, even better: the crowd will sound like home.",
      },
    ],
  },
  {
    slug: "the-draft",
    number: 11,
    title: "The NFL Draft",
    summary:
      "How clubs pick college players, why a bad season can mean a high pick, and how to follow Draft night from the sofa in Scotland.",
    minutes: 8,
    blocks: [
      {
        type: "p",
        text: "The Draft is not a pub raffle and it is not the transfer window. Once a year, usually in late April, the 32 clubs take turns choosing young players out of American college football. Those players become rookies. The show lasts three days. The noise lasts all spring.",
      },
      {
        type: "h2",
        text: "What they are actually picking",
      },
      {
        type: "p",
        text: "College football is the main feeder. A 21-year-old quarterback from Ohio State is the NFL’s version of a brilliant youth prospect: except the club that wants him cannot just offer a wage. They have to wait their turn, or trade for someone else’s turn.",
      },
      {
        type: "list",
        items: [
          "Seven rounds, spread over three days.",
          "Each club has one pick per round to start with: 32 picks, plus extras.",
          "Round 1 is the television event. Rounds 2–7 are where most rosters are actually built.",
          "A “first-rounder” is a player taken in that opening round. People will say it like a medal.",
        ],
      },
      {
        type: "h2",
        text: "Who picks first",
      },
      {
        type: "p",
        text: "The order is mostly the reverse of last season’s table. Win fewer games, pick earlier. Win the Super Bowl, pick last. That is the league’s way of giving struggling clubs a chance to get better, and giving you a reason to care in December when your lot are 4–10.",
      },
      { type: "draft-board" },
      {
        type: "callout",
        title: "Tie-breakers exist. You can ignore them.",
        text: "If two teams finish with the same record, the league uses a list of tie-breakers (strength of schedule and so on). Commentators will mention it. You do not need the spreadsheet. The published order is the one that matters.",
      },
      {
        type: "h2",
        text: "Trades: moving up, moving back",
      },
      {
        type: "p",
        text: "A pick is an asset. Clubs swap them the way football clubs swap players and cash, except the currency is future turns. “Trading up” means giving away extra picks to jump the queue for a player they love. “Trading back” means dropping down the list and collecting more picks. A star already on the roster can be sent the other way as part of the deal.",
      },
      {
        type: "p",
        text: "This is why a Draft night can go quiet, then explode: two general managers have been on the phone, and suddenly pick 12 is owned by someone else.",
      },
      {
        type: "h2",
        text: "Undrafted free agents",
      },
      {
        type: "p",
        text: "Plenty of good players are not picked at all. When the last round ends, those names become undrafted free agents: UDFAs. Any club can offer them a contract. Making the 53-man roster from there is hard. Landing on the practice squad is a common first job. Some of the league’s best stories start with “nobody called his name”.",
      },
      {
        type: "h2",
        text: "Why fans care",
      },
      {
        type: "list",
        items: [
          "A high pick is hope. Bad seasons are sold as “we’ll be picking in the top ten”.",
          "Rookies are cheap relative to veterans. A clever Draft can rebuild a club without a Hollywood spending spree.",
          "Your team’s first-rounder will be on every preview show until they prove they belong, or they don’t.",
          "Mock drafts (guessing the order) are a cottage industry. Treat them as entertainment, not scripture. Rankings move.",
        ],
      },
      {
        type: "h2",
        text: "Following it from the UK",
      },
      {
        type: "p",
        text: "Round 1 is the awkward one: it starts Thursday evening in the US, which is the small hours on Friday in Britain. Rounds 2–3 run Friday night US time. Rounds 4–7 on the Saturday often land at a civilised UK tea-time, because they start around midday in New York.",
      },
      {
        type: "list",
        items: [
          "Check Europe/London, not the US graphic. BST in April makes the maths friendlier than midwinter Monday-nighters.",
          "Sky Sports and NFL Game Pass on DAZN usually carry the coverage. The NFL’s own YouTube often shows the later rounds.",
          "You do not have to watch seven rounds. Watch the first hour of Round 1 for the theatre, then catch your club’s picks in the morning.",
          "A “draft grade” the next day is one writer’s hunch. Give the rookies a season.",
        ],
      },
      {
        type: "callout",
        title: "London does not get a Draft",
        text: "The Draft is hosted in a US city that changes. There is no Wembley equivalent. Your job is the same as a Sunday game: know the UK start time, and do not trust a graphic that says “8pm” without a time zone.",
      },
      {
        type: "terms",
        items: [
          {
            term: "Pick",
            def: "A turn in the Draft. “The 12th pick” is the 12th name called in that round, unless someone traded it.",
          },
          {
            term: "Compensatory pick",
            def: "An extra pick the league awards, usually later in the Draft, to clubs that lost more free agents than they signed.",
          },
          {
            term: "UDFA",
            def: "Undrafted free agent: a player who was not picked, then signed anyway.",
          },
          {
            term: "Mock draft",
            def: "A guessed order, published for fun and clicks. It is not the real list.",
          },
        ],
      },
    ],
  },
  {
    slug: "fantasy-football",
    number: 12,
    title: "Fantasy football",
    summary:
      "NFL fantasy is not FPL. How a league works, how a week scores, and which apps UK beginners actually use.",
    minutes: 9,
    blocks: [
      {
        type: "p",
        text: "If you say “fantasy football” in a Scottish pub, people hear Fantasy Premier League. This lesson is the other one: NFL fantasy. You pick real American-football players, they score points from what they do on Sunday (and Monday, and Thursday), and you try to beat your mates. Your favourite NFL club can still lose. Your fantasy side can still win.",
      },
      {
        type: "callout",
        title: "Not Saturday 3pm",
        text: "FPL is Premier League players and one big public game. NFL fantasy is usually a private league of 8, 10 or 12 people, with a draft, a bench, and a head-to-head match each week. Same idea (stats become points). Different sport, different apps, different jargon.",
      },
      {
        type: "h2",
        text: "What you are actually doing",
      },
      {
        type: "p",
        text: "Before the season (or in a sitting in August/September), everyone in the league takes turns picking NFL players. Those players go on your roster. Each NFL week you choose who starts. Points come from yards, touchdowns, catches, and a few other things the scoring settings name. Highest score in your match-up that week gets the win.",
      },
      {
        type: "list",
        items: [
          "You are not picking an NFL club. You are picking players from lots of clubs.",
          "A player can only be on one roster in that league. If you draft Ja’Marr Chase, nobody else has him.",
          "Your lineup “locks” when that player’s real game kicks off. Set it before the Thursday nighter if he is playing then.",
          "Byes exist: if your running back’s NFL team has a week off, he scores nothing. Sit him.",
        ],
      },
      { type: "fantasy-lineup" },
      {
        type: "h2",
        text: "How a week works",
      },
      {
        type: "p",
        text: "Think of one NFL week as one fantasy round. Most weeks run Thursday night (US) through Monday night. In Britain that often means Friday morning through Tuesday morning. You want your starters in before the first relevant kick-off.",
      },
      {
        type: "list",
        items: [
          "Check who is injured, and who is on a bye. The app will flag both.",
          "Start your best available players in the slots the league allows. Leave the rest on the bench: they still put up stats, they just do not count for you that week.",
          "After the slate, your score is compared with one rival (in a classic head-to-head league) or with the whole field (in some other formats).",
          "Then you look at the waiver wire: players nobody owns, who you might add, usually in the middle of the UK week.",
        ],
      },
      {
        type: "callout",
        title: "UK times will catch you out once",
        text: "A “Sunday 1pm ET” game is 6pm in Britain in the autumn, 5pm once the US clocks change. Thursday Night Football is Friday in the small hours. If your quarterback plays Thursday, set him before you go to bed on Thursday, not on Saturday.",
      },
      {
        type: "h2",
        text: "Scoring, without the spreadsheet",
      },
      {
        type: "p",
        text: "Leagues pick a scoring flavour. The app shows the exact list. These are the ones you will hear.",
      },
      {
        type: "terms",
        items: [
          {
            term: "Standard",
            def: "Points for yards and touchdowns. A rushing touchdown is usually 6. Passing touchdowns are often 4. A chunk of passing yards might be 1 point per 25 yards.",
          },
          {
            term: "PPR",
            def: "Points Per Reception: every catch is worth a point (or a fraction). Receivers and pass-catching backs become more valuable. Very common.",
          },
          {
            term: "Half PPR",
            def: "A catch is worth half a point. A compromise, and a frequent default.",
          },
          {
            term: "DST / DEF",
            def: "A whole NFL defence and special teams as one roster slot. They score for sacks, takeaways, and keeping points off the board. Not one defender.",
          },
        ],
      },
      {
        type: "p",
        text: "Kickers score for field goals and extra points if your league uses them. Some modern leagues drop kickers. Interceptions and fumbles usually cost the player who made them. You do not need to memorise the table: open the scoring page in the app once, then forget it until an argument.",
      },
      {
        type: "h2",
        text: "Common formats",
      },
      {
        type: "p",
        text: "If someone invites you to “a league”, ask which of these it is. The invite link is not enough.",
      },
      {
        type: "terms",
        items: [
          {
            term: "Redraft",
            def: "The ordinary one. You draft in August or September, play the season, then everyone starts from scratch next year. Best first league.",
          },
          {
            term: "Keeper",
            def: "Redraft, except you may keep a couple of players into next season. A gentle step toward dynasty.",
          },
          {
            term: "Dynasty",
            def: "You keep almost the whole roster year after year, including rookies you pick in a separate draft. It is a long relationship with 12 other people. Do not join one if you might vanish in November.",
          },
          {
            term: "Best ball",
            def: "You draft a big squad, then you never set a weekly lineup. Each week the app counts your best legal combination. Popular if you like drafts and hate tinkering. Underdog and similar sites run a lot of these.",
          },
        ],
      },
      {
        type: "list",
        items: [
          "Head-to-head: you vs one other manager that week. Wins and losses make a table. Play-offs at the end.",
          "Superflex: you can start a second quarterback in the flex. Quarterbacks become gold dust.",
          "Auction draft: everyone gets a budget and bids. Less common as a first experience than a snake draft.",
          "Daily fantasy (DraftKings, FanDuel and the like): a fresh lineup for one slate, often with an entry fee. That is a different product. This site does not do tips or odds.",
        ],
      },
      { type: "snake-draft" },
      {
        type: "h2",
        text: "Where people actually play",
      },
      {
        type: "p",
        text: "There is no one official home. UK beginners usually land where their mate already has a league. These are the names you will see.",
      },
      {
        type: "list",
        items: [
          "Sleeper: the app a lot of dedicated leagues use. Clean on a phone, good chat, handles redraft, dynasty and a lot of custom scoring. If someone in your Discord says “I’ll send a Sleeper link”, this is it.",
          "ESPN Fantasy: bundled with an ESPN account. Huge in casual US leagues, works in a browser, slightly clunkier on mobile. Fine for a first redraft.",
          "Yahoo Fantasy: the other big casual host. Same idea as ESPN: easy to join, lots of public and private leagues.",
          "NFL Fantasy (NFL.com): the league’s own product. Simple, official, a bit plain. Perfectly usable.",
          "CBS Sports: another long-running host. You will meet it less often in a UK group chat, but it is still out there.",
          "Best-ball specialists (Underdog and similar): you draft, they auto-score. Different rhythm to a weekly Sleeper league.",
        ],
      },
      {
        type: "callout",
        title: "Join the league your people are already in",
        text: "Do not download five apps and compare them in a spreadsheet. Ask the group which host they use. Learning the sport matters more than picking the “best” platform. Sleeper is a strong default if you are founding the league yourself.",
      },
      {
        type: "h2",
        text: "Waivers, without panic",
      },
      {
        type: "p",
        text: "Players on nobody’s roster sit on the waiver wire (or free agency, depending on the app). After a big week, everyone wants the same unknown running back. Most leagues queue claims and process them on a set day.",
      },
      {
        type: "list",
        items: [
          "FAAB: you bid pretend budget (Free Agent Acquisition Budget). Highest bid gets the player.",
          "Rolling waivers / inverse order: the worst team, or the team that has claimed least recently, goes first. The app will say which.",
          "In the UK the claim often processes Wednesday. Set it Tuesday night if you care.",
          "You usually drop someone to add someone. Do not drop a star on a bye unless you know what you are doing.",
        ],
      },
      {
        type: "h2",
        text: "A sensible way in from Scotland",
      },
      {
        type: "list",
        items: [
          "Start with a redraft league of people you actually talk to. Ten or twelve teams. PPR or half PPR. Snake draft.",
          "Draft from the sofa with the app open. First few rounds are stars. Later rounds are guesses and kickers.",
          "Each week: check byes and injuries, set the lineup before Thursday if needed, then watch your players’ real games.",
          "Use our fantasy news tab for headlines, not as a commandment. A “start him” article is one opinion.",
          "The Discord is a decent place to find a UK league of beginners. Do not pay a stranger for a “winning system”.",
        ],
      },
      {
        type: "terms",
        items: [
          {
            term: "Draft",
            def: "The session where the league picks players. Snake (back and forth) is the usual shape.",
          },
          {
            term: "Waiver wire",
            def: "The pool of unowned players, plus the process for claiming them.",
          },
          {
            term: "Lock",
            def: "The moment a player’s real game starts, after which you cannot swap them out.",
          },
          {
            term: "Boom / bust",
            def: "A player who either piles up points or does very little. Fun, not a personality test.",
          },
        ],
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
