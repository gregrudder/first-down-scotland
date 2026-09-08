"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiteMenu, SiteMenuButton, SiteMenuDrawer } from "@/components/SiteNav";
import { NavTeamMark } from "@/components/TeamMark";
import { isShortcutCurrent, navShortcuts } from "@/lib/site";

function shortcutClass(current: boolean) {
  return current
    ? "rounded-full bg-navy-3 px-2.5 py-2 text-sm font-semibold text-gold"
    : "rounded-full px-2.5 py-2 text-sm text-cream-dim transition hover:bg-navy-3 hover:text-cream";
}

export function Header() {
  const pathname = usePathname() ?? "/";

  return (
    <SiteMenu>
      <header className="sticky top-0 z-40 border-b border-gold/35 bg-navy/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-3 no-underline">
            <Image
              src="/logo.png"
              alt="First Down Scotland logo"
              width={40}
              height={40}
              priority
              className="h-10 w-10 rounded-[10px]"
            />
            <span className="leading-tight">
              <span className="block font-display text-base font-semibold text-cream sm:text-lg">
                First Down Scotland
              </span>
              <span className="hidden text-xs text-cream-dim sm:block">
                Learn. Meet. Follow your team.
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <nav className="hidden items-center gap-0.5 md:flex" aria-label="Shortcuts">
              {navShortcuts.map((item) => {
                const current = isShortcutCurrent(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={shortcutClass(current)}
                    aria-current={current ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <NavTeamMark className="inline-flex" />
            <SiteMenuButton />
          </div>
        </div>
      </header>
      <SiteMenuDrawer />
    </SiteMenu>
  );
}
