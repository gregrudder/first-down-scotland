/** Skip clustering while the map is sparse so Scotland’s default zoom (5.6) shows team colours. */
export const CLUSTER_MIN_TOWNS = 16;

/** Dense maps still cluster through zoom 8; unclustered points keep per-town colours. */
export const CLUSTER_MAX_ZOOM = 8;
export const CLUSTER_RADIUS = 46;

export function shouldClusterTowns(townCount: number): boolean {
  return townCount >= CLUSTER_MIN_TOWNS;
}

export function fanGeoJsonClusterOptions(townCount: number): {
  cluster: boolean;
  clusterMaxZoom: number;
  clusterRadius: number;
} {
  return {
    cluster: shouldClusterTowns(townCount),
    clusterMaxZoom: CLUSTER_MAX_ZOOM,
    clusterRadius: CLUSTER_RADIUS,
  };
}
