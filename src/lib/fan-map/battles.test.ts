import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CLAIM_POOL,
  TAKEOVER_POOL,
  detectFlip,
  fillFlipTemplate,
  flipBanter,
  leadingTeamForTown,
  territoryHeadline,
} from "./battles";
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

describe("territoryHeadline", () => {
  it("shouts a takeover and a first claim", () => {
    assert.equal(
      territoryHeadline("SF", "GB", "Motherwell"),
      "PACKERS HAVE TAKEN MOTHERWELL FROM THE 49ERS",
    );
    assert.equal(territoryHeadline(null, "GB", "Motherwell"), "PACKERS HAVE CLAIMED MOTHERWELL");
  });
});

describe("flipBanter", () => {
  it("fills Greg’s takeover lines with FDS short names", () => {
    assert.equal(
      fillFlipTemplate("{A} just took {town} off the {B}. New firm in the scheme.", "SF", "GB", "Motherwell"),
      "Packers just took Motherwell off the 49ers. New firm in the scheme.",
    );
    assert.equal(
      fillFlipTemplate("That’s the {A}’s scheme now. {town} used to be {B} turf.", "SEA", "GB", "Wishaw"),
      "That’s the Packers’ scheme now. Wishaw used to be Seahawks turf.",
    );
    assert.equal(
      fillFlipTemplate("🚨 {A} TAKE {TOWN} — {B} out the scheme", "SF", "GB", "Motherwell"),
      "🚨 Packers TAKE MOTHERWELL — 49ers out the scheme",
    );
    assert.equal(
      fillFlipTemplate("{B} are on the run — the {A} have took over {town}.", "SF", "GB", "Motherwell"),
      "49ers are on the run — the Packers have took over Motherwell.",
    );
    assert.equal(
      fillFlipTemplate("{B} on the run — {A} just took over {town}.", "SF", "GB", "Wishaw"),
      "49ers on the run — Packers just took over Wishaw.",
    );
    assert.equal(
      fillFlipTemplate("The {B} take an L as their scheme has been taken over by the {A}.", "SF", "GB", "Motherwell"),
      "The 49ers take an L as their scheme has been taken over by the Packers.",
    );
    assert.equal(
      fillFlipTemplate("The {B} take an L as their {town} scheme has been taken over by the {A}.", "SF", "GB", "Motherwell"),
      "The 49ers take an L as their Motherwell scheme has been taken over by the Packers.",
    );
  });

  it("fills first-claim lines", () => {
    assert.equal(
      fillFlipTemplate("{A} just put {town} on the map. This scheme’s spoken for.", null, "MIA", "Wishaw"),
      "Dolphins just put Wishaw on the map. This scheme’s spoken for.",
    );
    assert.equal(
      fillFlipTemplate("{town} claimed — {A} are running it.", null, "MIA", "Wishaw"),
      "Wishaw claimed — Dolphins are running it.",
    );
  });

  it("rotates a stored line from the approved pools", () => {
    const takeover = flipBanter("PIT", "SEA", "Wishaw");
    const filledTakeovers = TAKEOVER_POOL.map((line) => fillFlipTemplate(line, "PIT", "SEA", "Wishaw"));
    assert.ok(filledTakeovers.includes(takeover), takeover);

    const claim = flipBanter(null, "GB", "Motherwell");
    const filledClaims = CLAIM_POOL.map((line) => fillFlipTemplate(line, null, "GB", "Motherwell"));
    assert.ok(filledClaims.includes(claim), claim);

    assert.match(flipBanter("KC", null, "Wishaw"), /Chiefs|Wishaw|L|vacant|on the run|grabs/);
  });
});
