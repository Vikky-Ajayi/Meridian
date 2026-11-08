// Brevo (contacts API) client used by the admin dashboard.
//
// Approving an applicant creates/updates their Brevo contact and adds it to the
// list for their form. A Brevo automation ("Contact added to list") then sends
// the WhatsApp sequence. Brevo stops the sequence when the contact's WA_REPLIED
// attribute becomes true (set by a "WhatsApp reply received" automation, or by
// the admin's "Stop follow-ups" action below).
//
// Required env vars (Railway):
//   BREVO_API_KEY                – Brevo → Settings → SMTP & API → API keys
//   BREVO_LIST_MOVE_MONEY        – numeric ID of the "Approved – Move Money Abroad" list
//   BREVO_LIST_PRIVATE_BANKING   – numeric ID of the "Approved – Private Banking" list

const BREVO_API_URL = "https://api.brevo.com/v3";

export type FormType = "move-money" | "private-banking";

export class BrevoError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "BrevoError";
    this.status = status;
  }
}

function listIdFor(form: FormType): number | null {
  const raw = form === "move-money" ? process.env.BREVO_LIST_MOVE_MONEY : process.env.BREVO_LIST_PRIVATE_BANKING;
  const id = Number.parseInt(raw ?? "", 10);
  return Number.isFinite(id) && id > 0 ? id : null;
}

/** Names of the env vars that still need setting; empty when Brevo is ready. */
export function missingBrevoConfig(): string[] {
  const missing: string[] = [];
  if (!process.env.BREVO_API_KEY) missing.push("BREVO_API_KEY");
  if (listIdFor("move-money") === null) missing.push("BREVO_LIST_MOVE_MONEY");
  if (listIdFor("private-banking") === null) missing.push("BREVO_LIST_PRIVATE_BANKING");
  return missing;
}

/** Brevo wants the full international number with a leading +, digits only. */
export function toWhatsappNumber(raw: string): string {
  const trimmed = raw.trim();
  const digits = trimmed.replace(/\D/g, "");
  if (trimmed.startsWith("00")) return `+${digits.slice(2)}`;
  return `+${digits}`;
}

export function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  return { firstName: parts[0] ?? "", lastName: parts.slice(1).join(" ") };
}

async function brevoRequest(path: string, init: { method: string; body?: unknown }) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) throw new BrevoError("Brevo is not connected: BREVO_API_KEY is not set.", 503);

  const response = await fetch(`${BREVO_API_URL}${path}`, {
    method: init.method,
    headers: {
      "api-key": apiKey,
      accept: "application/json",
      ...(init.body === undefined ? {} : { "content-type": "application/json" }),
    },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    let detail = "";
    try {
      const body = (await response.json()) as { message?: string; code?: string };
      detail = body.message ?? body.code ?? "";
    } catch {
      // Brevo returned no JSON body
    }
    throw new BrevoError(`Brevo rejected the request (${response.status})${detail ? `: ${detail}` : ""}`, response.status);
  }

  return response.status === 204 ? null : response.json().catch(() => null);
}

export interface ApprovedApplicant {
  form: FormType;
  referenceNumber: string;
  fullName: string;
  email: string;
  whatsappNumber: string;
}

/**
 * Creates or updates the applicant's Brevo contact and adds it to their form's
 * list, which starts the WhatsApp sequence. WA_REPLIED is reset so an earlier
 * reply can't make the new sequence exit straight away.
 */
export async function addApprovedApplicant(applicant: ApprovedApplicant) {
  const listId = listIdFor(applicant.form);
  if (listId === null) {
    throw new BrevoError(
      `Brevo is not connected: ${applicant.form === "move-money" ? "BREVO_LIST_MOVE_MONEY" : "BREVO_LIST_PRIVATE_BANKING"} is not set.`,
      503,
    );
  }
  const { firstName, lastName } = splitName(applicant.fullName);

  await brevoRequest("/contacts", {
    method: "POST",
    body: {
      email: applicant.email,
      updateEnabled: true,
      listIds: [listId],
      attributes: {
        FIRSTNAME: firstName,
        LASTNAME: lastName,
        WHATSAPP: toWhatsappNumber(applicant.whatsappNumber),
        APPLICATION_REF: applicant.referenceNumber,
        APPLICATION_TYPE: applicant.form === "move-money" ? "Move Money Abroad" : "Private Banking",
        WA_REPLIED: false,
      },
    },
  });
}

/** Marks the contact as replied, which makes the Brevo sequence exit. */
export async function stopFollowUps(email: string) {
  await brevoRequest(`/contacts/${encodeURIComponent(email)}`, {
    method: "PUT",
    body: { attributes: { WA_REPLIED: true } },
  });
}

/** Whether the contact has replied on WhatsApp, or null if Brevo has no such contact. */
export async function hasReplied(email: string): Promise<boolean | null> {
  try {
    const contact = (await brevoRequest(`/contacts/${encodeURIComponent(email)}`, { method: "GET" })) as {
      attributes?: Record<string, unknown>;
    } | null;
    const value = contact?.attributes?.WA_REPLIED;
    return value === true || value === "true" || value === 1;
  } catch (err) {
    if (err instanceof BrevoError && err.status === 404) return null;
    throw err;
  }
}
