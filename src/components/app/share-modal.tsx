"use client";

import type { Account } from "@/types";
import { getInitials, stringToColor } from "@/utils";
import {
  Avatar,
  Button,
  InputGroup,
  ListBox,
  Modal,
  ScrollShadow,
  Select,
  Separator,
  TextField,
  toast,
} from "@heroui/react";
import { Crown, FolderInput, Link2, Mail, Trash2, Upload, Users } from "lucide-react";
import { useRef, useState } from "react";
import { useCopyToClipboard } from "usehooks-ts";

interface ShareModalProps {
  account: Account;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title: string | null;
}

// Dummy recent contacts for suggestion dropdown (UI only)
const RECENT_CONTACTS = [
  { id: "r1", name: "John Doe", email: "john.doe@example.com", image: null, type: "user" as const },
  {
    id: "r2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    image: null,
    type: "user" as const,
  },
  {
    id: "r3",
    name: "Bob Wilson",
    email: "bob.wilson@example.com",
    image: null,
    type: "user" as const,
  },
  {
    id: "r4",
    name: "Alice Brown",
    email: "alice.brown@example.com",
    image: null,
    type: "user" as const,
  },
];

const RECENT_TEAMS = [
  { id: "t1", name: "Engineering", memberCount: 12, type: "team" as const },
  { id: "t2", name: "Design", memberCount: 6, type: "team" as const },
  { id: "t3", name: "Marketing", memberCount: 8, type: "team" as const },
];

export default function ShareModal({ account, isOpen, onOpenChange, title }: ShareModalProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [copiedText, copy] = useCopyToClipboard();
  const [email, setEmail] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
    setShowSuggestions(false);
  };

  const handleSelectSuggestion = (name: string, emailOrTeam: string) => {
    // Append to existing comma-separated list
    const parts = email
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);
    // Replace the last (in-progress) part with the selection
    if (email.endsWith(",") || email.endsWith(", ")) {
      setEmail(email + emailOrTeam + ", ");
    } else {
      parts.pop();
      parts.push(emailOrTeam);
      setEmail(parts.join(", ") + ", ");
    }
    setShowSuggestions(true);
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    // Show suggestions when input is focused, especially after a comma
    const lastPart = value.split(",").pop()?.trim() ?? "";
    setShowSuggestions(
      value.endsWith(",") || value.endsWith(", ") || lastPart.length === 0 || lastPart.length > 0,
    );
  };

  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  const handleInputBlur = () => {
    // Delay to allow click on suggestion
    setTimeout(() => setShowSuggestions(false), 200);
  };

  // Filter suggestions based on text after the last comma
  const currentQuery = (email.split(",").pop()?.trim() ?? "").toLowerCase();
  const filteredContacts = RECENT_CONTACTS.filter(
    (c) =>
      c.name.toLowerCase().includes(currentQuery) || c.email.toLowerCase().includes(currentQuery),
  );
  const filteredTeams = RECENT_TEAMS.filter((t) => t.name.toLowerCase().includes(currentQuery));

  // Dummy data
  const sharedUsers = account.sharedWith || [];
  const sharedTeams = account.sharedWithTeams || [];
  const owner = account.owner || {
    id: "owner-1",
    name: "You",
    email: "you@example.com",
    permission: "owner" as const,
  };

  return (
    <Modal>
      <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
        <Modal.Container size="md" placement="top">
          <Modal.Dialog className="p-0">
            <Modal.Header className="mr-10 flex flex-row items-center gap-1 p-3 pb-0">
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

            <Modal.Body className="mt-0 flex flex-col gap-4 p-3">
              {/* Email/team input with suggestions */}
              <div className="relative">
                <TextField aria-label="Email or team name" className="w-full" name="share-email">
                  <InputGroup fullWidth variant="secondary">
                    <InputGroup.Prefix>
                      <Mail className="text-muted size-4" />
                    </InputGroup.Prefix>
                    <InputGroup.Input
                      ref={inputRef}
                      autoComplete="off"
                      name="share-email-input"
                      placeholder="Add people or teams by email or name"
                      value={email}
                      onChange={handleInputChange}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                    />
                    <InputGroup.Suffix className="gap-1 pr-1">
                      <Select defaultValue="view" variant="secondary" aria-label="Permission level">
                        <Select.Trigger className="bg-transparent">
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
                          </ListBox>
                        </Select.Popover>
                      </Select>
                      <Button
                        size="sm"
                        variant="primary"
                        onPress={handleShare}
                        isDisabled={!email}
                        className="h-7 px-3 text-xs"
                      >
                        Share
                      </Button>
                    </InputGroup.Suffix>
                  </InputGroup>
                </TextField>

                {/* Suggestions dropdown */}
                {showSuggestions && (filteredContacts.length > 0 || filteredTeams.length > 0) && (
                  <div className="border-default bg-surface absolute top-full right-0 left-0 z-100 mt-1 overflow-hidden rounded-xl border shadow-xl">
                    <ScrollShadow className="max-h-60">
                      {filteredContacts.length > 0 && (
                        <div className="p-1">
                          <span className="text-muted px-2 py-1 text-xs font-medium">
                            Recent People
                          </span>
                          {filteredContacts.map((contact) => (
                            <button
                              key={contact.id}
                              type="button"
                              className="hover:bg-default flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleSelectSuggestion(contact.name, contact.email);
                              }}
                            >
                              <Avatar className="size-7">
                                <Avatar.Fallback
                                  style={{
                                    backgroundColor: stringToColor(contact.name),
                                    color: "white",
                                  }}
                                  className="text-[10px] font-semibold"
                                >
                                  {getInitials(contact.name)}
                                </Avatar.Fallback>
                              </Avatar>
                              <div className="flex flex-1 flex-col">
                                <span className="text-sm font-medium">{contact.name}</span>
                                <span className="text-muted text-xs">{contact.email}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                      {filteredTeams.length > 0 && (
                        <div className="p-1">
                          {filteredContacts.length > 0 && <Separator className="my-1" />}
                          <span className="text-muted px-2 py-1 text-xs font-medium">Teams</span>
                          {filteredTeams.map((team) => (
                            <button
                              key={team.id}
                              type="button"
                              className="hover:bg-default flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleSelectSuggestion(team.name, team.name);
                              }}
                            >
                              <div className="bg-primary/10 flex size-7 items-center justify-center rounded-full">
                                <Users className="text-primary size-3.5" />
                              </div>
                              <div className="flex flex-1 flex-col">
                                <span className="text-sm font-medium">{team.name}</span>
                                <span className="text-muted text-xs">
                                  {team.memberCount} members
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </ScrollShadow>
                  </div>
                )}
              </div>

              {/* Access section */}
              <div className="flex flex-col gap-2">
                <span className="text-muted text-xs font-medium">Allow Access</span>
                <ScrollShadow className="max-h-100">
                  <div className="flex flex-col">
                    {/* Owner */}
                    <div className="flex items-center gap-3 py-2">
                      <Avatar className="size-9">
                        {owner.image && <Avatar.Image src={owner.image} alt={owner.name} />}
                        <Avatar.Fallback
                          style={{
                            backgroundColor: stringToColor(owner.name),
                            color: "white",
                          }}
                          className="text-xs font-semibold"
                        >
                          {getInitials(owner.name)}
                        </Avatar.Fallback>
                      </Avatar>
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-medium">{owner.name}</span>
                          <Crown className="text-warning size-3.5" />
                        </div>
                        {owner.email && <span className="text-muted text-xs">{owner.email}</span>}
                      </div>
                      <span className="text-muted px-2 text-sm">owner</span>
                    </div>

                    {/* Shared Users */}
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
                        <Select
                          value={user.permission || "view"}
                          aria-label="Permission level"
                          variant="secondary"
                        >
                          <Select.Trigger className="bg-transparent">
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

                    {/* Shared Teams */}
                    {sharedTeams.length > 0 && (
                      <>
                        <span className="text-muted mb-1 text-xs font-medium">Teams</span>
                        {sharedTeams.map((team) => (
                          <div key={team.id} className="flex items-center gap-3 py-2">
                            <div className="bg-primary/10 flex size-9 items-center justify-center rounded-full">
                              <Users className="text-primary size-4" />
                            </div>
                            <div className="flex flex-1 flex-col">
                              <span className="text-sm font-medium">{team.name}</span>
                              <span className="text-muted text-xs">{team.memberCount} members</span>
                            </div>
                            <Select
                              value={team.permission || "view"}
                              aria-label="Permission level"
                              variant="secondary"
                            >
                              <Select.Trigger className="bg-transparent">
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
                                  <ListBox.Item
                                    id="remove"
                                    textValue="Remove team"
                                    variant="danger"
                                  >
                                    <Trash2 className="text-danger size-4" />
                                    <span>Remove team</span>
                                  </ListBox.Item>
                                </ListBox>
                              </Select.Popover>
                            </Select>
                          </div>
                        ))}
                      </>
                    )}
                    <div className="mb-4" />
                  </div>
                </ScrollShadow>
              </div>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
