export function PageIntro({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="max-w-2xl">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">{eyebrow}</p>
      ) : null}
      <h1 className="mt-2 font-display text-4xl leading-tight text-cream sm:text-5xl">{title}</h1>
      {children ? (
        <div className="mt-4 space-y-3 text-base leading-7 text-cream-dim">{children}</div>
      ) : null}
    </div>
  );
}
