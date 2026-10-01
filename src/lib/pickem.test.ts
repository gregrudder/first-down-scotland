import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { entriesCloseAt, loadPickem, rankByScore, sortByScoreThenName } from "@/lib/pickem";
import { formatKickoffUk } from "@/lib/uk-kickoff";

const SEASON = [
  ["nate_dogg72", 17],
  ["Michael Thain", 16],
  ["Ben Smith", 11],
  ["Funkyjedi", 11],
  ["Fightmilk", 10],
  ["Liamt608", 10],
  ["slazz72", 10],
  ["Dave-DJDingle", 9],
  ["MartynB93", 9],
  ["Lewis Greig", 8],
  ["Nelson207", 7],
  ["Saintz", 6],
] as const;

describe("Pick'em leaderboard", () => {
  it("sorts by points, then name, without mutating the input", () => {
    const input = [
      { name: "Saintz", points: 6 },
      { name: "Funkyjedi", points: 11 },
      { name: "nate_dogg72", points: 17 },
      { name: "slazz72", points: 10 },
      { name: "Ben Smith", points: 11 },
      { name: "Michael Thain", points: 6 },
      { name: "Fightmilk", points: 10 },
    ];
    const snapshot = input.map((row) => ({ ...row }));
    const sorted = sortByScoreThenName(input, (row) => row.points, (row) => row.name);
    assert.deepEqual(
      sorted.map((row) => row.name),
      ["nate_dogg72", "Ben Smith", "Funkyjedi", "Fightmilk", "slazz72", "Michael Thain", "Saintz"],
    );
    assert.deepEqual(input, snapshot);

    const reversedTie = sortByScoreThenName(
      [
        { name: "Saintz", correct: 6 },
        { name: "Michael Thain", correct: 6 },
      ],
      (row) => row.correct,
      (row) => row.name,
    );
    assert.deepEqual(
      reversedTie.map((row) => row.name),
      ["Michael Thain", "Saintz"],
    );
  });

  it("gives tied scores the same rank", () => {
    const ranked = rankByScore(
      SEASON.map(([name, points]) => ({ name, points })),
      (row) => row.points,
    );
    assert.deepEqual(
      ranked.map((row) => [row.rank, row.name, row.points]),
      [
        [1, "nate_dogg72", 17],
        [2, "Michael Thain", 16],
        [3, "Ben Smith", 11],
        [3, "Funkyjedi", 11],
        [5, "Fightmilk", 10],
        [5, "Liamt608", 10],
        [5, "slazz72", 10],
        [8, "Dave-DJDingle", 9],
        [8, "MartynB93", 9],
        [10, "Lewis Greig", 8],
        [11, "Nelson207", 7],
        [12, "Saintz", 6],
      ],
    );
  });

  it("loads only the recorded season totals, Week 3 results and Week 4 board", () => {
    const pickem = loadPickem();
    assert.deepEqual(
      pickem.standings.map((row) => [row.name, row.points]),
      SEASON.map(([name, points]) => [name, points]),
    );
    assert.equal(pickem.gamesCounted, 29);
    assert.deepEqual(pickem.weeksIncluded, [1, 3]);
    assert.deepEqual(pickem.weeksWithoutContest, [2]);
    assert.equal(pickem.weekOneDetailPublished, false);
    assert.equal(
      pickem.results.some((week) => week.week === 1),
      false,
    );

    const week3 = pickem.results.find((week) => week.week === 3);
    assert.ok(week3);
    assert.equal(week3.gamesCounted, 15);
    assert.equal(week3.caughtFolkOut, undefined);
    assert.deepEqual(
      week3.scores.map((row) => [row.name, row.correct]),
      [
        ["nate_dogg72", 8],
        ["Nelson207", 7],
        ["Michael Thain", 6],
        ["Saintz", 6],
      ],
    );

    assert.equal(pickem.board.week, 4);
    assert.equal(pickem.board.countingGames.length, 15);
    assert.equal(pickem.board.scores.length, 0);
    assert.deepEqual(
      pickem.board.excludedGames.map((game) => game.id),
      ["2026_04_PIT_CLE"],
    );
    assert.equal(
      pickem.board.countingGames.some((game) => game.id === "2026_04_PIT_CLE"),
      false,
    );

    const close = entriesCloseAt(pickem.board);
    assert.ok(close);
    assert.equal(close.id, "2026_04_IND_WAS");
    assert.equal(formatKickoffUk(close.kickoffUtc), "Sunday 4 October · 14:30 BST");
  });
});
