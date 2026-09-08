export const foundOptions = [
  { id: "tiktok", label: "TikTok" },
  { id: "mate", label: "A mate" },
  { id: "other", label: "Somewhere else" },
] as const;

export const favouriteOptions = [
  { id: "learn", label: "Learn" },
  { id: "plays", label: "Plays / diagrams" },
  { id: "pick-my-team", label: "Pick my team" },
  { id: "fixtures", label: "This week’s fixtures" },
  { id: "watch-near-you", label: "Watch near you / pubs" },
  { id: "podcasts", label: "Podcasts" },
  { id: "other", label: "Something else" },
] as const;

export const payOptions = [
  { id: "yes", label: "Yes" },
  { id: "maybe", label: "Maybe" },
  { id: "no", label: "No" },
] as const;

export const recommendOptions = [
  { id: "yes", label: "Yes" },
  { id: "not-sure", label: "Not sure" },
  { id: "no", label: "Not yet" },
] as const;

export type FeedbackPayload = {
  found: (typeof foundOptions)[number]["id"];
  foundOther?: string;
  favourite: (typeof favouriteOptions)[number]["id"];
  favouriteOther?: string;
  confusing?: string;
  broken?: string;
  pay: (typeof payOptions)[number]["id"];
  worthIt?: string;
  else?: string;
  name?: string;
  team?: string;
  recommend?: (typeof recommendOptions)[number]["id"];
  startedAt?: number;
  website?: string;
};

export const FEEDBACK_LIMITS = {
  short: 80,
  text: 2000,
  name: 80,
  team: 8,
} as const;
