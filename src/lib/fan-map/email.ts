const SUBJECT = "Put your team on the First Down Scotland map";

export type MagicLinkSendResult =
  | { ok: true; devLink?: string }
  | { ok: false; error: string; status: number };

function fromAddress(): string {
  return (
    process.env.FAN_MAP_FROM_EMAIL?.trim() ||
    process.env.FEEDBACK_FROM_EMAIL?.trim() ||
    "First Down Scotland <onboarding@resend.dev>"
  );
}

export async function sendMagicLinkEmail(email: string, verifyUrl: string): Promise<MagicLinkSendResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const text = [
    "Confirm this email to put your NFL team on the First Down Scotland fan map.",
    "",
    "This link expires in 30 minutes and only works once.",
    verifyUrl,
    "",
    "If you did not ask for this, ignore the email.",
  ].join("\n");

  if (apiKey) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress(),
        to: [email],
        subject: SUBJECT,
        text,
      }),
    });
    if (!response.ok) {
      const detail = await response.text();
      console.error("[fan-map] Resend failed", detail.slice(0, 300));
      return {
        ok: false,
        error: "Could not send the sign-in email just now. Try again in a minute.",
        status: 502,
      };
    }
    return { ok: true };
  }

  if (process.env.NODE_ENV !== "production") {
    console.info(`[fan-map] magic link for ${email}\n${verifyUrl}`);
    return { ok: true, devLink: verifyUrl };
  }

  return {
    ok: false,
    error: "Email sign-in is not wired up yet. Set RESEND_API_KEY on the deployment.",
    status: 503,
  };
}
