import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getStoreBySlug, getStoreCoupons, getStoreDeals } from '@/lib/queries/stores';
import CouponCard from '@/components/ui/CouponCard';
import DealCard from '@/components/ui/DealCard';
import EmptyState from '@/components/ui/EmptyState';

export async function generateMetadata({ params }: PageProps<'/stores/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);
  if (!store) return { title: 'Store Not Found' };

  return {
    title: store.metaTitle || `${store.name} Coupons & Deals`,
    description: store.metaDescription || store.shortDescription || `Find the best coupons and deals from ${store.name}.`,
  };
}

export default async function StoreDetailPage({ params }: PageProps<'/stores/[slug]'>) {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);

  if (!store || store.status !== 'PUBLISHED') {
    notFound();
  }

  const [coupons, deals] = await Promise.all([
    getStoreCoupons(store.id),
    getStoreDeals(store.id),
  ]);

  return (
    <div className="animate-fade-in">
      {/* Store Header */}
      <section className="bg-[--ch-bg-alt] border-b border-[--ch-border]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-2xl bg-[--ch-surface] border border-[--ch-border] flex items-center justify-center text-4xl shrink-0">
              {store.logo || '🏪'}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-[--ch-text]">{store.name}</h1>
              {store.shortDescription && (
                <p className="text-[--ch-text-muted] mt-2 max-w-2xl">{store.shortDescription}</p>
              )}

              <div className="flex items-center gap-4 mt-4 flex-wrap">
                <span className="badge badge-emerald">🎟️ {store._count.coupons} Coupons</span>
                <span className="badge badge-amber">🔥 {store._count.deals} Deals</span>
                {store.websiteUrl && (
                  <a
                    href={store.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    Visit Website →
                  </a>
                )}
              </div>

              {/* Categories */}
              {store.categories.length > 0 && (
                <div className="flex gap-2 mt-4 flex-wrap">
                  {store.categories.map((sc) => (
                    <Link
                      key={sc.category.id}
                      href={`/categories/${sc.category.slug}`}
                      className="badge badge-neutral hover:badge-purple transition-colors"
                    >
                      {sc.category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {store.description && (
            <div className="mt-8 text-sm text-[--ch-text-muted] leading-relaxed max-w-4xl">
              {store.description}
            </div>
          )}
        </div>
      </section>

      {/* Coupons */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10" id="store-coupons">
        <h2 className="section-title mb-6">🎟️ Coupons from {store.name}</h2>
        {coupons.length > 0 ? (
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
        ) : (
          <EmptyState icon="🎟️" title="No active coupons" description={`${store.name} doesn't have any active coupons right now. Check back later!`} />
        )}
      </section>

      {/* Deals */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10" id="store-deals">
        <h2 className="section-title mb-6">🔥 Deals from {store.name}</h2>
        {deals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-grid">
            {deals.map((deal) => (
              <DealCard
                key={deal.id}
                id={deal.id}
                title={deal.title}
                slug={deal.slug}
                productName={deal.productName}
                productImage={deal.productImage}
                originalPrice={deal.originalPrice ? Number(deal.originalPrice) : null}
                salePrice={deal.salePrice ? Number(deal.salePrice) : null}
                currency={deal.currency}
                discountType={deal.discountType}
                discountValue={deal.discountValue ? Number(deal.discountValue) : null}
                expiresAt={deal.expiresAt}
                isFeatured={deal.isFeatured}
                clickCount={deal.clickCount}
                storeName={deal.store.name}
                storeSlug={deal.store.slug}
                storeLogo={deal.store.logo}
                storeId={deal.storeId}
              />
            ))}
          </div>
        ) : (
          <EmptyState icon="🔥" title="No active deals" description={`${store.name} doesn't have any active deals right now.`} />
        )}
      </section>
    </div>
  );
}
