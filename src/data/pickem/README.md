# Weekly Pick'em data

The `/pickem` page reads these files. Update them each week. No code change is required.

Do not add sample, demo, or placeholder rows. If a figure was not recorded, leave it out.

## Files

| File | What to edit |
| --- | --- |
| `meta.json` | `activeWeek` is the board shown at the top. |
| `season.json` | Season leaderboard. One row per person who has a real total. |
| `weeks/week-N.json` | That week’s board and, once it is over, the results. |

Kick-off times are not stored here. A board lists nflverse game ids (`2026_04_IND_WAS`). The page looks those ids up in `src/data/kickoff-schedule.json`, which is US Eastern time converted to Europe/London. Refresh that file with `node scripts/build-kickoff-schedule.mjs` when the NFL flexes a game, then check the ids still match.

## `meta.json`

- `activeWeek` (number): the week whose board is on the page.
- `channel`: the Discord channel name. The join button uses the site’s existing invite, not a new link.
- `pointsPerCorrectPick`: `1`.
- `missedWeekPoints`: `0`. A missed week is not a row of zeroes. It scores nothing.
- `counts`: the plain-language rule for which games are on the board.

## `season.json`

- `gamesCounted`: how many games have been scored so far.
- `weeksIncluded`: weeks already in the totals. Week 1 is included as a total only.
- `weeksWithoutContest`: weeks that did not run. Week 2 is `[2]`.
- `weekOneDetailPublished`: keep `false` until a real Week 1 write-up exists. The page will not show a Week 1 table while this is false.
- `standings`: `{ "name", "points" }`. Names are Discord names. Points are season totals. The page sorts by points, then by name. Tied scores stay level.

## `weeks/week-N.json`

The number in the file name must match `week`.

Board (the week people are picking):

```json
{
  "week": 5,
  "countingGameIds": ["2026_05_PHI_JAX"],
  "excludedGameIds": ["2026_05_SOME_TNF"]
}
```

- `countingGameIds`: every game that scores a point, in the order to show them. Sunday games, then the Monday and Tuesday UK-overnight games (Sunday night and Monday night in the US). Leave out Thursday and any other overnight opener.
- `excludedGameIds`: optional. Listed under the board as “not on this board”, with the real kick-off. Do not put them in the picking list.

Results (after the week is scored). Add these fields to the same file. Omit the whole block until the scores are real.

```json
{
  "week": 3,
  "gamesCounted": 15,
  "scores": [
    { "name": "nate_dogg72", "correct": 8 }
  ],
  "caughtFolkOut": "Only if you have the real note, in one sentence."
}
```

- `gamesCounted`: games that counted that week.
- `scores`: one row per person who entered. `correct` is how many they got right, from 0 up to `gamesCounted`.
- `caughtFolkOut`: optional. The pick that caught folk out, written only when you know it. Leave the field out rather than writing “TBD”, “unknown”, or a guess.

There is no `week-1.json` on purpose. Season totals include Week 1. The per-week detail was not recorded here.

## What the page will refuse to show

The loader rejects empty names, placeholder names (`demo`, `sample`, `placeholder`, `lorem`, `TBD`), a Week 1 results file while `weekOneDetailPublished` is false, and a results file for a week listed in `weeksWithoutContest`.
