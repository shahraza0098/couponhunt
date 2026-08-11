import type { Metadata } from 'next';
import { getAllCoupons } from '@/lib/queries/coupons';
import CouponCard from '@/components/ui/CouponCard';
import Pagination from '@/components/ui/Pagination';
import EmptyState from '@/components/ui/EmptyState';

export const metadata: Metadata = {
  title: 'All Coupons & Promo Codes',
  description: 'Browse all verified coupons and promo codes. Find the best discounts from Amazon, Flipkart, Myntra, Swiggy, and more.',
};

export default async function CouponsPage({ searchParams }: PageProps<'/coupons'>) {
  const params = await searchParams;
  const page = Number(params?.page) || 1;

  const { coupons, totalPages, currentPage, total } = await getAllCoupons({ page });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[--ch-text]">🎟️ All Coupons & Promo Codes</h1>
        <p className="text-[--ch-text-muted] mt-2">
          {total} verified coupons and promo codes available
        </p>
      </div>

      {coupons.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-grid">
            {coupons.map((coupon) => (
              <CouponCard
                key={coupon.id}
                id={coupon.id}
                title={coupon.title}
                slug={coupon.slug}
                code={coupon.code}
                couponType={coupon.couponType}
                discountType={coupon.discountType}
                discountValue={coupon.discountValue ? Number(coupon.discountValue) : null}
                expiresAt={coupon.expiresAt}
                isVerified={coupon.isVerified}
                isFeatured={coupon.isFeatured}
                clickCount={coupon.clickCount}
                storeName={coupon.store.name}
                storeSlug={coupon.store.slug}
                storeLogo={coupon.store.logo}
                storeId={coupon.storeId}
              />
            ))}
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/coupons" />
        </>
      ) : (
        <EmptyState icon="🎟️" title="No coupons available" description="Check back later for new coupons and promo codes." />
      )}
    </div>
  );
}
