import type { UkNation, WatchPartyId, YearsFollowingId } from "@/lib/fan-map/constants";

export type FanMapPlace = {
  placeId: string;
  label: string;
  country: string;
  nation: UkNation;
  regionOrCouncilArea: string;
  townCity: string;
  latitude: number;
  longitude: number;
};

export type FanMapRegistrationInput = {
  teamAbbreviation: string;
  place: FanMapPlace;
  yearsFollowing?: YearsFollowingId;
  watchPartyInterest?: WatchPartyId;
};

export type FanMapRegistrationRow = {
  id: string;
  userId: string;
  teamAbbreviation: string;
  country: string;
  nation: UkNation;
  regionOrCouncilArea: string;
  townCity: string;
  placeId: string;
  placeLabel: string;
  latitude: number;
  longitude: number;
  yearsFollowing: YearsFollowingId | null;
  watchPartyInterest: WatchPartyId | null;
  createdAt: string;
  updatedAt: string;
};

/** Non-PII row used for public and admin aggregates. */
export type FanMapAggregateRow = {
  teamAbbreviation: string;
  nation: UkNation;
  regionOrCouncilArea: string;
  townCity: string;
  placeId: string;
  placeLabel: string;
  latitude: number;
  longitude: number;
  yearsFollowing: YearsFollowingId | null;
  watchPartyInterest: WatchPartyId | null;
  createdAt: string;
};

export type TeamCount = {
  abbreviation: string;
  name: string;
  shortName: string;
  primary: string;
  secondary: string;
  count: number;
  percent: number;
};

export type NearbyTown = {
  placeId: string;
  townCity: string;
  nation: UkNation;
  miles: number;
  fanCount: number;
};

export type PublicTown = {
  placeId: string;
  townCity: string;
  nation: UkNation;
  regionOrCouncilArea: string;
  latitude: number;
  longitude: number;
  fanCount: number;
  watchPartyYes: number;
  watchPartyMaybe: number;
  /** Null when the town is below the privacy threshold. */
  teams: TeamCount[] | null;
  leadingTeam: TeamCount | null;
  nearby: NearbyTown[];
  fansWithin15Miles: number;
  meetsPrivacyThreshold: boolean;
};

export type PublicFanMap = {
  configured: boolean;
  privacyThreshold: number;
  generatedAt: string;
  counters: {
    fans: number;
    towns: number;
    teams: number;
  };
  nations: Array<{
    id: UkNation;
    label: UkNation;
    fans: number;
    towns: number;
  }>;
  leaderboards: {
    scotland: TeamCount[];
    uk: TeamCount[];
  };
  whoOwnsScotland: {
    owner: TeamCount | null;
    townsLed: Array<TeamCount & { townCount: number }>;
    towns: Array<{
      placeId: string;
      townCity: string;
      regionOrCouncilArea: string;
      fanCount: number;
      leadingTeam: TeamCount;
      latitude: number;
      longitude: number;
    }>;
  };
  towns: PublicTown[];
  councils: Array<{
    regionOrCouncilArea: string;
    nation: UkNation;
    fanCount: number;
    townCount: number;
    teams: TeamCount[] | null;
  }>;
  schemeBattles: {
    scotlandTownsOwned: Array<TeamCount & { townCount: number }>;
    ukTownsOwned: Array<TeamCount & { townCount: number }>;
    flips: SchemeFlip[];
  };
};

export type SchemeFlip = {
  id: string;
  placeId: string;
  townCity: string;
  nation: UkNation;
  fromTeam: string | null;
  toTeam: string | null;
  message: string;
  createdAt: string;
};

export type FanMapSession = {
  fanId: string;
};

export type FanMapMe = {
  configured: boolean;
  session: FanMapSession | null;
  registration: FanMapRegistrationRow | null;
};

export type AdminPin = {
  id: string;
  teamAbbreviation: string;
  nation: UkNation;
  regionOrCouncilArea: string;
  townCity: string;
  placeId: string;
  createdAt: string;
  updatedAt: string;
  hidden: boolean;
};

export type AdminStats = {
  configured: boolean;
  privacyThreshold: number;
  totals: {
    fans: number;
    towns: number;
    teams: number;
    councils: number;
    hidden: number;
    watchPartyYes: number;
    watchPartyMaybe: number;
    watchPartyNo: number;
    watchPartyUnset: number;
  };
  pins: AdminPin[];
  growth: {
    today: number;
    week: number;
    month: number;
    byDay: Array<{ date: string; count: number }>;
  };
  byNation: Array<{ nation: UkNation; fans: number; towns: number }>;
  byTeam: TeamCount[];
  byTown: Array<{
    placeId: string;
    townCity: string;
    nation: UkNation;
    regionOrCouncilArea: string;
    fanCount: number;
    latitude: number;
    longitude: number;
    teams: TeamCount[];
  }>;
  byCouncil: Array<{
    regionOrCouncilArea: string;
    nation: UkNation;
    fanCount: number;
    townCount: number;
  }>;
  largestCommunities: Array<{
    placeId: string;
    townCity: string;
    nation: UkNation;
    fanCount: number;
  }>;
  yearsFollowing: Array<{ id: string; label: string; count: number }>;
};

export type HotspotResult = {
  centre: {
    placeId: string;
    townCity: string;
    nation: UkNation;
    latitude: number;
    longitude: number;
  };
  miles: number;
  fans: number;
  towns: number;
  teams: TeamCount[];
  nearbyTowns: Array<{
    placeId: string;
    townCity: string;
    nation: UkNation;
    miles: number;
    fanCount: number;
  }>;
};
