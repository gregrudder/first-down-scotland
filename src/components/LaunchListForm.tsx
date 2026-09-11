"use client";

import { useState } from "react";
import { LAUNCH_EMAIL_MAX, type LaunchSource } from "@/data/launch";
import { readSavedTeam } from "@/lib/team-storage";

const fieldClass =
  "w-full rounded-2xl border border-line bg-navy px-4 py-3 text-base text-cream placeholder:text-cream-dim/70";

export function LaunchListForm({
  source,
  compact = false,
}: {
  source: LaunchSource;
  compact?: boolean;
}) {
  const [startedAt] = useState(() => Date.now());
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    const trimmed = email.trim();
    if (!trimmed) {
      setError("Need an email address.");
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch("/api/launch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmed,
          source,
          team: readSavedTeam()?.abbreviation,
          startedAt,
          website,
        }),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        setStatus("error");
        setError(data.error || "Could not join the list just now.");
        return;
      }
      setStatus("sent");
    } catch {
      setStatus("error");
      setError("Could not join the list just now. Check your connection and try again.");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-gold/40 bg-navy-2 p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">Launch list</p>
        <h2 className="mt-2 font-display text-2xl text-cream">You are on the list.</h2>
        <p className="mt-3 text-sm leading-6 text-cream-dim sm:text-base sm:leading-7">
          Thanks. We will write when Founding extras go live. Discord is already
          open on Community. Lessons, fixtures and your club pages stay here
          either way. Have a look round.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className={`relative rounded-2xl border border-gold/30 bg-navy-2 ${compact ? "p-5" : "p-5 sm:p-6"}`}
      noValidate
    >
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

      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">Launch list</p>
      <h2 className={`mt-2 font-display text-cream ${compact ? "text-2xl" : "text-2xl sm:text-3xl"}`}>
        Join the launch list
      </h2>
      <p className={`mt-3 text-cream-dim ${compact ? "text-sm leading-6" : "text-base leading-7"}`}>
        {compact
          ? "Discord is live above. Leave an email if you want a note when Founding extras open. The rest of the site stays free to browse. No account."
          : "Learn the game, meet fans of your team, and follow that club in one place: all of that stays free to browse. Discord is live on Community. Leave an email if you want a quiet note when Founding extras go live. No account, and nothing here is a gate."}
      </p>

      <div className={`mt-5 flex flex-col gap-3 ${compact ? "" : "sm:flex-row sm:items-stretch"}`}>
        <label className="min-w-0 flex-1">
          <span className="sr-only">Email</span>
          <input
            className={fieldClass}
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            maxLength={LAUNCH_EMAIL_MAX}
            required
          />
        </label>
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex items-center justify-center rounded-full bg-gold px-6 py-3 text-sm font-semibold text-gold-ink hover:bg-gold-soft disabled:opacity-60 sm:shrink-0"
        >
          {status === "sending" ? "Joining…" : "Join the launch list"}
        </button>
      </div>

      {error ? <p className="mt-3 text-sm leading-6 text-live">{error}</p> : null}

      <p className="mt-3 text-xs leading-5 text-cream-dim">
        Email only, for launch updates. We will not lock lessons, fixtures or club
        pages behind this.
      </p>
    </form>
  );
}
