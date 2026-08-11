import Link from 'next/link';
import { getPopularStores } from '@/lib/queries/stores';
import { getFeaturedCoupons } from '@/lib/queries/coupons';
import { getFeaturedDeals } from '@/lib/queries/deals';
import { getFeaturedCategories } from '@/lib/queries/categories';
import StoreCard from '@/components/ui/StoreCard';
import CouponCard from '@/components/ui/CouponCard';
import DealCard from '@/components/ui/DealCard';
import CategoryCard from '@/components/ui/CategoryCard';

export default async function HomePage() {
  const [stores, coupons, deals, categories] = await Promise.all([
    getPopularStores(12),
    getFeaturedCoupons(8),
    getFeaturedDeals(8),
    getFeaturedCategories(8),
  ]);

  return (
    <div className="animate-fade-in">
      {/* ======================== HERO ======================== */}
      <section
        className="relative overflow-hidden"
        style={{ background: 'var(--ch-gradient-hero)' }}
        id="hero"
      >
        {/* Decorative gradient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6 animate-slide-up">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-sm text-emerald-400 font-medium">
              {coupons.length + deals.length}+ active offers today
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[--ch-text] mb-6 animate-slide-up">
            Hunt the Best{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
              Coupons & Deals
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-[--ch-text-muted] max-w-2xl mx-auto mb-10 animate-slide-up">
            Discover verified promo codes, exclusive discounts, and hot deals from top Indian stores. Save money on every purchase.
          </p>

          <div className="flex items-center justify-center gap-4 animate-slide-up">
            <Link href="/coupons" className="btn-primary text-base px-8 py-3">
              🎟️ Browse Coupons
            </Link>
            <Link href="/deals" className="btn-secondary text-base px-8 py-3">
              🔥 View Deals
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-14 grid grid-cols-3 gap-8 max-w-lg mx-auto animate-slide-up">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-[--ch-text]">{stores.length}+</div>
              <div className="text-sm text-[--ch-text-muted]">Stores</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-emerald-400">{coupons.length}+</div>
              <div className="text-sm text-[--ch-text-muted]">Coupons</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-amber-400">{deals.length}+</div>
              <div className="text-sm text-[--ch-text-muted]">Deals</div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================== POPULAR STORES ======================== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16" id="popular-stores">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-title">🏪 Popular Stores</h2>
            <p className="section-subtitle">Top brands with the best offers</p>
          </div>
          <Link href="/stores" className="btn-secondary text-sm">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-grid">
          {stores.map((store) => (
            <StoreCard
              key={store.id}
              name={store.name}
              slug={store.slug}
              logo={store.logo}
              shortDescription={store.shortDescription}
              couponCount={store._count.coupons}
              dealCount={store._count.deals}
            />
          ))}
        </div>
      </section>

      {/* ======================== FEATURED COUPONS ======================== */}
      <section className="bg-[--ch-bg-alt] border-y border-[--ch-border]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16" id="featured-coupons">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title">🎟️ Featured Coupons</h2>
              <p className="section-subtitle">Verified coupon codes and promo codes</p>
            </div>
            <Link href="/coupons" className="btn-secondary text-sm">
              View All →
            </Link>
          </div>

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
        </div>
      </section>

      {/* ======================== HOT DEALS ======================== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16" id="hot-deals">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-title">🔥 Hot Deals</h2>
            <p className="section-subtitle">Best prices on top products</p>
          </div>
          <Link href="/deals" className="btn-secondary text-sm">
            View All →
          </Link>
        </div>

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
      </section>

      {/* ======================== BROWSE BY CATEGORY ======================== */}
      <section className="bg-[--ch-bg-alt] border-y border-[--ch-border]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16" id="categories">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title">📂 Browse by Category</h2>
              <p className="section-subtitle">Find offers in your favourite categories</p>
            </div>
            <Link href="/categories" className="btn-secondary text-sm">
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 stagger-grid">
            {categories.map((cat) => (
              <CategoryCard
                key={cat.id}
                name={cat.name}
                slug={cat.slug}
                image={cat.image}
                couponCount={cat._count.coupons}
                dealCount={cat._count.deals}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ======================== CTA / VALUE PROP ======================== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20" id="value-prop">
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500/10 via-[--ch-surface] to-purple-500/10 border border-[--ch-border] rounded-3xl p-10 sm:p-14 text-center">
          <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />

          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-bold text-[--ch-text] mb-4">
              Never Pay Full Price Again
            </h2>
            <p className="text-lg text-[--ch-text-muted] max-w-xl mx-auto mb-8">
              CouponHunt helps you find the best coupons and deals from trusted Indian stores. All offers are verified and updated daily.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="p-4">
                <div className="text-3xl mb-2">✅</div>
                <h3 className="font-semibold text-[--ch-text] mb-1">Verified Offers</h3>
                <p className="text-sm text-[--ch-text-muted]">Every coupon is tested and verified before listing</p>
              </div>
              <div className="p-4">
                <div className="text-3xl mb-2">⚡</div>
                <h3 className="font-semibold text-[--ch-text] mb-1">Always Updated</h3>
                <p className="text-sm text-[--ch-text-muted]">New deals and coupons added daily</p>
              </div>
              <div className="p-4">
                <div className="text-3xl mb-2">💰</div>
                <h3 className="font-semibold text-[--ch-text] mb-1">Maximum Savings</h3>
                <p className="text-sm text-[--ch-text-muted]">Find the best discounts across all categories</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
