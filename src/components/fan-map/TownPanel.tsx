import { TeamLogo } from "@/components/TeamLogo";
import type { PublicTown } from "@/lib/fan-map/types";

export function TownPanel({
  town,
  privacyThreshold,
}: {
  town: PublicTown;
  privacyThreshold: number;
}) {
  return (
    <article className="rounded-2xl border border-line bg-navy-2 p-5">
      <p className="text-xs font-semibold tracking-[0.16em] text-gold uppercase">
        {town.nation} · {town.regionOrCouncilArea}
      </p>
      <h3 className="mt-1 font-display text-2xl text-cream">{town.townCity}</h3>
      <p className="mt-2 text-sm leading-6 text-cream-dim">
        {town.fanCount === 1 ? "1 fan on the map" : `${town.fanCount} fans on the map`}.
        {" "}
        {town.watchPartyYes + town.watchPartyMaybe > 0
          ? `${town.watchPartyYes} would host or join a watch party; ${town.watchPartyMaybe} said maybe.`
          : "No watch-party interest logged yet."}
      </p>
      <p className="mt-2 text-sm text-cream-dim">
        {town.fansWithin15Miles === 1
          ? "1 fan within about 15 miles"
          : `${town.fansWithin15Miles} fans within about 15 miles`}{" "}
        (town centres, not home addresses).
      </p>

      {town.teams && town.leadingTeam ? (
        <div className="mt-4">
          <p className="text-xs font-semibold tracking-[0.16em] text-gold uppercase">
            Top teams
          </p>
          <ul className="mt-3 space-y-2">
            {town.teams.slice(0, 5).map((team) => (
              <li key={team.abbreviation} className="flex items-center gap-3">
                <TeamLogo team={team} size={28} />
                <span className="min-w-0 flex-1 text-sm text-cream">
                  {team.shortName}
                </span>
                <span className="text-sm text-cream-dim">
                  {team.count} · {team.percent}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-4 rounded-xl border border-dashed border-line bg-navy px-3 py-3 text-sm leading-6 text-cream-dim">
          Per-team split stays hidden until this town has at least{" "}
          {privacyThreshold === 1 ? "1 fan" : `${privacyThreshold} fans`}.
          Totals still count.
        </p>
      )}

      {town.nearby.length > 0 ? (
        <div className="mt-5">
          <p className="text-xs font-semibold tracking-[0.16em] text-gold uppercase">
            Nearby towns
          </p>
          <ul className="mt-2 space-y-1 text-sm text-cream-dim">
            {town.nearby.map((item) => (
              <li key={item.placeId}>
                {item.townCity} · {item.miles} miles · {item.fanCount}{" "}
                {item.fanCount === 1 ? "fan" : "fans"}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </article>
  );
}
