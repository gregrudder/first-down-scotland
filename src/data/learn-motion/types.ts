export type LearnMotionStep = {
  id: string;
  title: string;
  caption: string;
  /** What you hear on telly, or the scoreboard call. */
  call: string;
  /** Plain-English reading of the same beat. */
  plain: string;
};

export const learnMotionStepMs = 2800;
