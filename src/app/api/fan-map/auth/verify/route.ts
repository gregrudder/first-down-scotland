import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, SESSION_TTL_SECONDS } from "@/lib/fan-map/constants";
import { getAuthSecret, verifyMagicLinkToken } from "@/lib/fan-map/auth";
import { signPayload } from "@/lib/fan-map/crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") ?? "";
  if (!token) {
    return NextResponse.redirect(new URL("/fan-map/add?error=link", request.url));
  }

  const session = await verifyMagicLinkToken(token);
  const secret = getAuthSecret();
  if (!session || !secret) {
    return NextResponse.redirect(new URL("/fan-map/add?error=expired", request.url));
  }

  const redirect = NextResponse.redirect(new URL("/fan-map/add?signed-in=1", request.url));
  redirect.cookies.set(
    SESSION_COOKIE,
    signPayload(
      {
        sub: session.userId,
        email: session.email,
        exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
      },
      secret,
    ),
    {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_TTL_SECONDS,
    },
  );
  return redirect;
}
