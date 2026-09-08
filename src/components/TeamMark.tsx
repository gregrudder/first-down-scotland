"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { TeamLogo } from "@/components/TeamLogo";
import { savedTeamRecord } from "@/lib/team-storage";

export function NavTeamMark({ className }: { className?: string }) {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => {
      const record = savedTeamRecord();
      setLabel(record ? record.team.abbreviation : null);
    };
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("fds-team-change", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("fds-team-change", sync);
    };
  }, []);

  if (!label) return null;

  return (
    <Link
      href="/this-week#your-sunday"
      className={`rounded-full border border-gold/40 px-2.5 py-1 text-xs font-semibold text-gold hover:bg-navy-3 ${className ?? "hidden lg:inline-flex"}`}
      title="Your team"
    >
      Your team · {label}
    </Link>
  );
}

export function HomeTeamCard() {
  const [name, setName] = useState<string | null>(null);
  const [abbr, setAbbr] = useState<string | null>(null);
  const [team, setTeam] = useState<ReturnType<typeof savedTeamRecord>>(null);

  useEffect(() => {
    const sync = () => {
      const record = savedTeamRecord();
      setTeam(record);
      setName(record?.team.shortName ?? null);
      setAbbr(record?.team.abbreviation ?? null);
    };
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("fds-team-change", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("fds-team-change", sync);
    };
  }, []);

  if (!team || !name || !abbr) {
    return (
      <div className="rounded-2xl border border-line bg-navy-2 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
          For life, apparently
        </p>
        <p className="mt-2 font-display text-xl text-cream">Pick your team</p>
        <p className="mt-2 text-sm leading-6 text-cream-dim">
          A short quiz, a spin of the ball, or pick from the 32 if you already
          have a side. You can change your mind. We won’t tell the pub.
        </p>
        <Link
          href="/pick-your-team"
          className="mt-4 inline-block text-sm font-semibold text-gold"
        >
          Pick a side →
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-line bg-navy-2 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
        Your team
      </p>
      <div className="mt-3 flex items-center gap-3">
        <TeamLogo team={team.team} size={48} />
        <div>
          <p className="font-display text-xl text-cream">{team.team.name}</p>
          <p className="text-sm text-cream-dim">{abbr}</p>
        </div>
      </div>
      <Link
        href="/pick-your-team"
        className="mt-4 inline-block text-sm font-semibold text-gold"
      >
        Pick again →
      </Link>
    </div>
  );
}

export function HubSavedTeam() {
  const [team, setTeam] = useState<ReturnType<typeof savedTeamRecord>>(null);

  useEffect(() => {
    const sync = () => setTeam(savedTeamRecord());
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("fds-team-change", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("fds-team-change", sync);
    };
  }, []);

  if (!team) return null;

  return (
    <div className="mt-8 flex items-center gap-3 rounded-2xl border border-line bg-navy-2 px-4 py-3">
      <TeamLogo team={team.team} size={40} />
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
          Your team
        </p>
        <p className="truncate text-sm text-cream">{team.team.name}</p>
      </div>
    </div>
  );
}
