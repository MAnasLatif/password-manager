"use client";

import useAppState from "@/contexts/app-state";
import type { Account, Platform } from "@/types";
import { getFaviconUrl, getInitials, stringToColor } from "@/utils";
import { Avatar, Button, Dropdown, Header, Label, Separator, toast, Tooltip } from "@heroui/react";
import {
  ArrowLeft,
  ClipboardList,
  Copy,
  CopyPlus,
  Download,
  Ellipsis,
  ExternalLink,
  Eye,
  EyeOff,
  FolderInput,
  History,
  Link2,
  Loader2,
  LockKeyhole,
  Pencil,
  Share2,
  Star,
  Tag,
  Timer,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCopyToClipboard } from "usehooks-ts";
import ShareModal from "./share-modal";

interface PlatformDetailPageProps {
  platform: Platform;
  accounts: Account[];
}

export default function PlatformDetailPage({ platform, accounts }: PlatformDetailPageProps) {
  const { setSearchPlaceholder, setAddButton } = useAppState();

  useEffect(() => {
    const tooltip = `Add new ${platform.name} account`;
    const on = `/new?platform=${platform.domain}`;

    setSearchPlaceholder(`Search ${platform.name} accounts`);
    setAddButton((current) => {
      if (current.tooltip === tooltip && current.on === on) {
        return current;
      }

      return { tooltip, on };
    });
  }, [platform.name, platform.domain, setSearchPlaceholder, setAddButton]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header with back button and platform info */}
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button isIconOnly variant="ghost" size="sm" aria-label="Go back">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <Avatar size="md">
            <Avatar.Image src={getFaviconUrl(platform.domain)} alt={platform.name} />
            <Avatar.Fallback
              style={{
                backgroundColor: stringToColor(platform.name),
                color: "white",
              }}
              className="text-sm font-semibold"
            >
              {getInitials(platform.name)}
            </Avatar.Fallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-lg font-semibold">{platform.name}</span>
            <span className="text-muted text-sm">{platform.domain}</span>
          </div>
        </div>
        <Tooltip delay={0}>
          <Link href={platform.domain} target="_blank" rel="noopener noreferrer">
            <Button isIconOnly variant="ghost" size="sm" aria-label="Open website">
              <ExternalLink className="text-muted size-4" />
            </Button>
          </Link>
          <Tooltip.Content>
            <p>Open {platform.domain}</p>
          </Tooltip.Content>
        </Tooltip>
      </div>

      {/* Accounts list */}
      <div className="flex flex-col gap-3">
        {accounts.length === 0 ? (
          <div className="text-muted flex flex-col items-center justify-center py-12 text-center">
            <LockKeyhole className="mb-3 size-12 opacity-40" />
            <p className="text-sm">No accounts yet</p>
            <p className="text-xs opacity-70">Add your first {platform.name} account</p>
          </div>
        ) : (
          accounts.map((account) => (
            <AccountCard key={account.id} account={account} platform={platform} />
          ))
        )}
      </div>
    </div>
  );
}

function AccountCard({ account, platform }: { account: Account; platform: Platform }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [copiedText, copy] = useCopyToClipboard();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState<string | null>(null);
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // TODO: Replace with actual API call
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const fetchPassword = async (accountId: string): Promise<string> => {
    // Dummy implementation - simulates API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return "Dummy@Password123";
  };

  const handleTogglePassword = async () => {
    if (showPassword) {
      setShowPassword(false);
      return;
    }

    if (password) {
      setShowPassword(true);
      return;
    }

    // Fetch password from backend
    setIsLoadingPassword(true);
    try {
      const fetchedPassword = await fetchPassword(account.id);
      setPassword(fetchedPassword);
      setShowPassword(true);
    } catch (error) {
      console.error("Failed to fetch password", error);
    } finally {
      setIsLoadingPassword(false);
    }
  };

  const handleCopyPassword = async () => {
    if (password) {
      handleCopy(password, "Password")();
      return;
    }

    // Fetch password first, then copy
    setIsLoadingPassword(true);
    try {
      const fetchedPassword = await fetchPassword(account.id);
      setPassword(fetchedPassword);
      handleCopy(fetchedPassword, "Password")();
    } catch (error) {
      console.error("Failed to fetch password", error);
    } finally {
      setIsLoadingPassword(false);
    }
  };

  const handleCopy = (text: string, type: string) => () => {
    copy(text)
      .then(() => {
        toast.success(`${type} copied to clipboard!`);
      })
      .catch((error) => {
        console.error("Failed to copy!", error);
      });
  };

  const getTitle = () => {
    return (
      account?.title ||
      (account?.username
        ? `${account.username[0].toLocaleUpperCase()}${account.username.slice(1)}`
        : null) ||
      (account.email ? account.email.split("@")[0] : null) ||
      null
    );
  };

  const buildAccountText = async () => {
    let pw = password;
    if (!pw && account.hasPassword) {
      pw = await fetchPassword(account.id);
      setPassword(pw);
    }
    const lines: string[] = [];
    if (platform.domain) lines.push(`URL: ${platform.domain}`);
    if (account.email) lines.push(`Email: ${account.email}`);
    if (account.username) lines.push(`Username: ${account.username}`);
    if (pw) lines.push(`Password: ${pw}`);
    if (account.notes) lines.push(`Notes: ${account.notes}`);
    return lines.join("\n");
  };

  const buildAccountJson = async () => {
    let pw = password;
    if (!pw && account.hasPassword) {
      pw = await fetchPassword(account.id);
      setPassword(pw);
    }
    const data: Record<string, string> = {};
    if (platform.domain) data.url = platform.domain;
    if (account.email) data.email = account.email;
    if (account.username) data.username = account.username;
    if (pw) data.password = pw;
    if (account.notes) data.notes = account.notes;
    return JSON.stringify(data, null, 2);
  };

  const handleCopyDetails = async () => {
    try {
      const text = await buildAccountText();
      await copy(text);
      toast.success("Account details copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy details", error);
    }
  };

  const handleDownload = async (format: "json" | "txt") => {
    try {
      const title = getTitle() || "account";
      const content = format === "json" ? await buildAccountJson() : await buildAccountText();
      const blob = new Blob([content], {
        type: format === "json" ? "application/json" : "text/plain",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(`Downloaded as ${title}.${format}`);
    } catch (error) {
      console.error("Failed to download", error);
    }
  };

  const handleOneTimeCopy = async () => {
    try {
      let pw = password;
      if (!pw && account.hasPassword) {
        setIsLoadingPassword(true);
        pw = await fetchPassword(account.id);
        setPassword(pw);
        setIsLoadingPassword(false);
      }
      if (!pw) {
        toast.danger("No password to copy");
        return;
      }
      await copy(pw);
      toast.success("Password copied — clears after you switch away");
      const handleVisibility = async () => {
        if (document.visibilityState === "hidden") {
          // User switched away (to paste) — clear on return
          const onReturn = async () => {
            try {
              await navigator.clipboard.writeText("");
            } catch {
              // Clipboard write may fail — safe to ignore
            }
            toast.info("Clipboard cleared");
            document.removeEventListener("visibilitychange", onReturn);
          };
          document.removeEventListener("visibilitychange", handleVisibility);
          document.addEventListener("visibilitychange", onReturn);
        }
      };
      document.addEventListener("visibilitychange", handleVisibility);
    } catch (error) {
      console.error("Failed to copy password", error);
    }
  };

  return (
    <div className="hover:bg-surface-hover active:bg-surface-pressed group border-default/80 flex cursor-pointer flex-col gap-4 rounded-xl border p-4 transition-colors">
      {/* Top row: Avatar + Info + Actions */}
      <div className="flex items-start gap-4">
        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col">
          {getTitle() && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-base font-semibold">{getTitle()}</span>
              {/* Avatar section - clickable to open share modal */}
              <button
                type="button"
                className="hover:bg-surface-hover shrink-0 cursor-pointer rounded p-0.5 pt-0.5 transition-colors"
                onClick={() => setIsShareModalOpen(true)}
                aria-label="Share account"
              >
                {account.sharedWith && account.sharedWith.length > 0 ? (
                  <div className="flex -space-x-1.5">
                    {account.sharedWith.slice(0, 3).map((user) => (
                      <Avatar key={user.id} className="ring-background size-5 ring-2">
                        <Avatar.Image src={user.image ?? ""} alt={user.name} />
                        <Avatar.Fallback
                          style={{
                            backgroundColor: stringToColor(user.name),
                            color: "white",
                          }}
                          className="text-[8px] font-semibold"
                        >
                          {getInitials(user.name)}
                        </Avatar.Fallback>
                      </Avatar>
                    ))}
                    {account.sharedWith.length > 3 ? (
                      <Avatar className="ring-background size-5 ring-2">
                        <Avatar.Fallback className="text-[8px]">
                          +{account.sharedWith.length - 3}
                        </Avatar.Fallback>
                      </Avatar>
                    ) : null}
                  </div>
                ) : (
                  <LockKeyhole className="text-muted/30 size-4" />
                )}
              </button>
            </div>
          )}
          {account.email && (
            <div className="flex items-center gap-2">
              <span className="text-muted text-sm">{account.email}</span>
              <Tooltip delay={0}>
                <Button
                  isIconOnly
                  variant="ghost"
                  size="sm"
                  aria-label="Copy email"
                  onPress={handleCopy(account.email, "Email")}
                >
                  <Copy className="text-muted size-4" />
                </Button>
                <Tooltip.Content>
                  <p>Copy email</p>
                </Tooltip.Content>
              </Tooltip>
            </div>
          )}
          {account.hasPassword && (
            <div className="flex items-center gap-2">
              <span className="text-muted font-mono text-sm">
                {showPassword && password ? password : "••••••••"}
              </span>
              <Tooltip delay={0}>
                <Button
                  isIconOnly
                  variant="ghost"
                  size="sm"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  isDisabled={isLoadingPassword}
                  onPress={handleTogglePassword}
                >
                  {isLoadingPassword ? (
                    <Loader2 className="text-muted size-4 animate-spin" />
                  ) : showPassword ? (
                    <EyeOff className="text-muted size-4" />
                  ) : (
                    <Eye className="text-muted size-4" />
                  )}
                </Button>
                <Tooltip.Content>
                  <p>{showPassword ? "Hide" : "Show"}</p>
                </Tooltip.Content>
              </Tooltip>
              <Tooltip delay={0}>
                <Button
                  isIconOnly
                  variant="ghost"
                  size="sm"
                  aria-label="Copy password"
                  isDisabled={isLoadingPassword}
                  onPress={handleCopyPassword}
                >
                  <Copy className="text-muted size-4" />
                </Button>
                <Tooltip.Content>
                  <p>Copy password</p>
                </Tooltip.Content>
              </Tooltip>
            </div>
          )}
          {account.notes && <span className="text-muted/70 text-xs">{account.notes}</span>}
          {/* Pinned custom fields */}
          {account.customFields
            ?.filter((f) => f.pinned)
            .map((f) => (
              <div key={f.id} className="flex items-center gap-2">
                <span className="text-muted text-xs font-medium">{f.label || f.type}:</span>
                <span className="text-muted/70 text-xs">{f.value}</span>
                <Tooltip delay={0}>
                  <Button
                    isIconOnly
                    variant="ghost"
                    size="sm"
                    aria-label={`Copy ${f.label || f.type}`}
                    onPress={handleCopy(f.value, f.label || f.type)}
                  >
                    <Copy className="text-muted size-3" />
                  </Button>
                  <Tooltip.Content>
                    <p>Copy {f.label || f.type}</p>
                  </Tooltip.Content>
                </Tooltip>
              </div>
            ))}
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-1">
          <Dropdown>
            <Button isIconOnly variant="ghost" size="sm" aria-label="More actions">
              <Ellipsis className="size-4" />
            </Button>
            <Dropdown.Popover placement="bottom end">
              <Dropdown.Menu
                onAction={(key) => {
                  if (key === "share") setIsShareModalOpen(true);
                  if (key === "copy-details") handleCopyDetails();
                  if (key === "download-json") handleDownload("json");
                  if (key === "download-txt") handleDownload("txt");
                  if (key === "open-website")
                    window.open(`https://${platform.domain}`, "_blank", "noopener,noreferrer");
                  if (key === "copy-link") {
                    const url = `${window.location.origin}/p/${platform.domain}#${account.id}`;
                    copy(url)
                      .then(() => toast.success("Link copied to clipboard!"))
                      .catch((err) => console.error("Failed to copy link", err));
                  }
                  if (key === "one-time-copy") handleOneTimeCopy();
                }}
              >
                {/* Quick Actions */}
                <Dropdown.Section>
                  <Header>Quick Actions</Header>
                  <Dropdown.Item id="open-website" textValue="Open Website">
                    <ExternalLink className="text-muted size-3.5" />
                    <Label>Open Website</Label>
                  </Dropdown.Item>
                  <Dropdown.SubmenuTrigger>
                    <Dropdown.Item id="share-copy" textValue="Share & Copy">
                      <Share2 className="text-muted size-3.5" />
                      <Label>Share & Copy</Label>
                      <Dropdown.SubmenuIndicator />
                    </Dropdown.Item>
                    <Dropdown.Popover>
                      <Dropdown.Menu>
                        <Dropdown.Item id="copy-details" textValue="Copy Details">
                          <ClipboardList className="text-muted size-3.5" />
                          <Label>Copy Details</Label>
                        </Dropdown.Item>
                        <Dropdown.Item id="copy-link" textValue="Copy Link">
                          <Link2 className="text-muted size-3.5" />
                          <Label>Copy Link</Label>
                        </Dropdown.Item>
                        <Dropdown.Item id="one-time-copy" textValue="One-Time Copy">
                          <Timer className="text-muted size-3.5" />
                          <Label>One-Time Copy</Label>
                        </Dropdown.Item>
                        <Dropdown.Item id="share" textValue="Share">
                          <Share2 className="text-muted size-3.5" />
                          <Label>Share</Label>
                        </Dropdown.Item>
                        <Dropdown.SubmenuTrigger>
                          <Dropdown.Item id="download" textValue="Download">
                            <Download className="text-muted size-3.5" />
                            <Label>Download</Label>
                            <Dropdown.SubmenuIndicator />
                          </Dropdown.Item>
                          <Dropdown.Popover>
                            <Dropdown.Menu>
                              <Dropdown.Item
                                id="download-json"
                                textValue={`${getTitle() || "account"}.json`}
                              >
                                <Label>{getTitle() || "account"}.json</Label>
                              </Dropdown.Item>
                              <Dropdown.Item
                                id="download-txt"
                                textValue={`${getTitle() || "account"}.txt`}
                              >
                                <Label>{getTitle() || "account"}.txt</Label>
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown.Popover>
                        </Dropdown.SubmenuTrigger>
                      </Dropdown.Menu>
                    </Dropdown.Popover>
                  </Dropdown.SubmenuTrigger>
                </Dropdown.Section>
                <Separator />
                {/* Organize */}
                <Dropdown.Section>
                  <Header>Organize</Header>
                  <Dropdown.Item id="favorite" textValue="Favorite">
                    <Star className="text-muted size-3.5" />
                    <Label>Favorite</Label>
                  </Dropdown.Item>
                  <Dropdown.Item id="add-tag" textValue="Add Tag">
                    <Tag className="text-muted size-3.5" />
                    <Label>Add Tag</Label>
                  </Dropdown.Item>
                </Dropdown.Section>
                <Separator />
                {/* Manage */}
                <Dropdown.Section>
                  <Header>Manage</Header>
                  <Dropdown.Item id="edit" textValue="Edit">
                    <Pencil className="text-muted size-3.5" />
                    <Label>Edit</Label>
                  </Dropdown.Item>
                  <Dropdown.Item id="duplicate" textValue="Duplicate">
                    <CopyPlus className="text-muted size-3.5" />
                    <Label>Duplicate</Label>
                  </Dropdown.Item>
                  <Dropdown.Item id="move" textValue="Move">
                    <FolderInput className="text-muted size-3.5" />
                    <Label>Move</Label>
                  </Dropdown.Item>
                  <Dropdown.Item id="view-history" textValue="View History">
                    <History className="text-muted size-3.5" />
                    <Label>View History</Label>
                  </Dropdown.Item>
                </Dropdown.Section>
                <Separator />
                {/* Danger Zone */}
                <Dropdown.Section>
                  <Header>Danger Zone</Header>
                  <Dropdown.Item id="delete" textValue="Delete" variant="danger">
                    <Trash2 className="text-danger size-3.5" />
                    <Label>Delete</Label>
                  </Dropdown.Item>
                </Dropdown.Section>
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        account={account}
        isOpen={isShareModalOpen}
        onOpenChange={setIsShareModalOpen}
        title={getTitle()}
      />
    </div>
  );
}
