"use client";

import { scoringStepMs, scoringSteps, type ScoringStep } from "@/data/learn-motion/scoring";
import { LearnMotionGraphic } from "./LearnMotionGraphic";
import {
  ArrowDefs,
  FIELD_Y,
  FIELD_H,
  Football,
  FieldStrip,
  GoalPosts,
  Moving,
  ScoreBadge,
  fieldX,
} from "./primitives";

const YARD_MIN = 75;
const YARD_MAX = 110;
const BALL_Y = FIELD_Y + FIELD_H / 2;

function xAt(yard: number) {
  return fieldX(yard, YARD_MIN, YARD_MAX);
}

function Scene({ step, animate, markerPrefix }: { step: ScoringStep; animate: boolean; markerPrefix: string }) {
  const ballX = xAt(step.ballYard);
  const ballY = step.ballAir ? FIELD_Y + 18 : BALL_Y;
  const kickStartX = xAt(80);

  return (
    <>
      <FieldStrip
        yardMin={YARD_MIN}
        yardMax={YARD_MAX}
        endZoneFrom={100}
        footer="Attacking the end zone → · posts at the back of the paint"
      />
      <GoalPosts x={xAt(110)} />
      <text
        x={(xAt(100) + xAt(110)) / 2}
        y={FIELD_Y + FIELD_H / 2 + 4}
        textAnchor="middle"
        fill="#e8b84a"
        fontSize="13"
        fontWeight="800"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        opacity="0.85"
      >
        END ZONE
      </text>

      {step.showKicker ? (
        <g>
          <circle cx={kickStartX} cy={BALL_Y} r="14" fill="#f4efe4" stroke="#e8b84a" strokeWidth="1.8" />
          <text
            x={kickStartX}
            y={BALL_Y + 4}
            textAnchor="middle"
            fill="#0b1220"
            fontSize="11"
            fontWeight="800"
            fontFamily="ui-sans-serif, system-ui, sans-serif"
          >
            K
          </text>
          <text
            x={kickStartX}
            y={BALL_Y + 28}
            textAnchor="middle"
            fill="#c9c2b3"
            fontSize="10"
            fontWeight="700"
            fontFamily="ui-sans-serif, system-ui, sans-serif"
          >
            Kicker
          </text>
        </g>
      ) : null}

      {step.highlight === "goal-line" || step.highlight === "touchdown" ? (
        <text
          x={xAt(100)}
          y={FIELD_Y + 22}
          textAnchor="middle"
          fill="#e8b84a"
          fontSize="12"
          fontWeight="800"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
        >
          Goal line
        </text>
      ) : null}

      {step.highlight === "kick" || step.highlight === "field-goal" ? (
        <path
          d={`M ${kickStartX} ${BALL_Y} C ${xAt(92)} ${FIELD_Y - 8}, ${xAt(102)} ${FIELD_Y - 4}, ${xAt(110)} ${32}`}
          fill="none"
          stroke="#f4efe4"
          strokeWidth="2"
          strokeDasharray="6 5"
          markerEnd={`url(#${markerPrefix}-cream)`}
        />
      ) : null}

      {step.highlight === "touchdown" ? (
        <ScoreBadge x={xAt(105)} y={FIELD_Y + 14} text="TOUCHDOWN · 6" width={168} />
      ) : null}
      {step.highlight === "field-goal" ? (
        <ScoreBadge x={xAt(102)} y={FIELD_Y + 58} text="FIELD GOAL · 3" width={168} />
      ) : null}

      <Moving x={ballX} y={ballY} animate={animate}>
        <Football />
      </Moving>
    </>
  );
}

export function ScoringMotionGraphic() {
  return (
    <LearnMotionGraphic
      title="How you score"
      svgTitle="How NFL scoring works: a touchdown and a field goal"
      steps={scoringSteps}
      stepMs={scoringStepMs}
      sceneLabel={(step) =>
        step.scene === "touchdown" ? "Example 1 · touchdown for 6" : "Example 2 · field goal for 3"
      }
      describe={(step) =>
        `${step.title}. ${step.caption} The gold paint on the right is the end zone. The two uprights at the far end are the posts.`
      }
      figcaption="Carry or catch the ball in the end zone for 6. Kick it through the posts at the back of that paint for 3. The same kick, from closer, is the extra point after a touchdown."
      defs={(prefix) => <ArrowDefs prefix={prefix} />}
    >
      {(ctx) => <Scene {...ctx} />}
    </LearnMotionGraphic>
  );
}
