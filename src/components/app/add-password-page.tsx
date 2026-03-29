"use client";

import {
  Alert,
  Button,
  Calendar,
  DateField,
  DatePicker,
  DateRangePicker,
  Dropdown,
  InputGroup,
  InputOTP,
  Label,
  ListBox,
  NumberField,
  RangeCalendar,
  REGEXP_ONLY_DIGITS,
  Select,
  Spinner,
  TextField,
  TimeField,
} from "@heroui/react";
import type { TimeValue } from "react-aria-components";
import { parseDate, parseDateTime } from "@internationalized/date";
import {
  AlignLeft,
  ArrowLeft,
  CalendarDays,
  CalendarRange,
  ChevronDown,
  Clock,
  CreditCard,
  Dices,
  Eye,
  EyeOff,
  Globe,
  Hash,
  HelpCircle,
  KeyRound,
  Link2,
  Mail,
  MapPin,
  NotebookPen,
  Phone,
  Plus,
  ShieldEllipsis,
  Tag,
  Trash2,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";

import useAppState from "@/contexts/app-state";
import { fetchPlatformName, getFaviconUrl } from "@/utils";

type FieldType =
  | "text"
  | "secret"
  | "password"
  | "email"
  | "url"
  | "number"
  | "date"
  | "datetime"
  | "date-range"
  | "phone"
  | "textarea"
  | "pin"
  | "security-question"
  | "address"
  | "credit-card";

const SECRET_TYPES: FieldType[] = ["secret"];

interface CustomField {
  id: string;
  type: FieldType;
  label: string;
  value: string;
  showSecret?: boolean;
  strength?: PasswordStrength;
  pinLength?: number;
  cardNumber?: string;
  cardName?: string;
  cardPin?: string;
  cardExp?: string;
  showCardPin?: boolean;
}

const FIELD_TYPES: { id: FieldType; label: string; group: string }[] = [
  // Common
  { id: "text", label: "Text", group: "Common" },
  { id: "textarea", label: "Textarea", group: "Common" },
  { id: "email", label: "Email", group: "Common" },
  { id: "url", label: "URL", group: "Common" },
  { id: "phone", label: "Phone", group: "Common" },
  { id: "number", label: "Number", group: "Common" },
  { id: "date", label: "Date", group: "Common" },
  { id: "datetime", label: "Date & Time", group: "Common" },
  { id: "date-range", label: "Date Range", group: "Common" },
  { id: "address", label: "Address", group: "Common" },
  // Secrets
  { id: "secret", label: "Secret", group: "Secrets" },
  { id: "password", label: "Password", group: "Secrets" },
  { id: "pin", label: "PIN", group: "Secrets" },
  { id: "security-question", label: "Security Q&A", group: "Secrets" },
  // Identity
  { id: "credit-card", label: "Credit Card", group: "Identity" },
];

type PasswordStrength = "normal" | "strong" | "very-strong";

const PASSWORD_CONFIG: Record<
  PasswordStrength,
  { length: number; upper: boolean; lower: boolean; numbers: boolean; symbols: boolean }
> = {
  normal: { length: 12, upper: true, lower: true, numbers: true, symbols: false },
  strong: { length: 16, upper: true, lower: true, numbers: true, symbols: true },
  "very-strong": { length: 24, upper: true, lower: true, numbers: true, symbols: true },
};

const PASSWORD_STRENGTH_LABELS: Record<PasswordStrength, string> = {
  normal: "Normal",
  strong: "Strong",
  "very-strong": "Very Strong",
};

function generatePassword(strength: PasswordStrength): string {
  const config = PASSWORD_CONFIG[strength];
  let chars = "";
  if (config.lower) chars += "abcdefghijklmnopqrstuvwxyz";
  if (config.upper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (config.numbers) chars += "0123456789";
  if (config.symbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";

  let result = "";
  const array = new Uint32Array(config.length);
  crypto.getRandomValues(array);
  for (let i = 0; i < config.length; i++) {
    result += chars[array[i] % chars.length];
  }
  return result;
}

function getFieldInputType(type: FieldType): string {
  if (type === "phone") return "tel";
  if (type === "credit-card") return "text";
  return type;
}

function getFieldPlaceholder(type: FieldType): string {
  switch (type) {
    case "text":
      return "Text value";
    case "textarea":
      return "Enter text...";
    case "email":
      return "you@example.com";
    case "url":
      return "https://example.com";
    case "phone":
      return "+1 234 567 8900";
    case "number":
      return "0";
    case "date":
      return "YYYY-MM-DD";
    case "address":
      return "123 Main St, City, Country";
    case "secret":
      return "Secret value";
    case "password":
      return "Password";
    case "pin":
      return "0000";
    case "security-question":
      return "Answer";
    case "credit-card":
      return "4242 4242 4242 4242";
    default:
      return "Value";
  }
}

function getFieldIcon(type: FieldType): React.ReactNode {
  switch (type) {
    case "text":
      return <AlignLeft className="text-muted size-4" />;
    case "email":
      return <Mail className="text-muted size-4" />;
    case "url":
      return <Link2 className="text-muted size-4" />;
    case "phone":
      return <Phone className="text-muted size-4" />;
    case "number":
      return <Hash className="text-muted size-4" />;
    case "textarea":
      return <AlignLeft className="text-muted size-4" />;
    case "address":
      return <MapPin className="text-muted size-4" />;
    case "secret":
      return <ShieldEllipsis className="text-muted size-4" />;
    case "password":
      return <KeyRound className="text-muted size-4" />;
    case "security-question":
      return <HelpCircle className="text-muted size-4" />;
    case "credit-card":
      return <CreditCard className="text-muted size-4" />;
    default:
      return null;
  }
}

function derivePlatformName(domain: string): string {
  if (!domain) return "";
  const host = domain.replace(/^www\./, "").split(".")[0];
  return host.charAt(0).toUpperCase() + host.slice(1);
}

export default function AddPasswordPage() {
  const searchParams = useSearchParams();
  const initialPlatform = searchParams.get("platform") ?? "";

  const { setSearchPlaceholder, setAddButton } = useAppState();

  const [isPending, startTransition] = useTransition();
  const [websiteName, setWebsiteName] = useState(derivePlatformName(initialPlatform));
  const [websiteUrl, setWebsiteUrl] = useState(initialPlatform);

  // When platform is passed as a URL param, fetch the real name (e.g. "GitHub" not "Github")
  useEffect(() => {
    if (!initialPlatform) return;
    fetchPlatformName(initialPlatform).then((name) => {
      if (name) setWebsiteName(name);
    });
  }, [initialPlatform]);
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notes, setNotes] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>("strong");
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    setSearchPlaceholder("Search accounts");
    setAddButton((current) => {
      if (current.tooltip === "Add new" && current.on === "/new") return current;
      return { tooltip: "Add new", on: "/new" };
    });
  }, [setSearchPlaceholder, setAddButton]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 30000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const isFormValid = email.trim().length > 0 || username.trim().length > 0;

  const handleGeneratePassword = useCallback(() => {
    const generated = generatePassword(passwordStrength);
    setPassword(generated);
    setShowPassword(true);
  }, [passwordStrength]);

  const handlePasswordStrengthChange = (keys: "all" | Set<React.Key>) => {
    if (keys === "all") return;

    const [selectedKey] = keys;
    if (!selectedKey) return;

    setPasswordStrength(selectedKey as PasswordStrength);
  };

  const handleAddField = () => {
    setCustomFields((prev) => [
      ...prev,
      { id: crypto.randomUUID(), type: "text", label: "", value: "" },
    ]);
  };

  const handleRemoveField = (id: string) => {
    setCustomFields((prev) => prev.filter((f) => f.id !== id));
  };

  const handleUpdateField = (id: string, updates: Partial<CustomField>) => {
    setCustomFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      // TODO: Replace with actual server action
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // eslint-disable-next-line no-console
      console.log("Submitted:", {
        websiteName,
        websiteUrl,
        title,
        email,
        username,
        password,
        notes,
        customFields,
      });
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button isIconOnly variant="ghost" size="sm" aria-label="Go back">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <h1 className="text-lg font-semibold">Add Password</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          {/* Error Alert */}
          {error && (
            <Alert status="danger" className="border-border w-full rounded-2xl border shadow-none">
              <Alert.Indicator />
              <Alert.Content className="gap-1">
                <Alert.Title>{error}</Alert.Title>
              </Alert.Content>
            </Alert>
          )}

          {/* Website Name + URL — same line */}
          <div className="flex gap-3">
            <div className="flex-1">
              <TextField
                type="text"
                value={websiteName}
                onChange={setWebsiteName}
                isDisabled={isPending}
                autoFocus={!initialPlatform}
              >
                <Label>Website Name</Label>
                <InputGroup>
                  <InputGroup.Prefix>
                    <Globe className="text-muted size-4" />
                  </InputGroup.Prefix>
                  <InputGroup.Input placeholder="Google" />
                </InputGroup>
              </TextField>
            </div>
            <div className="flex-1">
              <TextField
                type="text"
                value={websiteUrl}
                onChange={setWebsiteUrl}
                isDisabled={isPending}
                autoFocus={!!initialPlatform}
              >
                <Label>Website URL</Label>
                <InputGroup>
                  <InputGroup.Prefix>
                    {websiteUrl.trim() ? (
                      <Image
                        src={getFaviconUrl(websiteUrl.trim())}
                        alt=""
                        width={16}
                        height={16}
                        className="size-4"
                        unoptimized
                      />
                    ) : (
                      <Globe className="text-muted size-4" />
                    )}
                  </InputGroup.Prefix>
                  <InputGroup.Input placeholder="google.com" />
                </InputGroup>
              </TextField>
            </div>
          </div>

          {/* Title */}
          <TextField type="text" value={title} onChange={setTitle} isDisabled={isPending}>
            <Label>Title</Label>
            <InputGroup>
              <InputGroup.Prefix>
                <Tag className="text-muted size-4" />
              </InputGroup.Prefix>
              <InputGroup.Input placeholder="Personal account" />
            </InputGroup>
          </TextField>

          {/* Email + Username — same line */}
          <div className="flex gap-3">
            <div className="flex-1">
              <TextField type="email" value={email} onChange={setEmail} isDisabled={isPending}>
                <Label>Email</Label>
                <InputGroup>
                  <InputGroup.Prefix>
                    <Mail className="text-muted size-4" />
                  </InputGroup.Prefix>
                  <InputGroup.Input placeholder="username@domain.com" />
                </InputGroup>
              </TextField>
            </div>
            <div className="flex-1">
              <TextField type="text" value={username} onChange={setUsername} isDisabled={isPending}>
                <Label>Username</Label>
                <InputGroup>
                  <InputGroup.Prefix>
                    <User className="text-muted size-4" />
                  </InputGroup.Prefix>
                  <InputGroup.Input placeholder="manas" />
                </InputGroup>
              </TextField>
            </div>
          </div>

          {/* Password with generate */}
          <div className="flex flex-col gap-1">
            <Label>Password</Label>
            <div className="flex gap-2">
              <InputGroup className="flex-1">
                <InputGroup.Prefix>
                  <KeyRound className="text-muted size-4" />
                </InputGroup.Prefix>
                <InputGroup.Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isPending}
                />
                <InputGroup.Suffix>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      isIconOnly
                      onClick={() => setShowPassword(!showPassword)}
                      isDisabled={isPending}
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onPress={handleGeneratePassword}
                      isDisabled={isPending}
                      aria-label="Generate password"
                    >
                      <Dices />
                      {PASSWORD_STRENGTH_LABELS[passwordStrength]}
                    </Button>
                    <Dropdown>
                      <Button
                        variant="ghost"
                        size="sm"
                        isIconOnly
                        aria-label="Password strength"
                        isDisabled={isPending}
                        className="px-5"
                      >
                        <ChevronDown />
                      </Button>
                      <Dropdown.Popover>
                        <Dropdown.Menu
                          aria-label="Password strength options"
                          selectionMode="single"
                          selectedKeys={[passwordStrength]}
                          onSelectionChange={handlePasswordStrengthChange}
                        >
                          <Dropdown.Item id="normal" textValue="Normal">
                            Normal
                            <Dropdown.ItemIndicator />
                          </Dropdown.Item>
                          <Dropdown.Item id="strong" textValue="Strong">
                            Strong
                            <Dropdown.ItemIndicator />
                          </Dropdown.Item>
                          <Dropdown.Item id="very-strong" textValue="Very Strong">
                            Very Strong
                            <Dropdown.ItemIndicator />
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown.Popover>
                    </Dropdown>
                  </div>
                </InputGroup.Suffix>
              </InputGroup>
            </div>
          </div>

          {/* Notes */}
          <TextField value={notes} onChange={setNotes} isDisabled={isPending}>
            <Label>Notes</Label>
            <InputGroup>
              <InputGroup.Prefix>
                <NotebookPen className="text-muted size-4" />
              </InputGroup.Prefix>
              <InputGroup.TextArea placeholder="Add any notes..." rows={3} />
            </InputGroup>
          </TextField>

          {/* Custom Fields */}
          {customFields.map((field) => (
            <div key={field.id} className="border-border flex flex-col gap-2 rounded-xl border p-3">
              <InputGroup>
                <InputGroup.Prefix>
                  <Select
                    selectedKey={field.type}
                    onSelectionChange={(key) =>
                      handleUpdateField(field.id, { type: key as FieldType, value: "" })
                    }
                    aria-label="Field type"
                  >
                    <Select.Trigger className="border-none bg-transparent shadow-none">
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover
                      UNSTABLE_portalContainer={
                        typeof document !== "undefined" ? document.body : undefined
                      }
                    >
                      <ListBox>
                        {FIELD_TYPES.map((ft) => (
                          <ListBox.Item key={ft.id} id={ft.id} textValue={ft.label}>
                            {ft.label}
                            <ListBox.ItemIndicator />
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>
                </InputGroup.Prefix>
                <InputGroup.Input
                  placeholder="Label"
                  value={field.label}
                  onChange={(e) => handleUpdateField(field.id, { label: e.target.value })}
                  disabled={isPending}
                />
                <InputGroup.Suffix>
                  <div className="flex items-center gap-1">
                    {field.type === "pin" && (
                      <NumberField
                        value={field.pinLength ?? 4}
                        minValue={4}
                        maxValue={12}
                        onChange={(val) => {
                          const len = isNaN(val) ? 4 : val;
                          handleUpdateField(field.id, { pinLength: len, value: "" });
                        }}
                        isDisabled={isPending}
                        aria-label="PIN length"
                      >
                        <NumberField.Group className="shadow-none">
                          <NumberField.DecrementButton />
                          <NumberField.Input className="w-12 text-center" />
                          <NumberField.IncrementButton />
                        </NumberField.Group>
                      </NumberField>
                    )}
                    <Button
                      type="button"
                      isIconOnly
                      variant="ghost"
                      size="sm"
                      onPress={() => handleRemoveField(field.id)}
                      isDisabled={isPending}
                      aria-label="Remove field"
                    >
                      <Trash2 className="text-danger size-4" />
                    </Button>
                  </div>
                </InputGroup.Suffix>
              </InputGroup>

              {/* Field value */}
              {field.type === "date" ? (
                <DatePicker
                  value={field.value ? parseDate(field.value) : null}
                  onChange={(val) =>
                    handleUpdateField(field.id, { value: val ? val.toString() : "" })
                  }
                  isDisabled={isPending}
                >
                  <DateField.Group fullWidth>
                    <DateField.Prefix>
                      <CalendarDays className="text-muted size-4" />
                    </DateField.Prefix>
                    <DateField.Input>
                      {(segment) => <DateField.Segment segment={segment} />}
                    </DateField.Input>
                    <DateField.Suffix>
                      <DatePicker.Trigger>
                        <DatePicker.TriggerIndicator>
                          <ChevronDown />
                        </DatePicker.TriggerIndicator>
                      </DatePicker.Trigger>
                    </DateField.Suffix>
                    <DatePicker.Popover>
                      <Calendar aria-label="Pick a date">
                        <Calendar.Header>
                          <Calendar.YearPickerTrigger>
                            <Calendar.YearPickerTriggerHeading />
                            <Calendar.YearPickerTriggerIndicator />
                          </Calendar.YearPickerTrigger>
                          <Calendar.NavButton slot="previous" />
                          <Calendar.NavButton slot="next" />
                        </Calendar.Header>
                        <Calendar.Grid>
                          <Calendar.GridHeader>
                            {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
                          </Calendar.GridHeader>
                          <Calendar.GridBody>
                            {(date) => <Calendar.Cell date={date} />}
                          </Calendar.GridBody>
                        </Calendar.Grid>
                        <Calendar.YearPickerGrid>
                          <Calendar.YearPickerGridBody>
                            {({ year }) => <Calendar.YearPickerCell year={year} />}
                          </Calendar.YearPickerGridBody>
                        </Calendar.YearPickerGrid>
                      </Calendar>
                    </DatePicker.Popover>
                  </DateField.Group>
                </DatePicker>
              ) : field.type === "datetime" ? (
                <DatePicker
                  granularity="minute"
                  hideTimeZone
                  value={
                    field.value
                      ? (() => {
                          try {
                            return parseDateTime(field.value);
                          } catch {
                            return null;
                          }
                        })()
                      : null
                  }
                  onChange={(val) =>
                    handleUpdateField(field.id, { value: val ? val.toString() : "" })
                  }
                  isDisabled={isPending}
                >
                  {({ state }) => (
                    <>
                      <DateField.Group fullWidth>
                        <DateField.Prefix>
                          <Clock className="text-muted size-4" />
                        </DateField.Prefix>
                        <DateField.Input>
                          {(segment) => <DateField.Segment segment={segment} />}
                        </DateField.Input>
                        <DateField.Suffix>
                          <DatePicker.Trigger>
                            <DatePicker.TriggerIndicator>
                              <ChevronDown />
                            </DatePicker.TriggerIndicator>
                          </DatePicker.Trigger>
                        </DateField.Suffix>
                      </DateField.Group>
                      <DatePicker.Popover className="flex flex-col gap-3">
                        <Calendar aria-label="Pick a date and time">
                          <Calendar.Header>
                            <Calendar.YearPickerTrigger>
                              <Calendar.YearPickerTriggerHeading />
                              <Calendar.YearPickerTriggerIndicator />
                            </Calendar.YearPickerTrigger>
                            <Calendar.NavButton slot="previous" />
                            <Calendar.NavButton slot="next" />
                          </Calendar.Header>
                          <Calendar.Grid>
                            <Calendar.GridHeader>
                              {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
                            </Calendar.GridHeader>
                            <Calendar.GridBody>
                              {(date) => <Calendar.Cell date={date} />}
                            </Calendar.GridBody>
                          </Calendar.Grid>
                          <Calendar.YearPickerGrid>
                            <Calendar.YearPickerGridBody>
                              {({ year }) => <Calendar.YearPickerCell year={year} />}
                            </Calendar.YearPickerGridBody>
                          </Calendar.YearPickerGrid>
                        </Calendar>
                        <div className="flex items-center justify-between gap-4">
                          <Label>Time</Label>
                          <TimeField
                            aria-label="Time"
                            granularity="minute"
                            hideTimeZone
                            value={state.timeValue}
                            onChange={(v) => state.setTimeValue(v as TimeValue)}
                          >
                            <TimeField.Group variant="secondary">
                              <TimeField.Input>
                                {(segment) => <TimeField.Segment segment={segment} />}
                              </TimeField.Input>
                            </TimeField.Group>
                          </TimeField>
                        </div>
                      </DatePicker.Popover>
                    </>
                  )}
                </DatePicker>
              ) : field.type === "date-range" ? (
                <DateRangePicker
                  value={(() => {
                    if (!field.value) return null;
                    try {
                      const { start, end } = JSON.parse(field.value);
                      return { start: parseDate(start), end: parseDate(end) };
                    } catch {
                      return null;
                    }
                  })()}
                  onChange={(range) =>
                    handleUpdateField(field.id, {
                      value: range
                        ? JSON.stringify({
                            start: range.start.toString(),
                            end: range.end.toString(),
                          })
                        : "",
                    })
                  }
                  isDisabled={isPending}
                >
                  <DateField.Group fullWidth>
                    <DateField.Prefix>
                      <CalendarRange className="text-muted size-4" />
                    </DateField.Prefix>
                    <DateField.Input slot="start">
                      {(segment) => <DateField.Segment segment={segment} />}
                    </DateField.Input>
                    <DateRangePicker.RangeSeparator />
                    <DateField.Input slot="end">
                      {(segment) => <DateField.Segment segment={segment} />}
                    </DateField.Input>
                    <DateField.Suffix>
                      <DateRangePicker.Trigger>
                        <DatePicker.TriggerIndicator>
                          <ChevronDown />
                        </DatePicker.TriggerIndicator>
                      </DateRangePicker.Trigger>
                    </DateField.Suffix>
                  </DateField.Group>
                  <DateRangePicker.Popover>
                    <RangeCalendar aria-label="Pick a date range">
                      <RangeCalendar.Header>
                        <RangeCalendar.YearPickerTrigger>
                          <RangeCalendar.YearPickerTriggerHeading />
                          <RangeCalendar.YearPickerTriggerIndicator />
                        </RangeCalendar.YearPickerTrigger>
                        <RangeCalendar.NavButton slot="previous" />
                        <RangeCalendar.NavButton slot="next" />
                      </RangeCalendar.Header>
                      <RangeCalendar.Grid>
                        <RangeCalendar.GridHeader>
                          {(day) => <RangeCalendar.HeaderCell>{day}</RangeCalendar.HeaderCell>}
                        </RangeCalendar.GridHeader>
                        <RangeCalendar.GridBody>
                          {(date) => <RangeCalendar.Cell date={date} />}
                        </RangeCalendar.GridBody>
                      </RangeCalendar.Grid>
                      <RangeCalendar.YearPickerGrid>
                        <RangeCalendar.YearPickerGridBody>
                          {({ year }) => <RangeCalendar.YearPickerCell year={year} />}
                        </RangeCalendar.YearPickerGridBody>
                      </RangeCalendar.YearPickerGrid>
                    </RangeCalendar>
                  </DateRangePicker.Popover>
                </DateRangePicker>
              ) : field.type === "number" ? (
                <InputGroup>
                  <InputGroup.Prefix>
                    <Hash className="text-muted size-4" />
                  </InputGroup.Prefix>
                  <NumberField
                    className="w-full"
                    value={field.value !== "" ? Number(field.value) : undefined}
                    onChange={(val) =>
                      handleUpdateField(field.id, { value: isNaN(val) ? "" : String(val) })
                    }
                    isDisabled={isPending}
                  >
                    <NumberField.Group className="border-none shadow-none">
                      <NumberField.DecrementButton />
                      <NumberField.Input placeholder="0" className="border-none shadow-none" />
                      <NumberField.IncrementButton />
                    </NumberField.Group>
                  </NumberField>
                </InputGroup>
              ) : field.type === "textarea" || field.type === "address" ? (
                <TextField
                  value={field.value}
                  onChange={(value) => handleUpdateField(field.id, { value })}
                  isDisabled={isPending}
                >
                  <InputGroup>
                    <InputGroup.Prefix>{getFieldIcon(field.type)}</InputGroup.Prefix>
                    <InputGroup.TextArea placeholder={getFieldPlaceholder(field.type)} rows={3} />
                  </InputGroup>
                </TextField>
              ) : field.type === "security-question" ? (
                <div className="flex flex-col gap-2">
                  <TextField
                    type="text"
                    value={field.label}
                    onChange={(value) => handleUpdateField(field.id, { label: value })}
                    isDisabled={isPending}
                  >
                    <InputGroup>
                      <InputGroup.Prefix>
                        <HelpCircle className="text-muted size-4" />
                      </InputGroup.Prefix>
                      <InputGroup.Input placeholder="Question" />
                    </InputGroup>
                  </TextField>
                  <InputGroup>
                    <InputGroup.Prefix>
                      <ShieldEllipsis className="text-muted size-4" />
                    </InputGroup.Prefix>
                    <InputGroup.Input
                      type={field.showSecret ? "text" : "password"}
                      placeholder="Answer"
                      value={field.value}
                      onChange={(e) => handleUpdateField(field.id, { value: e.target.value })}
                      disabled={isPending}
                    />
                    <InputGroup.Suffix>
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateField(field.id, { showSecret: !field.showSecret })
                        }
                        className="text-muted hover:text-foreground transition-colors focus:outline-none"
                        disabled={isPending}
                        tabIndex={-1}
                      >
                        {field.showSecret ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </InputGroup.Suffix>
                  </InputGroup>
                </div>
              ) : field.type === "credit-card" ? (
                <div className="flex flex-col gap-2">
                  <InputGroup>
                    <InputGroup.Prefix>
                      <CreditCard className="text-muted size-4" />
                    </InputGroup.Prefix>
                    <InputGroup.Input
                      placeholder="4242 4242 4242 4242"
                      value={field.cardNumber ?? ""}
                      onChange={(e) => handleUpdateField(field.id, { cardNumber: e.target.value })}
                      disabled={isPending}
                      maxLength={19}
                    />
                    <InputGroup.Suffix>
                      <span className="text-muted text-xs">Card Number</span>
                    </InputGroup.Suffix>
                  </InputGroup>
                  <InputGroup>
                    <InputGroup.Prefix>
                      <User className="text-muted size-4" />
                    </InputGroup.Prefix>
                    <InputGroup.Input
                      placeholder="Cardholder Name"
                      value={field.cardName ?? ""}
                      onChange={(e) => handleUpdateField(field.id, { cardName: e.target.value })}
                      disabled={isPending}
                    />
                    <InputGroup.Suffix>
                      <span className="text-muted text-xs">Name</span>
                    </InputGroup.Suffix>
                  </InputGroup>
                  <div className="flex gap-2">
                    <InputGroup className="flex-1">
                      <InputGroup.Input
                        type={field.showCardPin ? "text" : "password"}
                        placeholder="PIN"
                        value={field.cardPin ?? ""}
                        onChange={(e) => handleUpdateField(field.id, { cardPin: e.target.value })}
                        disabled={isPending}
                      />
                      <InputGroup.Suffix>
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateField(field.id, { showCardPin: !field.showCardPin })
                          }
                          className="text-muted hover:text-foreground transition-colors focus:outline-none"
                          disabled={isPending}
                          tabIndex={-1}
                        >
                          {field.showCardPin ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                        </button>
                      </InputGroup.Suffix>
                    </InputGroup>
                    <InputGroup className="flex-1">
                      <InputGroup.Prefix>
                        <CalendarDays className="text-muted size-4" />
                      </InputGroup.Prefix>
                      <InputGroup.Input
                        placeholder="MM/YY"
                        value={field.cardExp ?? ""}
                        onChange={(e) => {
                          let val = e.target.value.replace(/[^0-9/]/g, "");
                          if (
                            val.length === 2 &&
                            !val.includes("/") &&
                            (field.cardExp?.length ?? 0) < 2
                          )
                            val = val + "/";
                          handleUpdateField(field.id, { cardExp: val });
                        }}
                        disabled={isPending}
                        maxLength={5}
                      />
                    </InputGroup>
                  </div>
                </div>
              ) : field.type === "pin" ? (
                <InputOTP
                  maxLength={field.pinLength ?? 4}
                  value={field.value}
                  onChange={(val) => handleUpdateField(field.id, { value: val })}
                  isDisabled={isPending}
                  pattern={REGEXP_ONLY_DIGITS}
                >
                  <InputOTP.Group>
                    {Array.from({ length: field.pinLength ?? 4 }, (_, i) => (
                      <InputOTP.Slot key={i} index={i} />
                    ))}
                  </InputOTP.Group>
                </InputOTP>
              ) : field.type === "password" ? (
                <InputGroup>
                  <InputGroup.Prefix>
                    <KeyRound className="text-muted size-4" />
                  </InputGroup.Prefix>
                  <InputGroup.Input
                    type={field.showSecret ? "text" : "password"}
                    placeholder="Password"
                    value={field.value}
                    onChange={(e) => handleUpdateField(field.id, { value: e.target.value })}
                    disabled={isPending}
                  />
                  <InputGroup.Suffix>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        isIconOnly
                        onPress={() =>
                          handleUpdateField(field.id, { showSecret: !field.showSecret })
                        }
                        isDisabled={isPending}
                      >
                        {field.showSecret ? <EyeOff /> : <Eye />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onPress={() =>
                          handleUpdateField(field.id, {
                            value: generatePassword(field.strength ?? "strong"),
                            showSecret: true,
                          })
                        }
                        isDisabled={isPending}
                        aria-label="Generate password"
                      >
                        <Dices />
                        {PASSWORD_STRENGTH_LABELS[field.strength ?? "strong"]}
                      </Button>
                      <Dropdown>
                        <Button
                          variant="ghost"
                          size="sm"
                          isIconOnly
                          aria-label="Password strength"
                          isDisabled={isPending}
                        >
                          <ChevronDown />
                        </Button>
                        <Dropdown.Popover>
                          <Dropdown.Menu
                            aria-label="Password strength options"
                            selectionMode="single"
                            selectedKeys={[field.strength ?? "strong"]}
                            onSelectionChange={(keys) => {
                              if (keys === "all") return;
                              const [key] = keys;
                              if (key)
                                handleUpdateField(field.id, {
                                  strength: key as PasswordStrength,
                                });
                            }}
                          >
                            <Dropdown.Item id="normal" textValue="Normal">
                              Normal
                              <Dropdown.ItemIndicator />
                            </Dropdown.Item>
                            <Dropdown.Item id="strong" textValue="Strong">
                              Strong
                              <Dropdown.ItemIndicator />
                            </Dropdown.Item>
                            <Dropdown.Item id="very-strong" textValue="Very Strong">
                              Very Strong
                              <Dropdown.ItemIndicator />
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown.Popover>
                      </Dropdown>
                    </div>
                  </InputGroup.Suffix>
                </InputGroup>
              ) : SECRET_TYPES.includes(field.type) ? (
                <InputGroup>
                  <InputGroup.Prefix>
                    <ShieldEllipsis className="text-muted size-4" />
                  </InputGroup.Prefix>
                  <InputGroup.Input
                    type={field.showSecret ? "text" : "password"}
                    placeholder={getFieldPlaceholder(field.type)}
                    value={field.value}
                    onChange={(e) => handleUpdateField(field.id, { value: e.target.value })}
                    disabled={isPending}
                  />
                  <InputGroup.Suffix>
                    <button
                      type="button"
                      onClick={() => handleUpdateField(field.id, { showSecret: !field.showSecret })}
                      className="text-muted hover:text-foreground transition-colors focus:outline-none"
                      disabled={isPending}
                      tabIndex={-1}
                    >
                      {field.showSecret ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </InputGroup.Suffix>
                </InputGroup>
              ) : (
                <TextField
                  type={getFieldInputType(field.type)}
                  value={field.value}
                  onChange={(value) => handleUpdateField(field.id, { value })}
                  isDisabled={isPending}
                >
                  <InputGroup>
                    <InputGroup.Prefix>{getFieldIcon(field.type)}</InputGroup.Prefix>
                    <InputGroup.Input placeholder={getFieldPlaceholder(field.type)} />
                  </InputGroup>
                </TextField>
              )}
            </div>
          ))}

          {/* Add more fields */}
          <Button
            type="button"
            variant="ghost"
            onPress={handleAddField}
            isDisabled={isPending}
            className="w-full"
          >
            <Plus className="size-4" />
            Add Field
          </Button>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Link href="/" className="flex-1">
              <Button variant="secondary" className="w-full" isDisabled={isPending}>
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              isDisabled={!isFormValid || isPending}
              isPending={isPending}
              className="flex-1"
            >
              {({ isPending: pending }) => (
                <>
                  {pending && <Spinner color="current" size="sm" />}
                  {pending ? "Saving..." : "Save"}
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
