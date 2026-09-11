import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { detectFlip, flipBanter, leadingTeamForTown } from "./battles";
import type { FanMapAggregateRow } from "./types";

function row(team: string, placeId = "wishaw"): FanMapAggregateRow {
  return {
    teamAbbreviation: team,
    nation: "Scotland",
    regionOrCouncilArea: "North Lanarkshire",
    townCity: "Wishaw",
    placeId,
    placeLabel: "Wishaw",
    latitude: 55.77,
    longitude: -3.92,
    yearsFollowing: null,
    watchPartyInterest: null,
    createdAt: "2026-09-11T12:00:00.000Z",
  };
}

describe("detectFlip", () => {
  it("claims a town when it first meets the threshold", () => {
    const flip = detectFlip(
      { leadingTeam: null, meets: false, fanCount: 2 },
      { leadingTeam: "PIT", meets: true, fanCount: 3 },
    );
    assert.deepEqual(flip, { fromTeam: null, toTeam: "PIT" });
  });

  it("records a takeover when the leading scheme changes", () => {
    const flip = detectFlip(
      { leadingTeam: "PIT", meets: true, fanCount: 3 },
      { leadingTeam: "SEA", meets: true, fanCount: 4 },
    );
    assert.deepEqual(flip, { fromTeam: "PIT", toTeam: "SEA" });
  });

  it("records a vacant town when it drops below the threshold", () => {
    const flip = detectFlip(
      { leadingTeam: "PIT", meets: true, fanCount: 3 },
      { leadingTeam: null, meets: false, fanCount: 2 },
    );
    assert.deepEqual(flip, { fromTeam: "PIT", toTeam: null });
  });

  it("ignores noise below the threshold", () => {
    assert.equal(
      detectFlip(
        { leadingTeam: null, meets: false, fanCount: 1 },
        { leadingTeam: null, meets: false, fanCount: 2 },
      ),
      null,
    );
  });
});

describe("leadingTeamForTown", () => {
  it("hides the leader below three fans", () => {
    const lead = leadingTeamForTown([row("PIT"), row("PIT")], "wishaw", 3);
    assert.equal(lead.meets, false);
    assert.equal(lead.leadingTeam, null);
  });
});

describe("flipBanter", () => {
  it("uses takeover, on-the-run and take-an-L language", () => {
    const text = flipBanter("PIT", "SEA", "Wishaw");
    assert.match(text, /Wishaw/);
    assert.match(text, /Seahawks|Steelers|took over|on the run|take an L|scheme taken over|scheme/i);
  });

  it("covers a first claim and a vacant town", () => {
    assert.match(flipBanter(null, "GB", "Motherwell"), /Packers|Motherwell|scheme|claimed|planted|took over/);
    assert.match(flipBanter("KC", null, "Wishaw"), /Chiefs|Wishaw|L|vacant|on the run|grabs/);
  });
});
