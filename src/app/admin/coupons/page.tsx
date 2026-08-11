import prisma from '@/lib/db';
import Link from 'next/link';
import DataTable from '@/components/admin/DataTable';
import { ContentStatus } from '@/app/generated/prisma/enums';
import { deleteCouponAction } from '../actions/coupons';
import { revalidatePath } from 'next/cache';

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      store: { select: { name: true } },
    }
  });

  const columns = [
    {
      header: 'Coupon',
      accessor: (coupon: any) => (
        <div>
          <span className="font-semibold text-[--ch-text]">{coupon.title}</span>
          <div className="text-xs text-[--ch-text-muted]">{coupon.store.name}</div>
        </div>
      ),
    },
    {
      header: 'Code',
      accessor: (coupon: any) => (
        coupon.code ? (
          <span className="font-mono bg-[--ch-bg] px-2 py-1 rounded text-sm text-[--ch-text]">{coupon.code}</span>
        ) : (
          <span className="text-xs text-[--ch-text-faint]">No code</span>
        )
      ),
    },
    {
      header: 'Status',
      accessor: (coupon: any) => (
        <div className="flex flex-col gap-1 items-start">
          <span className={`badge ${coupon.status === ContentStatus.PUBLISHED ? 'badge-emerald' : 'badge-neutral'}`}>
            {coupon.status}
          </span>
          {coupon.isVerified && <span className="text-[10px] text-emerald-500 uppercase tracking-wide">Verified</span>}
        </div>
      ),
    },
    {
      header: 'Actions',
      accessor: (coupon: any) => (
        <div className="flex items-center gap-3">
          <Link href={`/admin/coupons/${coupon.id}`} className="text-emerald-500 hover:text-emerald-400 font-medium text-sm">
            Edit
          </Link>
          <form action={async () => {
            'use server';
            await deleteCouponAction(coupon.id);
            revalidatePath('/admin/coupons');
          }}>
            <button type="submit" className="text-rose-500 hover:text-rose-400 font-medium text-sm">
              Delete
            </button>
          </form>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[--ch-text]">Manage Coupons</h1>
        <Link href="/admin/coupons/new" className="btn-primary py-2 px-4 text-sm">
          + Add Coupon
        </Link>
      </div>

      <DataTable data={coupons} columns={columns} emptyMessage="No coupons found. Create one!" />
    </div>
  );
}
