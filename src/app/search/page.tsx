import type { Metadata } from 'next';
import Link from 'next/link';
import { searchAll } from '@/lib/queries/search';
import StoreCard from '@/components/ui/StoreCard';
import CouponCard from '@/components/ui/CouponCard';
import DealCard from '@/components/ui/DealCard';
import EmptyState from '@/components/ui/EmptyState';
import { Search, Frown, Store as StoreIcon, Ticket, Flame } from 'lucide-react';

export async function generateMetadata({ searchParams }: PageProps<'/search'>): Promise<Metadata> {
  const params = await searchParams;
  const q = typeof params?.q === 'string' ? params.q : '';
  return {
    title: q ? `Search: ${q}` : 'Search',
    description: q ? `Search results for "${q}" on CouponHunt.` : 'Search for coupons, deals, and stores on CouponHunt.',
  };
}

export default async function SearchPage({ searchParams }: PageProps<'/search'>) {
  const params = await searchParams;
  const query = typeof params?.q === 'string' ? params.q : '';

  const results = await searchAll(query);
  const totalResults = results.stores.length + results.coupons.length + results.deals.length;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[--ch-text] flex items-center">
          <Search className="w-8 h-8 mr-3 text-emerald-500" /> {query ? `Results for "${query}"` : 'Search'}
        </h1>
        {query && (
          <p className="text-[--ch-text-muted] mt-2">
            {totalResults} {totalResults === 1 ? 'result' : 'results'} found
          </p>
        )}
      </div>

      {!query ? (
        <EmptyState
          icon={<Search className="w-16 h-16 text-emerald-500" />}
          title="Search for coupons, deals, and stores"
          description="Use the search bar above to find what you're looking for."
        />
      ) : totalResults === 0 ? (
        <EmptyState
          icon={<Frown className="w-16 h-16 text-[--ch-text-muted]" />}
          title={`No results for "${query}"`}
          description="Try a different search term or browse our categories."
        />
      ) : (
        <div className="space-y-12">
          {/* Stores */}
          {results.stores.length > 0 && (
            <section>
              <h2 className="section-title mb-4 flex items-center"><StoreIcon className="w-6 h-6 mr-2 text-emerald-500" /> Stores ({results.stores.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.stores.map((store) => (
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
          )}

          {/* Coupons */}
          {results.coupons.length > 0 && (
            <section>
              <h2 className="section-title mb-4 flex items-center"><Ticket className="w-6 h-6 mr-2 text-emerald-500" /> Coupons ({results.coupons.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {results.coupons.map((coupon) => (
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
            </section>
          )}

          {/* Deals */}
          {results.deals.length > 0 && (
            <section>
              <h2 className="section-title mb-4 flex items-center"><Flame className="w-6 h-6 mr-2 text-orange-500" /> Deals ({results.deals.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {results.deals.map((deal) => (
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
          )}
        </div>
      )}
    </div>
  );
}
