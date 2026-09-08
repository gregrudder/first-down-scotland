import Image from "next/image";
import Link from "next/link";
import { navItems, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-navy-2">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-md">
          <p className="flex items-center gap-3 font-display text-lg text-cream">
            <Image
              src="/logo.png"
              alt="First Down Scotland logo"
              width={36}
              height={36}
              className="h-9 w-9 rounded-[9px]"
            />
            {site.name}
          </p>
          <p className="mt-2 text-sm leading-6 text-cream-dim">{site.tagline}</p>
          <p className="mt-3 text-xs leading-5 text-cream-dim">
            Independent learning and community project. Not affiliated with the NFL.
            Fixture times, scores and standings come from ESPN’s public APIs and
            are shown in Europe/London.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm" aria-label="Footer">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-cream-dim hover:text-gold">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
