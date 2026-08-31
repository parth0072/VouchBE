import nodemailer, { type Transporter } from "nodemailer";
import { ApiError } from "./apiError";

let transporter: Transporter | null = null;

// Lazy + throws ApiError(501) rather than a raw nodemailer/SMTP error, so a
// missing config surfaces the same way every other unconfigured integration
// in this codebase does (Stripe, OAuth — see lib/stripe.ts) — loud and
// specific, never a fake success.
function getTransporter(): Transporter {
  if (!transporter) {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;
    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD) {
      throw new ApiError(501, "Email sending is not configured (missing SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASSWORD)");
    }
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465, // 465 = implicit TLS; 587/25 use STARTTLS, nodemailer negotiates that itself
      auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
    });
  }
  return transporter;
}

export async function sendVerificationCodeEmail(to: string, code: string, ttlMinutes: number) {
  const transport = getTransporter();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER!;
  await transport.sendMail({
    from,
    to,
    subject: "Your Vouch verification code",
    text: `Your verification code is ${code}. It expires in ${ttlMinutes} minutes.`,
    html: `<p>Your verification code is <strong>${code}</strong>. It expires in ${ttlMinutes} minutes.</p>`,
  });
}
