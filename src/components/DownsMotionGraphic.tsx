"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import {
  downsExplainerStepMs,
  downsExplainerSteps,
  type DownsExplainerStep,
} from "@/data/downs-explainer";

const FIELD_X = 36;
const FIELD_Y = 70;
const FIELD_W = 648;
const FIELD_H = 128;
const YARD_MIN = 25;
const YARD_MAX = 50;
const PX_PER_YARD = FIELD_W / (YARD_MAX - YARD_MIN);
const BALL_Y = FIELD_Y + FIELD_H / 2;

function xAt(yard: number) {
  return FIELD_X + (yard - YARD_MIN) * PX_PER_YARD;
}

function usePrefersReducedMotion() {
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

function Moving({
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
      className={animate ? "fds-downs-move" : undefined}
      style={{ transform: `translate(${x}px, ${y}px)` }}
    >
      {children}
    </g>
  );
}

function Football() {
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
        Ball
      </text>
    </g>
  );
}

function FieldBackdrop() {
  const yards = [25, 30, 35, 40, 45, 50];
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
      {yards.map((yard) => {
        const x = xAt(yard);
        const major = yard % 10 === 0 || yard === 25 || yard === 50;
        return (
          <g key={yard}>
            <line
              x1={x}
              y1={FIELD_Y}
              x2={x}
              y2={FIELD_Y + FIELD_H}
              stroke={major ? "rgba(244,239,228,0.22)" : "rgba(244,239,228,0.1)"}
              strokeWidth={major ? 1.4 : 1}
            />
            <text
              x={x + (yard === 25 ? 10 : yard === 50 ? -10 : 0)}
              y={FIELD_Y + FIELD_H - 8}
              textAnchor="middle"
              fill="#c9c2b3"
              fontSize="11"
              fontWeight="700"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
            >
              {yard}
            </text>
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
        Yard lines · attacking towards midfield →
      </text>
    </g>
  );
}

function MarkerLine({
  yard,
  kind,
  animate,
}: {
  yard: number;
  kind: "los" | "first-down";
  animate: boolean;
}) {
  const isLos = kind === "los";
  return (
    <Moving x={xAt(yard)} animate={animate}>
      <line
        x1={0}
        y1={FIELD_Y}
        x2={0}
        y2={FIELD_Y + FIELD_H}
        stroke={isLos ? "#e8b84a" : "#f3d27a"}
        strokeWidth={isLos ? 2.6 : 2.2}
        strokeDasharray={isLos ? undefined : "7 6"}
      />
      {isLos ? (
        <rect x="-6" y={FIELD_Y - 10} width="12" height="10" fill="#e8b84a" />
      ) : (
        <polygon points={`0,${FIELD_Y - 12} 8,${FIELD_Y} -8,${FIELD_Y}`} fill="#f3d27a" />
      )}
      <text
        x={0}
        y={FIELD_Y - 16}
        textAnchor="middle"
        fill={isLos ? "#e8b84a" : "#f3d27a"}
        fontSize="11"
        fontWeight="800"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
      >
        {isLos ? "LOS · start" : "1st down · 10 yds"}
      </text>
    </Moving>
  );
}

function SceneArt({
  step,
  animate,
  creamArrow,
  liveArrow,
}: {
  step: DownsExplainerStep;
  animate: boolean;
  creamArrow: string;
  liveArrow: string;
}) {
  const ballX = xAt(step.ballYard);
  const puntEndX = xAt(48);
  const yardsToGo = Math.max(0, step.firstDownYard - step.ballYard);
  const midX = (xAt(step.losYard) + xAt(step.firstDownYard)) / 2;

  return (
    <>
      <MarkerLine yard={step.losYard} kind="los" animate={animate} />
      <MarkerLine yard={step.firstDownYard} kind="first-down" animate={animate} />

      <rect
        x={xAt(Math.min(step.losYard, step.ballYard))}
        y={BALL_Y - 10}
        width={Math.max(2, Math.abs(xAt(step.ballYard) - xAt(step.losYard)))}
        height="20"
        fill="rgba(232,184,74,0.16)"
      />

      {step.highlight === "none" ? (
        <text
          x={midX}
          y={FIELD_Y + 22}
          textAnchor="middle"
          fill="#f4efe4"
          fontSize="12"
          fontWeight="700"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
        >
          {yardsToGo === 0 ? "Marker reached" : `${yardsToGo} yards still needed`}
        </text>
      ) : null}

      {step.highlight === "punt" ? (
        <g>
          <path
            d={`M ${ballX} ${BALL_Y} C ${ballX + 70} ${FIELD_Y + 8}, ${puntEndX - 40} ${FIELD_Y + 8}, ${puntEndX} ${BALL_Y}`}
            fill="none"
            stroke="#f4efe4"
            strokeWidth="2"
            strokeDasharray="6 5"
            markerEnd={creamArrow}
          />
          <text
            x={(ballX + puntEndX) / 2}
            y={FIELD_Y + 28}
            textAnchor="middle"
            fill="#f4efe4"
            fontSize="13"
            fontWeight="800"
            fontFamily="ui-sans-serif, system-ui, sans-serif"
          >
            PUNT — kick it away
          </text>
        </g>
      ) : null}

      {step.highlight === "turnover" ? (
        <g>
          <path
            d={`M ${xAt(40)} ${BALL_Y} L ${xAt(33)} ${BALL_Y}`}
            fill="none"
            stroke="#ff6b4a"
            strokeWidth="2.6"
            markerEnd={liveArrow}
          />
          <text
            x={xAt(40)}
            y={FIELD_Y + 28}
            textAnchor="middle"
            fill="#ff6b4a"
            fontSize="13"
            fontWeight="800"
            fontFamily="ui-sans-serif, system-ui, sans-serif"
          >
            Defence take over here
          </text>
        </g>
      ) : null}

      {step.highlight === "first-down" ? (
        <g>
          <rect
            x={xAt(step.firstDownYard) - 78}
            y={FIELD_Y + 14}
            width="156"
            height="28"
            rx="14"
            fill="#e8b84a"
          />
          <text
            x={xAt(step.firstDownYard)}
            y={FIELD_Y + 33}
            textAnchor="middle"
            fill="#0b1220"
            fontSize="13"
            fontWeight="800"
            fontFamily="ui-sans-serif, system-ui, sans-serif"
          >
            FIRST DOWN
          </text>
        </g>
      ) : null}

      <Moving x={step.highlight === "punt" ? puntEndX : ballX} y={BALL_Y} animate={animate}>
        <Football />
      </Moving>
    </>
  );
}

export function DownsMotionGraphic() {
  const titleId = useId();
  const descId = useId();
  const markerPrefix = useId().replace(/:/g, "");
  const motion = usePrefersReducedMotion();
  const reduced = motion === "reduce";
  const animate = motion === "ok";
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const step = downsExplainerSteps[index] ?? downsExplainerSteps[0]!;
  const lastIndex = downsExplainerSteps.length - 1;
  const atEnd = index >= lastIndex;
  const playing = animate && !paused && !atEnd;

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => {
      setIndex((current) => Math.min(current + 1, lastIndex));
    }, downsExplainerStepMs);
    return () => window.clearTimeout(timer);
  }, [playing, index, lastIndex]);

  function play() {
    if (reduced) {
      setIndex((current) => (current >= lastIndex ? 0 : current + 1));
      return;
    }
    if (atEnd) setIndex(0);
    setPaused(false);
  }

  function replay() {
    setIndex(0);
    setPaused(reduced);
  }

  function goTo(next: number) {
    setPaused(true);
    setIndex(next);
  }

  const sceneLabel =
    step.scene === "convert" ? "Example 1 · making a first down" : "Example 2 · coming up short";

  return (
    <figure className="overflow-hidden rounded-2xl border border-line bg-navy">
      <div className="flex flex-col gap-3 border-b border-line px-4 py-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
            Motion graphic
          </p>
          <h2 id={titleId} className="mt-1 font-display text-2xl text-cream">
            How downs work
          </h2>
          <p className="mt-1 text-sm text-cream-dim">{sceneLabel}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={playing ? () => setPaused(true) : play}
            className="inline-flex items-center justify-center rounded-full bg-gold px-4 py-2 text-sm font-semibold text-gold-ink hover:bg-gold-soft"
          >
            {reduced ? (atEnd ? "Start again" : "Next step") : playing ? "Pause" : atEnd ? "Play again" : "Play"}
          </button>
          <button
            type="button"
            onClick={replay}
            className="inline-flex items-center justify-center rounded-full border border-line px-4 py-2 text-sm font-semibold text-cream hover:border-gold/50"
          >
            Replay
          </button>
        </div>
      </div>

      {reduced ? (
        <p className="border-b border-line px-4 py-3 text-sm leading-6 text-cream-dim">
          Motion is off because your system asked for less animation. Use Next
          step or pick a labelled step below. Each frame is written in words, not
          only colour.
        </p>
      ) : null}

      <svg
        viewBox="0 0 720 250"
        role="img"
        aria-labelledby={`${titleId} ${descId}`}
        className="w-full max-h-[22rem]"
      >
        <title>How NFL downs work</title>
        <desc id={descId}>
          {step.title}. {step.caption} On the field, a solid gold line marked LOS is
          where the play starts. A dashed line with a triangle is the first-down
          marker, 10 yards on. The oval is the ball.
        </desc>
        <defs>
          <marker
            id={`${markerPrefix}-arrow-cream`}
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto"
          >
            <path d="M0 0 L10 5 L0 10 Z" fill="#f4efe4" />
          </marker>
          <marker
            id={`${markerPrefix}-arrow-live`}
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto"
          >
            <path d="M0 0 L10 5 L0 10 Z" fill="#ff6b4a" />
          </marker>
        </defs>
        <FieldBackdrop />
        <SceneArt
          key={step.scene}
          step={step}
          animate={animate}
          creamArrow={`url(#${markerPrefix}-arrow-cream)`}
          liveArrow={`url(#${markerPrefix}-arrow-live)`}
        />
      </svg>

      <div className="space-y-4 border-t border-line px-4 py-4">
        <div className="flex flex-wrap gap-2" aria-hidden={false}>
          <p className="rounded-full border border-gold/40 bg-navy-3 px-3 py-1 text-sm font-semibold text-gold">
            {step.call}
          </p>
          <p className="rounded-full border border-line bg-navy-2 px-3 py-1 text-sm text-cream">
            {step.plain}
          </p>
        </div>

        <div aria-live="polite" aria-atomic="true">
          <p className="font-display text-xl text-cream">{step.title}</p>
          <p className="mt-2 text-sm leading-6 text-cream-dim">{step.caption}</p>
        </div>

        <ol className="grid gap-2 sm:grid-cols-2">
          {downsExplainerSteps.map((entry, entryIndex) => {
            const current = entryIndex === index;
            return (
              <li key={entry.id}>
                <button
                  type="button"
                  onClick={() => goTo(entryIndex)}
                  aria-current={current ? "step" : undefined}
                  className={`w-full rounded-xl border px-3 py-2 text-left text-sm leading-6 transition ${
                    current
                      ? "border-gold bg-navy-3 text-cream"
                      : "border-line bg-navy-2 text-cream-dim hover:border-gold/40 hover:text-cream"
                  }`}
                >
                  <span className="font-semibold text-gold">
                    Step {entryIndex + 1}
                    {current ? " · now" : ""}
                  </span>
                  <span className="mt-0.5 block">{entry.title}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <figcaption className="border-t border-line px-4 py-3 text-sm leading-6 text-cream-dim">
        Solid gold line with a square is the line of scrimmage (where the play
        starts). Dashed line with a triangle is the first-down marker, 10 yards
        on. The oval is the ball. Four downs to make that marker; manage it and
        you reset to 1st & 10. Fall short and you punt, or the other lot take over.
      </figcaption>
    </figure>
  );
}
