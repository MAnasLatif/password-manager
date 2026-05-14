import path from "node:path";
import type { Transporter } from "nodemailer";
import nodemailer from "nodemailer";
import type Mail from "nodemailer/lib/mailer";

import {
  EMAIL_LOGO_CID,
  emailVerificationTemplate,
  passwordResetTemplate,
  teamInvitationTemplate,
  welcomeTemplate,
} from "./email-templates";

// ---------------------------------------------------------------------------
// Transporter
// ---------------------------------------------------------------------------

let _transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (_transporter) return _transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    throw new Error(
      "Missing SMTP configuration. Set SMTP_HOST, SMTP_USER, and SMTP_PASS in your .env file.",
    );
  }

  _transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT ?? 587),
    secure: SMTP_SECURE === "true",
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  return _transporter;
}

// ---------------------------------------------------------------------------
// Base send helper
// ---------------------------------------------------------------------------

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: Mail.Attachment[];
}

async function sendEmail({ to, subject, html, text, attachments }: SendEmailOptions) {
  const transporter = getTransporter();

  const from = process.env.EMAIL_FROM ?? `"MAnasPM" <no-reply@example.com>`;

  return transporter.sendMail({ from, to, subject, html, text, attachments });
}

// ---------------------------------------------------------------------------
// Named senders
// ---------------------------------------------------------------------------

export async function sendVerificationEmail(
  to: string,
  opts: { name: string; verificationUrl: string },
) {
  return sendEmail({
    to,
    subject: "Verify your email for MAnasPM",
    html: emailVerificationTemplate(opts),
    attachments: [
      {
        cid: EMAIL_LOGO_CID,
        filename: "manaspm-logo.png",
        path: path.join(process.cwd(), "public", "apple-touch-icon.png"),
      },
    ],
  });
}

export async function sendPasswordResetEmail(
  to: string,
  opts: { name: string; resetUrl: string; expiresInMinutes?: number },
) {
  return sendEmail({
    to,
    subject: "Reset your MAnasPM password",
    html: passwordResetTemplate(opts),
    attachments: [
      {
        cid: EMAIL_LOGO_CID,
        filename: "manaspm-logo.png",
        path: path.join(process.cwd(), "public", "apple-touch-icon.png"),
      },
    ],
  });
}

export async function sendWelcomeEmail(to: string, opts: { name: string; loginUrl: string }) {
  return sendEmail({
    to,
    subject: "Welcome to MAnasPM",
    html: welcomeTemplate(opts),
    attachments: [
      {
        cid: EMAIL_LOGO_CID,
        filename: "manaspm-logo.png",
        path: path.join(process.cwd(), "public", "apple-touch-icon.png"),
      },
    ],
  });
}

export async function sendTeamInvitationEmail(
  to: string,
  opts: {
    inviterName: string;
    teamName: string;
    inviteUrl: string;
    expiresInDays?: number;
  },
) {
  return sendEmail({
    to,
    subject: `You've been invited to join ${opts.teamName} on MAnasPM`,
    html: teamInvitationTemplate(opts),
    attachments: [
      {
        cid: EMAIL_LOGO_CID,
        filename: "manaspm-logo.png",
        path: path.join(process.cwd(), "public", "apple-touch-icon.png"),
      },
    ],
  });
}
