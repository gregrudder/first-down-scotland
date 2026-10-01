/**
 * Refresh the 2026 regular-season kick-off file from the public nflverse
 * schedule (Lee Sharpe / nfldata games.csv).
 *
 * The app does not guess fixtures. It reads src/data/kickoff-schedule.json.
 * Re-run this when the NFL flexes a game:
 *
 *   node scripts/build-kickoff-schedule.mjs
 *
 * Times in the file are US Eastern wall-clock times, as published.
 * The site converts them to Europe/London, including the BST/GMT change.
 */
import { writeFile } from "node:fs/promises";
import path from "node:path";

const SOURCE_URL =
  "https://raw.githubusercontent.com/nflverse/nfldata/master/data/games.csv";
const SOURCE_REPO = "https://github.com/nflverse/nfldata";
const OUT = path.resolve(import.meta.dirname, "../src/data/kickoff-schedule.json");
const SEASON = "2026";
const GAME_TYPE = "REG";

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char !== "\r") {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((entry) => entry.some((value) => value !== ""));
}

function tzOffsetMinutes(instant, timeZone) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(instant)
      .map((part) => [part.type, part.value]),
  );
  const hour = parts.hour === "24" ? "0" : parts.hour;
  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(hour),
    Number(parts.minute),
    Number(parts.second),
  );
  return (asUtc - instant.getTime()) / 60000;
}

/** US Eastern wall clock (YYYY-MM-DD + HH:mm) to a UTC Date. */
function easternWallTimeToUtc(gameday, gametime) {
  const [year, month, day] = gameday.split("-").map(Number);
  const [hour, minute] = gametime.split(":").map(Number);
  const wallAsUtc = Date.UTC(year, month - 1, day, hour, minute, 0);
  let utc = wallAsUtc - tzOffsetMinutes(new Date(wallAsUtc), "America/New_York") * 60000;
  utc = wallAsUtc - tzOffsetMinutes(new Date(utc), "America/New_York") * 60000;
  return new Date(utc);
}

function londonStamp(date) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/London",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
      timeZoneName: "short",
    })
      .formatToParts(date)
      .map((part) => [part.type, part.value]),
  );
  const hour = parts.hour === "24" ? "00" : parts.hour;
  return `${parts.year}-${parts.month}-${parts.day} ${hour}:${parts.minute} ${parts.timeZoneName}`;
}

const SPOT_CHECKS = [
  ["2026_04_IND_WAS", "2026-10-04 14:30 BST"],
  ["2026_04_PIT_CLE", "2026-10-02 01:15 BST"],
  ["2026_04_DET_CAR", "2026-10-05 01:20 BST"],
  ["2026_04_ATL_NO", "2026-10-06 01:15 BST"],
];

async function main() {
  const response = await fetch(SOURCE_URL, { headers: { Accept: "text/csv" } });
  if (!response.ok) {
    throw new Error(`nflverse games.csv returned ${response.status}`);
  }
  const [header, ...body] = parseCsv(await response.text());
  const col = Object.fromEntries(header.map((name, index) => [name, index]));
  const required = [
    "game_id",
    "season",
    "game_type",
    "week",
    "gameday",
    "weekday",
    "gametime",
    "away_team",
    "home_team",
    "location",
    "stadium",
  ];
  for (const name of required) {
    if (col[name] == null) throw new Error(`Missing column ${name}`);
  }

  const games = [];
  for (const row of body) {
    if (row[col.season] !== SEASON || row[col.game_type] !== GAME_TYPE) continue;
    const gametime = row[col.gametime];
    const gameday = row[col.gameday];
    if (!gametime || !gameday) {
      throw new Error(`Missing kick-off for ${row[col.game_id]}`);
    }
    games.push({
      id: row[col.game_id],
      week: Number(row[col.week]),
      gameday,
      weekday: row[col.weekday],
      gametimeEt: gametime,
      away: row[col.away_team],
      home: row[col.home_team],
      location: row[col.location],
      stadium: row[col.stadium],
    });
  }

  games.sort(
    (a, b) =>
      a.week - b.week ||
      a.gameday.localeCompare(b.gameday) ||
      a.gametimeEt.localeCompare(b.gametimeEt) ||
      a.id.localeCompare(b.id),
  );

  if (games.length !== 272) {
    throw new Error(`Expected 272 regular-season games, found ${games.length}`);
  }

  const counts = new Map();
  for (const game of games) {
    counts.set(game.away, (counts.get(game.away) ?? 0) + 1);
    counts.set(game.home, (counts.get(game.home) ?? 0) + 1);
  }
  if (counts.size !== 32) {
    throw new Error(`Expected 32 teams, found ${counts.size}`);
  }
  for (const [team, count] of counts) {
    if (count !== 17) throw new Error(`${team} has ${count} games, expected 17`);
  }

  const byId = new Map(games.map((game) => [game.id, game]));
  for (const [id, expected] of SPOT_CHECKS) {
    const game = byId.get(id);
    if (!game) throw new Error(`Spot-check game missing: ${id}`);
    const stamp = londonStamp(easternWallTimeToUtc(game.gameday, game.gametimeEt));
    if (stamp !== expected) {
      throw new Error(`${id} converted to ${stamp}, expected ${expected}`);
    }
    console.log(`spot-check ${id} ${game.away} @ ${game.home} ${game.stadium} → ${stamp}`);
  }

  const tottenham = byId.get("2026_04_IND_WAS");
  if (!tottenham || tottenham.stadium !== "Tottenham Hotspur Stadium" || tottenham.location !== "Neutral") {
    throw new Error("Week 4 London game was not Colts at Commanders, Tottenham, neutral site");
  }

  const payload = {
    source: SOURCE_URL,
    sourceRepo: SOURCE_REPO,
    sourceName: "nflverse nfldata games.csv (Lee Sharpe schedule file)",
    season: 2026,
    gameType: "REG",
    generatedAt: new Date().toISOString(),
    notes:
      "US Eastern wall-clock date and time as published in games.csv. The site converts these to Europe/London. Do not edit fixtures by hand.",
    games,
  };

  await writeFile(OUT, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(`wrote ${games.length} games to ${OUT}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
