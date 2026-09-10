import Image from "next/image";
import Link from "next/link";
import { navGroups, navHome, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-navy-2">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6">
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
          <p className="mt-3 text-sm">
            <Link href={navHome.href} className="text-gold hover:text-gold-soft">
              {navHome.label}
            </Link>
            <span className="text-cream-dim"> · </span>
            <Link href="/privacy" className="text-gold hover:text-gold-soft">
              Privacy Policy
            </Link>
          </p>
        </div>
        <nav
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          aria-label="Footer"
        >
          {navGroups.map((group) => (
            <div key={group.id} className={group.priority === "low" ? "opacity-90" : undefined}>
              <p
                className={`text-xs font-semibold tracking-[0.16em] uppercase ${
                  group.priority === "low" ? "text-cream-dim" : "text-gold"
                }`}
              >
                {group.label}
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-cream-dim hover:text-gold">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </footer>
  );
}
