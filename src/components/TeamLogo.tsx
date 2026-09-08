"use client";

import { useState } from "react";
import { espnTeamLogo } from "@/lib/team-logo";

type TeamLike = {
  abbreviation: string;
  primary: string;
  secondary: string;
};

type TeamLogoProps = {
  team?: TeamLike;
  abbreviation?: string;
  primary?: string;
  secondary?: string;
  size?: number;
};

export function TeamLogo({
  team,
  abbreviation,
  primary,
  secondary,
  size = 64,
}: TeamLogoProps) {
  const abbr = abbreviation ?? team?.abbreviation ?? "";
  const prim = primary ?? team?.primary ?? "#0B1D36";
  const sec = secondary ?? team?.secondary ?? "#C9A227";
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        className="inline-flex items-center justify-center rounded-full font-semibold text-cream"
        style={{
          width: size,
          height: size,
          background: prim,
          boxShadow: `inset 0 0 0 3px ${sec}`,
          fontSize: size * 0.28,
        }}
        aria-hidden
      >
        {abbr}
      </span>
    );
  }

  return (
    // ESPN public logo; falls back to abbreviation if the image 404s.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={espnTeamLogo(abbr)}
        alt={`${abbr} logo`}
        width={size}
      height={size}
      className="object-contain"
      style={{ width: size, height: size }}
      onError={() => setFailed(true)}
    />
  );
}
