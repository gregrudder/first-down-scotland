import Link from "next/link";
import { TeamLogo } from "@/components/TeamLogo";
import { teamProfilePath, type TeamProfile } from "@/data/team-profiles";

export function TeamIndexCard({ team }: { team: TeamProfile }) {
  return (
    <Link
      href={teamProfilePath(team)}
      className="flex items-center gap-3 rounded-2xl border border-line bg-navy-2 px-3 py-3 transition hover:border-gold/50 hover:bg-navy-3"
    >
      <TeamLogo
        abbreviation={team.abbreviation}
        primary={team.primary}
        secondary={team.secondary}
        size={40}
      />
      <span className="min-w-0">
        <span className="block truncate font-medium text-cream">{team.name}</span>
        <span className="block text-xs text-cream-dim">
          {team.city} · {team.abbreviation}
        </span>
      </span>
    </Link>
  );
}
