import { learnMotionStepMs, type LearnMotionStep } from "./types";

export type TurnoverScene = "interception" | "fumble";

export type TurnoverBall = "qb" | "air" | "cb" | "return" | "carrier" | "loose" | "recovered";

export type TurnoverStep = LearnMotionStep & {
  scene: TurnoverScene;
  ball: TurnoverBall;
  possession: "offence" | "defence" | "loose";
};

export const turnoverSteps: TurnoverStep[] = [
  {
    id: "the-throw",
    scene: "interception",
    title: "A pass meant for an attacker",
    caption:
      "The quarterback throws toward a receiver. Most of the time that catch belongs to the offence. Not this time.",
    call: "The throw",
    plain: "Ball in the air toward the WR",
    ball: "air",
    possession: "offence",
  },
  {
    id: "stepped-in",
    scene: "interception",
    title: "A defender steps in front",
    caption:
      "The cornerback reads the throw and cuts inside the receiver. If they catch it, the offence do not get another down.",
    call: "Read",
    plain: "CB in the throwing lane",
    ball: "cb",
    possession: "offence",
  },
  {
    id: "interception",
    scene: "interception",
    title: "Interception: they have the ball",
    caption:
      "Caught by the defence. Possession has flipped in one play. The player who caught it can run the other way until they are tackled.",
    call: "INTERCEPTION",
    plain: "Defence now have the ball",
    ball: "cb",
    possession: "defence",
  },
  {
    id: "return",
    scene: "interception",
    title: "And they can run it back",
    caption:
      "The defence are now the ones advancing. A pick returned all the way is a pick-six: six points, and the other attack never even got a down.",
    call: "Return",
    plain: "Running the other way",
    ball: "return",
    possession: "defence",
  },
  {
    id: "fumble",
    scene: "fumble",
    title: "A fumble is the other steal",
    caption:
      "If the ball-carrier drops it, or has it knocked free, it is a fumble. The ball is live on the grass. Whoever falls on it, owns it.",
    call: "Fumble",
    plain: "Loose ball · either side can take it",
    ball: "loose",
    possession: "loose",
  },
  {
    id: "recovered",
    scene: "fumble",
    title: "Whoever falls on it, owns it",
    caption:
      "Here the defence recover it. Same result as an interception: the other lot have the ball, and the careful drive is gone.",
    call: "Recovery",
    plain: "Defence take over",
    ball: "recovered",
    possession: "defence",
  },
];

export const turnoverStepMs = learnMotionStepMs;
