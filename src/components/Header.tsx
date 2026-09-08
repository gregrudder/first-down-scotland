"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { NavTeamMark } from "@/components/TeamMark";
import { navItems } from "@/lib/site";

function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const wrapRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    function onPointerDown(event: PointerEvent) {
      const root = wrapRef.current;
      if (!root) return;
      if (event.target instanceof Node && !root.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div className="relative" ref={wrapRef}>
      <button
        type="button"
        className="rounded-full border border-line px-3 py-2 text-sm text-cream"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
      >
        Menu
      </button>
      {open ? (
        <nav
          id={menuId}
          className="absolute right-0 mt-2 w-48 rounded-xl border border-line bg-navy-2 p-2 shadow-xl"
          aria-label="Mobile"
        >
          {navItems.map((item) => {
            const current = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-lg px-3 py-2 text-sm hover:bg-navy-3 ${
                  current ? "bg-navy-3 font-semibold text-gold" : "text-cream"
                }`}
                aria-current={current ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      ) : null}
    </div>
  );
}

function navLinkClass(current: boolean) {
  return current
    ? "rounded-full bg-navy-3 px-2.5 py-2 text-sm font-semibold text-gold"
    : "rounded-full px-2.5 py-2 text-sm text-cream-dim transition hover:bg-navy-3 hover:text-cream";
}

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-navy/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3 no-underline">
          <Image
            src="/logo.png"
            alt=""
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

        <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Primary">
          {navItems.map((item) => {
            const current = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={navLinkClass(current)}
                aria-current={current ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
          <NavTeamMark />
        </nav>

        <div className="flex items-center gap-2 xl:hidden">
          <NavTeamMark className="inline-flex" />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
