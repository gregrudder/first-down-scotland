import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { entriesCloseAt, loadPickem, rankByScore, sortByScoreThenName } from "@/lib/pickem";
import { formatKickoffUk } from "@/lib/uk-kickoff";

const SEASON = [
  ["nate_dogg72", 24],
  ["Michael Thain", 23],
  ["Funkyjedi", 20],
  ["Liamt608", 20],
  ["Dave-DJDingle", 19],
  ["slazz72", 18],
  ["Ben Smith", 11],
  ["Fightmilk", 10],
  ["MartynB93", 9],
  ["Lewis Greig", 8],
  ["Ted", 8],
  ["williamm1690", 8],
  ["Ali", 7],
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
        [1, "nate_dogg72", 24],
        [2, "Michael Thain", 23],
        [3, "Funkyjedi", 20],
        [3, "Liamt608", 20],
        [5, "Dave-DJDingle", 19],
        [6, "slazz72", 18],
        [7, "Ben Smith", 11],
        [8, "Fightmilk", 10],
        [9, "MartynB93", 9],
        [10, "Lewis Greig", 8],
        [10, "Ted", 8],
        [10, "williamm1690", 8],
        [13, "Ali", 7],
        [13, "Nelson207", 7],
        [15, "Saintz", 6],
      ],
    );
  });

  it("loads the recorded season totals, Week 3 and Week 4 results, and the Week 4 board", () => {
    const pickem = loadPickem();
    assert.deepEqual(
      pickem.standings.map((row) => [row.name, row.points]),
      SEASON.map(([name, points]) => [name, points]),
    );
    assert.equal(pickem.gamesCounted, 44);
    assert.deepEqual(pickem.weeksIncluded, [1, 3, 4]);
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

    const week4 = pickem.results.find((week) => week.week === 4);
    assert.ok(week4);
    assert.equal(week4.gamesCounted, 15);
    assert.equal(
      week4.caughtFolkOut,
      "Nobody picked the Patriots or the Panthers; Dave-DJDingle was the only entrant to back Atlanta on Monday night.",
    );
    assert.deepEqual(
      week4.scores.map((row) => [row.name, row.correct]),
      [
        ["Dave-DJDingle", 10],
        ["Liamt608", 10],
        ["Funkyjedi", 9],
        ["slazz72", 8],
        ["Ted", 8],
        ["williamm1690", 8],
        ["Ali", 7],
        ["Michael Thain", 7],
        ["nate_dogg72", 7],
      ],
    );
    assert.equal(
      week4.scores.some((row) => row.name === "Nelson207"),
      false,
    );

    assert.equal(pickem.board.week, 4);
    assert.equal(pickem.board.countingGames.length, 15);
    assert.equal(pickem.board.gamesCounted, 15);
    assert.equal(pickem.board.scores.length, 9);
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
