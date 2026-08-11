import prisma from '@/lib/db';
import Link from 'next/link';
import DataTable from '@/components/admin/DataTable';
import { ContentStatus } from '@/app/generated/prisma/enums';
import { deleteDealAction } from '../actions/deals';
import { revalidatePath } from 'next/cache';

export default async function AdminDealsPage() {
  const deals = await prisma.deal.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      store: { select: { name: true } },
    }
  });

  const columns = [
    {
      header: 'Deal',
      accessor: (deal: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-[--ch-bg] shrink-0 border border-[--ch-border]">
            {deal.productImage ? (
               deal.productImage.startsWith('http') ? (
                 <img src={deal.productImage} alt={deal.title} className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-xl">{deal.productImage}</div>
               )
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xl">🔥</div>
            )}
          </div>
          <div>
            <span className="font-semibold text-[--ch-text]">{deal.title}</span>
            <div className="text-xs text-[--ch-text-muted]">{deal.store.name}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Price',
      accessor: (deal: any) => (
        deal.salePrice ? (
          <div>
            <span className="font-bold text-emerald-500">{deal.currency} {Number(deal.salePrice).toLocaleString()}</span>
            {deal.originalPrice && (
              <span className="text-xs text-[--ch-text-faint] line-through ml-2">{deal.currency} {Number(deal.originalPrice).toLocaleString()}</span>
            )}
          </div>
        ) : (
          <span className="text-xs text-[--ch-text-faint]">-</span>
        )
      ),
    },
    {
      header: 'Status',
      accessor: (deal: any) => (
        <span className={`badge ${deal.status === ContentStatus.PUBLISHED ? 'badge-emerald' : 'badge-neutral'}`}>
          {deal.status}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: (deal: any) => (
        <div className="flex items-center gap-3">
          <Link href={`/admin/deals/${deal.id}`} className="text-emerald-500 hover:text-emerald-400 font-medium text-sm">
            Edit
          </Link>
          <form action={async () => {
            'use server';
            await deleteDealAction(deal.id);
            revalidatePath('/admin/deals');
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
        <h1 className="text-2xl font-bold text-[--ch-text]">Manage Deals</h1>
        <Link href="/admin/deals/new" className="btn-primary py-2 px-4 text-sm">
          + Add Deal
        </Link>
      </div>

      <DataTable data={deals} columns={columns} emptyMessage="No deals found. Create one!" />
    </div>
  );
}
