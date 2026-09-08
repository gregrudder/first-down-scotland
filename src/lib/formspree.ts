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

export async function postToFormspree(
  formId: string,
  body: Record<string, unknown>,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const response = await fetch(`https://formspree.io/f/${encodeURIComponent(formId)}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const detail = await response.text();
    return { ok: false, error: detail.slice(0, 300) || `Formspree ${response.status}` };
  }
  return { ok: true };
}
