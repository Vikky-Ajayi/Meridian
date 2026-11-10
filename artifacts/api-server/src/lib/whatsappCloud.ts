import { createHmac, timingSafeEqual } from "node:crypto";

// Minimal client for Meta's WhatsApp Cloud API (Graph API).
//
// Env vars (Railway):
//   WHATSAPP_ACCESS_TOKEN          – permanent System User token with
//                                    whatsapp_business_messaging + whatsapp_business_management
//   WHATSAPP_PHONE_NUMBER_ID       – the sending number's ID (WhatsApp → API Setup), not the number
//   WHATSAPP_APP_SECRET            – App settings → Basic; verifies webhook signatures
//   WHATSAPP_WEBHOOK_VERIFY_TOKEN  – any long random phrase, also entered in the Meta webhook settings
//   WHATSAPP_GRAPH_VERSION         – optional, defaults to v23.0
//
// With the first two unset, the admin dashboard stays in manual (one-tap) mode.

export class WhatsAppError extends Error {
  readonly code: number | null;

  constructor(message: string, code: number | null = null) {
    super(message);
    this.name = "WhatsAppError";
    this.code = code;
  }
}

const graphVersion = () => process.env.WHATSAPP_GRAPH_VERSION || "v23.0";

export function cloudApiConfigured(): boolean {
  return Boolean(process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID);
}

/** Plain-English versions of the Cloud API errors an admin is likely to hit. */
function explain(code: number | undefined, message: string, details: string | undefined): string {
  switch (code) {
    case 131047:
      return "More than 24 hours have passed since they last messaged you, so only a template message can be sent. Use “Restart conversation”.";
    case 131026:
      return "WhatsApp couldn't deliver to this number. It may not be on WhatsApp, or the number may be wrong.";
    case 132001:
      return "The message template doesn't exist or isn't approved yet in WhatsApp Manager (check its exact name and English (UK) language).";
    case 132000:
      return "The template's variables don't match. Each template should have exactly one variable, {{1}}, for the first name.";
    case 131030:
      return "This number isn't in your test recipients list. Add it under WhatsApp → API Setup while using the test number.";
    case 190:
      return "The WhatsApp access token is invalid or has expired. Generate a permanent System User token and update WHATSAPP_ACCESS_TOKEN.";
    case 131056:
    case 130429:
      return "WhatsApp is rate-limiting messages to this number. It will be retried later.";
    case 131049:
      return "Meta didn't deliver this marketing message to keep engagement healthy. It will be retried later.";
    default:
      return details ? `${message} (${details})` : message;
  }
}

async function post(body: Record<string, unknown>): Promise<string> {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneNumberId) throw new WhatsAppError("WhatsApp Cloud API isn't connected (WHATSAPP_ACCESS_TOKEN / WHATSAPP_PHONE_NUMBER_ID).");

  let response: Response;
  try {
    response = await fetch(`https://graph.facebook.com/${graphVersion()}/${phoneNumberId}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ messaging_product: "whatsapp", recipient_type: "individual", ...body }),
      signal: AbortSignal.timeout(15_000),
    });
  } catch (err) {
    throw new WhatsAppError(`Couldn't reach WhatsApp: ${err instanceof Error ? err.message : String(err)}`);
  }

  const data = (await response.json().catch(() => ({}))) as {
    messages?: { id: string }[];
    error?: { message?: string; code?: number; error_data?: { details?: string } };
  };
  if (!response.ok || !data.messages?.[0]?.id) {
    const e = data.error;
    throw new WhatsAppError(explain(e?.code, e?.message ?? `WhatsApp rejected the message (${response.status}).`, e?.error_data?.details), e?.code ?? null);
  }
  return data.messages[0].id;
}

/** Sends an approved template whose only variable, {{1}}, is the first name. Returns Meta's message ID. */
export function sendTemplate(to: string, name: string, language: string, firstName: string): Promise<string> {
  return post({
    to,
    type: "template",
    template: {
      name,
      language: { code: language },
      components: [{ type: "body", parameters: [{ type: "text", text: firstName || "there" }] }],
    },
  });
}

/** Sends free text. Only works within 24 hours of the contact's last message. */
export function sendText(to: string, text: string): Promise<string> {
  return post({ to, type: "text", text: { preview_url: true, body: text } });
}

/** Checks Meta's X-Hub-Signature-256 header against the raw request body. */
export function validSignature(rawBody: Buffer | undefined, header: string | undefined): boolean {
  const secret = process.env.WHATSAPP_APP_SECRET;
  if (!secret || !rawBody || !header?.startsWith("sha256=")) return false;
  const expected = Buffer.from(createHmac("sha256", secret).update(rawBody).digest("hex"), "utf8");
  const given = Buffer.from(header.slice("sha256=".length), "utf8");
  return expected.length === given.length && timingSafeEqual(expected, given);
}
