"use client";

import { kickoffStepMs, kickoffSteps, type KickoffStep } from "@/data/learn-motion/kickoff";
import { LearnMotionGraphic } from "./LearnMotionGraphic";
import {
  ArrowDefs,
  FIELD_H,
  FIELD_Y,
  Football,
  FieldStrip,
  Moving,
  fieldX,
} from "./primitives";

const YARD_MIN = 0;
const YARD_MAX = 110;
const BALL_Y = FIELD_Y + FIELD_H / 2;

function xAt(yard: number) {
  return fieldX(yard, YARD_MIN, YARD_MAX);
}

function ballPos(step: KickoffStep) {
  switch (step.ball) {
    case "tee":
      return { x: xAt(38), y: BALL_Y };
    case "flight":
      return { x: xAt(70), y: FIELD_Y + 10 };
    case "catch":
      return { x: xAt(100), y: BALL_Y - 26 };
    case "return":
      return { x: xAt(78), y: BALL_Y - 26 };
  }
}

function Scene({ step, animate, markerPrefix }: { step: KickoffStep; animate: boolean; markerPrefix: string }) {
  const kickerX = xAt(35);
  const returnerX = step.ball === "return" ? xAt(78) : xAt(100);
  const coverX = step.ball === "return" || step.ball === "catch" ? xAt(68) : xAt(42);
  const ball = ballPos(step);

  return (
    <>
      <FieldStrip
        yardMin={YARD_MIN}
        yardMax={YARD_MAX}
        endZoneFrom={100}
        footer="Kick left to right · returner waits deep · then runs it back ←"
      />

      <path
        d={`M ${xAt(35)} ${BALL_Y} C ${xAt(55)} ${FIELD_Y - 6}, ${xAt(80)} ${FIELD_Y - 2}, ${xAt(100)} ${BALL_Y}`}
        fill="none"
        stroke="#f4efe4"
        strokeWidth="2"
        strokeDasharray="6 5"
        opacity={step.ball === "tee" ? 0.25 : 0.95}
        markerEnd={step.ball !== "tee" ? `url(#${markerPrefix}-cream)` : undefined}
      />

      {step.ball === "return" ? (
        <path
          d={`M ${xAt(100)} ${BALL_Y} L ${xAt(78)} ${BALL_Y}`}
          fill="none"
          stroke="#e8b84a"
          strokeWidth="2.4"
          markerEnd={`url(#${markerPrefix}-gold)`}
        />
      ) : null}

      <g>
        <circle cx={kickerX} cy={BALL_Y} r="13" fill="#f4efe4" stroke="#e8b84a" strokeWidth="1.8" />
        <text
          x={kickerX}
          y={BALL_Y + 4}
          textAnchor="middle"
          fill="#0b1220"
          fontSize="11"
          fontWeight="800"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
        >
          K
        </text>
      </g>

      {[ -22, 0, 22 ].map((offset, i) => (
        <Moving key={i} x={coverX} y={BALL_Y + offset} animate={animate}>
          <g>
            <circle r="11" fill="#f4efe4" stroke="#e8b84a" strokeWidth="1.6" />
            <text
              x="0"
              y="4"
              textAnchor="middle"
              fill="#0b1220"
              fontSize="8"
              fontWeight="800"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
            >
              ST
            </text>
          </g>
        </Moving>
      ))}

      <Moving x={returnerX} y={BALL_Y} animate={animate}>
        <g>
          <circle r="13" fill="#121b2e" stroke="#e8b84a" strokeWidth="1.8" />
          <text
            x="0"
            y="4"
            textAnchor="middle"
            fill="#e8b84a"
            fontSize="9"
            fontWeight="800"
            fontFamily="ui-sans-serif, system-ui, sans-serif"
          >
            RET
          </text>
        </g>
      </Moving>

      <Moving x={ball.x} y={ball.y} animate={animate}>
        <Football />
      </Moving>
    </>
  );
}

export function KickoffMotionGraphic() {
  return (
    <LearnMotionGraphic
      title="The kick-off"
      svgTitle="How a kick-off works: the flight and a basic return"
      steps={kickoffSteps}
      stepMs={kickoffStepMs}
      sceneLabel={(step) =>
        step.ball === "return" ? "The return · running it back" : "Restart · kick it downfield"
      }
      describe={(step) =>
        `${step.title}. ${step.caption} Cream circles are the kicking team. The dark circle marked RET is the returner. The oval is the ball.`
      }
      figcaption="Cream circles are the kicking team (K and coverage). The dark circle marked RET is the returner. Dashed cream is the flight; the gold arrow is the return. A touchback means they start at a set yard line instead of running."
      defs={(prefix) => <ArrowDefs prefix={prefix} />}
    >
      {(ctx) => <Scene {...ctx} />}
    </LearnMotionGraphic>
  );
}
