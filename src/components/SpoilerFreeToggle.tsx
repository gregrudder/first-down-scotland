"use client";

import { useEffect, useRef } from "react";
import {
  readSpoilerFree,
  SPOILER_FREE_CHANGE_EVENT,
  writeSpoilerFree,
} from "@/lib/spoiler-storage";

export function SpoilerFreeToggle() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const sync = () => {
      button.setAttribute("aria-checked", readSpoilerFree() ? "true" : "false");
    };
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(SPOILER_FREE_CHANGE_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(SPOILER_FREE_CHANGE_EVENT, sync);
    };
  }, []);

  return (
    <div className="mt-6 rounded-2xl border border-line bg-navy-2 p-4 sm:flex sm:items-center sm:justify-between sm:gap-4">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
          Morning-after
        </p>
        <p className="mt-1 text-sm font-semibold text-cream">Spoiler-free</p>
        <p className="mt-1 max-w-xl text-sm leading-6 text-cream-dim">
          Hide scores, touchdown scorers and recaps until you have watched.
          Teams, UK kick-off and TV stay visible. Saved in this browser.
        </p>
      </div>
      <button
        ref={buttonRef}
        type="button"
        role="switch"
        aria-label="Spoiler-free mode"
        onClick={() => writeSpoilerFree(!readSpoilerFree())}
        className="fds-spoiler-switch mt-4 inline-flex shrink-0 items-center gap-3 rounded-full border border-line px-3 py-2 text-sm font-semibold text-cream hover:border-gold/50 sm:mt-0"
      >
        <span
          className="fds-spoiler-switch-track relative inline-flex h-6 w-11 items-center rounded-full bg-navy-3"
          aria-hidden
        >
          <span className="fds-spoiler-switch-thumb inline-block h-5 w-5 translate-x-0.5 rounded-full bg-cream" />
        </span>
        <span className="fds-spoiler">Off — show scores</span>
        <span className="fds-spoiler-safe">On — results hidden</span>
      </button>
    </div>
  );
}
