## Final Plan — Admin Redirect Fix + Full `/admin/*` Role Gate

### Context (verified)

- `aryanreshav8@gmail.com` already has the `admin` role in `public.user_roles`.
- All four `auth.users` triggers are active (bootstrap admin, profile creator, waitlist gate, default investor).
- The waitlist gate already blocks unapproved signups at the database level.

The only bug is the post-signin redirect: `getMyRole` serverFn can 401 right after `signInWithPassword` because of a bearer-attachment race, so the `catch` falls through to `/home`. Plus `/admin/*` currently has no role guard.

### Changes

#### 1. `src/routes/signin.tsx` — explicit role-based routing

Replace `routeByRole` to query `user_roles` directly via the browser Supabase client (RLS policy `Users see own roles` already allows it; no serverFn / no bearer race):

```ts
async function routeByRole() {
  try {
    const { data: userRes } = await supabase.auth.getUser();
    const uid = userRes.user?.id;
    if (!uid) return navigate({ to: "/signin", replace: true });

    const { data, error } = await supabase
      .from("user_roles").select("role").eq("user_id", uid);
    if (error) throw error;
    const roles = (data ?? []).map(r => r.role as string);

    if (roles.includes("admin") || roles.includes("staff")) {
      navigate({ to: "/admin", replace: true });   // admin → /admin, staff → /admin
    } else if (roles.includes("investor")) {
      navigate({ to: "/home", replace: true });    // investor → /home
    } else {
      navigate({ to: "/signin", replace: true });  // unknown/no role → /signin
    }
  } catch {
    navigate({ to: "/signin", replace: true });
  }
}
```

Drop the now-unused `getMyRole` / `useServerFn` imports from this file. `getMyRole` itself stays available for other call sites.

#### 2. `src/routes/_authenticated/admin.tsx` — role gate covering ALL `/admin/*`

Add a client-side `beforeLoad` on the `/_authenticated/admin` layout route. Every admin child route (`/admin`, `/admin/investors`, `/admin/investors/$id`, `/admin/onboarding`, `/admin/payouts`, `/admin/funds`, `/admin/waitlist`, `/admin/documents/$id`, `/admin/settings`) is nested under this layout, so a single gate here protects the entire tree.

```ts
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: async () => {
    const { data: userRes } = await supabase.auth.getUser();
    const uid = userRes.user?.id;
    if (!uid) throw redirect({ to: "/signin" });
    const { data } = await supabase
      .from("user_roles").select("role").eq("user_id", uid);
    const roles = (data ?? []).map(r => r.role as string);
    if (roles.includes("admin") || roles.includes("staff")) return;
    if (roles.includes("investor")) throw redirect({ to: "/home" });
    throw redirect({ to: "/signin" });
  },
  component: AdminLayout,
});
```

The parent `_authenticated/route.tsx` is `ssr: false`, so this gate runs only in the browser where the session is available — no SSR redirect loops. RLS on every admin table remains the real enforcement boundary.

### Verification after edits

1. Sign in as `aryanreshav8@gmail.com` / `aryan@1416` → lands on `/admin`.
2. Sign up with an unapproved email → DB trigger fires, toast prompts "Join the waitlist".
3. Sign in as an investor → lands on `/home`; manually visiting `/admin/investors` (or any other `/admin/*` URL) bounces to `/home`.
4. Signed-out user visiting `/admin/anything` → `_authenticated` gate sends them to `/signin`.

### Files touched

- `src/routes/signin.tsx` — explicit role routing via direct Supabase query.
- `src/routes/_authenticated/admin.tsx` — `beforeLoad` role gate protecting all `/admin/*` children.

### Out of scope

- Auto-generated `src/integrations/supabase/*` files.
- Database changes (admin role + waitlist trigger already correct).
- Server-side role middleware (can revisit when more admin serverFns appear).