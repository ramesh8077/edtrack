/**
 * Email service placeholder.
 * Uses Resend in production — configure RESEND_API_KEY in .env
 */

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Send an email via Resend (or log in development).
 */
export async function sendEmail(options: SendEmailOptions): Promise<{ success: boolean }> {
  if (!process.env.RESEND_API_KEY) {
    console.log("📧 [Dev] Email would be sent:", {
      to: options.to,
      subject: options.subject,
    });
    return { success: true };
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: process.env.EMAIL_FROM ?? "noreply@learnloop.ai",
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    return { success: true };
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    return { success: false };
  }
}

/**
 * Send a verification email.
 */
export async function sendVerificationEmail(email: string, token: string): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const verifyUrl = `${baseUrl}/verify?token=${token}`;

  await sendEmail({
    to: email,
    subject: "Verify your LearnLoop AI account",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #7c3aed;">Welcome to LearnLoop AI! 🚀</h1>
        <p>Click the link below to verify your email address:</p>
        <a href="${verifyUrl}" style="display: inline-block; padding: 12px 24px; background: #7c3aed; color: white; text-decoration: none; border-radius: 8px;">
          Verify Email
        </a>
        <p style="color: #666; margin-top: 24px;">This link expires in 24 hours.</p>
      </div>
    `,
  });
}
