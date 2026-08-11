'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: '📊' },
  { name: 'Stores', href: '/admin/stores', icon: '🏪' },
  { name: 'Categories', href: '/admin/categories', icon: '📂' },
  { name: 'Coupons', href: '/admin/coupons', icon: '🎟️' },
  { name: 'Deals', href: '/admin/deals', icon: '🔥' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-[--ch-surface] border-r border-[--ch-border]">
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-[--ch-border]">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="text-2xl">🎫</span>
          <span className="text-lg font-bold text-[--ch-text] tracking-tight">Admin</span>
        </Link>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto">
        <nav className="flex-1 space-y-1 px-4 py-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'text-[--ch-text-muted] hover:bg-[--ch-surface-hover] hover:text-[--ch-text]'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
