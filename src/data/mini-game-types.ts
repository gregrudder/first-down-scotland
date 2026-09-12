export type MiniGameQuestion = {
  id: string;
  prompt: string;
  clues?: string[];
  options: string[];
  correctIndex: number;
  explain: string;
};

export type MiniGameKind = "learn" | "fun";

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
  | "one-season-wonders";

export type MiniGame = {
  slug: MiniGameSlug;
  title: string;
  summary: string;
  minutes: number;
  kind: MiniGameKind;
  learnHref?: string;
  learnLabel?: string;
  questions: MiniGameQuestion[];
};
