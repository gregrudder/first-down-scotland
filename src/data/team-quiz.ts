import { teams, type NflTeam, type TeamTag } from "@/data/teams";

export type QuizOption = {
  label: string;
  weights: Partial<Record<TeamTag, number>>;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: QuizOption[];
};

export const quizQuestions: QuizQuestion[] = [
  {
    id: "hope",
    prompt: "What do you actually want from a team?",
    options: [
      {
        label: "Banners, history, and a chance of winning most weeks",
        weights: { glory: 3, history: 2 },
      },
      {
        label: "An underdog story I can moan about with love",
        weights: { underdog: 3, "new-energy": 1 },
      },
      {
        label: "A good laugh and a shirt I like: results are bonus",
        weights: { colourful: 2, offence: 2 },
      },
    ],
  },
  {
    id: "colours",
    prompt: "Which colours pull you in?",
    options: [
      {
        label: "Navy, black, silver: keep it classic",
        weights: { classic: 3 },
      },
      {
        label: "Teal, purple, orange: I want to be seen",
        weights: { colourful: 3 },
      },
      {
        label: "Green or gold, something that feels outdoorsy",
        weights: { scotland: 2, cold: 1, water: 1 },
      },
      {
        label: "I genuinely do not care",
        weights: { history: 1 },
      },
    ],
  },
  {
    id: "weather",
    prompt: "Ideal Sunday weather?",
    options: [
      {
        label: "Horizontal rain and a pie. That’s home.",
        weights: { cold: 3, scotland: 2 },
      },
      {
        label: "Sunshine, please. I watch enough grey already.",
        weights: { warm: 3 },
      },
      {
        label: "Doesn’t matter: I’ll be on the sofa either way",
        weights: { civilised: 1 },
      },
    ],
  },
  {
    id: "times",
    prompt: "UK kick-off times: how brave are you?",
    options: [
      {
        label: "I can do 1am on a school night. Once.",
        weights: { "late-night": 3 },
      },
      {
        label: "Civilised tea-time only, I’m not a monster",
        weights: { civilised: 3 },
      },
      {
        label: "A mix is fine: some late, some early",
        weights: { civilised: 1, "late-night": 1 },
      },
    ],
  },
  {
    id: "place",
    prompt: "What kind of place should they play in?",
    options: [
      {
        label: "A huge city. Noise, lights, a skyline.",
        weights: { city: 3 },
      },
      {
        label: "A smaller town that treats the club like the parish church",
        weights: { "small-town": 3 },
      },
      {
        label: "Either: I have never been, I’ll never go, it’s vibes",
        weights: { history: 1, "new-energy": 1 },
      },
    ],
  },
  {
    id: "style",
    prompt: "How should they play?",
    options: [
      {
        label: "Score loads. I want highlights, not a 9-6 slog.",
        weights: { offence: 3 },
      },
      {
        label: "Mean defence. Low-scoring dogfights. Perfect.",
        weights: { defence: 3, classic: 1 },
      },
      {
        label: "A bit of both, as long as they try",
        weights: { offence: 1, defence: 1 },
      },
    ],
  },
  {
    id: "story",
    prompt: "What story do you want to tell in the pub?",
    options: [
      {
        label: "They’ve been around forever. I picked a proper institution.",
        weights: { history: 3, glory: 1 },
      },
      {
        label: "They’re on the up. I got in before it was obvious.",
        weights: { "new-energy": 3, underdog: 1 },
      },
      {
        label: "They have a bird, a cat, or a fish. That’s the pitch.",
        weights: { bird: 2, cat: 2, water: 2 },
      },
    ],
  },
  {
    id: "losing",
    prompt: "When they lose (and they will) what’s your move?",
    options: [
      {
        label: "Still wear the hat. Loyalty is the point.",
        weights: { underdog: 2, scotland: 1, defence: 1 },
      },
      {
        label: "I’d rather they just won, thanks",
        weights: { glory: 3 },
      },
      {
        label: "Banter. The moaning is half the fun.",
        weights: { colourful: 1, offence: 1, underdog: 1 },
      },
    ],
  },
];

export type QuizAnswer = {
  questionId: string;
  optionIndex: number;
};

export type QuizResult = {
  team: NflTeam;
  runnersUp: NflTeam[];
  matchedTags: TeamTag[];
  why: string;
};

function optionWeights(answer: QuizAnswer): Partial<Record<TeamTag, number>> {
  const question = quizQuestions.find((entry) => entry.id === answer.questionId);
  return question?.options[answer.optionIndex]?.weights ?? {};
}

export function scoreQuiz(answers: QuizAnswer[]): QuizResult {
  const totals = new Map<TeamTag, number>();

  for (const answer of answers) {
    for (const [tag, weight] of Object.entries(optionWeights(answer))) {
      const key = tag as TeamTag;
      totals.set(key, (totals.get(key) ?? 0) + (weight ?? 0));
    }
  }

  const ranked = [...teams]
    .map((team) => {
      const score = team.tags.reduce((sum, tag) => sum + (totals.get(tag) ?? 0), 0);
      const matched = team.tags
        .filter((tag) => (totals.get(tag) ?? 0) > 0)
        .sort((a, b) => (totals.get(b) ?? 0) - (totals.get(a) ?? 0));
      return { team, score, matched };
    })
    .sort((a, b) => b.score - a.score || a.team.name.localeCompare(b.team.name));

  const winner = ranked[0]!;
  const runnersUp = ranked.slice(1, 3).map((entry) => entry.team);

  return {
    team: winner.team,
    runnersUp,
    matchedTags: winner.matched.slice(0, 4),
    why: whyThisFits(winner.team, winner.matched, totals),
  };
}

const tagLines: Record<TeamTag, string> = {
  glory: "you like a side that actually wins things",
  underdog: "you’re happy to suffer a bit",
  colourful: "you want a kit people notice",
  classic: "you lean toward navy, black, and old-school kits",
  cold: "you’re not scared of weather",
  warm: "you’d rather watch sunshine than sleet",
  "late-night": "you said you could stay up",
  civilised: "you asked for human kick-off times",
  city: "you wanted a big-city noise",
  "small-town": "you liked the idea of a proper local club",
  offence: "you asked for highlights",
  defence: "you asked for dogfights",
  history: "you wanted an institution, not a fad",
  "new-energy": "you wanted something on the up",
  bird: "you liked a bird on the helmet",
  cat: "you liked a big cat",
  water: "water and coastal kits appealed",
  scotland: "it has a faintly Scottish weather-or-work feel",
};

export function isTeamTag(value: string): value is TeamTag {
  return Object.prototype.hasOwnProperty.call(tagLines, value);
}

export function whyThisFits(
  team: NflTeam,
  matched: TeamTag[],
  totals?: Map<TeamTag, number>,
): string {
  const top = [...matched]
    .sort((a, b) => (totals?.get(b) ?? 0) - (totals?.get(a) ?? 0))
    .slice(0, 3)
    .map((tag) => tagLines[tag]);

  if (top.length === 0) {
    return `${team.name} is a solid first club: pick them, learn the sport, and see if it sticks.`;
  }

  return `${team.name} fit because ${top.join(", and ")}. That is enough to start. You can always pick again.`;
}
