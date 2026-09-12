"use client";

import { formationOLine } from "@/data/formation";
import { pocketStepMs, pocketSteps, type PocketStep } from "@/data/learn-motion/pocket";
import { PlayerMark } from "@/components/PlayerMark";
import { LearnMotionGraphic } from "./LearnMotionGraphic";
import { ArrowDefs, Moving, PlayBoard, ScoreBadge, lerp } from "./primitives";

const rushers = [
  { id: "de-l", label: "DE", from: { x: 96, y: 118 }, to: { x: 118, y: 150 } },
  { id: "dt-l", label: "DT", from: { x: 132, y: 118 }, to: { x: 142, y: 150 } },
  { id: "dt-r", label: "DT", from: { x: 180, y: 118 }, to: { x: 170, y: 150 } },
  { id: "de-r", label: "DE", from: { x: 216, y: 118 }, to: { x: 194, y: 150 } },
] as const;

function Scene({ step, animate, markerPrefix }: { step: PocketStep; animate: boolean; markerPrefix: string }) {
  const qb = { x: 156, y: step.sack ? 214 : 204 };
  const rx = lerp(58, 32, step.rush);
  const ry = lerp(40, 22, step.rush);
  const pocketY = lerp(200, 208, step.rush);

  return (
    <>
      <PlayBoard />
      <ellipse
        cx={156}
        cy={pocketY}
        rx={rx}
        ry={ry}
        fill="rgba(232,184,74,0.12)"
        stroke="#e8b84a"
        strokeWidth="1.6"
        strokeDasharray="7 6"
      />
      <text
        x={156}
        y={pocketY + ry + 16}
        textAnchor="middle"
        fill="#e8b84a"
        fontSize="11"
        fontWeight="800"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
      >
        {step.sack ? "Pocket gone" : "The pocket"}
      </text>

      {rushers.map((rusher) => (
        <path
          key={`${rusher.id}-path`}
          d={`M ${rusher.from.x} ${rusher.from.y} L ${lerp(rusher.from.x, rusher.to.x, Math.max(step.rush, 0.12))} ${lerp(rusher.from.y, rusher.to.y, Math.max(step.rush, 0.12))}`}
          fill="none"
          stroke="#ff6b4a"
          strokeWidth="2"
          markerEnd={step.rush > 0 ? `url(#${markerPrefix}-live)` : undefined}
        />
      ))}

      {formationOLine.map((marker) => (
        <PlayerMark key={marker.id} marker={marker} />
      ))}

      <Moving x={qb.x} y={qb.y} animate={animate}>
        <PlayerMark marker={{ id: "qb", kind: "O", x: 0, y: 0, label: "QB" }} />
      </Moving>

      {rushers.map((rusher) => (
        <Moving
          key={rusher.id}
          x={lerp(rusher.from.x, rusher.to.x, step.rush)}
          y={lerp(rusher.from.y, rusher.to.y, step.rush)}
          animate={animate}
        >
          <PlayerMark marker={{ id: rusher.id, kind: "X", x: 0, y: 0, label: rusher.label }} />
        </Moving>
      ))}

      {step.sack ? <ScoreBadge x={156} y={36} text="PRESSURE" width={132} /> : null}
    </>
  );
}

export function PocketMotionGraphic() {
  return (
    <LearnMotionGraphic
      title="The pocket"
      svgTitle="How the pass rush collapses the pocket around the quarterback"
      steps={pocketSteps}
      stepMs={pocketStepMs}
      viewBox="0 0 360 268"
      svgClassName="w-full max-h-[26rem]"
      sceneLabel={(step) =>
        step.sack ? "When it collapses · the QB is in trouble" : "The little space the line tries to keep"
      }
      describe={(step) =>
        `${step.title}. ${step.caption} Cream circles are the offensive line and quarterback. Dark circles with gold letters are the rushers.`
      }
      figcaption="Cream circles are offence. Gold letters on dark are the rush. The dashed gold oval is the pocket. If those red arrows arrive, the quarterback is sacked, throws it away, or scrambles."
      defs={(prefix) => <ArrowDefs prefix={prefix} />}
    >
      {(ctx) => <Scene {...ctx} />}
    </LearnMotionGraphic>
  );
}
