import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">404</p>
      <h1 className="mt-3 font-display text-4xl text-cream">That page is out of bounds</h1>
      <p className="mt-4 text-base leading-7 text-cream-dim">
        The play is dead. Head back to the learning path, or to the community for
        fans of your team.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link
          href="/learn"
          className="rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-navy"
        >
          Learn
        </Link>
        <Link
          href="/community"
          className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-cream"
        >
          Community
        </Link>
      </div>
    </div>
  );
}
