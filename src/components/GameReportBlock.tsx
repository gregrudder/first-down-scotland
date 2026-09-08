import type { GameReport } from "@/lib/game-report";

function linkLabel(report: GameReport): string {
  if (report.source === "First Down Scotland") {
    return report.kind === "recap" ? "ESPN recap / game page →" : "ESPN game page →";
  }
  return `Read on ${report.source} →`;
}

export function GameReportBlock({
  report,
  compact = false,
}: {
  report: GameReport;
  compact?: boolean;
}) {
  const eyebrow = report.kind === "recap" ? "Post-match report" : "Preview";
  const pendingLabel = report.kind === "recap" ? "Report coming" : "Preview";

  return (
    <div className={compact ? "mt-3" : "mt-4 border-t border-line pt-4"}>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
        {report.state === "pending" ? pendingLabel : eyebrow}
      </p>
      <p className="mt-1 text-sm font-medium text-cream">{report.headline}</p>
      <p className="mt-1 text-sm leading-6 text-cream-dim">{report.snippet}</p>
      {report.sourceUrl ? (
        <p className="mt-2 text-sm">
          <a
            href={report.sourceUrl}
            className="font-semibold text-gold hover:text-gold-soft"
            target="_blank"
            rel="noreferrer"
          >
            {linkLabel(report)}
          </a>
        </p>
      ) : report.source !== "First Down Scotland" ? (
        <p className="mt-2 text-xs text-cream-dim">Source: {report.source}</p>
      ) : null}
      {report.state === "ready" && report.source !== "First Down Scotland" ? (
        <p className="mt-2 text-xs leading-5 text-cream-dim">
          Short summary only. Full piece stays on {report.source}.
        </p>
      ) : null}
    </div>
  );
}
