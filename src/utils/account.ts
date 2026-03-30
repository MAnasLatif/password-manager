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

export type ExportFormat = "json" | "txt" | "csv" | "md" | "xml" | "yaml";

export type PasswordRevealPolicy = "include" | "mask" | "exclude";

export interface ExportOptions {
  fields: {
    url: boolean;
    email: boolean;
    username: boolean;
    password: boolean;
    notes: boolean;
    customFields: boolean;
    tags: boolean;
  };
  format: ExportFormat;
  passwordPolicy: PasswordRevealPolicy;
}

export function buildAccountText(
  account: Account,
  platform: Platform,
  password: string | null,
  options?: ExportOptions,
): string {
  const lines: string[] = [];
  const fields = options?.fields;
  const pwPolicy = options?.passwordPolicy ?? "include";

  if ((!fields || fields.url) && platform.domain) lines.push(`URL: ${platform.domain}`);
  if ((!fields || fields.email) && account.email) lines.push(`Email: ${account.email}`);
  if ((!fields || fields.username) && account.username) lines.push(`Username: ${account.username}`);
  if ((!fields || fields.password) && password) {
    if (pwPolicy === "include") lines.push(`Password: ${password}`);
    else if (pwPolicy === "mask") lines.push(`Password: ••••••••`);
  }
  if ((!fields || fields.notes) && account.notes) lines.push(`Notes: ${account.notes}`);
  if (fields?.customFields && account.customFields) {
    for (const f of account.customFields) {
      lines.push(`${f.label || f.type}: ${f.value}`);
    }
  }
  if (fields?.tags && account.tags && account.tags.length > 0) {
    lines.push(`Tags: ${account.tags.map((t) => t.name).join(", ")}`);
  }
  return lines.join("\n");
}

export function buildAccountJson(
  account: Account,
  platform: Platform,
  password: string | null,
  options?: ExportOptions,
): string {
  const data: Record<string, unknown> = {};
  const fields = options?.fields;
  const pwPolicy = options?.passwordPolicy ?? "include";

  if ((!fields || fields.url) && platform.domain) data.url = platform.domain;
  if ((!fields || fields.email) && account.email) data.email = account.email;
  if ((!fields || fields.username) && account.username) data.username = account.username;
  if ((!fields || fields.password) && password) {
    if (pwPolicy === "include") data.password = password;
    else if (pwPolicy === "mask") data.password = "••••••••";
  }
  if ((!fields || fields.notes) && account.notes) data.notes = account.notes;
  if (fields?.customFields && account.customFields) {
    data.customFields = account.customFields.map((f) => ({
      label: f.label || f.type,
      value: f.value,
    }));
  }
  if (fields?.tags && account.tags && account.tags.length > 0) {
    data.tags = account.tags.map((t) => t.name);
  }
  return JSON.stringify(data, null, 2);
}

export function buildAccountCsv(
  account: Account,
  platform: Platform,
  password: string | null,
  options?: ExportOptions,
): string {
  const headers: string[] = [];
  const values: string[] = [];
  const fields = options?.fields;
  const pwPolicy = options?.passwordPolicy ?? "include";

  if ((!fields || fields.url) && platform.domain) {
    headers.push("URL");
    values.push(platform.domain);
  }
  if ((!fields || fields.email) && account.email) {
    headers.push("Email");
    values.push(account.email);
  }
  if ((!fields || fields.username) && account.username) {
    headers.push("Username");
    values.push(account.username);
  }
  if ((!fields || fields.password) && password) {
    headers.push("Password");
    if (pwPolicy === "include") values.push(`"${password.replace(/"/g, '""')}"`);
    else if (pwPolicy === "mask") values.push("••••••••");
    else values.push("");
  }
  if ((!fields || fields.notes) && account.notes) {
    headers.push("Notes");
    values.push(`"${account.notes.replace(/"/g, '""')}"`);
  }
  if (fields?.tags && account.tags && account.tags.length > 0) {
    headers.push("Tags");
    values.push(`"${account.tags.map((t) => t.name).join(", ")}"`);
  }
  return headers.join(",") + "\n" + values.join(",");
}

export function buildAccountMarkdown(
  account: Account,
  platform: Platform,
  password: string | null,
  options?: ExportOptions,
): string {
  const lines: string[] = [];
  const title = account.title || account.username || account.email || "Account";
  const fields = options?.fields;
  const pwPolicy = options?.passwordPolicy ?? "include";

  lines.push(`# ${title}`);
  lines.push("");
  if ((!fields || fields.url) && platform.domain) lines.push(`- **URL:** ${platform.domain}`);
  if ((!fields || fields.email) && account.email) lines.push(`- **Email:** ${account.email}`);
  if ((!fields || fields.username) && account.username)
    lines.push(`- **Username:** ${account.username}`);
  if ((!fields || fields.password) && password) {
    if (pwPolicy === "include") lines.push(`- **Password:** \`${password}\``);
    else if (pwPolicy === "mask") lines.push(`- **Password:** ••••••••`);
  }
  if ((!fields || fields.notes) && account.notes) {
    lines.push("");
    lines.push("## Notes");
    lines.push(account.notes);
  }
  if (fields?.customFields && account.customFields) {
    lines.push("");
    lines.push("## Custom Fields");
    for (const f of account.customFields) {
      lines.push(`- **${f.label || f.type}:** ${f.value}`);
    }
  }
  if (fields?.tags && account.tags && account.tags.length > 0) {
    lines.push("");
    lines.push(`**Tags:** ${account.tags.map((t) => `\`${t.name}\``).join(", ")}`);
  }
  return lines.join("\n");
}

export function buildAccountXml(
  account: Account,
  platform: Platform,
  password: string | null,
  options?: ExportOptions,
): string {
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const lines: string[] = ['<?xml version="1.0" encoding="UTF-8"?>', "<account>"];
  const fields = options?.fields;
  const pwPolicy = options?.passwordPolicy ?? "include";

  if ((!fields || fields.url) && platform.domain)
    lines.push(`  <url>${esc(platform.domain)}</url>`);
  if ((!fields || fields.email) && account.email)
    lines.push(`  <email>${esc(account.email)}</email>`);
  if ((!fields || fields.username) && account.username)
    lines.push(`  <username>${esc(account.username)}</username>`);
  if ((!fields || fields.password) && password) {
    if (pwPolicy === "include") lines.push(`  <password>${esc(password)}</password>`);
    else if (pwPolicy === "mask") lines.push(`  <password>••••••••</password>`);
  }
  if ((!fields || fields.notes) && account.notes)
    lines.push(`  <notes>${esc(account.notes)}</notes>`);
  if (fields?.tags && account.tags && account.tags.length > 0) {
    lines.push("  <tags>");
    for (const t of account.tags) lines.push(`    <tag>${esc(t.name)}</tag>`);
    lines.push("  </tags>");
  }
  lines.push("</account>");
  return lines.join("\n");
}

export function buildAccountYaml(
  account: Account,
  platform: Platform,
  password: string | null,
  options?: ExportOptions,
): string {
  const lines: string[] = [];
  const fields = options?.fields;
  const pwPolicy = options?.passwordPolicy ?? "include";

  if ((!fields || fields.url) && platform.domain) lines.push(`url: "${platform.domain}"`);
  if ((!fields || fields.email) && account.email) lines.push(`email: "${account.email}"`);
  if ((!fields || fields.username) && account.username)
    lines.push(`username: "${account.username}"`);
  if ((!fields || fields.password) && password) {
    if (pwPolicy === "include") lines.push(`password: "${password}"`);
    else if (pwPolicy === "mask") lines.push(`password: "••••••••"`);
  }
  if ((!fields || fields.notes) && account.notes)
    lines.push(`notes: "${account.notes.replace(/"/g, '\\"')}"`);
  if (fields?.tags && account.tags && account.tags.length > 0) {
    lines.push("tags:");
    for (const t of account.tags) lines.push(`  - "${t.name}"`);
  }
  return lines.join("\n");
}

export function buildExportContent(
  account: Account,
  platform: Platform,
  password: string | null,
  options: ExportOptions,
): string {
  switch (options.format) {
    case "json":
      return buildAccountJson(account, platform, password, options);
    case "txt":
      return buildAccountText(account, platform, password, options);
    case "csv":
      return buildAccountCsv(account, platform, password, options);
    case "md":
      return buildAccountMarkdown(account, platform, password, options);
    case "xml":
      return buildAccountXml(account, platform, password, options);
    case "yaml":
      return buildAccountYaml(account, platform, password, options);
  }
}

const MIME_TYPES: Record<ExportFormat, string> = {
  json: "application/json",
  txt: "text/plain",
  csv: "text/csv",
  md: "text/markdown",
  xml: "application/xml",
  yaml: "text/yaml",
};

export function downloadAccountFile(content: string, filename: string, format: ExportFormat): void {
  const blob = new Blob([content], {
    type: MIME_TYPES[format] || "text/plain",
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
