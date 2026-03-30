"use client";

import type { Account, Platform } from "@/types";
import type { ExportFormat, ExportOptions, PasswordRevealPolicy } from "@/utils/account";
import { buildExportContent, downloadAccountFile, getAccountTitle } from "@/utils/account";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Chip,
  Description,
  Label,
  Modal,
  Radio,
  RadioGroup,
  Separator,
  toast,
} from "@heroui/react";
import { Download, Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";
import { useState } from "react";

interface ExportModalProps {
  account: Account;
  platform: Platform;
  format: ExportFormat;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  resolvePassword: () => Promise<string | null>;
}

const FORMAT_OPTIONS: {
  id: ExportFormat;
  label: string;
  ext: string;
}[] = [
  { id: "json", label: "JSON", ext: ".json" },
  { id: "csv", label: "CSV", ext: ".csv" },
  { id: "txt", label: "Plain Text", ext: ".txt" },
  { id: "md", label: "Markdown", ext: ".md" },
  { id: "xml", label: "XML", ext: ".xml" },
  { id: "yaml", label: "YAML", ext: ".yaml" },
];

const PASSWORD_POLICIES: {
  id: PasswordRevealPolicy;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "include",
    label: "Include password",
    description: "Password will be visible in plain text",
    icon: <Eye className="text-warning size-3.5" />,
  },
  {
    id: "mask",
    label: "Mask password",
    description: "Password shown as ••••••••",
    icon: <EyeOff className="text-muted size-3.5" />,
  },
  {
    id: "exclude",
    label: "Exclude password",
    description: "Password field will not be exported",
    icon: <Lock className="text-success size-3.5" />,
  },
];

export default function ExportModal({
  account,
  platform,
  format,
  isOpen,
  onOpenChange,
  resolvePassword,
}: ExportModalProps) {
  const [selectedFields, setSelectedFields] = useState<string[]>([
    "url",
    "email",
    "username",
    "password",
    "notes",
  ]);
  const [passwordPolicy, setPasswordPolicy] = useState<PasswordRevealPolicy>("mask");
  const [isExporting, setIsExporting] = useState(false);

  const title = getAccountTitle(account) || "account";

  const handleExport = async () => {
    setIsExporting(true);
    try {
      let pw: string | null = null;
      if (selectedFields.includes("password") && passwordPolicy !== "exclude") {
        pw = await resolvePassword();
      }

      const options: ExportOptions = {
        fields: {
          url: selectedFields.includes("url"),
          email: selectedFields.includes("email"),
          username: selectedFields.includes("username"),
          password: selectedFields.includes("password"),
          notes: selectedFields.includes("notes"),
          customFields: selectedFields.includes("customFields"),
          tags: selectedFields.includes("tags"),
        },
        format,
        passwordPolicy,
      };

      const content = buildExportContent(account, platform, pw, options);
      const ext = FORMAT_OPTIONS.find((f) => f.id === format)?.ext || `.${format}`;
      downloadAccountFile(content, `${title}${ext}`, format);
      toast.success(`Exported as ${title}${ext}`);
      onOpenChange(false);
    } catch (error) {
      console.error("Export failed", error);
      toast.danger("Export failed");
    } finally {
      setIsExporting(false);
    }
  };

  const availableFields = [
    { id: "url", label: "URL / Website" },
    { id: "email", label: "Email" },
    { id: "username", label: "Username" },
    { id: "password", label: "Password" },
    { id: "notes", label: "Notes" },
    ...(account.customFields && account.customFields.length > 0
      ? [{ id: "customFields", label: "Custom Fields" }]
      : []),
    ...(account.tags && account.tags.length > 0 ? [{ id: "tags", label: "Tags" }] : []),
  ];

  const selectedFormat = FORMAT_OPTIONS.find((f) => f.id === format)!;

  return (
    <Modal>
      <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
        <Modal.Container size="md">
          <Modal.Dialog className="p-0">
            <Modal.Header className="mr-10 flex flex-row items-center gap-2 p-4 pb-0">
              <div className="flex size-9 items-center justify-center rounded-xl">
                <Download className="size-5" />
              </div>
              <div className="flex flex-1 flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Export Account</span>
                  <Chip size="sm" variant="soft">
                    {selectedFormat.label}
                  </Chip>
                </div>
                <span className="text-muted text-xs">{title}</span>
              </div>
              <Modal.CloseTrigger />
            </Modal.Header>

            <Modal.Body className="mt-0 flex flex-col gap-4 p-4">
              {/* Fields selection */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted text-xs font-medium">Include Fields</span>
                  <button
                    type="button"
                    className="text-primary cursor-pointer text-xs font-medium"
                    onClick={() => {
                      if (selectedFields.length === availableFields.length) {
                        setSelectedFields([]);
                      } else {
                        setSelectedFields(availableFields.map((f) => f.id));
                      }
                    }}
                  >
                    {selectedFields.length === availableFields.length
                      ? "Deselect all"
                      : "Select all"}
                  </button>
                </div>
                <CheckboxGroup
                  value={selectedFields}
                  onChange={(val) => setSelectedFields(val as string[])}
                  aria-label="Fields to export"
                >
                  <div className="grid grid-cols-2 gap-2">
                    {availableFields.map((field) => (
                      <Checkbox
                        key={field.id}
                        value={field.id}
                        variant="secondary"
                        className="group bg-surface data-[selected=true]:bg-accent/10 relative rounded-2xl px-4 py-3 transition-all"
                      >
                        <Checkbox.Control className="absolute top-2.5 right-3 size-4 rounded-full before:rounded-full">
                          <Checkbox.Indicator />
                        </Checkbox.Control>
                        <Checkbox.Content>
                          <Label>{field.label}</Label>
                        </Checkbox.Content>
                      </Checkbox>
                    ))}
                  </div>
                </CheckboxGroup>
              </div>

              {/* Password reveal policy */}
              {selectedFields.includes("password") && account.hasPassword && (
                <>
                  <Separator />
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="text-muted size-3.5" />
                      <span className="text-muted text-xs font-medium">Password Reveal Policy</span>
                    </div>
                    <RadioGroup
                      value={passwordPolicy}
                      onChange={(val) => setPasswordPolicy(val as PasswordRevealPolicy)}
                      aria-label="Password reveal policy"
                    >
                      <div className="flex flex-col gap-2">
                        {PASSWORD_POLICIES.map((policy) => (
                          <Radio
                            key={policy.id}
                            value={policy.id}
                            className="group bg-surface data-[selected=true]:bg-accent/10 relative rounded-2xl px-4 py-3 transition-all"
                          >
                            <Radio.Control className="absolute top-3 right-3 size-4 rounded-full before:rounded-full">
                              <Radio.Indicator />
                            </Radio.Control>
                            <Radio.Content className="flex flex-row items-start gap-3">
                              {policy.icon}
                              <div className="flex flex-col gap-0.5">
                                <Label>{policy.label}</Label>
                                <Description>{policy.description}</Description>
                              </div>
                            </Radio.Content>
                          </Radio>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                </>
              )}
            </Modal.Body>

            <Modal.Footer className="flex items-center justify-between gap-3 p-4 pt-0">
              <span className="text-muted text-xs">
                {selectedFields.length} field{selectedFields.length !== 1 ? "s" : ""} selected
              </span>
              <div className="flex items-center gap-2">
                <Button variant="secondary" onPress={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onPress={handleExport}
                  isDisabled={selectedFields.length === 0 || isExporting}
                >
                  <Download className="size-3.5" />
                  {isExporting ? "Exporting..." : `Export as ${selectedFormat.label}`}
                </Button>
              </div>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
