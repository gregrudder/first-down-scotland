import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildHotspot, buildPublicFanMap } from "./aggregates";
import type { FanMapAggregateRow } from "./types";

function row(
  overrides: Partial<FanMapAggregateRow> & Pick<FanMapAggregateRow, "placeId" | "townCity" | "teamAbbreviation">,
): FanMapAggregateRow {
  return {
    nation: "Scotland",
    regionOrCouncilArea: "North Lanarkshire",
    placeLabel: overrides.townCity,
    latitude: 55.77,
    longitude: -3.92,
    yearsFollowing: null,
    watchPartyInterest: null,
    createdAt: "2026-09-01T12:00:00.000Z",
    ...overrides,
  };
}

describe("buildPublicFanMap", () => {
  it("hides per-team breakdown below the privacy threshold", () => {
    const map = buildPublicFanMap(
      [
        row({ placeId: "wishaw", townCity: "Wishaw", teamAbbreviation: "PIT", latitude: 55.774, longitude: -3.921 }),
        row({ placeId: "wishaw", townCity: "Wishaw", teamAbbreviation: "SEA", latitude: 55.774, longitude: -3.921 }),
      ],
      3,
    );
    assert.equal(map.counters.fans, 2);
    assert.equal(map.towns[0]?.teams, null);
    assert.equal(map.towns[0]?.leadingTeam, null);
    assert.equal(map.whoOwnsScotland.towns.length, 0);
    assert.equal(map.whoOwnsScotland.owner?.abbreviation, "PIT");
  });

  it("colours a Scottish town by the leading team once the threshold is met", () => {
    const map = buildPublicFanMap(
      [
        row({ placeId: "wishaw", townCity: "Wishaw", teamAbbreviation: "PIT" }),
        row({ placeId: "wishaw", townCity: "Wishaw", teamAbbreviation: "PIT" }),
        row({ placeId: "wishaw", townCity: "Wishaw", teamAbbreviation: "SEA" }),
      ],
      3,
    );
    assert.equal(map.towns[0]?.leadingTeam?.abbreviation, "PIT");
    assert.equal(map.whoOwnsScotland.towns[0]?.leadingTeam.abbreviation, "PIT");
    assert.equal(map.leaderboards.scotland[0]?.abbreviation, "PIT");
    assert.equal(map.leaderboards.scotland[0]?.count, 2);
    assert.equal(map.schemeBattles.scotlandTownsOwned[0]?.abbreviation, "PIT");
    assert.equal(map.schemeBattles.scotlandTownsOwned[0]?.townCount, 1);
    assert.equal(map.schemeBattles.ukTownsOwned[0]?.abbreviation, "PIT");
  });

  it("counts nearby fans from town centres only", () => {
    const map = buildPublicFanMap(
      [
        row({
          placeId: "wishaw",
          townCity: "Wishaw",
          teamAbbreviation: "PIT",
          latitude: 55.774,
          longitude: -3.921,
        }),
        row({
          placeId: "wishaw",
          townCity: "Wishaw",
          teamAbbreviation: "PIT",
          latitude: 55.774,
          longitude: -3.921,
        }),
        row({
          placeId: "wishaw",
          townCity: "Wishaw",
          teamAbbreviation: "PIT",
          latitude: 55.774,
          longitude: -3.921,
        }),
        row({
          placeId: "motherwell",
          townCity: "Motherwell",
          teamAbbreviation: "GB",
          latitude: 55.789,
          longitude: -3.992,
          regionOrCouncilArea: "North Lanarkshire",
        }),
      ],
      3,
    );
    const wishaw = map.towns.find((town) => town.placeId === "wishaw");
    assert.ok(wishaw);
    assert.equal(wishaw.nearby[0]?.townCity, "Motherwell");
    assert.ok(wishaw.fansWithin15Miles >= 4);
  });
});

describe("buildHotspot", () => {
  it("counts registrations whose town centres sit inside the radius", () => {
    const hotspot = buildHotspot(
      [
        row({ placeId: "wishaw", townCity: "Wishaw", teamAbbreviation: "PIT", latitude: 55.774, longitude: -3.921 }),
        row({
          placeId: "motherwell",
          townCity: "Motherwell",
          teamAbbreviation: "SEA",
          latitude: 55.789,
          longitude: -3.992,
        }),
        row({
          placeId: "london",
          townCity: "London",
          teamAbbreviation: "KC",
          nation: "England",
          regionOrCouncilArea: "Greater London",
          latitude: 51.507,
          longitude: -0.128,
        }),
      ],
      "wishaw",
      10,
    );
    assert.ok(hotspot);
    assert.equal(hotspot.fans, 2);
    assert.equal(hotspot.towns, 2);
    assert.ok(!hotspot.nearbyTowns.some((town) => town.placeId === "london"));
  });
});
