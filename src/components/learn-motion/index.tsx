"use client";

import { KickoffMotionGraphic } from "./KickoffMotionGraphic";
import { PlaysMotionGraphic } from "./PlaysMotionGraphic";
import { PocketMotionGraphic } from "./PocketMotionGraphic";
import { ScoringMotionGraphic } from "./ScoringMotionGraphic";
import { TurnoverMotionGraphic } from "./TurnoverMotionGraphic";

export type LearnMotionId = "scoring" | "pocket" | "turnovers" | "kick-off" | "plays";

export function LearnMotionById({ id }: { id: LearnMotionId }) {
  switch (id) {
    case "scoring":
      return <ScoringMotionGraphic />;
    case "pocket":
      return <PocketMotionGraphic />;
    case "turnovers":
      return <TurnoverMotionGraphic />;
    case "kick-off":
      return <KickoffMotionGraphic />;
    case "plays":
      return <PlaysMotionGraphic />;
  }
}

export { KickoffMotionGraphic, PlaysMotionGraphic, PocketMotionGraphic, ScoringMotionGraphic, TurnoverMotionGraphic };
