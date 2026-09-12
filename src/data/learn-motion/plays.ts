import { learnMotionStepMs, type LearnMotionStep } from "./types";

export type AnimatedPlay = "slant" | "screen" | "outside-run";

export type PlaysStep = LearnMotionStep & {
  play: AnimatedPlay;
  /** 0 = lined up, 1 = the play has developed. */
  progress: number;
};

export const playsMotionSteps: PlaysStep[] = [
  {
    id: "slant-set",
    play: "slant",
    title: "Slant: one step, then cut in",
    caption:
      "A receiver takes a short step upfield, then breaks diagonally toward the middle. The ball is out of the quarterback’s hand almost immediately.",
    call: "Slant",
    plain: "Quick throw · cut inside",
    progress: 0,
  },
  {
    id: "slant-catch",
    play: "slant",
    title: "The dart arrives",
    caption:
      "Do not wait for a long route. The throw is a dart. If the receiver plants and cuts in, the ball is already coming.",
    call: "Caught",
    plain: "Ball to the inside shoulder",
    progress: 1,
  },
  {
    id: "screen-set",
    play: "screen",
    title: "Screen: let the rush go past",
    caption:
      "The quarterback lets the defence chase them. Offensive linemen peel out to one side to form a wall. It looks like collapse on purpose.",
    call: "Screen",
    plain: "Rush upfield · blockers leaking out",
    progress: 0,
  },
  {
    id: "screen-throw",
    play: "screen",
    title: "Then a tiny throw, and space",
    caption:
      "The dump is short. The running back takes it with teammates in front. The yards come after the catch, not from the throw.",
    call: "Dump-off",
    plain: "RB running behind a wall",
    progress: 1,
  },
  {
    id: "sweep-set",
    play: "outside-run",
    title: "Outside run: around the edge",
    caption:
      "Instead of diving into the pile, the back takes the ball and races wide. Blockers try to wall off that side so there is grass to run into.",
    call: "Sweep",
    plain: "Toss wide · not through the middle",
    progress: 0,
  },
  {
    id: "sweep-edge",
    play: "outside-run",
    title: "One runner appears outside the scrum",
    caption:
      "Watch the edge, not the pile. If a defender sets outside, the back may cut back in. If the wall holds, they have a lane down the sideline.",
    call: "The edge",
    plain: "Running around the line",
    progress: 1,
  },
];

export const playsMotionStepMs = learnMotionStepMs;
