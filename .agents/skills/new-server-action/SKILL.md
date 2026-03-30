---
name: new-server-action
description: Scaffold a new Next.js server action with Prisma and Zod validation
---

Create a new Next.js server action based on the user's description.

## Instructions

The user will provide: `<action-name> [description of what it does]`

Examples:
- `/new-server-action createAccount`
- `/new-server-action updateAccountTags Updates tags on an account`
- `/new-server-action deleteCredential`

### Steps

1. Determine which file to add the action to under `src/app/actions/`. Group related actions in the same file (e.g., `accounts.ts`, `tags.ts`). Create a new file only if no appropriate file exists.
2. Read the Prisma schema at `prisma/schema.prisma` to understand the relevant model(s).
3. Write the server action using these conventions:
   - `"use server"` directive at the top of the file (if creating new file) or on the function
   - Use Zod (`zod`) to validate all inputs
   - Use the Prisma client from `src/lib/` (check existing actions for the import pattern)
   - Return a typed result object: `{ success: true, data: ... }` or `{ success: false, error: string }`
   - Handle auth via better-auth session (check existing actions for the pattern)
   - Catch Prisma errors and return user-friendly messages

4. Output the file path and function signature.

### Notes

- Do not add try/catch boilerplate for impossible errors.
- Validate at the action boundary; trust internal logic.
- Keep actions focused — one action per operation.
