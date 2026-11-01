# Task Manager

[![CI](https://github.com/pablohen/task-manager-trpc/actions/workflows/ci.yml/badge.svg)](https://github.com/pablohen/task-manager-trpc/actions/workflows/ci.yml)

A small task manager built with Next.js and tRPC. Tasks live in server memory, the list is server-rendered, and the same Zod schema validates input in the browser and on the server.

**Live demo:** https://task-manager-trpc-lemon.vercel.app (deployed on Vercel; tasks reset whenever the server restarts)

## Features

- Create, list, edit and delete tasks over tRPC, with validation and meaningful errors
- Server-rendered list with infinite scroll
- Search by title or description, kept in the URL so results can be shared
- Delete with confirmation, optimistic update and success/error notifications
- Shared create/edit form with client-side validation and loading states
- English, Portuguese and Spanish, with a language switcher
- Mobile-first layout with a fixed header and a navigation progress bar

## Stack

- **Next.js 16** (App Router, Cache Components) and **React 19**
- **tRPC 11** with the **TanStack Query 5** integration (`@trpc/tanstack-react-query`)
- **Zod 4** for validation
- **Mantine 9** for UI, with Phosphor icons
- **react-hook-form** for the form
- **react-intl** for localization
- **Vitest** for tests, **Biome** for lint and format, **pnpm**

## Running it

Requires Node 20+ and pnpm.

```bash
pnpm install
pnpm dev        # http://localhost:3000 (English; /pt and /es for the others)
```

Other scripts:

```bash
pnpm test       # unit tests (store, tRPC router, i18n)
pnpm coverage   # unit tests with a coverage report (terminal + coverage/index.html)
pnpm lint       # Biome
pnpm typecheck  # route types + tsc
pnpm build      # production build
```

The list starts with 25 fictional tasks. Everything resets when the server restarts.

## Documentation

- [Architecture](docs/architecture.md): layers, data, rendering, mutations, UI shell
- [API](docs/api.md): tRPC procedures, inputs, errors, examples
- [Localization](docs/i18n.md): how the locale is chosen, adding strings and languages
- [Development](docs/development.md): scripts, tests, conventions, Next.js 16 rules

## Project structure

```
src/
  server/      tRPC router, in-memory store, shared Zod schema
  trpc/        tRPC client (browser) and prefetch helpers (server)
  i18n/        locales, message catalogs, helpers
  app/         pages under [locale]/, HTTP endpoint under api/trpc
  components/  UI
  proxy.ts     maps URLs to a locale (English has no prefix)
```

## Decisions

- **In-memory store.** The challenge asks for no database. Only the data is pinned to `globalThis`, so dev hot reloads keep the tasks and still pick up code changes.
- **Cursor pagination using an insertion sequence.** The cursor is each task's sequence number, not an offset or a timestamp, so deleting tasks while scrolling doesn't skip or repeat items.
- **One Zod schema for client and server.** Validation rules can't drift apart. Its messages are i18n message ids, so errors show in the user's language.
- **Prefetch on the server, hydrate on the client.** Server components fetch the first page and stream it into the HTML; the client picks it up without a second request.
- **The API route owns the data.** Server components read through `/api/trpc` too, because on Vercel each route runs as a separate function with its own memory.
- **Locale in the URL.** Each language gets its own server-rendered pages and shareable links, which fits Cache Components better than a cookie. English, the default, has no prefix.
- **superjson.** Lets `createdAt` arrive in the browser as a `Date` instead of a string.

## Field names

The challenge describes the model in Portuguese. The code uses English names:

| Challenge     | Code          |
| ------------- | ------------- |
| `id`          | `id`          |
| `titulo`      | `title`       |
| `descricao`   | `description` |
| `dataCriacao` | `createdAt`   |
