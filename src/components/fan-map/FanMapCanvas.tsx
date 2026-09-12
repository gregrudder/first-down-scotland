"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { SCOTLAND_VIEW, UK_MAP_BOUNDS, UK_VIEW } from "@/lib/fan-map/constants";
import { fanGeoJsonClusterOptions } from "@/lib/fan-map/map-clustering";
import type { PublicTown } from "@/lib/fan-map/types";

const FANS_SOURCE = "fans";
const FANS_LAYERS = ["clusters", "cluster-count", "town-points", "town-labels"] as const;

const STYLE_URL =
  process.env.NEXT_PUBLIC_FAN_MAP_STYLE?.trim() ||
  "https://tiles.openfreemap.org/styles/dark";

type FanMapCanvasProps = {
  towns: PublicTown[];
  selectedPlaceId: string | null;
  onSelect: (placeId: string) => void;
  nation: string;
  teamColor?: string;
};

type TownFeature = GeoJSON.Feature<
  GeoJSON.Point,
  { placeId: string; fanCount: number; color: string; townCity: string }
>;

function toCollection(towns: PublicTown[], teamColor?: string): GeoJSON.FeatureCollection<GeoJSON.Point> {
  return {
    type: "FeatureCollection",
    features: towns.map((town) => {
      const color = teamColor || town.leadingTeam?.primary || "#e8b84a";
      return {
        type: "Feature",
        geometry: { type: "Point", coordinates: [town.longitude, town.latitude] },
        properties: {
          placeId: town.placeId,
          fanCount: town.fanCount,
          color,
          townCity: town.townCity,
        },
      } satisfies TownFeature;
    }),
  };
}

function removeFansLayers(map: maplibregl.Map) {
  for (const id of [...FANS_LAYERS].reverse()) {
    if (map.getLayer(id)) map.removeLayer(id);
  }
  if (map.getSource(FANS_SOURCE)) map.removeSource(FANS_SOURCE);
}

function addFansSource(map: maplibregl.Map, towns: PublicTown[], teamColor?: string) {
  removeFansLayers(map);
  map.addSource(FANS_SOURCE, {
    type: "geojson",
    data: toCollection(towns, teamColor),
    ...fanGeoJsonClusterOptions(towns.length),
  });

  map.addLayer({
    id: "clusters",
    type: "circle",
    source: FANS_SOURCE,
    filter: ["has", "point_count"],
    paint: {
      "circle-color": teamColor || "#e8b84a",
      "circle-radius": ["step", ["get", "point_count"], 16, 8, 20, 20, 26],
      "circle-stroke-width": 2,
      "circle-stroke-color": "#0b1220",
      "circle-opacity": 0.92,
    },
  });

  map.addLayer({
    id: "cluster-count",
    type: "symbol",
    source: FANS_SOURCE,
    filter: ["has", "point_count"],
    layout: {
      "text-field": ["get", "point_count_abbreviated"],
      "text-size": 12,
    },
    paint: { "text-color": "#0b1220" },
  });

  map.addLayer({
    id: "town-points",
    type: "circle",
    source: FANS_SOURCE,
    filter: ["!", ["has", "point_count"]],
    paint: {
      "circle-color": ["get", "color"],
      "circle-radius": ["interpolate", ["linear"], ["get", "fanCount"], 1, 7, 8, 12, 24, 16],
      "circle-stroke-width": 2,
      "circle-stroke-color": "#0b1220",
      "circle-opacity": 0.95,
    },
  });

  map.addLayer({
    id: "town-labels",
    type: "symbol",
    source: FANS_SOURCE,
    filter: ["!", ["has", "point_count"]],
    minzoom: 6.2,
    layout: {
      "text-field": ["get", "townCity"],
      "text-size": 11,
      "text-offset": [0, 1.2],
    },
    paint: {
      "text-color": "#f4efe4",
      "text-halo-color": "#0b1220",
      "text-halo-width": 1.2,
    },
  });
}

function applyFansData(
  map: maplibregl.Map,
  towns: PublicTown[],
  teamColor: string | undefined,
  clusteredRef: { current: boolean | null },
) {
  const nextCluster = fanGeoJsonClusterOptions(towns.length).cluster;
  if (!map.getSource(FANS_SOURCE) || clusteredRef.current !== nextCluster) {
    addFansSource(map, towns, teamColor);
    clusteredRef.current = nextCluster;
    return;
  }

  const source = map.getSource(FANS_SOURCE) as maplibregl.GeoJSONSource;
  source.setData(toCollection(towns, teamColor));
  if (map.getLayer("clusters")) {
    map.setPaintProperty("clusters", "circle-color", teamColor || "#e8b84a");
  }
}

export function FanMapCanvas({
  towns,
  selectedPlaceId,
  onSelect,
  nation,
  teamColor,
}: FanMapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const clusteredRef = useRef<boolean | null>(null);
  const onSelectRef = useRef(onSelect);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: STYLE_URL,
      center: [SCOTLAND_VIEW.longitude, SCOTLAND_VIEW.latitude],
      zoom: SCOTLAND_VIEW.zoom,
      attributionControl: { compact: true },
      maxBounds: [
        [UK_MAP_BOUNDS.west - 1.5, UK_MAP_BOUNDS.south - 0.6],
        [UK_MAP_BOUNDS.east + 1.5, UK_MAP_BOUNDS.north + 0.6],
      ],
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

    map.on("load", () => {
      addFansSource(map, towns, teamColor);
      clusteredRef.current = fanGeoJsonClusterOptions(towns.length).cluster;
    });

    map.on("click", "clusters", (event) => {
      const feature = event.features?.[0];
      const source = map.getSource(FANS_SOURCE) as maplibregl.GeoJSONSource | undefined;
      if (!feature || !source) return;
      const clusterId = feature.properties?.cluster_id;
      if (typeof clusterId !== "number") return;
      source.getClusterExpansionZoom(clusterId).then((zoom) => {
        const coords = (feature.geometry as GeoJSON.Point).coordinates as [number, number];
        map.easeTo({ center: coords, zoom });
      });
    });

    map.on("click", "town-points", (event) => {
      const placeId = event.features?.[0]?.properties?.placeId;
      if (typeof placeId === "string") onSelectRef.current(placeId);
    });

    map.on("mouseenter", "clusters", () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "clusters", () => {
      map.getCanvas().style.cursor = "";
    });
    map.on("mouseenter", "town-points", () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "town-points", () => {
      map.getCanvas().style.cursor = "";
    });

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      clusteredRef.current = null;
    };
    // Mount once; data updates happen in the next effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const apply = () => applyFansData(map, towns, teamColor, clusteredRef);
    if (map.isStyleLoaded()) apply();
    else map.once("load", apply);
  }, [towns, teamColor]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (nation === "Scotland") {
      map.easeTo({
        center: [SCOTLAND_VIEW.longitude, SCOTLAND_VIEW.latitude],
        zoom: SCOTLAND_VIEW.zoom,
      });
    } else if (nation === "UK") {
      map.easeTo({ center: [UK_VIEW.longitude, UK_VIEW.latitude], zoom: UK_VIEW.zoom });
    } else {
      const match = towns[0];
      if (match) {
        map.easeTo({ center: [match.longitude, match.latitude], zoom: 6.2 });
      }
    }
  }, [nation, towns]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedPlaceId) return;
    const town = towns.find((item) => item.placeId === selectedPlaceId);
    if (!town) return;
    map.easeTo({ center: [town.longitude, town.latitude], zoom: Math.max(map.getZoom(), 8.4) });
  }, [selectedPlaceId, towns]);

  return (
    <div
      ref={containerRef}
      className="fds-fan-map h-[min(70vh,34rem)] min-h-72 w-full overflow-hidden rounded-2xl border border-line bg-navy-3"
      role="presentation"
    />
  );
}
