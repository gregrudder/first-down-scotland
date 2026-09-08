"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { TeamLogo } from "@/components/TeamLogo";
import { randomTeam, teams, type NflTeam } from "@/data/teams";
import { saveTeam } from "@/lib/team-storage";

function Football({ spinning, spinMs }: { spinning: boolean; spinMs: number }) {
  return (
    <svg
      viewBox="0 0 120 80"
      className={`h-36 w-52 sm:h-40 sm:w-60 ${spinning ? "fds-football-spin" : ""}`}
      style={spinning ? { ["--fds-spin-ms" as string]: `${spinMs}ms` } : undefined}
      aria-hidden
    >
      <ellipse cx="60" cy="40" rx="54" ry="32" fill="#6b3a1f" />
      <ellipse cx="48" cy="30" rx="18" ry="10" fill="#8a522c" opacity="0.55" />
      <ellipse cx="60" cy="40" rx="54" ry="32" fill="none" stroke="#3d2110" strokeWidth="3" />
      <path
        d="M36 40 H84"
        stroke="#f4efe4"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {[44, 52, 60, 68, 76].map((x) => (
        <path
          key={x}
          d={`M${x} 34 V46`}
          stroke="#f4efe4"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

export function FootballSpin() {
  const router = useRouter();
  const [spinning, setSpinning] = useState(false);
  const [spinMs, setSpinMs] = useState(280);
  const [preview, setPreview] = useState<NflTeam>(teams[0]!);
  const [landed, setLanded] = useState<NflTeam | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  function spin() {
    if (spinning) return;
    setLanded(null);
    setSpinning(true);
    setSpinMs(70);

    const winner = randomTeam();
    let delay = 70;
    let elapsed = 0;
    const total = 2800;

    const tick = () => {
      elapsed += delay;
      if (elapsed >= total) {
        setPreview(winner);
        setLanded(winner);
        setSpinning(false);
        saveTeam(winner.abbreviation, "spin");
        return;
      }
      setPreview(randomTeam(winner.abbreviation));
      delay = Math.min(320, Math.round(delay * 1.16));
      setSpinMs(delay);
      timer.current = window.setTimeout(tick, delay);
    };

    timer.current = window.setTimeout(tick, delay);
  }

  function seeResult() {
    if (!landed) return;
    router.push(`/pick-your-team/result?team=${landed.abbreviation}&via=spin`);
  }

  return (
    <div className="text-center">
      <div
        className="mx-auto flex h-56 w-56 items-center justify-center rounded-full border border-line sm:h-64 sm:w-64"
        style={{
          background: landed
            ? `radial-gradient(circle at 40% 30%, ${landed.secondary}55, ${landed.primary} 70%)`
            : "radial-gradient(circle at 40% 30%, #1a2640, #0b1220 70%)",
        }}
      >
        {landed && !spinning ? (
          <TeamLogo team={landed} size={88} />
        ) : (
          <Football spinning={spinning} spinMs={spinMs} />
        )}
      </div>

      <p className="mt-6 font-display text-2xl text-cream" aria-live="polite">
        {spinning ? preview.shortName : landed ? landed.name : "Ready when you are"}
      </p>
      <p className="mt-2 text-sm text-cream-dim">
        {spinning
          ? "The ball is thinking…"
          : landed
            ? landed.oneLiner
            : "Tap spin. Fate picks one of the 32."}
      </p>

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={spin}
          disabled={spinning}
          className="inline-flex min-w-44 items-center justify-center rounded-full bg-gold px-6 py-3 text-sm font-semibold text-gold-ink hover:bg-gold-soft disabled:opacity-60"
        >
          {spinning ? "Spinning…" : landed ? "Spin again" : "Spin the ball"}
        </button>
        {landed && !spinning ? (
          <button
            type="button"
            onClick={seeResult}
            className="inline-flex min-w-44 items-center justify-center rounded-full border border-line px-6 py-3 text-sm font-semibold text-cream hover:border-gold/50"
          >
            That’s my team
          </button>
        ) : null}
      </div>
    </div>
  );
}
