// ---------------------------------------------------------------------------
// Shared layout
// ---------------------------------------------------------------------------

function layout(content: string) {
  return /* html */ `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Account Manager</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #18181b; }
    a { color: inherit; }
  </style>
</head>
<body>
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f4f4f5;padding:40px 16px;">
    <tr>
      <td align="center">
        <!-- Card -->
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.08);">

          <!-- Header -->
          <tr>
            <td style="background:#18181b;padding:28px 40px;">
              <span style="font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-0.3px;">Account Manager</span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #f4f4f5;">
              <p style="font-size:12px;color:#71717a;line-height:1.6;">
                This email was sent by Account Manager. If you didn't request this, you can safely ignore it.<br/>
                &copy; ${new Date().getFullYear()} Account Manager. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// CTA button
// ---------------------------------------------------------------------------

function ctaButton(url: string, label: string) {
  return /* html */ `
<table cellpadding="0" cellspacing="0" role="presentation" style="margin:28px 0;">
  <tr>
    <td style="border-radius:8px;background:#18181b;">
      <a href="${url}" target="_blank"
         style="display:inline-block;padding:13px 28px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;letter-spacing:0.1px;">
        ${label}
      </a>
    </td>
  </tr>
</table>`;
}

// ---------------------------------------------------------------------------
// Divider
// ---------------------------------------------------------------------------

function divider() {
  return `<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin:24px 0;">
  <tr><td style="border-top:1px solid #f4f4f5;"></td></tr>
</table>`;
}

// ---------------------------------------------------------------------------
// Templates
// ---------------------------------------------------------------------------

export interface EmailVerificationTemplateOptions {
  name: string;
  verificationUrl: string;
}

export function emailVerificationTemplate({
  name,
  verificationUrl,
}: EmailVerificationTemplateOptions): string {
  const content = /* html */ `
    <h1 style="font-size:22px;font-weight:700;color:#18181b;margin-bottom:8px;">Verify your email</h1>
    <p style="font-size:15px;color:#52525b;line-height:1.7;margin-bottom:4px;">Hi ${name},</p>
    <p style="font-size:15px;color:#52525b;line-height:1.7;">
      Thanks for signing up! Click the button below to verify your email address and activate your account.
    </p>
    ${ctaButton(verificationUrl, "Verify email address")}
    ${divider()}
    <p style="font-size:13px;color:#71717a;line-height:1.7;">
      Or copy and paste this link into your browser:<br/>
      <a href="${verificationUrl}" style="color:#18181b;word-break:break-all;">${verificationUrl}</a>
    </p>
    <p style="font-size:13px;color:#71717a;margin-top:12px;">This link expires in <strong>24 hours</strong>.</p>
  `;
  return layout(content);
}

// ---------------------------------------------------------------------------

export interface PasswordResetTemplateOptions {
  name: string;
  resetUrl: string;
  expiresInMinutes?: number;
}

export function passwordResetTemplate({
  name,
  resetUrl,
  expiresInMinutes = 60,
}: PasswordResetTemplateOptions): string {
  const content = /* html */ `
    <h1 style="font-size:22px;font-weight:700;color:#18181b;margin-bottom:8px;">Reset your password</h1>
    <p style="font-size:15px;color:#52525b;line-height:1.7;margin-bottom:4px;">Hi ${name},</p>
    <p style="font-size:15px;color:#52525b;line-height:1.7;">
      We received a request to reset your password. Click the button below to choose a new one.
    </p>
    ${ctaButton(resetUrl, "Reset password")}
    ${divider()}
    <p style="font-size:13px;color:#71717a;line-height:1.7;">
      Or copy and paste this link into your browser:<br/>
      <a href="${resetUrl}" style="color:#18181b;word-break:break-all;">${resetUrl}</a>
    </p>
    <p style="font-size:13px;color:#71717a;margin-top:12px;">
      This link expires in <strong>${expiresInMinutes} minutes</strong>. If you didn't request a password reset, no action is needed.
    </p>
  `;
  return layout(content);
}

// ---------------------------------------------------------------------------

export interface WelcomeTemplateOptions {
  name: string;
  loginUrl: string;
}

export function welcomeTemplate({
  name,
  loginUrl,
}: WelcomeTemplateOptions): string {
  const content = /* html */ `
    <h1 style="font-size:22px;font-weight:700;color:#18181b;margin-bottom:8px;">Welcome aboard 🎉</h1>
    <p style="font-size:15px;color:#52525b;line-height:1.7;margin-bottom:4px;">Hi ${name},</p>
    <p style="font-size:15px;color:#52525b;line-height:1.7;">
      Your account is ready. Account Manager helps you securely store and share credentials — your vault is encrypted and only you hold the keys.
    </p>
    <p style="font-size:15px;color:#52525b;line-height:1.7;margin-top:12px;">Here's what you can do:</p>
    <ul style="font-size:15px;color:#52525b;line-height:1.9;padding-left:20px;margin-top:8px;">
      <li>Add credentials to your personal vault</li>
      <li>Organize entries with tags and groups</li>
      <li>Share securely with team members</li>
      <li>Track activity with a full audit log</li>
    </ul>
    ${ctaButton(loginUrl, "Go to your vault")}
  `;
  return layout(content);
}

// ---------------------------------------------------------------------------

export interface TeamInvitationTemplateOptions {
  inviterName: string;
  teamName: string;
  inviteUrl: string;
  expiresInDays?: number;
}

export function teamInvitationTemplate({
  inviterName,
  teamName,
  inviteUrl,
  expiresInDays = 7,
}: TeamInvitationTemplateOptions): string {
  const content = /* html */ `
    <h1 style="font-size:22px;font-weight:700;color:#18181b;margin-bottom:8px;">You're invited to a team</h1>
    <p style="font-size:15px;color:#52525b;line-height:1.7;">
      <strong>${inviterName}</strong> has invited you to join the <strong>${teamName}</strong> team on Account Manager.
    </p>
    ${ctaButton(inviteUrl, `Join ${teamName}`)}
    ${divider()}
    <p style="font-size:13px;color:#71717a;line-height:1.7;">
      Or copy and paste this link into your browser:<br/>
      <a href="${inviteUrl}" style="color:#18181b;word-break:break-all;">${inviteUrl}</a>
    </p>
    <p style="font-size:13px;color:#71717a;margin-top:12px;">
      This invitation expires in <strong>${expiresInDays} days</strong>. If you weren't expecting this, you can ignore it.
    </p>
  `;
  return layout(content);
}
