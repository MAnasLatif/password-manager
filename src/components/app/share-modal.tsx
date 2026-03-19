"use client";

import type { Account } from "@/types";
import { getInitials, stringToColor } from "@/utils";
import { Avatar, Button, ListBox, Modal, Select, Separator, toast } from "@heroui/react";
import { FolderInput, Link2, Trash2, Upload } from "lucide-react";
import { useState } from "react";
import { useCopyToClipboard } from "usehooks-ts";

interface ShareModalProps {
  account: Account;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title: string | null;
}

export default function ShareModal({ account, isOpen, onOpenChange, title }: ShareModalProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [copiedText, copy] = useCopyToClipboard();
  const [email, setEmail] = useState("");
  const handleCopyLink = () => {
    // TODO: Replace with actual share link
    const shareLink = `${window.location.origin}/${account.id}`;
    copy(shareLink)
      .then(() => {
        toast.success("Link copied to clipboard!");
      })
      .catch((error) => {
        console.error("Failed to copy!", error);
      });
  };

  const handleShare = () => {
    if (!email) return;
    // TODO: Implement actual share logic
    toast.success(`Shared with ${email}`);
    setEmail("");
  };

  // Dummy shared users for UI (uses account.sharedWith or empty array)
  const sharedUsers = account.sharedWith || [];

  return (
    <Modal>
      <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
        <Modal.Container size="sm">
          <Modal.Dialog className="p-3">
            {/* <Modal.CloseTrigger /> */}
            <Modal.Header className="mr-10 flex flex-row items-center gap-1">
              <div className="bg-primary/10 flex size-8 items-center justify-center rounded-lg">
                <Upload className="text-primary size-4" />
              </div>
              <div className="flex flex-1 items-center gap-1.5">
                <span className="font-semibold">Share</span>
                <span className="text-muted text-sm">&quot;{title}&quot;</span>
              </div>
              <button
                type="button"
                className="text-muted hover:text-foreground flex cursor-pointer items-center gap-1.5 text-sm transition-colors"
                onClick={handleCopyLink}
              >
                <Link2 className="size-4" />
                <span>Copy link</span>
              </button>
              <Modal.CloseTrigger />
            </Modal.Header>

            <Modal.Body className="flex flex-col gap-4">
              {/* Email input with inline button */}
              <div className="border-default flex items-center gap-2 rounded-lg border px-3 py-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="share by email"
                  className="text-muted placeholder:text-muted/50 flex-1 bg-transparent text-sm outline-none"
                  aria-label="Email address"
                />
                <Button
                  size="sm"
                  variant="primary"
                  onPress={handleShare}
                  isDisabled={!email}
                  className="h-7 px-3 text-xs"
                >
                  Share
                </Button>
              </div>

              {/* Access section */}
              {sharedUsers.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="text-muted text-xs font-medium">Allow Access</span>
                  <div className="flex flex-col">
                    {sharedUsers.map((user) => (
                      <div key={user.id} className="flex items-center gap-3 py-2">
                        <Avatar className="size-9">
                          <Avatar.Image src={user.image ?? ""} alt={user.name} />
                          <Avatar.Fallback
                            style={{
                              backgroundColor: stringToColor(user.name),
                              color: "white",
                            }}
                            className="text-xs font-semibold"
                          >
                            {getInitials(user.name)}
                          </Avatar.Fallback>
                        </Avatar>
                        <div className="flex flex-1 flex-col">
                          <span className="text-sm font-medium">{user.name}</span>
                          {user.email && <span className="text-muted text-xs">{user.email}</span>}
                        </div>
                        <Select value={user.permission || "view"} aria-label="Permission level">
                          <Select.Trigger className="border-default h-8 w-24 border bg-transparent text-sm">
                            <Select.Value />
                            <Select.Indicator />
                          </Select.Trigger>
                          <Select.Popover>
                            <ListBox>
                              <ListBox.Item id="view" textValue="view">
                                view
                                <ListBox.ItemIndicator />
                              </ListBox.Item>
                              <ListBox.Item id="edit" textValue="can edit">
                                can edit
                                <ListBox.ItemIndicator />
                              </ListBox.Item>
                              <Separator className="my-1" />
                              <ListBox.Item id="transfer" textValue="Transfer ownership">
                                <FolderInput className="text-primary size-4" />
                                <span>Transfer ownership</span>
                              </ListBox.Item>
                              <ListBox.Item id="remove" textValue="Remove access" variant="danger">
                                <Trash2 className="text-danger size-4" />
                                <span>Remove access</span>
                              </ListBox.Item>
                            </ListBox>
                          </Select.Popover>
                        </Select>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
