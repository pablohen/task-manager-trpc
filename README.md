# Task Manager

A small task manager built with Next.js and tRPC. Tasks live in server memory, the list is server-rendered and loads more as you scroll, and the same Zod schema validates input in the browser and on the server.

## Stack

- **Next.js 16** (App Router, Cache Components) and **React 19**
- **tRPC 11** with the **TanStack Query 5** integration (`@trpc/tanstack-react-query`)
- **Zod 4** for validation
- **Mantine 9** for UI, with Phosphor icons
- **react-hook-form** for the form
- **Vitest** for tests, **Biome** for lint and format, **pnpm**

## Running it

Requires Node 20+ and pnpm.

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

Other scripts:

```bash
pnpm test       # unit tests (store + tRPC router)
pnpm lint       # Biome
pnpm typecheck  # route types + tsc
pnpm build      # production build
```

The list starts with 25 fictional tasks. Everything resets when the server restarts.

## How it works

```
src/
  server/
    tasks/schema.ts   Zod schema, types, page size (shared with the client)
    tasks/store.ts    in-memory store
    trpc.ts           tRPC init, context, error formatting
    routers/          task router (list, byId, create, update, delete)
  trpc/
    client.tsx        browser tRPC client + QueryClient provider
    server.tsx        server-side tRPC proxy for prefetching
  app/
    page.tsx                 task list (SSR + infinite scroll)
    tasks/new/page.tsx       create form
    tasks/[id]/edit/page.tsx edit form
    api/trpc/[trpc]/route.ts HTTP endpoint
```

**Backend.** The router validates every input with Zod and reads from a store passed in through the tRPC context, so tests can use a fresh store. A missing task throws `NOT_FOUND` ("Task not found"). Invalid input returns `BAD_REQUEST` with a readable message and per-field errors (`data.zodError`), which the form shows next to the matching inputs.

**List page.** The server component calls the router in-process (no HTTP round trip) to prefetch the first page into a per-request QueryClient. It then dehydrates that cache into the HTML. On the client, `useSuspenseInfiniteQuery` picks up the hydrated data without fetching again. A sentinel element at the bottom of the list fetches the next page when it scrolls into view.

**Delete.** Each delete asks for confirmation. The task is removed from the cache right away; on failure the list is restored and the server's error is shown.

**Form.** A single `TaskForm` handles both create and edit. react-hook-form validates with the shared schema through `zodResolver`, so an empty or whitespace-only title is caught before any request is sent. Server errors are shown either inline on the matching field or as a notification. The submit button stays disabled while saving.

## Decisions

- **In-memory store on `globalThis`.** The challenge asks for no database. Pinning the store to `globalThis` keeps data from being wiped on every dev hot reload.
- **Cursor pagination using an insertion sequence.** Each task gets an increasing sequence number, and the cursor is that number rather than an offset or a timestamp. Deleting tasks while scrolling doesn't skip or repeat items. Two tasks created in the same millisecond still sort correctly.
- **One Zod schema for client and server.** Validation rules can't drift apart. The schema trims the title and treats an empty description as no description.
- **superjson.** Lets `createdAt` arrive in the browser as a `Date` instead of a string.
- **`connection()` + `<Suspense>` on the list.** With Cache Components, pages are prerendered by default. The task list changes at runtime, so it renders per request and streams in behind a skeleton.

## Field names

The challenge describes the model in Portuguese. The code uses English names:

| Challenge     | Code          |
| ------------- | ------------- |
| `id`          | `id`          |
| `titulo`      | `title`       |
| `descricao`   | `description` |
| `dataCriacao` | `createdAt`   |
