import AdminSidebar from '@/components/admin/AdminSidebar';
import { logoutAction } from '@/app/admin/actions/auth';

export const metadata = {
  title: 'Admin Dashboard | CouponHunt',
  robots: 'noindex, nofollow',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[--ch-bg] overflow-hidden">
      {/* Sidebar */}
      <div className="hidden lg:flex lg:w-72 lg:flex-col">
        <AdminSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-[--ch-border] bg-[--ch-surface] px-6">
          <div className="flex items-center gap-4 lg:hidden">
            <span className="text-xl font-bold">Admin</span>
          </div>
          <div className="flex flex-1 justify-end gap-4">
            <form action={logoutAction}>
              <button type="submit" className="text-sm font-medium text-[--ch-text-muted] hover:text-rose-400 transition-colors">
                Log out
              </button>
            </form>
          </div>
        </header>

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto bg-[--ch-bg] p-6 lg:p-8">
          <div className="mx-auto max-w-6xl animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
