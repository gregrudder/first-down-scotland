import { revalidatePath, revalidateTag } from "next/cache";
import {
  buildAdminStats,
  buildHotspot,
  buildPublicFanMap,
  emptyPublicFanMap,
} from "@/lib/fan-map/aggregates";
import { privacyThreshold } from "@/lib/fan-map/constants";
import { isFanMapDbConfigured, listAggregateRows, listFlips } from "@/lib/fan-map/db";
import type { AdminStats, HotspotResult, PublicFanMap } from "@/lib/fan-map/types";

export const FAN_MAP_CACHE_TAG = "fan-map";

export async function getPublicFanMap(): Promise<PublicFanMap> {
  const threshold = privacyThreshold();
  if (!isFanMapDbConfigured()) {
    return emptyPublicFanMap(false, threshold);
  }
  try {
    const [rows, flips] = await Promise.all([listAggregateRows(), listFlips(24)]);
    const map = buildPublicFanMap(rows, threshold, true);
    map.schemeBattles.flips = flips;
    return map;
  } catch (error) {
    console.error("[fan-map] public aggregate failed", error);
    return emptyPublicFanMap(true, threshold);
  }
}

export async function getAdminStats(): Promise<AdminStats> {
  const threshold = privacyThreshold();
  if (!isFanMapDbConfigured()) {
    return buildAdminStats([], threshold, false);
  }
  const rows = await listAggregateRows();
  return buildAdminStats(rows, threshold, true);
}

export async function getHotspot(placeId: string, miles: number): Promise<HotspotResult | null> {
  if (!isFanMapDbConfigured()) return null;
  const rows = await listAggregateRows();
  return buildHotspot(rows, placeId, miles);
}

export function bustFanMapCache(): void {
  revalidateTag(FAN_MAP_CACHE_TAG, "max");
  revalidatePath("/fan-map");
  revalidatePath("/fan-map/add");
  revalidatePath("/");
}
