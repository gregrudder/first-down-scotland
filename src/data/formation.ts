/** Shared 11-v-11 spots so lesson diagrams and play diagrams stay in sync. */
export type FormationMarker = {
  id: string;
  kind: "O" | "X";
  x: number;
  y: number;
  label: string;
};

export const formationOLine: FormationMarker[] = [
  { id: "lt", kind: "O", x: 96, y: 164, label: "LT" },
  { id: "lg", kind: "O", x: 126, y: 164, label: "LG" },
  { id: "c", kind: "O", x: 156, y: 164, label: "C" },
  { id: "rg", kind: "O", x: 186, y: 164, label: "RG" },
  { id: "rt", kind: "O", x: 216, y: 164, label: "RT" },
];

export const formationOffence: FormationMarker[] = [
  ...formationOLine,
  { id: "te", kind: "O", x: 248, y: 164, label: "TE" },
  { id: "qb", kind: "O", x: 156, y: 196, label: "QB" },
  { id: "rb", kind: "O", x: 156, y: 226, label: "RB" },
  { id: "wrl", kind: "O", x: 32, y: 170, label: "WR" },
  { id: "wrr", kind: "O", x: 328, y: 170, label: "WR" },
];

export const formationDefence: FormationMarker[] = [
  { id: "de-l", kind: "X", x: 96, y: 118, label: "DE" },
  { id: "dt-l", kind: "X", x: 132, y: 118, label: "DT" },
  { id: "dt-r", kind: "X", x: 180, y: 118, label: "DT" },
  { id: "de-r", kind: "X", x: 216, y: 118, label: "DE" },
  { id: "lb-l", kind: "X", x: 116, y: 86, label: "LB" },
  { id: "lb-m", kind: "X", x: 156, y: 86, label: "LB" },
  { id: "lb-r", kind: "X", x: 200, y: 86, label: "LB" },
  { id: "cb-l", kind: "X", x: 32, y: 78, label: "CB" },
  { id: "cb-r", kind: "X", x: 328, y: 78, label: "CB" },
  { id: "s-l", kind: "X", x: 116, y: 48, label: "S" },
  { id: "s-r", kind: "X", x: 200, y: 48, label: "S" },
];

export const formationEleven: FormationMarker[] = [...formationOffence, ...formationDefence];
