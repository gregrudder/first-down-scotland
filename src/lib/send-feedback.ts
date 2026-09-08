import { favouriteOptions, foundOptions, payOptions, recommendOptions, type FeedbackPayload } from "@/data/feedback";

const SUBJECT_PREFIX = "[FDS feedback]";

function labelOf<T extends { id: string; label: string }>(options: readonly T[], id: string | undefined): string {
  return options.find((option) => option.id === id)?.label ?? id ?? "—";
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
    `Most confusing: ${payload.confusing || "—"}`,
    `Broken: ${payload.broken || "—"}`,
    `Pay £2/mo + private Discord: ${labelOf(payOptions, payload.pay)}`,
    `What would make £2 worth it: ${payload.worthIt || "—"}`,
    `Anything else: ${payload.else || "—"}`,
    `Name: ${payload.name || "—"}`,
    `Team: ${payload.team || "—"}`,
    `Recommend to a mate new to the NFL: ${labelOf(recommendOptions, payload.recommend)}`,
  ];
  return lines.join("\n");
}

async function sendWithResend(subject: string, text: string): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.FEEDBACK_TO_EMAIL?.trim();
  if (!apiKey || !to) return { ok: false, error: "Resend is not fully configured" };

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
    return { ok: false, error: detail.slice(0, 300) || `Resend ${response.status}` };
  }
  return { ok: true };
}

async function sendWithFormspree(subject: string, text: string, payload: FeedbackPayload): Promise<{ ok: boolean; error?: string }> {
  const id = process.env.FORMSPREE_FORM_ID?.trim();
  if (!id) return { ok: false, error: "Formspree is not configured" };

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
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    return { ok: false, error: detail.slice(0, 300) || `Formspree ${response.status}` };
  }
  return { ok: true };
}

export async function deliverFeedback(payload: FeedbackPayload): Promise<{ ok: boolean; error?: string }> {
  const subject = feedbackSubject(payload);
  const text = feedbackBody(payload);

  if (process.env.RESEND_API_KEY?.trim() && process.env.FEEDBACK_TO_EMAIL?.trim()) {
    return sendWithResend(subject, text);
  }
  if (process.env.FORMSPREE_FORM_ID?.trim()) {
    return sendWithFormspree(subject, text, payload);
  }
  if (process.env.NODE_ENV !== "production") {
    console.info(`${subject}\n${text}`);
    return { ok: true };
  }
  return { ok: false, error: "Feedback delivery is not configured" };
}
