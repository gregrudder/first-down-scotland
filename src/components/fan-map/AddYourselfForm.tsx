"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { TeamLogo } from "@/components/TeamLogo";
import { teams, type NflTeam } from "@/data/teams";
import { WATCH_PARTY, YEARS_FOLLOWING } from "@/lib/fan-map/constants";
import { readSavedTeam } from "@/lib/team-storage";
import type { FanMapMe, FanMapPlace } from "@/lib/fan-map/types";

function matches(team: NflTeam, needle: string): boolean {
  const hay = `${team.name} ${team.shortName} ${team.city} ${team.abbreviation}`.toLowerCase();
  return hay.includes(needle);
}

export function AddYourselfForm({
  initialMe,
  signedIn,
  linkError,
}: {
  initialMe: FanMapMe;
  signedIn: boolean;
  linkError: "expired" | "link" | null;
}) {
  const [me, setMe] = useState(initialMe);
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [emailError, setEmailError] = useState("");
  const [devLink, setDevLink] = useState<string | null>(null);
  const [teamQuery, setTeamQuery] = useState("");
  const [teamAbbr, setTeamAbbr] = useState(initialMe.registration?.teamAbbreviation ?? "");
  const [townQuery, setTownQuery] = useState("");
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
  const [submitError, setSubmitError] = useState("");
  const [submitOk, setSubmitOk] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (teamAbbr || initialMe.registration) return;
    const saved = readSavedTeam()?.abbreviation;
    if (saved) setTeamAbbr(saved);
  }, [initialMe.registration, teamAbbr]);

  useEffect(() => {
    if (!signedIn) return;
    void fetch("/api/fan-map/me")
      .then((response) => response.json())
      .then((next: FanMapMe) => setMe(next))
      .catch(() => undefined);
  }, [signedIn]);

  useEffect(() => {
    const q = townQuery.trim();
    if (q.length < 2 || place?.label === townQuery) {
      setPlaces([]);
      return;
    }
    const handle = window.setTimeout(() => {
      setSearching(true);
      void fetch(`/api/fan-map/geocode?q=${encodeURIComponent(q)}`)
        .then((response) => response.json())
        .then((json: { places?: FanMapPlace[] }) => setPlaces(json.places ?? []))
        .catch(() => setPlaces([]))
        .finally(() => setSearching(false));
    }, 280);
    return () => window.clearTimeout(handle);
  }, [place?.label, townQuery]);

  const filteredTeams = useMemo(() => {
    const needle = teamQuery.trim().toLowerCase();
    const list = needle ? teams.filter((team) => matches(team, needle)) : teams;
    return [...list].sort((a, b) => a.name.localeCompare(b.name, "en-GB"));
  }, [teamQuery]);

  async function sendLink(event: React.FormEvent) {
    event.preventDefault();
    setEmailStatus("sending");
    setEmailError("");
    setDevLink(null);
    try {
      const response = await fetch("/api/fan-map/auth/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = (await response.json()) as { error?: string; devLink?: string };
      if (!response.ok) {
        setEmailStatus("error");
        setEmailError(json.error || "Could not send that email.");
        return;
      }
      setEmailStatus("sent");
      setDevLink(json.devLink ?? null);
    } catch {
      setEmailStatus("error");
      setEmailError("Could not send that email.");
    }
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitError("");
    setSubmitOk(false);
    if (!teamAbbr) {
      setSubmitError("Pick an NFL team.");
      return;
    }
    if (!place) {
      setSubmitError("Pick a town from the search results — not a typed address.");
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch("/api/fan-map/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamAbbreviation: teamAbbr,
          place,
          yearsFollowing: years || undefined,
          watchPartyInterest: watch || undefined,
        }),
      });
      const json = (await response.json()) as { error?: string };
      if (!response.ok) {
        setSubmitError(json.error || "Could not save that.");
        return;
      }
      setSubmitOk(true);
    } catch {
      setSubmitError("Could not save that.");
    } finally {
      setSubmitting(false);
    }
  }

  async function logout() {
    await fetch("/api/fan-map/auth/logout", { method: "POST" });
    setMe({ ...me, session: null, registration: null });
    setSubmitOk(false);
  }

  return (
    <div className="space-y-10">
      {linkError === "expired" ? (
        <p className="rounded-xl border border-live/40 bg-navy-2 px-4 py-3 text-sm text-cream">
          That sign-in link has expired or already been used. Ask for a new one.
        </p>
      ) : null}
      {linkError === "link" ? (
        <p className="rounded-xl border border-live/40 bg-navy-2 px-4 py-3 text-sm text-cream">
          That sign-in link was missing a token. Request a fresh email.
        </p>
      ) : null}
      {signedIn && me.session ? (
        <p className="rounded-xl border border-good/40 bg-navy-2 px-4 py-3 text-sm text-cream">
          Signed in as {me.session.email}. One pin per person — you can update it any time.
        </p>
      ) : null}

      {!me.session ? (
        <form onSubmit={sendLink} className="rounded-2xl border border-line bg-navy-2 p-5">
          <p className="text-xs font-semibold tracking-[0.16em] text-gold uppercase">
            Step 1 · Confirm your email
          </p>
          <h2 className="mt-2 font-display text-2xl text-cream">No passwords. One pin each.</h2>
          <p className="mt-2 text-sm leading-6 text-cream-dim">
            We send a magic link so someone cannot stuff the map from this browser.
            Your email never appears on the public map.
          </p>
          <label className="mt-5 block">
            <span className="text-sm font-medium text-cream">Email</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-xl border border-line bg-navy px-4 py-3 text-base text-cream"
            />
          </label>
          <button
            type="submit"
            disabled={emailStatus === "sending"}
            className="mt-4 inline-flex items-center justify-center rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-gold-ink hover:bg-gold-soft disabled:opacity-60"
          >
            {emailStatus === "sending" ? "Sending…" : "Email me a link"}
          </button>
          {emailStatus === "sent" ? (
            <p className="mt-3 text-sm leading-6 text-cream-dim">
              Check your inbox. The link expires in 30 minutes.
              {devLink ? (
                <>
                  {" "}
                  Local dev link:{" "}
                  <a href={devLink} className="text-gold">
                    open sign-in
                  </a>
                  .
                </>
              ) : null}
            </p>
          ) : null}
          {emailError ? <p className="mt-3 text-sm text-live">{emailError}</p> : null}
        </form>
      ) : (
        <p className="text-sm text-cream-dim">
          Signed in as {me.session.email}.{" "}
          <button type="button" onClick={() => void logout()} className="text-gold">
            Use a different email
          </button>
        </p>
      )}

      <form onSubmit={(event) => void submit(event)} className="space-y-8">
        <section>
          <p className="text-xs font-semibold tracking-[0.16em] text-gold uppercase">
            Step 2 · Which NFL team?
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
              const selected = item.abbreviation === teamAbbr;
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
            Step 3 · Your town
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
          {places.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {places.map((item) => (
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

        <div>
          <button
            type="submit"
            disabled={!me.session || submitting}
            className="inline-flex items-center justify-center rounded-full bg-gold px-6 py-3 text-sm font-semibold text-gold-ink hover:bg-gold-soft disabled:opacity-60"
          >
            {submitting
              ? "Saving…"
              : me.registration
                ? "Update my pin"
                : "Put my team on the map"}
          </button>
          {!me.session ? (
            <p className="mt-3 text-sm text-cream-dim">Confirm your email first.</p>
          ) : null}
          {submitOk ? (
            <p className="mt-3 text-sm text-good">
              You are on the map.{" "}
              <Link href="/fan-map" className="text-gold">
                See the fan map
              </Link>
              .
            </p>
          ) : null}
          {submitError ? <p className="mt-3 text-sm text-live">{submitError}</p> : null}
        </div>
      </form>
    </div>
  );
}
