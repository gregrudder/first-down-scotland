"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { GlossaryEntry } from "@/data/glossary";

export function GlossaryExplorer({ entries }: { entries: GlossaryEntry[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return entries;
    return entries.filter((entry) => {
      const haystack = `${entry.term} ${entry.short} ${entry.longer ?? ""}`.toLowerCase();
      return haystack.includes(needle);
    });
  }, [entries, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, GlossaryEntry[]>();
    for (const entry of filtered) {
      const letter = entry.term.charAt(0).toUpperCase();
      map.set(letter, [...(map.get(letter) ?? []), entry]);
    }
    return [...map.entries()];
  }, [filtered]);

  return (
    <div>
      <label className="block">
        <span className="text-sm font-medium text-cream">Search the jargon</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try first down, sack, punt…"
          className="mt-2 w-full rounded-xl border border-line bg-navy-2 px-4 py-3 text-base text-cream placeholder:text-cream-dim/70"
        />
      </label>

      <p className="mt-3 text-sm text-cream-dim">
        {filtered.length} {filtered.length === 1 ? "term" : "terms"}
      </p>

      {grouped.length === 0 ? (
        <p className="mt-8 text-cream-dim">
          Nothing matches that. Try a shorter word, or browse a lesson and come back.
        </p>
      ) : (
        <div className="mt-8 space-y-10">
          {grouped.map(([letter, letterEntries]) => (
            <section key={letter}>
              <h2 className="font-display text-3xl text-gold">{letter}</h2>
              <dl className="mt-4 grid gap-3 md:grid-cols-2">
                {letterEntries.map((entry) => (
                  <div key={entry.term} className="rounded-2xl border border-line bg-navy-2 p-4">
                    <dt className="font-semibold text-cream">{entry.term}</dt>
                    <dd className="mt-2 text-sm leading-6 text-cream-dim">
                      {entry.short}
                      {entry.longer ? ` ${entry.longer}` : ""}
                    </dd>
                    {entry.lessonSlug ? (
                      <Link
                        href={`/learn/${entry.lessonSlug}`}
                        className="mt-3 inline-block text-sm text-gold"
                      >
                        Related lesson →
                      </Link>
                    ) : null}
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
