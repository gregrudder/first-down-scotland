import type { DiagramMarker, DiagramPath, LessonDiagram } from "@/data/lesson-diagrams";

const pathClass: Record<NonNullable<DiagramPath["kind"]>, string> = {
  run: "stroke-gold",
  route: "stroke-cream",
  pass: "stroke-gold-soft",
  rush: "stroke-live",
  block: "stroke-cream-dim",
};

function Marker({ marker, compact }: { marker: DiagramMarker; compact?: boolean }) {
  if (marker.kind === "ball") {
    return (
      <g transform={`translate(${marker.x} ${marker.y})`}>
        <ellipse rx="7" ry="5" fill="#c47a2c" stroke="#e8b84a" strokeWidth="1.2" />
      </g>
    );
  }

  return (
    <g transform={`translate(${marker.x} ${marker.y})`}>
      <circle
        r={compact ? 8 : 10}
        fill={marker.kind === "O" ? "#f4efe4" : "#121b2e"}
        stroke="#e8b84a"
        strokeWidth="1.6"
      />
      <text
        textAnchor="middle"
        y={compact ? 3.2 : 4}
        fill={marker.kind === "O" ? "#0b1220" : "#e8b84a"}
        fontSize={compact ? 10 : 12}
        fontWeight="700"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
      >
        {marker.kind}
      </text>
      {!compact && marker.label ? (
        <text
          textAnchor="middle"
          y="20"
          fill="#c9c2b3"
          fontSize="8"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
        >
          {marker.label}
        </text>
      ) : null}
    </g>
  );
}

function FieldLayout() {
  const ticks = [70, 98, 126, 154, 182, 210, 238, 266, 294];
  return (
    <g>
      <rect width="360" height="160" fill="#0b1220" />
      <rect x="8" y="16" width="40" height="128" fill="rgba(232,184,74,0.12)" />
      <rect x="312" y="16" width="40" height="128" fill="rgba(232,184,74,0.12)" />
      <rect
        x="8"
        y="16"
        width="344"
        height="128"
        fill="none"
        stroke="rgba(244,239,228,0.2)"
        strokeWidth="1.5"
      />
      {ticks.map((x) => (
        <line
          key={x}
          x1={x}
          y1="16"
          x2={x}
          y2="144"
          stroke="rgba(244,239,228,0.12)"
          strokeWidth="1"
        />
      ))}
      <line x1="180" y1="16" x2="180" y2="144" stroke="rgba(232,184,74,0.45)" strokeWidth="1.4" />
      <line x1="48" y1="16" x2="48" y2="144" stroke="#e8b84a" strokeWidth="1.6" />
      <line x1="312" y1="16" x2="312" y2="144" stroke="#e8b84a" strokeWidth="1.6" />
      {/* Simple goalposts */}
      <path d="M18 36 L18 20 L38 20 L38 36" fill="none" stroke="#e8b84a" strokeWidth="1.6" />
      <path d="M322 36 L322 20 L342 20 L342 36" fill="none" stroke="#e8b84a" strokeWidth="1.6" />
    </g>
  );
}

function PlayLayout({ showFirstDown }: { showFirstDown?: boolean }) {
  return (
    <g>
      <rect width="360" height="250" fill="#0b1220" />
      {[30, 90, 150, 210, 270, 330].map((x) => (
        <line
          key={x}
          x1={x}
          y1="16"
          x2={x}
          y2="234"
          stroke="rgba(244,239,228,0.06)"
          strokeWidth="1"
        />
      ))}
      <line x1="16" y1="142" x2="344" y2="142" stroke="#e8b84a" strokeWidth="2.5" />
      <text
        x="20"
        y="136"
        fill="#e8b84a"
        fontSize="9"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        letterSpacing="0.12em"
      >
        LOS
      </text>
      {showFirstDown ? (
        <>
          <line
            x1="16"
            y1="72"
            x2="344"
            y2="72"
            stroke="#f3d27a"
            strokeWidth="2"
            strokeDasharray="6 5"
          />
        </>
      ) : null}
    </g>
  );
}

export function FieldDiagram({
  diagram,
  compact = false,
}: {
  diagram: LessonDiagram;
  compact?: boolean;
}) {
  const titleId = `diagram-title-${diagram.id}${compact ? "-mini" : ""}`;
  const descId = `diagram-desc-${diagram.id}${compact ? "-mini" : ""}`;
  const markerPrefix = `diagram-arrow-${diagram.id}${compact ? "-mini" : ""}`;
  const isField = diagram.layout === "field";
  const height = isField ? 160 : 250;

  return (
    <figure className="overflow-hidden rounded-2xl border border-line bg-navy">
      <svg
        viewBox={`0 0 360 ${height}`}
        role="img"
        aria-labelledby={`${titleId} ${descId}`}
        className={`w-full ${compact ? "max-h-44" : isField ? "max-h-56" : "max-h-[22rem]"}`}
      >
        <title id={titleId}>{diagram.title} diagram</title>
        <desc id={descId}>{diagram.caption}</desc>
        <defs>
          {(
            [
              ["run", "#e8b84a"],
              ["route", "#f4efe4"],
              ["pass", "#f3d27a"],
              ["rush", "#ff6b4a"],
              ["block", "#c9c2b3"],
            ] as const
          ).map(([kind, color]) => (
            <marker
              key={kind}
              id={`${markerPrefix}-${kind}`}
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M0 0 L10 5 L0 10 Z" fill={color} />
            </marker>
          ))}
        </defs>

        {isField ? <FieldLayout /> : <PlayLayout showFirstDown={diagram.id === "first-and-ten"} />}

        {(diagram.paths ?? []).map((path) => (
          <path
            key={path.id}
            d={path.d}
            fill="none"
            className={pathClass[path.kind]}
            strokeWidth={path.kind === "block" ? 1.8 : 2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={path.kind === "pass" ? "5 5" : undefined}
            markerEnd={`url(#${markerPrefix}-${path.kind})`}
          />
        ))}

        {diagram.markers.map((marker) => (
          <Marker key={marker.id} marker={marker} compact={compact} />
        ))}

        {(diagram.notes ?? []).map((note) => (
          <text
            key={note.id}
            x={note.x}
            y={note.y}
            textAnchor="middle"
            fill={note.fill ?? "#c9c2b3"}
            fontSize="9"
            fontFamily="ui-sans-serif, system-ui, sans-serif"
            letterSpacing="0.08em"
          >
            {note.text}
          </text>
        ))}
      </svg>
      {!compact ? (
        <figcaption className="border-t border-line px-4 py-3 text-sm leading-6 text-cream-dim">
          {diagram.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

export function FieldLegend() {
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-2 rounded-2xl border border-line bg-navy-2 px-4 py-3 text-sm text-cream-dim">
      <span>
        <span className="font-semibold text-cream">O</span> = offence
      </span>
      <span>
        <span className="font-semibold text-gold">X</span> = defence
      </span>
      <span>Gold oval = the ball</span>
      <span>Solid gold line = line of scrimmage</span>
      <span className="text-live">Red arrow = rush</span>
    </div>
  );
}
