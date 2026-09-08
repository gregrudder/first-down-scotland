import type { DepthChartResult } from "@/lib/depth-chart";

export function DepthChart({ chart }: { chart: DepthChartResult }) {
  return (
    <section className="mt-8">
      <h2 className="font-display text-2xl text-cream">Depth chart</h2>
      <p className="mt-2 text-sm leading-6 text-cream-dim">
        Who is lined up first at each spot. This is ESPN’s public chart — it can
        change every week after injuries, form, and selection. We do not type the
        names in by hand.
      </p>

      {!chart.ok ? (
        <p className="mt-4 rounded-2xl border border-line bg-navy-2 p-5 text-sm leading-6 text-cream-dim">
          {chart.error} The rest of the profile still stands.
        </p>
      ) : (
        <div className="mt-5 space-y-5">
          {chart.units.map((group) => (
            <div key={group.unit} className="rounded-2xl border border-line bg-navy-2 p-5">
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                {group.heading}
              </h3>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {group.rows.map((row) => (
                  <li key={`${group.unit}-${row.code}`} className="min-w-0">
                    <p className="text-xs text-cream-dim">
                      {row.label} · {row.code}
                    </p>
                    <p className="mt-0.5 font-medium text-cream">{row.starter}</p>
                    {row.nextUp ? (
                      <p className="text-xs leading-5 text-cream-dim">Next: {row.nextUp}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <p className="text-xs leading-5 text-cream-dim">
            {chart.seasonYear} season snapshot from {chart.source}. Treat it as a
            guide, not a team sheet carved in stone.
          </p>
        </div>
      )}
    </section>
  );
}
