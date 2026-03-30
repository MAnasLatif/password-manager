---
name: new-component
description: Scaffold a new React component using HeroUI v3 and project conventions
---

Create a new React component based on the user's description.

## Instructions

The user will provide: `<ComponentName> [description or requirements]`

Examples:
- `/new-component AccountCard`
- `/new-component TagBadge Displays a tag chip with color and label`
- `/new-component DeleteConfirmModal Confirmation alert-dialog for destructive actions`

### Steps

1. Determine if this is a shared component (`src/components/`) or a page-specific component (co-located in route directory). Ask if unclear.
2. Before writing the component, search `.heroui-docs/react` for any HeroUI components needed. Read the relevant `.mdx` doc.
3. Create the `.tsx` file using these conventions:
   - Use TypeScript with explicit prop types (no `any`)
   - Add `"use client"` only if the component requires browser APIs, event handlers, or hooks
   - Import HeroUI from `@heroui/react`
   - Use `lucide-react` for icons
   - Style with Tailwind CSS utility classes; use `tailwind-merge` (`cn` utility if it exists) for conditional classes
   - Keep components focused — one responsibility per component

4. Output the file path and explain any HeroUI component API choices made.

### Notes

- Do NOT add JSDoc or prop comments unless the logic is non-obvious.
- Do not add default exports and named exports for the same symbol.
- Check `src/components/` for existing similar components before creating a new one.
