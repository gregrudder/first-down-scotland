import { TeamLogo } from "@/components/TeamLogo";
import type { FamousPlayer } from "@/data/famous-players";
import { getTeam } from "@/data/teams";

export function PlayerCard({ player }: { player: FamousPlayer }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-line bg-navy-2 p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
          {player.position} · {player.era}
        </p>
        <div className="flex flex-wrap justify-end gap-1" aria-hidden>
          {player.teamAbbrs.map((abbr) => {
            const team = getTeam(abbr);
            return (
              <TeamLogo
                key={`${player.id}-${abbr}`}
                abbreviation={abbr}
                primary={team?.primary}
                secondary={team?.secondary}
                size={28}
              />
            );
          })}
        </div>
      </div>
      <h2 className="mt-3 font-display text-2xl text-cream">{player.name}</h2>
      <p className="mt-1 text-sm text-cream-dim">{player.teams.join(", ")}</p>
      <p className="mt-3 flex-1 text-sm leading-6 text-cream-dim">{player.why}</p>
      <p className="mt-4 rounded-xl border border-gold/30 bg-navy-3 px-4 py-3 text-sm leading-6 text-cream">
        <span className="font-semibold text-gold">Why the name lasts. </span>
        {player.knownFor}
      </p>
    </article>
  );
}
