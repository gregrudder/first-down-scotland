"use client";

import { useEffect, useMemo, useState } from "react";
import { TeamLogo } from "@/components/TeamLogo";
import { HOTSPOT_RADII_MILES } from "@/lib/fan-map/constants";
import { getTeam } from "@/data/teams";
import type { AdminPin, AdminStats, HotspotResult } from "@/lib/fan-map/types";

export function AdminFanMapClient({ adminConfigured }: { adminConfigured: boolean }) {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState("");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [hotspotTown, setHotspotTown] = useState("");
  const [hotspotMiles, setHotspotMiles] = useState<(typeof HOTSPOT_RADII_MILES)[number]>(15);
  const [hotspot, setHotspot] = useState<HotspotResult | null>(null);
  const [hotspotError, setHotspotError] = useState("");
  const [pinBusy, setPinBusy] = useState<string | null>(null);

  useEffect(() => {
    if (!adminConfigured) return;
    void loadStats();
  }, [adminConfigured]);

  async function login(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/admin/fan-map/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const json = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(json.error || "Could not sign in.");
        return;
      }
      setAuthed(true);
      await loadStats();
    } catch {
      setError("Could not sign in.");
    } finally {
      setLoading(false);
    }
  }

  async function loadStats() {
    const response = await fetch("/api/admin/fan-map");
    if (response.status === 401) {
      setAuthed(false);
      return;
    }
    if (!response.ok) {
      setError("Could not load stats.");
      return;
    }
    setStats((await response.json()) as AdminStats);
    setAuthed(true);
  }

  async function runHotspot(event: React.FormEvent) {
    event.preventDefault();
    setHotspotError("");
    if (!hotspotTown) {
      setHotspotError("Pick a town.");
      return;
    }
    const response = await fetch(
      `/api/admin/fan-map/hotspot?placeId=${encodeURIComponent(hotspotTown)}&miles=${hotspotMiles}`,
    );
    if (!response.ok) {
      const json = (await response.json()) as { error?: string };
      setHotspotError(json.error || "Hotspot failed.");
      setHotspot(null);
      return;
    }
    setHotspot((await response.json()) as HotspotResult);
  }

  async function moderatePin(pin: AdminPin, action: "hide" | "unhide" | "delete") {
    if (action === "delete") {
      const town = `${pin.townCity} (${pin.teamAbbreviation})`;
      if (!window.confirm(`Delete the ${town} pin? This cannot be undone.`)) return;
    }
    setPinBusy(`${pin.id}:${action}`);
    setError("");
    try {
      const response = await fetch("/api/admin/fan-map/pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: pin.id, action }),
      });
      const json = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(json.error || "Could not change that pin.");
        return;
      }
      await loadStats();
    } catch {
      setError("Could not change that pin.");
    } finally {
      setPinBusy(null);
    }
  }

  const townOptions = useMemo(
    () =>
      (stats?.byTown ?? [])
        .slice()
        .sort((a, b) => a.townCity.localeCompare(b.townCity, "en-GB")),
    [stats],
  );

  if (!adminConfigured) {
    return (
      <p className="rounded-2xl border border-dashed border-line bg-navy-2 px-4 py-4 text-sm leading-6 text-cream-dim">
        Set <code className="text-cream">FAN_MAP_ADMIN_SECRET</code> on the server to open
        this page. It is not in the public nav.
      </p>
    );
  }

  if (!authed || !stats) {
    return (
      <form onSubmit={(event) => void login(event)} className="max-w-md rounded-2xl border border-line bg-navy-2 p-5">
        <p className="text-sm leading-6 text-cream-dim">
          Password matches <code className="text-cream">FAN_MAP_ADMIN_SECRET</code>.
        </p>
        <label className="mt-4 block">
          <span className="text-sm font-medium text-cream">Admin password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-xl border border-line bg-navy px-4 py-3 text-base text-cream"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="mt-4 inline-flex rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-gold-ink hover:bg-gold-soft"
        >
          {loading ? "Checking…" : "Open analytics"}
        </button>
        {error ? <p className="mt-3 text-sm text-live">{error}</p> : null}
      </form>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap gap-3">
        <a
          href="/api/admin/fan-map/export"
          className="inline-flex rounded-full border border-line px-4 py-2 text-sm text-cream hover:border-gold/50"
        >
          Download CSV aggregates
        </a>
        <button
          type="button"
          onClick={() => void loadStats()}
          className="inline-flex rounded-full border border-line px-4 py-2 text-sm text-cream hover:border-gold/50"
        >
          Refresh
        </button>
      </div>

      <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Fans" value={stats.totals.fans} />
        <Stat label="Towns" value={stats.totals.towns} />
        <Stat label="Teams" value={stats.totals.teams} />
        <Stat label="Hidden pins" value={stats.totals.hidden} />
        <Stat label="Councils" value={stats.totals.councils} />
        <Stat label="New today" value={stats.growth.today} />
        <Stat label="New this week" value={stats.growth.week} />
        <Stat label="New this month" value={stats.growth.month} />
        <Stat label="Watch-party yes" value={stats.totals.watchPartyYes} />
      </dl>

      <p className="text-sm leading-6 text-cream-dim">
        Privacy rule: public per-team town breakdowns need at least {stats.privacyThreshold}{" "}
        registrations in that town. Admin tables can show team splits for content planning,
        but still never export emails or names.
      </p>

      <section>
        <h2 className="font-display text-2xl text-cream">Moderate pins</h2>
        <p className="mt-2 text-sm leading-6 text-cream-dim">
          Hide a stuffed row from the public map, or delete it. Hidden pins stay
          off the aggregates until you show them again. No emails or cookie ids.
        </p>
        {stats.pins.length === 0 ? (
          <p className="mt-3 text-sm text-cream-dim">No pins yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="text-cream-dim">
                  {["Team", "Town", "Nation", "Added", "Status", ""].map((header) => (
                    <th key={header} className="border-b border-line px-2 py-2 font-medium">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.pins.map((pin) => {
                  const team = getTeam(pin.teamAbbreviation);
                  return (
                    <tr key={pin.id} className="text-cream">
                      <td className="border-b border-line/70 px-2 py-2">
                        {team?.shortName ?? pin.teamAbbreviation}
                      </td>
                      <td className="border-b border-line/70 px-2 py-2">{pin.townCity}</td>
                      <td className="border-b border-line/70 px-2 py-2">{pin.nation}</td>
                      <td className="border-b border-line/70 px-2 py-2">
                        {pin.createdAt.slice(0, 10)}
                      </td>
                      <td className="border-b border-line/70 px-2 py-2">
                        {pin.hidden ? "Hidden" : "Live"}
                      </td>
                      <td className="border-b border-line/70 px-2 py-2">
                        <div className="flex flex-wrap gap-2">
                          {pin.hidden ? (
                            <button
                              type="button"
                              disabled={pinBusy === `${pin.id}:unhide`}
                              onClick={() => void moderatePin(pin, "unhide")}
                              className="rounded-full border border-line px-3 py-1 text-xs text-cream hover:border-gold/50"
                            >
                              Show
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled={pinBusy === `${pin.id}:hide`}
                              onClick={() => void moderatePin(pin, "hide")}
                              className="rounded-full border border-line px-3 py-1 text-xs text-cream hover:border-gold/50"
                            >
                              Hide
                            </button>
                          )}
                          <button
                            type="button"
                            disabled={pinBusy === `${pin.id}:delete`}
                            onClick={() => void moderatePin(pin, "delete")}
                            className="rounded-full border border-live/40 px-3 py-1 text-xs text-live hover:border-live"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h2 className="font-display text-2xl text-cream">Largest communities</h2>
        <Table
          headers={["Town", "Nation", "Fans"]}
          rows={stats.largestCommunities.map((town) => [
            town.townCity,
            town.nation,
            String(town.fanCount),
          ])}
        />
      </section>

      <section>
        <h2 className="font-display text-2xl text-cream">By team</h2>
        <ul className="mt-4 space-y-2">
          {stats.byTeam.map((team) => (
            <li key={team.abbreviation} className="flex items-center gap-3 text-sm">
              <TeamLogo team={team} size={28} />
              <span className="flex-1 text-cream">{team.name}</span>
              <span className="text-cream-dim">
                {team.count} · {team.percent}%
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl text-cream">By nation</h2>
          <Table
            headers={["Nation", "Fans", "Towns"]}
            rows={stats.byNation.map((row) => [row.nation, String(row.fans), String(row.towns)])}
          />
        </div>
        <div>
          <h2 className="font-display text-2xl text-cream">By council / region</h2>
          <Table
            headers={["Area", "Nation", "Fans", "Towns"]}
            rows={stats.byCouncil.map((row) => [
              row.regionOrCouncilArea,
              row.nation,
              String(row.fanCount),
              String(row.townCount),
            ])}
          />
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl text-cream">By town</h2>
        <Table
          headers={["Town", "Nation", "Council", "Fans"]}
          rows={stats.byTown.map((row) => [
            row.townCity,
            row.nation,
            row.regionOrCouncilArea,
            String(row.fanCount),
          ])}
        />
      </section>

      <section>
        <h2 className="font-display text-2xl text-cream">Watch-party interest</h2>
        <p className="mt-2 text-sm text-cream-dim">
          Yes {stats.totals.watchPartyYes} · Maybe {stats.totals.watchPartyMaybe} · No{" "}
          {stats.totals.watchPartyNo} · Unset {stats.totals.watchPartyUnset}
        </p>
      </section>

      <section>
        <h2 className="font-display text-2xl text-cream">Growth (30 days)</h2>
        <Table
          headers={["Date", "New fans"]}
          rows={stats.growth.byDay.map((day) => [day.date, String(day.count)])}
        />
      </section>

      <section className="rounded-2xl border border-line bg-navy-2 p-5">
        <h2 className="font-display text-2xl text-cream">Hotspot radius</h2>
        <p className="mt-2 text-sm leading-6 text-cream-dim">
          Count fans whose <em>town centres</em> sit within 5, 10, 15, 20 or 25 miles of a
          chosen town. This is not home GPS.
        </p>
        <form onSubmit={(event) => void runHotspot(event)} className="mt-4 grid gap-3 sm:grid-cols-[1fr_8rem_auto]">
          <select
            value={hotspotTown}
            onChange={(event) => setHotspotTown(event.target.value)}
            className="rounded-xl border border-line bg-navy px-3 py-3 text-sm text-cream"
          >
            <option value="">Choose a town</option>
            {townOptions.map((town) => (
              <option key={town.placeId} value={town.placeId}>
                {town.townCity} ({town.nation})
              </option>
            ))}
          </select>
          <select
            value={hotspotMiles}
            onChange={(event) =>
              setHotspotMiles(Number(event.target.value) as (typeof HOTSPOT_RADII_MILES)[number])
            }
            className="rounded-xl border border-line bg-navy px-3 py-3 text-sm text-cream"
          >
            {HOTSPOT_RADII_MILES.map((miles) => (
              <option key={miles} value={miles}>
                {miles} miles
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-full bg-gold px-5 py-3 text-sm font-semibold text-gold-ink hover:bg-gold-soft"
          >
            Analyse
          </button>
        </form>
        {hotspotError ? <p className="mt-3 text-sm text-live">{hotspotError}</p> : null}
        {hotspot ? (
          <div className="mt-5">
            <p className="text-sm text-cream">
              {hotspot.fans} fans in {hotspot.towns} towns within {hotspot.miles} miles of{" "}
              {hotspot.centre.townCity}.
            </p>
            <ul className="mt-3 space-y-2">
              {hotspot.teams.map((team) => (
                <li key={team.abbreviation} className="flex items-center gap-3 text-sm">
                  <TeamLogo team={team} size={24} />
                  <span className="flex-1 text-cream">{team.shortName}</span>
                  <span className="text-cream-dim">
                    {team.count} · {team.percent}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-line bg-navy-2 px-4 py-3">
      <dt className="text-xs font-semibold tracking-[0.16em] text-gold uppercase">{label}</dt>
      <dd className="mt-1 font-display text-2xl text-cream">{value}</dd>
    </div>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  if (rows.length === 0) {
    return <p className="mt-3 text-sm text-cream-dim">Nothing here yet.</p>;
  }
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="text-cream-dim">
            {headers.map((header) => (
              <th key={header} className="border-b border-line px-2 py-2 font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${row[0]}-${index}`} className="text-cream">
              {row.map((cell, cellIndex) => (
                <td key={`${cell}-${cellIndex}`} className="border-b border-line/70 px-2 py-2">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
