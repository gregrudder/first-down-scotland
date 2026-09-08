import { teams, type NflTeam } from "@/data/teams";
import { TEAM_STORAGE_KEY } from "@/lib/team-storage";

const NAVY = "#0b1220";
const CREAM = "#f4efe4";
const WHITE = "#ffffff";
const NEAR_BLACK = 0.04;
const LOW_SATURATION = 0.22;
const TEXT_CONTRAST = 4.55;

export type TeamThemeTokens = {
  gold: string;
  goldSoft: string;
  goldInk: string;
  teamPrimary: string;
  teamSecondary: string;
};

type Rgb = { r: number; g: number; b: number };

function parseHex(hex: string): Rgb {
  const raw = hex.replace("#", "").trim();
  const full = raw.length === 3 ? raw.split("").map((ch) => ch + ch).join("") : raw;
  const n = Number.parseInt(full, 16);
  if (!Number.isFinite(n) || full.length !== 6) {
    return { r: 232, g: 184, b: 74 };
  }
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function toHex({ r, g, b }: Rgb): string {
  const h = (n: number) => Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}

function channel(c: number): number {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(hex: string): number {
  const { r, g, b } = parseHex(hex);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrastRatio(a: string, b: string): number {
  const l1 = relativeLuminance(a);
  const l2 = relativeLuminance(b);
  const hi = Math.max(l1, l2);
  const lo = Math.min(l1, l2);
  return (hi + 0.05) / (lo + 0.05);
}

function mix(a: string, b: string, t: number): string {
  const left = parseHex(a);
  const right = parseHex(b);
  return toHex({
    r: left.r + (right.r - left.r) * t,
    g: left.g + (right.g - left.g) * t,
    b: left.b + (right.b - left.b) * t,
  });
}

/** Lift a colour toward white until it is readable on the navy background. */
export function readableOnNavy(hex: string, min = TEXT_CONTRAST): string {
  if (contrastRatio(hex, NAVY) >= min) return hex.toUpperCase();
  let lo = 0;
  let hi = 1;
  let best = mix(hex, WHITE, 1);
  for (let i = 0; i < 14; i += 1) {
    const mid = (lo + hi) / 2;
    const candidate = mix(hex, WHITE, mid);
    if (contrastRatio(candidate, NAVY) >= min) {
      best = candidate;
      hi = mid;
    } else {
      lo = mid;
    }
  }
  return best.toUpperCase();
}

function betterInk(fill: string): string {
  return contrastRatio(CREAM, fill) > contrastRatio(NAVY, fill) ? CREAM : NAVY;
}

function saturation(hex: string): number {
  const { r, g, b } = parseHex(hex);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max === 0) return 0;
  return (max - min) / max;
}

function isAchromaticDark(hex: string): boolean {
  return relativeLuminance(hex) < NEAR_BLACK && saturation(hex) < LOW_SATURATION;
}

export function themeFromColours(primary: string, secondary: string): TeamThemeTokens {
  let accent = primary;
  let support = secondary;
  if (isAchromaticDark(primary) && !isAchromaticDark(secondary)) {
    accent = secondary;
    support = primary;
  }

  const gold = readableOnNavy(accent);
  const goldSoft =
    relativeLuminance(support) < NEAR_BLACK
      ? mix(gold, WHITE, 0.28).toUpperCase()
      : readableOnNavy(support);

  return {
    gold,
    goldSoft,
    goldInk: betterInk(gold),
    teamPrimary: primary.toUpperCase(),
    teamSecondary: secondary.toUpperCase(),
  };
}

export function themeFromTeam(team: NflTeam): TeamThemeTokens {
  return themeFromColours(team.primary, team.secondary);
}

export const teamThemeByAbbr: Record<string, TeamThemeTokens> = Object.fromEntries(
  teams.map((team) => [team.abbreviation, themeFromTeam(team)]),
);

const STYLE_KEYS = [
  ["--gold", "gold"],
  ["--gold-soft", "goldSoft"],
  ["--gold-ink", "goldInk"],
  ["--team-primary", "teamPrimary"],
  ["--team-secondary", "teamSecondary"],
] as const;

export function applyTeamTheme(team: NflTeam | null): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (!team) {
    for (const [cssVar] of STYLE_KEYS) root.style.removeProperty(cssVar);
    root.removeAttribute("data-team");
    return;
  }
  const theme = themeFromTeam(team);
  root.style.setProperty("--gold", theme.gold);
  root.style.setProperty("--gold-soft", theme.goldSoft);
  root.style.setProperty("--gold-ink", theme.goldInk);
  root.style.setProperty("--team-primary", theme.teamPrimary);
  root.style.setProperty("--team-secondary", theme.teamSecondary);
  root.setAttribute("data-team", team.abbreviation);
}

export function applySavedTeamTheme(): void {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(TEAM_STORAGE_KEY);
    if (!raw) {
      applyTeamTheme(null);
      return;
    }
    const parsed = JSON.parse(raw) as { abbreviation?: string };
    const team = teams.find(
      (entry) => entry.abbreviation.toLowerCase() === parsed.abbreviation?.toLowerCase(),
    );
    applyTeamTheme(team ?? null);
  } catch {
    applyTeamTheme(null);
  }
}

/** Inline boot script: apply saved team colours before first paint. */
export function teamThemeBootScript(): string {
  const packed = Object.fromEntries(
    Object.entries(teamThemeByAbbr).map(([abbr, theme]) => [
      abbr,
      [theme.gold, theme.goldSoft, theme.goldInk, theme.teamPrimary, theme.teamSecondary],
    ]),
  );
  return `(function(){try{var m=${JSON.stringify(packed)};var r=document.documentElement;var s=JSON.parse(localStorage.getItem(${JSON.stringify(TEAM_STORAGE_KEY)})||"null");var a=s&&s.abbreviation;var t=a&&m[a];if(!t)return;r.style.setProperty("--gold",t[0]);r.style.setProperty("--gold-soft",t[1]);r.style.setProperty("--gold-ink",t[2]);r.style.setProperty("--team-primary",t[3]);r.style.setProperty("--team-secondary",t[4]);r.setAttribute("data-team",a);}catch(e){}})();`;
}
