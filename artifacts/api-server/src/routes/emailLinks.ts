import { Router, type Response } from "express";
import { findApplication, saveReview } from "../lib/applications";
import { deskWhatsAppLink, validLinkToken } from "../lib/emailSequence";
import { logger } from "../lib/logger";

// Public links used in application emails: /api/email/whatsapp and /api/email/unsubscribe.
// Both are signed per application (see lib/emailSequence.ts), so they can't be guessed.

const router = Router();

function page(res: Response, status: number, title: string, body: string, extra = "") {
  res.status(status).set("Cache-Control", "no-store").type("html").send(`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><title>${title}</title></head>
<body style="margin:0;background:#f4f6fb;font-family:Inter,Arial,sans-serif;color:#111827;">
<main style="max-width:480px;margin:64px auto;padding:32px 28px;background:#fff;border-radius:16px;">
<p style="margin:0 0 20px 0;font-size:24px;font-weight:800;letter-spacing:-1px;color:#0e61e8;">Envoi &amp; Co</p>
<h1 style="font-size:20px;margin:0 0 12px 0;">${title}</h1>
<p style="font-size:15px;line-height:1.6;color:#374151;margin:0;">${body}</p>${extra}
</main></body></html>`);
}

const params = (q: Record<string, unknown>) => ({ ref: String(q.ref ?? ""), token: String(q.t ?? "") });

// "Message us on WhatsApp" button: note the first click, then open WhatsApp with the message typed.
router.get("/whatsapp", async (req, res) => {
  const { ref, token } = params(req.query);
  if (!validLinkToken(ref, "whatsapp", token)) return page(res, 404, "Link not recognised", "This link isn't valid. Please message us on WhatsApp at +44 7886 857463.");
  try {
    const app = await findApplication(ref);
    if (app && !app.whatsappClickedAt) await saveReview(app, { whatsappClickedAt: new Date() });
  } catch (err) {
    logger.warn({ err, reference: ref }, "Could not record WhatsApp link click");
  }
  return res.redirect(302, deskWhatsAppLink(ref));
});

// Unsubscribe page. GET asks for confirmation (email scanners open links on their
// own); POST unsubscribes, which also covers mail apps' one-click unsubscribe.
router.get("/unsubscribe", (req, res) => {
  const { ref, token } = params(req.query);
  if (!validLinkToken(ref, "unsubscribe", token)) return page(res, 404, "Link not recognised", "This unsubscribe link isn't valid. Reply to any of our emails and we'll stop contacting you.");
  const action = `?ref=${encodeURIComponent(ref)}&t=${encodeURIComponent(token)}`;
  return page(
    res,
    200,
    "Stop emails from Envoi & Co?",
    "We'll stop sending you follow-up emails about your application.",
    `<form method="post" action="${action}" style="margin-top:20px;"><button type="submit" style="background:#000;color:#fff;border:0;border-radius:8px;padding:12px 22px;font-size:14px;font-weight:700;cursor:pointer;">Unsubscribe</button></form>`,
  );
});

router.post("/unsubscribe", async (req, res) => {
  const { ref, token } = params(req.query);
  if (!validLinkToken(ref, "unsubscribe", token)) return page(res, 404, "Link not recognised", "This unsubscribe link isn't valid. Reply to any of our emails and we'll stop contacting you.");
  try {
    const app = await findApplication(ref);
    if (app && !app.optedOutAt) await saveReview(app, { optedOutAt: new Date() });
  } catch (err) {
    logger.error({ err, reference: ref }, "Unsubscribe failed");
    return page(res, 500, "Something went wrong", "We couldn't update your preferences just now. Please try again, or reply to any of our emails and we'll stop contacting you.");
  }
  return page(res, 200, "You're unsubscribed", "You won't receive any more follow-up emails about your application. If you'd still like to talk, message us on WhatsApp at +44 7886 857463.");
});

export default router;
