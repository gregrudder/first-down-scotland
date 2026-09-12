"use client";

import {
  downsExplainerStepMs,
  downsExplainerSteps,
  type DownsExplainerStep,
} from "@/data/downs-explainer";
import { LearnMotionGraphic } from "@/components/learn-motion/LearnMotionGraphic";
import { ArrowDefs, Football, Moving } from "@/components/learn-motion/primitives";

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
  return (
    <LearnMotionGraphic
      title="How downs work"
      svgTitle="How NFL downs work"
      steps={downsExplainerSteps}
      stepMs={downsExplainerStepMs}
      sceneLabel={(step) =>
        step.scene === "convert" ? "Example 1 · making a first down" : "Example 2 · coming up short"
      }
      describe={(step) =>
        `${step.title}. ${step.caption} On the field, a solid gold line marked LOS is where the play starts. A dashed line with a triangle is the first-down marker, 10 yards on. The oval is the ball.`
      }
      figcaption="Solid gold line with a square is the line of scrimmage (where the play starts). Dashed line with a triangle is the first-down marker, 10 yards on. The oval is the ball. Four downs to make that marker; manage it and you reset to 1st & 10. Fall short and you punt, or the other lot take over."
      defs={(prefix) => <ArrowDefs prefix={prefix} />}
    >
      {({ step, animate, markerPrefix }) => (
        <>
          <FieldBackdrop />
          <SceneArt
            key={step.scene}
            step={step}
            animate={animate}
            creamArrow={`url(#${markerPrefix}-cream)`}
            liveArrow={`url(#${markerPrefix}-live)`}
          />
        </>
      )}
    </LearnMotionGraphic>
  );
}
