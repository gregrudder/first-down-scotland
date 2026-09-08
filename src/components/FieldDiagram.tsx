import { FormationKey, PlayerMark } from "@/components/PlayerMark";
import type { DiagramPath, LessonDiagram } from "@/data/lesson-diagrams";

const pathClass: Record<NonNullable<DiagramPath["kind"]>, string> = {
  run: "stroke-gold",
  route: "stroke-cream",
  pass: "stroke-gold-soft",
  rush: "stroke-live",
  block: "stroke-cream-dim",
};

function FieldLayout() {
  const ticks = [70, 98, 126, 154, 182, 210, 238, 266, 294];
  return (
    <g>
      <rect width="360" height="176" fill="#0b1220" />
      <rect x="8" y="20" width="40" height="136" fill="rgba(232,184,74,0.12)" />
      <rect x="312" y="20" width="40" height="136" fill="rgba(232,184,74,0.12)" />
      <rect
        x="8"
        y="20"
        width="344"
        height="136"
        fill="none"
        stroke="rgba(244,239,228,0.2)"
        strokeWidth="1.5"
      />
      {ticks.map((x) => (
        <line
          key={x}
          x1={x}
          y1="20"
          x2={x}
          y2="156"
          stroke="rgba(244,239,228,0.12)"
          strokeWidth="1"
        />
      ))}
      <line x1="180" y1="20" x2="180" y2="156" stroke="rgba(232,184,74,0.45)" strokeWidth="1.4" />
      <line x1="48" y1="20" x2="48" y2="156" stroke="#e8b84a" strokeWidth="1.6" />
      <line x1="312" y1="20" x2="312" y2="156" stroke="#e8b84a" strokeWidth="1.6" />
      <path d="M18 40 L18 24 L38 24 L38 40" fill="none" stroke="#e8b84a" strokeWidth="1.6" />
      <path d="M322 40 L322 24 L342 24 L342 40" fill="none" stroke="#e8b84a" strokeWidth="1.6" />
    </g>
  );
}

function PlayLayout({ showFirstDown }: { showFirstDown?: boolean }) {
  return (
    <g>
      <rect width="360" height="268" fill="#0b1220" />
      {[30, 90, 150, 210, 270, 330].map((x) => (
        <line
          key={x}
          x1={x}
          y1="16"
          x2={x}
          y2="252"
          stroke="rgba(244,239,228,0.06)"
          strokeWidth="1"
        />
      ))}
      <line x1="16" y1="142" x2="344" y2="142" stroke="#e8b84a" strokeWidth="2.5" />
      <text
        x="20"
        y="134"
        fill="#e8b84a"
        fontSize="12"
        fontWeight="700"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
      >
        LOS
      </text>
      {showFirstDown ? (
        <line
          x1="16"
          y1="72"
          x2="344"
          y2="72"
          stroke="#f3d27a"
          strokeWidth="2"
          strokeDasharray="6 5"
        />
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
  const height = isField ? 176 : 268;

  return (
    <figure className="overflow-hidden rounded-2xl border border-line bg-navy">
      <svg
        viewBox={`0 0 360 ${height}`}
        role="img"
        aria-labelledby={`${titleId} ${descId}`}
        className={`w-full ${compact ? "max-h-52" : isField ? "max-h-64" : "max-h-[26rem]"}`}
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
          <PlayerMark key={marker.id} marker={marker} />
        ))}

        {(diagram.notes ?? []).map((note) => (
          <text
            key={note.id}
            x={note.x}
            y={note.y}
            textAnchor="middle"
            fill={note.fill ?? "#c9c2b3"}
            fontSize="12"
            fontWeight="700"
            fontFamily="ui-sans-serif, system-ui, sans-serif"
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

export function FieldLegend({ showPositions = true }: { showPositions?: boolean }) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-x-5 gap-y-2 rounded-2xl border border-line bg-navy-2 px-4 py-3 text-sm text-cream-dim">
        <span>
          <span className="font-semibold text-cream">Cream circle</span> = offence (they have the
          ball)
        </span>
        <span>
          <span className="font-semibold text-gold">Gold letters on dark</span> = defence
        </span>
        <span>Gold oval = the ball</span>
        <span>Solid gold line = line of scrimmage (LOS)</span>
        <span className="text-live">Red arrow = rush</span>
      </div>
      {showPositions ? <FormationKey /> : null}
    </div>
  );
}

