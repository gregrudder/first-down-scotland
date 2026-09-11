import { TeamLogo } from "@/components/TeamLogo";
import { getTeam } from "@/data/teams";
import type { PublicFanMap } from "@/lib/fan-map/types";

function FlipSide({ abbreviation }: { abbreviation: string | null }) {
  if (!abbreviation) {
    return <span className="text-sm text-cream-dim">vacant</span>;
  }
  const team = getTeam(abbreviation);
  if (!team) return <span className="text-sm text-cream">{abbreviation}</span>;
  return (
    <span className="inline-flex items-center gap-2">
      <TeamLogo team={team} size={22} />
      <span className="text-sm text-cream">{team.shortName}</span>
    </span>
  );
}

export function SchemeBattles({ data }: { data: PublicFanMap }) {
  const { scotlandTownsOwned, ukTownsOwned, flips } = data.schemeBattles;

  return (
    <section id="scheme-battles" className="mt-12 rounded-2xl border border-gold/35 bg-navy-2 p-6">
      <p className="text-xs font-semibold tracking-[0.16em] text-gold uppercase">
        NFL Scheme Battles
      </p>
      <h2 className="mt-2 font-display text-3xl text-cream">Live town-ownership war</h2>
      <p className="mt-3 text-sm leading-6 text-cream-dim">
        Each town that hits the privacy threshold is owned by the leading NFL
        scheme. When the lead flips, it hits the feed. No fake takeovers.
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div>
          <h3 className="font-display text-xl text-cream">Towns owned · Scotland</h3>
          {scotlandTownsOwned.length === 0 ? (
            <p className="mt-2 text-sm text-cream-dim">
              No Scottish town is owned yet. Three fans in one place starts a scheme.
            </p>
          ) : (
            <ol className="mt-3 space-y-2">
              {scotlandTownsOwned.map((team, index) => (
                <li key={team.abbreviation} className="flex items-center gap-3">
                  <span className="w-5 text-sm text-cream-dim">{index + 1}</span>
                  <TeamLogo team={team} size={28} />
                  <span className="min-w-0 flex-1 text-sm text-cream">{team.name}</span>
                  <span className="text-sm text-cream-dim">
                    {team.townCount} {team.townCount === 1 ? "town" : "towns"}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>
        <div>
          <h3 className="font-display text-xl text-cream">Towns owned · UK</h3>
          {ukTownsOwned.length === 0 ? (
            <p className="mt-2 text-sm text-cream-dim">The UK table fills when towns hit the threshold.</p>
          ) : (
            <ol className="mt-3 space-y-2">
              {ukTownsOwned.map((team, index) => (
                <li key={team.abbreviation} className="flex items-center gap-3">
                  <span className="w-5 text-sm text-cream-dim">{index + 1}</span>
                  <TeamLogo team={team} size={28} />
                  <span className="min-w-0 flex-1 text-sm text-cream">{team.name}</span>
                  <span className="text-sm text-cream-dim">
                    {team.townCount} {team.townCount === 1 ? "town" : "towns"}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="font-display text-xl text-cream">Flip feed</h3>
        {flips.length === 0 ? (
          <p className="mt-2 text-sm leading-6 text-cream-dim">
            No scheme has taken a town yet. The first flip will land here with the
            banter — took over, on the run, take an L.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {flips.map((flip) => (
              <li key={flip.id} className="rounded-xl border border-line bg-navy px-4 py-3">
                <p className="text-sm leading-6 text-cream">{flip.message}</p>
                <p className="mt-2 flex flex-wrap items-center gap-2 text-xs text-cream-dim">
                  <FlipSide abbreviation={flip.fromTeam} />
                  <span aria-hidden>→</span>
                  <FlipSide abbreviation={flip.toTeam} />
                  <span>· {flip.townCity}, {flip.nation}</span>
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
