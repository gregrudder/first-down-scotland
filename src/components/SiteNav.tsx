"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import {
  isCurrentNav,
  navGroupIdForPath,
  navGroups,
  navHome,
} from "@/lib/site";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

function focusableIn(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (node) =>
      !node.hasAttribute("disabled") &&
      node.tabIndex !== -1 &&
      !node.closest("[hidden]"),
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

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden
      className={`h-4 w-4 shrink-0 text-gold transition-transform ${open ? "rotate-180" : ""}`}
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
        clipRule="evenodd"
      />
    </svg>
  );
}

type SiteMenuContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  openGroup: string | null;
  toggleGroup: (id: string) => void;
  pathname: string;
  menuId: string;
  titleId: string;
  buttonRef: RefObject<HTMLButtonElement | null>;
  panelRef: RefObject<HTMLDivElement | null>;
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
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(() =>
    navGroupIdForPath(pathname),
  );
  const [menuPath, setMenuPath] = useState(pathname);
  const menuId = useId();
  const titleId = `${menuId}-title`;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const lastFocusRef = useRef<HTMLElement | null>(null);
  const wasOpenRef = useRef(false);

  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpen(false);
    setOpenGroup(navGroupIdForPath(pathname));
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

    const closeButton = panelRef.current?.querySelector<HTMLElement>("[data-close]");
    closeButton?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }

      if (event.key !== "Tab") return;
      const root = panelRef.current;
      if (!root) return;
      const nodes = focusableIn(root);
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
  }, [open]);

  function toggleGroup(id: string) {
    setOpenGroup((current) => (current === id ? null : id));
  }

  return (
    <SiteMenuContext.Provider
      value={{
        open,
        setOpen,
        openGroup,
        toggleGroup,
        pathname,
        menuId,
        titleId,
        buttonRef,
        panelRef,
      }}
    >
      {children}
    </SiteMenuContext.Provider>
  );
}

export function SiteMenuButton() {
  const { open, setOpen, menuId, buttonRef } = useSiteMenu();

  return (
    <button
      ref={buttonRef}
      type="button"
      className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-2 text-sm text-cream hover:border-gold/50 hover:bg-navy-3"
      aria-expanded={open}
      aria-controls={menuId}
      aria-haspopup="dialog"
      onClick={() => setOpen(!open)}
    >
      <MenuGlyph />
      Menu
    </button>
  );
}

export function SiteMenuDrawer() {
  const {
    open,
    setOpen,
    openGroup,
    toggleGroup,
    pathname,
    menuId,
    titleId,
    panelRef,
  } = useSiteMenu();

  if (!open) return null;

  const homeCurrent = isCurrentNav(pathname, navHome.href);

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-navy/75 backdrop-blur-sm"
        aria-hidden
        onClick={() => setOpen(false)}
      />
      <div
        ref={panelRef}
        id={menuId}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-gold/35 bg-navy-2 shadow-2xl"
      >
        <div className="flex items-center justify-between gap-3 border-b border-gold/35 px-4 py-3">
          <p id={titleId} className="font-display text-lg text-cream">
            Menu
          </p>
          <button
            type="button"
            data-close
            className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-2 text-sm text-cream hover:border-gold/50 hover:bg-navy-3"
            onClick={() => setOpen(false)}
          >
            <CloseGlyph />
            Close
          </button>
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-4" aria-label="Site">
          <Link
            href={navHome.href}
            className={`block rounded-lg px-3 py-2.5 text-sm hover:bg-navy-3 ${
              homeCurrent ? "bg-navy-3 font-semibold text-gold" : "text-cream"
            }`}
            aria-current={homeCurrent ? "page" : undefined}
            onClick={() => setOpen(false)}
          >
            {navHome.label}
          </Link>

          <div className="mt-2 space-y-1">
            {navGroups.map((group) => {
              const groupOpen = openGroup === group.id;
              const panelId = `${menuId}-${group.id}`;
              const headerId = `${panelId}-header`;
              const groupHasCurrent = group.items.some((item) =>
                isCurrentNav(pathname, item.href),
              );

              return (
                <div key={group.id} className="rounded-xl border border-line bg-navy">
                  <h3>
                    <button
                      type="button"
                      id={headerId}
                      className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-left"
                      aria-expanded={groupOpen}
                      aria-controls={panelId}
                      onClick={() => toggleGroup(group.id)}
                    >
                      <span
                        className={`text-xs font-semibold uppercase tracking-[0.16em] ${
                          groupHasCurrent ? "text-gold" : "text-gold-soft"
                        }`}
                      >
                        {group.label}
                      </span>
                      <Chevron open={groupOpen} />
                    </button>
                  </h3>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={headerId}
                    hidden={!groupOpen}
                    className="space-y-0.5 border-t border-line px-2 pb-2 pt-1"
                  >
                    {group.items.map((item) => {
                      const current = isCurrentNav(pathname, item.href);
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
                  </div>
                </div>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
