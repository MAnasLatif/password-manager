"use client";

import { Avatar, Button, Chip, Tooltip, toast } from "@heroui/react";
import { Copy, Eye, EyeOff, Loader2, LockKeyhole, Star } from "lucide-react";
import { useState } from "react";
import { useCopyToClipboard } from "usehooks-ts";
import type { Account, Platform } from "@/types";
import { getInitials, stringToColor } from "@/utils";
import type { ExportFormat } from "@/utils/account";
import { buildAccountText, getAccountTitle } from "@/utils/account";
import AccountCardMenu from "./account-card-menu";
import ExportModal from "./export-modal";
import OneTimeLinkModal from "./one-time-link-modal";
import ShareModal from "./share-modal";
import TagsModal from "./tags-modal";

interface AccountCardProps {
  account: Account;
  platform: Platform;
}

export default function AccountCard({ account, platform }: AccountCardProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_copiedText, copy] = useCopyToClipboard();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState<string | null>(null);
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isOneTimeLinkModalOpen, setIsOneTimeLinkModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("json");
  const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
  const [accountTags, setAccountTags] = useState(account.tags ?? []);

  // TODO: Replace with actual API call
  const fetchPassword = async (accountId: string): Promise<string> => {
    // Dummy implementation - simulates API delay
    // eslint-disable-next-line no-console
    console.log(`Fetching password for account ${accountId}...`);
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

  const getTitle = () => getAccountTitle(account);

  const resolvePassword = async (): Promise<string | null> => {
    if (password) return password;
    if (!account.hasPassword) return null;
    const pw = await fetchPassword(account.id);
    setPassword(pw);
    return pw;
  };

  const handleCopyDetails = async () => {
    try {
      const pw = await resolvePassword();
      const text = buildAccountText(account, platform, pw);
      await copy(text);
      toast.success("Account details copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy details", error);
    }
  };

  return (
    <div className="group flex cursor-pointer flex-col gap-4 rounded-xl border border-default/80 p-4 transition-colors hover:bg-surface-hover active:bg-surface-pressed">
      {/* Top row: Avatar + Info + Actions */}
      <div className="flex items-start gap-4">
        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col">
          {getTitle() && (
            <div className="flex flex-wrap items-center gap-2">
              {account.isFavorite && (
                <Star className="size-4 shrink-0 fill-yellow-400 text-yellow-400" />
              )}
              <span className="font-semibold text-base">{getTitle()}</span>
              {account.tags?.map((tag) => (
                <Chip
                  key={tag.id}
                  size="sm"
                  variant="soft"
                  style={
                    tag.color ? { backgroundColor: `${tag.color}20`, color: tag.color } : undefined
                  }
                >
                  {tag.name}
                </Chip>
              ))}
              {/* Avatar section - clickable to open share modal */}
              <button
                type="button"
                className="shrink-0 cursor-pointer rounded p-0.5 pt-0.5 transition-colors hover:bg-surface-hover"
                onClick={() => setIsShareModalOpen(true)}
                aria-label="Share account"
              >
                {account.sharedWith && account.sharedWith.length > 0 ? (
                  <div className="flex -space-x-1.5">
                    {account.sharedWith.slice(0, 3).map((user) => (
                      <Avatar key={user.id} className="size-5 ring-2 ring-background">
                        <Avatar.Image src={user.image ?? ""} alt={user.name} />
                        <Avatar.Fallback
                          style={{
                            backgroundColor: stringToColor(user.name),
                            color: "white",
                          }}
                          className="font-semibold text-[8px]"
                        >
                          {getInitials(user.name)}
                        </Avatar.Fallback>
                      </Avatar>
                    ))}
                    {account.sharedWith.length > 3 ? (
                      <Avatar className="size-5 ring-2 ring-background">
                        <Avatar.Fallback className="text-[8px]">
                          +{account.sharedWith.length - 3}
                        </Avatar.Fallback>
                      </Avatar>
                    ) : null}
                  </div>
                ) : (
                  <LockKeyhole className="size-4 text-muted/30" />
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
                  <Copy className="size-4 text-muted" />
                </Button>
                <Tooltip.Content>
                  <p>Copy email</p>
                </Tooltip.Content>
              </Tooltip>
            </div>
          )}
          {account.hasPassword && (
            <div className="flex items-center gap-2">
              <span className="font-mono text-muted text-sm">
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
                    <Loader2 className="size-4 animate-spin text-muted" />
                  ) : showPassword ? (
                    <EyeOff className="size-4 text-muted" />
                  ) : (
                    <Eye className="size-4 text-muted" />
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
                  <Copy className="size-4 text-muted" />
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
                <span className="font-medium text-muted text-xs">{f.label || f.type}:</span>
                <span className="text-muted/70 text-xs">{f.value}</span>
                <Tooltip delay={0}>
                  <Button
                    isIconOnly
                    variant="ghost"
                    size="sm"
                    aria-label={`Copy ${f.label || f.type}`}
                    onPress={handleCopy(f.value, f.label || f.type)}
                  >
                    <Copy className="size-3 text-muted" />
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
          <AccountCardMenu
            title={getTitle()}
            isFavorite={account.isFavorite}
            onOpenWebsite={() =>
              window.open(`https://${platform.domain}`, "_blank", "noopener,noreferrer")
            }
            onCopyDetails={handleCopyDetails}
            onCopyLink={() => {
              const url = `${window.location.origin}/p/${platform.domain}#${account.id}`;
              copy(url)
                .then(() => toast.success("Link copied to clipboard!"))
                .catch((err) => console.error("Failed to copy link", err));
            }}
            onOneTimeCopy={() => setIsOneTimeLinkModalOpen(true)}
            onShare={() => setIsShareModalOpen(true)}
            onExport={(fmt) => {
              setExportFormat(fmt as ExportFormat);
              setIsExportModalOpen(true);
            }}
            onFavorite={() => {}}
            onAddTag={() => setIsTagsModalOpen(true)}
            onEdit={() => {}}
            onDuplicate={() => {}}
            onMove={() => {}}
            onViewHistory={() => {}}
            onDelete={() => {}}
          />
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        account={account}
        isOpen={isShareModalOpen}
        onOpenChange={setIsShareModalOpen}
        onOpenOneTimeLinks={() => setIsOneTimeLinkModalOpen(true)}
        title={getTitle()}
      />

      {/* One-Time Link Modal */}
      <OneTimeLinkModal
        account={account}
        isOpen={isOneTimeLinkModalOpen}
        onOpenChange={setIsOneTimeLinkModalOpen}
        title={getTitle()}
      />

      {/* Export Modal */}
      <ExportModal
        account={account}
        platform={platform}
        format={exportFormat}
        isOpen={isExportModalOpen}
        onOpenChange={setIsExportModalOpen}
        resolvePassword={resolvePassword}
      />

      {/* Tags Modal */}
      <TagsModal
        isOpen={isTagsModalOpen}
        onOpenChange={setIsTagsModalOpen}
        accountTags={accountTags}
        onTagsChange={setAccountTags}
        title={getTitle()}
      />
    </div>
  );
}
