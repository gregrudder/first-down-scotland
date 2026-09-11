"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { TeamLogo } from "@/components/TeamLogo";
import { useFavouriteTeam } from "@/components/useFavouriteTeam";
import { teams, type NflTeam } from "@/data/teams";
import { WATCH_PARTY, YEARS_FOLLOWING } from "@/lib/fan-map/constants";
import type { FanMapMe, FanMapPlace } from "@/lib/fan-map/types";

function matches(team: NflTeam, needle: string): boolean {
  const hay = `${team.name} ${team.shortName} ${team.city} ${team.abbreviation}`.toLowerCase();
  return hay.includes(needle);
}

export function AddYourselfForm({
  initialMe,
  turnstileSiteKey,
}: {
  initialMe: FanMapMe;
  turnstileSiteKey?: string;
}) {
  const [me, setMe] = useState(initialMe);
  const favourite = useFavouriteTeam();
  const [teamQuery, setTeamQuery] = useState("");
  const [teamAbbr, setTeamAbbr] = useState(initialMe.registration?.teamAbbreviation ?? "");
  const selectedTeam = teamAbbr || favourite.team?.abbreviation || "";
  const [townQuery, setTownQuery] = useState(initialMe.registration?.placeLabel ?? "");
  const [places, setPlaces] = useState<FanMapPlace[]>([]);
  const [place, setPlace] = useState<FanMapPlace | null>(
    initialMe.registration
      ? {
          placeId: initialMe.registration.placeId,
          label: initialMe.registration.placeLabel,
          country: initialMe.registration.country,
          nation: initialMe.registration.nation,
          regionOrCouncilArea: initialMe.registration.regionOrCouncilArea,
          townCity: initialMe.registration.townCity,
          latitude: initialMe.registration.latitude,
          longitude: initialMe.registration.longitude,
        }
      : null,
  );
  const [searching, setSearching] = useState(false);
  const [years, setYears] = useState(initialMe.registration?.yearsFollowing ?? "");
  const [watch, setWatch] = useState(initialMe.registration?.watchPartyInterest ?? "");
  const [honeypot, setHoneypot] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitOk, setSubmitOk] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!turnstileSiteKey) return;
    const existing = document.querySelector<HTMLScriptElement>("script[data-fds-turnstile]");
    if (existing) return;
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.dataset.fdsTurnstile = "1";
    document.head.appendChild(script);
  }, [turnstileSiteKey]);

  const townNeedle = townQuery.trim();
  const shouldSearchTowns = townNeedle.length >= 2 && place?.label !== townQuery;

  useEffect(() => {
    if (!shouldSearchTowns) return;
    const handle = window.setTimeout(() => {
      setSearching(true);
      void fetch(`/api/fan-map/geocode?q=${encodeURIComponent(townNeedle)}`)
        .then((response) => response.json())
        .then((json: { places?: FanMapPlace[] }) => setPlaces(json.places ?? []))
        .catch(() => setPlaces([]))
        .finally(() => setSearching(false));
    }, 280);
    return () => window.clearTimeout(handle);
  }, [shouldSearchTowns, townNeedle]);

  const townResults = shouldSearchTowns ? places : [];

  const filteredTeams = useMemo(() => {
    const needle = teamQuery.trim().toLowerCase();
    const list = needle ? teams.filter((team) => matches(team, needle)) : teams;
    return [...list].sort((a, b) => a.name.localeCompare(b.name, "en-GB"));
  }, [teamQuery]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitError("");
    setSubmitOk(false);
    if (!selectedTeam) {
      setSubmitError("Pick an NFL team.");
      return;
    }
    if (!place) {
      setSubmitError("Pick a town from the search results — not a typed address.");
      return;
    }
    const turnstileToken =
      document.querySelector<HTMLInputElement>('[name="cf-turnstile-response"]')?.value ?? "";
    setSubmitting(true);
    try {
      const response = await fetch("/api/fan-map/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamAbbreviation: selectedTeam,
          place,
          yearsFollowing: years || undefined,
          watchPartyInterest: watch || undefined,
          turnstileToken: turnstileToken || undefined,
          website: honeypot,
        }),
      });
      const json = (await response.json()) as { error?: string };
      if (!response.ok) {
        setSubmitError(json.error || "Could not save that.");
        return;
      }
      setSubmitOk(true);
      const next = (await fetch("/api/fan-map/me").then((res) => res.json())) as FanMapMe;
      setMe(next);
    } catch {
      setSubmitError("Could not save that.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={(event) => void submit(event)} className="space-y-8">
      {me.registration ? (
        <p className="rounded-xl border border-good/40 bg-navy-2 px-4 py-3 text-sm text-cream">
          This browser already has a pin. Submit again to move it or switch sides.
          One pin per browser — no account.
        </p>
      ) : (
        <p className="rounded-xl border border-line bg-navy-2 px-4 py-3 text-sm leading-6 text-cream-dim">
          No sign-up. We keep one pin on this browser with a signed cookie, plus a
          captcha and a rate limit so the map cannot be stuffed.
        </p>
      )}

      <label className="absolute -left-[9999px] h-px w-px overflow-hidden">
        Website
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
        />
      </label>

      <section>
        <p className="text-xs font-semibold tracking-[0.16em] text-gold uppercase">
          Step 1 · Which NFL team?
        </p>
        <h2 className="mt-2 font-display text-2xl text-cream">All 32 clubs</h2>
        <p className="mt-2 text-sm leading-6 text-cream-dim">
          We pre-fill from the team saved on this device if you have one. Not sure yet?{" "}
          <Link href="/pick-your-team" className="text-gold">
            I haven’t picked a team yet
          </Link>
          .
        </p>
        <label className="mt-4 block">
          <span className="text-sm font-medium text-cream">Search the 32</span>
          <input
            type="search"
            value={teamQuery}
            onChange={(event) => setTeamQuery(event.target.value)}
            placeholder="Steelers, Seattle, NFC…"
            className="mt-2 w-full rounded-xl border border-line bg-navy-2 px-4 py-3 text-base text-cream placeholder:text-cream-dim/70"
          />
        </label>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {filteredTeams.map((item) => {
            const selected = item.abbreviation === selectedTeam;
            return (
              <li key={item.abbreviation}>
                <button
                  type="button"
                  onClick={() => setTeamAbbr(item.abbreviation)}
                  className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left ${
                    selected ? "border-gold/60 bg-navy-3" : "border-line bg-navy-2 hover:border-gold/40"
                  }`}
                >
                  <TeamLogo team={item} size={36} />
                  <span>
                    <span className="block text-sm font-medium text-cream">{item.name}</span>
                    <span className="block text-xs text-cream-dim">{item.abbreviation}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <p className="text-xs font-semibold tracking-[0.16em] text-gold uppercase">
          Step 2 · Your town
        </p>
        <h2 className="mt-2 font-display text-2xl text-cream">Search a UK town or city</h2>
        <p className="mt-2 text-sm leading-6 text-cream-dim">
          Pick a result. We store the town centre only — no postcode, no GPS, no street.
        </p>
        <label className="mt-4 block">
          <span className="text-sm font-medium text-cream">Town or city</span>
          <input
            type="search"
            value={townQuery}
            onChange={(event) => {
              setTownQuery(event.target.value);
              setPlace(null);
            }}
            placeholder="Wishaw, Motherwell, Dundee…"
            autoComplete="off"
            className="mt-2 w-full rounded-xl border border-line bg-navy-2 px-4 py-3 text-base text-cream placeholder:text-cream-dim/70"
          />
        </label>
        {searching ? <p className="mt-2 text-sm text-cream-dim">Searching UK towns…</p> : null}
        {townResults.length > 0 ? (
          <ul className="mt-3 space-y-2">
            {townResults.map((item) => (
              <li key={item.placeId}>
                <button
                  type="button"
                  onClick={() => {
                    setPlace(item);
                    setTownQuery(item.label);
                    setPlaces([]);
                  }}
                  className="w-full rounded-xl border border-line bg-navy-2 px-4 py-3 text-left hover:border-gold/40"
                >
                  <span className="block text-sm text-cream">{item.townCity}</span>
                  <span className="block text-xs text-cream-dim">
                    {item.regionOrCouncilArea} · {item.nation}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : null}
        {place ? (
          <p className="mt-3 text-sm text-cream">
            Selected: {place.townCity}, {place.regionOrCouncilArea}, {place.nation}
          </p>
        ) : null}
      </section>

      <section className="grid gap-6 sm:grid-cols-2">
        <fieldset>
          <legend className="text-sm font-medium text-cream">Years following the NFL (optional)</legend>
          <div className="mt-3 space-y-2">
            {YEARS_FOLLOWING.map((option) => (
              <label key={option.id} className="flex items-center gap-2 text-sm text-cream-dim">
                <input
                  type="radio"
                  name="years"
                  value={option.id}
                  checked={years === option.id}
                  onChange={() => setYears(option.id)}
                />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="text-sm font-medium text-cream">Watch-party interest (optional)</legend>
          <div className="mt-3 space-y-2">
            {WATCH_PARTY.map((option) => (
              <label key={option.id} className="flex items-center gap-2 text-sm text-cream-dim">
                <input
                  type="radio"
                  name="watch"
                  value={option.id}
                  checked={watch === option.id}
                  onChange={() => setWatch(option.id)}
                />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>
      </section>

      {turnstileSiteKey ? (
        <div className="cf-turnstile" data-sitekey={turnstileSiteKey} data-theme="dark" />
      ) : (
        <p className="text-xs text-cream-dim">
          Captcha is optional in local dev. Production should set Turnstile keys.
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center rounded-full bg-gold px-6 py-3 text-sm font-semibold text-gold-ink hover:bg-gold-soft disabled:opacity-60"
        >
          {submitting
            ? "Saving…"
            : me.registration
              ? "Update my pin"
              : "Put my team on the map"}
        </button>
        {submitOk ? (
          <p className="mt-3 text-sm text-good">
            You are on the map.{" "}
            <Link href="/fan-map#scheme-battles" className="text-gold">
              See Scheme Battles
            </Link>
            .
          </p>
        ) : null}
        {submitError ? <p className="mt-3 text-sm text-live">{submitError}</p> : null}
      </div>
    </form>
  );
}
