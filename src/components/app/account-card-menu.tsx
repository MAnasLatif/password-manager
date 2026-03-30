"use client";

import { Button, Dropdown, Header, Label, Separator } from "@heroui/react";
import {
  ClipboardList,
  CopyPlus,
  Download,
  Ellipsis,
  ExternalLink,
  FolderInput,
  History,
  Link2,
  Pencil,
  Share2,
  Star,
  StarOff,
  Tag,
  Timer,
  Trash2,
} from "lucide-react";

interface AccountCardMenuProps {
  title: string | null;
  isFavorite?: boolean;
  onOpenWebsite: () => void;
  onCopyDetails: () => void;
  onCopyLink: () => void;
  onOneTimeCopy: () => void;
  onShare: () => void;
  onDownload: (format: "json" | "txt") => void;
  onFavorite: () => void;
  onAddTag: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onMove: () => void;
  onViewHistory: () => void;
  onDelete: () => void;
}

export default function AccountCardMenu({
  title,
  isFavorite,
  onOpenWebsite,
  onCopyDetails,
  onCopyLink,
  onOneTimeCopy,
  onShare,
  onDownload,
  onFavorite,
  onAddTag,
  onEdit,
  onDuplicate,
  onMove,
  onViewHistory,
  onDelete,
}: AccountCardMenuProps) {
  return (
    <Dropdown>
      <Button isIconOnly variant="ghost" size="sm" aria-label="More actions">
        <Ellipsis className="size-4" />
      </Button>
      <Dropdown.Popover placement="bottom end">
        <Dropdown.Menu
          onAction={(key) => {
            if (key === "open-website") onOpenWebsite();
            if (key === "copy-details") onCopyDetails();
            if (key === "copy-link") onCopyLink();
            if (key === "one-time-copy") onOneTimeCopy();
            if (key === "share") onShare();
            if (key === "download-json") onDownload("json");
            if (key === "download-txt") onDownload("txt");
            if (key === "favorite") onFavorite();
            if (key === "add-tag") onAddTag();
            if (key === "edit") onEdit();
            if (key === "duplicate") onDuplicate();
            if (key === "move") onMove();
            if (key === "view-history") onViewHistory();
            if (key === "delete") onDelete();
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
                <Dropdown.Menu
                  onAction={(key) => {
                    if (key === "copy-details") onCopyDetails();
                    if (key === "copy-link") onCopyLink();
                    if (key === "one-time-copy") onOneTimeCopy();
                    if (key === "share") onShare();
                    if (key === "download-json") onDownload("json");
                    if (key === "download-txt") onDownload("txt");
                  }}
                >
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
                      <Dropdown.Menu
                        onAction={(key) => {
                          if (key === "download-json") onDownload("json");
                          if (key === "download-txt") onDownload("txt");
                        }}
                      >
                        <Dropdown.Item id="download-json" textValue={`${title || "account"}.json`}>
                          <Label>{title || "account"}.json</Label>
                        </Dropdown.Item>
                        <Dropdown.Item id="download-txt" textValue={`${title || "account"}.txt`}>
                          <Label>{title || "account"}.txt</Label>
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
            <Dropdown.Item
              id="favorite"
              textValue={isFavorite ? "Remove from Favorites" : "Favorite"}
            >
              {isFavorite ? (
                <StarOff className="text-muted size-3.5" />
              ) : (
                <Star className="text-muted size-3.5" />
              )}
              <Label>{isFavorite ? "Remove from Favorites" : "Favorite"}</Label>
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
  );
}
