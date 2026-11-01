<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Task Manager

Next.js 16 (App Router, Cache Components) + tRPC 11 + TanStack Query 5 + Zod 4 + Mantine 9 + react-intl. Tasks live in server memory. Read `README.md` for the overview and `docs/` for details:

- `docs/architecture.md`: layers, data, rendering, mutations, UI shell
- `docs/api.md`: tRPC procedures, inputs, errors
- `docs/i18n.md`: locales, translating, adding strings or languages
- `docs/development.md`: scripts, tests, conventions, Next.js 16 rules

## Commands

Use pnpm, never npm or yarn.

```bash
pnpm dev
pnpm lint        # Biome; `pnpm format` to fix
pnpm typecheck   # next typegen + tsc
pnpm test        # Vitest
pnpm build
```

Before finishing a change, run `pnpm lint`, `pnpm typecheck` and `pnpm test`. Run `pnpm build` when touching routing, layouts, `proxy.ts` or anything that reads the URL: some Cache Components errors only show up there.

## Where things go

- Validation rules and types shared by client and server: `src/server/tasks/schema.ts`.
- Data access: `src/server/tasks/store.ts`, reached through `ctx.store` in the router. Don't import the store elsewhere.
- Procedures: `src/server/routers/`. Throw `TRPCError` with `NOT_FOUND` / `BAD_REQUEST`.
- Pages: `src/app/[locale]/`. UI: `src/components/`, `src/hooks/`.
- User-facing text: `src/i18n/messages/{en,pt,es}.ts`. Every key in all three.

## Rules

- **No hard-coded UI text.** Use `getIntl()` in server components, `useIntl()` / `<FormattedMessage>` in client components. Validation messages in the schema are message ids.
- **Links are locale-free** (`"/tasks/new"`). `LinkButton` and `PageBreadcrumbs` localize them; otherwise use `useLocalizedPath()`.
- **Per-request data** goes inside `<Suspense>` after `await connection()`. No `Date.now()` or `Math.random()` at module scope or during prerender.
- **`useSearchParams`** (and `usePathname` on dynamic routes) needs a `<Suspense>` boundary.
- **Server prefetch and client query** must use the same input. Reuse `TASKS_PAGE_SIZE`, `getNextTaskCursor` and `toSearchTerm`.
- **Visited pages stay mounted** (React Activity). State that must not survive a revisit needs resetting, like `TaskForm` does.
- **Mantine + Phosphor** for UI, react-hook-form for forms, mobile-first sizes from `src/theme.ts`.
- **Biome default config.** Keep `biome.json` to `$schema` only.
- **Comments explain why**, not what. Keep them short.
- **Commits:** Conventional Commits, one logical change each.
- **The repo is public:** fictional data only, no secrets.
