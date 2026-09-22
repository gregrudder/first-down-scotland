export type GuideBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "list"; items: readonly string[] }
  | { type: "note"; title: string; text: string };

export type Guide = {
  slug: string;
  title: string;
  description: string;
  blurb: string;
  blocks: readonly GuideBlock[];
};

export const guideAuthor = "First Down Scotland editorial";
export const guideUpdatedLabel = "22 September 2026";
export const guideUpdatedIso = "2026-09-22";
export const guideSeasonNote = "Updated for the 2026 NFL season";
