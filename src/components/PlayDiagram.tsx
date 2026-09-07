import type { Play, PlayPath } from "@/data/plays";

const pathClass: Record<PlayPath["kind"], string> = {
  run: "stroke-gold",
  route: "stroke-cream",
  pass: "stroke-gold-soft",
  rush: "stroke-live",
  block: "stroke-cream-dim",
};

function PathArrow({ path, markerPrefix }: { path: PlayPath; markerPrefix: string }) {
  const dashed = path.kind === "pass";
  const width = path.kind === "block" ? 1.8 : 2.4;

  return (
    <path
      d={path.d}
      fill="none"
      className={pathClass[path.kind]}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={dashed ? "5 5" : undefined}
      markerEnd={`url(#${markerPrefix}-${path.kind})`}
    />
  );
}

export function PlayDiagram({
  play,
  compact = false,
}: {
  play: Play;
  compact?: boolean;
}) {
  const titleId = `play-title-${play.slug}${compact ? "-mini" : ""}`;
  const descId = `play-desc-${play.slug}${compact ? "-mini" : ""}`;
  const markerPrefix = `play-arrow-${play.slug}${compact ? "-mini" : ""}`;

  return (
    <figure className="overflow-hidden rounded-2xl border border-line bg-navy">
      <svg
        viewBox="0 0 360 250"
        role="img"
        aria-labelledby={`${titleId} ${descId}`}
        className={`w-full ${compact ? "max-h-48" : "max-h-[22rem]"}`}
      >
        <title id={titleId}>{play.title} diagram</title>
        <desc id={descId}>{play.caption}</desc>
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

        {play.paths.map((path) => (
          <PathArrow key={path.id} path={path} markerPrefix={markerPrefix} />
        ))}

        {play.markers.map((marker) => (
          <g key={marker.id} transform={`translate(${marker.x} ${marker.y})`}>
            <circle
              r={compact ? 8 : 10}
              fill={marker.kind === "O" ? "#f4efe4" : "#121b2e"}
              stroke={marker.kind === "O" ? "#e8b84a" : "#e8b84a"}
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
        ))}
      </svg>
      {!compact ? (
        <figcaption className="border-t border-line px-4 py-3 text-sm leading-6 text-cream-dim">
          {play.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

export function PlayLegend() {
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-2 rounded-2xl border border-line bg-navy-2 px-4 py-3 text-sm text-cream-dim">
      <span>
        <span className="font-semibold text-cream">O</span> = offence
      </span>
      <span>
        <span className="font-semibold text-gold">X</span> = defence
      </span>
      <span>Solid gold arrow = run</span>
      <span>Cream arrow = route</span>
      <span>Dashed arrow = throw</span>
      <span className="text-live">Red arrow = rush / blitz</span>
    </div>
  );
}
