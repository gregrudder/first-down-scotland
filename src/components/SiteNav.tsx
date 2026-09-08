"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useSyncExternalStore,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { TeamLogo } from "@/components/TeamLogo";
import { useFavouriteTeam } from "@/components/useFavouriteTeam";
import {
  isCurrentNav,
  navColumns,
  navGroups,
  navHome,
  type NavGroup,
  type NavItem,
} from "@/lib/site";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

function focusableIn(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (node) =>
      !node.hasAttribute("disabled") &&
      node.tabIndex !== -1 &&
      !node.closest("[hidden]") &&
      node.getClientRects().length > 0,
  );
}

function subscribeDesktop(onChange: () => void) {
  const mq = window.matchMedia("(min-width: 64rem)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function useDesktopMenu() {
  return useSyncExternalStore(
    subscribeDesktop,
    () => window.matchMedia("(min-width: 64rem)").matches,
    () => false,
  );
}

function MenuGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
      className="h-5 w-5"
    >
      <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
      className="h-5 w-5"
    >
      <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

type SiteMenuContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  pathname: string;
  menuId: string;
  titleId: string;
  buttonRef: RefObject<HTMLButtonElement | null>;
  mobileRef: RefObject<HTMLDivElement | null>;
  desktopRef: RefObject<HTMLDivElement | null>;
  desktop: boolean;
};

const SiteMenuContext = createContext<SiteMenuContextValue | null>(null);

function useSiteMenu() {
  const value = useContext(SiteMenuContext);
  if (!value) {
    throw new Error("Site menu is missing its provider");
  }
  return value;
}

export function SiteMenu({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "/";
  const desktop = useDesktopMenu();
  const [open, setOpen] = useState(false);
  const [menuPath, setMenuPath] = useState(pathname);
  const menuId = useId();
  const titleId = `${menuId}-title`;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);
  const desktopRef = useRef<HTMLDivElement>(null);
  const lastFocusRef = useRef<HTMLElement | null>(null);
  const wasOpenRef = useRef(false);

  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) {
      if (wasOpenRef.current) {
        wasOpenRef.current = false;
        const restore = lastFocusRef.current ?? buttonRef.current;
        restore?.focus();
      }
      return;
    }

    wasOpenRef.current = true;
    lastFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : buttonRef.current;

    const html = document.documentElement;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const root = desktop ? desktopRef.current : mobileRef.current;
    const closeButton = root?.querySelector<HTMLElement>("[data-close]");
    closeButton?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }

      if (event.key !== "Tab") return;
      const panel = desktop ? desktopRef.current : mobileRef.current;
      if (!panel) return;
      const nodes = focusableIn(panel);
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      html.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [open, desktop]);

  return (
    <SiteMenuContext.Provider
      value={{
        open,
        setOpen,
        pathname,
        menuId,
        titleId,
        buttonRef,
        mobileRef,
        desktopRef,
        desktop,
      }}
    >
      {children}
    </SiteMenuContext.Provider>
  );
}

export function SiteMenuButton() {
  const { open, setOpen, menuId, buttonRef, desktop } = useSiteMenu();

  return (
    <button
      ref={buttonRef}
      type="button"
      className="inline-flex shrink-0 items-center gap-2 rounded-full border border-line px-3 py-2 text-sm text-cream hover:border-gold/50 hover:bg-navy-3"
      aria-expanded={open}
      aria-controls={desktop ? menuId : `${menuId}-mobile`}
      aria-haspopup={desktop ? "true" : "dialog"}
      aria-label={open ? "Close site menu" : "Open site menu"}
      onClick={() => setOpen(!open)}
    >
      <MenuGlyph />
      <span className="hidden min-[380px]:inline">Menu</span>
    </button>
  );
}

function NavLink({
  item,
  pathname,
  extraHrefs,
  onNavigate,
}: {
  item: NavItem;
  pathname: string;
  extraHrefs: readonly string[];
  onNavigate: () => void;
}) {
  const current = isCurrentNav(pathname, item.href, extraHrefs);

  return (
    <Link
      href={item.href}
      className={`relative flex min-h-12 items-start gap-3 rounded-xl px-3 py-3 transition hover:bg-navy-3 ${
        current ? "bg-navy-3" : ""
      }`}
      aria-current={current ? "page" : undefined}
      onClick={onNavigate}
    >
      {current ? (
        <span
          className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-gold"
          aria-hidden
        />
      ) : null}
      <span
        className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
          current ? "bg-gold" : "border border-line"
        }`}
        aria-hidden
      />
      <span className="min-w-0">
        <span
          className={`block ${
            item.primary ? "text-base font-semibold" : "text-sm font-medium"
          } ${current ? "text-gold" : "text-cream"}`}
        >
          {item.label}
        </span>
        {item.description ? (
          <span className="mt-0.5 block text-xs leading-5 text-cream-dim">
            {item.description}
          </span>
        ) : null}
        {current ? <span className="sr-only"> (current page)</span> : null}
      </span>
    </Link>
  );
}

function FavouriteTeamCard({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate: () => void;
}) {
  const { team, href } = useFavouriteTeam();

  if (!team) {
    return (
      <Link
        href="/pick-your-team"
        className="mt-2 block rounded-xl border border-dashed border-gold/35 bg-navy px-3 py-3 hover:border-gold/60 hover:bg-navy-3"
        onClick={onNavigate}
      >
        <p className="text-sm font-semibold text-cream">Pick your team</p>
        <p className="mt-1 text-xs leading-5 text-cream-dim">
          Choose a favourite →
        </p>
      </Link>
    );
  }

  const current = isCurrentNav(pathname, href);

  return (
    <Link
      href={href}
      className={`relative mt-2 flex items-center gap-3 rounded-xl border px-3 py-3 hover:bg-navy-3 ${
        current ? "border-gold/50 bg-navy-3" : "border-line bg-navy"
      }`}
      aria-current={current ? "page" : undefined}
      onClick={onNavigate}
    >
      <TeamLogo team={team} size={36} />
      <span className="min-w-0">
        <span className="block text-[0.65rem] font-semibold tracking-[0.16em] text-gold uppercase">
          My Team
        </span>
        <span className="block truncate font-display text-base text-cream">
          {team.shortName}
        </span>
        <span className="block text-xs font-semibold text-gold">View Team →</span>
      </span>
    </Link>
  );
}

function NavGroupBlock({
  group,
  pathname,
  extraHrefs,
  onNavigate,
}: {
  group: NavGroup;
  pathname: string;
  extraHrefs: readonly string[];
  onNavigate: () => void;
}) {
  const muted = group.priority === "low";

  return (
    <section className={muted ? "opacity-90" : undefined}>
      <h3
        className={`text-[0.7rem] font-semibold tracking-[0.16em] uppercase ${
          muted ? "text-cream-dim" : "text-gold"
        }`}
      >
        {group.label}
      </h3>
      <div className="mt-2">
        {group.items.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            pathname={pathname}
            extraHrefs={extraHrefs}
            onNavigate={onNavigate}
          />
        ))}
        {group.id === "teams" ? (
          <FavouriteTeamCard pathname={pathname} onNavigate={onNavigate} />
        ) : null}
      </div>
    </section>
  );
}

function MenuChrome({
  titleId,
  onClose,
}: {
  titleId: string;
  onClose: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-gold/35 px-4 py-3 sm:px-5">
      <p id={titleId} className="font-display text-lg text-cream">
        Explore
      </p>
      <button
        type="button"
        data-close
        className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-2 text-sm text-cream hover:border-gold/50 hover:bg-navy-3"
        onClick={onClose}
      >
        <CloseGlyph />
        Close
      </button>
    </div>
  );
}

function MenuBody({
  pathname,
  extraHrefs,
  onNavigate,
  layout,
}: {
  pathname: string;
  extraHrefs: readonly string[];
  onNavigate: () => void;
  layout: "stack" | "columns";
}) {
  const homeCurrent = isCurrentNav(pathname, navHome.href);

  const homeLink = (
    <Link
      href={navHome.href}
      className={`relative mb-4 flex min-h-12 items-center gap-3 rounded-xl px-3 py-3 hover:bg-navy-3 ${
        homeCurrent ? "bg-navy-3" : ""
      }`}
      aria-current={homeCurrent ? "page" : undefined}
      onClick={onNavigate}
    >
      {homeCurrent ? (
        <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-gold" aria-hidden />
      ) : null}
      <span
        className={`h-1.5 w-1.5 rounded-full ${homeCurrent ? "bg-gold" : "border border-line"}`}
        aria-hidden
      />
      <span className={`text-sm font-medium ${homeCurrent ? "text-gold" : "text-cream"}`}>
        {navHome.label}
      </span>
    </Link>
  );

  if (layout === "stack") {
    return (
      <div className="px-3 py-4 sm:px-4">
        {homeLink}
        <div className="space-y-6">
          {navGroups.map((group) => (
            <div key={group.id} className="border-t border-line pt-5">
              <NavGroupBlock
                group={group}
                pathname={pathname}
                extraHrefs={extraHrefs}
                onNavigate={onNavigate}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 py-5 lg:px-6 lg:py-6">
      {homeLink}
      <div className="grid gap-8 lg:grid-cols-3">
        {navColumns.map((column) => (
          <div key={column} className="space-y-7 border-t border-line pt-5 lg:border-t-0 lg:pt-0 lg:border-l lg:border-line lg:pl-6 first:lg:border-l-0 first:lg:pl-0">
            {navGroups
              .filter((group) => group.column === column)
              .map((group) => (
                <NavGroupBlock
                  key={group.id}
                  group={group}
                  pathname={pathname}
                  extraHrefs={extraHrefs}
                  onNavigate={onNavigate}
                />
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SiteMenuPanels() {
  const { open, setOpen, pathname, menuId, titleId, mobileRef, desktopRef } =
    useSiteMenu();
  const { href: favouriteHref, team } = useFavouriteTeam();
  const extraHrefs = team ? [favouriteHref] : [];

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-navy/70 backdrop-blur-sm lg:bg-navy/50"
        aria-hidden
        onClick={() => setOpen(false)}
      />

      <div
        ref={mobileRef}
        id={`${menuId}-mobile`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="fds-drawer-in fixed inset-y-0 right-0 z-50 flex w-[min(26rem,calc(100vw-2.5rem))] flex-col border-l border-gold/35 bg-navy-2 shadow-2xl lg:hidden"
      >
        <MenuChrome titleId={titleId} onClose={() => setOpen(false)} />
        <nav className="min-h-0 flex-1 overflow-y-auto" aria-label="Site">
          <MenuBody
            pathname={pathname}
            extraHrefs={extraHrefs}
            onNavigate={() => setOpen(false)}
            layout="stack"
          />
        </nav>
      </div>

      <div className="absolute top-full right-0 left-0 z-50 hidden px-4 pt-2 sm:px-6 lg:block">
        <div
          ref={desktopRef}
          id={menuId}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${titleId}-desktop`}
          className="fds-mega-in mx-auto max-h-[min(38rem,calc(100vh-5.5rem))] max-w-6xl overflow-y-auto rounded-2xl border border-gold/35 bg-navy-2 shadow-2xl"
        >
          <MenuChrome titleId={`${titleId}-desktop`} onClose={() => setOpen(false)} />
          <nav aria-label="Site">
            <MenuBody
              pathname={pathname}
              extraHrefs={extraHrefs}
              onNavigate={() => setOpen(false)}
              layout="columns"
            />
          </nav>
        </div>
      </div>
    </>
  );
}
