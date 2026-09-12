import { learnMotionStepMs, type LearnMotionStep } from "./types";

export type ScoringScene = "touchdown" | "field-goal";

export type ScoringHighlight = "none" | "goal-line" | "touchdown" | "kick" | "field-goal";

export type ScoringStep = LearnMotionStep & {
  scene: ScoringScene;
  ballYard: number;
  /** Lift the ball off the grass for a kick in flight. */
  ballAir?: boolean;
  showKicker?: boolean;
  highlight: ScoringHighlight;
};

export const scoringSteps: ScoringStep[] = [
  {
    id: "td-setup",
    scene: "touchdown",
    title: "Get the ball into the end zone",
    caption:
      "A touchdown is six points. Carry it in, or catch it, in the opponent’s end zone. That gold paint at the far end is the target.",
    call: "Red zone",
    plain: "Near the end zone · 6 on offer",
    ballYard: 88,
    highlight: "none",
  },
  {
    id: "td-goal-line",
    scene: "touchdown",
    title: "Cross the goal line",
    caption:
      "The goal line is the front of that paint. If the ball breaks the plane (even a sliver) it counts. You do not have to stand fully in the end zone.",
    call: "Goal line",
    plain: "Ball reaching the paint",
    ballYard: 100,
    highlight: "goal-line",
  },
  {
    id: "td-score",
    scene: "touchdown",
    title: "Touchdown: 6 points",
    caption:
      "The ball is in the end zone. That is six. After this they try a short kick for one more, or a play from the 2 for two, then kick off to the other lot.",
    call: "TOUCHDOWN",
    plain: "6 points",
    ballYard: 105,
    highlight: "touchdown",
  },
  {
    id: "fg-setup",
    scene: "field-goal",
    title: "Or kick it from here",
    caption:
      "If a touchdown looks unlikely, they can try a field goal: kick the ball through the posts at the back of the end zone. Worth three.",
    call: "Field-goal range",
    plain: "Kicker down · 3 on offer",
    ballYard: 83,
    showKicker: true,
    highlight: "none",
  },
  {
    id: "fg-flight",
    scene: "field-goal",
    title: "Through the posts",
    caption:
      "The ball has to go between the two uprights and over the crossbar. The posts sit at the back of the end zone, not on the goal line.",
    call: "The kick",
    plain: "Ball in the air toward the posts",
    ballYard: 100,
    ballAir: true,
    showKicker: true,
    highlight: "kick",
  },
  {
    id: "fg-score",
    scene: "field-goal",
    title: "Field goal: 3 points",
    caption:
      "Through, and the scoreboard adds three. The same kick, from closer, is the extra point after a touchdown, usually one.",
    call: "FIELD GOAL",
    plain: "3 points",
    ballYard: 110,
    ballAir: true,
    showKicker: true,
    highlight: "field-goal",
  },
];

export const scoringStepMs = learnMotionStepMs;
