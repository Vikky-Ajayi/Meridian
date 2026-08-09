import { renderOtpEmail, renderOtpEmailText } from "./otpEmailTemplate";

const RESEND_API_URL = "https://api.resend.com/emails";

export async function sendOtpEmail(email: string, otp: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.OTP_FROM_EMAIL;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set");
  }
  if (!from) {
    throw new Error("OTP_FROM_EMAIL is not set");
  }

  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: email,
      subject: "Your Aldric Private verification code",
      html: renderOtpEmail({ otp, recipientEmail: email }),
      text: renderOtpEmailText({ otp, recipientEmail: email }),
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend email failed: ${response.status} ${body}`);
  }
}
