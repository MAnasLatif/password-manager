# MAnasPM — Password Manager

A secure, modern password manager web app.

## Stack

- **Runtime / Package Manager**: [Bun](https://bun.sh) `1.3+`
- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **UI**: HeroUI v3 + Tailwind CSS v4
- **Auth**: Better Auth (email + password, email verification)
- **DB**: PostgreSQL + Prisma 7 (`@prisma/adapter-pg`)
- **Tests**: `bun test`

## Prerequisites

- Bun `>= 1.3`
- PostgreSQL database (set `DATABASE_URL`)

## Setup

```bash
bun install
bun run db:generate
bun run db:migrate
```

## Development

```bash
bun run dev          # start Next.js dev server (via Bun)
bun run lint
bun run format
```

Open http://localhost:3000.

## Tests

Tests use Bun's built-in runner (`bun:test`). Files live in `tests/` and match `*.test.ts`.

```bash
bun test
bun run test:watch
```

## Build & Production

```bash
bun run build
bun run start
```

## Prisma

```bash
bun run db:migrate          # dev migration
bun run db:migrate:deploy   # apply in prod
bun run db:studio
bun run db:seed
```

## Project Layout

```
src/
  app/            # Next.js App Router (auth + app route groups)
  components/     # UI components (auth/, app/)
  lib/            # auth.ts, prisma.ts, email.ts, session.ts
  contexts/       # React contexts
  actions/        # server actions
prisma/           # schema + migrations
tests/            # bun:test specs
```
