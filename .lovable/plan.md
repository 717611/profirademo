## Goal

Build a role-based investor onboarding flow: public waitlist → admin review → approval → self-signup (gated by approved email) → role-based routing. Marketing pages stay public; only `/portfolio` and `/admin/*` are protected.

## 1. Roles & routing (role-based, no email checks post-login)

`app_role` enum already has `admin` and `staff` — add `investor`.

- **Bootstrap admin (one-time)**: the existing `bootstrap_first_admin` trigger already grants `admin` to the first signup. Extend it: if the new user's email equals `aryanreshav8@gmail.com` and no admin row exists, grant admin. After that, the trigger never runs that branch again — pure role-based from then on.
- **Default role on signup**: a new `assign_investor_role` trigger on `auth.users AFTER INSERT` grants `investor` to every new user that doesn't already get `admin` from the bootstrap trigger.
- **Routing after sign-in** (in `/signin`):
  - call a server fn `getMyRole()` (uses `requireSupabaseAuth`, reads `user_roles`)
  - `admin` or `staff` → `/admin`
  - `investor` → `/home`
  - no role → `/home` with a "pending access" toast (defensive)

No email comparisons live in routing code.

## 2. Public vs protected routes

Public (unchanged SSR, no auth gate): `/`, `/home`, `/about`, `/signin`.

Move portfolio under the auth gate:
- delete top-level `src/routes/portfolio.tsx`
- create `src/routes/_authenticated/portfolio.tsx` (same content, same `createFileRoute("/_authenticated/portfolio")`)
- the existing `_authenticated/route.tsx` already redirects unauthenticated users to `/admin/login` — update it to redirect to `/signin` instead (single sign-in surface).
- Add a tiny role gate inside `/_authenticated/portfolio.tsx`: load role via server fn; if role is `admin`/`staff`/`investor` show portfolio, else show a "Your access is pending" panel. (Defense in depth; RLS on investor data is the real boundary.)

The existing `/admin/*` routes already live under `_authenticated/` and check `has_role` server-side in every server fn — keep as is.

## 3. Database migration

Single migration:

1. `ALTER TYPE app_role ADD VALUE 'investor';`
2. `CREATE TABLE public.waitlist`:
   - `id uuid pk`, `name text`, `email citext unique`, `phone text`, `status text default 'pending' check in ('pending','approved','rejected')`, **`source text default 'website'`**, `notes text`, `approved_by uuid`, `approved_at timestamptz`, `created_at`, `updated_at`.
   - GRANTs: `INSERT` → `anon, authenticated`; `SELECT, UPDATE, DELETE` → `authenticated`; `ALL` → `service_role`.
   - RLS policies:
     - `INSERT` open to `anon`+`authenticated` (public submit).
     - `SELECT`/`UPDATE`/`DELETE` only `has_role(auth.uid(),'admin') OR has_role(auth.uid(),'staff')`.
3. `is_email_approved(_email text)` SECURITY DEFINER → `true` iff a `waitlist` row for that email is `approved`.
4. `prevent_unapproved_signups()` trigger `BEFORE INSERT ON auth.users`: raise exception unless `is_email_approved(NEW.email)` OR (no admin exists yet AND `NEW.email = 'aryanreshav8@gmail.com'`).
5. `assign_default_role()` trigger `AFTER INSERT ON auth.users`: insert `(NEW.id, 'investor')` into `user_roles` if the bootstrap trigger didn't already grant `admin`.
6. `touch_updated_at` trigger on `waitlist`.

## 4. Landing page (`src/routes/index.tsx`)

- Replace the second CTA: **"Already a customer? Sign in"** → `<Link to="/signin">`.
- Turn **Join Waitlist** into a button that opens `<WaitlistDialog />` (shadcn `Dialog`, fade+scale transitions).

## 5. Waitlist dialog

`src/components/waitlist-dialog.tsx`:
- `react-hook-form` + `zod`: `name` (2–80), `email` (valid), `phone` (10–15 digits).
- Calls public server fn `submitWaitlist({ name, email, phone })` — server fn hardcodes `source: 'website'` (never trust client). Uses the server publishable client; INSERT permitted by the open RLS policy.
- Duplicate email → "You're already on the list."
- On success: animated check + auto-close.

## 6. Sign-in (`src/routes/signin.tsx`)

Two tabs (shadcn `Tabs`):
- **Sign in**: email + password → `supabase.auth.signInWithPassword` → call `getMyRole()` → role-based redirect.
- **Create account**: full name + email + password → `supabase.auth.signUp({ options: { data: { full_name } } })`. The `prevent_unapproved_signups` trigger blocks it if email isn't approved; surface a friendly "This email hasn't been approved yet — join the waitlist first" with a button that opens the waitlist dialog.
- After signup: same role-based redirect (`assign_default_role` granted `investor`).

`src/routes/admin.login.tsx` → 301 to `/signin` (preserves old links).

## 7. Admin waitlist module

New route `src/routes/_authenticated/admin.waitlist.tsx`:
- Columns: **Name · Email · Phone · Source · Status · Created**.
- Filters: status (`all / pending / approved / rejected`) + source (`all / website / instagram / linkedin / referral / manual`) + search by name/email.
- Row actions: **Approve**, **Reject**, copy email. Mobile = card layout.

Server fns in `src/lib/admin/waitlist.functions.ts` (all `requireSupabaseAuth` + `has_role` check):
- `listWaitlist({ status?, source?, search? })`
- `setWaitlistStatus({ id, status })` — sets `approved_by = auth.uid()`, `approved_at = now()` when approving.

Updates:
- `src/components/admin/admin-nav.tsx` — add **Waitlist** link with pending-count badge.
- `src/lib/admin/dashboard.functions.ts` — return `pendingWaitlist` count.
- `src/routes/_authenticated/admin.index.tsx` — add **Pending Waitlist** KPI card.

## 8. Personalized header

`src/components/auth-pill.tsx`:
- `useEffect` mount gate (no SSR flicker).
- Subscribes to `supabase.auth.onAuthStateChange`; when signed in, fetches `profiles.full_name` from a server fn `getMyProfile()` (`requireSupabaseAuth`).
- Renders pill: `Hi, {full_name}` + dropdown with **Portfolio** (if role allows) and **Sign out**. Never hardcodes names.
- Mounted on `/`, `/home`, `/about` (top-right, doesn't disturb layout). On `/_authenticated/portfolio` it shows the same pill so the experience is continuous.

## 9. Security guarantees

- All authorization decisions happen server-side (`has_role`, RLS, `requireSupabaseAuth`, triggers).
- `prevent_unapproved_signups` enforces "no account without an approved waitlist row" at the database layer — cannot be bypassed by client tampering.
- Role assignment via DB triggers, never from the client.
- Portfolio data (future tables) will use RLS scoped by role/`auth.uid()` — the route gate is UX only.
- Client code never reads or branches on emails for authorization.

## Files

**New**
- `supabase/migrations/<ts>_waitlist_and_roles.sql`
- `src/components/waitlist-dialog.tsx`
- `src/components/auth-pill.tsx`
- `src/routes/signin.tsx`
- `src/routes/_authenticated/portfolio.tsx` (moved)
- `src/routes/_authenticated/admin.waitlist.tsx`
- `src/lib/admin/waitlist.functions.ts`
- `src/lib/public/waitlist.functions.ts` — `submitWaitlist`
- `src/lib/auth/role.functions.ts` — `getMyRole`, `getMyProfile`

**Edited**
- `src/routes/index.tsx` — CTA swap + waitlist dialog
- `src/routes/admin.login.tsx` — redirect to `/signin`
- `src/routes/_authenticated/route.tsx` — redirect target → `/signin`
- `src/components/admin/admin-nav.tsx` — Waitlist nav + badge
- `src/routes/_authenticated/admin.index.tsx` — Pending Waitlist KPI
- `src/lib/admin/dashboard.functions.ts` — include pending count
- `src/routes/home.tsx`, `src/routes/about.tsx` — mount `<AuthPill />`

**Deleted**
- `src/routes/portfolio.tsx` (replaced by protected version)

## Out of scope (Phase 2)

- Email notifications (admin on new lead; user on approval/rejection)
- Magic-link invites
- Captcha / rate limit on public waitlist submit
- Per-source attribution analytics dashboard
