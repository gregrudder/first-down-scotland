"use client";

import { formationEleven } from "@/data/formation";
import { playsMotionStepMs, playsMotionSteps, type PlaysStep } from "@/data/learn-motion/plays";
import { PlayerMark } from "@/components/PlayerMark";
import { LearnMotionGraphic } from "./LearnMotionGraphic";
import { ArrowDefs, Football, Moving, PlayBoard, lerp } from "./primitives";

function Scene({ step, animate, markerPrefix }: { step: PlaysStep; animate: boolean; markerPrefix: string }) {
  const t = step.progress;
  const markers = formationEleven.map((marker) => {
    if (step.play === "outside-run" && marker.id === "rb") {
      return { ...marker, x: 176, y: 226 };
    }
    return marker;
  });

  const wrL = {
    x: lerp(32, 110, t),
    y: lerp(170, 96, t),
  };
  const rbScreen = {
    x: lerp(156, 248, t),
    y: lerp(226, 150, t),
  };
  const rbSweep = {
    x: lerp(176, 48, t),
    y: lerp(226, 118, t),
  };
  const rush1 = { x: lerp(132, 148, t), y: lerp(118, 168, t) };
  const rush2 = { x: lerp(180, 168, t), y: lerp(118, 170, t) };
  const ol1 = { x: lerp(186, 250, t), y: lerp(164, 120, t) };
  const ol2 = { x: lerp(216, 258, t), y: lerp(164, 110, t) };

  const ball =
    step.play === "slant"
      ? t < 1
        ? { x: 156, y: 196 }
        : wrL
      : step.play === "screen"
        ? t < 1
          ? { x: 156, y: 196 }
          : rbScreen
        : rbSweep;

  return (
    <>
      <PlayBoard />

      {step.play === "slant" ? (
        <>
          <path
            d="M32 170 L110 96"
            fill="none"
            stroke="#f4efe4"
            strokeWidth="2.2"
            markerEnd={`url(#${markerPrefix}-cream)`}
          />
          <path
            d="M328 170 L250 96"
            fill="none"
            stroke="#f4efe4"
            strokeWidth="2"
            opacity="0.45"
            markerEnd={`url(#${markerPrefix}-cream)`}
          />
          {t > 0 ? (
            <path
              d="M156 196 L110 96"
              fill="none"
              stroke="#f3d27a"
              strokeWidth="2.2"
              strokeDasharray="5 5"
              markerEnd={`url(#${markerPrefix}-soft)`}
            />
          ) : null}
        </>
      ) : null}

      {step.play === "screen" ? (
        <>
          <path
            d={`M132 118 L${rush1.x} ${rush1.y}`}
            fill="none"
            stroke="#ff6b4a"
            strokeWidth="2"
            markerEnd={`url(#${markerPrefix}-live)`}
          />
          <path
            d={`M180 118 L${rush2.x} ${rush2.y}`}
            fill="none"
            stroke="#ff6b4a"
            strokeWidth="2"
            markerEnd={`url(#${markerPrefix}-live)`}
          />
          <path
            d="M186 164 C210 150 236 140 250 120"
            fill="none"
            stroke="#c9c2b3"
            strokeWidth="1.8"
            markerEnd={`url(#${markerPrefix}-cream)`}
          />
          <path
            d="M216 164 C230 148 248 132 258 110"
            fill="none"
            stroke="#c9c2b3"
            strokeWidth="1.8"
            markerEnd={`url(#${markerPrefix}-cream)`}
          />
          <path
            d="M156 226 C200 220 236 190 248 150"
            fill="none"
            stroke="#e8b84a"
            strokeWidth="2.2"
            markerEnd={`url(#${markerPrefix}-gold)`}
          />
          {t > 0 ? (
            <path
              d="M156 196 C200 200 230 170 248 150"
              fill="none"
              stroke="#f3d27a"
              strokeWidth="2.2"
              strokeDasharray="5 5"
              markerEnd={`url(#${markerPrefix}-soft)`}
            />
          ) : null}
        </>
      ) : null}

      {step.play === "outside-run" ? (
        <>
          <path
            d="M176 226 C120 216 64 176 48 118"
            fill="none"
            stroke="#e8b84a"
            strokeWidth="2.4"
            markerEnd={`url(#${markerPrefix}-gold)`}
          />
          <path
            d="M96 164 L70 140"
            fill="none"
            stroke="#c9c2b3"
            strokeWidth="1.8"
            markerEnd={`url(#${markerPrefix}-cream)`}
          />
          <path
            d="M32 170 L32 128"
            fill="none"
            stroke="#c9c2b3"
            strokeWidth="1.8"
            markerEnd={`url(#${markerPrefix}-cream)`}
          />
        </>
      ) : null}

      {markers.map((marker) => {
        if (step.play === "slant" && marker.id === "wrl") {
          return (
            <Moving key={marker.id} x={wrL.x} y={wrL.y} animate={animate}>
              <PlayerMark marker={{ ...marker, x: 0, y: 0 }} />
            </Moving>
          );
        }
        if (step.play === "screen" && marker.id === "rb") {
          return (
            <Moving key={marker.id} x={rbScreen.x} y={rbScreen.y} animate={animate}>
              <PlayerMark marker={{ ...marker, x: 0, y: 0 }} />
            </Moving>
          );
        }
        if (step.play === "screen" && marker.id === "rg") {
          return (
            <Moving key={marker.id} x={ol1.x} y={ol1.y} animate={animate}>
              <PlayerMark marker={{ ...marker, x: 0, y: 0 }} />
            </Moving>
          );
        }
        if (step.play === "screen" && marker.id === "rt") {
          return (
            <Moving key={marker.id} x={ol2.x} y={ol2.y} animate={animate}>
              <PlayerMark marker={{ ...marker, x: 0, y: 0 }} />
            </Moving>
          );
        }
        if (step.play === "screen" && (marker.id === "dt-l" || marker.id === "dt-r")) {
          const rush = marker.id === "dt-l" ? rush1 : rush2;
          return (
            <Moving key={marker.id} x={rush.x} y={rush.y} animate={animate}>
              <PlayerMark marker={{ ...marker, x: 0, y: 0 }} />
            </Moving>
          );
        }
        if (step.play === "outside-run" && marker.id === "rb") {
          return (
            <Moving key={marker.id} x={rbSweep.x} y={rbSweep.y} animate={animate}>
              <PlayerMark marker={{ ...marker, x: 0, y: 0 }} />
            </Moving>
          );
        }
        return <PlayerMark key={marker.id} marker={marker} />;
      })}

      <Moving x={ball.x} y={ball.y - 20} animate={animate}>
        <Football label={null} />
      </Moving>
    </>
  );
}

const playLabel: Record<PlaysStep["play"], string> = {
  slant: "Example 1 · slant",
  screen: "Example 2 · screen",
  "outside-run": "Example 3 · outside run",
};

export function PlaysMotionGraphic() {
  return (
    <LearnMotionGraphic
      title="Three common plays"
      svgTitle="Animated X-and-O examples: a slant, a screen, and an outside run"
      steps={playsMotionSteps}
      stepMs={playsMotionStepMs}
      viewBox="0 0 360 268"
      svgClassName="w-full max-h-[26rem]"
      sceneLabel={(step) => playLabel[step.play]}
      describe={(step) =>
        `${step.title}. ${step.caption} Cream circles are offence. Dark circles with gold letters are defence. The oval is the ball.`
      }
      figcaption="Only three shapes, on purpose. Cream is offence, gold letters are defence. Cream arrow = route, dashed gold = throw, solid gold = run, red = rush. The rest of the catalogue is drawn still, below."
      defs={(prefix) => <ArrowDefs prefix={prefix} />}
    >
      {(ctx) => <Scene key={ctx.step.play} {...ctx} />}
    </LearnMotionGraphic>
  );
}
