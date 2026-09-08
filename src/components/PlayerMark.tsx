type MarkerKind = "O" | "X" | "ball";

export type DiagramPlayer = {
  id: string;
  kind: MarkerKind;
  x: number;
  y: number;
  label?: string;
};

export function PlayerMark({ marker }: { marker: DiagramPlayer }) {
  if (marker.kind === "ball") {
    return (
      <g transform={`translate(${marker.x} ${marker.y})`}>
        <ellipse rx="8" ry="5.5" fill="#c47a2c" stroke="#e8b84a" strokeWidth="1.3" />
      </g>
    );
  }

  const offence = marker.kind === "O";
  const text = marker.label?.trim() || marker.kind;
  const letters = text.length;
  const r = letters >= 3 ? 16.5 : 15;
  const fontSize = letters <= 1 ? 13 : letters === 2 ? 11 : 9;

  return (
    <g transform={`translate(${marker.x} ${marker.y})`}>
      <circle
        r={r}
        fill={offence ? "#f4efe4" : "#121b2e"}
        stroke="#e8b84a"
        strokeWidth="1.8"
      />
      <text
        textAnchor="middle"
        dominantBaseline="middle"
        y={0.8}
        fill={offence ? "#0b1220" : "#e8b84a"}
        fontSize={fontSize}
        fontWeight="800"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
      >
        {text}
      </text>
    </g>
  );
}

export function FormationKey() {
  return (
    <div className="grid gap-4 rounded-2xl border border-line bg-navy-2 px-4 py-4 text-sm leading-6 text-cream-dim sm:grid-cols-2">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
          Offence (cream circles)
        </p>
        <ul className="mt-2 space-y-1">
          <li>
            <span className="font-semibold text-cream">QB</span> quarterback
          </li>
          <li>
            <span className="font-semibold text-cream">RB</span> running back
          </li>
          <li>
            <span className="font-semibold text-cream">WR</span> wide receiver
          </li>
          <li>
            <span className="font-semibold text-cream">TE</span> tight end
          </li>
          <li>
            <span className="font-semibold text-cream">LT LG C RG RT</span> the offensive line
            (left tackle to right tackle, centre in the middle)
          </li>
        </ul>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
          Defence (gold letters)
        </p>
        <ul className="mt-2 space-y-1">
          <li>
            <span className="font-semibold text-cream">DE</span> defensive end
          </li>
          <li>
            <span className="font-semibold text-cream">DT</span> defensive tackle
          </li>
          <li>
            <span className="font-semibold text-cream">LB</span> linebacker
          </li>
          <li>
            <span className="font-semibold text-cream">CB</span> cornerback
          </li>
          <li>
            <span className="font-semibold text-cream">S</span> safety
          </li>
        </ul>
      </div>
      <div className="sm:col-span-2">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
          Special teams (when they appear)
        </p>
        <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
          <li>
            <span className="font-semibold text-cream">K</span> kicker
          </li>
          <li>
            <span className="font-semibold text-cream">ST</span> coverage / special teams
          </li>
          <li>
            <span className="font-semibold text-cream">RET</span> returner
          </li>
        </ul>
      </div>
    </div>
  );
}
