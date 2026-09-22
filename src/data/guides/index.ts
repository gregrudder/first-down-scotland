import { fantasyGuide } from "./fantasy";
import { howToWatchGuide } from "./how-to-watch";
import { lateNightsGuide } from "./late-nights";
import { learningGuide } from "./learning";
import { londonGamesGuide } from "./london-games";
import { pickATeamGuide } from "./pick-a-team";
import { pubsDiscordGuide } from "./pubs-and-discord";
import { schemeBattlesGuide } from "./scheme-battles";
import type { Guide } from "./types";

export type { Guide, GuideBlock } from "./types";
export {
  guideAuthor,
  guideSeasonNote,
  guideUpdatedIso,
  guideUpdatedLabel,
} from "./types";
export { guideHrefs, guidePlainText, guideWordCount } from "./text";

/** Original UK guides, in homepage and index order. */
export const guides: readonly Guide[] = [
  howToWatchGuide,
  learningGuide,
  lateNightsGuide,
  pickATeamGuide,
  fantasyGuide,
  pubsDiscordGuide,
  schemeBattlesGuide,
  londonGamesGuide,
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((guide) => guide.slug === slug);
}

export function getGuideSlugs(): string[] {
  return guides.map((guide) => guide.slug);
}

export function guideHref(slug: string): string {
  return `/guides/${slug}`;
}

export function guideReadingMinutes(guide: Guide): number {
  const words = guide.blocks.reduce((total, block) => {
    const text =
      block.type === "list"
        ? block.items.join(" ")
        : block.type === "note"
          ? `${block.title} ${block.text}`
          : block.text;
    const count = text.split(/\s+/).filter(Boolean).length;
    return total + count;
  }, 0);
  return Math.max(8, Math.round(words / 220));
}
