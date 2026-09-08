"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFavouriteTeam } from "@/components/useFavouriteTeam";

export function HeaderTeamCta() {
  const pathname = usePathname() ?? "/";
  const { team, href } = useFavouriteTeam();
  const label = team ? "My Team" : "Pick My Team";
  const current = pathname === href || (team ? pathname.startsWith(`${href}/`) : pathname.startsWith("/pick-your-team"));

  return (
    <Link
      href={href}
      className={`inline-flex shrink-0 items-center justify-center rounded-full px-3 py-2 text-xs font-semibold whitespace-nowrap sm:px-4 sm:text-sm ${
        current
          ? "bg-gold-soft text-gold-ink"
          : "bg-gold text-gold-ink hover:bg-gold-soft"
      }`}
      aria-current={current ? "page" : undefined}
      aria-label={team ? `My Team, ${team.shortName}` : "Pick My Team"}
    >
      {label}
    </Link>
  );
}
