/**
 * Build a static NFL final-score frequency table from the public nflverse
 * schedule file (Lee Sharpe / nfldata games.csv).
 *
 * This is not a scrape of Scoreogami. Runtime pages read the committed JSON
 * only. Re-run when you want a fresher snapshot:
 *
 *   node scripts/build-score-history.mjs
 */
import { writeFile } from "node:fs/promises";
import path from "node:path";

const SOURCE_URL =
  "https://raw.githubusercontent.com/nflverse/nfldata/master/data/games.csv";
const SOURCE_REPO = "https://github.com/nflverse/nfldata";
const OUT_FULL = path.resolve(import.meta.dirname, "../src/data/score-history.json");

const KEEP_TYPES = new Set(["REG", "WC", "DIV", "CON", "SB"]);
const EXAMPLE_LIMIT = 6;

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

function asInt(value) {
  if (value === "" || value == null) return null;
  const number = Number(value);
  return Number.isInteger(number) ? number : null;
}

function tuple(game) {
  return [game.season, game.week, game.gameType, game.date, game.away, game.home, game.awayScore, game.homeScore];
}

function compareGames(a, b) {
  return a.date.localeCompare(b.date) || a.season - b.season || a.week - b.week;
}

async function main() {
  const response = await fetch(SOURCE_URL, {
    headers: { Accept: "text/csv" },
  });
  if (!response.ok) {
    throw new Error(`nflverse games.csv returned ${response.status}`);
  }
  const csv = await response.text();
  const [header, ...body] = parseCsv(csv);
  const col = Object.fromEntries(header.map((name, index) => [name, index]));

  const required = ["season", "game_type", "week", "gameday", "away_team", "home_team", "away_score", "home_score"];
  for (const name of required) {
    if (col[name] == null) throw new Error(`Missing column ${name}`);
  }

  const games = [];
  for (const row of body) {
    const gameType = row[col.game_type];
    if (!KEEP_TYPES.has(gameType)) continue;
    const awayScore = asInt(row[col.away_score]);
    const homeScore = asInt(row[col.home_score]);
    if (awayScore == null || homeScore == null || awayScore < 0 || homeScore < 0) continue;
    const season = asInt(row[col.season]);
    const week = asInt(row[col.week]);
    const date = row[col.gameday];
    const away = row[col.away_team];
    const home = row[col.home_team];
    if (season == null || week == null || !date || !away || !home) continue;
    games.push({ season, week, gameType, date, away, home, awayScore, homeScore });
  }

  games.sort(compareGames);

  const lines = new Map();
  const homeAway = new Map();

  for (const game of games) {
    const high = Math.max(game.homeScore, game.awayScore);
    const low = Math.min(game.homeScore, game.awayScore);
    const lineKey = `${high}-${low}`;
    const haKey = `${game.homeScore}-${game.awayScore}`;
    const packed = tuple(game);

    const line = lines.get(lineKey) ?? { n: 0, first: packed, last: packed, ex: [] };
    line.n += 1;
    line.last = packed;
    line.ex.push(packed);
    if (line.ex.length > EXAMPLE_LIMIT) line.ex.shift();
    lines.set(lineKey, line);

    const ha = homeAway.get(haKey) ?? { n: 0, first: packed, last: packed };
    ha.n += 1;
    ha.last = packed;
    homeAway.set(haKey, ha);
  }

  const lineEntries = [...lines.entries()].sort((a, b) => b[1].n - a[1].n || a[0].localeCompare(b[0]));
  const common = lineEntries.slice(0, 12).map(([key]) => key);
  const onceRecent = lineEntries
    .filter(([, value]) => value.n === 1)
    .sort((a, b) => b[1].last[3].localeCompare(a[1].last[3]))
    .slice(0, 16)
    .map(([key]) => key);

  const seasons = games.map((game) => game.season);
  const meta = {
    sourceName: "nflverse nfldata games.csv (Lee Sharpe schedule file)",
    sourceRepo: SOURCE_REPO,
    sourceFile: SOURCE_URL,
    builtAt: new Date().toISOString().slice(0, 10),
    seasonFrom: Math.min(...seasons),
    seasonTo: Math.max(...seasons),
    gameCount: games.length,
    lineCount: lines.size,
    homeAwayCount: homeAway.size,
    includes:
      "Completed regular-season and postseason NFL games in the public nflverse schedule file. Preseason is not in that file. Future or missing box scores are dropped.",
  };

  const full = {
    meta,
    lines: Object.fromEntries(lineEntries),
    homeAway: Object.fromEntries(
      [...homeAway.entries()].sort((a, b) => b[1].n - a[1].n || a[0].localeCompare(b[0])),
    ),
    common,
    onceRecent,
  };

  await writeFile(OUT_FULL, `${JSON.stringify(full)}\n`);
  console.log(
    `Wrote ${games.length} games, ${lines.size} winner-loser lines, ${homeAway.size} home-away pairs (${meta.seasonFrom}–${meta.seasonTo})`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
