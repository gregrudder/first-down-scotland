import type { NflGame } from "@/lib/espn";
import { ukHourNumber, ukWeekdayShort } from "@/lib/time";

export function watchHintForGame(game: NflGame): string {
  const networks = game.broadcasts.map((name) => name.toLowerCase());
  const hour = ukHourNumber(game.kickoffUtc);
  const weekday = ukWeekdayShort(game.kickoffUtc);

  if (networks.some((name) => name.includes("netflix"))) {
    return "US feed lists Netflix: that usually matches the UK as well.";
  }

  if (game.venueCity?.includes("London") || game.venue?.toLowerCase().includes("wembley") || game.venue?.toLowerCase().includes("tottenham")) {
    return "UK international game: typically on Sky, 5, and Game Pass.";
  }

  if (weekday === "Sun" && hour !== null && hour >= 17 && hour < 20) {
    return "Sunday tea-time window: often 5Action or Sky. Check listings.";
  }

  if (weekday === "Sun" && hour !== null && hour >= 20) {
    return "Sunday night window: often Channel 5 or Sky. Check listings.";
  }

  if ((weekday === "Mon" || weekday === "Tue") && hour !== null && hour <= 3) {
    return "Overnight US primetime: Sky usually has these.";
  }

  if ((weekday === "Thu" || weekday === "Fri") && hour !== null && hour <= 3) {
    return "Thursday-night slot in the US: often Sky in the UK.";
  }

  return "UK rights vary: see Where to watch rather than trusting one listing.";
}
