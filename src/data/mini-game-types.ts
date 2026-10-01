export type MiniGameQuestion = {
  id: string;
  prompt: string;
  clues?: string[];
  options: string[];
  correctIndex: number;
  explain: string;
};

export type MiniGameKind = "learn" | "fun" | "build";

export type MiniGameSlug =
  | "rules"
  | "who-am-i"
  | "downs"
  | "rivalries"
  | "super-bowl-that"
  | "nfl-or-nonsense"
  | "name-the-catch"
  | "rivalry-radar"
  | "jersey-legends"
  | "draft-day-chaos"
  | "uk-kickoff-survival"
  | "logo-colour-call"
  | "one-season-wonders"
  | "build-a-quarterback";

type MiniGameBase = {
  slug: MiniGameSlug;
  title: string;
  summary: string;
  minutes: number;
  learnHref?: string;
  learnLabel?: string;
};

export type QuizMiniGame = MiniGameBase & {
  kind: "learn" | "fun";
  questions: MiniGameQuestion[];
};

export type BuildMiniGame = MiniGameBase & {
  kind: "build";
};

export type MiniGame = QuizMiniGame | BuildMiniGame;
