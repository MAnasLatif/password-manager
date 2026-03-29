import type { Account, Platform } from "@/types";

export function getAccountTitle(account: Account): string | null {
  return (
    account?.title ||
    (account?.username
      ? `${account.username[0].toLocaleUpperCase()}${account.username.slice(1)}`
      : null) ||
    (account.email ? account.email.split("@")[0] : null) ||
    null
  );
}

export function buildAccountText(
  account: Account,
  platform: Platform,
  password: string | null,
): string {
  const lines: string[] = [];
  if (platform.domain) lines.push(`URL: ${platform.domain}`);
  if (account.email) lines.push(`Email: ${account.email}`);
  if (account.username) lines.push(`Username: ${account.username}`);
  if (password) lines.push(`Password: ${password}`);
  if (account.notes) lines.push(`Notes: ${account.notes}`);
  return lines.join("\n");
}

export function buildAccountJson(
  account: Account,
  platform: Platform,
  password: string | null,
): string {
  const data: Record<string, string> = {};
  if (platform.domain) data.url = platform.domain;
  if (account.email) data.email = account.email;
  if (account.username) data.username = account.username;
  if (password) data.password = password;
  if (account.notes) data.notes = account.notes;
  return JSON.stringify(data, null, 2);
}

export function downloadAccountFile(
  content: string,
  filename: string,
  format: "json" | "txt",
): void {
  const blob = new Blob([content], {
    type: format === "json" ? "application/json" : "text/plain",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
