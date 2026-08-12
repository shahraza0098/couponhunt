import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getDealBySlug, getRelatedDeals } from '@/lib/queries/deals';
import { formatDiscount, formatCurrency, formatDate, isExpired } from '@/lib/utils/formatting';
import CountdownTimer from '@/components/ui/CountdownTimer';
import DealCard from '@/components/ui/DealCard';
import { ShoppingBag, Store as StoreIcon, ShoppingCart } from 'lucide-react';

export async function generateMetadata({ params }: PageProps<'/deals/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const deal = await getDealBySlug(slug);
  if (!deal) return { title: 'Deal Not Found' };

  return {
    title: `${deal.title} - ${deal.store.name}`,
    description: deal.description || `${deal.productName || deal.title} at the best price from ${deal.store.name}.`,
  };
}

export default async function DealDetailPage({ params }: PageProps<'/deals/[slug]'>) {
  const { slug } = await params;
  const deal = await getDealBySlug(slug);

  if (!deal || deal.status !== 'PUBLISHED') {
    notFound();
  }

  const expired = isExpired(deal.expiresAt);
  const discount = formatDiscount(deal.discountType, deal.discountValue ? Number(deal.discountValue) : null, deal.currency);
  const related = await getRelatedDeals(deal.id, deal.storeId);

  const savings = deal.originalPrice && deal.salePrice
    ? Number(deal.originalPrice) - Number(deal.salePrice)
    : null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-[--ch-text-faint] mb-6">
            <Link href="/" className="hover:text-[--ch-text] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/deals" className="hover:text-[--ch-text] transition-colors">Deals</Link>
            <span>/</span>
            <span className="text-[--ch-text-muted] truncate">{deal.title}</span>
          </nav>

          <div className="bg-[--ch-surface] border border-[--ch-border] rounded-2xl overflow-hidden">
            {/* Product image */}
            <div className="h-56 sm:h-72 bg-[--ch-bg] flex items-center justify-center border-b border-[--ch-border] relative">
              <div className="text-7xl flex items-center justify-center w-full h-full">
                {deal.productImage ? (
                  deal.productImage.startsWith('http') ? (
                    <img src={deal.productImage} alt={deal.title} className="w-full h-full object-cover" />
                  ) : deal.productImage
                ) : (
                  <ShoppingBag className="w-20 h-20 text-[--ch-text-muted]" />
                )}
              </div>
              <div className="absolute top-4 left-4">
                <span className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-sm font-bold rounded-xl shadow-lg">
                  {discount}
                </span>
              </div>
              {expired && (
                <div className="absolute top-4 right-4">
                  <span className="badge badge-rose">Expired</span>
                </div>
              )}
            </div>

            <div className="p-6 sm:p-8">
              {/* Badges */}
              <div className="flex items-center gap-2 flex-wrap mb-4">
                {deal.isFeatured && <span className="badge badge-purple">⭐ Featured</span>}
                {!expired && deal.expiresAt && <CountdownTimer expiresAt={deal.expiresAt} />}
              </div>

              <h1 className="text-2xl font-bold text-[--ch-text] mb-2">{deal.title}</h1>

              {deal.productName && (
                <p className="text-[--ch-text-muted] mb-4">{deal.productName}</p>
              )}

              {/* Pricing */}
              <div className="flex items-baseline gap-4 mb-6 p-4 bg-[--ch-bg] rounded-xl">
                {deal.salePrice != null && (
                  <span className="text-3xl font-bold text-emerald-400">
                    {formatCurrency(Number(deal.salePrice), deal.currency)}
                  </span>
                )}
                {deal.originalPrice != null && (
                  <span className="text-lg text-[--ch-text-faint] line-through">
                    {formatCurrency(Number(deal.originalPrice), deal.currency)}
                  </span>
                )}
                {savings != null && savings > 0 && (
                  <span className="badge badge-emerald text-sm">
                    Save {formatCurrency(savings, deal.currency)}
                  </span>
                )}
              </div>

              {/* Store */}
              <Link
                href={`/stores/${deal.store.slug}`}
                className="inline-flex items-center gap-3 mb-6 text-[--ch-text-muted] hover:text-[--ch-text] transition-colors"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-[--ch-bg] border border-[--ch-border]">
                  {deal.store.logo ? (
                    deal.store.logo.startsWith('http') ? (
                      <img src={deal.store.logo} alt={deal.store.name} className="w-full h-full object-cover" />
                    ) : deal.store.logo
                  ) : (
                    <StoreIcon className="w-4 h-4 text-[--ch-text-muted]" />
                  )}
                </div>
                <span className="font-medium">{deal.store.name}</span>
              </Link>

              {/* Get Deal CTA */}
              {deal.productUrl && !expired && (
                <div className="mb-6">
                  <a
                    href={deal.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full text-center text-base py-4"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2 inline-block" /> Get This Deal
                  </a>
                </div>
              )}

              {/* Description */}
              {deal.description && (
                <div className="mb-6">
                  <h2 className="text-sm font-semibold text-[--ch-text] uppercase tracking-wider mb-2">About This Deal</h2>
                  <p className="text-[--ch-text-muted] leading-relaxed">{deal.description}</p>
                </div>
              )}

              {/* Details */}
              <div className="grid grid-cols-2 gap-4">
                {deal.startsAt && (
                  <div className="p-3 bg-[--ch-bg] rounded-lg">
                    <div className="text-xs text-[--ch-text-faint] mb-1">Available From</div>
                    <div className="font-semibold text-[--ch-text]">{formatDate(deal.startsAt)}</div>
                  </div>
                )}
                {deal.expiresAt && (
                  <div className="p-3 bg-[--ch-bg] rounded-lg">
                    <div className="text-xs text-[--ch-text-faint] mb-1">Expires</div>
                    <div className="font-semibold text-[--ch-text]">{formatDate(deal.expiresAt)}</div>
                  </div>
                )}
              </div>

              {/* Categories */}
              {deal.categories.length > 0 && (
                <div className="mt-6 flex gap-2 flex-wrap">
                  {deal.categories.map((dc) => (
                    <Link key={dc.category.id} href={`/categories/${dc.category.slug}`} className="badge badge-neutral hover:badge-purple transition-colors">
                      {dc.category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="bg-[--ch-surface] border border-[--ch-border] rounded-2xl p-6 mb-6">
            <h3 className="text-sm font-semibold text-[--ch-text] uppercase tracking-wider mb-4">About {deal.store.name}</h3>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-[--ch-bg] border border-[--ch-border]">
                {deal.store.logo ? (
                  deal.store.logo.startsWith('http') ? (
                    <img src={deal.store.logo} alt={deal.store.name} className="w-full h-full object-cover" />
                  ) : deal.store.logo
                ) : (
                  <StoreIcon className="w-6 h-6 text-[--ch-text-muted]" />
                )}
              </div>
              <span className="font-semibold text-[--ch-text]">{deal.store.name}</span>
            </div>
            {deal.store.shortDescription && (
              <p className="text-sm text-[--ch-text-muted] mb-4">{deal.store.shortDescription}</p>
            )}
            <Link href={`/stores/${deal.store.slug}`} className="btn-secondary w-full text-center text-sm">
              View All {deal.store.name} Offers
            </Link>
          </div>

          {related.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-[--ch-text] uppercase tracking-wider mb-4">
                More Deals from {deal.store.name}
              </h3>
              <div className="space-y-3">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    href={`/deals/${r.slug}`}
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
