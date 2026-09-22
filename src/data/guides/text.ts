import type { Guide, GuideBlock } from "./types";

const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;

/** Visible prose, with link labels kept and URLs removed. */
export function guidePlainText(guide: Guide): string {
  const chunks: string[] = [];
  for (const block of guide.blocks) {
    chunks.push(...blockText(block));
  }
  return chunks.join("\n").replace(LINK, "$1");
}

function blockText(block: GuideBlock): string[] {
  switch (block.type) {
    case "p":
    case "h2":
      return [block.text];
    case "list":
      return [...block.items];
    case "note":
      return [block.title, block.text];
    default: {
      const unreachable: never = block;
      return unreachable;
    }
  }
}

export function guideWordCount(guide: Guide): number {
  return guidePlainText(guide).split(/\s+/).filter(Boolean).length;
}

/** Internal paths linked from a guide. */
export function guideHrefs(guide: Guide): string[] {
  const raw = guide.blocks
    .flatMap((block) => {
      if (block.type === "p" || block.type === "h2") return [block.text];
      if (block.type === "list") return [...block.items];
      return [block.title, block.text];
    })
    .join("\n");
  const hrefs: string[] = [];
  for (const match of raw.matchAll(LINK)) {
    const href = match[2];
    if (href?.startsWith("/")) hrefs.push(href);
  }
  return hrefs;
}
