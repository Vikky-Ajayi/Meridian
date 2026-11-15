import { createHmac, timingSafeEqual } from "node:crypto";
import type { AdminApplication } from "./applications";
import type { FormType } from "./whatsappTemplates";

// Email follow-up sequence. When an applicant is approved they get an
// "approved" email with a button that opens WhatsApp chat with the desk, with a
// message already typed. Until the admin marks "They've messaged us" (or the
// applicant unsubscribes), follow-up emails go out on days 2, 5, 9 and 14.
//
// Env vars (Railway):
//   RESEND_API_KEY            – already used for login codes
//   APPLICATION_FROM_EMAIL    – optional sender, e.g. "Envoi & Co <clients@envoiandco.com>";
//                               defaults to OTP_FROM_EMAIL (must be a Resend-verified domain)
//   APPLICATION_REPLY_TO      – optional, defaults to clients@envoiandco.com
//   EMAIL_LINK_SECRET         – optional, signs unsubscribe / WhatsApp links; defaults to OTP_SECRET
//   PUBLIC_API_URL            – optional, defaults to the Railway API address

const RESEND_API_URL = "https://api.resend.com/emails";
const DESK_WHATSAPP_DIGITS = "447886857463";
const DESK_WHATSAPP_DISPLAY = "+44 7886 857463";

const fromAddress = () => process.env.APPLICATION_FROM_EMAIL || process.env.OTP_FROM_EMAIL || "";
const replyTo = () => process.env.APPLICATION_REPLY_TO || "clients@envoiandco.com";
const linkSecret = () => process.env.EMAIL_LINK_SECRET || process.env.OTP_SECRET || "";
const apiBase = () => (process.env.PUBLIC_API_URL || "https://meridian-production-960e.up.railway.app").replace(/\/$/, "");

export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && fromAddress() && linkSecret());
}

/** Which env vars are still needed for email mode. */
export function missingEmailConfig(): string[] {
  const missing: string[] = [];
  if (!process.env.RESEND_API_KEY) missing.push("RESEND_API_KEY");
  if (!fromAddress()) missing.push("APPLICATION_FROM_EMAIL (or OTP_FROM_EMAIL)");
  if (!linkSecret()) missing.push("EMAIL_LINK_SECRET (or OTP_SECRET)");
  return missing;
}

// ── Signed links ───────────────────────────────────────────────────────────

export type LinkPurpose = "whatsapp" | "unsubscribe";

function sign(reference: string, purpose: LinkPurpose) {
  return createHmac("sha256", linkSecret()).update(`${purpose}:${reference}`).digest("base64url").slice(0, 32);
}

export function validLinkToken(reference: string, purpose: LinkPurpose, token: string): boolean {
  if (!linkSecret() || !token) return false;
  const expected = Buffer.from(sign(reference, purpose));
  const given = Buffer.from(token);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

const signedLink = (reference: string, purpose: LinkPurpose) =>
  `${apiBase()}/api/email/${purpose}?ref=${encodeURIComponent(reference)}&t=${sign(reference, purpose)}`;

/** The message pre-typed in WhatsApp when they tap the button. */
export const prefilledWhatsAppText = (reference: string) =>
  `Hi Envoi & Co, my application (${reference}) has been approved and I'd like to discuss the next steps.`;

/** wa.me link to the desk with the message pre-typed. */
export const deskWhatsAppLink = (reference: string) =>
  `https://wa.me/${DESK_WHATSAPP_DIGITS}?text=${encodeURIComponent(prefilledWhatsAppText(reference))}`;

// ── Copy ───────────────────────────────────────────────────────────────────
// {{first}} is the applicant's first name. Keep in step with the dashboard's
// Message templates page, which reads these through /api/admin/email-templates.

export interface EmailTemplate {
  subject: string;
  paragraphs: string[];
}

const CTA_FIRST = "The quickest way to reach us is on WhatsApp. Tap the button below and send the message that’s ready for you. Prefer email? Simply reply to this one.";

export const EMAIL_SEQUENCE: Record<FormType, readonly EmailTemplate[]> = {
  "move-money": [
    {
      subject: "Your Envoi & Co application has been approved",
      paragraphs: [
        "Thank you for applying to move money abroad with Envoi & Co.",
        "Your application has been approved to progress to the next stage. Our team would like to discuss your transfer requirements and guide you through the next steps.",
        CTA_FIRST,
      ],
    },
    {
      subject: "Following up on your transfer request",
      paragraphs: [
        "Just following up on your request to move money abroad with Envoi & Co.",
        "Are you still planning to make the transfer? Message us on WhatsApp and we’ll help you explore the next steps.",
      ],
    },
    {
      subject: "Any questions about moving your money abroad?",
      paragraphs: [
        "Do you have any questions about moving your money abroad?",
        "Whether it’s the process, required documents, fees or timing, our team can talk you through the details before you decide to proceed.",
        "What would you like to know? Message us on WhatsApp or reply to this email.",
      ],
    },
    {
      subject: "Are you still planning your transfer?",
      paragraphs: [
        "We understand your transfer plans may have changed.",
        "Are you looking to move money soon, planning for later, or no longer looking? Let us know so we can follow up appropriately.",
      ],
    },
    {
      subject: "Our final follow-up about your transfer request",
      paragraphs: [
        "This is our final follow-up about your request to move money abroad with Envoi & Co.",
        "We’ll pause our emails for now. If you’d like to continue, simply message us on WhatsApp or reply to this email whenever you’re ready.",
        "Thank you for considering Envoi & Co.",
      ],
    },
  ],
  "private-banking": [
    {
      subject: "Your Envoi & Co application has been approved",
      paragraphs: [
        "Thank you for your interest in a private banking introduction through Envoi & Co.",
        "Your application has been approved to progress to the next stage. Our team would like to understand your banking requirements and explain how the introduction process works.",
        CTA_FIRST,
      ],
    },
    {
      subject: "Following up on your private banking introduction",
      paragraphs: [
        "Just following up on your request for a private banking introduction.",
        "Are you still interested in exploring your options with Envoi & Co? Message us on WhatsApp and we’ll guide you through the next steps.",
      ],
    },
    {
      subject: "Any questions before your private banking introduction?",
      paragraphs: [
        "Do you have any questions before progressing with your private banking introduction?",
        "Our team can explain the process, the information required and what to expect next.",
        "What would you like to know? Message us on WhatsApp or reply to this email.",
      ],
    },
    {
      subject: "Is now a good time to discuss your banking requirements?",
      paragraphs: [
        "We appreciate you may be busy.",
        "Would you like to discuss your private banking requirements now, reconnect later, or pause your enquiry? Let us know what suits you.",
      ],
    },
    {
      subject: "Our final follow-up about your private banking introduction",
      paragraphs: [
        "This is our final follow-up about your private banking introduction request.",
        "We’ll pause our emails for now. If you’d like to continue, simply message us on WhatsApp or reply to this email whenever you’re ready.",
        "Thank you for considering Envoi & Co.",
      ],
    },
  ],
  "other-service": [
    {
      subject: "Your Envoi & Co application has been approved",
      paragraphs: [
        "Thank you for your application to Envoi & Co.",
        "Your application has been approved to progress to the next stage. Our team would like to discuss your requirements and guide you through the next steps.",
        CTA_FIRST,
      ],
    },
    {
      subject: "Following up on your application",
      paragraphs: [
        "Just following up on your application to Envoi & Co.",
        "Are you still looking for help with your requirements? Message us on WhatsApp and we’ll help you explore the next steps.",
      ],
    },
    {
      subject: "Any questions about your application?",
      paragraphs: [
        "Do you have any questions about your application with Envoi & Co?",
        "Whether it’s the process, required documents, fees or timing, our team can talk you through the details before you decide to proceed.",
        "What would you like to know? Message us on WhatsApp or reply to this email.",
      ],
    },
    {
      subject: "Is now a good time to discuss your requirements?",
      paragraphs: [
        "We understand your plans may have changed.",
        "Would you like to discuss your requirements now, reconnect later, or pause your application? Let us know what suits you.",
      ],
    },
    {
      subject: "Our final follow-up about your application",
      paragraphs: [
        "This is our final follow-up about your application to Envoi & Co.",
        "We’ll pause our emails for now. If you’d like to continue, simply message us on WhatsApp or reply to this email whenever you’re ready.",
        "Thank you for considering Envoi & Co.",
      ],
    },
  ],
};

// ── Rendering ──────────────────────────────────────────────────────────────

const escapeHtml = (value: string) =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");

const firstName = (fullName: string) => fullName.trim().split(/\s+/)[0] || "there";

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

export function renderSequenceEmail(app: Pick<AdminApplication, "reference" | "form" | "fullName">, index: number): RenderedEmail {
  const template = EMAIL_SEQUENCE[app.form][index];
  const name = firstName(app.fullName);
  const whatsappUrl = signedLink(app.reference, "whatsapp");
  const unsubscribeUrl = signedLink(app.reference, "unsubscribe");

  const paragraphsHtml = [`Hi ${escapeHtml(name)},`, ...template.paragraphs.map(escapeHtml)]
    .map((p) => `<p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#111827;">${p}</p>`)
    .join("\n                ");

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(template.subject)}</title>
  </head>
  <body style="margin:0;padding:0;background:#f4f6fb;font-family:Inter,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:#f4f6fb;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;border-collapse:collapse;">
            <tr>
              <td style="padding:0 0 18px 0;">
                <span style="font-size:28px;line-height:1;font-weight:800;letter-spacing:-1.2px;color:#0e61e8;">Envoi &amp; Co</span>
              </td>
            </tr>
            <tr>
              <td style="background:#ffffff;border-radius:16px;padding:32px 28px;">
                ${paragraphsHtml}
                <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:8px 0 18px 0;">
                  <tr>
                    <td style="background:#25D366;border-radius:8px;">
                      <a href="${whatsappUrl}" style="display:inline-block;padding:14px 26px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;">Message us on WhatsApp</a>
                    </td>
                  </tr>
                </table>
                <p style="margin:0 0 6px 0;font-size:13px;line-height:1.5;color:#5f6b7a;">
                  Or message us on WhatsApp at ${DESK_WHATSAPP_DISPLAY} and quote your reference.
                </p>
                <p style="margin:0;font-size:13px;line-height:1.5;color:#5f6b7a;">Your reference: <strong style="color:#111827;">${escapeHtml(app.reference)}</strong></p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 8px 0 8px;text-align:center;font-size:12px;line-height:1.6;color:#6b7280;">
                For your security, Envoi &amp; Co will never ask for passwords, PINs or one-time codes by email or WhatsApp.<br>
                You’re receiving this because you applied through envoiandco.com.
                <a href="${unsubscribeUrl}" style="color:#6b7280;text-decoration:underline;">Unsubscribe</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = [
    `Hi ${name},`,
    "",
    ...template.paragraphs.flatMap((p) => [p, ""]),
    `Message us on WhatsApp: ${whatsappUrl}`,
    `Or message ${DESK_WHATSAPP_DISPLAY} on WhatsApp and quote your reference.`,
    "",
    `Your reference: ${app.reference}`,
    "",
    "For your security, Envoi & Co will never ask for passwords, PINs or one-time codes by email or WhatsApp.",
    `Unsubscribe: ${unsubscribeUrl}`,
  ].join("\n");

  return { subject: template.subject, html, text };
}

// ── Sending ────────────────────────────────────────────────────────────────

/** Sends sequence email `index` (0-based). Throws with a readable message on failure. */
export async function sendSequenceEmail(app: AdminApplication, index: number): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !emailConfigured()) {
    throw new Error(`Email isn't set up yet. Missing: ${missingEmailConfig().join(", ")}.`);
  }
  const email = renderSequenceEmail(app, index);
  const unsubscribeUrl = signedLink(app.reference, "unsubscribe");

  let response: Response;
  try {
    response = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: fromAddress(),
        to: app.email,
        reply_to: replyTo(),
        subject: email.subject,
        html: email.html,
        text: email.text,
        headers: {
          "List-Unsubscribe": `<${unsubscribeUrl}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      }),
      signal: AbortSignal.timeout(15_000),
    });
  } catch (err) {
    throw new Error(`Couldn't reach the email service: ${err instanceof Error ? err.message : String(err)}`);
  }

  if (!response.ok) {
    let detail = "";
    try {
      const body = (await response.json()) as { message?: string };
      detail = body.message ?? "";
    } catch {
      // no JSON body
    }
    throw new Error(`The email wasn't sent (${response.status})${detail ? `: ${detail}` : ""}.`);
  }
}
