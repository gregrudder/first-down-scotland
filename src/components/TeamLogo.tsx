"use client";

import { useState } from "react";
import { espnTeamLogo } from "@/lib/team-logo";

export function TeamLogo({
  abbreviation,
  primary,
  secondary,
  size = 64,
}: {
  abbreviation: string;
  primary: string;
  secondary: string;
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
          background: primary,
          boxShadow: `inset 0 0 0 3px ${secondary}`,
          fontSize: size * 0.28,
        }}
        aria-hidden
      >
        {abbreviation}
      </span>
    );
  }

  return (
    // ESPN public logo; falls back to abbreviation if the image 404s.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={espnTeamLogo(abbreviation)}
      alt=""
      width={size}
      height={size}
      className="object-contain"
      style={{ width: size, height: size }}
      onError={() => setFailed(true)}
    />
  );
}
