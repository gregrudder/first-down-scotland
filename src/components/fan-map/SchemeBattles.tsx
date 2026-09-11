import { TeamLogo } from "@/components/TeamLogo";
import { getTeam } from "@/data/teams";
import type { PublicFanMap, SchemeFlip, TeamCount } from "@/lib/fan-map/types";

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
              · {flip.townCity}, {flip.nation}
            </span>
          </p>
        </li>
      ))}
    </ul>
  );
}

export function SchemeBattles({ data }: { data: PublicFanMap }) {
  const { scotlandTownsOwned, ukTownsOwned, flips } = data.schemeBattles;
  const { owner, towns } = data.whoOwnsScotland;
  const threshold = data.privacyThreshold;

  return (
    <section id="scheme-battles" className="mt-12 rounded-2xl border border-gold/35 bg-navy-2 p-6">
      <p id="who-owns-scotland" className="text-xs font-semibold tracking-[0.16em] text-gold uppercase">
        Who owns Scotland?
      </p>
      <h2 className="mt-2 font-display text-3xl text-cream">NFL Scheme Battles</h2>
      <p className="mt-3 text-sm leading-6 text-cream-dim">
        {owner
          ? `${owner.name} lead Scotland for now — ${owner.count} fans on the map.`
          : "Nobody owns Scotland yet."}{" "}
        A town (a scheme, if you are from here) is owned by the leading NFL
        club once it hits {threshold} pins. Below that it stays uncoloured and
        does not score. When the lead flips, it hits the feed. No fake
        takeovers.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="font-display text-xl text-cream">Towns owned · Scotland</h3>
          <p className="mt-1 text-xs leading-5 text-cream-dim">
            Ranked by schemes owned, then fans.
          </p>
          <TownsOwnedBoard
            rows={scotlandTownsOwned}
            empty={`No Scottish town is owned yet. ${threshold} fans in one place starts a scheme.`}
          />
        </div>
        <div>
          <h3 className="font-display text-xl text-cream">Towns owned · UK</h3>
          <p className="mt-1 text-xs leading-5 text-cream-dim">
            Same rule, rest of the UK included.
          </p>
          <TownsOwnedBoard
            rows={ukTownsOwned}
            empty="The UK table fills when towns hit the threshold."
          />
        </div>
      </div>

      <div className="mt-8">
        <h3 className="font-display text-xl text-cream">Recent territory changes</h3>
        <p className="mt-1 text-xs leading-5 text-cream-dim">
          Newest first. Stored from real pins — nothing is made up.
        </p>
        <TerritoryFeed
          flips={flips}
          empty="No scheme has taken a town yet. The first flip will land here — PACKERS HAVE CLAIMED WISHAW, or the Dolphins have claimed Wishaw. Your call."
        />
      </div>

      {towns.length > 0 ? (
        <div className="mt-8">
          <h3 className="font-display text-xl text-cream">Scottish schemes on the board</h3>
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
