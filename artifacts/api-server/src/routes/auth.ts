import { Router } from "express";
import { createOtp, verifyOtp } from "../lib/otpStore";
import { sendOtpEmail } from "../lib/resendEmail";
import { logger } from "../lib/logger";

const router = Router();

function readEmail(body: unknown) {
  if (!body || typeof body !== "object" || Array.isArray(body)) return "";
  const value = (body as Record<string, unknown>)["email"];
  return typeof value === "string" ? value.trim() : "";
}

function readOtp(body: unknown) {
  if (!body || typeof body !== "object" || Array.isArray(body)) return "";
  const value = (body as Record<string, unknown>)["otp"];
  return typeof value === "string" ? value.trim() : "";
}

router.post("/send-otp", async (req, res) => {
  const email = readEmail(req.body);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "A valid email address is required." });
  }

  const { otp } = createOtp(email);

  try {
    await sendOtpEmail(email, otp);
  } catch (err) {
    logger.error({ err, email }, "Failed to send OTP email");
    return res.status(500).json({ error: "Failed to send OTP email." });
  }

  return res.status(200).json({ ok: true });
});

router.post("/verify-otp", (req, res) => {
  const email = readEmail(req.body);
  const otp = readOtp(req.body);

  if (!email || !/^\d{6}$/.test(otp)) {
    return res.status(400).json({ error: "A valid email and 6-digit code are required." });
  }

  if (!verifyOtp(email, otp)) {
    return res.status(400).json({ error: "Invalid or expired OTP." });
  }

  return res.status(200).json({ ok: true });
});

export default router;
