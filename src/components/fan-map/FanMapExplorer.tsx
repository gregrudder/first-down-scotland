"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";
import { DiscordCta } from "@/components/DiscordCta";
import { TeamLogo } from "@/components/TeamLogo";
import { Leaderboard } from "@/components/fan-map/Leaderboard";
import { SchemeBattles } from "@/components/fan-map/SchemeBattles";
import { TownPanel } from "@/components/fan-map/TownPanel";
import { teams } from "@/data/teams";
import { NATION_FILTERS, type NationFilterId } from "@/lib/fan-map/constants";
import type { PublicFanMap } from "@/lib/fan-map/types";

const FanMapCanvas = dynamic(
  () => import("@/components/fan-map/FanMapCanvas").then((mod) => mod.FanMapCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[min(70vh,34rem)] min-h-72 items-center justify-center rounded-2xl border border-line bg-navy-3 text-sm text-cream-dim">
        Loading the map…
      </div>
    ),
  },
);

export function FanMapExplorer({ data }: { data: PublicFanMap }) {
  const [nation, setNation] = useState<NationFilterId>("Scotland");
  const [team, setTeam] = useState<string>("ALL");
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [townsOpen, setTownsOpen] = useState(true);

  const selectedTeam = team === "ALL" ? undefined : teams.find((item) => item.abbreviation === team);

  const visibleTowns = useMemo(() => {
    return data.towns
      .filter((town) => (nation === "UK" ? true : town.nation === nation))
      .map((town) => {
        if (!selectedTeam) return town;
        const count = town.teams?.find((item) => item.abbreviation === selectedTeam.abbreviation)?.count;
        if (!count) return null;
        return { ...town, fanCount: count };
      })
      .filter((town): town is NonNullable<typeof town> => Boolean(town));
  }, [data.towns, nation, selectedTeam]);

  const selectedTown =
    visibleTowns.find((town) => town.placeId === selectedPlaceId) ??
    data.towns.find((town) => town.placeId === selectedPlaceId) ??
    null;

  const empty = data.counters.fans === 0;

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <Link
          href="/fan-map/add"
          className="inline-flex items-center justify-center rounded-full bg-gold px-6 py-3 text-sm font-semibold text-gold-ink hover:bg-gold-soft"
        >
          Put your team on the map
        </Link>
        <p className="text-sm text-cream-dim">
          Choose your team. Put your town on the map. Find your NFL community.
        </p>
      </div>

      <dl className="mt-8 grid gap-3 sm:grid-cols-3">
        <Counter label="Fans on the map" value={data.configured ? data.counters.fans : null} />
        <Counter label="Towns represented" value={data.configured ? data.counters.towns : null} />
        <Counter label="Teams represented" value={data.configured ? data.counters.teams : null} />
      </dl>

      {!data.configured ? (
        <p className="mt-4 rounded-2xl border border-dashed border-line bg-navy-2 px-4 py-3 text-sm leading-6 text-cream-dim">
          Live counts will appear here once the map database is connected. No demo fans.
        </p>
      ) : null}

      <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Nation filter">
        {NATION_FILTERS.map((item) => {
          const active = nation === item.id;
          const emphasised = item.id === "Scotland";
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setNation(item.id)}
              className={`rounded-full border px-3 py-1.5 text-sm ${
                active
                  ? "border-gold bg-gold text-gold-ink"
                  : emphasised
                    ? "border-gold/50 bg-navy-2 text-cream"
                    : "border-line bg-navy-2 text-cream-dim hover:border-gold/40"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <label className="mt-4 block">
        <span className="text-sm font-medium text-cream">Team filter</span>
        <select
          value={team}
          onChange={(event) => setTeam(event.target.value)}
          className="mt-2 w-full rounded-xl border border-line bg-navy-2 px-4 py-3 text-base text-cream sm:max-w-md"
        >
          <option value="ALL">All 32 teams</option>
          {teams
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name, "en-GB"))
            .map((item) => (
              <option key={item.abbreviation} value={item.abbreviation}>
                {item.name}
              </option>
            ))}
        </select>
      </label>

      {selectedTeam ? (
        <p className="mt-3 flex items-center gap-2 text-sm text-cream-dim">
          <TeamLogo team={selectedTeam} size={24} />
          Showing towns with {selectedTeam.shortName} fans. Team colours stay subtle.
        </p>
      ) : null}

      {empty ? (
        <div className="mt-8 rounded-2xl border border-dashed border-gold/40 bg-navy-2 p-6">
          <p className="text-xs font-semibold tracking-[0.16em] text-gold uppercase">
            Starting from zero
          </p>
          <h2 className="mt-2 font-display text-2xl text-cream">Help us build the map</h2>
          <p className="mt-3 text-sm leading-6 text-cream-dim">
            There are no fake demo users here. The first real registrations will light up
            Scottish towns (Wishaw, Motherwell, East Kilbride, Paisley, Dundee), then the
            rest of the UK.
          </p>
          <Link
            href="/fan-map/add"
            className="mt-5 inline-flex items-center justify-center rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-gold-ink hover:bg-gold-soft"
          >
            Be the first pin
          </Link>
        </div>
      ) : null}

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.8fr)]">
        <FanMapCanvas
          towns={visibleTowns}
          selectedPlaceId={selectedPlaceId}
          onSelect={(placeId) => {
            setSelectedPlaceId(placeId);
            setTownsOpen(true);
          }}
          nation={nation}
          teamColor={selectedTeam?.primary}
        />
        <div className="space-y-4">
          {selectedTown ? (
            <TownPanel town={selectedTown} privacyThreshold={data.privacyThreshold} />
          ) : (
            <div className="rounded-2xl border border-dashed border-line bg-navy-2 p-5">
              <p className="font-display text-xl text-cream">Town card</p>
              <p className="mt-2 text-sm leading-6 text-cream-dim">
                Tap a town on the map, or open the list if zooming on a phone is awkward.
                We never show names, emails, or individual pins.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-line bg-navy-2">
        <button
          type="button"
          className="flex w-full items-center justify-between px-5 py-4 text-left"
          onClick={() => setTownsOpen((open) => !open)}
          aria-expanded={townsOpen}
        >
          <span className="font-display text-xl text-cream">
            Towns on the map ({visibleTowns.length})
          </span>
          <span className="text-sm text-gold">{townsOpen ? "Hide" : "Show"}</span>
        </button>
        {townsOpen ? (
          <ul className="border-t border-line px-3 py-3">
            {visibleTowns.length === 0 ? (
              <li className="px-2 py-3 text-sm text-cream-dim">
                No towns match that filter yet.
              </li>
            ) : (
              visibleTowns.map((town) => (
                <li key={town.placeId}>
                  <button
                    type="button"
                    onClick={() => setSelectedPlaceId(town.placeId)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left hover:bg-navy-3 ${
                      selectedPlaceId === town.placeId ? "bg-navy-3" : ""
                    }`}
                  >
                    <span>
                      <span className="block text-sm font-medium text-cream">{town.townCity}</span>
                      <span className="block text-xs text-cream-dim">
                        {town.nation} · {town.regionOrCouncilArea}
                      </span>
                    </span>
                    <span className="text-sm text-cream-dim">{town.fanCount}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
        ) : null}
      </div>

      <SchemeBattles data={data} />

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <Leaderboard
          title="Scotland’s most supported"
          rows={data.leaderboards.scotland}
          empty="No Scottish registrations yet. Help us find out which team runs the scheme."
        />
        <Leaderboard
          title="UK’s most supported"
          rows={data.leaderboards.uk}
          empty="The UK table fills from the same real pins. No invented numbers."
        />
      </div>

      <p className="mt-8 text-sm leading-6 text-cream-dim">
        Privacy: we never publish names, emails, addresses, postcodes or GPS. The map
        uses town-centre points only. A town needs at least{" "}
        {data.privacyThreshold === 1 ? "1 fan" : `${data.privacyThreshold} fans`}{" "}
        before we show which teams they support. Smaller places still count in the totals,
        or roll up to the council area list used in admin.
      </p>

      <div className="mt-10">
        <DiscordCta />
      </div>
    </div>
  );
}

function Counter({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="rounded-2xl border border-line bg-navy-2 px-4 py-4">
      <dt className="text-xs font-semibold tracking-[0.16em] text-gold uppercase">{label}</dt>
      <dd className="mt-2 font-display text-3xl text-cream">
        {value === null ? "-" : value}
      </dd>
    </div>
  );
}
