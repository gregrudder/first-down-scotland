"use client";

import Image from "next/image";
import Link from "next/link";
import { HeaderTeamCta } from "@/components/HeaderTeamCta";
import { SiteMenu, SiteMenuButton, SiteMenuPanels } from "@/components/SiteNav";
import { NavTeamMark } from "@/components/TeamMark";

export function Header() {
  return (
    <SiteMenu>
      <div className="sticky top-0 z-50">
        <header className="border-b border-gold/35 bg-navy/85 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:gap-4 sm:px-6">
            <Link href="/" className="flex min-w-0 items-center gap-2 no-underline sm:gap-3">
              <Image
                src="/logo.png"
                alt="First Down Scotland logo"
                width={40}
                height={40}
                priority
                className="h-10 w-10 shrink-0 rounded-[10px]"
              />
              <span className="hidden leading-tight sm:block">
                <span className="block font-display text-base font-semibold text-cream sm:text-lg">
                  First Down Scotland
                </span>
                <span className="hidden text-xs text-cream-dim sm:block">
                  Learn. Meet. Follow your team.
                </span>
              </span>
            </Link>

            <div className="flex shrink-0 items-center gap-2">
              <NavTeamMark className="hidden sm:inline-flex" />
              <HeaderTeamCta />
              <SiteMenuButton />
            </div>
          </div>
        </header>
        <SiteMenuPanels />
      </div>
    </SiteMenu>
  );
}
