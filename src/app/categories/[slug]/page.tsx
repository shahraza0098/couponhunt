import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCategoryBySlug, getCategoryCoupons, getCategoryDeals } from '@/lib/queries/categories';
import CouponCard from '@/components/ui/CouponCard';
import DealCard from '@/components/ui/DealCard';
import EmptyState from '@/components/ui/EmptyState';

export async function generateMetadata({ params }: PageProps<'/categories/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: 'Category Not Found' };

  return {
    title: category.metaTitle || `${category.name} Coupons & Deals`,
    description: category.metaDescription || category.description || `Find the best coupons and deals in ${category.name}.`,
  };
}

export default async function CategoryDetailPage({ params }: PageProps<'/categories/[slug]'>) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category || category.status !== 'PUBLISHED') {
    notFound();
  }

  const [coupons, deals] = await Promise.all([
    getCategoryCoupons(category.id),
    getCategoryDeals(category.id),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[--ch-text-faint] mb-6">
        <Link href="/" className="hover:text-[--ch-text] transition-colors">Home</Link>
        <span>/</span>
        <Link href="/categories" className="hover:text-[--ch-text] transition-colors">Categories</Link>
        <span>/</span>
        {category.parent && (
          <>
            <Link href={`/categories/${category.parent.slug}`} className="hover:text-[--ch-text] transition-colors">
              {category.parent.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-[--ch-text-muted]">{category.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-3">
          <span className="text-4xl">{category.image || '📂'}</span>
          <h1 className="text-3xl font-bold text-[--ch-text]">{category.name}</h1>
        </div>
        {category.description && (
          <p className="text-[--ch-text-muted] max-w-2xl">{category.description}</p>
        )}
        <div className="flex gap-3 mt-4">
          <span className="badge badge-emerald">{category._count.coupons} Coupons</span>
          <span className="badge badge-amber">{category._count.deals} Deals</span>
        </div>
      </div>

      {/* Sub-categories */}
      {category.children.length > 0 && (
        <div className="mb-10">
          <h2 className="section-title mb-4">Sub-categories</h2>
          <div className="flex gap-2 flex-wrap">
            {category.children.map((child) => (
              <Link
                key={child.id}
                href={`/categories/${child.slug}`}
                className="badge badge-neutral hover:badge-purple transition-all px-4 py-2 text-sm"
              >
                {child.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Coupons */}
      <section className="mb-12" id="category-coupons">
        <h2 className="section-title mb-6">🎟️ {category.name} Coupons</h2>
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
          <EmptyState icon="🎟️" title="No coupons in this category" description="Check back later for new coupons." />
        )}
      </section>

      {/* Deals */}
      <section id="category-deals">
        <h2 className="section-title mb-6">🔥 {category.name} Deals</h2>
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
          <EmptyState icon="🔥" title="No deals in this category" description="Check back later for hot deals." />
        )}
      </section>
    </div>
  );
}
