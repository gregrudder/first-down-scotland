import { getTeam } from "@/data/teams";
import { LAUNCH_EMAIL_MAX, type LaunchSource } from "@/data/launch";
import { parseFormspreeFormId, postToFormspree } from "@/lib/formspree";

export type LaunchSignup = {
  email: string;
  team?: string;
  source: LaunchSource;
};

export type LaunchDeliveryResult =
  | { ok: true }
  | { ok: false; reason: "unconfigured" | "provider"; error: string };

export function isPlausibleEmail(value: string): boolean {
  if (value.length < 5 || value.length > LAUNCH_EMAIL_MAX) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function launchFormId(): string | undefined {
  return parseFormspreeFormId(process.env.LAUNCH_FORMSPREE_FORM_ID);
}

export async function deliverLaunchSignup(signup: LaunchSignup): Promise<LaunchDeliveryResult> {
  const id = launchFormId();
  const subject = `[FDS launch list] ${signup.email}`;
  const text = [
    `Launch list signup`,
    `Email: ${signup.email}`,
    `Team: ${signup.team && getTeam(signup.team) ? signup.team : "-"}`,
    `Source: ${signup.source}`,
  ].join("\n");

  if (id) {
    const posted = await postToFormspree(id, {
      email: signup.email,
      _replyto: signup.email,
      _subject: subject,
      message: text,
      team: signup.team,
      source: signup.source,
    });
    if (!posted.ok) {
      console.error("[launch] Formspree failed", posted.error);
      return { ok: false, reason: "provider", error: posted.error };
    }
    return { ok: true };
  }

  if (process.env.LAUNCH_FORMSPREE_FORM_ID?.trim()) {
    return {
      ok: false,
      reason: "unconfigured",
      error: "LAUNCH_FORMSPREE_FORM_ID is not a form id or Formspree URL",
    };
  }

  if (process.env.NODE_ENV !== "production") {
    console.info(`${subject}\n${text}`);
    return { ok: true };
  }

  return { ok: false, reason: "unconfigured", error: "Launch list is not configured" };
}
