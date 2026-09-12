export type DownsExplainerScene = "convert" | "short";

export type DownsExplainerHighlight = "none" | "first-down" | "punt" | "turnover";

export type DownsExplainerStep = {
  id: string;
  scene: DownsExplainerScene;
  title: string;
  caption: string;
  /** What you hear on telly, e.g. “1st & 10”. */
  call: string;
  /** Plain-English reading of the same situation. */
  plain: string;
  ballYard: number;
  losYard: number;
  firstDownYard: number;
  highlight: DownsExplainerHighlight;
};

export const downsExplainerSteps: DownsExplainerStep[] = [
  {
    id: "four-downs",
    scene: "convert",
    title: "Four downs to gain 10 yards",
    caption:
      "The offence get four attempts — downs — to gain 10 yards. Almost every drive starts 1st & 10: first attempt, 10 yards still needed.",
    call: "1st & 10",
    plain: "First attempt · 10 yards to go",
    ballYard: 25,
    losYard: 25,
    firstDownYard: 35,
    highlight: "none",
  },
  {
    id: "short-gain",
    scene: "convert",
    title: "A short gain — still short",
    caption:
      "They pick up 4 yards. That is not enough to reset the count, so it becomes 2nd & 6: second attempt, 6 yards still to go.",
    call: "2nd & 6",
    plain: "Second attempt · 6 yards to go",
    ballYard: 29,
    losYard: 25,
    firstDownYard: 35,
    highlight: "none",
  },
  {
    id: "first-down",
    scene: "convert",
    title: "Cross the marker — first down",
    caption:
      "They get the remaining yards and cross the first-down marker. The referee signals a first down. The four-down count is about to reset.",
    call: "FIRST DOWN",
    plain: "They made the 10 yards",
    ballYard: 36,
    losYard: 25,
    firstDownYard: 35,
    highlight: "first-down",
  },
  {
    id: "reset",
    scene: "convert",
    title: "Reset to 1st & 10",
    caption:
      "Fresh set of four. The new line of scrimmage is where the ball sits now, and a new 10-yard target is marked ahead. Back to 1st & 10.",
    call: "1st & 10",
    plain: "New set · 10 yards to go again",
    ballYard: 36,
    losYard: 36,
    firstDownYard: 46,
    highlight: "none",
  },
  {
    id: "punt",
    scene: "short",
    title: "If you do not make it: usually punt",
    caption:
      "Different example. Four downs were not enough, so it is 4th & 4. Most of the time they punt — kick the ball away — so the other team start further back.",
    call: "4th & 4",
    plain: "Last attempt · still 4 yards short",
    ballYard: 31,
    losYard: 25,
    firstDownYard: 35,
    highlight: "punt",
  },
  {
    id: "turnover",
    scene: "short",
    title: "Or go for it and fail: turnover",
    caption:
      "If they try to gain those 4 yards and come up short, there is no kick. The defence take the ball on the spot. That is a turnover on downs.",
    call: "Turnover",
    plain: "Defence take over on the spot",
    ballYard: 31,
    losYard: 25,
    firstDownYard: 35,
    highlight: "turnover",
  },
];

export const downsExplainerStepMs = 2800;
