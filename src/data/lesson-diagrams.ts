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

const oLine: DiagramMarker[] = [
  { id: "lt", kind: "O", x: 108, y: 160, label: "LT" },
  { id: "lg", kind: "O", x: 132, y: 160, label: "LG" },
  { id: "c", kind: "O", x: 156, y: 160, label: "C" },
  { id: "rg", kind: "O", x: 180, y: 160, label: "RG" },
  { id: "rt", kind: "O", x: 204, y: 160, label: "RT" },
];

const offence: DiagramMarker[] = [
  ...oLine,
  { id: "qb", kind: "O", x: 156, y: 188, label: "QB" },
  { id: "rb", kind: "O", x: 156, y: 216, label: "RB" },
  { id: "te", kind: "O", x: 232, y: 160, label: "TE" },
  { id: "wrl", kind: "O", x: 40, y: 166, label: "WR" },
  { id: "wrr", kind: "O", x: 320, y: 166, label: "WR" },
];

const defence: DiagramMarker[] = [
  { id: "de-l", kind: "X", x: 100, y: 122 },
  { id: "dt-l", kind: "X", x: 136, y: 122 },
  { id: "dt-r", kind: "X", x: 176, y: 122 },
  { id: "de-r", kind: "X", x: 212, y: 122 },
  { id: "lb-l", kind: "X", x: 124, y: 92 },
  { id: "lb-m", kind: "X", x: 168, y: 92 },
  { id: "lb-r", kind: "X", x: 212, y: 92 },
  { id: "cb-l", kind: "X", x: 40, y: 86 },
  { id: "cb-r", kind: "X", x: 320, y: 86 },
  { id: "s-l", kind: "X", x: 124, y: 54 },
  { id: "s-r", kind: "X", x: 208, y: 54 },
];

export const lessonDiagrams: LessonDiagram[] = [
  {
    id: "the-field",
    title: "The field",
    caption:
      "End zones at each end (10 yards deep). The 100 yards between them are the playing field. Goalposts sit at the back of each end zone. The ball starts somewhere in the middle and the offence try to carry it into the far paint.",
    layout: "field",
    markers: [{ id: "ball", kind: "ball", x: 180, y: 80 }],
    notes: [
      { id: "ez-l", x: 22, y: 84, text: "END", fill: "#e8b84a" },
      { id: "ez-r", x: 338, y: 84, text: "END", fill: "#e8b84a" },
      { id: "mid", x: 180, y: 24, text: "MIDFIELD", fill: "#c9c2b3" },
    ],
  },
  {
    id: "first-and-ten",
    title: "1st & 10",
    caption:
      "Gold line: where this play starts (line of scrimmage). Yellow line: 10 yards on — the first-down marker. Gain that, and you get a fresh set of four downs. The bright line on television is this marker, not paint on the grass.",
    layout: "play",
    markers: [
      ...offence,
      ...defence,
      { id: "ball", kind: "ball", x: 156, y: 148 },
    ],
    notes: [
      { id: "fd", x: 300, y: 78, text: "1st down", fill: "#f3d27a" },
    ],
  },
  {
    id: "scoring-end-zone",
    title: "How points land",
    caption:
      "Carry or catch it in the end zone: touchdown (6). Kick it through the posts: field goal (3) or the extra point after a touchdown (1). The posts sit at the back of the end zone, not on the goal line.",
    layout: "field",
    markers: [
      { id: "ball", kind: "ball", x: 318, y: 80 },
      { id: "kicker", kind: "O", x: 250, y: 80, label: "K" },
    ],
    paths: [{ id: "kick", d: "M250 80 L338 36", kind: "pass" }],
    notes: [
      { id: "goal", x: 338, y: 22, text: "POSTS", fill: "#e8b84a" },
      { id: "ez", x: 338, y: 118, text: "END ZONE", fill: "#e8b84a" },
    ],
  },
  {
    id: "eleven-v-eleven",
    title: "11 v 11",
    caption:
      "O = offence (they have the ball). X = defence. Five big blockers on the line, quarterback behind them, a running back deeper, receivers out wide. Defence mirrors that with a line, linebackers, and a back four.",
    layout: "play",
    markers: [...offence, ...defence],
  },
  {
    id: "the-pocket",
    title: "The pocket",
    caption:
      "The offensive line tries to keep a little pocket of grass around the quarterback. Red arrows are the rush. If those arrows arrive, the QB is sacked, throws it away, or scrambles.",
    layout: "play",
    markers: [
      ...oLine,
      { id: "qb", kind: "O", x: 156, y: 196, label: "QB" },
      { id: "de-l", kind: "X", x: 100, y: 122 },
      { id: "dt-l", kind: "X", x: 136, y: 122 },
      { id: "dt-r", kind: "X", x: 176, y: 122 },
      { id: "de-r", kind: "X", x: 212, y: 122 },
    ],
    paths: [
      { id: "r1", d: "M100 122 L128 176", kind: "rush" },
      { id: "r2", d: "M136 122 L148 176", kind: "rush" },
      { id: "r3", d: "M176 122 L168 176", kind: "rush" },
      { id: "r4", d: "M212 122 L186 176", kind: "rush" },
    ],
  },
  {
    id: "interception",
    title: "Interception",
    caption:
      "The quarterback throws toward a receiver. A defender (X) steps in front and catches it. That is an interception — the defence now have the ball and can run the other way.",
    layout: "play",
    markers: [
      { id: "qb", kind: "O", x: 156, y: 188, label: "QB" },
      { id: "wr", kind: "O", x: 280, y: 70, label: "WR" },
      { id: "cb", kind: "X", x: 248, y: 86, label: "CB" },
      ...oLine,
    ],
    paths: [
      { id: "route", d: "M300 166 L280 70", kind: "route" },
      { id: "pass", d: "M156 188 C200 140 230 110 248 86", kind: "pass" },
    ],
  },
  {
    id: "kickoff",
    title: "Kick-off",
    caption:
      "Special teams, not the usual 11. One side kicks from their own end; a returner waits deep. Most drives start after a kick-off or a punt, not after a flashy play.",
    layout: "field",
    markers: [
      { id: "k", kind: "O", x: 130, y: 80, label: "K" },
      { id: "c1", kind: "O", x: 150, y: 50 },
      { id: "c2", kind: "O", x: 150, y: 80 },
      { id: "c3", kind: "O", x: 150, y: 110 },
      { id: "ret", kind: "X", x: 300, y: 80, label: "RET" },
      { id: "ball", kind: "ball", x: 142, y: 80 },
    ],
    paths: [{ id: "kick", d: "M142 80 C200 40 250 50 300 80", kind: "pass" }],
  },
  {
    id: "offside",
    title: "Offside",
    caption:
      "The slim gap on the gold line is the neutral zone — the width of the ball. If a defender (X) is across it when the ball is snapped, that is usually offside: five yards, and the play is often blown dead.",
    layout: "play",
    markers: [
      ...oLine,
      { id: "qb", kind: "O", x: 156, y: 188, label: "QB" },
      { id: "jump", kind: "X", x: 176, y: 148, label: "X" },
      { id: "de", kind: "X", x: 100, y: 122 },
      { id: "dt", kind: "X", x: 136, y: 122 },
    ],
  },
  {
    id: "holding",
    title: "Holding",
    caption:
      "A blocker (O) has grabbed a rusher instead of using legal hands. Offensive holding is typically 10 yards back. If the defence hold a receiver, it is usually 5 yards and a first down.",
    layout: "play",
    markers: [
      { id: "lt", kind: "O", x: 120, y: 160, label: "OL" },
      { id: "c", kind: "O", x: 156, y: 160, label: "C" },
      { id: "qb", kind: "O", x: 156, y: 196, label: "QB" },
      { id: "de", kind: "X", x: 128, y: 138, label: "DE" },
    ],
    paths: [{ id: "grab", d: "M120 160 L128 138", kind: "block" }],
  },
  {
    id: "pass-interference",
    title: "Pass interference",
    caption:
      "The defender contacts the receiver before the ball arrives, spoiling a catch they were entitled to contest. Defensive PI can be a long walk and a first down. That is why a flag downfield can flip a drive.",
    layout: "play",
    markers: [
      { id: "qb", kind: "O", x: 156, y: 188, label: "QB" },
      { id: "wr", kind: "O", x: 268, y: 56, label: "WR" },
      { id: "cb", kind: "X", x: 258, y: 64, label: "CB" },
      ...oLine,
    ],
    paths: [
      { id: "route", d: "M320 166 L268 56", kind: "route" },
      { id: "pass", d: "M156 188 C210 130 240 90 268 56", kind: "pass" },
    ],
  },
];

export function getLessonDiagram(id: string): LessonDiagram | undefined {
  return lessonDiagrams.find((diagram) => diagram.id === id);
}
