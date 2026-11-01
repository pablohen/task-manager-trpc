# Development

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Dev server on http://localhost:3000 |
| `pnpm build` / `pnpm start` | Production build / serve it |
| `pnpm test` | Vitest unit tests |
| `pnpm coverage` | Tests with a V8 coverage report for `src/server` (terminal + `coverage/index.html`) |
| `pnpm lint` / `pnpm format` | Biome check / fix |
| `pnpm typecheck` | `next typegen` (route and root-param types) then `tsc` |

## Tests

Unit tests cover the backend and i18n:

- `src/server/tasks/store.test.ts`: store behaviour, pagination, search, schema rules.
- `src/server/routers/task.test.ts`: procedures through `createCaller` with a fresh store, plus one test through the HTTP fetch adapter for the error format.
- `src/i18n/i18n.test.ts`: `Accept-Language` matching, path helper, catalog consistency.

The UI is verified in the browser.

## Conventions

- pnpm only. Biome with its default config (`biome.json` holds only `$schema`); the lint scripts list the folders to check so `.next` is skipped.
- Mantine for UI, Phosphor for icons, react-hook-form for forms.
- Comments explain why, not what.
- Commits follow Conventional Commits, one logical change each.

## Next.js 16 rules this code depends on

- **Cache Components.** Per-request data needs `await connection()` (or another runtime API) inside `<Suspense>`. `Date.now()` and similar can't run while prerendering.
- **Client hooks that read the URL** (`useSearchParams`, and `usePathname` on dynamic routes) need a `<Suspense>` boundary, or the build fails.
- **Preserved routes.** Hidden pages keep their React state. Reset state that shouldn't survive a revisit (see `TaskForm`).
- **`proxy.ts`** replaces `middleware.ts`.
- **`next/root-params`** gives server components the locale without props.

Next's own docs for the installed version are in `node_modules/next/dist/docs/`.
