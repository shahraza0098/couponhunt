'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { saveCouponAction } from '../../actions/coupons';
import { FormInput, FormSelect, FormTextarea, FormCheckbox } from '@/components/admin/FormElements';
import Link from 'next/link';

export default function CouponForm({ coupon, stores, categories }: { coupon?: any, stores: any[], categories: any[] }) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(saveCouponAction, { error: '', success: false, redirect: '' });

  useEffect(() => {
    if (state?.success && state?.redirect) {
      router.push(state.redirect);
    }
  }, [state, router]);

  const isNew = !coupon;

  const storeOptions = stores.map(s => ({ value: s.id, label: s.name }));

  const formatDateForInput = (date: any) => {
    if (!date) return '';
    return new Date(date).toISOString().slice(0, 16); // YYYY-MM-DDThh:mm
  };

  const selectedCategoryIds = coupon?.categories?.map((c: any) => c.categoryId) || [];

  return (
    <div className="max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/admin/coupons" className="text-sm text-[--ch-text-muted] hover:text-[--ch-text] mb-2 inline-block">
            &larr; Back to Coupons
          </Link>
          <h1 className="text-2xl font-bold text-[--ch-text]">
            {isNew ? 'Create New Coupon' : `Edit Coupon`}
          </h1>
        </div>
      </div>

      <div className="bg-[--ch-surface] border border-[--ch-border] rounded-2xl p-6 sm:p-8">
        <form action={formAction} className="space-y-6">
          <input type="hidden" name="id" value={isNew ? 'new' : coupon.id} />
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <FormInput label="Coupon Title" name="title" defaultValue={coupon?.title} required placeholder="e.g. 50% Off Electronics" />
            <FormInput label="Slug (URL friendly)" name="slug" defaultValue={coupon?.slug} required placeholder="e.g. 50-off-electronics" />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <FormSelect
              label="Store"
              name="storeId"
              defaultValue={coupon?.storeId || ''}
              options={storeOptions}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <FormSelect
                label="Coupon Type"
                name="couponType"
                defaultValue={coupon?.couponType || 'CODE'}
                options={[
                  { value: 'CODE', label: 'Promo Code' },
                  { value: 'NO_CODE', label: 'No Code (Auto applied)' },
                ]}
                required
              />
              <FormInput label="Coupon Code" name="code" defaultValue={coupon?.code} placeholder="e.g. SAVE50" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <FormSelect
              label="Discount Type"
              name="discountType"
              defaultValue={coupon?.discountType || ''}
              options={[
                { value: 'PERCENTAGE', label: 'Percentage (%)' },
                { value: 'FIXED_AMOUNT', label: 'Fixed Amount' },
                { value: 'FREE_SHIPPING', label: 'Free Shipping' },
                { value: 'CASHBACK', label: 'Cashback' },
                { value: 'BOGO', label: 'Buy 1 Get 1' },
              ]}
            />
            <FormInput label="Discount Value" name="discountValue" type="number" step="0.01" defaultValue={coupon?.discountValue} placeholder="e.g. 50" />
            <FormInput label="Min. Order Value" name="minimumOrderValue" type="number" step="0.01" defaultValue={coupon?.minimumOrderValue} placeholder="e.g. 1000" />
          </div>

          <FormTextarea label="Description / Terms" name="description" defaultValue={coupon?.description} rows={3} />
          <FormInput label="Destination URL (Optional)" name="couponUrl" type="url" defaultValue={coupon?.couponUrl} placeholder="https://..." />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <FormInput label="Valid From" name="startsAt" type="datetime-local" defaultValue={formatDateForInput(coupon?.startsAt)} />
            <FormInput label="Expires At" name="expiresAt" type="datetime-local" defaultValue={formatDateForInput(coupon?.expiresAt)} />
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
              defaultValue={coupon?.status || 'PUBLISHED'}
              options={[
                { value: 'DRAFT', label: 'Draft' },
                { value: 'PUBLISHED', label: 'Published' },
                { value: 'EXPIRED', label: 'Expired' },
              ]}
              required
            />
            
            <div className="space-y-4 mt-6">
              <FormCheckbox label="Featured Coupon" name="isFeatured" defaultChecked={coupon?.isFeatured} />
              <FormCheckbox label="Verified Working" name="isVerified" defaultChecked={coupon?.isVerified} />
            </div>
          </div>

          {state?.error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl">
              <p className="text-sm text-rose-500 font-medium">{state.error}</p>
            </div>
          )}

          <div className="flex justify-end gap-4 pt-6 border-t border-[--ch-border]">
            <Link href="/admin/coupons" className="btn-secondary py-2 px-6">
              Cancel
            </Link>
            <button type="submit" disabled={isPending} className="btn-primary py-2 px-6 disabled:opacity-50">
              {isPending ? 'Saving...' : 'Save Coupon'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
