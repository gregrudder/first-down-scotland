import Link from "next/link";

const zones = [
  { name: "Eastern", hours: 5 },
  { name: "Central", hours: 6 },
  { name: "Mountain", hours: 7 },
  { name: "Pacific", hours: 8 },
] as const;

export function UkKickoffHelper({
  showFixturesLink = false,
}: {
  showFixturesLink?: boolean;
}) {
  return (
    <aside className="rounded-2xl border border-gold/30 bg-navy-3 px-5 py-4">
      <p className="text-sm font-semibold text-gold">US kick-off to UK time</p>
      <p className="mt-2 text-sm leading-6 text-cream">
        American graphics show US clocks. A common UK rule of thumb, and it still
        works when both sides are on daylight saving:
      </p>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {zones.map((zone) => (
          <li
            key={zone.name}
            className="rounded-xl border border-line bg-navy-2 px-3 py-2 text-sm leading-6 text-cream"
          >
            <span className="font-semibold">{zone.name}</span>
            <span className="text-cream-dim"> · add {zone.hours} hours for the UK</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm leading-6 text-cream-dim">
        So 1pm Eastern is 6pm in Britain. This site already converts fixtures to
        Europe/London. Use the helper when you only have a US graphic.
      </p>
      {showFixturesLink ? (
        <Link href="/this-week" className="mt-3 inline-block text-sm font-semibold text-gold">
          This week’s kick-offs in UK time →
        </Link>
      ) : null}
    </aside>
  );
}
