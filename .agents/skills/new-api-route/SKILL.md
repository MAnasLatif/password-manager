---
name: new-api-route
description: Scaffold a new Next.js App Router API route handler
---

Create a new Next.js API route based on the user's description.

## Instructions

The user will provide: `<route-path> [description]`

Examples:
- `/new-api-route accounts/export`
- `/new-api-route accounts/[id]/share POST route that generates a one-time share link`

### Steps

1. Create `src/app/api/<route-path>/route.ts`.
2. Read existing route handlers in `src/app/api/` to follow established patterns (auth checking, response format, error handling).
3. Implement the route handler using these conventions:
   - Export named functions matching HTTP methods: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`
   - Use `NextRequest` and `NextResponse` from `next/server`
   - Check authentication using better-auth session at the top of each handler
   - Parse and validate request body/params with Zod where applicable
   - Return consistent JSON: `{ data: ... }` for success, `{ error: string }` with appropriate status codes for errors
   - Use Prisma for database access (follow import pattern from existing routes)

4. Output the file path, exported method names, and a brief description of the handler logic.

### Notes

- Prefer server actions over API routes for form submissions and mutations triggered from the UI.
- Use API routes for: webhooks, external integrations, file downloads, or when you need full HTTP control.
- Do not add logging or telemetry unless the existing codebase does so.
