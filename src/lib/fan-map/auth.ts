import { timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import {
  ADMIN_COOKIE,
  ADMIN_SESSION_TTL_SECONDS,
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
} from "@/lib/fan-map/constants";
import { newId, signPayload, verifyPayload } from "@/lib/fan-map/crypto";
import { getRegistrationForUser, isFanMapDbConfigured } from "@/lib/fan-map/db";
import type { FanMapMe, FanMapSession } from "@/lib/fan-map/types";

export function getAuthSecret(): string | null {
  const configured =
    process.env.FAN_MAP_COOKIE_SECRET?.trim() ||
    process.env.FAN_MAP_AUTH_SECRET?.trim() ||
    process.env.AUTH_SECRET?.trim();
  if (configured) return configured;
  if (process.env.NODE_ENV === "production") return null;
  return "fds-fan-map-dev-secret-not-for-production";
}

export function getAdminSecret(): string | null {
  return process.env.FAN_MAP_ADMIN_SECRET?.trim() || null;
}

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}

export async function readFanId(): Promise<string | null> {
  const secret = getAuthSecret();
  if (!secret) return null;
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const payload = verifyPayload<{ sub: string }>(token, secret);
  return payload?.sub ?? null;
}

export function fanCookieValue(fanId: string, secret: string): string {
  return signPayload(
    {
      sub: fanId,
      exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
    },
    secret,
  );
}

export async function writeFanCookie(fanId: string): Promise<void> {
  const secret = getAuthSecret();
  if (!secret) throw new Error("Fan map cookie secret is not configured");
  const store = await cookies();
  store.set(SESSION_COOKIE, fanCookieValue(fanId, secret), cookieOptions(SESSION_TTL_SECONDS));
}

export async function ensureFanId(): Promise<string | null> {
  const existing = await readFanId();
  if (existing) return existing;
  const secret = getAuthSecret();
  if (!secret) return null;
  const fanId = newId();
  await writeFanCookie(fanId);
  return fanId;
}

export async function getMe(): Promise<FanMapMe> {
  const configured = isFanMapDbConfigured();
  const fanId = await readFanId();
  const session: FanMapSession | null = fanId ? { fanId } : null;
  if (!fanId || !configured) {
    return { configured, session, registration: null };
  }
  try {
    const registration = await getRegistrationForUser(fanId);
    return { configured, session, registration };
  } catch (error) {
    console.error("[fan-map] getMe failed", error);
    return { configured, session, registration: null };
  }
}

export async function isAdmin(): Promise<boolean> {
  const secret = getAdminSecret();
  if (!secret) return false;
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  const payload = verifyPayload<{ role?: string }>(token, secret);
  return payload?.role === "admin";
}

export async function writeAdminSession(): Promise<void> {
  const secret = getAdminSecret();
  if (!secret) throw new Error("Fan map admin secret is not configured");
  const token = signPayload(
    { role: "admin", exp: Math.floor(Date.now() / 1000) + ADMIN_SESSION_TTL_SECONDS },
    secret,
  );
  const store = await cookies();
  store.set(ADMIN_COOKIE, token, cookieOptions(ADMIN_SESSION_TTL_SECONDS));
}

export function adminPasswordMatches(password: string): boolean {
  const secret = getAdminSecret();
  if (!secret) return false;
  const left = Buffer.from(password);
  const right = Buffer.from(secret);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}
