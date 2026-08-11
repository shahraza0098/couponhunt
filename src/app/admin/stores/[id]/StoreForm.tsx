'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { saveStoreAction } from '../../actions/stores';
import { FormInput, FormSelect, FormTextarea, FormCheckbox } from '@/components/admin/FormElements';
import Link from 'next/link';

export default function StoreFormPage({ store }: { store?: any }) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(saveStoreAction, { error: '', success: false, redirect: '' });

  useEffect(() => {
    if (state?.success && state?.redirect) {
      router.push(state.redirect);
    }
  }, [state, router]);

  const isNew = !store;

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/admin/stores" className="text-sm text-[--ch-text-muted] hover:text-[--ch-text] mb-2 inline-block">
            &larr; Back to Stores
          </Link>
          <h1 className="text-2xl font-bold text-[--ch-text]">
            {isNew ? 'Create New Store' : `Edit ${store.name}`}
          </h1>
        </div>
      </div>

      <div className="bg-[--ch-surface] border border-[--ch-border] rounded-2xl p-6 sm:p-8">
        <form action={formAction} className="space-y-6">
          <input type="hidden" name="id" value={isNew ? 'new' : store.id} />
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <FormInput label="Store Name" name="name" defaultValue={store?.name} required placeholder="e.g. Amazon India" />
            <FormInput label="Slug (URL friendly)" name="slug" defaultValue={store?.slug} required placeholder="e.g. amazon-india" />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <FormInput label="Logo Upload" name="logo" type="file" accept="image/*" />
              {store?.logo && (
                <div className="mt-2 flex items-center gap-4">
                  <img src={store.logo} alt="Logo" className="h-12 w-12 object-contain bg-white rounded-lg p-1" />
                  <input type="hidden" name="existingLogo" value={store.logo} />
                </div>
              )}
            </div>
            <div>
              <FormInput label="Banner Upload" name="bannerImage" type="file" accept="image/*" />
              {store?.bannerImage && (
                <div className="mt-2">
                  <img src={store.bannerImage} alt="Banner" className="h-12 w-24 object-cover rounded-lg" />
                  <input type="hidden" name="existingBanner" value={store.bannerImage} />
                </div>
              )}
            </div>
          </div>

          <FormInput label="Website URL" name="websiteUrl" type="url" defaultValue={store?.websiteUrl} placeholder="https://..." />

          <FormTextarea label="Short Description" name="shortDescription" defaultValue={store?.shortDescription} rows={2} />
          <FormTextarea label="Full Description" name="description" defaultValue={store?.description} rows={5} />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <FormSelect
              label="Status"
              name="status"
              defaultValue={store?.status || 'DRAFT'}
              options={[
                { value: 'DRAFT', label: 'Draft' },
                { value: 'PUBLISHED', label: 'Published' },
              ]}
              required
            />
            
            <div className="space-y-4 mt-6">
              <FormCheckbox label="Featured Store" name="isFeatured" defaultChecked={store?.isFeatured} />
              <FormCheckbox label="Popular Store" name="isPopular" defaultChecked={store?.isPopular} />
            </div>
          </div>

          {state?.error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl">
              <p className="text-sm text-rose-500 font-medium">{state.error}</p>
            </div>
          )}

          <div className="flex justify-end gap-4 pt-6 border-t border-[--ch-border]">
            <Link href="/admin/stores" className="btn-secondary py-2 px-6">
              Cancel
            </Link>
            <button type="submit" disabled={isPending} className="btn-primary py-2 px-6 disabled:opacity-50">
              {isPending ? 'Saving...' : 'Save Store'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
