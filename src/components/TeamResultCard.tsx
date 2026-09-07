import Link from "next/link";
import { TeamLogo } from "@/components/TeamLogo";
import { teamProfilePath, type NflTeam } from "@/data/teams";

export function TeamResultCard({
  team,
  eyebrow,
  story,
}: {
  team: NflTeam;
  eyebrow: string;
  story: string;
}) {
  return (
    <article
      className="overflow-hidden rounded-3xl border border-line"
      style={{
        background: `linear-gradient(160deg, ${team.primary} 0%, #0b1220 62%)`,
      }}
    >
      <div className="p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
          {eyebrow}
        </p>
        <div className="mt-4 flex items-center gap-4">
          <div className="rounded-2xl bg-navy/50 p-2">
            <TeamLogo team={team} size={72} />
          </div>
          <div>
            <h1 className="font-display text-3xl text-cream sm:text-4xl">{team.name}</h1>
            <p className="mt-1 text-sm text-cream-dim">
              {team.city} · {team.conference} · {team.abbreviation}
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
        <p className="mt-5 max-w-xl text-base leading-7 text-cream">{story}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/learn"
            className="inline-flex items-center justify-center rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-navy hover:bg-gold-soft"
          >
            Start learning
          </Link>
          <Link
            href="/this-week"
            className="inline-flex items-center justify-center rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-cream hover:border-gold/50"
          >
            See this week’s games
          </Link>
          <Link
            href={teamProfilePath(team.abbreviation)}
            className="inline-flex items-center justify-center rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-cream hover:border-gold/50"
          >
            Team profile
          </Link>
        </div>
      </div>
    </article>
  );
}

export function TrademarkNote() {
  return (
    <p className="text-xs leading-5 text-cream-dim">
      Team names and logos are trademarks of the NFL and its member clubs. They
      appear here for fan education only. First Down Scotland has no commercial
      licence.
    </p>
  );
}
