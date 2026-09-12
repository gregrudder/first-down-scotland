"use client";

import { formationOLine } from "@/data/formation";
import { turnoverStepMs, turnoverSteps, type TurnoverStep } from "@/data/learn-motion/turnovers";
import { PlayerMark } from "@/components/PlayerMark";
import { LearnMotionGraphic } from "./LearnMotionGraphic";
import { ArrowDefs, Football, Moving, PlayBoard, ScoreBadge } from "./primitives";

const spots = {
  qb: { x: 156, y: 196 },
  wr: { x: 292, y: 64 },
  cbStart: { x: 268, y: 96 },
  cbPick: { x: 236, y: 92 },
  cbReturn: { x: 200, y: 150 },
  carrier: { x: 176, y: 196 },
  loose: { x: 196, y: 150 },
  recover: { x: 220, y: 96 },
  defender: { x: 220, y: 118 },
};

function ballPos(step: TurnoverStep) {
  switch (step.ball) {
    case "qb":
      return spots.qb;
    case "air":
      return { x: 210, y: 130 };
    case "cb":
      return spots.cbPick;
    case "return":
      return spots.cbReturn;
    case "carrier":
      return spots.carrier;
    case "loose":
      return spots.loose;
    case "recovered":
      return spots.recover;
  }
}

function Scene({ step, animate, markerPrefix }: { step: TurnoverStep; animate: boolean; markerPrefix: string }) {
  const pick = step.scene === "interception";
  const ball = ballPos(step);
  const cb = pick
    ? step.ball === "return"
      ? spots.cbReturn
      : step.ball === "cb" || step.ball === "air"
        ? spots.cbPick
        : spots.cbStart
    : spots.defender;
  const wr = spots.wr;

  return (
    <>
      <PlayBoard />

      {pick ? (
        <>
          <path
            d="M328 170 L280 70"
            fill="none"
            stroke="#f4efe4"
            strokeWidth="2"
            strokeDasharray={step.ball === "air" || step.ball === "cb" ? undefined : "5 5"}
            opacity={0.85}
            markerEnd={`url(#${markerPrefix}-cream)`}
          />
          <path
            d={`M ${spots.qb.x} ${spots.qb.y} C 200 140 230 110 ${spots.cbPick.x} ${spots.cbPick.y}`}
            fill="none"
            stroke="#f3d27a"
            strokeWidth="2.2"
            strokeDasharray="5 5"
            markerEnd={`url(#${markerPrefix}-soft)`}
          />
        </>
      ) : (
        <path
          d={`M ${spots.carrier.x} ${spots.carrier.y} L ${spots.loose.x} ${spots.loose.y}`}
          fill="none"
          stroke="#ff6b4a"
          strokeWidth="2.2"
          markerEnd={`url(#${markerPrefix}-live)`}
        />
      )}

      {formationOLine.map((marker) => (
        <PlayerMark key={marker.id} marker={marker} />
      ))}

      {pick ? (
        <>
          <PlayerMark marker={{ id: "qb", kind: "O", ...spots.qb, label: "QB" }} />
          <PlayerMark marker={{ id: "wr", kind: "O", ...wr, label: "WR" }} />
        </>
      ) : (
        <PlayerMark marker={{ id: "rb", kind: "O", ...spots.carrier, label: "RB" }} />
      )}

      <Moving x={cb.x} y={cb.y} animate={animate}>
        <PlayerMark
          marker={{
            id: "cb",
            kind: "X",
            x: 0,
            y: 0,
            label: pick ? "CB" : "LB",
          }}
        />
      </Moving>

      <Moving x={ball.x} y={ball.y - 20} animate={animate}>
        <Football label={step.possession === "loose" ? "Loose" : null} />
      </Moving>

      {step.call === "INTERCEPTION" ? <ScoreBadge x={180} y={24} text="PICK" width={100} /> : null}
      {step.possession === "defence" && step.scene === "fumble" ? (
        <ScoreBadge x={180} y={24} text="THEIRS" width={110} />
      ) : null}

      <text
        x={180}
        y={258}
        textAnchor="middle"
        fill={step.possession === "defence" ? "#ff6b4a" : step.possession === "loose" ? "#f3d27a" : "#f4efe4"}
        fontSize="12"
        fontWeight="800"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
      >
        {step.possession === "offence"
          ? "Possession: offence"
          : step.possession === "loose"
            ? "Possession: up for grabs"
            : "Possession: defence"}
      </text>
    </>
  );
}

export function TurnoverMotionGraphic() {
  return (
    <LearnMotionGraphic
      title="How a turnover happens"
      svgTitle="How an interception and a fumble flip possession"
      steps={turnoverSteps}
      stepMs={turnoverStepMs}
      viewBox="0 0 360 268"
      svgClassName="w-full max-h-[26rem]"
      sceneLabel={(step) =>
        step.scene === "interception"
          ? "Example 1 · interception"
          : "Example 2 · fumble and recovery"
      }
      describe={(step) =>
        `${step.title}. ${step.caption} Cream circles are offence. Dark circles with gold letters are defence. The oval is the ball.`
      }
      figcaption="An interception is a catch by the defence. A fumble is a dropped or stripped ball — whoever falls on it, owns it. Either way, possession flips without a kick."
      defs={(prefix) => <ArrowDefs prefix={prefix} />}
    >
      {(ctx) => <Scene {...ctx} />}
    </LearnMotionGraphic>
  );
}
