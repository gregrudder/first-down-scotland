import { TeamLogo } from "@/components/TeamLogo";
import { getTeam } from "@/data/teams";
import type { PublicFanMap, SchemeFlip, TeamCount } from "@/lib/fan-map/types";

function FlipSide({ abbreviation }: { abbreviation: string | null }) {
  if (!abbreviation) {
    return <span className="text-sm text-cream-dim">unowned</span>;
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

function TownsOwnedBoard({
  rows,
  empty,
}: {
  rows: Array<TeamCount & { townCount: number }>;
  empty: string;
}) {
  if (rows.length === 0) {
    return <p className="mt-3 text-sm leading-6 text-cream-dim">{empty}</p>;
  }
  return (
    <ol className="mt-4 space-y-2">
      {rows.map((team, index) => (
        <li key={team.abbreviation} className="flex items-center gap-3">
          <span className="w-5 text-sm text-cream-dim">{index + 1}</span>
          <TeamLogo team={team} size={32} />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-cream">{team.name}</span>
            <span className="block text-xs text-cream-dim">
              {team.count} {team.count === 1 ? "fan" : "fans"}
            </span>
          </span>
          <span className="text-sm text-cream-dim">
            {team.townCount} {team.townCount === 1 ? "town" : "towns"}
          </span>
        </li>
      ))}
    </ol>
  );
}

function TerritoryFeed({ flips, empty }: { flips: SchemeFlip[]; empty: string }) {
  if (flips.length === 0) {
    return <p className="mt-3 text-sm leading-6 text-cream-dim">{empty}</p>;
  }
  return (
    <ul className="mt-4 space-y-3">
      {flips.map((flip) => (
        <li key={flip.id} className="rounded-xl border border-line bg-navy px-4 py-3">
          <p className="text-sm leading-6 text-cream">{flip.message}</p>
          <p className="mt-2 flex flex-wrap items-center gap-2 text-xs text-cream-dim">
            <FlipSide abbreviation={flip.fromTeam} />
            <span aria-hidden>→</span>
            <FlipSide abbreviation={flip.toTeam} />
            <span>
              · {flip.townCity}
            </span>
          </p>
        </li>
      ))}
    </ul>
  );
}

export function WhoOwnsScotland({ data }: { data: PublicFanMap }) {
  const { owner, townsLed, towns, flips } = data.whoOwnsScotland;
  const threshold = data.privacyThreshold;

  return (
    <section id="who-owns-scotland" className="mt-12 rounded-2xl border border-gold/35 bg-navy-2 p-6">
      <p className="text-xs font-semibold tracking-[0.16em] text-gold uppercase">
        Who owns Scotland?
      </p>
      <h2 className="mt-2 font-display text-3xl text-cream">
        {owner ? `${owner.name} currently lead Scotland` : "Nobody owns Scotland yet"}
      </h2>
      <p className="mt-3 text-sm leading-6 text-cream-dim">
        Live competition, not a static colouring. A Scottish town is owned by the
        NFL team with the most pins there — but only once that town hits{" "}
        {threshold} fans. Below the threshold it stays uncoloured and does not
        count on the towns-owned table. A new or updated pin that changes the
        leader lands on the territory feed.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="font-display text-xl text-cream">Towns owned</h3>
          <p className="mt-1 text-xs leading-5 text-cream-dim">
            Ranked by Scottish towns owned, then fans in those towns.
          </p>
          <TownsOwnedBoard
            rows={townsLed}
            empty={`No Scottish town is owned yet. ${threshold} fans in one place starts the fight.`}
          />
        </div>
        <div>
          <h3 className="font-display text-xl text-cream">Recent territory changes</h3>
          <p className="mt-1 text-xs leading-5 text-cream-dim">
            Newest first. Stored from real pins — nothing is made up.
          </p>
          <TerritoryFeed
            flips={flips}
            empty="No Scottish town has flipped yet. The first claim will land here."
          />
        </div>
      </div>

      {towns.length > 0 ? (
        <div className="mt-8">
          <h3 className="font-display text-xl text-cream">Towns on the board</h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {towns.map((town) => (
              <li
                key={town.placeId}
                className="flex items-center gap-3 rounded-xl border border-line bg-navy px-3 py-3"
              >
                <TeamLogo team={town.leadingTeam} size={32} />
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-cream">{town.townCity}</span>
                  <span className="block text-xs text-cream-dim">
                    {town.leadingTeam.shortName} · {town.fanCount} fans
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
