import Link from "next/link";
import { getGuide, guideHref, guideReadingMinutes, guideSeasonNote } from "@/data/guides";

export function GuideTeaser({
  slug,
  kicker = "Guide",
}: {
  slug: string;
  kicker?: string;
}) {
  const guide = getGuide(slug);
  if (!guide) return null;

  return (
    <aside className="rounded-2xl border border-line bg-navy-2 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">{kicker}</p>
      <h2 className="mt-2 font-display text-2xl text-cream">{guide.title}</h2>
      <p className="mt-2 text-sm leading-6 text-cream-dim">{guide.blurb}</p>
      <p className="mt-3 text-xs leading-5 text-cream-dim">
        {guideSeasonNote}. About {guideReadingMinutes(guide)} min.
      </p>
      <Link href={guideHref(guide.slug)} className="mt-3 inline-block text-sm font-semibold text-gold">
        Read the guide →
      </Link>
    </aside>
  );
}
