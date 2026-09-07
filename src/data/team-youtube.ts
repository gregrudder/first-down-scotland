export type TeamYoutube = {
  url: string;
  handle: string;
};

/**
 * Official club YouTube channels. Handles checked against youtube.com/@…
 * titles and, where the club site exposes a link, against that URL.
 */
export const teamYoutube: Record<string, TeamYoutube> = {
  "arizona-cardinals": { handle: "@AZCardinals", url: "https://www.youtube.com/@AZCardinals" },
  "atlanta-falcons": { handle: "@AtlantaFalcons", url: "https://www.youtube.com/@AtlantaFalcons" },
  "baltimore-ravens": { handle: "@BaltimoreRavens", url: "https://www.youtube.com/@BaltimoreRavens" },
  "buffalo-bills": { handle: "@buffalobills", url: "https://www.youtube.com/@buffalobills" },
  "carolina-panthers": { handle: "@CarolinaPanthers", url: "https://www.youtube.com/@CarolinaPanthers" },
  "chicago-bears": { handle: "@chicagobears", url: "https://www.youtube.com/@chicagobears" },
  "cincinnati-bengals": { handle: "@bengals", url: "https://www.youtube.com/@bengals" },
  "cleveland-browns": { handle: "@browns", url: "https://www.youtube.com/@browns" },
  "dallas-cowboys": { handle: "@dallascowboys", url: "https://www.youtube.com/@dallascowboys" },
  "denver-broncos": { handle: "@broncos", url: "https://www.youtube.com/@broncos" },
  "detroit-lions": { handle: "@detroitlionsnfl", url: "https://www.youtube.com/@detroitlionsnfl" },
  "green-bay-packers": { handle: "@packers", url: "https://www.youtube.com/@packers" },
  "houston-texans": { handle: "@HoustonTexans", url: "https://www.youtube.com/@HoustonTexans" },
  "indianapolis-colts": { handle: "@colts", url: "https://www.youtube.com/@colts" },
  "jacksonville-jaguars": { handle: "@jaguars", url: "https://www.youtube.com/@jaguars" },
  "kansas-city-chiefs": { handle: "@KansasCityChiefs", url: "https://www.youtube.com/@KansasCityChiefs" },
  "las-vegas-raiders": { handle: "@raiders", url: "https://www.youtube.com/@raiders" },
  "los-angeles-chargers": { handle: "@chargers", url: "https://www.youtube.com/@chargers" },
  "los-angeles-rams": { handle: "@LARams", url: "https://www.youtube.com/@LARams" },
  "miami-dolphins": { handle: "@MiamiDolphins", url: "https://www.youtube.com/@MiamiDolphins" },
  "minnesota-vikings": { handle: "@vikings", url: "https://www.youtube.com/@vikings" },
  "new-england-patriots": { handle: "@patriots", url: "https://www.youtube.com/@patriots" },
  "new-orleans-saints": { handle: "@NewOrleansSaints", url: "https://www.youtube.com/@NewOrleansSaints" },
  "new-york-giants": { handle: "@NYGiants", url: "https://www.youtube.com/@NYGiants" },
  "new-york-jets": { handle: "@nyjets", url: "https://www.youtube.com/@nyjets" },
  "philadelphia-eagles": { handle: "@eagles", url: "https://www.youtube.com/@eagles" },
  "pittsburgh-steelers": { handle: "@steelers", url: "https://www.youtube.com/@steelers" },
  "san-francisco-49ers": { handle: "@49ers", url: "https://www.youtube.com/@49ers" },
  "seattle-seahawks": { handle: "@Seahawks", url: "https://www.youtube.com/@Seahawks" },
  "tampa-bay-buccaneers": { handle: "@buccaneers", url: "https://www.youtube.com/@buccaneers" },
  "tennessee-titans": { handle: "@Titans", url: "https://www.youtube.com/@Titans" },
  "washington-commanders": { handle: "@Commanders", url: "https://www.youtube.com/@Commanders" },
};

export function getTeamYoutube(slug: string): TeamYoutube | undefined {
  return teamYoutube[slug];
}
