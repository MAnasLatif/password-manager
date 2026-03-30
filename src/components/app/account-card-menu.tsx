"use client";

import { Button, Dropdown, Header, Label, Separator } from "@heroui/react";
import {
  ClipboardList,
  CopyPlus,
  Download,
  Ellipsis,
  ExternalLink,
  FileCode2,
  FileJson,
  FileSpreadsheet,
  FileText,
  FileType,
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
  onExport: (format: string) => void;
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
  onExport,
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
            if (String(key).startsWith("export-")) onExport(String(key).replace("export-", ""));
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
                    if (String(key).startsWith("export-"))
                      onExport(String(key).replace("export-", ""));
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
                  <Dropdown.Item id="one-time-copy" textValue="One-Time Link">
                    <Timer className="text-muted size-3.5" />
                    <Label>One-Time Link</Label>
                  </Dropdown.Item>
                  <Dropdown.Item id="share" textValue="Share">
                    <Share2 className="text-muted size-3.5" />
                    <Label>Share</Label>
                  </Dropdown.Item>
                  <Dropdown.SubmenuTrigger>
                    <Dropdown.Item id="export" textValue="Export Account">
                      <Download className="text-muted size-3.5" />
                      <Label>Export Account</Label>
                      <Dropdown.SubmenuIndicator />
                    </Dropdown.Item>
                    <Dropdown.Popover>
                      <Dropdown.Menu
                        onAction={(key) => {
                          if (String(key).startsWith("export-"))
                            onExport(String(key).replace("export-", ""));
                        }}
                      >
                        <Dropdown.Item id="export-json" textValue="JSON">
                          <FileJson className="text-muted size-3.5" />
                          <Label>{title || "account"}.json</Label>
                        </Dropdown.Item>
                        <Dropdown.Item id="export-csv" textValue="CSV">
                          <FileSpreadsheet className="text-muted size-3.5" />
                          <Label>{title || "account"}.csv</Label>
                        </Dropdown.Item>
                        <Dropdown.Item id="export-txt" textValue="Plain Text">
                          <FileText className="text-muted size-3.5" />
                          <Label>{title || "account"}.txt</Label>
                        </Dropdown.Item>
                        <Dropdown.Item id="export-md" textValue="Markdown">
                          <FileType className="text-muted size-3.5" />
                          <Label>{title || "account"}.md</Label>
                        </Dropdown.Item>
                        <Dropdown.Item id="export-xml" textValue="XML">
                          <FileCode2 className="text-muted size-3.5" />
                          <Label>{title || "account"}.xml</Label>
                        </Dropdown.Item>
                        <Dropdown.Item id="export-yaml" textValue="YAML">
                          <FileCode2 className="text-muted size-3.5" />
                          <Label>{title || "account"}.yaml</Label>
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
