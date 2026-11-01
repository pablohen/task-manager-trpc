# Architecture

## Layers

```
Browser                          Server (Next.js)
─────────────────────────────    ───────────────────────────────────────
Client components                Server components (pages, layouts)
  useTRPC() + TanStack Query       trpc proxy (in-process, no HTTP)
        │                                 │
        │ HTTP  /api/trpc                 │
        ▼                                 ▼
  route.ts (fetch adapter) ─────► appRouter ─► ctx.store ─► in-memory data
```

| Path | Role |
| --- | --- |
| `src/server/tasks/schema.ts` | Zod input schema, `Task` / `TaskPage` types, page size, cursor helper. Imported by both server and client. |
| `src/server/tasks/store.ts` | In-memory store: `list`, `get`, `create`, `update`, `remove`. |
| `src/server/trpc.ts` | tRPC init (superjson, error formatter) and the request context. |
| `src/server/routers/` | `task` router and the root `appRouter`. |
| `src/app/api/trpc/[trpc]/route.ts` | Exposes the router over HTTP. |
| `src/trpc/server.tsx` | Server-side options proxy, per-request `QueryClient`, `HydrateClient`. |
| `src/trpc/client.tsx` | Browser tRPC client and `TRPCReactProvider`. |
| `src/trpc/query-client.ts` | Shared `QueryClient` defaults (stale time, superjson (de)hydration). |
| `src/i18n/` | Locales, message catalogs, server/client helpers. See [i18n.md](i18n.md). |
| `src/proxy.ts` | Maps URLs onto `app/[locale]`: English without a prefix (rewrite), `/pt` and `/es` with one. |
| `src/app/[locale]/` | Pages, root layout, error and not-found boundaries. |
| `src/components/`, `src/hooks/` | UI. |
| `src/theme.ts` | Mantine theme (mobile-first sizes). |

## Data

The store keeps tasks in a `Map` plus an increasing sequence number. Each task gets the next number on insert, and the pagination cursor is that number: `list` returns tasks with a lower number than the cursor, newest first. Cursors stay valid when tasks are deleted and two tasks created in the same millisecond still have a fixed order.

Search (`?q=`) filters by title and description, case-insensitively, before paginating.

Only the data (`Map` + counter) is pinned to `globalThis`. `getTaskStore()` builds the store functions around it on every request, so dev hot reloads keep the tasks but still pick up code changes. The 25 fictional seed tasks are created on the first request, not at import time, because Next may import the module while prerendering and `Date.now()` isn't allowed there.

The router reads the store from the tRPC context, so tests pass a fresh `createTaskStore()`.

## Rendering

Cache Components is on (`next.config.ts`), so pages are prerendered by default and anything request-specific has to opt out explicitly.

**List page** (`app/[locale]/page.tsx`):

1. The title renders in the static shell.
2. Inside `<Suspense>`, `PrefetchedTaskList` reads `searchParams`, then calls `await connection()` to render per request. `searchParams` alone isn't enough because Next can prerender with them.
3. It starts `prefetchInfiniteQuery` without awaiting it. Pending queries are dehydrated (`shouldDehydrateQuery` in `query-client.ts`), so the data streams to the browser inside the HTML.
4. `TaskList` (client) calls `useSuspenseInfiniteQuery` with the same input and picks up the hydrated cache without a second request.
5. A sentinel element under the list (`useIntersection`) fetches the next page as it scrolls into view.

The server prefetch and the client query must build the same query key. Both use `TASKS_PAGE_SIZE`, `getNextTaskCursor` and `toSearchTerm` from `schema.ts`.

**Edit page.** The task is loaded in-process with `caller.task.byId` inside `<Suspense>`. `NOT_FOUND` or a malformed id calls `notFound()`.

**Preserved routes.** With Cache Components, Next keeps up to 3 visited routes mounted but hidden (React `<Activity>`). `TaskForm` remounts itself after a successful save (a `key` bumped in a `useLayoutEffect` cleanup) so that returning to the form shows an empty form and an idle button. Unsaved drafts are kept.

## Mutations

- **Create / update:** `TaskForm` (react-hook-form + `zodResolver(taskInputSchema)`). On success it invalidates the list and redirects to it. Server field errors (`data.zodError.fieldErrors`) go into `setError`; other errors become a notification.
- **Delete:** `useDeleteTask` opens a confirm modal (one per task id), removes the task from every cached list page right away, restores them on error, and invalidates the list when it settles. A ref tracks deletes in flight so a double click sends one request.

## UI shell

`AppLayout` uses Mantine `AppShell` with a fixed header: the brand, the search box, the language menu and "New task". The search box lives in the header, so searching from any page navigates to the list with `?q=`.

`RouteProgress` drives Mantine's navigation progress bar. The App Router has no navigation events, so it starts on clicks on internal links and completes when the pathname or search params change.

The theme is mobile first: 16px inputs (no iOS zoom on focus), ~44px action icons, `md` buttons, a fluid `h1`. Form buttons stack full width on phones.
