export type LearnBadgeId = "practice-squad" | "rookie" | "starter" | "hall-of-famer";

export type LearnBadge = {
  id: LearnBadgeId;
  name: string;
  min: number;
  max: number;
  blurb: string;
};

/**
 * Locked ladder. Do not reorder or rename.
 * Practice Squad (0–7) → Rookie (8–12) → Starter (13–17) → Hall of Famer (18–20).
 */
export const learnBadges: LearnBadge[] = [
  {
    id: "practice-squad",
    name: "Practice Squad",
    min: 0,
    max: 7,
    blurb: "Still finding the ball. Read a couple of lessons and have another go — that is what the practice squad is for.",
  },
  {
    id: "rookie",
    name: "Rookie",
    min: 8,
    max: 12,
    blurb: "You know the shape of a drive. A few more Sundays and the jargon will stop sounding like a second language.",
  },
  {
    id: "starter",
    name: "Starter",
    min: 13,
    max: 17,
    blurb: "You can read a score bug and a yellow line. Put a game on this week and you will follow it.",
  },
  {
    id: "hall-of-famer",
    name: "Hall of Famer",
    min: 18,
    max: 20,
    blurb: "That is a serious Sunday. You have earned the loud badge — and you are allowed to explain a first down to the pub.",
  },
];

export function badgeForScore(score: number, total = LEARN_QUIZ_TOTAL): LearnBadge {
  const clamped = Math.max(0, Math.min(total, score));
  return (
    learnBadges.find((badge) => clamped >= badge.min && clamped <= badge.max) ??
    learnBadges[0]
  );
}

export type LearnQuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explain: string;
};

export const LEARN_QUIZ_TOTAL = 20;

export const learnQuizQuestions: LearnQuizQuestion[] = [
  {
    id: "field-length",
    prompt: "How long is the playing field between the two end zones?",
    options: ["80 yards", "100 yards", "110 metres", "50 yards"],
    correctIndex: 1,
    explain: "The grass between the end zones is 100 yards. Each end zone is an extra 10 yards deep.",
  },
  {
    id: "yellow-line",
    prompt: "What is the bright yellow line you see on the television picture?",
    options: [
      "Paint on the grass",
      "The goal line",
      "A TV graphic showing the first-down marker",
      "The line of scrimmage",
    ],
    correctIndex: 2,
    explain: "It is a broadcast graphic, not paint. It shows how far the offence still has to go for a fresh set of downs.",
  },
  {
    id: "first-and-ten",
    prompt: "What does “1st & 10” mean?",
    options: [
      "First quarter, ten minutes left",
      "First attempt, 10 yards still needed",
      "The team has scored 10 points",
      "Ten players are on the field",
    ],
    correctIndex: 1,
    explain: "Almost every drive starts 1st & 10: first down, ten yards to go. Gain them and the count resets.",
  },
  {
    id: "fourth-down-fail",
    prompt: "A team goes for it on fourth down and comes up short. What happens?",
    options: [
      "They get a fifth down",
      "They must attempt a field goal",
      "The other side get the ball where the play ended",
      "The quarter is over",
    ],
    correctIndex: 2,
    explain: "That is a turnover on downs. No kick, no second chance — the defence take over on the spot.",
  },
  {
    id: "touchdown-points",
    prompt: "How many points is a touchdown, before the extra kick?",
    options: ["5", "6", "7", "3"],
    correctIndex: 1,
    explain: "A touchdown is 6. The extra-point kick is usually 1 more; a two-point conversion is the other option.",
  },
  {
    id: "field-goal",
    prompt: "How many points is a field goal?",
    options: ["1", "2", "3", "6"],
    correctIndex: 2,
    explain: "Kick it through the posts for 3. Teams often try this on fourth down when a touchdown looks unlikely.",
  },
  {
    id: "safety",
    prompt: "Who scores a safety?",
    options: [
      "The kicker, from halfway",
      "The offence, for reaching the 2-yard line",
      "The defence, if they tackle an attacker in their own end zone",
      "Either team, for a fair catch",
    ],
    correctIndex: 2,
    explain: "A safety is 2 points to the defence. Rare, and the crowd gets very loud.",
  },
  {
    id: "eleven",
    prompt: "How many players can each team have on the field at once?",
    options: ["7", "11", "15", "22"],
    correctIndex: 1,
    explain: "Eleven each. They are not the same 11 all afternoon — offence, defence and special teams swap in.",
  },
  {
    id: "pocket",
    prompt: "What is “the pocket”?",
    options: [
      "The end zone",
      "The little protected space the offensive line tries to keep around the quarterback",
      "The referee’s huddle",
      "The bag of footballs on the sideline",
    ],
    correctIndex: 1,
    explain: "When the pocket collapses the quarterback is sacked, throws it away, or scrambles.",
  },
  {
    id: "play-action",
    prompt: "What is a play-action pass?",
    options: [
      "A kick on fourth down",
      "A fake run, then a throw",
      "A timeout called by the offence",
      "A penalty for moving early",
    ],
    correctIndex: 1,
    explain: "The quarterback pretends to hand the ball off. Linebackers step up. A receiver then slips in behind them.",
  },
  {
    id: "blitz",
    prompt: "What does a blitz mean?",
    options: [
      "Extra people rush the quarterback",
      "The clock is stopped",
      "A team has used all its timeouts",
      "The ball is punted",
    ],
    correctIndex: 0,
    explain: "Usually four big defenders rush. A blitz means a linebacker or defensive back joins them.",
  },
  {
    id: "interception",
    prompt: "What is an interception?",
    options: [
      "A kick that goes out of bounds",
      "The defence catch a pass meant for an attacker",
      "A runner steps on the sideline",
      "The snap goes over the quarterback’s head",
    ],
    correctIndex: 1,
    explain: "The defence now have the ball and can run the other way. That is a turnover.",
  },
  {
    id: "pick-six",
    prompt: "What is a pick-six?",
    options: [
      "Six field goals in a row",
      "An interception returned all the way for a touchdown",
      "A 6-yard penalty",
      "Choosing six players to blitz",
    ],
    correctIndex: 1,
    explain: "Six points, and the other attack never even got a down. You will hear it yelled with joy.",
  },
  {
    id: "quarter-length",
    prompt: "How long is each quarter on the game clock?",
    options: ["10 minutes", "12 minutes", "15 minutes", "20 minutes"],
    correctIndex: 2,
    explain: "Four quarters of 15 minutes — one hour of game clock. The broadcast still lasts about three hours.",
  },
  {
    id: "two-minute-warning",
    prompt: "What is the two-minute warning?",
    options: [
      "A yellow flag for delay of game",
      "An automatic timeout when two minutes remain in the second and fourth quarters",
      "Half-time",
      "When the kicker must come on",
    ],
    correctIndex: 1,
    explain: "It is built into the rules. Teams get a free stoppage to set the last two minutes of each half.",
  },
  {
    id: "fair-catch",
    prompt: "A punt returner makes a fair catch. What are they allowed to do?",
    options: [
      "Catch it and run",
      "Catch it without being tackled, and not advance the ball",
      "Throw a pass immediately",
      "Down it for a safety",
    ],
    correctIndex: 1,
    explain: "The wee wave of the hand says: I will catch this, nobody hit me, and I will not run.",
  },
  {
    id: "touchback",
    prompt: "What is a touchback on a kick-off?",
    options: [
      "The returner runs it all the way back",
      "The kicked ball reaches the end zone and is downed there, so the receiving team start at a set spot",
      "A field goal that bounces in",
      "A penalty on the kicking team",
    ],
    correctIndex: 1,
    explain: "No return. The receiving team start at a fixed yard line. Modern kick-off rules keep tweaking the exact spot.",
  },
  {
    id: "holding-offence",
    prompt: "Offensive holding is typically how many yards?",
    options: ["5", "10", "15", "The length of the field"],
    correctIndex: 1,
    explain: "Usually 10 yards back. Defensive holding is a different bill: often 5 yards and a first down.",
  },
  {
    id: "flag-colour",
    prompt: "What do officials throw to mark a penalty?",
    options: ["A red card", "A blue beanbag", "A yellow flag", "A white towel"],
    correctIndex: 2,
    explain: "The yellow cloth is the cue that the play might not stand. Then wait for the referee’s sentence.",
  },
  {
    id: "red-zone",
    prompt: "What is the red zone?",
    options: [
      "The visiting team’s locker room",
      "The last 20 yards before the end zone",
      "The area behind the goalposts",
      "Where the referees stand at half-time",
    ],
    correctIndex: 1,
    explain: "Once a team is inside the opponent’s 20, scores become likely. Coaches obsess over finishing drives here.",
  },
];

export function getLearnQuestion(id: string): LearnQuizQuestion | undefined {
  return learnQuizQuestions.find((question) => question.id === id);
}
