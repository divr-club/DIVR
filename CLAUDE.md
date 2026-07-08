@AGENTS.md

# DIVR — dive-club social app

Divers plan dives, log them, and unlock species in the "Divr-Dex".
Pushing to `main` updates the live site — that's the only place I see changes.

## Stack & style

- Next.js 16.2.4 App Router, but every page is a `"use client"` component
  fetching data in `useEffect` (SPA style). Stay in this pattern; don't mix in
  server components piecemeal without a deliberate migration.
- Supabase for auth + database. Browser client in `lib/supabase.js`; the
  session lives in localStorage, so the server never sees who's logged in.
- Plain JavaScript. Don't create `.ts`/`.tsx` files or convert existing ones.
- 2-space indentation.
- Styling: new or edited pages get their own CSS Module (`page.module.css`
  next to the page). Never add rules to `app/globals.css` — it's a 1,500-line
  file where changes to one page silently break another. When touching a page,
  move its rules out of globals.css into its module if practical.

## Non-negotiable workflow

- I don't run the app locally. Before every push: `npm run build` must pass
  AND you must run `npm run dev` and click through the affected flow yourself.
- Git: work on a branch, open a PR, I merge. Never push to `main`.
- Database changes: write the exact SQL, tell me to paste it into
  Supabase Dashboard → SQL Editor, and wait for my confirmation before
  writing code that depends on it. You can't see my schema or RLS policies —
  ask me to paste them from the dashboard when you need them.
- Unrelated bugs you notice: list them at the end, don't fix them in the
  same PR.

## Gotchas (verified in this codebase)

- `app/ log-dive/` has a leading space in its folder name (GitHub web rename
  accident), so its real route is `/%20log-dive`. Don't reference `/log-dive`
  until it's renamed.
- There is no `app/page.js`, so `/` returns a 404.
- Column-name traps in `profiles`: real columns include `dives_count` and
  `total_logged_dives`, but `app/home/page.js` reads a nonexistent
  `dives_logged`. Verify column names against the signup insert
  (`app/signup/page.js`) before trusting them.
- Auth checks are client-side redirects only, and inconsistent — several
  pages crash on `user.id` when logged out. There is no `proxy.ts`.
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` are not in the
  repo; the app won't start without them — ask me for values.
