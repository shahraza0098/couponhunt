import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCouponBySlug, getRelatedCoupons } from '@/lib/queries/coupons';
import { formatDiscount, formatCurrency, formatDate, isExpired } from '@/lib/utils/formatting';
import CopyCodeButton from '@/components/ui/CopyCodeButton';
import CountdownTimer from '@/components/ui/CountdownTimer';
import CouponCard from '@/components/ui/CouponCard';
import { Store as StoreIcon } from 'lucide-react';

export async function generateMetadata({ params }: PageProps<'/coupons/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const coupon = await getCouponBySlug(slug);
  if (!coupon) return { title: 'Coupon Not Found' };

  const discount = formatDiscount(coupon.discountType, coupon.discountValue ? Number(coupon.discountValue) : null);
  return {
    title: `${coupon.title} - ${coupon.store.name}`,
    description: coupon.description || `${discount} at ${coupon.store.name}. ${coupon.code ? `Use code: ${coupon.code}` : 'No code needed.'}`,
  };
}

export default async function CouponDetailPage({ params }: PageProps<'/coupons/[slug]'>) {
  const { slug } = await params;
  const coupon = await getCouponBySlug(slug);

  if (!coupon || coupon.status !== 'PUBLISHED') {
    notFound();
  }

  const expired = isExpired(coupon.expiresAt);
  const discount = formatDiscount(coupon.discountType, coupon.discountValue ? Number(coupon.discountValue) : null);
  const related = await getRelatedCoupons(coupon.id, coupon.storeId);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-[--ch-text-faint] mb-6">
            <Link href="/" className="hover:text-[--ch-text] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/coupons" className="hover:text-[--ch-text] transition-colors">Coupons</Link>
            <span>/</span>
            <span className="text-[--ch-text-muted] truncate">{coupon.title}</span>
          </nav>

          {/* Coupon detail card */}
          <div className="bg-[--ch-surface] border border-[--ch-border] rounded-2xl p-6 sm:p-8">
            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap mb-4">
              {coupon.isVerified && <span className="badge badge-emerald">✓ Verified</span>}
              {coupon.isFeatured && <span className="badge badge-purple">⭐ Featured</span>}
              {expired && <span className="badge badge-rose">Expired</span>}
              {!expired && coupon.expiresAt && <CountdownTimer expiresAt={coupon.expiresAt} />}
            </div>

            {/* Discount */}
            <div className="mb-2">
              <span className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                {discount}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-[--ch-text] mb-4">{coupon.title}</h1>

            {/* Store */}
            <Link
              href={`/stores/${coupon.store.slug}`}
              className="inline-flex items-center gap-3 mb-6 text-[--ch-text-muted] hover:text-[--ch-text] transition-colors"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-[--ch-bg] border border-[--ch-border]">
                {coupon.store.logo ? (
                  coupon.store.logo.startsWith('http') ? (
                    <img src={coupon.store.logo} alt={coupon.store.name} className="w-full h-full object-cover" />
                  ) : coupon.store.logo
                ) : (
                  <StoreIcon className="w-4 h-4 text-[--ch-text-muted]" />
                )}
              </div>
              <span className="font-medium">{coupon.store.name}</span>
            </Link>

            {/* Code */}
            {coupon.couponType === 'CODE' && coupon.code ? (
              <div className="mb-6">
                <CopyCodeButton
                  code={coupon.code}
                  maskedCode={coupon.code}
                  couponId={coupon.id}
                  storeId={coupon.storeId}
                />
              </div>
            ) : (
              <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
                <span className="text-emerald-400 font-semibold">No code needed — discount applied automatically</span>
              </div>
            )}

            {/* Description */}
            {coupon.description && (
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-[--ch-text] uppercase tracking-wider mb-2">Description</h2>
                <p className="text-[--ch-text-muted] leading-relaxed">{coupon.description}</p>
              </div>
            )}

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {coupon.minimumOrderValue && (
                <div className="p-3 bg-[--ch-bg] rounded-lg">
                  <div className="text-xs text-[--ch-text-faint] mb-1">Min. Order Value</div>
                  <div className="font-semibold text-[--ch-text]">{formatCurrency(Number(coupon.minimumOrderValue))}</div>
                </div>
              )}
              {coupon.maximumDiscount && (
                <div className="p-3 bg-[--ch-bg] rounded-lg">
                  <div className="text-xs text-[--ch-text-faint] mb-1">Max Discount</div>
                  <div className="font-semibold text-[--ch-text]">{formatCurrency(Number(coupon.maximumDiscount))}</div>
                </div>
              )}
              {coupon.startsAt && (
                <div className="p-3 bg-[--ch-bg] rounded-lg">
                  <div className="text-xs text-[--ch-text-faint] mb-1">Valid From</div>
                  <div className="font-semibold text-[--ch-text]">{formatDate(coupon.startsAt)}</div>
                </div>
              )}
              {coupon.expiresAt && (
                <div className="p-3 bg-[--ch-bg] rounded-lg">
                  <div className="text-xs text-[--ch-text-faint] mb-1">Expires</div>
                  <div className="font-semibold text-[--ch-text]">{formatDate(coupon.expiresAt)}</div>
                </div>
              )}
            </div>

            {/* Verification */}
            {coupon.isVerified && coupon.verifiedAt && (
              <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg text-sm">
                <span className="text-emerald-400">✓ Verified on {formatDate(coupon.verifiedAt)}</span>
              </div>
            )}

            {/* Categories */}
            {coupon.categories.length > 0 && (
              <div className="mt-6 flex gap-2 flex-wrap">
                {coupon.categories.map((cc) => (
                  <Link key={cc.category.id} href={`/categories/${cc.category.slug}`} className="badge badge-neutral hover:badge-purple transition-colors">
                    {cc.category.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          {/* Store card */}
          <div className="bg-[--ch-surface] border border-[--ch-border] rounded-2xl p-6 mb-6">
            <h3 className="text-sm font-semibold text-[--ch-text] uppercase tracking-wider mb-4">About {coupon.store.name}</h3>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-[--ch-bg] border border-[--ch-border]">
                {coupon.store.logo ? (
                  coupon.store.logo.startsWith('http') ? (
                    <img src={coupon.store.logo} alt={coupon.store.name} className="w-full h-full object-cover" />
                  ) : coupon.store.logo
                ) : (
                  <StoreIcon className="w-6 h-6 text-[--ch-text-muted]" />
                )}
              </div>
              <span className="font-semibold text-[--ch-text]">{coupon.store.name}</span>
            </div>
            {coupon.store.shortDescription && (
              <p className="text-sm text-[--ch-text-muted] mb-4">{coupon.store.shortDescription}</p>
            )}
            <Link href={`/stores/${coupon.store.slug}`} className="btn-secondary w-full text-center text-sm">
              View All {coupon.store.name} Offers
            </Link>
          </div>

          {/* Related coupons */}
          {related.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-[--ch-text] uppercase tracking-wider mb-4">
                More from {coupon.store.name}
              </h3>
              <div className="space-y-3">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    href={`/coupons/${r.slug}`}
                    className="block bg-[--ch-surface] border border-[--ch-border] rounded-xl p-4 hover:bg-[--ch-surface-hover] transition-colors"
                  >
                    <div className="font-medium text-[--ch-text] text-sm line-clamp-2">{r.title}</div>
                    <div className="text-xs text-emerald-400 mt-1">
                      {formatDiscount(r.discountType, r.discountValue ? Number(r.discountValue) : null)}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
