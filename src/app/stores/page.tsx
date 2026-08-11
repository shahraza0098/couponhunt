import type { Metadata } from 'next';
import { getAllStores } from '@/lib/queries/stores';
import StoreCard from '@/components/ui/StoreCard';
import Pagination from '@/components/ui/Pagination';
import EmptyState from '@/components/ui/EmptyState';

export const metadata: Metadata = {
  title: 'All Stores',
  description: 'Browse all stores with coupons and deals on CouponHunt. Find offers from Amazon, Flipkart, Myntra, Swiggy, and more.',
};

export default async function StoresPage({ searchParams }: PageProps<'/stores'>) {
  const params = await searchParams;
  const page = Number(params?.page) || 1;
  const search = typeof params?.search === 'string' ? params.search : undefined;

  const { stores, totalPages, currentPage } = await getAllStores({ page, search });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[--ch-text]">🏪 All Stores</h1>
        <p className="text-[--ch-text-muted] mt-2">
          Browse {stores.length}+ stores with active coupons and deals
        </p>
      </div>

      {/* Store grid */}
      {stores.length > 0 ? (
        <>
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
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath="/stores"
            searchParams={search ? { search } : {}}
          />
        </>
      ) : (
        <EmptyState
          icon="🏪"
          title="No stores found"
          description="Try a different search term or browse all stores."
        />
      )}
    </div>
  );
}
