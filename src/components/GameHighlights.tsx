"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { NflGame } from "@/lib/espn";
import { nflHighlightsSearchUrl, shouldOfferHighlights } from "@/lib/highlights";

const SPOILER_FREE_POSTER = "/highlights-spoiler-free.svg";

function HighlightsLinkOut({ href }: { href: string }) {
  return (
    <div>
      <p className="text-sm leading-6 text-cream-dim">
        Official NFL YouTube search for this match-up. We link out: the NFL does
        not allow these clips to play in the app. Titles and thumbnails on
        YouTube often name the winner or the score.
      </p>
      <p className="mt-2 text-sm">
        <a
          href={href}
          className="font-semibold text-gold hover:text-gold-soft"
          target="_blank"
          rel="noreferrer"
        >
          Search NFL YouTube →
        </a>
      </p>
    </div>
  );
}

function SpoilerSafePoster({
  href,
  confirming,
  onAsk,
  onCancel,
  onConfirm,
}: {
  href: string;
  confirming: boolean;
  onAsk: () => void;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const titleId = useId();
  const descId = useId();
  const confirmRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!confirming) return;
    confirmRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [confirming, onCancel]);

  return (
    <div className="relative overflow-hidden rounded-xl border border-line bg-navy-3">
      <button
        type="button"
        onClick={onAsk}
        className="block w-full text-left"
        aria-haspopup="dialog"
        aria-expanded={confirming}
        aria-label="Highlights ready. Tap after watching — this may reveal the result."
      >
        {/* Static branded asset only — never a YouTube thumbnail. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={SPOILER_FREE_POSTER}
          alt="Highlights — tap after watching"
          width={1280}
          height={720}
          className="aspect-video w-full object-cover"
        />
      </button>
      {confirming ? (
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descId}
          className="absolute inset-0 flex items-end bg-navy/85 p-4 sm:items-center sm:justify-center sm:p-6"
        >
          <div className="w-full max-w-md rounded-2xl border border-line bg-navy-2 p-4 shadow-lg">
            <p id={titleId} className="font-display text-lg text-cream">
              This may reveal the result
            </p>
            <p id={descId} className="mt-2 text-sm leading-6 text-cream-dim">
              YouTube titles and thumbnails often name the winner or the score.
              We open the official NFL search in a new tab. The rest of the
              slate stays spoiler-free.
            </p>
            <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onCancel}
                className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-cream hover:border-gold/50"
              >
                Not yet
              </button>
              <a
                ref={confirmRef}
                href={href}
                target="_blank"
                rel="noreferrer"
                onClick={onConfirm}
                className="inline-flex items-center justify-center rounded-full bg-gold px-4 py-2 text-sm font-semibold text-gold-ink hover:bg-gold-soft"
              >
                Open on YouTube
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function GameHighlights({ game }: { game: NflGame }) {
  const searchUrl = nflHighlightsSearchUrl(game);
  const [unlocked, setUnlocked] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const askConfirm = useCallback(() => setConfirming(true), []);
  const cancelConfirm = useCallback(() => setConfirming(false), []);
  const confirmWatch = useCallback(() => {
    setConfirming(false);
    setUnlocked(true);
  }, []);

  if (!shouldOfferHighlights(game)) return null;

  return (
    <div
      className="fds-highlights mt-4 border-t border-line pt-4"
      data-unlocked={unlocked ? "true" : undefined}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
        Highlights
      </p>

      {unlocked ? (
        <div className="mt-2">
          <HighlightsLinkOut href={searchUrl} />
        </div>
      ) : (
        <>
          <div className="fds-spoiler mt-2">
            <HighlightsLinkOut href={searchUrl} />
          </div>
          <div className="fds-spoiler-safe mt-2">
            <SpoilerSafePoster
              href={searchUrl}
              confirming={confirming}
              onAsk={askConfirm}
              onCancel={cancelConfirm}
              onConfirm={confirmWatch}
            />
            <p className="mt-2 text-sm leading-6 text-cream-dim">
              Tap when you have watched. We keep YouTube’s title and thumbnail
              off this page until you say so.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
