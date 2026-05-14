"use client";

import type { Key } from "@heroui/react";
import {
  Autocomplete,
  Button,
  Chip,
  ColorArea,
  ColorField,
  ColorPicker,
  ColorSlider,
  ColorSwatch,
  ColorSwatchPicker,
  EmptyState,
  InputGroup,
  Label,
  ListBox,
  Modal,
  parseColor,
  SearchField,
  TagGroup,
  Tag as TagItem,
  TextField,
  toast,
  useFilter,
} from "@heroui/react";
import { Circle, Plus, Tag } from "lucide-react";
import { useState } from "react";
import type { AccountTag } from "@/types";

interface TagsModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  accountTags: AccountTag[];
  onTagsChange: (tags: AccountTag[]) => void;
  title: string | null;
}

// Dummy available tags (matching sidebar data)
const PRESET_TAGS: AccountTag[] = [
  { id: "social", name: "Social", color: "#3b82f6" },
  { id: "email", name: "Email", color: "#a855f7" },
  { id: "finance", name: "Finance", color: "#22c55e" },
  { id: "work", name: "Work", color: "#f97316" },
];

const TAG_COLORS = [
  "#3b82f6",
  "#a855f7",
  "#22c55e",
  "#ef4444",
  "#ec4899",
  "#14b8a6",
  "#f59e0b",
  "#6366f1",
];

export default function TagsModal({
  isOpen,
  onOpenChange,
  accountTags,
  onTagsChange,
  title,
}: TagsModalProps) {
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState(parseColor(TAG_COLORS[0]));
  const [customTags, setCustomTags] = useState<AccountTag[]>([]);
  const { contains } = useFilter({ sensitivity: "base" });

  const allTags = [...PRESET_TAGS, ...customTags];
  const selectedKeys = accountTags.map((t) => t.id) as Key[];

  const handleSelectionChange = (keys: Key | Key[] | null) => {
    const keyArray = Array.isArray(keys) ? keys : keys ? [keys] : [];
    const newTags = keyArray
      .map((key) => allTags.find((t) => t.id === key) || accountTags.find((t) => t.id === key))
      .filter(Boolean) as AccountTag[];
    onTagsChange(newTags);
  };

  const handleRemoveTags = (keys: Set<Key>) => {
    onTagsChange(accountTags.filter((t) => !keys.has(t.id)));
  };

  const handleCreateTag = () => {
    const name = newTagName.trim();
    if (!name) return;

    const newTag: AccountTag = {
      id: `tag-${Date.now()}`,
      name,
      color: newTagColor.toString("hex"),
    };

    // Add to custom tags list and auto-select it
    setCustomTags((prev) => [...prev, newTag]);
    onTagsChange([...accountTags, newTag]);
    toast.success(`Tag "${name}" created and added`);
    setNewTagName("");
  };

  return (
    <Modal>
      <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
        <Modal.Container size="md">
          <Modal.Dialog className="p-0">
            <Modal.Header className="mr-10 flex flex-row items-center gap-2 p-4 pb-0">
              <div className="flex size-9 items-center justify-center rounded-xl">
                <Tag className="size-5" />
              </div>
              <div className="flex flex-1 flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Manage Tags</span>
                  {accountTags.length > 0 && (
                    <Chip size="sm" variant="soft">
                      {accountTags.length} tag{accountTags.length !== 1 ? "s" : ""}
                    </Chip>
                  )}
                </div>
                <span className="text-muted text-xs">{title}</span>
              </div>
              <Modal.CloseTrigger />
            </Modal.Header>

            <Modal.Body className="mt-0 flex flex-col gap-4 p-4">
              {/* Autocomplete tag selector */}
              <Autocomplete
                className="w-full"
                placeholder="Search or select tags..."
                selectionMode="multiple"
                variant="secondary"
                value={selectedKeys}
                onChange={(keys) => handleSelectionChange(keys as Key[])}
              >
                <Label>Tags</Label>
                <Autocomplete.Trigger>
                  <Autocomplete.Value>
                    {({ defaultChildren, isPlaceholder, state }) => {
                      if (isPlaceholder || state.selectedItems.length === 0) {
                        return defaultChildren;
                      }

                      const selectedItemKeys = state.selectedItems.map((item) => item.key);

                      return (
                        <TagGroup size="sm" onRemove={handleRemoveTags}>
                          <TagGroup.List>
                            {selectedItemKeys.map((key) => {
                              const tag =
                                allTags.find((t) => t.id === key) ||
                                accountTags.find((t) => t.id === key);

                              if (!tag) return null;

                              return (
                                <TagItem key={tag.id} id={tag.id}>
                                  <Circle
                                    className="size-2 shrink-0"
                                    fill={tag.color}
                                    stroke={tag.color}
                                  />
                                  {tag.name}
                                </TagItem>
                              );
                            })}
                          </TagGroup.List>
                        </TagGroup>
                      );
                    }}
                  </Autocomplete.Value>
                  <Autocomplete.ClearButton />
                  <Autocomplete.Indicator />
                </Autocomplete.Trigger>
                <Autocomplete.Popover>
                  <Autocomplete.Filter filter={contains}>
                    <SearchField autoFocus name="tag-search" variant="secondary">
                      <SearchField.Group>
                        <SearchField.SearchIcon />
                        <SearchField.Input placeholder="Search tags..." />
                        <SearchField.ClearButton />
                      </SearchField.Group>
                    </SearchField>
                    <ListBox renderEmptyState={() => <EmptyState>No tags found</EmptyState>}>
                      {allTags.map((tag) => (
                        <ListBox.Item key={tag.id} id={tag.id} textValue={tag.name}>
                          <Circle className="size-3 shrink-0" fill={tag.color} stroke={tag.color} />
                          {tag.name}
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Autocomplete.Filter>
                </Autocomplete.Popover>
              </Autocomplete>

              {/* Create new tag form */}
              <div className="flex flex-col gap-3">
                <span className="font-medium text-sm">Create New Tag</span>
                <TextField aria-label="Tag name" className="w-full" name="new-tag-name">
                  <InputGroup fullWidth variant="secondary">
                    <InputGroup.Suffix>
                      <ColorPicker value={newTagColor} onChange={setNewTagColor}>
                        <ColorPicker.Trigger>
                          <ColorSwatch size="sm" />
                        </ColorPicker.Trigger>
                        <ColorPicker.Popover className="max-w-62 gap-2">
                          <ColorSwatchPicker className="justify-center px-1" size="xs">
                            {TAG_COLORS.map((color) => (
                              <ColorSwatchPicker.Item key={color} color={color}>
                                <ColorSwatchPicker.Swatch />
                                <ColorSwatchPicker.Indicator />
                              </ColorSwatchPicker.Item>
                            ))}
                          </ColorSwatchPicker>
                          <ColorArea
                            aria-label="Color area"
                            className="max-w-full"
                            colorSpace="hsb"
                            xChannel="saturation"
                            yChannel="brightness"
                          >
                            <ColorArea.Thumb />
                          </ColorArea>
                          <ColorSlider channel="hue" className="gap-1 px-1" colorSpace="hsb">
                            <Label>Hue</Label>
                            <ColorSlider.Output className="text-muted" />
                            <ColorSlider.Track>
                              <ColorSlider.Thumb />
                            </ColorSlider.Track>
                          </ColorSlider>
                          <ColorField aria-label="Hex color" className="px-1">
                            <ColorField.Group variant="secondary">
                              <ColorField.Prefix>
                                <ColorSwatch size="xs" />
                              </ColorField.Prefix>
                              <ColorField.Input />
                            </ColorField.Group>
                          </ColorField>
                        </ColorPicker.Popover>
                      </ColorPicker>
                    </InputGroup.Suffix>
                    <InputGroup.Input
                      autoFocus
                      autoComplete="off"
                      name="new-tag-name-input"
                      placeholder="Tag name"
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleCreateTag();
                      }}
                    />
                    <InputGroup.Prefix>
                      <Button
                        size="sm"
                        variant="ghost"
                        onPress={handleCreateTag}
                        isDisabled={!newTagName.trim()}
                      >
                        <Plus />
                        Create
                      </Button>
                    </InputGroup.Prefix>
                  </InputGroup>
                </TextField>
              </div>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
