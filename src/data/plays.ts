export type PlayMarker = {
  id: string;
  kind: "O" | "X";
  x: number;
  y: number;
  label?: string;
};

export type PlayPath = {
  id: string;
  d: string;
  kind: "run" | "route" | "pass" | "rush" | "block";
};

export type Play = {
  slug: string;
  title: string;
  alsoCalled: string;
  summary: string;
  watch: string;
  minutes: number;
  caption: string;
  markers: PlayMarker[];
  paths: PlayPath[];
};

const offence: PlayMarker[] = [
  { id: "lt", kind: "O", x: 108, y: 160, label: "LT" },
  { id: "lg", kind: "O", x: 132, y: 160, label: "LG" },
  { id: "c", kind: "O", x: 156, y: 160, label: "C" },
  { id: "rg", kind: "O", x: 180, y: 160, label: "RG" },
  { id: "rt", kind: "O", x: 204, y: 160, label: "RT" },
  { id: "qb", kind: "O", x: 156, y: 188, label: "QB" },
  { id: "rb", kind: "O", x: 156, y: 216, label: "RB" },
  { id: "te", kind: "O", x: 232, y: 160, label: "TE" },
  { id: "wrl", kind: "O", x: 40, y: 166, label: "WR" },
  { id: "wrr", kind: "O", x: 320, y: 166, label: "WR" },
];

const defence: PlayMarker[] = [
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

const eleven = [...offence, ...defence];

export const plays: Play[] = [
  {
    slug: "inside-run",
    title: "Inside run",
    alsoCalled: "Dive, iso, or “give it to the back up the middle”.",
    summary:
      "The simplest play in the sport. The quarterback hands the ball to the running back, who aims at a gap between the big people in the middle.",
    watch:
      "Ignore the wide receivers. Watch the hole the back is aiming at — a crease between two linemen — and whether a linebacker fills it.",
    minutes: 3,
    caption:
      "Offence at the bottom. The running back takes a hand-off and runs straight through a gap in the middle of the line. Offensive linemen step forward to block. Defence is marked with X’s above the line of scrimmage.",
    markers: eleven,
    paths: [
      { id: "hand", d: "M156 188 L156 204", kind: "block" },
      { id: "dive", d: "M156 216 C150 190 148 150 156 108", kind: "run" },
      { id: "b1", d: "M132 160 L132 138", kind: "block" },
      { id: "b2", d: "M156 160 L156 138", kind: "block" },
      { id: "b3", d: "M180 160 L180 138", kind: "block" },
    ],
  },
  {
    slug: "outside-run",
    title: "Outside run",
    alsoCalled: "Sweep or toss — the ball goes wide, not through the middle.",
    summary:
      "Instead of diving into the pile, the back takes the ball and races around the edge. The offensive line and a receiver try to wall off that side so there is grass to run into.",
    watch:
      "The play starts to look like a scrum, then one runner appears outside it. Watch the edge: if a defender sets outside, the back may cut back in.",
    minutes: 3,
    caption:
      "The running back takes the ball and sweeps left around the line, rather than through it. Blockers on that side step out to clear a lane. Defence is shown as X’s.",
    markers: eleven.map((marker) =>
      marker.id === "rb" ? { ...marker, x: 176, y: 216 } : marker,
    ),
    paths: [
      { id: "toss", d: "M156 188 C168 200 176 210 176 216", kind: "block" },
      { id: "sweep", d: "M176 216 C120 210 64 176 48 118", kind: "run" },
      { id: "kick", d: "M108 160 L78 140", kind: "block" },
      { id: "te-away", d: "M232 160 L248 146", kind: "block" },
      { id: "wr-seal", d: "M40 166 L40 128", kind: "block" },
    ],
  },
  {
    slug: "play-action",
    title: "Play-action pass",
    alsoCalled: "A fake run, then a throw.",
    summary:
      "The quarterback pretends to hand the ball off. Linebackers step up to stop the run that is not coming. A receiver then slips in behind them.",
    watch:
      "First look at the fake — the back dives as if it is a run. Then find the quarterback. If the ball is still in their hands and a receiver is behind a frozen linebacker, that is the play.",
    minutes: 3,
    caption:
      "The running back fakes a dive up the middle. The quarterback keeps the ball, drops a step, and throws to a receiver running a deep route on the right. Linebackers are drawn toward the fake.",
    markers: eleven,
    paths: [
      { id: "fake", d: "M156 216 L156 150", kind: "block" },
      { id: "drop", d: "M156 188 L156 206", kind: "run" },
      { id: "route", d: "M320 166 C318 120 300 70 268 36", kind: "route" },
      { id: "pass", d: "M156 206 C220 160 250 90 268 36", kind: "pass" },
    ],
  },
  {
    slug: "screen",
    title: "Screen pass",
    alsoCalled: "A short throw with blockers in front, after the rush has gone past.",
    summary:
      "The quarterback lets the defence chase them, then dumps a short pass to a back or receiver who has a wall of teammates waiting. It looks like collapse, then suddenly someone is running in space.",
    watch:
      "If three big offensive linemen peel out to one side instead of blocking in place, look for the screen. The throw is tiny. The yards come after the catch.",
    minutes: 3,
    caption:
      "Defenders rush the quarterback. Offensive linemen release to the right to form a wall. The running back slips that way and takes a short pass, then runs behind the blockers.",
    markers: eleven,
    paths: [
      { id: "rush1", d: "M136 122 L148 168", kind: "rush" },
      { id: "rush2", d: "M176 122 L168 170", kind: "rush" },
      { id: "ol1", d: "M180 160 C210 150 236 140 250 120", kind: "block" },
      { id: "ol2", d: "M204 160 C230 148 248 132 258 110", kind: "block" },
      { id: "rb", d: "M156 216 C200 214 236 190 248 150", kind: "run" },
      { id: "pass", d: "M156 188 C200 200 230 170 248 150", kind: "pass" },
    ],
  },
  {
    slug: "slant",
    title: "Slant",
    alsoCalled: "Quick game — one step and cut inside.",
    summary:
      "A receiver takes a short step upfield, then breaks diagonally in. The ball is out of the quarterback’s hand almost immediately. Useful on third-and-short, or when the defence is playing off.",
    watch:
      "Do not wait for a long developing route. The throw is a dart. Watch the receiver’s first two steps: if they plant and cut in, the ball is already coming.",
    minutes: 3,
    caption:
      "Both wide receivers run quick slant routes toward the middle. The quarterback throws immediately to the receiver on the left, before the defence can close.",
    markers: eleven,
    paths: [
      { id: "sl", d: "M40 166 L110 96", kind: "route" },
      { id: "sr", d: "M320 166 L250 96", kind: "route" },
      { id: "pass", d: "M156 188 L110 96", kind: "pass" },
    ],
  },
  {
    slug: "go-route",
    title: "Go route",
    alsoCalled: "Fade, streak, or a vertical shot — the deep ball.",
    summary:
      "The receiver runs straight down the field as fast as they can. The quarterback throws it over the top. It takes time. The whole stadium watches one ball hang in the air.",
    watch:
      "The cornerback turns and sprints. If they are looking at the quarterback too long, the receiver is already behind them. On TV you will hear “one-on-one” — that is this.",
    minutes: 3,
    caption:
      "The wide receiver on the right runs a straight vertical route down the sideline. The quarterback throws a long pass over the defensive back. Other routes are left quiet so the deep shot is obvious.",
    markers: eleven,
    paths: [
      { id: "go", d: "M320 166 L320 28", kind: "route" },
      { id: "pass", d: "M156 188 C230 140 280 80 320 28", kind: "pass" },
    ],
  },
  {
    slug: "blitz",
    title: "Basic blitz",
    alsoCalled: "Sending extra people after the quarterback.",
    summary:
      "Usually four big defenders rush. A blitz means a linebacker or defensive back joins them. You get more pressure — and more empty grass behind, because those people were meant to cover.",
    watch:
      "Count who is running forward at the snap. If a linebacker or a safety is charging at the quarterback, it is a blitz. Then glance behind them: that is where a quick throw wants to go.",
    minutes: 3,
    caption:
      "Two linebackers and a safety rush toward the quarterback as well as the defensive line. Coverage is thinner downfield. The quarterback may have to throw sooner, or get sacked.",
    markers: eleven,
    paths: [
      { id: "dl1", d: "M136 122 L148 168", kind: "rush" },
      { id: "dl2", d: "M176 122 L166 170", kind: "rush" },
      { id: "dl3", d: "M100 122 L128 168", kind: "rush" },
      { id: "lb", d: "M168 92 L160 176", kind: "rush" },
      { id: "lb2", d: "M212 92 L186 168", kind: "rush" },
      { id: "s", d: "M208 54 L176 160", kind: "rush" },
    ],
  },
];

export function getPlay(slug: string): Play | undefined {
  return plays.find((play) => play.slug === slug);
}

export function getPlaySlugs(): string[] {
  return plays.map((play) => play.slug);
}

export function getNextPlay(slug: string): Play | undefined {
  const index = plays.findIndex((play) => play.slug === slug);
  if (index === -1) return undefined;
  return plays[index + 1];
}

export function getPreviousPlay(slug: string): Play | undefined {
  const index = plays.findIndex((play) => play.slug === slug);
  if (index <= 0) return undefined;
  return plays[index - 1];
}
