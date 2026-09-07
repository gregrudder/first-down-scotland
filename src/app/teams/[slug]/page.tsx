import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TeamLogo } from "@/components/TeamLogo";
import { TrademarkNote } from "@/components/TrademarkNote";
import {
  getTeamProfile,
  getTeamSlugs,
  teamProfileNote,
  teamsInDivision,
} from "@/data/team-profiles";

export function generateStaticParams() {
  return getTeamSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const team = getTeamProfile(slug);
  if (!team) return { title: "Team" };
  return {
    title: team.name,
    description: `${team.name} for UK beginners — stadium, colours, Super Bowls, and who they are.`,
  };
}

function formatCapacity(value: number): string {
  return value.toLocaleString("en-GB");
}

export default async function TeamProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const team = getTeamProfile(slug);
  if (!team) notFound();

  const siblings = teamsInDivision(team.conference, team.division).filter(
    (entry) => entry.slug !== team.slug,
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
        {team.conference} {team.division}
      </p>
      <div className="mt-4 flex items-center gap-4">
        <div className="rounded-2xl border border-line bg-navy-2 p-2">
          <TeamLogo
            abbreviation={team.abbreviation}
            primary={team.primary}
            secondary={team.secondary}
            size={72}
          />
        </div>
        <div>
          <h1 className="font-display text-3xl text-cream sm:text-5xl">{team.name}</h1>
          <p className="mt-1 text-sm text-cream-dim">
            {team.city} · {team.abbreviation}
          </p>
        </div>
      </div>

      <div className="mt-5 flex gap-2" aria-label="Team colours">
        <span
          className="h-8 w-8 rounded-full border border-cream/20"
          style={{ background: team.primary }}
          title="Primary colour"
        />
        <span
          className="h-8 w-8 rounded-full border border-cream/20"
          style={{ background: team.secondary }}
          title="Secondary colour"
        />
      </div>

      <p className="mt-6 text-base leading-7 text-cream">{team.scotlandHook}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <section className="rounded-2xl border border-line bg-navy-2 p-5">
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
            Stadium
          </h2>
          <p className="mt-2 font-display text-xl text-cream">{team.stadium.name}</p>
          <p className="mt-1 text-sm leading-6 text-cream-dim">
            {team.stadium.location}
            <br />
            Listed capacity {formatCapacity(team.stadium.capacity)} · opened{" "}
            {team.stadium.opened}
          </p>
          {team.stadium.note ? (
            <p className="mt-2 text-sm leading-6 text-cream-dim">{team.stadium.note}</p>
          ) : null}
        </section>
        <section className="rounded-2xl border border-line bg-navy-2 p-5">
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
            Founded
          </h2>
          <p className="mt-2 text-sm leading-6 text-cream-dim">{team.founded}</p>
        </section>
      </div>

      <section className="mt-4 rounded-2xl border border-line bg-navy-2 p-5">
        <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
          Names and nicknames
        </h2>
        <p className="mt-2 text-sm leading-6 text-cream-dim">{team.nicknames}</p>
      </section>

      <section className="mt-4 rounded-2xl border border-line bg-navy-2 p-5">
        <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
          Key achievements
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-cream-dim">
          {team.achievements.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="mt-4 rounded-2xl border border-line bg-navy-2 p-5">
        <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
          Notable names
        </h2>
        <p className="mt-1 text-xs text-cream-dim">
          A handful of all-time or iconic figures — not this year’s roster.
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {team.notablePlayers.map((player) => (
            <li
              key={player}
              className="rounded-full border border-line px-3 py-1 text-sm text-cream"
            >
              {player}
            </li>
          ))}
        </ul>
      </section>

      {siblings.length > 0 ? (
        <section className="mt-10">
          <h2 className="font-display text-2xl text-cream">
            Rest of the {team.conference} {team.division}
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {siblings.map((entry) => (
              <li key={entry.slug}>
                <Link href={`/teams/${entry.slug}`} className="text-gold">
                  {entry.name} →
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <p className="mt-8 text-sm">
        <Link href="/teams" className="text-gold">
          ← All 32 teams
        </Link>
        {" · "}
        <Link href="/history" className="text-gold">
          NFL history
        </Link>
        {" · "}
        <Link href="/learn" className="text-gold">
          Learn the sport
        </Link>
      </p>
      <p className="mt-8 text-xs leading-5 text-cream-dim">{teamProfileNote}</p>
      <div className="mt-4">
        <TrademarkNote />
      </div>
    </div>
  );
}
