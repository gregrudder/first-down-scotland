import { funQuizzes } from "@/data/fun-quizzes";
import { learnQuizQuestions, type LearnQuizQuestion } from "@/data/learn-quiz";
import type { MiniGame, MiniGameKind, MiniGameQuestion, MiniGameSlug } from "@/data/mini-game-types";

export type { MiniGame, MiniGameKind, MiniGameQuestion, MiniGameSlug };

const RULE_IDS = [
  "first-and-ten",
  "fourth-down-fail",
  "touchdown-points",
  "field-goal",
  "yellow-line",
  "interception",
  "fair-catch",
  "two-minute-warning",
  "flag-colour",
  "red-zone",
] as const;

function fromLearnQuiz(question: LearnQuizQuestion): MiniGameQuestion {
  return {
    id: question.id,
    prompt: question.prompt,
    options: question.options,
    correctIndex: question.correctIndex,
    explain: question.explain,
  };
}

const rulesQuestions: MiniGameQuestion[] = RULE_IDS.map((id) => {
  const question = learnQuizQuestions.find((entry) => entry.id === id);
  if (!question) {
    throw new Error(`Missing learn quiz question: ${id}`);
  }
  return fromLearnQuiz(question);
});

const whoAmIQuestions: MiniGameQuestion[] = [
  {
    id: "brady",
    prompt: "Who am I?",
    clues: [
      "Quarterback. Seven Super Bowl wins.",
      "Six of those were with New England. One was with Tampa Bay.",
      "People still use my name as the measuring stick.",
    ],
    options: ["Peyton Manning", "Tom Brady", "Joe Montana", "Patrick Mahomes"],
    correctIndex: 1,
    explain: "Tom Brady: six Super Bowls with the Patriots, then Super Bowl LV with the Buccaneers.",
  },
  {
    id: "rice",
    prompt: "Who am I?",
    clues: [
      "Wide receiver, mostly in a 49ers kit.",
      "Three Super Bowls in San Francisco.",
      "The name people mean when they say “greatest receiver”.",
    ],
    options: ["Jerry Rice", "Justin Jefferson", "Travis Kelce", "Deion Sanders"],
    correctIndex: 0,
    explain: "Jerry Rice. He also had late stops with the Raiders and Seahawks.",
  },
  {
    id: "lt",
    prompt: "Who am I?",
    clues: [
      "Linebacker for the New York Giants.",
      "I won the 1986 league MVP as a defender.",
      "People still call me LT.",
    ],
    options: ["Ray Lewis", "Joe Greene", "Lawrence Taylor", "Deion Sanders"],
    correctIndex: 2,
    explain: "Lawrence Taylor. Two Super Bowls with the Giants, and a pass-rush that changed the position.",
  },
  {
    id: "mahomes",
    prompt: "Who am I?",
    clues: [
      "Quarterback for the Kansas City Chiefs.",
      "Three Super Bowl wins so far: LIV, LVII, LVIII.",
      "The no-look throw is my party piece.",
    ],
    options: ["Josh Allen", "Aaron Rodgers", "Patrick Mahomes", "Lamar Jackson"],
    correctIndex: 2,
    explain: "Patrick Mahomes. He has also lost two Super Bowls (LV and LIX).",
  },
  {
    id: "payton",
    prompt: "Who am I?",
    clues: [
      "Running back for the Chicago Bears.",
      "Nickname: Sweetness.",
      "I was the face of the side that won Super Bowl XX.",
    ],
    options: ["Jim Brown", "Barry Sanders", "Walter Payton", "Travis Kelce"],
    correctIndex: 2,
    explain: "Walter Payton. When he retired he was the league’s all-time leading rusher.",
  },
  {
    id: "kelce",
    prompt: "Who am I?",
    clues: [
      "Tight end, Kansas City.",
      "Three Super Bowls with Patrick Mahomes.",
      "If you only know me from a pop-star headline, I still play football.",
    ],
    options: ["Travis Kelce", "Jerry Rice", "Rob Gronkowski", "Drew Brees"],
    correctIndex: 0,
    explain: "Travis Kelce. A tight end who is used like a receiver.",
  },
  {
    id: "montana",
    prompt: "Who am I?",
    clues: [
      "49ers quarterback, four Super Bowl wins, no Super Bowl losses.",
      "I threw The Catch to Dwight Clark.",
      "I finished my career with the Chiefs.",
    ],
    options: ["Joe Montana", "Tom Brady", "Joe Greene", "Aaron Rodgers"],
    correctIndex: 0,
    explain: "Joe Montana. The Catch was the 1981 NFC Championship against Dallas.",
  },
  {
    id: "lamar",
    prompt: "Who am I?",
    clues: [
      "Quarterback for the Baltimore Ravens.",
      "League MVP in 2019 and again in 2023.",
      "Defences cannot decide if I am a runner or a passer.",
    ],
    options: ["Josh Allen", "Lamar Jackson", "Patrick Mahomes", "Ray Lewis"],
    correctIndex: 1,
    explain: "Lamar Jackson. Dual-threat means he can hurt you on the ground or through the air.",
  },
];

const downsQuestions: MiniGameQuestion[] = [
  {
    id: "punt-own-20",
    prompt: "You are 4th & 8 on your own 20-yard line, early in the game, scores level. What do most teams do?",
    options: [
      "Go for it: try to gain the 8 yards",
      "Punt the ball away",
      "Attempt a field goal",
      "Kneel to run the clock",
    ],
    correctIndex: 1,
    explain:
      "Too far for a sensible field goal, and a failed try would hand the other lot a short field. A punt is the common, safe choice.",
  },
  {
    id: "field-goal-range",
    prompt: "You are 4th & 6 on the opponent’s 28. What is the usual call?",
    options: [
      "Punt",
      "Try a field goal",
      "Kneel",
      "Two-point conversion",
    ],
    correctIndex: 1,
    explain:
      "The 28 is in range for most NFL kickers (the kick is from further back than the line, but this is still a normal attempt). Three points is the conventional take.",
  },
  {
    id: "fourth-and-short-red",
    prompt: "You are 4th & 1 on the opponent’s 2-yard line. Which option is not available?",
    options: [
      "Go for the touchdown (or the yard)",
      "Kick a field goal",
      "Punt",
      "All three of those are legal",
    ],
    correctIndex: 3,
    explain:
      "All three are legal. Most sides go for the touchdown or take the almost-certain three points. A punt from the 2 would be very odd, but the rulebook does not ban it.",
  },
  {
    id: "third-and-long",
    prompt: "It is 3rd & 12 on your own 30. What are you usually trying to do?",
    options: [
      "Run up the middle and accept 4th & 8",
      "Throw a pass that can gain the 12, or get out of bounds",
      "Kick a field goal from here",
      "Take a safety on purpose",
    ],
    correctIndex: 1,
    explain:
      "Third and long is passing down for most clubs. A draw run is a change-up, not the default. You are too far away to kick three.",
  },
  {
    id: "first-and-ten-start",
    prompt: "A drive starts 1st & 10 on your own 25. What does that graphic mean?",
    options: [
      "First quarter, ten minutes left",
      "First attempt, 10 yards still needed",
      "You must score in ten plays",
      "The other team has 10 men on the field",
    ],
    correctIndex: 1,
    explain:
      "Almost every drive starts here after a touchback. Gain 10 yards and you get a fresh set of four downs.",
  },
  {
    id: "turnover-on-downs",
    prompt: "You go for it on 4th & 3 at midfield and gain only 2 yards. What happens?",
    options: [
      "You keep the ball, 1st & 10",
      "You retry fourth down",
      "The other side get the ball where the play ended",
      "The ball is spotted back at the previous line, and you punt",
    ],
    correctIndex: 2,
    explain:
      "Turnover on downs. No kick. The defence take over on the spot, which is why fourth-down bravery can look brilliant or awful in one snap.",
  },
  {
    id: "two-minute-ahead",
    prompt: "You lead by 6 with 1:20 left. You have the ball, 3rd & 8, clock running. What is the “protect the lead” idea?",
    options: [
      "Throw deep and try to score again",
      "Run, stay in bounds, and make them use timeouts",
      "Punt on third down",
      "Call a fair catch",
    ],
    correctIndex: 1,
    explain:
      "A leading team wants the clock to die. Runs that stay in bounds keep it moving. Trailing teams throw because incompletions stop the clock.",
  },
  {
    id: "no-mans-land",
    prompt: "You are 4th & 4 on the opponent’s 38. Why do coaches call this “no man’s land”?",
    options: [
      "A field goal is a long ask, and a punt may not travel far enough to help much",
      "The referee cannot spot the ball",
      "You are not allowed to pass",
      "The play clock is switched off",
    ],
    correctIndex: 0,
    explain:
      "Around the opponent’s 35-40, a field goal is 50-plus yards and a punt might be a squib. That is why you see more “go for it” calls here than on your own 20.",
  },
];

const rivalryQuestions: MiniGameQuestion[] = [
  {
    id: "oldest",
    prompt: "Which fixture is the NFL’s oldest club rivalry, first played in 1921?",
    options: ["Cowboys v Eagles", "Packers v Bears", "Steelers v Raiders", "Saints v Falcons"],
    correctIndex: 1,
    explain: "Green Bay and Chicago have been at it since 1921. They have played each other more than any other pair.",
  },
  {
    id: "ice-bowl",
    prompt: "The Ice Bowl was the 1967 NFL Championship. Who played, and who won?",
    options: [
      "Bears beat Packers",
      "Packers beat Cowboys",
      "Cowboys beat 49ers",
      "Steelers beat Raiders",
    ],
    correctIndex: 1,
    explain:
      "31 December 1967 at Lambeau Field, about −25°C. Bart Starr sneaked over. Green Bay 21-17 Dallas.",
  },
  {
    id: "immaculate",
    prompt: "The Immaculate Reception was a play-off touchdown in 1972. Which two clubs?",
    options: [
      "Steelers and Raiders",
      "49ers and Cowboys",
      "Packers and Bears",
      "Ravens and Steelers",
    ],
    correctIndex: 0,
    explain:
      "Franco Harris scooped a deflected pass. Pittsburgh 13-7 Oakland. Raiders supporters still argue it.",
  },
  {
    id: "the-catch",
    prompt: "“The Catch” was Joe Montana to Dwight Clark. Which game?",
    options: [
      "Super Bowl XVI",
      "The 1981 NFC Championship, 49ers v Cowboys",
      "The Ice Bowl",
      "The 2013 NFC Championship",
    ],
    correctIndex: 1,
    explain: "January 1982. San Francisco 28-27 Dallas. The 49ers then won Super Bowl XVI.",
  },
  {
    id: "sherman",
    prompt: "Richard Sherman tipped a pass to seal an NFC Championship. Who lost that game?",
    options: ["Seahawks", "49ers", "Rams", "Packers"],
    correctIndex: 1,
    explain:
      "January 2014 in Seattle. Sherman tipped Kaepernick’s throw for Crabtree. Seattle 23-17 San Francisco, then Super Bowl XLVIII.",
  },
  {
    id: "bounty",
    prompt: "The Bounty Bowl was a Thanksgiving row in 1989. Which two clubs?",
    options: ["Eagles and Cowboys", "Giants and Eagles", "Chiefs and Raiders", "Browns and Steelers"],
    correctIndex: 0,
    explain:
      "Philadelphia won 27-0 in Dallas. Buddy Ryan was accused of putting money on hurting Cowboys players.",
  },
  {
    id: "meadowlands",
    prompt: "The Miracle at the New Meadowlands (2010) ended with a walk-off punt return. Who won?",
    options: ["Giants", "Eagles", "Cowboys", "Jets"],
    correctIndex: 1,
    explain:
      "DeSean Jackson ran a punt back as the clock hit zero. Philadelphia 38-31 New York, after trailing 31-10.",
  },
  {
    id: "afc-west-afl",
    prompt: "Which AFC West rivalry started as an AFL grudge between Lamar Hunt and Al Davis’s clubs?",
    options: ["Chiefs v Broncos", "Chiefs v Raiders", "Chargers v Broncos", "Patriots v Jets"],
    correctIndex: 1,
    explain:
      "Kansas City and the Raiders have been at this since the 1960s AFL. The Raiders later moved to Las Vegas. The fixture stayed.",
  },
];

export const miniGamesIntro = {
  eyebrow: "Have a go",
  title: "Mini Games",
  lead:
    "Short, tap-the-answer games. No downloads, no accounts, no heavy graphics. Some help you learn the sport. The fun quizzes are just for fun: famous moments, rivalries, late-night survival. Your score stays on this page until you have another go.",
};

const learnMiniGames: MiniGame[] = [
  {
    slug: "rules",
    title: "Rules quiz",
    summary:
      "Ten questions from the learning path: downs, scoring, the yellow line, turnovers, and flags.",
    minutes: 4,
    kind: "learn",
    learnHref: "/learn",
    learnLabel: "Back to the lessons",
    questions: rulesQuestions,
  },
  {
    slug: "who-am-i",
    title: "Who am I?",
    summary: "Three clues, four names. Famous players from the learning section.",
    minutes: 4,
    kind: "learn",
    learnHref: "/learn/famous-players",
    learnLabel: "Read the player bios",
    questions: whoAmIQuestions,
  },
  {
    slug: "downs",
    title: "Down & distance",
    summary: "You have the ball. Read the down, the yards, and the field. Pick the usual call.",
    minutes: 5,
    kind: "learn",
    learnHref: "/learn/downs-and-distance",
    learnLabel: "Read Downs and distance",
    questions: downsQuestions,
  },
  {
    slug: "rivalries",
    title: "Rivalry match-up",
    summary: "Who plays whom, and which famous moment belongs to which fixture.",
    minutes: 4,
    kind: "learn",
    learnHref: "/learn/rivalries",
    learnLabel: "Read NFL rivalries",
    questions: rivalryQuestions,
  },
];

export const miniGames: MiniGame[] = [...learnMiniGames, ...funQuizzes];

export function getMiniGamesByKind(kind: MiniGameKind): MiniGame[] {
  return miniGames.filter((game) => game.kind === kind);
}

export function getMiniGame(slug: string): MiniGame | undefined {
  return miniGames.find((game) => game.slug === slug);
}

export function getMiniGameSlugs(): MiniGameSlug[] {
  return miniGames.map((game) => game.slug);
}
