import { formationEleven } from "@/data/formation";

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

const eleven: PlayMarker[] = formationEleven;

export const plays: Play[] = [
  {
    slug: "inside-run",
    title: "Inside run",
    alsoCalled: "Dive, iso, or “give it to the back up the middle”.",
    summary:
      "The simplest play in the sport. The quarterback hands the ball to the running back, who aims at a gap between the big people in the middle.",
    watch:
      "Ignore the wide receivers. Watch the hole the back is aiming at (a crease between two linemen), and whether a linebacker fills it.",
    minutes: 3,
    caption:
      "Offence at the bottom. The running back takes a hand-off and runs straight through a gap in the middle of the line. Offensive linemen step forward to block. Defence is the dark circles with gold letters above the line of scrimmage.",
    markers: eleven,
    paths: [
      { id: "hand", d: "M156 196 L156 216", kind: "block" },
      { id: "dive", d: "M156 226 C150 196 148 150 156 108", kind: "run" },
      { id: "b1", d: "M126 164 L126 140", kind: "block" },
      { id: "b2", d: "M156 164 L156 140", kind: "block" },
      { id: "b3", d: "M186 164 L186 140", kind: "block" },
    ],
  },
  {
    slug: "outside-run",
    title: "Outside run",
    alsoCalled: "Sweep or toss: the ball goes wide, not through the middle.",
    summary:
      "Instead of diving into the pile, the back takes the ball and races around the edge. The offensive line and a receiver try to wall off that side so there is grass to run into.",
    watch:
      "The play starts to look like a scrum, then one runner appears outside it. Watch the edge: if a defender sets outside, the back may cut back in.",
    minutes: 3,
    caption:
      "The running back takes the ball and sweeps left around the line, rather than through it. Blockers on that side step out to clear a lane. Defence is the dark circles with gold letters."
    markers: eleven.map((marker) =>
      marker.id === "rb" ? { ...marker, x: 176, y: 226 } : marker,
    ),
    paths: [
      { id: "toss", d: "M156 196 C168 208 176 220 176 226", kind: "block" },
      { id: "sweep", d: "M176 226 C120 216 64 176 48 118", kind: "run" },
      { id: "kick", d: "M96 164 L70 140", kind: "block" },
      { id: "te-away", d: "M248 164 L264 148", kind: "block" },
      { id: "wr-seal", d: "M32 170 L32 128", kind: "block" },
    ],
  },
  {
    slug: "play-action",
    title: "Play-action pass",
    alsoCalled: "A fake run, then a throw.",
    summary:
      "The quarterback pretends to hand the ball off. Linebackers step up to stop the run that is not coming. A receiver then slips in behind them.",
    watch:
      "First look at the fake: the back dives as if it is a run. Then find the quarterback. If the ball is still in their hands and a receiver is behind a frozen linebacker, that is the play.",
    minutes: 3,
    caption:
      "The running back fakes a dive up the middle. The quarterback keeps the ball, drops a step, and throws to a receiver running a deep route on the right. Linebackers are drawn toward the fake.",
    markers: eleven,
    paths: [
      { id: "fake", d: "M156 226 L156 150", kind: "block" },
      { id: "drop", d: "M156 196 L156 214", kind: "run" },
      { id: "route", d: "M328 170 C318 120 300 70 268 36", kind: "route" },
      { id: "pass", d: "M156 214 C220 160 250 90 268 36", kind: "pass" },
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
      { id: "rush1", d: "M132 118 L148 168", kind: "rush" },
      { id: "rush2", d: "M180 118 L168 170", kind: "rush" },
      { id: "ol1", d: "M186 164 C210 150 236 140 250 120", kind: "block" },
      { id: "ol2", d: "M216 164 C230 148 248 132 258 110", kind: "block" },
      { id: "rb", d: "M156 226 C200 220 236 190 248 150", kind: "run" },
      { id: "pass", d: "M156 196 C200 200 230 170 248 150", kind: "pass" },
    ],
  },
  {
    slug: "slant",
    title: "Slant",
    alsoCalled: "Quick game: one step and cut inside.",
    summary:
      "A receiver takes a short step upfield, then breaks diagonally in. The ball is out of the quarterback’s hand almost immediately. Useful on third-and-short, or when the defence is playing off.",
    watch:
      "Do not wait for a long developing route. The throw is a dart. Watch the receiver’s first two steps: if they plant and cut in, the ball is already coming.",
    minutes: 3,
    caption:
      "Both wide receivers run quick slant routes toward the middle. The quarterback throws immediately to the receiver on the left, before the defence can close.",
    markers: eleven,
    paths: [
      { id: "sl", d: "M32 170 L110 96", kind: "route" },
      { id: "sr", d: "M328 170 L250 96", kind: "route" },
      { id: "pass", d: "M156 196 L110 96", kind: "pass" },
    ],
  },
  {
    slug: "go-route",
    title: "Go route",
    alsoCalled: "Fade, streak, or a vertical shot: the deep ball.",
    summary:
      "The receiver runs straight down the field as fast as they can. The quarterback throws it over the top. It takes time. The whole stadium watches one ball hang in the air.",
    watch:
      "The cornerback turns and sprints. If they are looking at the quarterback too long, the receiver is already behind them. On TV you will hear “one-on-one”: that is this.",
    minutes: 3,
    caption:
      "The wide receiver on the right runs a straight vertical route down the sideline. The quarterback throws a long pass over the defensive back. Other routes are left quiet so the deep shot is obvious.",
    markers: eleven,
    paths: [
      { id: "go", d: "M328 170 L328 28", kind: "route" },
      { id: "pass", d: "M156 196 C230 140 280 80 328 28", kind: "pass" },
    ],
  },
  {
    slug: "blitz",
    title: "Basic blitz",
    alsoCalled: "Sending extra people after the quarterback.",
    summary:
      "Usually four big defenders rush. A blitz means a linebacker or defensive back joins them. You get more pressure, and more empty grass behind, because those people were meant to cover.",
    watch:
      "Count who is running forward at the snap. If a linebacker or a safety is charging at the quarterback, it is a blitz. Then glance behind them: that is where a quick throw wants to go.",
    minutes: 3,
    caption:
      "Two linebackers and a safety rush toward the quarterback as well as the defensive line. Coverage is thinner downfield. The quarterback may have to throw sooner, or get sacked.",
    markers: eleven,
    paths: [
      { id: "dl1", d: "M132 118 L148 168", kind: "rush" },
      { id: "dl2", d: "M180 118 L166 170", kind: "rush" },
      { id: "dl3", d: "M96 118 L128 168", kind: "rush" },
      { id: "lb", d: "M156 86 L160 176", kind: "rush" },
      { id: "lb2", d: "M200 86 L186 168", kind: "rush" },
      { id: "s", d: "M200 48 L176 160", kind: "rush" },
    ],
  },
  {
    slug: "draw",
    title: "Draw",
    alsoCalled: "A delayed run that looks like a pass for a beat.",
    summary:
      "The quarterback drops as if to throw. The defence start to chase the pass. Then the ball is handed to the back, who runs through the gap the rushers just left.",
    watch:
      "If the quarterback’s first step is backwards but the ball never goes in the air, look for the back slipping up the middle behind a late block.",
    minutes: 3,
    caption:
      "The quarterback drops a step as if to pass. Defenders climb upfield. The running back takes a delayed hand-off through the space they vacated.",
    markers: eleven,
    paths: [
      { id: "drop", d: "M156 196 L156 214", kind: "block" },
      { id: "give", d: "M156 214 L156 226", kind: "block" },
      { id: "draw", d: "M156 226 C168 180 164 140 156 100", kind: "run" },
      { id: "rush-l", d: "M96 118 L128 176", kind: "rush" },
      { id: "rush-r", d: "M216 118 L186 176", kind: "rush" },
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
