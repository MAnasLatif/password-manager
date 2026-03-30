---
name: project-ui-ux-patterns
description: "MANDATORY for ALL UI work in MAnasPM. MUST be loaded before writing any component, page, modal, form, layout, or styling code in this project. Defines the authoritative design system: HeroUI v3, oklch colors, Tailwind v4, Geist fonts, layout architecture, spacing scale, icon conventions, form/modal/toast patterns, state management, and server action contracts. Skipping this skill will produce code inconsistent with the existing codebase. Triggers: component, page, layout, form, modal, toast, theme, styling, UI, UX, design, sidebar, header, card, table, auth form, server action, or any visual/interactive feature."
---

> **REQUIRED READING** — Load this skill before writing ANY UI code in MAnasPM. Every component, page, modal, form, and layout must follow these conventions. Deviations will break visual consistency with the rest of the app.

This skill defines the established UI/UX design patterns for the MAnasPM codebase. Follow these conventions for all new UI work to maintain consistency.

## Tech Stack

| Layer       | Choice                                                                        |
| ----------- | ----------------------------------------------------------------------------- |
| Framework   | Next.js 16 (App Router) + React 19                                            |
| UI Library  | HeroUI React v3 (`@heroui/react`)                                             |
| Styling     | Tailwind CSS v4 + PostCSS v4 with oklch color variables                       |
| Icons       | `lucide-react`                                                                |
| Theming     | `next-themes` (light/dark/system) with oklch perceptually-uniform colors      |
| Fonts       | Geist Sans (`--font-geist-sans`) + Geist Mono (`--font-geist-mono`)           |
| State       | React Context API + URL query params (`useQueryParams` hook) + `localStorage` |
| Drag & Drop | `@dnd-kit` (core, sortable, utilities)                                        |
| Forms       | HeroUI form components + Zod v4 validation + server actions                   |
| Auth        | Better Auth via `@/lib/auth-client`                                           |
| Clipboard   | `useCopyToClipboard` from `usehooks-ts`                                       |
| Debounce    | `useDebounceValue` from `usehooks-ts`                                         |
| Top loader  | `nextjs-toploader` (purple `#6f42c1`)                                         |
| Toasts      | `toast` from `@heroui/react` (via `Toast.Provider` in root)                   |

## Color & Theme System

### oklch Color Variables

All colors use perceptually-uniform oklch in `src/styles/globals.css`. Both `:root` (light) and `.dark` (dark) themes are defined.

**Key semantic tokens:**

- `--accent` / `--accent-foreground` — Purple primary action color (`oklch(50.15% 0.1884 294.99)`)
- `--background` / `--foreground` — Page background and text
- `--surface`, `--surface-secondary`, `--surface-tertiary` — Progressive depth layers
- `--danger`, `--success`, `--warning` — Status colors with matching foregrounds
- `--muted` — Secondary/subdued text
- `--border`, `--separator` — Structural dividers
- `--field-background`, `--field-foreground`, `--field-placeholder` — Form field tokens
- `--focus` — Focus ring color (matches accent)

**Border radius tokens:** `--radius: 0.25rem`, `--field-radius: 0.5rem`

### Dynamic Colors

Use `stringToColor()` from `@/utils` for consistent string-to-HSL hash (avatars, tags):

```ts
import { stringToColor } from "@/utils";
// Returns hsl(H, 65-85%, 50-65%) based on string hash
```

### Theme Provider

```tsx
<ThemeProvider attribute={["class", "data-theme"]} defaultTheme="system" enableSystem>
```

### Theme Toggle

Reuse `<ThemeToggle />` from `@/components/ThemeSwitcher`. Accepts `ButtonProps`:

```tsx
<ThemeToggle variant="ghost" size="sm" className="text-muted" />
```

Uses Sun/Moon icon swap with CSS `scale` + `rotate` transitions on `dark:` prefix.

## Layout Architecture

### Root Layout (`src/app/layout.tsx`)

- Fixed fullscreen: `fixed top-0 right-0 bottom-0 left-0 z-0 flex flex-col overflow-hidden`
- Font vars on `<body>`: `${geistSans.variable} ${geistMono.variable}`
- `bg-background text-foreground antialiased`

### App Layout (`src/app/(app)/layout.tsx`) — Authenticated Pages

Three-column layout with sticky sidebar:

```
┌─────────────────────────────────────────────────┐
│ AppHeader (72px, full-width)                    │
├──────────┬─────────────────────────┬────────────┤
│ Sidebar  │ Main Content            │ Spacer     │
│ max-w-50 │ max-w-2xl, m-auto       │ max-w-25   │
│ sticky   │ scrollable              │            │
└──────────┴─────────────────────────┴────────────┘
```

```tsx
<div className="flex h-[calc(100dvh-72px)] w-full gap-4 overflow-auto p-4">
  <AppSidebar className="sticky top-0 h-[calc(100dvh-104px)] w-full max-w-50 overflow-auto" />
  <div className="m-auto h-full w-full max-w-2xl">{children}</div>
  <div className="w-full max-w-25" />
</div>
```

### Auth Layout (`src/app/(auth)/layout.tsx`) — Unauthenticated Pages

Centered single-column with theme toggle:

```tsx
<div className="relative min-h-svh">
  <div className="absolute top-4 right-4">
    <ThemeToggle variant="ghost" />
  </div>
  <main className="flex min-h-svh items-center justify-center px-4 py-16">{children}</main>
</div>
```

Auth forms use `max-w-sm` width constraint.

## Typography Hierarchy

| Purpose                     | Classes                                        |
| --------------------------- | ---------------------------------------------- |
| Page/card title             | `text-lg font-semibold` or `text-xl font-bold` |
| Section header              | `text-sm font-medium` or `font-semibold`       |
| Body text                   | `text-sm` (project default)                    |
| Muted/secondary text        | `text-xs text-muted`                           |
| Brand subtitle              | `text-[10px] text-muted`                       |
| Form labels                 | `text-sm font-medium`                          |
| Links                       | `text-accent hover:underline`                  |
| Monospace (passwords, keys) | `font-mono text-sm`                            |

## Spacing Conventions

| Use Case          | Tailwind Class     | Pixels |
| ----------------- | ------------------ | ------ |
| Major section gap | `gap-6`            | 24px   |
| Form field gap    | `gap-4`            | 16px   |
| List item gap     | `gap-3`            | 12px   |
| Container padding | `p-4`              | 16px   |
| Compact padding   | `p-3`              | 12px   |
| Tight grouping    | `gap-1` or `gap-2` | 4–8px  |

## Icon Conventions

Always use `lucide-react`. Standard sizing:

| Context            | Class      | Pixels |
| ------------------ | ---------- | ------ |
| Default actions    | `size-4`   | 16px   |
| Compact/menu items | `size-3.5` | 14px   |
| Tiny/inline        | `size-3`   | 12px   |

Color convention: `text-muted` (default), `text-danger`, `text-accent`, `text-warning` for semantic.

**Common icons by category:**

- Navigation: `ArrowLeft`, `ChevronDown`, `ChevronRight`, `User`, `Settings`, `LogOut`
- Actions: `Plus`, `Trash2`, `Pencil`, `Copy`, `Eye`, `EyeOff`, `Share2`, `Download`, `Link2`
- Fields: `Mail`, `Globe`, `KeyRound`, `Phone`, `CreditCard`, `Calendar`, `Clock`, `Tag`
- Status: `Star` (favorite), `Loader2` (loading spinner with `animate-spin`), `GripVertical` (drag handle)

## Component Patterns

### HeroUI Import Convention

Always import from the single `@heroui/react` barrel:

```tsx
import { Button, Modal, Avatar, TextField, Input, Label, FieldError, cn } from "@heroui/react";
```

### "use client" Directive

- Server Components by default for pages
- Add `"use client"` only for components using hooks, event handlers, or browser APIs
- All form components, modals, and interactive UI are client components

### Export Pattern

- **Page components**: `export default function PageName()`
- **Shared components**: `export function ComponentName()` (named) or `export default function`
- Never use both named and default exports for the same symbol

### Prop Interface Pattern

```tsx
interface ComponentNameProps {
  account: Account;
  platform: Platform;
  className?: string;
}

export default function ComponentName({ account, platform, className }: ComponentNameProps) {}
```

Accept `className` on wrapper components. Use HeroUI `cn()` for merging.

## Form Patterns

### Structure

```tsx
<form onSubmit={handleSubmit}>
  <div className="flex flex-col gap-4">
    {error && <Alert status="danger">{error}</Alert>}

    <TextField>
      <Label>Field Name</Label>
      <Input placeholder="..." />
      <FieldError />
    </TextField>

    <Button type="submit" className="w-full" isPending={isPending}>
      {({ isPending: pending }) => (
        <>
          {pending && <Spinner size="sm" />}
          {pending ? "Submitting..." : "Submit"}
        </>
      )}
    </Button>
  </div>
</form>
```

### Multi-Step Forms (Auth Pattern)

1. Step 1: Email input → validate → proceed
2. Step 2: Password input with show/hide toggle → submit
3. Error auto-dismiss after 30s: `setTimeout(() => setError(""), 30000)`
4. Use `useTransition` for pending state

### Password Show/Hide Toggle

```tsx
<Button isIconOnly variant="ghost" size="sm" onPress={() => setShowPassword(!showPassword)}>
  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
</Button>
```

### Validation

- Client-side: Format checks, `isInvalid` prop on HeroUI components
- Server-side: Zod schemas + Better Auth
- Server action return: `{ success: true, ...data }` or `{ success: false, error: "message" }`

## Modal Patterns

### Standard Structure

```tsx
<Modal>
  <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
    <Modal.Container size="md" placement="top">
      <Modal.Dialog className="p-0">
        <Modal.Header className="p-4 pb-0">{/* Icon + title + description */}</Modal.Header>
        <Modal.Body className="mt-0 flex flex-col gap-4 p-4">{/* Content */}</Modal.Body>
        <Modal.Footer className="flex justify-between p-4 pt-0">
          {/* Cancel + Primary action */}
        </Modal.Footer>
      </Modal.Dialog>
    </Modal.Container>
  </Modal.Backdrop>
</Modal>
```

### Modal State Pattern

Modals are controlled via `useState` in the parent:

```tsx
const [isModalOpen, setIsModalOpen] = useState(false);
// ...
<SomeModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />;
```

## Toast Notifications

```tsx
import { toast } from "@heroui/react";

toast.success("Item copied to clipboard!");
toast.error("Something went wrong");
```

## Copy-to-Clipboard Pattern

```tsx
import { useCopyToClipboard } from "usehooks-ts";

const [_, copy] = useCopyToClipboard();

const handleCopy = (text: string, label: string) => () => {
  copy(text)
    .then(() => toast.success(`${label} copied to clipboard!`))
    .catch((err) => console.error(err));
};
```

## State Management

### App Context (`src/contexts/app-state.tsx`)

Dynamic per-page state for header behavior:

```tsx
interface ContextType {
  searchPlaceholder: string; // "Search accounts" | "Search platforms"
  searchQuery: string; // Current search term
  addButton: { tooltip: string; on: string }; // Context-aware add button
}
```

Use via `useAppState()` hook.

### URL Query Params (`src/hooks/use-query-params.ts`)

Rich API: `get()`, `set()`, `append()`, `remove()`, `toggle()`, `batch()`, `clear()`.
Defaults: `replace: true`, `scroll: false`.

### localStorage

Used for persisting sidebar accordion expanded state (`sidebar-expanded-sections`).

### Session

```tsx
import { useSession } from "@/lib/auth-client";
const { data: session } = useSession();
// session.user.{ name, email, image, id }
```

## Animation & Transition Patterns

- **Interactive elements**: `transition-colors` for hover/focus
- **Loading spinners**: `<Loader2 className="size-4 animate-spin" />` or HeroUI `<Spinner size="sm" />`
- **Theme toggle**: `scale` + `rotate` transitions with `dark:` prefix
- **Search debounce**: 300ms via `useDebounceValue`
- **Tooltip delay**: `delay={0}` (instant)
- **Drag activation**: 5px pointer distance constraint (dnd-kit)
- **Error auto-dismiss**: 30s timeout

## Navigation Patterns

### Sidebar

- Built with HeroUI `Accordion` for collapsible sections
- Static items: "My Vault", "Favorites", "Shared With Me"
- Dynamic items: Collections, Teams, Tags (fetched + rendered)
- Active indicator: `variant={pathname === path ? "primary" : "ghost"}`
- Expanded state persisted to `localStorage`

### Header

Three-zone layout (logo | search + add | theme + avatar):

- Logo: `max-w-50` (matches sidebar width)
- Search: `max-w-2xl` with debounced input
- Actions: `max-w-25` (matches right spacer)

### Links

Always use Next.js `<Link href="...">` wrapping interactive elements.

## Avatar Pattern

```tsx
<Avatar>
  <Avatar.Image src={user.image ?? ""} alt={user.name ?? "User"} />
  <Avatar.Fallback delayMs={0}>{getInitials(user.name)}</Avatar.Fallback>
</Avatar>
```

Use `getInitials()` from `@/utils` for 2-letter fallback. Use `stringToColor()` for color-coded fallbacks when needed.

## Card Pattern (Account Cards)

- **Header row**: Title + tag chips + favorite star + shared avatars + overflow menu
- **Body**: Email, password (show/hide + copy), notes, custom fields
- **Actions**: Modals triggered from menu (share, export, tags, one-time link)
- **Menu**: HeroUI `Dropdown` with submenus via `DropdownSubmenuTrigger`

## Server Action Pattern

```tsx
// src/app/actions/auth.ts
export async function actionName(params: Type) {
  try {
    // Zod validation + API call
    return { success: true, ...data };
  } catch (error) {
    return { success: false, error: "User-friendly message" };
  }
}
```

## Utility Functions

| Function                         | Location          | Purpose                                         |
| -------------------------------- | ----------------- | ----------------------------------------------- |
| `getInitials(name)`              | `@/utils`         | "John Doe" → "JD"                               |
| `getFaviconUrl(domain)`          | `@/utils`         | Google favicon service URL                      |
| `fetchPlatformName(domain)`      | `@/utils`         | Clearbit API for company names                  |
| `stringToColor(str)`             | `@/utils`         | Deterministic HSL from string hash              |
| `getAccountTitle(account)`       | `@/utils/account` | Title fallback: title → username → email prefix |
| `buildAccountText/Json/Csv(...)` | `@/utils/account` | Multi-format account export builders            |

## Type Definitions (`src/types/index.ts`)

Core interfaces: `Account`, `Platform`, `SidebarItem`, `AccountTag`, `AccountCustomField`, `SharedUser`, `SharedTeam`. Always import from `@/types`.

## File Organization

```
src/
├── app/
│   ├── (app)/          # Authenticated pages (App Layout)
│   ├── (auth)/         # Auth pages (Auth Layout)
│   ├── actions/        # Server actions
│   └── api/            # API routes
├── components/
│   ├── app/            # App-specific components (cards, modals)
│   ├── auth/           # Auth form components
│   ├── app-header.tsx  # Shared header
│   ├── app-sidebar.tsx # Shared sidebar
│   └── ThemeSwitcher.tsx
├── contexts/           # React contexts
├── hooks/              # Custom hooks
├── lib/                # Auth, Prisma, email configs
├── styles/             # globals.css (oklch theme)
├── types/              # TypeScript interfaces
└── utils/              # Pure utility functions
```

## Quick Reference Checklist

When building new UI:

1. Import components from `@heroui/react` (check `.heroui-docs/react` for API)
2. Import icons from `lucide-react` at `size-4` default
3. Use semantic color classes (`text-muted`, `text-danger`, `bg-surface`, etc.)
4. Follow the spacing scale: `gap-4` for forms, `gap-3` for lists, `p-4` for containers
5. Use `text-sm` as default body size
6. Add `"use client"` only when needed
7. Use `cn()` from `@heroui/react` for conditional class merging
8. Return `{ success, error }` from server actions
9. Show toasts for user feedback via `toast.success()` / `toast.error()`
10. Use `useTransition` for pending states in forms
