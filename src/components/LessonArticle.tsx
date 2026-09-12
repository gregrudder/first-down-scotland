import Link from "next/link";
import { DownsMotionGraphic } from "@/components/DownsMotionGraphic";
import { LearnMotionById } from "@/components/learn-motion";
import { DraftBoard } from "@/components/DraftBoard";
import { FantasyLineup, SnakeDraft } from "@/components/FantasyDiagrams";
import { FieldDiagram, FieldLegend } from "@/components/FieldDiagram";
import type { Lesson, LessonBlock } from "@/data/lessons";
import { getLessonDiagram } from "@/data/lesson-diagrams";

function Block({ block }: { block: LessonBlock }) {
  switch (block.type) {
    case "p":
      return <p className="text-base leading-7 text-cream-dim">{block.text}</p>;
    case "h2":
      return (
        <h2 className="mt-2 font-display text-2xl text-cream sm:text-3xl">{block.text}</h2>
      );
    case "list":
      return (
        <ul className="list-disc space-y-2 pl-5 text-base leading-7 text-cream-dim">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "callout":
      return (
        <aside className="rounded-2xl border border-gold/30 bg-navy-3 px-5 py-4">
          <p className="text-sm font-semibold text-gold">{block.title}</p>
          <p className="mt-2 text-sm leading-6 text-cream">{block.text}</p>
          {block.href && block.linkLabel ? (
            <Link href={block.href} className="mt-3 inline-block text-sm font-semibold text-gold">
              {block.linkLabel}
            </Link>
          ) : null}
        </aside>
      );
    case "terms":
      return (
        <dl className="grid gap-3 sm:grid-cols-2">
          {block.items.map((item) => (
            <div key={item.term} className="rounded-xl border border-line bg-navy-2 p-4">
              <dt className="font-semibold text-cream">{item.term}</dt>
              <dd className="mt-1 text-sm leading-6 text-cream-dim">{item.def}</dd>
            </div>
          ))}
        </dl>
      );
    case "diagram": {
      const diagram = getLessonDiagram(block.id);
      if (!diagram) return null;
      return <FieldDiagram diagram={diagram} />;
    }
    case "downs-explainer":
      return <DownsMotionGraphic />;
    case "learn-motion":
      return <LearnMotionById id={block.id} />;
    case "draft-board":
      return <DraftBoard />;
    case "fantasy-lineup":
      return <FantasyLineup />;
    case "snake-draft":
      return <SnakeDraft />;
  }
}

export function LessonArticle({ lesson }: { lesson: Lesson }) {
  const diagrams = lesson.blocks.flatMap((block) => {
    if (block.type !== "diagram") return [];
    const diagram = getLessonDiagram(block.id);
    return diagram ? [diagram] : [];
  });
  const hasDiagram = diagrams.length > 0;
  const showPositions = diagrams.some((diagram) =>
    diagram.markers.some((marker) => Boolean(marker.label)),
  );
  const lead = lesson.blocks[0];
  const explainerFirst = lead?.type === "downs-explainer";
  const bodyBlocks = explainerFirst ? lesson.blocks.slice(1) : lesson.blocks;

  return (
    <article className="space-y-6">
      {explainerFirst ? <DownsMotionGraphic /> : null}
      {hasDiagram ? <FieldLegend showPositions={showPositions} /> : null}
      {bodyBlocks.map((block, index) => (
        <Block key={`${lesson.slug}-${index}`} block={block} />
      ))}
    </article>
  );
}
