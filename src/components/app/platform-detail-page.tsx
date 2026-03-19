"use client";

import useAppState from "@/contexts/app-state";
import type { Account, Platform } from "@/types";
import { getFaviconUrl, getInitials, stringToColor } from "@/utils";
import { Avatar, Button, toast, Tooltip } from "@heroui/react";
import {
  ArrowLeft,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  FolderInput,
  Loader2,
  LockKeyhole,
  Pencil,
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
          accounts.map((account) => <AccountCard key={account.id} account={account} />)
        )}
      </div>
    </div>
  );
}

function AccountCard({ account }: { account: Account }) {
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
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-1">
          <Tooltip delay={0}>
            <Button isIconOnly variant="secondary" size="sm" aria-label="Move account">
              <FolderInput className="size-4" />
            </Button>
            <Tooltip.Content>
              <p>Move</p>
            </Tooltip.Content>
          </Tooltip>
          <Tooltip delay={0}>
            <Button isIconOnly variant="secondary" size="sm" aria-label="Edit account">
              <Pencil className="size-4" />
            </Button>
            <Tooltip.Content>
              <p>Edit</p>
            </Tooltip.Content>
          </Tooltip>
          <Tooltip delay={0}>
            <Button
              isIconOnly
              variant="secondary"
              size="sm"
              aria-label="Delete account"
              className="text-danger hover:bg-danger/10"
            >
              <Trash2 className="size-4" />
            </Button>
            <Tooltip.Content>
              <p>Delete</p>
            </Tooltip.Content>
          </Tooltip>
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
