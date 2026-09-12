import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Supercluster from "supercluster";
import {
  CLUSTER_MAX_ZOOM,
  CLUSTER_MIN_TOWNS,
  CLUSTER_RADIUS,
  fanGeoJsonClusterOptions,
  shouldClusterTowns,
} from "./map-clustering";

/** Live production pins as of the sparse-map bug (four Lanarkshire towns + Inverness). */
const PROD_TOWNS = [
  { townCity: "East Kilbride", longitude: -4.1777, latitude: 55.7606 },
  { townCity: "Hamilton", longitude: -4.0334, latitude: 55.7759 },
  { townCity: "Inverness", longitude: -4.2257, latitude: 57.479 },
  { townCity: "Stonehouse", longitude: -3.9814, latitude: 55.6982 },
  { townCity: "Wishaw", longitude: -3.9184, latitude: 55.7743 },
];

const SCOTLAND_BBOX: [number, number, number, number] = [-8.5, 54.4, 0.2, 59.5];
/** MapLibre re-evaluates Supercluster at integer zooms; 5.6 uses zoom 5. */
const SCOTLAND_INTEGER_ZOOM = 5;

function asFeatures() {
  return PROD_TOWNS.map((town) => ({
    type: "Feature" as const,
    properties: { townCity: town.townCity },
    geometry: { type: "Point" as const, coordinates: [town.longitude, town.latitude] },
  }));
}

describe("shouldClusterTowns", () => {
  it("leaves a handful of towns unclustered, including current production", () => {
    assert.equal(shouldClusterTowns(0), false);
    assert.equal(shouldClusterTowns(5), false);
    assert.equal(shouldClusterTowns(CLUSTER_MIN_TOWNS - 1), false);
  });

  it("turns clustering on once the map is dense enough", () => {
    assert.equal(shouldClusterTowns(CLUSTER_MIN_TOWNS), true);
    assert.equal(shouldClusterTowns(48), true);
  });
});

describe("fanGeoJsonClusterOptions", () => {
  it("disables Supercluster below the town threshold and keeps dense-map settings", () => {
    assert.deepEqual(fanGeoJsonClusterOptions(5), {
      cluster: false,
      clusterMaxZoom: CLUSTER_MAX_ZOOM,
      clusterRadius: CLUSTER_RADIUS,
    });
    assert.deepEqual(fanGeoJsonClusterOptions(CLUSTER_MIN_TOWNS), {
      cluster: true,
      clusterMaxZoom: 8,
      clusterRadius: 46,
    });
  });
});

describe("Scotland default zoom clustering", () => {
  it("collapses nearby Lanarkshire towns into a cluster with the previous always-on settings", () => {
    const index = new Supercluster({ radius: 46, maxZoom: 8 });
    index.load(asFeatures());
    const features = index.getClusters(SCOTLAND_BBOX, SCOTLAND_INTEGER_ZOOM);
    const clusters = features.filter((feature) => feature.properties?.cluster);
    assert.ok(clusters.length >= 1, "expected a cluster over the Central Belt");
    assert.ok(features.length < PROD_TOWNS.length);
  });

  it("does not enable Supercluster for the current five production towns", () => {
    assert.equal(fanGeoJsonClusterOptions(PROD_TOWNS.length).cluster, false);
  });
});
