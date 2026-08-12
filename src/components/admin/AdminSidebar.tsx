'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { LayoutDashboard, Store, FolderOpen, Ticket, Flame } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Stores', href: '/admin/stores', icon: Store },
  { name: 'Categories', href: '/admin/categories', icon: FolderOpen },
  { name: 'Coupons', href: '/admin/coupons', icon: Ticket },
  { name: 'Deals', href: '/admin/deals', icon: Flame },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-[--ch-surface] shadow-xl z-20 relative">
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-[--ch-border]">
        <Link href="/admin" className="flex items-center gap-2 text-emerald-500">
          <Ticket className="w-8 h-8" />
          <span className="text-lg font-bold text-[--ch-text] tracking-tight">Admin</span>
        </Link>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto">
        <nav className="flex-1 space-y-1 px-4 py-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            const Icon = item.icon;
            
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
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
