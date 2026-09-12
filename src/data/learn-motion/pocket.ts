import { learnMotionStepMs, type LearnMotionStep } from "./types";

export type PocketStep = LearnMotionStep & {
  /** 0 = rushers lined up, 1 = they have arrived. */
  rush: number;
  sack?: boolean;
};

export const pocketSteps: PocketStep[] = [
  {
    id: "pocket-holds",
    title: "This space is the pocket",
    caption:
      "The five offensive linemen try to keep a little pocket of grass around the quarterback. From here the QB can see, step, and throw.",
    call: "The pocket",
    plain: "Protected space behind the line",
    rush: 0,
  },
  {
    id: "rush-comes",
    title: "The rush comes",
    caption:
      "Four big defenders try to collapse that space. Ends from the outside, tackles through the middle. That is the pass rush.",
    call: "Pressure",
    plain: "Rushers heading for the QB",
    rush: 0.4,
  },
  {
    id: "collapsing",
    title: "The pocket shrinks",
    caption:
      "If the line loses, the pocket collapses. The quarterback has less time and less room. This is why people shout about “protection”.",
    call: "Collapsing",
    plain: "The space is disappearing",
    rush: 0.72,
  },
  {
    id: "why-it-matters",
    title: "Why pressure matters",
    caption:
      "If they arrive, the QB is sacked, forced to throw it away, or has to scramble. A lot of the game is just: does the pocket hold?",
    call: "SACK",
    plain: "QB hit behind the line",
    rush: 1,
    sack: true,
  },
];

export const pocketStepMs = learnMotionStepMs;
