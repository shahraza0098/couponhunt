'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { saveCategoryAction } from '../../actions/categories';
import { FormInput, FormSelect, FormTextarea, FormCheckbox } from '@/components/admin/FormElements';
import Link from 'next/link';

export default function CategoryForm({ category, parents }: { category?: any, parents: any[] }) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(saveCategoryAction, { error: '', success: false, redirect: '' });

  useEffect(() => {
    if (state?.success && state?.redirect) {
      router.push(state.redirect);
    }
  }, [state, router]);

  const isNew = !category;

  const parentOptions = parents
    .filter(p => p.id !== category?.id) // Cannot be its own parent
    .map(p => ({ value: p.id, label: p.name }));

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/admin/categories" className="text-sm text-[--ch-text-muted] hover:text-[--ch-text] mb-2 inline-block">
            &larr; Back to Categories
          </Link>
          <h1 className="text-2xl font-bold text-[--ch-text]">
            {isNew ? 'Create New Category' : `Edit ${category.name}`}
          </h1>
        </div>
      </div>

      <div className="bg-[--ch-surface] border border-[--ch-border] rounded-2xl p-6 sm:p-8">
        <form action={formAction} className="space-y-6">
          <input type="hidden" name="id" value={isNew ? 'new' : category.id} />
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <FormInput label="Category Name" name="name" defaultValue={category?.name} required placeholder="e.g. Electronics" />
            <FormInput label="Slug (URL friendly)" name="slug" defaultValue={category?.slug} required placeholder="e.g. electronics" />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <FormSelect
              label="Parent Category"
              name="parentId"
              defaultValue={category?.parentId || ''}
              options={parentOptions}
            />
            <div>
              <FormInput label="Icon / Image URL or Upload" name="existingImage" defaultValue={category?.image || ''} placeholder="Emoji (e.g. 💻) or URL" />
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-[--ch-text-muted]">Or upload:</span>
                <input type="file" name="image" accept="image/*" className="text-sm text-[--ch-text-muted]" />
              </div>
            </div>
          </div>

          <FormTextarea label="Description" name="description" defaultValue={category?.description} rows={3} />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <FormSelect
              label="Status"
              name="status"
              defaultValue={category?.status || 'PUBLISHED'}
              options={[
                { value: 'DRAFT', label: 'Draft' },
                { value: 'PUBLISHED', label: 'Published' },
              ]}
              required
            />
            
            <div className="space-y-4 mt-6">
              <FormCheckbox label="Featured Category" name="isFeatured" defaultChecked={category?.isFeatured} />
            </div>
          </div>

          {state?.error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl">
              <p className="text-sm text-rose-500 font-medium">{state.error}</p>
            </div>
          )}

          <div className="flex justify-end gap-4 pt-6 border-t border-[--ch-border]">
            <Link href="/admin/categories" className="btn-secondary py-2 px-6">
              Cancel
            </Link>
            <button type="submit" disabled={isPending} className="btn-primary py-2 px-6 disabled:opacity-50">
              {isPending ? 'Saving...' : 'Save Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
