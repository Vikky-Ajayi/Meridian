interface OtpEmailTemplateOptions {
  otp: string;
  recipientEmail: string;
  expiresInMinutes?: number;
  dashboardUrl?: string;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function renderOtpEmail({
  otp,
  recipientEmail,
  expiresInMinutes = 10,
  dashboardUrl = "https://adricprivate.com/aldric-dashboard",
}: OtpEmailTemplateOptions) {
  const safeOtp = escapeHtml(otp);
  const safeEmail = escapeHtml(recipientEmail);
  const safeDashboardUrl = escapeHtml(dashboardUrl);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light dark">
    <meta name="supported-color-schemes" content="light dark">
    <title>Your Aldric Private OTP</title>
    <style>
      :root {
        color-scheme: light dark;
        supported-color-schemes: light dark;
      }
      @media (prefers-color-scheme: dark) {
        .email-bg { background: #07133c !important; }
        .email-card { background: #ffffff !important; }
        .muted { color: #5f6b7a !important; }
        .body-text { color: #111827 !important; }
        .preheader { color: #07133c !important; }
      }
    </style>
  </head>
  <body class="email-bg" style="margin:0;padding:0;background:#f4f6fb;font-family:Inter,Arial,sans-serif;">
    <div class="preheader" style="display:none;max-height:0;overflow:hidden;color:#f4f6fb;opacity:0;">
      Your Aldric Private verification code is ${safeOtp}. It expires in ${expiresInMinutes} minutes.
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:#f4f6fb;" class="email-bg">
      <tr>
        <td align="center" style="padding:36px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;border-collapse:collapse;">
            <tr>
              <td style="padding:0 0 18px 0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                  <tr>
                    <td align="left">
                      <span style="font-size:34px;line-height:1;font-weight:800;letter-spacing:-1.8px;color:#0f61e9;">ALDRIC</span>
                      <span style="font-size:16px;line-height:1;color:#555;margin-left:4px;">Private</span>
                    </td>
                    <td align="right" class="muted" style="font-size:12px;line-height:1.4;color:#6b7280;">
                      Private Client Desk
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td class="email-card" style="background:#ffffff;border-radius:24px;padding:0;box-shadow:0 18px 42px rgba(15,23,42,0.12);overflow:hidden;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                  <tr>
                    <td style="background:#07133c;padding:26px 28px;">
                      <p style="margin:0 0 10px 0;font-size:12px;line-height:1.2;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;color:#7fb1ff;">Secure verification</p>
                      <h1 style="margin:0;font-size:28px;line-height:1.12;font-weight:800;letter-spacing:-1.1px;color:#ffffff;">Your one-time passcode</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:30px 28px 32px 28px;">
                <p class="body-text" style="margin:0 0 12px 0;font-size:17px;line-height:1.5;color:#111827;">
                  Hello,
                </p>
                <p class="muted" style="margin:0 0 28px 0;font-size:15px;line-height:1.6;color:#5f6b7a;">
                  Use the verification code below to continue accessing your Aldric Private client dashboard. This code was requested for <strong style="color:#111827;">${safeEmail}</strong>.
                </p>

                <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:separate;border-spacing:8px 0;margin:0 auto 26px auto;">
                  <tr>
                    ${safeOtp
                      .split("")
                      .map(
                        (digit) =>
                          `<td align="center" style="width:50px;height:56px;background:#f4f7fb;border:1px solid #d9f4e8;border-radius:14px;font-size:30px;line-height:56px;font-weight:800;color:#111827;">${digit}</td>`,
                      )
                      .join("")}
                  </tr>
                </table>

                <p class="body-text" style="margin:0 0 24px 0;font-size:15px;line-height:1.5;color:#111827;text-align:center;">
                  This code expires in <strong>${expiresInMinutes} minutes</strong>.
                </p>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 26px 0;">
                  <tr>
                    <td style="background:#f7f8fb;border-radius:14px;padding:16px 18px;">
                      <p class="body-text" style="margin:0 0 6px 0;font-size:14px;line-height:1.45;font-weight:700;color:#111827;">Security reminder</p>
                      <p class="muted" style="margin:0;font-size:13px;line-height:1.55;color:#5f6b7a;">
                        Aldric Private will never ask you to share this code over WhatsApp, phone, or email. Keep it private.
                      </p>
                    </td>
                  </tr>
                </table>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                  <tr>
                    <td align="center" style="padding:8px 0 0 0;">
                      <a href="${safeDashboardUrl}" style="display:inline-block;background:#000000;color:#ffffff;text-decoration:none;border-radius:8px;padding:14px 30px;font-size:14px;font-weight:700;">Open Aldric Private</a>
                    </td>
                  </tr>
                </table>

                <p class="muted" style="margin:28px 0 0 0;font-size:13px;line-height:1.55;color:#5f6b7a;text-align:center;">
                  If you did not request this code, you can safely ignore this email.
                </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td class="muted" style="padding:18px 8px 0 8px;text-align:center;font-size:12px;line-height:1.5;color:#6b7280;">
                Aldric Private Client Desk<br>
                Confidential access for private introductions and submitted opportunities.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function renderOtpEmailText({
  otp,
  recipientEmail,
  expiresInMinutes = 10,
}: OtpEmailTemplateOptions) {
  return [
    "Aldric Private OTP",
    "",
    `A 6-digit code was requested for ${recipientEmail}.`,
    `Your code is: ${otp}`,
    `This code expires in ${expiresInMinutes} minutes.`,
    "",
    "If you did not request this code, you can safely ignore this email.",
  ].join("\n");
}
