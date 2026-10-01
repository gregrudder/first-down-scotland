"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import {
  TRAITS,
  buildAQuarterbackGame,
  quarterbacks,
  type Quarterback,
  type TraitId,
} from "@/data/build-a-quarterback";
import { discordInviteUrl } from "@/lib/discord";
import {
  SALARY_CAP,
  SPINS_PER_SLOT,
  capNote,
  dealSlot,
  scoreDraft,
  shareSummary,
  slotSeed,
  traitCost,
  traitLabel,
  type DraftPick,
} from "@/lib/build-a-quarterback";
import { buildCardBlob, type BuildCardModel } from "@/lib/build-a-quarterback-card";

type Phase = "intro" | "draft" | "result";

const PAGE_PATH = "/mini-games/build-a-quarterback";

function pageUrl(): string {
  if (typeof window === "undefined") return `https://www.firstdownscotland.com${PAGE_PATH}`;
  return `${window.location.origin}${PAGE_PATH}`;
}

function initials(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return `${first}${last}`.toUpperCase();
}

function monogramColour(id: string): string {
  const swatches = ["#e8b84a", "#f3d27a", "#8cb4ff", "#3dba7a", "#c9c2b3"];
  let index = 0;
  for (const char of id) index = (index + char.charCodeAt(0)) % swatches.length;
  return swatches[index] ?? "#e8b84a";
}

function findQuarterback(id: string): Quarterback | undefined {
  return quarterbacks.find((qb) => qb.id === id);
}

export function BuildAQuarterback({ embedded = false }: { embedded?: boolean }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [gameSeed, setGameSeed] = useState<number | null>(null);
  const [picks, setPicks] = useState<DraftPick[]>([]);
  const [spins, setSpins] = useState<number[]>(() => TRAITS.map(() => 0));
  const [notice, setNotice] = useState("");
  const [fallback, setFallback] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const boardLabelId = useId();
  const onceId = useId();

  const slotIndex = picks.length;
  const trait = TRAITS[slotIndex];
  const spent = picks.reduce((sum, pick) => sum + pick.cost, 0);
  const capRemaining = SALARY_CAP - spent;
  const spinNow = phase === "draft" ? (spins[slotIndex] ?? 0) : 0;

  const board = useMemo(() => {
    if (gameSeed === null || phase !== "draft" || !trait) return [];
    return dealSlot({
      trait: trait.id,
      usedIds: new Set(picks.map((pick) => pick.quarterbackId)),
      capRemaining,
      slotsLeft: TRAITS.length - slotIndex,
      seed: slotSeed(gameSeed, slotIndex, spinNow),
    });
  }, [capRemaining, gameSeed, phase, picks, slotIndex, spinNow, trait]);

  const scored = useMemo(() => (phase === "result" ? scoreDraft(picks) : null), [phase, picks]);

  useEffect(() => {
    if (phase === "intro") return;
    headingRef.current?.focus();
  }, [phase, slotIndex, spinNow]);

  function start() {
    setGameSeed(Math.floor(Math.random() * 0x7fffffff));
    setPicks([]);
    setSpins(TRAITS.map(() => 0));
    setNotice("");
    setFallback("");
    setPhase("draft");
  }

  function undo() {
    setPicks((current) => current.slice(0, -1));
    setNotice("");
  }

  function spin() {
    if (!trait || spinNow >= SPINS_PER_SLOT) return;
    setSpins((current) => current.map((count, index) => (index === slotIndex ? count + 1 : count)));
  }

  function choose(qb: Quarterback) {
    if (!trait) return;
    if (!board.some((option) => option.id === qb.id)) return;
    const rating = qb.ratings[trait.id];
    const cost = traitCost(rating);
    const next: DraftPick[] = [
      ...picks,
      { traitId: trait.id, quarterbackId: qb.id, rating, cost },
    ];
    setPicks(next);
    setNotice("");
    if (next.length === TRAITS.length) setPhase("result");
  }

  function onBoardKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const buttons = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>("[data-qb-option]"),
    );
    const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (index < 0) return;
    let next = index;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") next = (index + 1) % buttons.length;
    else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      next = (index - 1 + buttons.length) % buttons.length;
    } else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = buttons.length - 1;
    else return;
    event.preventDefault();
    buttons[next]?.focus();
  }

  async function copySummary(model: BuildCardModel) {
    const text = shareSummary({
      archetypeLabel: model.archetypeLabel,
      overall: model.overall,
      verdict: model.verdict,
      spent: model.spent,
      lines: model.lines,
      pageUrl: model.pageUrl,
    });
    try {
      await navigator.clipboard.writeText(text);
      setFallback("");
      setNotice("Copied. Paste it wherever you like.");
    } catch {
      setFallback(text);
      setNotice("The copy button was blocked. Select the text below.");
    }
  }

  async function downloadCard(model: BuildCardModel) {
    try {
      const blob = await buildCardBlob(model);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "build-a-quarterback.png";
      link.click();
      URL.revokeObjectURL(url);
      setNotice("Card downloaded.");
    } catch {
      setNotice("The image did not download. The written summary is there to copy.");
    }
  }

  if (phase === "intro" || gameSeed === null) {
    return (
      <div>
        {embedded ? null : (
          <>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
              Draft · about {buildAQuarterbackGame.minutes} min
            </p>
            <h1 className="mt-3 font-display text-4xl leading-tight text-cream sm:text-5xl">
              {buildAQuarterbackGame.title}
            </h1>
          </>
        )}
        <div className={`${embedded ? "mt-0" : "mt-8"} flex flex-col gap-3 sm:flex-row`}>
          <button
            type="button"
            onClick={start}
            className="inline-flex items-center justify-center rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-gold-ink hover:bg-gold-soft"
          >
            Start the draft
          </button>
          <Link
            href="/mini-games"
            className="inline-flex items-center justify-center rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-cream hover:border-gold/50"
          >
            Back to Mini Games
          </Link>
        </div>
      </div>
    );
  }

  if (phase === "result" && scored) {
    const lines = picks.map((pick) => ({
      trait: traitLabel(pick.traitId),
      name: findQuarterback(pick.quarterbackId)?.name ?? pick.quarterbackId,
      rating: pick.rating,
    }));
    const model: BuildCardModel = {
      archetypeLabel: scored.archetypeLabel,
      overall: scored.overall,
      verdict: scored.verdict,
      spent: scored.spent,
      cap: SALARY_CAP,
      lines,
      pageUrl: pageUrl(),
    };

    return (
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">Result</p>
        {embedded ? (
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="mt-3 font-display text-4xl leading-tight text-cream outline-none sm:text-5xl"
          >
            {scored.archetypeLabel}
          </h2>
        ) : (
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="mt-3 font-display text-4xl leading-tight text-cream outline-none sm:text-5xl"
          >
            {scored.archetypeLabel}
          </h1>
        )}
        <p className="mt-4 font-display text-6xl text-cream">{scored.overall}</p>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-gold">
          Overall game rating
        </p>
        <p className="mt-4 text-lg leading-8 text-cream">{scored.verdict}</p>
        <p className="mt-2 text-sm leading-6 text-cream-dim">{capNote(scored.spent)}</p>

        <ol className="mt-8 space-y-3" aria-label="Your quarterback">
          {picks.map((pick) => {
            const qb = findQuarterback(pick.quarterbackId);
            return (
              <li key={pick.traitId} className="rounded-2xl border border-line bg-navy-2 px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                  {traitLabel(pick.traitId)}
                </p>
                <p className="mt-1 text-base text-cream">
                  {qb?.name ?? pick.quarterbackId}{" "}
                  <span className="text-cream-dim">· {pick.rating} game rating · cap {pick.cost}</span>
                </p>
              </li>
            );
          })}
        </ol>

        <details className="mt-6 rounded-2xl border border-line bg-navy-2 px-5 py-4">
          <summary className="cursor-pointer text-sm font-semibold text-cream">
            How this number is worked out
          </summary>
          <p className="mt-2 text-sm leading-6 text-cream-dim">
            It is a weighted average of the eight game ratings. Accuracy, football IQ, pocket
            presence and clutch count for more than mobility, leadership or durability.
          </p>
        </details>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            onClick={() => void copySummary(model)}
            className="inline-flex items-center justify-center rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-gold-ink hover:bg-gold-soft"
          >
            Copy summary
          </button>
          <button
            type="button"
            onClick={() => void downloadCard(model)}
            className="inline-flex items-center justify-center rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-cream hover:border-gold/50"
          >
            Download card
          </button>
          <button
            type="button"
            onClick={start}
            className="inline-flex items-center justify-center rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-cream hover:border-gold/50"
          >
            Play again
          </button>
        </div>

        <p role="status" className="mt-4 min-h-6 text-sm text-gold">
          {notice}
        </p>
        {fallback ? (
          <textarea
            readOnly
            value={fallback}
            rows={10}
            aria-label="Share summary"
            className="mt-2 w-full rounded-2xl border border-line bg-navy-3 p-4 text-sm leading-6 text-cream"
          />
        ) : null}

        <div className="mt-8 rounded-2xl border border-gold/30 bg-navy-2 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">Discord</p>
          <p className="mt-2 font-display text-2xl text-cream">Post your build</p>
          <p className="mt-2 text-sm leading-6 text-cream-dim">
            Drop the summary in the First Down Scotland Discord and see what everyone else
            drafted. One server for Scottish and UK fans.
          </p>
          <a
            href={discordInviteUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center justify-center rounded-full bg-gold px-6 py-3 text-sm font-semibold text-gold-ink hover:bg-gold-soft"
          >
            Post it in the Discord
          </a>
        </div>

        <Link href="/mini-games" className="mt-8 inline-block text-sm text-cream-dim hover:text-gold">
          ← All mini games
        </Link>
      </div>
    );
  }

  const spinsLeft = SPINS_PER_SLOT - spinNow;

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
        Trait {slotIndex + 1} of {TRAITS.length}
      </p>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-navy-3" aria-hidden>
        <div
          className="h-full rounded-full bg-gold transition-[width]"
          style={{ width: `${(slotIndex / TRAITS.length) * 100}%` }}
        />
      </div>
      <div className="sticky top-20 z-20 -mx-4 mt-6 border-b border-line bg-navy/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <p className="text-sm text-cream">
          Cap <span className="font-semibold text-gold">{capRemaining}</span> of {SALARY_CAP} left
        </p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-navy-3" aria-hidden>
          <div
            className="h-full rounded-full bg-gold-soft"
            style={{ width: `${Math.max(0, Math.min(100, (capRemaining / SALARY_CAP) * 100))}%` }}
          />
        </div>
      </div>

      {embedded ? (
        <h2
          ref={headingRef}
          id={boardLabelId}
          tabIndex={-1}
          className="mt-6 font-display text-3xl text-cream outline-none sm:text-4xl"
        >
          {trait?.label}
        </h2>
      ) : (
        <h1
          ref={headingRef}
          id={boardLabelId}
          tabIndex={-1}
          className="mt-6 font-display text-3xl text-cream outline-none sm:text-4xl"
        >
          {trait?.label}
        </h1>
      )}
      <p className="mt-2 text-base leading-7 text-cream-dim">{trait?.blurb}</p>
      <p id={onceId} className="mt-2 text-sm leading-6 text-cream-dim">
        Each name can be used once.
      </p>
      <p className="sr-only">
        Use Tab or the arrow keys to move between quarterbacks. Enter or Space drafts the one in
        focus.
      </p>

      {picks.length ? (
        <ol className="mt-4 flex gap-2 overflow-x-auto pb-1" aria-label="Picks so far">
          {picks.map((pick) => (
            <li
              key={pick.traitId}
              className="shrink-0 rounded-full border border-line bg-navy-2 px-3 py-1 text-xs text-cream"
            >
              {traitLabel(pick.traitId)} · {findQuarterback(pick.quarterbackId)?.name} · {pick.rating}
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-4 text-sm text-cream-dim">No picks yet.</p>
      )}

      <div
        className="mt-6 grid gap-3"
        role="group"
        aria-labelledby={boardLabelId}
        onKeyDown={onBoardKeyDown}
      >
        {board.map((qb) => (
          <OptionCard
            key={qb.id}
            qb={qb}
            traitId={trait?.id ?? "arm"}
            describedBy={onceId}
            onChoose={() => choose(qb)}
          />
        ))}
      </div>
      {board.length === 0 ? (
        <p className="mt-6 text-sm text-cream-dim">No names fit the cap. Undo a pick.</p>
      ) : null}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        {spinsLeft > 0 ? (
          <button
            type="button"
            onClick={spin}
            className="inline-flex items-center justify-center rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-cream hover:border-gold/50"
          >
            Spin the board ({spinsLeft} left)
          </button>
        ) : (
          <p className="self-center text-sm text-cream-dim">Board already spun.</p>
        )}
        {picks.length > 0 ? (
          <button
            type="button"
            onClick={undo}
            className="inline-flex items-center justify-center rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-cream hover:border-gold/50"
          >
            Undo last pick
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setPhase("intro")}
            className="inline-flex items-center justify-center rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-cream hover:border-gold/50"
          >
            Back
          </button>
        )}
      </div>
    </div>
  );
}

function OptionCard({
  qb,
  traitId,
  describedBy,
  onChoose,
}: {
  qb: Quarterback;
  traitId: TraitId;
  describedBy: string;
  onChoose: () => void;
}) {
  const rating = qb.ratings[traitId];
  const cost = traitCost(rating);
  return (
    <button
      type="button"
      data-qb-option
      onClick={onChoose}
      aria-describedby={describedBy}
      className="flex items-start gap-4 rounded-2xl border border-line bg-navy-2 px-4 py-4 text-left text-cream transition hover:border-gold/50 hover:bg-navy-3 sm:px-5"
    >
      <span
        aria-hidden
        className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border text-sm font-semibold"
        style={{ borderColor: monogramColour(qb.id), color: monogramColour(qb.id) }}
      >
        {initials(qb.name)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-base font-semibold leading-6">{qb.name}</span>
        <span className="mt-1 block text-sm leading-6 text-cream-dim">Known for {qb.knownFor}</span>
        {qb.fact ? (
          <span className="mt-1 block text-sm leading-6 text-cream">
            <span className="font-semibold text-gold">Career note. </span>
            {qb.fact}
          </span>
        ) : null}
      </span>
      <span className="shrink-0 text-right">
        <span className="block font-display text-3xl leading-none">{rating}</span>
        <span className="mt-1 block text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-cream-dim">
          Game rating
        </span>
        <span className="mt-1 block text-sm font-semibold text-gold">Cap {cost}</span>
      </span>
    </button>
  );
}
