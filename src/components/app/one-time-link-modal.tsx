"use client";

import {
  Avatar,
  Button,
  Chip,
  ListBox,
  Modal,
  Popover,
  ScrollShadow,
  Select,
  Tooltip,
  toast,
} from "@heroui/react";
import {
  ArrowDownUp,
  Ban,
  Check,
  Clock,
  Copy,
  Eye,
  Link2,
  Plus,
  Timer,
  Trash2,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useCopyToClipboard } from "usehooks-ts";
import type { Account } from "@/types";
import { getInitials, stringToColor } from "@/utils";

interface OneTimeLinkModalProps {
  account: Account;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title: string | null;
}

interface OneTimeLink {
  id: string;
  url: string;
  createdAt: Date;
  expiresAt: Date | null;
  createdBy: { name: string; email?: string; image?: string };
  status: "active" | "used" | "expired" | "revoked" | "deactivated";
  usedAt?: Date;
  permission: "view" | "one-time-copy";
  usageLimit: number;
  usageCount: number;
  copiedCount: number;
}

// Dummy data for UI
const DUMMY_LINKS: OneTimeLink[] = [
  {
    id: "otl-1",
    url: "https://app.example.com/share/abc123",
    createdAt: new Date("2026-03-28T14:30:00"),
    expiresAt: new Date("2026-03-29T14:30:00"),
    createdBy: { name: "You", email: "you@example.com" },
    status: "active",
    permission: "one-time-copy",
    usageLimit: 3,
    usageCount: 1,
    copiedCount: 4,
  },
  {
    id: "otl-2",
    url: "https://app.example.com/share/def456",
    createdAt: new Date("2026-03-25T09:15:00"),
    expiresAt: new Date("2026-03-26T09:15:00"),
    createdBy: { name: "You", email: "you@example.com" },
    status: "used",
    usedAt: new Date("2026-03-25T11:45:00"),
    permission: "one-time-copy",
    usageLimit: 2,
    usageCount: 2,
    copiedCount: 3,
  },
  {
    id: "otl-3",
    url: "https://app.example.com/share/ghi789",
    createdAt: new Date("2026-03-20T16:00:00"),
    expiresAt: new Date("2026-03-21T16:00:00"),
    createdBy: { name: "Jane Smith", email: "jane@example.com" },
    status: "expired",
    permission: "view",
    usageLimit: 1,
    usageCount: 0,
    copiedCount: 1,
  },
  {
    id: "otl-4",
    url: "https://app.example.com/share/jkl012",
    createdAt: new Date("2026-03-15T10:00:00"),
    expiresAt: null,
    createdBy: { name: "You", email: "you@example.com" },
    status: "deactivated",
    permission: "one-time-copy",
    usageLimit: 5,
    usageCount: 3,
    copiedCount: 6,
  },
];

const STATUS_CONFIG = {
  active: { label: "Active", color: "success" as const },
  used: { label: "Fully Used", color: "default" as const },
  expired: { label: "Expired", color: "warning" as const },
  revoked: { label: "Revoked", color: "danger" as const },
  deactivated: { label: "Deactivated", color: "danger" as const },
};

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDateTime(date: Date) {
  return `${formatDate(date)} at ${formatTime(date)}`;
}

function formatRelativeExpiry(date: Date): string {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  if (diff <= 0) return "Expired";
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ${hours % 24}h left`;
  if (hours > 0) return `${hours}h left`;
  const mins = Math.floor(diff / 60000);
  return `${mins}m left`;
}

type SortOption = "newest" | "oldest" | "status" | "expiry";

function sortLinks(links: OneTimeLink[], sortBy: SortOption): OneTimeLink[] {
  return [...links].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return b.createdAt.getTime() - a.createdAt.getTime();
      case "oldest":
        return a.createdAt.getTime() - b.createdAt.getTime();
      case "status": {
        const order = { active: 0, used: 1, expired: 2, deactivated: 3, revoked: 4 };
        return order[a.status] - order[b.status];
      }
      case "expiry": {
        const aExp = a.expiresAt?.getTime() ?? Infinity;
        const bExp = b.expiresAt?.getTime() ?? Infinity;
        return aExp - bExp;
      }
    }
  });
}

function getExpiryDuration(key: string): number | null {
  switch (key) {
    case "1h":
      return 3600000;
    case "24h":
      return 86400000;
    case "7d":
      return 604800000;
    case "30d":
      return 2592000000;
    default:
      return null; // "never"
  }
}

function getUsageLimitValue(key: string): number {
  switch (key) {
    case "1":
      return 1;
    case "2":
      return 2;
    case "5":
      return 5;
    case "10":
      return 10;
    default:
      return 0; // unlimited
  }
}

export default function OneTimeLinkModal({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  account,
  isOpen,
  onOpenChange,
  title,
}: OneTimeLinkModalProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_copiedText, copy] = useCopyToClipboard();
  const [links, setLinks] = useState<OneTimeLink[]>(DUMMY_LINKS);
  const [expiry, setExpiry] = useState("24h");
  const [usageLimit, setUsageLimit] = useState("1");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCopyLink = useCallback(
    (id: string, url: string) => {
      copy(url)
        .then(() => {
          setLinks((prev) =>
            prev.map((l) => (l.id === id ? { ...l, copiedCount: l.copiedCount + 1 } : l)),
          );
          setCopiedId(id);
          if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
          copyTimeoutRef.current = setTimeout(() => setCopiedId(null), 1500);
          toast.success("Link copied to clipboard!");
        })
        .catch((err) => console.error("Failed to copy", err));
    },
    [copy],
  );

  const handleCreateLink = () => {
    const duration = getExpiryDuration(expiry);
    const newLink: OneTimeLink = {
      id: `otl-${Date.now()}`,
      url: `https://app.example.com/share/${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date(),
      expiresAt: duration ? new Date(Date.now() + duration) : null,
      createdBy: { name: "You", email: "you@example.com" },
      status: "active",
      permission: "one-time-copy",
      usageLimit: getUsageLimitValue(usageLimit),
      usageCount: 0,
      copiedCount: 0,
    };
    setLinks([newLink, ...links]);
    toast.success("One-time link created!");

    // Auto-copy the new link
    copy(newLink.url).catch(() => {});
  };

  const handleRevokeLink = (id: string) => {
    setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, status: "revoked" as const } : l)));
    toast.success("Link revoked");
  };

  const handleDeactivateLink = (id: string) => {
    setLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: "deactivated" as const } : l)),
    );
    toast.success("Link deactivated");
  };

  const activeCount = links.filter((l) => l.status === "active").length;
  const sortedLinks = sortLinks(links, sortBy);

  return (
    <Modal>
      <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
        <Modal.Container size="lg" placement="top">
          <Modal.Dialog className="p-0">
            <Modal.Header className="mr-10 flex flex-row items-center gap-2 p-4 pb-0">
              <div className="flex size-9 items-center justify-center rounded-xl">
                <Timer className="size-5" />
              </div>
              <div className="flex flex-1 flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">One-Time Links</span>
                  {activeCount > 0 && (
                    <Chip size="sm" variant="secondary" color="accent">
                      {activeCount} active
                    </Chip>
                  )}
                </div>
                <span className="text-muted text-xs">{title}</span>
              </div>
              <Modal.CloseTrigger />
            </Modal.Header>

            <Modal.Body className="mt-0 flex flex-col gap-4 p-4">
              {/* Create new link section */}
              <div className="flex flex-col gap-3 rounded-2xl bg-default/40 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium text-sm">Create a new link</span>
                    <span className="text-muted text-xs">
                      Anyone with the link can view credentials
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap items-end gap-3">
                  <Select
                    defaultValue="24h"
                    variant="secondary"
                    aria-label="Link expiration"
                    onSelectionChange={(key) => {
                      if (key) setExpiry(String(key));
                    }}
                  >
                    <Select.Trigger>
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox>
                        <ListBox.Item id="1h" textValue="1 hour">
                          1 hour
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                        <ListBox.Item id="24h" textValue="24 hours">
                          24 hours
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                        <ListBox.Item id="7d" textValue="7 days">
                          7 days
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                        <ListBox.Item id="30d" textValue="30 days">
                          30 days
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                        <ListBox.Item id="never" textValue="Never">
                          Never
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                      </ListBox>
                    </Select.Popover>
                  </Select>
                  <Select
                    defaultValue="1"
                    variant="secondary"
                    aria-label="Usage limit"
                    onSelectionChange={(key) => {
                      if (key) setUsageLimit(String(key));
                    }}
                  >
                    <Select.Trigger>
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox>
                        <ListBox.Item id="1" textValue="1 use">
                          1 use
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                        <ListBox.Item id="2" textValue="2 uses">
                          2 uses
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                        <ListBox.Item id="5" textValue="5 uses">
                          5 uses
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                        <ListBox.Item id="10" textValue="10 uses">
                          10 uses
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                        <ListBox.Item id="unlimited" textValue="Unlimited">
                          Unlimited
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                      </ListBox>
                    </Select.Popover>
                  </Select>
                  <Button variant="primary" onPress={handleCreateLink}>
                    <Plus className="size-3.5" />
                    Create Link
                  </Button>
                </div>
              </div>

              {/* Links list */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-muted text-xs">
                    Previous Links ({links.length})
                  </span>
                  {links.length > 1 && (
                    <Select
                      defaultValue="newest"
                      variant="secondary"
                      aria-label="Sort links"
                      className="w-auto"
                      onSelectionChange={(key) => {
                        if (key) setSortBy(String(key) as SortOption);
                      }}
                    >
                      <Select.Trigger className="h-6 gap-1 border-none bg-transparent px-1.5 text-[11px] shadow-none">
                        <ArrowDownUp className="size-3 text-muted" />
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>
                          <ListBox.Item id="newest" textValue="Newest first">
                            Newest first
                            <ListBox.ItemIndicator />
                          </ListBox.Item>
                          <ListBox.Item id="oldest" textValue="Oldest first">
                            Oldest first
                            <ListBox.ItemIndicator />
                          </ListBox.Item>
                          <ListBox.Item id="status" textValue="By status">
                            By status
                            <ListBox.ItemIndicator />
                          </ListBox.Item>
                          <ListBox.Item id="expiry" textValue="By expiry">
                            By expiry
                            <ListBox.ItemIndicator />
                          </ListBox.Item>
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  )}
                </div>

                {links.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 py-8">
                    <div className="flex size-10 items-center justify-center rounded-full bg-default">
                      <Link2 className="size-5 text-muted" />
                    </div>
                    <p className="text-muted text-sm">No one-time links created yet</p>
                    <p className="text-muted/60 text-xs">
                      Create a link above to share credentials securely
                    </p>
                  </div>
                ) : (
                  <ScrollShadow className="max-h-80">
                    <div className="flex flex-col gap-2">
                      {sortedLinks.map((link) => {
                        const config = STATUS_CONFIG[link.status];
                        const isActive = link.status === "active";
                        const isCopied = copiedId === link.id;
                        return (
                          <div
                            key={link.id}
                            className="flex overflow-hidden rounded-xl border border-default transition-colors"
                          >
                            <div className="flex flex-1 flex-col gap-2.5 p-3">
                              {/* Row 1: Status + permission + actions */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  <Chip size="sm" variant="soft" color={config.color}>
                                    {config.label}
                                  </Chip>
                                  <Chip size="sm" variant="soft">
                                    {link.permission === "one-time-copy"
                                      ? "One-time copy"
                                      : "View only"}
                                  </Chip>
                                </div>
                                {isActive && (
                                  <div className="flex items-center gap-0.5">
                                    {/* #5: Copy with inline check feedback */}
                                    <Tooltip>
                                      <Tooltip.Trigger>
                                        <Button
                                          isIconOnly
                                          size="sm"
                                          variant="ghost"
                                          aria-label="Copy link"
                                          onPress={() => handleCopyLink(link.id, link.url)}
                                        >
                                          {isCopied ? (
                                            <Check className="size-3.5 text-success" />
                                          ) : (
                                            <Copy className="size-3.5" />
                                          )}
                                        </Button>
                                      </Tooltip.Trigger>
                                      <Tooltip.Content>
                                        {isCopied ? "Copied!" : "Copy link"}
                                      </Tooltip.Content>
                                    </Tooltip>

                                    {/* #6: Tooltips on action buttons */}
                                    {/* #2: Confirm deactivate via Popover */}
                                    <Popover>
                                      <Tooltip>
                                        <Tooltip.Trigger>
                                          <Popover.Trigger>
                                            <Button
                                              isIconOnly
                                              size="sm"
                                              variant="ghost"
                                              aria-label="Deactivate link"
                                            >
                                              <Ban className="size-3.5 text-warning" />
                                            </Button>
                                          </Popover.Trigger>
                                        </Tooltip.Trigger>
                                        <Tooltip.Content>Deactivate</Tooltip.Content>
                                      </Tooltip>
                                      <Popover.Content className="p-3">
                                        <div className="flex flex-col gap-2">
                                          <span className="font-medium text-sm">
                                            Deactivate this link?
                                          </span>
                                          <span className="text-muted text-xs">
                                            The link will stop working immediately.
                                          </span>
                                          <div className="mt-1 flex justify-end gap-2">
                                            <Button
                                              size="sm"
                                              variant="secondary"
                                              className="h-7 px-3 text-xs"
                                            >
                                              Cancel
                                            </Button>
                                            <Button
                                              size="sm"
                                              variant="primary"
                                              className="h-7 bg-warning px-3 text-black text-xs"
                                              onPress={() => handleDeactivateLink(link.id)}
                                            >
                                              Deactivate
                                            </Button>
                                          </div>
                                        </div>
                                      </Popover.Content>
                                    </Popover>

                                    {/* #2: Confirm delete via Popover */}
                                    <Popover>
                                      <Tooltip>
                                        <Tooltip.Trigger>
                                          <Popover.Trigger>
                                            <Button
                                              isIconOnly
                                              size="sm"
                                              variant="ghost"
                                              aria-label="Delete link"
                                            >
                                              <Trash2 className="size-3.5 text-danger" />
                                            </Button>
                                          </Popover.Trigger>
                                        </Tooltip.Trigger>
                                        <Tooltip.Content>Delete</Tooltip.Content>
                                      </Tooltip>
                                      <Popover.Content className="p-3">
                                        <div className="flex flex-col gap-2">
                                          <span className="font-medium text-sm">
                                            Delete this link?
                                          </span>
                                          <span className="text-muted text-xs">
                                            This action cannot be undone.
                                          </span>
                                          <div className="mt-1 flex justify-end gap-2">
                                            <Button
                                              size="sm"
                                              variant="secondary"
                                              className="h-7 px-3 text-xs"
                                            >
                                              Cancel
                                            </Button>
                                            <Button
                                              size="sm"
                                              variant="danger"
                                              className="h-7 px-3 text-xs"
                                              onPress={() => handleRevokeLink(link.id)}
                                            >
                                              Delete
                                            </Button>
                                          </div>
                                        </div>
                                      </Popover.Content>
                                    </Popover>
                                  </div>
                                )}
                              </div>

                              {/* Row 2: Stats */}
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5">
                                  <Eye className="size-3 text-muted" />
                                  <span className="text-xs">
                                    <span className="font-medium">
                                      {link.usageCount}/{link.usageLimit || "∞"}
                                    </span>{" "}
                                    <span className="text-muted">uses</span>
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Copy className="size-3 text-muted" />
                                  <span className="text-xs">
                                    <span className="font-medium">{link.copiedCount}</span>{" "}
                                    <span className="text-muted">copied</span>
                                  </span>
                                </div>
                                {isActive && link.expiresAt && (
                                  <div className="flex items-center gap-1.5">
                                    <Clock className="size-3 text-warning" />
                                    <span className="font-medium text-warning text-xs">
                                      {formatRelativeExpiry(link.expiresAt)}
                                    </span>
                                  </div>
                                )}
                                {isActive && !link.expiresAt && (
                                  <div className="flex items-center gap-1.5">
                                    <Clock className="size-3 text-success" />
                                    <span className="font-medium text-success text-xs">
                                      Never expires
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Row 3: Meta */}
                              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted">
                                <span>{formatDateTime(link.createdAt)}</span>
                                <span>·</span>
                                <span className="flex items-center gap-1">
                                  <Avatar className="inline-flex size-3.5">
                                    <Avatar.Fallback
                                      style={{
                                        backgroundColor: stringToColor(link.createdBy.name),
                                        color: "white",
                                      }}
                                      className="font-semibold text-[6px]"
                                    >
                                      {getInitials(link.createdBy.name)}
                                    </Avatar.Fallback>
                                  </Avatar>
                                  {link.createdBy.name}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollShadow>
                )}
              </div>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
