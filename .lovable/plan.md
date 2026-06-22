# PROFIRA Back Office — Lean Admin Dashboard

A focused internal admin panel under `/admin/*`, PROFIRA-branded, scoped so it never touches the public marketing site, prerender script, or Vercel config.

## 1. Backend (Lovable Cloud)

Single migration creates:

- `profiles` (id → auth.users, full_name, email, created_at) + signup trigger.
- `app_role` enum (`admin`, `staff`) + `user_roles` table + `has_role()` security-definer fn.
- `investor_status` enum (`pending`, `approved`, `active`, `inactive`).
- `investors` (id, full_name, phone, email, pan, amount, tenure_months, bank_account, ifsc, notes, status default `pending`, created_by, created_at).
- `funds` (id, name, aum, created_at) — one seed row.
- `payouts` (id, investor_id, amount, month `date`, status `pending`|`paid`, paid_at).
- `documents` (id, investor_id, kind `agreement`|`invoice`, serial_no, issued_at, payload jsonb).

All tables: GRANTs to `authenticated` + `service_role`, RLS enabled, policies require `has_role(auth.uid(),'admin') OR has_role(auth.uid(),'staff')` for SELECT/INSERT/UPDATE. First admin granted manually via Cloud SQL after first signup.

Server functions in `src/lib/admin/*.functions.ts` use `requireSupabaseAuth` + role check.

## 2. Routing (client-only, no prerender impact)

```
src/routes/admin.login.tsx                          /admin/login
src/routes/_authenticated/route.tsx                 ssr:false gate → /admin/login
src/routes/_authenticated/admin.tsx                 Topbar + Sidebar + <Outlet/>
src/routes/_authenticated/admin.index.tsx           /admin            dashboard
src/routes/_authenticated/admin.onboarding.tsx      onboarding form
src/routes/_authenticated/admin.investors.tsx       list + filters
src/routes/_authenticated/admin.investors.$id.tsx   investor detail
src/routes/_authenticated/admin.funds.tsx           simple list
src/routes/_authenticated/admin.payouts.tsx         list + Mark Paid
src/routes/_authenticated/admin.documents.$id.tsx   view + print
src/routes/_authenticated/admin.settings.tsx
```

`scripts/prerender.mjs`, `vercel.json`, `vite.config.ts`, and the public marketing routes are untouched.

## 3. PROFIRA branding (scoped to `.admin-scope`)

Tokens added to `src/styles.css` under `.admin-scope` only:

- `--background #070809`, `--surface #14151A`, `--primary #D61F3A`, `--foreground #FFFFFF`, `--muted-foreground #B8B8B8`, `--border` ≈ `#1F2024`.
- Font: Manrope via `<link>` in `__root.tsx` head; `--font-display: "Manrope", sans-serif` inside scope.
- Subtle elevation + `@utility glass-card` (backdrop-blur on `--surface`). No blue accents anywhere.

Shadcn components used throughout (Card, Button, Input, Form, Table, Sheet, Dropdown, Dialog, Badge, Sonner).

## 4. Modules

- **Dashboard** — 3 KPI cards (Total Funds Managed, Active Investors, Pending Payouts) + Recharts LineChart (Fund Growth, 12 months) + BarChart (Monthly Payouts). Aggregates via server fns.
- **Onboarding** — `react-hook-form` + `zod` (PAN `[A-Z]{5}[0-9]{4}[A-Z]`, IFSC `[A-Z]{4}0[A-Z0-9]{6}`, phone digits, amount/tenure numeric). Inserts investor with `status: 'pending'`; toast + redirect to detail page.
- **Investors list** — TanStack Table on `md:` and up, stacked cards below `md:`. Global search, status filter (`all`/`pending`/`approved`/`active`/`inactive`), column sort. Status shown as colored Badge.
- **Investor detail `/admin/investors/$id`** — primary management screen. Sections: profile, investment, notes (inline edit), documents (links to agreement + invoice), created date. Action buttons: Approve (pending→approved), Activate (approved→active), Mark Inactive, View Agreement, View Invoice. State-machine enforced server-side.
- **Funds** — minimal table: name, AUM, created. Add-fund dialog (admin only).
- **Payouts** — table: Investor, Amount, Month, Status badge, "Mark as Paid" action. Filter by status + month.
- **Documents `/admin/documents/$id`** — practical viewer. Two kinds:
  - *Agreement*: clean card layout with parties, terms, signature line, serial no, issued date (IST via `Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata' })`).
  - *Invoice*: line items, totals, serial no, issued date.
  - Single Print button (`window.print()`), print stylesheet hides chrome. No seals, no parchment, no PDF export.
- **Settings** — profile name (editable), email (read-only), Change Password (disabled placeholder with tooltip), Sign Out.

## 5. UX

- Sidebar: shadcn `Sidebar` collapsible icon rail on desktop, `Sheet` drawer on mobile via Topbar hamburger. Tabs: Dashboard, Onboarding, Investors, Funds, Payouts, Settings (no Documents/Complaints in nav — documents are reached from investor detail).
- Topbar: PROFIRA wordmark left; admin email + avatar dropdown (Sign out) right.
- All tables: search/filter bar, no horizontal scroll on mobile (auto-switch to cards).
- Toasts via Sonner. Light 150ms fade on route change.

## 6. Files

- Add: routes listed above; `src/components/admin/{Topbar,Sidebar,KpiCard,StatusBadge,InvestorTable,InvestorCard,AgreementView,InvoiceView,PrintButton}.tsx`; `src/lib/admin/{schemas.ts,*.functions.ts}`; `src/hooks/use-media-query.ts`.
- Edit: `src/styles.css` (add `.admin-scope` token block + glass utility), `src/routes/__root.tsx` (add Manrope `<link>` only).
- Migration: single SQL file for tables + enums + RLS + grants + has_role + signup trigger + funds seed row.
- Untouched: marketing routes, `scripts/prerender.mjs`, `vercel.json`, `vite.config.ts`, build scripts.

## 7. Out of scope (deferred to Phase 2)

Complaints, audit logs, 2FA, KYC uploads, file storage, PDF export, payment gateway, advanced fund management, CRM features.

## Approval

On approval: enable Lovable Cloud, run the migration, then build all routes and components in one pass.
