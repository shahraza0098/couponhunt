import prisma from '@/lib/db';
import { ContentStatus } from '@/app/generated/prisma/enums';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const [
    totalStores,
    publishedStores,
    totalCoupons,
    publishedCoupons,
    totalDeals,
    publishedDeals,
    totalCategories,
    recentClicks
  ] = await Promise.all([
    prisma.store.count(),
    prisma.store.count({ where: { status: ContentStatus.PUBLISHED } }),
    prisma.coupon.count(),
    prisma.coupon.count({ where: { status: ContentStatus.PUBLISHED } }),
    prisma.deal.count(),
    prisma.deal.count({ where: { status: ContentStatus.PUBLISHED } }),
    prisma.category.count(),
    prisma.click.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        store: { select: { name: true } },
        coupon: { select: { title: true } },
        deal: { select: { title: true } },
      },
    }),
  ]);

  const stats = [
    { name: 'Stores', total: totalStores, active: publishedStores, icon: '🏪', href: '/admin/stores' },
    { name: 'Coupons', total: totalCoupons, active: publishedCoupons, icon: '🎟️', href: '/admin/coupons' },
    { name: 'Deals', total: totalDeals, active: publishedDeals, icon: '🔥', href: '/admin/deals' },
    { name: 'Categories', total: totalCategories, active: totalCategories, icon: '📂', href: '/admin/categories' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[--ch-text]">Dashboard Overview</h1>
        <p className="mt-2 text-[--ch-text-muted]">Welcome to the CouponHunt Admin Panel.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="overflow-hidden rounded-2xl bg-[--ch-surface] border border-[--ch-border] p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="text-4xl">{stat.icon}</div>
              <div>
                <p className="text-sm font-medium text-[--ch-text-muted]">{stat.name}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-[--ch-text]">{stat.total}</p>
                  <p className="text-sm text-emerald-500">({stat.active} active)</p>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-[--ch-border]">
              <Link href={stat.href} className="text-sm font-medium text-emerald-500 hover:text-emerald-400">
                Manage {stat.name.toLowerCase()} &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="overflow-hidden rounded-2xl bg-[--ch-surface] border border-[--ch-border] shadow-sm">
        <div className="px-6 py-5 border-b border-[--ch-border]">
          <h3 className="text-lg font-medium leading-6 text-[--ch-text]">Recent Click Activity</h3>
        </div>
        <ul className="divide-y divide-[--ch-border]">
          {recentClicks.length === 0 ? (
            <li className="px-6 py-8 text-center text-sm text-[--ch-text-muted]">No clicks recorded yet.</li>
          ) : (
            recentClicks.map((click) => (
              <li key={click.id} className="px-6 py-4 hover:bg-[--ch-surface-hover]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[--ch-text]">
                      {click.targetType === 'COUPON' ? '🎟️ Coupon Click' : '🔥 Deal Click'}
                    </p>
                    <p className="text-xs text-[--ch-text-muted] mt-1">
                      {click.coupon?.title || click.deal?.title} at {click.store.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[--ch-text-faint] whitespace-nowrap">
                      {new Date(click.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
