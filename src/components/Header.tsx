import Link from "next/link";
import { navItems } from "@/lib/site";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-navy/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3 no-underline">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold/40 bg-navy-2 text-sm font-semibold tracking-wide text-gold">
            1D
          </span>
          <span className="leading-tight">
            <span className="block font-display text-base font-semibold text-cream sm:text-lg">
              First Down Scotland
            </span>
            <span className="hidden text-xs text-cream-dim sm:block">
              Learn the NFL, then see what’s on
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-sm text-cream-dim transition hover:bg-navy-3 hover:text-cream"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <details className="relative md:hidden">
          <summary className="list-none rounded-full border border-line px-3 py-2 text-sm text-cream [&::-webkit-details-marker]:hidden">
            Menu
          </summary>
          <nav
            className="absolute right-0 mt-2 w-48 rounded-xl border border-line bg-navy-2 p-2 shadow-xl"
            aria-label="Mobile"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-lg px-3 py-2 text-sm text-cream hover:bg-navy-3"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}
