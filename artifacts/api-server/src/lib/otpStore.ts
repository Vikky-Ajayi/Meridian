import { createHash, randomInt } from "node:crypto";

type OtpRecord = {
  hash: string;
  expiresAt: number;
};

const otpStore = new Map<string, OtpRecord>();

function hashOtp(email: string, otp: string) {
  return createHash("sha256")
    .update(`${email.toLowerCase()}:${otp}:${process.env.OTP_SECRET ?? "dev-secret"}`)
    .digest("hex");
}

export function createOtp(email: string) {
  const otp = String(randomInt(0, 1_000_000)).padStart(6, "0");
  const expiresAt = Date.now() + 10 * 60 * 1000;
  otpStore.set(email.toLowerCase(), {
    hash: hashOtp(email, otp),
    expiresAt,
  });
  return { otp, expiresAt };
}

export function verifyOtp(email: string, otp: string) {
  const key = email.toLowerCase();
  const record = otpStore.get(key);
  if (!record || record.expiresAt < Date.now()) {
    otpStore.delete(key);
    return false;
  }

  const valid = record.hash === hashOtp(email, otp);
  if (valid) otpStore.delete(key);
  return valid;
}
