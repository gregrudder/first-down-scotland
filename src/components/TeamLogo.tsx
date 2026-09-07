"use client";

import { useState } from "react";
import { espnTeamLogo, type NflTeam } from "@/data/teams";

export function TeamLogo({
  team,
  size = 64,
}: {
  team: NflTeam;
  size?: number;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        className="inline-flex items-center justify-center rounded-full font-semibold text-cream"
        style={{
          width: size,
          height: size,
          background: team.primary,
          boxShadow: `inset 0 0 0 3px ${team.secondary}`,
          fontSize: size * 0.28,
        }}
        aria-hidden
      >
        {team.abbreviation}
      </span>
    );
  }

  return (
    // ESPN public logo; falls back to abbreviation if the image 404s.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={espnTeamLogo(team.abbreviation)}
      alt=""
      width={size}
      height={size}
      className="object-contain"
      style={{ width: size, height: size }}
      onError={() => setFailed(true)}
    />
  );
}
