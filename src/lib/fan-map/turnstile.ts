export function turnstileSiteKey(): string | undefined {
  return process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || undefined;
}

export function turnstileSecret(): string | undefined {
  return process.env.TURNSTILE_SECRET_KEY?.trim() || undefined;
}

export function turnstileRequired(): boolean {
  return Boolean(turnstileSecret() && turnstileSiteKey());
}

export async function verifyTurnstile(
  token: string | undefined,
  ip: string | undefined,
): Promise<{ ok: true } | { ok: false; error: string; status: number }> {
  const secret = turnstileSecret();
  const siteKey = turnstileSiteKey();

  if (!secret || !siteKey) {
    if (process.env.NODE_ENV === "production") {
      return {
        ok: false,
        error: "Map sign-up protection is not wired up yet (Turnstile).",
        status: 503,
      };
    }
    return { ok: true };
  }

  if (!token || token.length < 10) {
    return { ok: false, error: "Tick the captcha so we know you are a person.", status: 400 };
  }

  const body = new URLSearchParams({
    secret,
    response: token,
  });
  if (ip && ip !== "unknown") body.set("remoteip", ip);

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!response.ok) {
    return { ok: false, error: "Captcha check failed. Try again.", status: 502 };
  }
  const json = (await response.json()) as { success?: boolean };
  if (!json.success) {
    return { ok: false, error: "Captcha was not accepted. Have another go.", status: 400 };
  }
  return { ok: true };
}
