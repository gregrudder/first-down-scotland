"use client";

import { useEffect, useState, type ReactNode } from "react";

export function usePrefersReducedMotion() {
  const [preference, setPreference] = useState<"unknown" | "reduce" | "ok">("unknown");

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setPreference(media.matches ? "reduce" : "ok");
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return preference;
}

export function Moving({
  x,
  y = 0,
  animate,
  children,
}: {
  x: number;
  y?: number;
  animate: boolean;
  children: ReactNode;
}) {
  return (
    <g
      className={animate ? "fds-learn-move" : undefined}
      style={{ transform: `translate(${x}px, ${y}px)` }}
    >
      {children}
    </g>
  );
}

export function Football({ label = "Ball" }: { label?: string }) {
  return (
    <g>
      <ellipse rx="11" ry="7.2" fill="#c47a2c" stroke="#e8b84a" strokeWidth="1.6" />
      <path d="M-5 0 H5" stroke="#f4efe4" strokeWidth="1.4" strokeLinecap="round" />
      {[-3, 0, 3].map((tick) => (
        <path
          key={tick}
          d={`M${tick} -3.2 V3.2`}
          stroke="#f4efe4"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
      ))}
      <text
        x="0"
        y="22"
        textAnchor="middle"
        fill="#f4efe4"
        fontSize="10"
        fontWeight="700"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
      >
        {label}
      </text>
    </g>
  );
}

export const FIELD_X = 36;
export const FIELD_Y = 70;
export const FIELD_W = 648;
export const FIELD_H = 128;

export function fieldX(yard: number, yardMin: number, yardMax: number) {
  return FIELD_X + ((yard - yardMin) / (yardMax - yardMin)) * FIELD_W;
}

export function FieldStrip({
  yardMin,
  yardMax,
  endZoneFrom,
  footer,
}: {
  yardMin: number;
  yardMax: number;
  endZoneFrom?: number;
  footer: string;
}) {
  const span = yardMax - yardMin;
  const step = span > 60 ? 10 : 5;
  const yards: number[] = [];
  for (let yard = Math.ceil(yardMin / step) * step; yard <= yardMax; yard += step) {
    yards.push(yard);
  }

  return (
    <g>
      <rect width="720" height="250" fill="#0b1220" />
      <rect
        x={FIELD_X}
        y={FIELD_Y}
        width={FIELD_W}
        height={FIELD_H}
        fill="#121b2e"
        stroke="rgba(244,239,228,0.18)"
        strokeWidth="1.5"
      />
      {endZoneFrom != null ? (
        <rect
          x={fieldX(endZoneFrom, yardMin, yardMax)}
          y={FIELD_Y}
          width={fieldX(yardMax, yardMin, yardMax) - fieldX(endZoneFrom, yardMin, yardMax)}
          height={FIELD_H}
          fill="rgba(232,184,74,0.14)"
        />
      ) : null}
      {yards.map((yard) => {
        const x = fieldX(yard, yardMin, yardMax);
        const major = yard % 10 === 0;
        const isGoal = yard === endZoneFrom;
        const inEndZone = endZoneFrom != null && yard > endZoneFrom && yard < yardMax;
        return (
          <g key={yard}>
            <line
              x1={x}
              y1={FIELD_Y}
              x2={x}
              y2={FIELD_Y + FIELD_H}
              stroke={
                isGoal ? "#e8b84a" : major ? "rgba(244,239,228,0.22)" : "rgba(244,239,228,0.1)"
              }
              strokeWidth={isGoal ? 2.2 : major ? 1.4 : 1}
            />
            {inEndZone ? null : (
              <text
                x={x + (yard === yardMin ? 10 : yard === yardMax ? -10 : 0)}
                y={FIELD_Y + FIELD_H - 8}
                textAnchor="middle"
                fill="#c9c2b3"
                fontSize="11"
                fontWeight="700"
                fontFamily="ui-sans-serif, system-ui, sans-serif"
              >
                {yard === endZoneFrom ? "G" : yard === yardMax && endZoneFrom != null ? "EZ" : yard}
              </text>
            )}
          </g>
        );
      })}
      {[0, 1, 2, 3].map((i) => (
        <line
          key={i}
          x1={FIELD_X + 8}
          y1={FIELD_Y + 28 + i * 24}
          x2={FIELD_X + FIELD_W - 8}
          y2={FIELD_Y + 28 + i * 24}
          stroke="rgba(244,239,228,0.05)"
          strokeWidth="1"
        />
      ))}
      <text
        x={FIELD_X + FIELD_W / 2}
        y={FIELD_Y + FIELD_H + 16}
        textAnchor="middle"
        fill="#c9c2b3"
        fontSize="10"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
      >
        {footer}
      </text>
    </g>
  );
}

export function GoalPosts({ x }: { x: number }) {
  const left = x - 16;
  const right = x + 16;
  return (
    <g>
      <line x1={x} y1={FIELD_Y} x2={x} y2={22} stroke="#e8b84a" strokeWidth="2.2" />
      <line x1={left} y1={48} x2={right} y2={48} stroke="#e8b84a" strokeWidth="2.4" />
      <line x1={left} y1={22} x2={left} y2={48} stroke="#f3d27a" strokeWidth="2.6" />
      <line x1={right} y1={22} x2={right} y2={48} stroke="#f3d27a" strokeWidth="2.6" />
      <text
        x={x}
        y={16}
        textAnchor="middle"
        fill="#e8b84a"
        fontSize="11"
        fontWeight="800"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
      >
        POSTS
      </text>
    </g>
  );
}

export function ScoreBadge({
  x,
  y,
  text,
  width = 156,
}: {
  x: number;
  y: number;
  text: string;
  width?: number;
}) {
  return (
    <g>
      <rect x={x - width / 2} y={y} width={width} height="28" rx="14" fill="#e8b84a" />
      <text
        x={x}
        y={y + 19}
        textAnchor="middle"
        fill="#0b1220"
        fontSize="13"
        fontWeight="800"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
      >
        {text}
      </text>
    </g>
  );
}

export function PlayBoard() {
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
    </g>
  );
}

export function ArrowDefs({
  prefix,
  kinds = [
    ["cream", "#f4efe4"],
    ["gold", "#e8b84a"],
    ["live", "#ff6b4a"],
    ["soft", "#f3d27a"],
  ],
}: {
  prefix: string;
  kinds?: ReadonlyArray<readonly [string, string]>;
}) {
  return (
    <>
      {kinds.map(([name, color]) => (
        <marker
          key={name}
          id={`${prefix}-${name}`}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto"
        >
          <path d="M0 0 L10 5 L0 10 Z" fill={color} />
        </marker>
      ))}
    </>
  );
}

export function lerp(from: number, to: number, t: number) {
  return from + (to - from) * t;
}

