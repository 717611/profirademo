import { Outlet, createFileRoute } from "@tanstack/react-router";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { AdminNav } from "@/components/admin/admin-nav";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const { user } = Route.useRouteContext();
  return (
    <div className="admin-scope min-h-dvh">
      <AdminTopbar email={user?.email ?? null} />
      <div className="flex">
        <aside className="hidden w-64 shrink-0 border-r border-[#1F2024] md:block">
          <div className="sticky top-14 h-[calc(100dvh-3.5rem)] overflow-y-auto">
            <AdminNav />
          </div>
        </aside>
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
