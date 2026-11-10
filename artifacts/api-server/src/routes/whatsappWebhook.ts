import { Router, type Request } from "express";
import { logger } from "../lib/logger";
import { validSignature } from "../lib/whatsappCloud";
import { handleWebhookPayload } from "../lib/whatsappMessaging";

// Meta WhatsApp Cloud API webhook: /api/whatsapp/webhook
// Configure in the Meta app dashboard → WhatsApp → Configuration, subscribe to
// the "messages" field, and use the same verify token as WHATSAPP_WEBHOOK_VERIFY_TOKEN.

const router = Router();

// One-off handshake when the webhook URL is saved in Meta's dashboard.
router.get("/webhook", (req, res) => {
  const expected = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;
  if (expected && req.query["hub.mode"] === "subscribe" && req.query["hub.verify_token"] === expected) {
    return res.status(200).send(String(req.query["hub.challenge"] ?? ""));
  }
  return res.sendStatus(403);
});

router.post("/webhook", (req: Request & { rawBody?: Buffer }, res) => {
  if (!validSignature(req.rawBody, req.header("x-hub-signature-256"))) {
    logger.warn("Rejected WhatsApp webhook with a missing or invalid signature (check WHATSAPP_APP_SECRET)");
    return res.sendStatus(401);
  }
  // Processing carries on in the background so Meta gets its 200 straight away and does not retry.
  handleWebhookPayload(req.body).catch((err) => logger.error({ err }, "Failed to process WhatsApp webhook"));
  return res.sendStatus(200);
});

export default router;
