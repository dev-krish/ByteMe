import nodemailer from "nodemailer";
import { env } from "../config/env.js";

/**
 * Creates a configured Nodemailer transporter for Gmail / SMTP
 */
function getTransporter() {
  if (!env.SMTP_USER || !env.SMTP_PASS) {
    return null; // Fallback to simulated mode
  }

  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465, // true for 465, false for 587
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });
}

/**
 * Generates an official, responsive HTML verification email
 */
function generateEmailTemplate(otp: string, recipientName: string = "Citizen / Landowner"): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NLAMS Landowner Verification Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #fdf6e3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #002b36;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fdf6e3; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="560px" style="max-width: 560px; background-color: #ffffff; border-radius: 16px; border: 1px solid #d33682; box-shadow: 0 4px 16px rgba(0,0,0,0.06); overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #073642; padding: 24px 30px; text-align: center;">
              <div style="font-size: 20px; font-weight: 800; color: #ffffff; letter-spacing: 0.5px;">
                🏛️ NLAMS
              </div>
              <div style="font-size: 11px; color: #93a1a1; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px;">
                National Land Acquisition & Management System
              </div>
              <div style="font-size: 10px; color: #2aa198; margin-top: 2px;">
                Government of India • Ministry of Rural Development
              </div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 30px 30px 20px 30px;">
              <h2 style="font-size: 18px; font-weight: 700; color: #073642; margin-top: 0; margin-bottom: 12px;">
                Landowner Portal Verification
              </h2>
              <p style="font-size: 13px; line-height: 1.6; color: #586e75; margin-bottom: 20px;">
                Dear <strong>${recipientName}</strong>,<br>
                A request was made to authenticate your session on the <strong>National Land Acquisition Portal (RFCTLARR-2013)</strong>. Use the secure One-Time Password (OTP) below to complete your login:
              </p>

              <!-- OTP Display Box -->
              <div style="background-color: #fdf6e3; border: 2px dashed #2aa198; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
                <div style="font-size: 11px; font-weight: 700; color: #2aa198; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 6px;">
                  Your Verification Code
                </div>
                <div style="font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #073642; font-family: monospace;">
                  ${otp}
                </div>
                <div style="font-size: 11px; color: #cb4b16; margin-top: 8px; font-weight: 600;">
                  ⏱️ Valid for 5 minutes only
                </div>
              </div>

              <!-- Security Notice -->
              <div style="background-color: #eee8d5; border-left: 4px solid #b58900; border-radius: 4px; padding: 12px 16px; font-size: 11px; color: #586e75; line-height: 1.5; margin-bottom: 20px;">
                <strong>⚠️ Security Warning:</strong> Do not share this OTP with anyone, including government surveyors or portal operators. Official officials will never ask for your verification code.
              </div>

              <p style="font-size: 11px; color: #93a1a1; line-height: 1.5; margin: 0;">
                If you did not initiate this request, please disregard this email or report unauthorized access immediately.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #fdf6e3; padding: 16px 30px; border-top: 1px solid #eee8d5; text-align: center;">
              <p style="font-size: 10px; color: #93a1a1; margin: 0;">
                Department of Land Resources (DoLR) • Ministry of Rural Development • Digital Governance Initiative
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Dispatches real email verification OTP via Gmail/SMTP or logs in test mode
 */
export async function sendVerificationEmail(
  toEmail: string,
  otp: string,
  recipientName: string = "Landowner Citizen"
): Promise<{ sent: boolean; messageId?: string; simulated?: boolean }> {
  const transporter = getTransporter();

  if (!transporter) {
    console.log(
      `📧 [Email Dispatch - Simulated] To: ${toEmail} | OTP: ${otp} | Name: ${recipientName}`
    );
    return { sent: true, simulated: true };
  }

  try {
    const info = await transporter.sendMail({
      from: env.EMAIL_FROM,
      to: toEmail,
      subject: `🏛️ NLAMS Verification Code: ${otp}`,
      text: `Your NLAMS Landowner verification code is ${otp}. Valid for 5 minutes. Do not share this code.`,
      html: generateEmailTemplate(otp, recipientName),
    });

    console.log(`✅ [Email Dispatch - Real] Delivered to ${toEmail} (Message ID: ${info.messageId})`);
    return { sent: true, messageId: info.messageId, simulated: false };
  } catch (error) {
    console.error(`❌ [Email Dispatch - Error] Failed to send email to ${toEmail}:`, error);
    // Return gracefully so flow doesn't crash if SMTP is temporarily unreachable
    return { sent: false, simulated: false };
  }
}
