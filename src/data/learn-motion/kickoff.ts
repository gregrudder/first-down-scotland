import { learnMotionStepMs, type LearnMotionStep } from "./types";

export type KickoffBall = "tee" | "flight" | "catch" | "return";

export type KickoffStep = LearnMotionStep & {
  ball: KickoffBall;
};

export const kickoffSteps: KickoffStep[] = [
  {
    id: "lined-up",
    title: "The game restarts with a kick-off",
    caption:
      "After most scores, and at the start of each half, one side kicks the ball to the other. Special teams, not the usual 11.",
    call: "Kick-off",
    plain: "Kicker ready · returner deep",
    ball: "tee",
  },
  {
    id: "flight",
    title: "The ball is in the air",
    caption:
      "The kicker sends it downfield. Coverage players sprint after it. The returner waits, then decides: catch and run, or take a touchback.",
    call: "In flight",
    plain: "High kick toward the returner",
    ball: "flight",
  },
  {
    id: "catch",
    title: "Caught",
    caption:
      "The returner fields it. From here they can run it back, or take a knee in the end zone for a touchback and start at a set yard line.",
    call: "Caught",
    plain: "Returner has the ball",
    ball: "catch",
  },
  {
    id: "return",
    title: "A basic return",
    caption:
      "If they run, they try to find a lane while the kicking team closes in. Most returns do not go the distance. Field position is the prize.",
    call: "Return",
    plain: "Running it back up the field",
    ball: "return",
  },
];

export const kickoffStepMs = learnMotionStepMs;
