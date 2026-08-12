import prisma from '@/lib/db';
import Link from 'next/link';
import DataTable from '@/components/admin/DataTable';
import { ContentStatus } from '@/app/generated/prisma/enums';
import { deleteCategoryAction } from '../actions/categories';
import { revalidatePath } from 'next/cache';
import { FolderOpen } from 'lucide-react';

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      parent: { select: { name: true } },
    }
  });

  const columns = [
    {
      header: 'Category',
      accessor: (cat: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center shrink-0">
            {cat.image ? (
              cat.image.startsWith('http') ? (
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover rounded-md border border-[--ch-border]" />
              ) : (
                <span className="text-2xl">{cat.image}</span>
              )
            ) : (
              <div className="w-full h-full rounded-md bg-[--ch-bg] flex items-center justify-center border border-[--ch-border]">
                <FolderOpen className="w-4 h-4 text-[--ch-text-muted]" />
              </div>
            )}
          </div>
          <div>
            <span className="font-semibold text-[--ch-text]">{cat.name}</span>
            {cat.parent && <div className="text-xs text-[--ch-text-muted]">Sub of: {cat.parent.name}</div>}
          </div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (cat: any) => (
        <span className={`badge ${cat.status === ContentStatus.PUBLISHED ? 'badge-emerald' : 'badge-neutral'}`}>
          {cat.status}
        </span>
      ),
    },
    {
      header: 'Featured',
      accessor: (cat: any) => (
        cat.isFeatured ? <span className="badge badge-purple">Featured</span> : null
      ),
    },
    {
      header: 'Actions',
      accessor: (cat: any) => (
        <div className="flex items-center gap-3">
          <Link href={`/admin/categories/${cat.id}`} className="text-emerald-500 hover:text-emerald-400 font-medium text-sm">
            Edit
          </Link>
          <form action={async () => {
            'use server';
            await deleteCategoryAction(cat.id);
            revalidatePath('/admin/categories');
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
        <h1 className="text-2xl font-bold text-[--ch-text]">Manage Categories</h1>
        <Link href="/admin/categories/new" className="btn-primary py-2 px-4 text-sm">
          + Add Category
        </Link>
      </div>

      <DataTable data={categories} columns={columns} emptyMessage="No categories found. Create one!" />
    </div>
  );
}
