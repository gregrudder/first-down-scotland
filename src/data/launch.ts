export const LAUNCH_EMAIL_MAX = 120;

export const LAUNCH_SOURCES = ["home", "community"] as const;
export type LaunchSource = (typeof LAUNCH_SOURCES)[number];
