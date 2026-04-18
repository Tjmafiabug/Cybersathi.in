# Supabase / DB setup

Schema is defined in Drizzle (`src/lib/db/schema/`). Supabase-specific SQL
(RLS policies, triggers, seed data) lives here as hand-written files.

## First-time setup

1. Fill `.env.local` with `DATABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`
   (Supabase dashboard → Project Settings → Database / API).
2. Push the Drizzle schema to the hosted Supabase DB:
   ```
   pnpm db:push
   ```
3. Apply RLS policies + trigger (run once):
   ```
   pnpm db:policies
   ```
4. Seed categories, news sources, and topic queue:
   ```
   pnpm db:seed
   ```

## Day-to-day

- Edit `src/lib/db/schema/*.ts` → `pnpm db:push` re-syncs the DB.
- If you add a new table, re-run `pnpm db:policies` after adding its
  policies to `policies.sql` (policies use `create policy` which will error
  if already present — re-applying requires `drop policy` first, or use
  `pnpm db:studio` to inspect).
- `pnpm db:studio` opens Drizzle Studio for browsing data locally.
