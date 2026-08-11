import prisma from '@/lib/db';
import Link from 'next/link';
import DataTable from '@/components/admin/DataTable';
import { ContentStatus } from '@/app/generated/prisma/enums';
import { deleteStoreAction } from '../actions/stores';
import { revalidatePath } from 'next/cache';

export default async function AdminStoresPage() {
  const stores = await prisma.store.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const columns = [
    {
      header: 'Store',
      accessor: (store: any) => (
        <div className="flex items-center gap-3">
          {store.logo ? (
            <img src={store.logo} alt={store.name} className="w-8 h-8 rounded-full bg-[--ch-bg] object-cover" />
          ) : (
            <span className="text-2xl">🏪</span>
          )}
          <span className="font-semibold text-[--ch-text]">{store.name}</span>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (store: any) => (
        <span className={`badge ${store.status === ContentStatus.PUBLISHED ? 'badge-emerald' : 'badge-neutral'}`}>
          {store.status}
        </span>
      ),
    },
    {
      header: 'Featured',
      accessor: (store: any) => (
        store.isFeatured ? <span className="badge badge-purple">Featured</span> : null
      ),
    },
    {
      header: 'Actions',
      accessor: (store: any) => (
        <div className="flex items-center gap-3">
          <Link href={`/admin/stores/${store.id}`} className="text-emerald-500 hover:text-emerald-400 font-medium text-sm">
            Edit
          </Link>
          <form action={async () => {
            'use server';
            await deleteStoreAction(store.id);
            revalidatePath('/admin/stores');
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
        <h1 className="text-2xl font-bold text-[--ch-text]">Manage Stores</h1>
        <Link href="/admin/stores/new" className="btn-primary py-2 px-4 text-sm">
          + Add Store
        </Link>
      </div>

      <DataTable data={stores} columns={columns} emptyMessage="No stores found. Create one!" />
    </div>
  );
}
