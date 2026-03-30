---
name: new-page
description: Scaffold a new Next.js App Router page in this project
---

Create a new Next.js App Router page based on the user's description.

## Instructions

The user will provide: `<route-path> [description]`

Examples:
- `/new-page dashboard/settings`
- `/new-page (app)/accounts/[id]/edit Edit account page`

### Steps

1. Determine the correct directory under `src/app/` based on the route path (respect existing route groups like `(app)`, `(auth)`).
2. Create a `page.tsx` file using these conventions from this project:
   - Use TypeScript with proper types
   - Server Component by default — only add `"use client"` if interactivity is required
   - Import HeroUI components from `@heroui/react` (always check `.heroui-docs/react` before using any component)
   - Use Tailwind CSS for layout/spacing
   - If the page needs authentication, follow the pattern in existing `(app)` pages
   - If the page needs data, create a server action in `src/app/actions/` or fetch directly in the Server Component

3. If the route needs a `layout.tsx`, create it only when required (e.g., new route group or isolated layout).
4. Output the created file paths and a brief explanation of any choices made.

### Conventions

- Route groups are in `src/app/(app)/` for authenticated pages and `src/app/(auth)/` for auth pages.
- Keep pages thin — move logic to server actions or hooks.
- Co-locate page-specific components inside the route directory if they won't be reused.
