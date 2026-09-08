import { TeamLogo } from "@/components/TeamLogo";
import type { Rivalry } from "@/data/rivalries";
import { getTeam } from "@/data/teams";

export function RivalryCard({ rivalry }: { rivalry: Rivalry }) {
  const home = getTeam(rivalry.home);
  const away = getTeam(rivalry.away);

  return (
    <article className="rounded-2xl border border-line bg-navy-2 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
          {rivalry.division}
        </p>
        <div className="flex items-center gap-2" aria-hidden>
          <TeamLogo
            abbreviation={rivalry.home}
            primary={home?.primary}
            secondary={home?.secondary}
            size={36}
          />
          <span className="text-xs font-semibold text-cream-dim">v</span>
          <TeamLogo
            abbreviation={rivalry.away}
            primary={away?.primary}
            secondary={away?.secondary}
            size={36}
          />
        </div>
      </div>
      <h2 className="mt-3 font-display text-2xl text-cream">{rivalry.title}</h2>
      <p className="mt-3 text-sm leading-6 text-cream-dim">{rivalry.why}</p>
      <h3 className="mt-5 text-sm font-semibold text-cream">Famous moments</h3>
      <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-cream-dim">
        {rivalry.moments.map((moment) => (
          <li key={moment}>{moment}</li>
        ))}
      </ul>
    </article>
  );
}
