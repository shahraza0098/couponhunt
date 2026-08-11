import type { Metadata } from 'next';
import { getAllDeals } from '@/lib/queries/deals';
import DealCard from '@/components/ui/DealCard';
import Pagination from '@/components/ui/Pagination';
import EmptyState from '@/components/ui/EmptyState';

export const metadata: Metadata = {
  title: 'All Deals & Offers',
  description: 'Browse the hottest deals and offers from top Indian stores. Find the best prices on electronics, fashion, food, travel, and more.',
};

export default async function DealsPage({ searchParams }: PageProps<'/deals'>) {
  const params = await searchParams;
  const page = Number(params?.page) || 1;

  const { deals, totalPages, currentPage, total } = await getAllDeals({ page });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[--ch-text]">🔥 All Deals & Offers</h1>
        <p className="text-[--ch-text-muted] mt-2">
          {total} hot deals available right now
        </p>
      </div>

      {deals.length > 0 ? (
        <>
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
          <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/deals" />
        </>
      ) : (
        <EmptyState icon="🔥" title="No deals available" description="Check back later for hot deals and offers." />
      )}
    </div>
  );
}
