import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { kickoffIntroWordCount } from "@/data/kickoff-planner-copy";
import {
  easternWallTimeToUtc,
  formatKickoffUk,
  gameById,
  getKickoffGames,
  londonParts,
  viewingWindow,
  weekForInstant,
} from "@/lib/uk-kickoff";

function utc(gameday: string, gametime: string): string {
  return easternWallTimeToUtc(gameday, gametime).toISOString();
}

describe("UK kick-off conversion", () => {
  it("converts Week 4 Eastern times to the published UK clock", () => {
    assert.equal(utc("2026-10-04", "09:30"), "2026-10-04T13:30:00.000Z");
    assert.equal(utc("2026-10-01", "20:15"), "2026-10-02T00:15:00.000Z");
    assert.equal(utc("2026-10-04", "20:20"), "2026-10-05T00:20:00.000Z");
    assert.equal(utc("2026-10-05", "20:15"), "2026-10-06T00:15:00.000Z");

    assert.equal(formatKickoffUk("2026-10-04T13:30:00.000Z"), "Sunday 4 October · 14:30 BST");
    assert.equal(formatKickoffUk("2026-10-02T00:15:00.000Z"), "Friday 2 October · 01:15 BST");
    assert.equal(formatKickoffUk("2026-10-05T00:20:00.000Z"), "Monday 5 October · 01:20 BST");
    assert.equal(formatKickoffUk("2026-10-06T00:15:00.000Z"), "Tuesday 6 October · 01:15 BST");
  });

  it("moves the Sunday 25 October slate back an hour when the UK clocks change", () => {
    const before = londonParts(easternWallTimeToUtc("2026-10-22", "20:15"));
    assert.equal(`${before.dateKey} ${before.hour}:${before.minute} ${before.zone}`, "2026-10-23 01:15 BST");

    const afternoon = londonParts(easternWallTimeToUtc("2026-10-25", "09:30"));
    assert.equal(
      `${afternoon.dateKey} ${afternoon.hour}:${afternoon.minute} ${afternoon.zone}`,
      "2026-10-25 13:30 GMT",
    );

    const teaTime = londonParts(easternWallTimeToUtc("2026-10-25", "13:00"));
    assert.equal(
      `${teaTime.dateKey} ${teaTime.hour}:${teaTime.minute} ${teaTime.zone}`,
      "2026-10-25 17:00 GMT",
    );

    const overnight = londonParts(easternWallTimeToUtc("2026-10-25", "20:20"));
    assert.equal(
      `${overnight.dateKey} ${overnight.hour}:${overnight.minute} ${overnight.zone}`,
      "2026-10-26 00:20 GMT",
    );

    const restored = londonParts(easternWallTimeToUtc("2026-11-01", "13:00"));
    assert.equal(
      `${restored.dateKey} ${restored.hour}:${restored.minute} ${restored.zone}`,
      "2026-11-01 18:00 GMT",
    );
  });

  it("tags the stored 2026 slate, including the clock-change week", () => {
    const london = gameById("2026_04_IND_WAS");
    const steelers = gameById("2026_04_PIT_CLE");
    const lions = gameById("2026_04_DET_CAR");
    const falcons = gameById("2026_04_ATL_NO");
    const paris = gameById("2026_07_PIT_NO");
    const late = gameById("2026_15_SEA_PHI");
    assert.ok(london && steelers && lions && falcons && paris && late);

    assert.equal(london.windowId, "international-afternoon");
    assert.equal(london.international, true);
    assert.equal(london.stadium, "Tottenham Hotspur Stadium");
    assert.equal(steelers.windowId, "overnight");
    assert.equal(lions.windowId, "overnight");
    assert.equal(falcons.windowId, "overnight");
    assert.equal(paris.windowId, "international-afternoon");
    assert.equal(viewingWindow(paris.kickoffUtc, true), "international-afternoon");
    assert.equal(late.windowId, "late-night");

    const tea = gameById("2026_07_SF_ATL");
    assert.ok(tea);
    assert.equal(tea.windowId, "tea-time");
    assert.equal(formatKickoffUk(tea.kickoffUtc), "Sunday 25 October · 17:00 GMT");

    for (const game of getKickoffGames()) {
      if (game.windowId === "international-afternoon") {
        assert.equal(game.international, true, game.id);
      }
    }
    assert.equal(getKickoffGames().length, 272);
  });

  it("treats the week of 30 September 2026 as Week 4", () => {
    assert.equal(weekForInstant(new Date("2026-09-30T12:00:00.000Z")), 4);
  });

  it("keeps the planner intro in the useful range", () => {
    const words = kickoffIntroWordCount();
    assert.ok(words >= 150 && words <= 300, `intro is ${words} words`);
  });
});
