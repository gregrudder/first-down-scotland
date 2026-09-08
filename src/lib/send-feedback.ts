import { favouriteOptions, foundOptions, payOptions, recommendOptions, type FeedbackPayload } from "@/data/feedback";

const SUBJECT_PREFIX = "[FDS feedback]";

export type FeedbackDeliveryResult =
  | { ok: true }
  | { ok: false; reason: "unconfigured" | "provider"; error: string };

function labelOf<T extends { id: string; label: string }>(options: readonly T[], id: string | undefined): string {
  return options.find((option) => option.id === id)?.label ?? id ?? "-";
}

export function feedbackSubject(payload: FeedbackPayload): string {
  const found = labelOf(foundOptions, payload.found);
  const pay = labelOf(payOptions, payload.pay);
  return `${SUBJECT_PREFIX} ${found} · £2 ${pay}`;
}

export function feedbackBody(payload: FeedbackPayload): string {
  const lines = [
    `Found us: ${labelOf(foundOptions, payload.found)}${payload.foundOther ? ` (${payload.foundOther})` : ""}`,
    `Favourite: ${labelOf(favouriteOptions, payload.favourite)}${payload.favouriteOther ? ` (${payload.favouriteOther})` : ""}`,
    `Most confusing: ${payload.confusing || "-"}`,
    `Broken: ${payload.broken || "-"}`,
    `Pay £2/mo for the full product: ${labelOf(payOptions, payload.pay)}`,
    `What would make £2 worth it: ${payload.worthIt || "-"}`,
    `Suggested features: ${payload.suggest || "-"}`,
    `Anything else: ${payload.else || "-"}`,
    `Name: ${payload.name || "-"}`,
    `Team: ${payload.team || "-"}`,
    `Recommend to a mate new to the NFL: ${labelOf(recommendOptions, payload.recommend)}`,
  ];
  return lines.join("\n");
}

/** Accepts a bare Formspree hash or a full `https://formspree.io/f/xxxx` URL. */
export function parseFormspreeFormId(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  const trimmed = raw.trim();
  if (!trimmed) return undefined;
  const fromUrl = trimmed.match(/formspree\.io\/(?:f\/)?([A-Za-z0-9]+)/i);
  if (fromUrl) return fromUrl[1];
  const bare = trimmed.replace(/^\/+|\/+$/g, "");
  if (/^[A-Za-z0-9]+$/.test(bare)) return bare;
  return undefined;
}

function resendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim() && process.env.FEEDBACK_TO_EMAIL?.trim());
}

function formspreeId(): string | undefined {
  return parseFormspreeFormId(process.env.FORMSPREE_FORM_ID);
}

async function sendWithResend(subject: string, text: string): Promise<FeedbackDeliveryResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.FEEDBACK_TO_EMAIL?.trim();
  if (!apiKey || !to) {
    return { ok: false, reason: "unconfigured", error: "Resend is not fully configured" };
  }

  const from =
    process.env.FEEDBACK_FROM_EMAIL?.trim() || "First Down Scotland <onboarding@resend.dev>";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      text,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    return { ok: false, reason: "provider", error: detail.slice(0, 300) || `Resend ${response.status}` };
  }
  return { ok: true };
}

async function sendWithFormspree(
  subject: string,
  text: string,
  payload: FeedbackPayload,
): Promise<FeedbackDeliveryResult> {
  const id = formspreeId();
  if (!id) {
    return { ok: false, reason: "unconfigured", error: "Formspree is not configured" };
  }

  const response = await fetch(`https://formspree.io/f/${encodeURIComponent(id)}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      _subject: subject,
      message: text,
      name: payload.name || undefined,
      found: payload.found,
      favourite: payload.favourite,
      pay: payload.pay,
      suggest: payload.suggest,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    return { ok: false, reason: "provider", error: detail.slice(0, 300) || `Formspree ${response.status}` };
  }
  return { ok: true };
}

export async function deliverFeedback(payload: FeedbackPayload): Promise<FeedbackDeliveryResult> {
  const subject = feedbackSubject(payload);
  const text = feedbackBody(payload);
  const useResend = resendConfigured();
  const useFormspree = Boolean(formspreeId());

  if (useResend) {
    const resend = await sendWithResend(subject, text);
    if (resend.ok) return resend;
    console.error("[feedback] Resend failed", resend.error);
    if (useFormspree) {
      const formspree = await sendWithFormspree(subject, text, payload);
      if (!formspree.ok) {
        console.error("[feedback] Formspree fallback failed", formspree.error);
      }
      return formspree;
    }
    return resend;
  }

  if (useFormspree) {
    return sendWithFormspree(subject, text, payload);
  }

  if (process.env.FORMSPREE_FORM_ID?.trim() && !useFormspree) {
    return {
      ok: false,
      reason: "unconfigured",
      error: "FORMSPREE_FORM_ID is not a form id or Formspree URL",
    };
  }

  if (process.env.NODE_ENV !== "production") {
    console.info(`${subject}\n${text}`);
    return { ok: true };
  }

  return { ok: false, reason: "unconfigured", error: "Feedback delivery is not configured" };
}
