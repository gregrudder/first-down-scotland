"use client";

import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import type { NflGame } from "@/lib/espn";
import {
  highlightsApiPath,
  isYoutubeVideoId,
  nflHighlightsSearchUrl,
  shouldOfferHighlights,
  youtubeEmbedSrc,
  type HighlightLookup,
} from "@/lib/highlights";
import {
  readSpoilerFree,
  SPOILER_FREE_CHANGE_EVENT,
} from "@/lib/spoiler-storage";

const SPOILER_FREE_POSTER = "/highlights-spoiler-free.svg";

function subscribeSpoilerFree(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(SPOILER_FREE_CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(SPOILER_FREE_CHANGE_EVENT, onChange);
  };
}

function EmbedSkeleton() {
  return (
    <div
      className="aspect-video overflow-hidden rounded-xl border border-line bg-navy-3"
      aria-hidden
    >
      <div className="field-grid h-full w-full opacity-40" />
    </div>
  );
}

function YoutubeEmbed({ videoId }: { videoId: string }) {
  return (
    <div className="aspect-video overflow-hidden rounded-xl border border-line bg-navy-3">
      <iframe
        src={youtubeEmbedSrc(videoId)}
        title="Match highlights"
        className="h-full w-full"
        loading="lazy"
        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}

function SearchFallback({
  href,
  loading,
}: {
  href: string;
  loading?: boolean;
}) {
  return (
    <div>
      <p className="text-sm leading-6 text-cream-dim">
        {loading
          ? "Looking for an official NFL clip to play here."
          : "No official clip pinned yet. NFL YouTube search for this match-up — titles and thumbnails there often name the winner or the score."}
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

function NormalHighlights({
  videoId,
  searchUrl,
  loading,
}: {
  videoId: string | null;
  searchUrl: string;
  loading: boolean;
}) {
  if (loading && !videoId) {
    return (
      <>
        <p className="text-sm leading-6 text-cream-dim">
          Looking for an official NFL clip to play here.
        </p>
        <div className="mt-3">
          <EmbedSkeleton />
        </div>
      </>
    );
  }

  if (videoId && isYoutubeVideoId(videoId)) {
    return (
      <>
        <p className="text-sm leading-6 text-cream-dim">
          Official clip in the app. YouTube’s own title on the player may still
          mention the result.
        </p>
        <div className="mt-3">
          <YoutubeEmbed videoId={videoId} />
        </div>
      </>
    );
  }

  return <SearchFallback href={searchUrl} />;
}

function SpoilerSafePoster({
  confirming,
  onAsk,
  onCancel,
  onConfirm,
}: {
  confirming: boolean;
  onAsk: () => void;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const titleId = useId();
  const descId = useId();
  const confirmRef = useRef<HTMLButtonElement>(null);

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
              The player can show YouTube’s title and first frame, which often
              name the winner or the score. The rest of the slate stays
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
              <button
                ref={confirmRef}
                type="button"
                onClick={onConfirm}
                className="rounded-full bg-gold px-4 py-2 text-sm font-semibold text-gold-ink hover:bg-gold-soft"
              >
                Watch highlights
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function GameHighlights({ game }: { game: NflGame }) {
  const searchUrl = nflHighlightsSearchUrl(game);
  const apiPath = highlightsApiPath(game);
  const offer = shouldOfferHighlights(game);
  const [lookup, setLookup] = useState<HighlightLookup | null>(null);
  const spoilerFree = useSyncExternalStore(
    subscribeSpoilerFree,
    readSpoilerFree,
    () => false,
  );
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
      .then((payload: { videoId?: unknown; searchUrl?: unknown }) => {
        if (cancelled) return;
        const videoId =
          typeof payload.videoId === "string" && isYoutubeVideoId(payload.videoId)
            ? payload.videoId
            : null;
        const nextSearch =
          typeof payload.searchUrl === "string" && payload.searchUrl.startsWith("https://")
            ? payload.searchUrl
            : searchUrl;
        setLookup({ videoId, searchUrl: nextSearch });
      })
      .catch(() => {
        if (!cancelled) setLookup({ videoId: null, searchUrl });
      });

    return () => {
      cancelled = true;
    };
  }, [apiPath, offer, searchUrl]);

  if (!offer) return null;

  const videoId = lookup?.videoId ?? null;
  const resolvedSearch = lookup?.searchUrl ?? searchUrl;
  const loading = lookup === null;
  const showEmbed = unlocked || !spoilerFree;

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
          <NormalHighlights videoId={videoId} searchUrl={resolvedSearch} loading={loading} />
        </div>
      ) : (
        <>
          <div className="fds-spoiler mt-2">
            {showEmbed ? (
              <NormalHighlights
                videoId={videoId}
                searchUrl={resolvedSearch}
                loading={loading}
              />
            ) : (
              <SearchFallback href={resolvedSearch} loading />
            )}
          </div>
          <div className="fds-spoiler-safe mt-2">
            <SpoilerSafePoster
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
