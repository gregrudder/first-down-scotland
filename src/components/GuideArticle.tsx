import Link from "next/link";
import type { ReactNode } from "react";
import type { GuideBlock } from "@/data/guides";

const LINK = /\[([^\]]+)\]\((\/[^)\s]+)\)/g;

function RichText({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(LINK)) {
    const index = match.index ?? 0;
    if (index > last) parts.push(text.slice(last, index));
    const label = match[1] ?? "";
    const href = match[2] ?? "/";
    parts.push(
      <Link key={`${href}-${index}`} href={href} className="text-gold hover:text-gold-soft">
        {label}
      </Link>,
    );
    last = index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

function Block({ block }: { block: GuideBlock }) {
  switch (block.type) {
    case "h2":
      return (
        <h2 className="mt-10 font-display text-2xl text-cream sm:text-3xl">{block.text}</h2>
      );
    case "p":
      return (
        <p className="text-base leading-7 text-cream-dim">
          <RichText text={block.text} />
        </p>
      );
    case "list":
      return (
        <ul className="list-disc space-y-2 pl-5 text-base leading-7 text-cream-dim">
          {block.items.map((item) => (
            <li key={item}>
              <RichText text={item} />
            </li>
          ))}
        </ul>
      );
    case "note":
      return (
        <aside className="rounded-2xl border border-gold/30 bg-navy-3 px-5 py-4">
          <p className="text-sm font-semibold text-gold">{block.title}</p>
          <p className="mt-2 text-sm leading-6 text-cream">
            <RichText text={block.text} />
          </p>
        </aside>
      );
    default: {
      const unreachable: never = block;
      return unreachable;
    }
  }
}

export function GuideArticle({ blocks }: { blocks: readonly GuideBlock[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((block, index) => (
        <Block key={`${block.type}-${index}`} block={block} />
      ))}
    </div>
  );
}
