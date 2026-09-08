import {
  formationDefence,
  formationEleven,
  formationOLine,
  formationOffence,
} from "@/data/formation";

export type DiagramMarker = {
  id: string;
  kind: "O" | "X" | "ball";
  x: number;
  y: number;
  label?: string;
};

export type DiagramPath = {
  id: string;
  d: string;
  kind: "run" | "route" | "pass" | "rush" | "block";
};

export type DiagramNote = {
  id: string;
  x: number;
  y: number;
  text: string;
  fill?: string;
};

export type LessonDiagram = {
  id: string;
  title: string;
  caption: string;
  layout: "play" | "field";
  markers: DiagramMarker[];
  paths?: DiagramPath[];
  notes?: DiagramNote[];
};

export const lessonDiagrams: LessonDiagram[] = [
  {
    id: "the-field",
    title: "The field",
    caption:
      "End zones at each end (10 yards deep). The 100 yards between them are the playing field. Goalposts sit at the back of each end zone. The ball starts somewhere in the middle and the offence try to carry it into the far paint.",
    layout: "field",
    markers: [{ id: "ball", kind: "ball", x: 180, y: 88 }],
    notes: [
      { id: "ez-l", x: 28, y: 92, text: "END", fill: "#e8b84a" },
      { id: "ez-r", x: 332, y: 92, text: "END", fill: "#e8b84a" },
      { id: "mid", x: 180, y: 36, text: "MIDFIELD", fill: "#c9c2b3" },
    ],
  },
  {
    id: "first-and-ten",
    title: "1st & 10",
    caption:
      "Gold line: where this play starts (line of scrimmage). Yellow dashed line: 10 yards on, the first-down marker. Gain that, and you get a fresh set of four downs. The bright line on television is this marker, not paint on the grass.",
    layout: "play",
    markers: [
      ...formationEleven,
      { id: "ball", kind: "ball", x: 156, y: 148 },
    ],
    notes: [{ id: "fd", x: 292, y: 66, text: "1st down", fill: "#f3d27a" }],
  },
  {
    id: "scoring-end-zone",
    title: "How points land",
    caption:
      "Carry or catch it in the end zone: touchdown (6). Kick it through the posts: field goal (3) or the extra point after a touchdown (1). The posts sit at the back of the end zone, not on the goal line.",
    layout: "field",
    markers: [
      { id: "ball", kind: "ball", x: 318, y: 88 },
      { id: "kicker", kind: "O", x: 248, y: 88, label: "K" },
    ],
    paths: [{ id: "kick", d: "M248 88 L338 40", kind: "pass" }],
    notes: [
      { id: "goal", x: 332, y: 32, text: "POSTS", fill: "#e8b84a" },
      { id: "ez", x: 328, y: 132, text: "END ZONE", fill: "#e8b84a" },
    ],
  },
  {
    id: "eleven-v-eleven",
    title: "11 v 11",
    caption:
      "Cream circles are offence (they have the ball). Dark circles with gold letters are defence. Five blockers on the line, quarterback behind them, a running back deeper, receivers out wide. Defence mirrors that with a line, linebackers, corners and safeties.",
    layout: "play",
    markers: formationEleven,
  },
  {
    id: "the-pocket",
    title: "The pocket",
    caption:
      "The offensive line tries to keep a little pocket of grass around the quarterback. Red arrows are the rush. If those arrows arrive, the QB is sacked, throws it away, or scrambles.",
    layout: "play",
    markers: [
      ...formationOLine,
      { id: "qb", kind: "O", x: 156, y: 204, label: "QB" },
      { id: "de-l", kind: "X", x: 96, y: 118, label: "DE" },
      { id: "dt-l", kind: "X", x: 132, y: 118, label: "DT" },
      { id: "dt-r", kind: "X", x: 180, y: 118, label: "DT" },
      { id: "de-r", kind: "X", x: 216, y: 118, label: "DE" },
    ],
    paths: [
      { id: "r1", d: "M96 118 L128 184", kind: "rush" },
      { id: "r2", d: "M132 118 L148 184", kind: "rush" },
      { id: "r3", d: "M180 118 L168 184", kind: "rush" },
      { id: "r4", d: "M216 118 L186 184", kind: "rush" },
    ],
  },
  {
    id: "interception",
    title: "Interception",
    caption:
      "The quarterback throws toward a receiver. A defender (CB) steps in front and catches it. That is an interception: the defence now have the ball and can run the other way.",
    layout: "play",
    markers: [
      { id: "qb", kind: "O", x: 156, y: 196, label: "QB" },
      { id: "wr", kind: "O", x: 280, y: 70, label: "WR" },
      { id: "cb", kind: "X", x: 248, y: 86, label: "CB" },
      ...formationOLine,
    ],
    paths: [
      { id: "route", d: "M328 170 L280 70", kind: "route" },
      { id: "pass", d: "M156 196 C200 140 230 110 248 86", kind: "pass" },
    ],
  },
  {
    id: "kickoff",
    title: "Kick-off",
    caption:
      "Special teams, not the usual 11. One side kicks from their own end; a returner waits deep. Most drives start after a kick-off or a punt, not after a flashy play.",
    layout: "field",
    markers: [
      { id: "k", kind: "O", x: 128, y: 88, label: "K" },
      { id: "c1", kind: "O", x: 158, y: 52, label: "ST" },
      { id: "c2", kind: "O", x: 158, y: 88, label: "ST" },
      { id: "c3", kind: "O", x: 158, y: 124, label: "ST" },
      { id: "ret", kind: "X", x: 300, y: 88, label: "RET" },
      { id: "ball", kind: "ball", x: 142, y: 88 },
    ],
    paths: [{ id: "kick", d: "M142 88 C200 48 250 58 300 88", kind: "pass" }],
  },
  {
    id: "offside",
    title: "Offside",
    caption:
      "The slim gap on the gold line is the neutral zone: the width of the ball. If a defender is across it when the ball is snapped, that is usually offside. Five yards, and the play is often blown dead.",
    layout: "play",
    markers: [
      ...formationOLine,
      { id: "qb", kind: "O", x: 156, y: 196, label: "QB" },
      { id: "jump", kind: "X", x: 176, y: 148, label: "DE" },
      { id: "de", kind: "X", x: 96, y: 118, label: "DE" },
      { id: "dt", kind: "X", x: 132, y: 118, label: "DT" },
    ],
  },
  {
    id: "holding",
    title: "Holding",
    caption:
      "A blocker (OL) has grabbed a rusher instead of using legal hands. Offensive holding is typically 10 yards back. If the defence hold a receiver, it is usually 5 yards and a first down.",
    layout: "play",
    markers: [
      { id: "lt", kind: "O", x: 120, y: 164, label: "OL" },
      { id: "c", kind: "O", x: 156, y: 164, label: "C" },
      { id: "qb", kind: "O", x: 156, y: 204, label: "QB" },
      { id: "de", kind: "X", x: 128, y: 136, label: "DE" },
    ],
    paths: [{ id: "grab", d: "M120 164 L128 136", kind: "block" }],
  },
  {
    id: "pass-interference",
    title: "Pass interference",
    caption:
      "The defender contacts the receiver before the ball arrives, spoiling a catch they were entitled to contest. Defensive PI can be a long walk and a first down. That is why a flag downfield can flip a drive.",
    layout: "play",
    markers: [
      { id: "qb", kind: "O", x: 156, y: 196, label: "QB" },
      { id: "wr", kind: "O", x: 268, y: 56, label: "WR" },
      { id: "cb", kind: "X", x: 258, y: 64, label: "CB" },
      ...formationOLine,
    ],
    paths: [
      { id: "route", d: "M328 170 L268 56", kind: "route" },
      { id: "pass", d: "M156 196 C210 130 240 90 268 56", kind: "pass" },
    ],
  },
];

export function getLessonDiagram(id: string): LessonDiagram | undefined {
  return lessonDiagrams.find((diagram) => diagram.id === id);
}
