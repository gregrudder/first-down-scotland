"use client";

import { useEffect, useMemo, useState } from "react";
import {
  favouriteOptions,
  FEEDBACK_LIMITS,
  foundOptions,
  payOptions,
  recommendOptions,
  type FeedbackPayload,
} from "@/data/feedback";
import { readSavedTeam } from "@/lib/team-storage";
import { teams } from "@/data/teams";

const fieldClass =
  "w-full rounded-2xl border border-line bg-navy-2 px-4 py-3 text-base text-cream placeholder:text-cream-dim/70";
const labelClass = "block text-sm font-semibold text-cream";
const hintClass = "mt-1 text-sm leading-6 text-cream-dim";

function ChoiceGroup({
  legend,
  hint,
  name,
  value,
  onChange,
  options,
}: {
  legend: string;
  hint?: string;
  name: string;
  value: string;
  onChange: (id: string) => void;
  options: readonly { id: string; label: string }[];
}) {
  return (
    <fieldset>
      <legend className={labelClass}>{legend}</legend>
      {hint ? <p className={hintClass}>{hint}</p> : null}
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const selected = value === option.id;
          return (
            <label
              key={option.id}
              className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm leading-6 ${
                selected ? "border-gold/60 bg-navy-3 text-cream" : "border-line bg-navy-2 text-cream-dim"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={option.id}
                checked={selected}
                onChange={() => onChange(option.id)}
                className="accent-gold"
              />
              {option.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function FeedbackForm() {
  const [startedAt] = useState(() => Date.now());
  const [found, setFound] = useState("");
  const [foundOther, setFoundOther] = useState("");
  const [favourite, setFavourite] = useState("");
  const [favouriteOther, setFavouriteOther] = useState("");
  const [confusing, setConfusing] = useState("");
  const [broken, setBroken] = useState("");
  const [pay, setPay] = useState("");
  const [worthIt, setWorthIt] = useState("");
  const [suggest, setSuggest] = useState("");
  const [elseText, setElseText] = useState("");
  const [name, setName] = useState("");
  const [team, setTeam] = useState("");
  const [recommend, setRecommend] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = readSavedTeam();
    if (saved?.abbreviation) setTeam(saved.abbreviation);
  }, []);

  const showWorthIt = pay === "maybe" || pay === "no";
  const teamOptions = useMemo(
    () => [...teams].sort((a, b) => a.name.localeCompare(b.name, "en-GB")),
    [],
  );

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (!found || !favourite || !pay) {
      setError("Need how you found us, a favourite bit, and the £2 question.");
      return;
    }

    const payload: FeedbackPayload = {
      found: found as FeedbackPayload["found"],
      foundOther: found === "other" ? foundOther : undefined,
      favourite: favourite as FeedbackPayload["favourite"],
      favouriteOther: favourite === "other" ? favouriteOther : undefined,
      confusing,
      broken,
      pay: pay as FeedbackPayload["pay"],
      worthIt: showWorthIt ? worthIt : undefined,
      suggest,
      else: elseText,
      name,
      team: team || undefined,
      recommend: (recommend || undefined) as FeedbackPayload["recommend"] | undefined,
      startedAt,
      website,
    };

    setStatus("sending");
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        setStatus("error");
        setError(data.error || "Could not send that just now.");
        return;
      }
      setStatus("sent");
    } catch {
      setStatus("error");
      setError("Could not send that just now. Check your connection and try again.");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-gold/40 bg-navy-2 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">Received</p>
        <h2 className="mt-2 font-display text-2xl text-cream">That’s in the inbox.</h2>
        <p className="mt-3 text-base leading-7 text-cream-dim">
          Thanks. A short note from a real Sunday is worth more than a long survey.
          Back to the lessons, or to Community, when you like.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative space-y-8" noValidate>
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
        <label>
          Website
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
          />
        </label>
      </div>

      <ChoiceGroup
        legend="How did you find the app?"
        name="found"
        value={found}
        onChange={setFound}
        options={foundOptions}
      />
      {found === "other" ? (
        <label className="block">
          <span className={labelClass}>Where, if you remember?</span>
          <input
            className={`mt-2 ${fieldClass}`}
            value={foundOther}
            onChange={(event) => setFoundOther(event.target.value)}
            maxLength={FEEDBACK_LIMITS.short}
          />
        </label>
      ) : null}

      <ChoiceGroup
        legend="Favourite bit so far?"
        name="favourite"
        value={favourite}
        onChange={setFavourite}
        options={favouriteOptions}
      />
      {favourite === "other" ? (
        <label className="block">
          <span className={labelClass}>Which bit?</span>
          <input
            className={`mt-2 ${fieldClass}`}
            value={favouriteOther}
            onChange={(event) => setFavouriteOther(event.target.value)}
            maxLength={FEEDBACK_LIMITS.short}
          />
        </label>
      ) : null}

      <label className="block">
        <span className={labelClass}>Most confusing bit?</span>
        <p className={hintClass}>A word, a page, a diagram. Whatever made you pause.</p>
        <textarea
          className={`mt-2 min-h-28 ${fieldClass}`}
          value={confusing}
          onChange={(event) => setConfusing(event.target.value)}
          maxLength={FEEDBACK_LIMITS.text}
        />
      </label>

      <label className="block">
        <span className={labelClass}>Anything broken?</span>
        <p className={hintClass}>What you tried, and what happened. Phone model helps if a tap failed.</p>
        <textarea
          className={`mt-2 min-h-28 ${fieldClass}`}
          value={broken}
          onChange={(event) => setBroken(event.target.value)}
          maxLength={FEEDBACK_LIMITS.text}
        />
      </label>

      <ChoiceGroup
        legend="Would you pay £2 a month for First Down Scotland?"
        hint="Not just lessons and a chat room. The full thing: learn the game; meet fans of your team (Discord and pub meetups); and a one-stop shop for that club (news, fantasy, podcasts, roster and depth, where to watch, the Sunday card, plus previews and reports)."
        name="pay"
        value={pay}
        onChange={setPay}
        options={payOptions}
      />
      {showWorthIt ? (
        <label className="block">
          <span className={labelClass}>What would make £2 worth it?</span>
          <textarea
            className={`mt-2 min-h-24 ${fieldClass}`}
            value={worthIt}
            onChange={(event) => setWorthIt(event.target.value)}
            maxLength={FEEDBACK_LIMITS.text}
          />
        </label>
      ) : null}

      <label className="block">
        <span className={labelClass}>
          Suggest a feature <span className="font-normal text-cream-dim">(optional)</span>
        </span>
        <p className={hintClass}>
          A page, a tool, a pub town we have missed, a lesson you wish existed. Wish-list is
          welcome.
        </p>
        <textarea
          className={`mt-2 min-h-28 ${fieldClass}`}
          value={suggest}
          onChange={(event) => setSuggest(event.target.value)}
          maxLength={FEEDBACK_LIMITS.text}
        />
      </label>

      <label className="block">
        <span className={labelClass}>Anything else? <span className="font-normal text-cream-dim">(optional)</span></span>
        <textarea
          className={`mt-2 min-h-24 ${fieldClass}`}
          value={elseText}
          onChange={(event) => setElseText(event.target.value)}
          maxLength={FEEDBACK_LIMITS.text}
        />
      </label>

      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className={labelClass}>Name <span className="font-normal text-cream-dim">(optional)</span></span>
          <input
            className={`mt-2 ${fieldClass}`}
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={FEEDBACK_LIMITS.name}
            autoComplete="name"
          />
        </label>
        <label className="block">
          <span className={labelClass}>Team you picked <span className="font-normal text-cream-dim">(optional)</span></span>
          <select
            className={`mt-2 ${fieldClass}`}
            value={team}
            onChange={(event) => setTeam(event.target.value)}
          >
            <option value="">Not picked / skip</option>
            {teamOptions.map((entry) => (
              <option key={entry.abbreviation} value={entry.abbreviation}>
                {entry.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <ChoiceGroup
        legend="Would you recommend this to a mate who is new to the NFL?"
        name="recommend"
        value={recommend}
        onChange={setRecommend}
        options={recommendOptions}
      />

      {error ? <p className="text-sm leading-6 text-live">{error}</p> : null}

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex w-full items-center justify-center rounded-full bg-gold px-6 py-3 text-sm font-semibold text-gold-ink hover:bg-gold-soft disabled:opacity-60 sm:w-auto"
      >
        {status === "sending" ? "Sending…" : "Send feedback"}
      </button>
    </form>
  );
}
