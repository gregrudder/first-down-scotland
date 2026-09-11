import { timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import {
  ADMIN_COOKIE,
  ADMIN_SESSION_TTL_SECONDS,
  MAGIC_LINK_TTL_MS,
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
} from "@/lib/fan-map/constants";
import { normaliseEmail, randomToken, sha256Hex, signPayload, verifyPayload } from "@/lib/fan-map/crypto";
import {
  consumeMagicLink,
  findOrCreateUser,
  getRegistrationForUser,
  getUserById,
  insertMagicLink,
  isFanMapDbConfigured,
} from "@/lib/fan-map/db";
import { sendMagicLinkEmail } from "@/lib/fan-map/email";
import { siteOrigin } from "@/lib/site";
import type { FanMapMe, FanMapSession } from "@/lib/fan-map/types";

export function getAuthSecret(): string | null {
  const configured =
    process.env.FAN_MAP_AUTH_SECRET?.trim() || process.env.AUTH_SECRET?.trim();
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

export async function readSession(): Promise<FanMapSession | null> {
  const secret = getAuthSecret();
  if (!secret) return null;
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const payload = verifyPayload<{ sub: string; email: string; exp?: number }>(token, secret);
  if (!payload?.sub || !payload.email) return null;
  return { userId: payload.sub, email: payload.email };
}

export async function writeSession(session: FanMapSession): Promise<void> {
  const secret = getAuthSecret();
  if (!secret) throw new Error("Fan map auth secret is not configured");
  const token = signPayload(
    {
      sub: session.userId,
      email: session.email,
      exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
    },
    secret,
  );
  const store = await cookies();
  store.set(SESSION_COOKIE, token, cookieOptions(SESSION_TTL_SECONDS));
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function requestMagicLink(rawEmail: string): Promise<
  { ok: true; devLink?: string } | { ok: false; error: string; status: number }
> {
  if (!isFanMapDbConfigured()) {
    return {
      ok: false,
      error: "The fan map database is not wired up yet, so we cannot send a sign-in link.",
      status: 503,
    };
  }
  const secret = getAuthSecret();
  if (!secret) {
    return {
      ok: false,
      error: "Fan map sign-in is not configured on this deployment.",
      status: 503,
    };
  }
  const email = normaliseEmail(rawEmail);
  if (!email) {
    return { ok: false, error: "That does not look like an email address.", status: 400 };
  }

  const token = randomToken();
  const expires = new Date(Date.now() + MAGIC_LINK_TTL_MS);
  await insertMagicLink(sha256Hex(token), email, expires);
  const verifyUrl = new URL("/api/fan-map/auth/verify", `${siteOrigin()}/`);
  verifyUrl.searchParams.set("token", token);

  const sent = await sendMagicLinkEmail(email, verifyUrl.toString());
  if (!sent.ok) {
    return { ok: false, error: sent.error, status: sent.status };
  }
  return {
    ok: true,
    devLink: sent.devLink,
  };
}

export async function verifyMagicLinkToken(token: string): Promise<FanMapSession | null> {
  if (!isFanMapDbConfigured()) return null;
  const email = await consumeMagicLink(sha256Hex(token));
  if (!email) return null;
  const user = await findOrCreateUser(email);
  return { userId: user.id, email: user.email };
}

export async function getMe(): Promise<FanMapMe> {
  const configured = isFanMapDbConfigured();
  const session = await readSession();
  if (!session) return { configured, session: null, registration: null };
  if (!configured) return { configured, session, registration: null };

  try {
    const user = await getUserById(session.userId);
    if (!user) return { configured, session: null, registration: null };
    const registration = await getRegistrationForUser(user.id);
    return { configured, session: { userId: user.id, email: user.email }, registration };
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

export async function clearAdminSession(): Promise<void> {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
}

export function adminPasswordMatches(password: string): boolean {
  const secret = getAdminSecret();
  if (!secret) return false;
  const left = Buffer.from(password);
  const right = Buffer.from(secret);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}
