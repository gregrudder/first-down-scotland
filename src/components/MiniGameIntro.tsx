import type { MiniGameIntro as MiniGameIntroCopy } from "@/data/mini-game-intros";
import type { MiniGameKind } from "@/data/mini-game-types";

export function MiniGameIntro({
  title,
  kind,
  minutes,
  intro,
}: {
  title: string;
  kind: MiniGameKind;
  minutes: number;
  intro: MiniGameIntroCopy;
}) {
  return (
    <section>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
        {kind === "fun" ? "Fun quiz" : "Mini game"} · about {minutes} min
      </p>
      <h1 className="mt-3 font-display text-4xl leading-tight text-cream sm:text-5xl">{title}</h1>
      <div className="mt-4 space-y-4 text-base leading-7 text-cream-dim">
        {intro.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 48)}>{paragraph}</p>
        ))}
      </div>
      <p className="mt-4 text-sm">
        <a href={intro.sourceUrl} className="text-gold" target="_blank" rel="noreferrer">
          Source
        </a>
      </p>
    </section>
  );
}
