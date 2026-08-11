'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { saveDealAction } from '../../actions/deals';
import { FormInput, FormSelect, FormTextarea, FormCheckbox } from '@/components/admin/FormElements';
import Link from 'next/link';

export default function DealForm({ deal, stores, categories }: { deal?: any, stores: any[], categories: any[] }) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(saveDealAction, { error: '', success: false, redirect: '' });

  useEffect(() => {
    if (state?.success && state?.redirect) {
      router.push(state.redirect);
    }
  }, [state, router]);

  const isNew = !deal;

  const storeOptions = stores.map(s => ({ value: s.id, label: s.name }));

  const formatDateForInput = (date: any) => {
    if (!date) return '';
    return new Date(date).toISOString().slice(0, 16); // YYYY-MM-DDThh:mm
  };

  const selectedCategoryIds = deal?.categories?.map((c: any) => c.categoryId) || [];

  return (
    <div className="max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/admin/deals" className="text-sm text-[--ch-text-muted] hover:text-[--ch-text] mb-2 inline-block">
            &larr; Back to Deals
          </Link>
          <h1 className="text-2xl font-bold text-[--ch-text]">
            {isNew ? 'Create New Deal' : `Edit Deal`}
          </h1>
        </div>
      </div>

      <div className="bg-[--ch-surface] border border-[--ch-border] rounded-2xl p-6 sm:p-8">
        <form action={formAction} className="space-y-6">
          <input type="hidden" name="id" value={isNew ? 'new' : deal.id} />
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <FormInput label="Deal Title" name="title" defaultValue={deal?.title} required placeholder="e.g. iPhone 15 Pro Max" />
            <FormInput label="Slug (URL friendly)" name="slug" defaultValue={deal?.slug} required placeholder="e.g. iphone-15-pro-max" />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <FormSelect
              label="Store"
              name="storeId"
              defaultValue={deal?.storeId || ''}
              options={storeOptions}
              required
            />
            <FormInput label="Product Name (Optional)" name="productName" defaultValue={deal?.productName} placeholder="e.g. Apple iPhone 15 Pro Max" />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <FormInput label="Product Image Upload" name="productImage" type="file" accept="image/*" />
              <input type="hidden" name="existingImage" value={deal?.productImage || ''} />
              {deal?.productImage && deal.productImage.startsWith('http') && (
                <div className="mt-2">
                  <img src={deal.productImage} alt="Preview" className="h-16 w-16 object-cover rounded-lg border border-[--ch-border]" />
                </div>
              )}
            </div>
            <FormInput label="Product URL (Where to buy)" name="productUrl" type="url" defaultValue={deal?.productUrl} placeholder="https://..." />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
            <FormInput label="Currency" name="currency" defaultValue={deal?.currency || 'INR'} />
            <FormInput label="Sale Price" name="salePrice" type="number" step="0.01" defaultValue={deal?.salePrice} required />
            <FormInput label="Original Price (MRP)" name="originalPrice" type="number" step="0.01" defaultValue={deal?.originalPrice} />
            <FormSelect
              label="Discount Type"
              name="discountType"
              defaultValue={deal?.discountType || ''}
              options={[
                { value: 'PERCENTAGE', label: 'Percentage (%)' },
                { value: 'FIXED_AMOUNT', label: 'Fixed Amount' },
              ]}
            />
          </div>

          <FormTextarea label="Description / Features" name="description" defaultValue={deal?.description} rows={3} />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <FormInput label="Available From" name="startsAt" type="datetime-local" defaultValue={formatDateForInput(deal?.startsAt)} />
            <FormInput label="Expires At" name="expiresAt" type="datetime-local" defaultValue={formatDateForInput(deal?.expiresAt)} />
          </div>

          <div className="pt-6 mt-6 border-t border-[--ch-border]">
            <label className="block text-sm font-medium text-[--ch-text-muted] mb-3">Categories</label>
            <div className="flex flex-wrap gap-4">
              {categories.map(cat => (
                <label key={cat.id} className="flex items-center gap-2 cursor-pointer bg-[--ch-bg] p-2 pr-4 rounded-lg border border-[--ch-border] hover:border-emerald-500/50 transition-colors">
                  <input
                    type="checkbox"
                    name="categoryIds"
                    value={cat.id}
                    defaultChecked={selectedCategoryIds.includes(cat.id)}
                    className="h-4 w-4 rounded border-[--ch-border] text-emerald-500 focus:ring-emerald-600"
                  />
                  <span className="text-sm font-medium text-[--ch-text]">{cat.image} {cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 pt-6 mt-6 border-t border-[--ch-border]">
            <FormSelect
              label="Status"
              name="status"
              defaultValue={deal?.status || 'PUBLISHED'}
              options={[
                { value: 'DRAFT', label: 'Draft' },
                { value: 'PUBLISHED', label: 'Published' },
                { value: 'EXPIRED', label: 'Expired' },
              ]}
              required
            />
            
            <div className="space-y-4 mt-6">
              <FormCheckbox label="Featured Deal" name="isFeatured" defaultChecked={deal?.isFeatured} />
            </div>
          </div>

          {state?.error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl">
              <p className="text-sm text-rose-500 font-medium">{state.error}</p>
            </div>
          )}

          <div className="flex justify-end gap-4 pt-6 border-t border-[--ch-border]">
            <Link href="/admin/deals" className="btn-secondary py-2 px-6">
              Cancel
            </Link>
            <button type="submit" disabled={isPending} className="btn-primary py-2 px-6 disabled:opacity-50">
              {isPending ? 'Saving...' : 'Save Deal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
