# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A TOTO bathroom-fixtures storefront: a public product showcase (browse by
category, view product detail — no cart/checkout) plus a back-office where one
authenticated staff member creates and maintains products. Deploys to **Vercel
+ Supabase**. A separate Linktree-style nav page is planned but not built yet.

## Stack

- **Next.js 16.2** App Router, React 19, TypeScript, Turbopack (default).
- **Tailwind CSS v4** (config-less; theme tokens live in `src/app/globals.css` via `@theme`).
- **Supabase** — Postgres (products/categories), Auth (admin login), Storage (product images), all behind Row Level Security.

## Commands

```bash
npm run dev        # dev server (Turbopack) at http://localhost:3000
npm run build      # production build — also runs full tsc typecheck
npm run lint       # ESLint (eslint-config-next)
npx tsc --noEmit   # typecheck only
npx next typegen   # regenerate .next/types after moving/renaming routes
```

There is no test runner configured. After moving route files, a stale
`.next/types` can cause phantom `Cannot find module '.../page.js'` errors —
`rm -rf .next && npx next typegen` (or a full build) clears them.

## Next.js 16 specifics (differ from older training data)

- **`middleware.ts` is renamed `proxy.ts`.** Ours lives at `src/proxy.ts` and exports a `proxy()` function + `config.matcher`. Do not create a `middleware.ts`.
- **Dynamic APIs are async:** `cookies()`, `headers()`, and page `params`/`searchParams` are Promises — always `await` them. `src/lib/supabase/server.ts` and every dynamic page already do.
- Turbopack is the default for `dev` and `build`; no `--turbopack` flag needed.
- The bundled, version-correct docs are in `node_modules/next/dist/docs/` — consult them before using an unfamiliar API.

## Architecture

### Supabase client boundaries (`src/lib/supabase/`)
Three distinct clients — pick by execution context:
- `client.ts` → `createClient()`: browser/Client Components, anon key.
- `server.ts` → `createClient()`: **async**, for Server Components / Actions / Route Handlers. Wires Next's cookie store; cookie writes from a Server Component are intentionally swallowed (the proxy does the real refresh).
- `server.ts` → `createAdminClient()`: **service-role, bypasses RLS.** Server-only, used solely for privileged storage cleanup on delete. Never import into client code or a Server Component that renders to the browser.
- `proxy.ts` → `updateSession()`: runs in `src/proxy.ts` on every matched request to refresh the auth session **and** guard `/admin`.

### Auth & authorization model
- Auth is Supabase email/password. **There is no public sign-up** — admin accounts are created by hand in the Supabase dashboard, so *any authenticated user is treated as an admin*. RLS policies grant the `authenticated` role full read/write; the `anon` role gets read-only access to published rows.
- Access is enforced in **two layers**: (1) `src/proxy.ts` redirects unauthenticated requests away from `/admin/*` (except `/admin/login`), and (2) RLS in Postgres is the real security boundary. Never rely on the proxy alone.
- `src/app/admin/layout.tsx` renders admin chrome only when a user exists; for the unauthenticated `/admin/login` case it renders children bare (avoids a redirect loop, since login lives under `/admin`).

### Routing layout
- `src/app/(storefront)/` — public pages (route group, so it owns its own header/footer layout): `/` (new arrivals + featured), `/categories/[slug]`, `/products/[slug]`. Only **published** products are queried here.
- `src/app/admin/` — back office: `/admin` (table), `/admin/products/new`, `/admin/products/[id]/edit`, `/admin/login`.
- The slug `new-arrivals` is a **virtual category**: its page shows all `is_new` products across categories rather than rows literally assigned to it (see `categories/[slug]/page.tsx`).

### Data flow
- **Reads** go through `src/lib/queries.ts` (storefront, RLS-filtered, always uses the request-scoped server client). Admin pages query Supabase directly since they need unpublished rows too.
- **Writes** are React Server Actions in `src/app/admin/actions.ts` (`createProduct`/`updateProduct`/`deleteProduct`/`signIn`/`signOut`). Forms post `FormData` to them; mutations call `revalidatePath('/')` + `/admin` and `redirect`. The shared `ProductForm` client component (`src/app/admin/products/product-form.tsx`) drives both create and edit via `useActionState`.
- **Images** live in the public `product-images` Storage bucket; a product's `images` column holds object *paths*, not URLs. `productImageUrl()` in `src/lib/images.ts` builds the public URL deterministically (no client round-trip). On edit, kept images travel as `existing_images` hidden inputs and newly uploaded files merge with them; on delete, the service-role client removes the orphaned objects.
- `specs` is freeform `jsonb`. The form accepts `key: value` per line (or raw JSON) and `parseSpecs()` converts it.

### Database
- Schema + RLS + the Storage bucket are defined in `supabase/migrations/0001_init.sql`; `supabase/seed.sql` adds dev categories and sample products. Apply via the Supabase SQL editor or `supabase db push`.
- DB TypeScript types are **hand-written** in `src/lib/supabase/types.ts` and must be kept in sync with the migration (or regenerated with `npx supabase gen types`). All three Supabase clients are typed with `Database`.

## Conventions

- Path alias `@/*` → `src/*`.
- UI text is Traditional Chinese (zh-Hant); prices format as TWD via `formatPrice()`.
- The TOTO accent color is the `--accent` token in `globals.css`; use `text-accent` / `bg-accent` rather than hard-coded blues.

## Environment

Required in `.env.local` (and Vercel project settings) — see `.env.example`:
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`SUPABASE_SERVICE_ROLE_KEY` (server-only). `next.config.ts` derives the
`next/image` remote-pattern allow-list from `NEXT_PUBLIC_SUPABASE_URL`, so that
env var must be present at build time for product images to optimize.
