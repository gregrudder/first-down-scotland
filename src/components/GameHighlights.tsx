"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { NflGame } from "@/lib/espn";
import {
  highlightsApiPath,
  nflHighlightsSearchUrl,
  shouldOfferHighlights,
  type HighlightLookup,
} from "@/lib/highlights";

const SPOILER_FREE_POSTER = "/highlights-spoiler-free.svg";

function outboundHref(lookup: HighlightLookup | null, searchUrl: string): string {
  if (lookup?.watchUrl && lookup.watchUrl.startsWith("https://www.youtube.com/watch")) {
    return lookup.watchUrl;
  }
  if (lookup?.searchUrl?.startsWith("https://")) return lookup.searchUrl;
  return searchUrl;
}

function HighlightsLinkOut({
  href,
  loading,
  hasOfficialClip,
}: {
  href: string;
  loading?: boolean;
  hasOfficialClip?: boolean;
}) {
  const label = hasOfficialClip ? "Watch official highlights →" : "Search NFL YouTube →";
  return (
    <div>
      <p className="text-sm leading-6 text-cream-dim">
        {loading
          ? "Looking for an official NFL clip."
          : hasOfficialClip
            ? "Official NFL clip. We link out: the NFL does not allow these highlights to play in the app. Titles and thumbnails on YouTube often name the winner or the score."
            : "Official NFL YouTube search for this match-up. We link out: the NFL does not allow these clips to play in the app. Titles and thumbnails on YouTube often name the winner or the score."}
      </p>
      <p className="mt-2 text-sm">
        <a
          href={href}
          className="font-semibold text-gold hover:text-gold-soft"
          target="_blank"
          rel="noreferrer"
        >
          {label}
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
              We open the official clip in a new tab. The rest of the slate stays
              spoiler-free.
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

function parseLookup(
  payload: { watchUrl?: unknown; searchUrl?: unknown },
  searchUrl: string,
): HighlightLookup {
  const watchUrl =
    typeof payload.watchUrl === "string" &&
    payload.watchUrl.startsWith("https://www.youtube.com/watch")
      ? payload.watchUrl
      : null;
  const nextSearch =
    typeof payload.searchUrl === "string" && payload.searchUrl.startsWith("https://")
      ? payload.searchUrl
      : searchUrl;
  return { watchUrl, searchUrl: nextSearch };
}

export function GameHighlights({ game }: { game: NflGame }) {
  const searchUrl = nflHighlightsSearchUrl(game);
  const apiPath = highlightsApiPath(game);
  const offer = shouldOfferHighlights(game);
  const [lookup, setLookup] = useState<HighlightLookup | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const askConfirm = useCallback(() => setConfirming(true), []);
  const cancelConfirm = useCallback(() => setConfirming(false), []);
  const confirmWatch = useCallback(() => {
    setConfirming(false);
    setUnlocked(true);
  }, []);

  useEffect(() => {
    if (!offer) return;
    let cancelled = false;

    fetch(apiPath)
      .then((response) => response.json())
      .then((payload) => {
        if (!cancelled) setLookup(parseLookup(payload, searchUrl));
      })
      .catch(() => {
        if (!cancelled) setLookup({ watchUrl: null, searchUrl });
      });

    return () => {
      cancelled = true;
    };
  }, [apiPath, offer, searchUrl]);

  if (!offer) return null;

  const href = outboundHref(lookup, searchUrl);
  const loading = lookup === null;
  const linkOut = (
    <HighlightsLinkOut
      href={href}
      loading={loading}
      hasOfficialClip={Boolean(lookup?.watchUrl)}
    />
  );

  return (
    <div
      className="fds-highlights mt-4 border-t border-line pt-4"
      data-unlocked={unlocked ? "true" : undefined}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
        Highlights
      </p>

      {unlocked ? (
        <div className="mt-2">{linkOut}</div>
      ) : (
        <>
          <div className="fds-spoiler mt-2">{linkOut}</div>
          <div className="fds-spoiler-safe mt-2">
            <SpoilerSafePoster
              href={href}
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
