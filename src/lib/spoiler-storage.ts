export const SPOILER_FREE_STORAGE_KEY = "fds-spoiler-free";
export const SPOILER_FREE_CHANGE_EVENT = "fds-spoiler-free-change";
export const SPOILER_FREE_ATTR = "data-spoiler-free";

function applyDomFlag(on: boolean): void {
  if (typeof document === "undefined") return;
  if (on) {
    document.documentElement.setAttribute(SPOILER_FREE_ATTR, "on");
  } else {
    document.documentElement.removeAttribute(SPOILER_FREE_ATTR);
  }
}

export function readSpoilerFree(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(SPOILER_FREE_STORAGE_KEY) === "on";
  } catch {
    return false;
  }
}

export function writeSpoilerFree(on: boolean): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SPOILER_FREE_STORAGE_KEY, on ? "on" : "off");
  } catch {
    // Private mode: still flip this visit.
  }
  applyDomFlag(on);
  window.dispatchEvent(new Event(SPOILER_FREE_CHANGE_EVENT));
}

/** Inline boot script: hide scores before first paint if the preference is on. */
export function spoilerFreeBootScript(): string {
  return `(function(){try{if(localStorage.getItem(${JSON.stringify(SPOILER_FREE_STORAGE_KEY)})==="on")document.documentElement.setAttribute(${JSON.stringify(SPOILER_FREE_ATTR)},"on");}catch(e){}})();`;
}
