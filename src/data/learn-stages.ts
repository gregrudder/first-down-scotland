export type LearnStage = {
  id: string;
  title: string;
  summary: string;
  slugs: string[];
};

export const learnStages: LearnStage[] = [
  {
    id: "basics",
    title: "The basics",
    summary: "The field, four downs, and how points actually land.",
    slugs: ["what-youre-watching", "downs-and-distance", "how-you-score"],
  },
  {
    id: "the-play",
    title: "How a play works",
    summary: "Who does what, the common shapes, turnovers, and the clock.",
    slugs: ["offence-and-defence", "plays", "turnovers", "the-clock"],
  },
  {
    id: "match-day",
    title: "Watching a match",
    summary: "Kicks, flags, and a simple checklist for the telly.",
    slugs: ["special-teams", "penalties", "what-to-look-for"],
  },
  {
    id: "the-draft",
    title: "The Draft",
    summary: "How clubs pick college players, and how to follow it from the UK.",
    slugs: ["the-draft"],
  },
  {
    id: "fantasy",
    title: "Fantasy football",
    summary: "What NFL fantasy is, how a week works, and where UK fans actually play.",
    slugs: ["fantasy-football"],
  },
  {
    id: "the-story",
    title: "The story",
    summary: "Rivalries and famous players: the names and grudges the broadcast assumes you know.",
    slugs: ["rivalries", "famous-players"],
  },
];

export function stageForLesson(slug: string): LearnStage | undefined {
  return learnStages.find((stage) => stage.slugs.includes(slug));
}

export function allLessonSlugs(): string[] {
  return learnStages.flatMap((stage) => stage.slugs);
}
