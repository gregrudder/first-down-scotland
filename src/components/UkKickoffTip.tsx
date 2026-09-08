const zones = [
  { zone: "Eastern Time", hours: 5 },
  { zone: "Central Time", hours: 6 },
  { zone: "Mountain Time", hours: 7 },
  { zone: "Pacific Time", hours: 8 },
] as const;

export function UkKickoffTip({
  compact = false,
  className = "",
}: {
  compact?: boolean;
  className?: string;
}) {
  if (compact) {
    return (
      <p className={`text-xs leading-5 text-cream-dim ${className}`.trim()}>
        US graphic? Eastern add 5 hours, Central 6, Mountain 7, Pacific 8. Times
        on this site are already UK local.
      </p>
    );
  }

  return (
    <aside
      className={`rounded-2xl border border-gold/30 bg-navy-3 px-5 py-4 ${className}`.trim()}
    >
      <p className="text-sm font-semibold text-gold">US kick-off to UK time</p>
      <p className="mt-2 text-sm leading-6 text-cream">
        Kick-offs on this site are already in UK time. If a US graphic or an
        American mate gives you their clock, add these hours:
      </p>
      <ul className="mt-3 space-y-1.5 text-sm leading-6 text-cream">
        {zones.map((item) => (
          <li key={item.zone}>
            <span className="font-semibold text-cream">{item.zone}</span>
            {": add "}
            {item.hours} hours for the UK
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm leading-6 text-cream-dim">
        That rule of thumb stays right when both sides change for daylight
        saving. A 1pm Eastern Sunday game is 6pm in Britain. Do not trust a
        graphic that says “1pm” with no time zone.
      </p>
    </aside>
  );
}
