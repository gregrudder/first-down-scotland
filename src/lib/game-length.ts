export function formatGameLength(elapsedMinutes: number): string | undefined {
  if (!Number.isFinite(elapsedMinutes) || elapsedMinutes < 20) return undefined;
  const mins = Math.round(elapsedMinutes);
  if (mins < 75) return `About ${mins} minutes of ball`;
  const hours = Math.floor(mins / 60);
  const rest = mins % 60;
  if (rest < 10) {
    return hours === 1 ? "About 1 hour of ball" : `About ${hours} hours of ball`;
  }
  if (rest > 50) {
    const next = hours + 1;
    return next === 1 ? "About 1 hour of ball" : `About ${next} hours of ball`;
  }
  if (hours === 1) return `About 1 hour ${rest} minutes of ball`;
  return `About ${hours} hours ${rest} minutes of ball`;
}
