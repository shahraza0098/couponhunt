import Link from 'next/link';

interface StoreCardProps {
  name: string;
  slug: string;
  logo: string | null;
  shortDescription: string | null;
  couponCount: number;
  dealCount: number;
}

export default function StoreCard({
  name,
  slug,
  logo,
  shortDescription,
  couponCount,
  dealCount,
}: StoreCardProps) {
  const totalOffers = couponCount + dealCount;

  return (
    <Link
      href={`/stores/${slug}`}
      className="group block bg-[--ch-surface] border border-[--ch-border] rounded-2xl p-5 card-hover"
      id={`store-card-${slug}`}
    >
      <div className="flex items-start gap-4">
        {/* Logo */}
        <div className="w-14 h-14 rounded-xl bg-[--ch-bg] border border-[--ch-border] flex items-center justify-center text-2xl shrink-0 group-hover:border-emerald-500/30 transition-colors">
          {logo || '🏪'}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[--ch-text] group-hover:text-emerald-400 transition-colors truncate">
            {name}
          </h3>
          {shortDescription && (
            <p className="text-sm text-[--ch-text-muted] mt-1 line-clamp-2">
              {shortDescription}
            </p>
          )}

          {/* Offer counts */}
          <div className="flex items-center gap-3 mt-3">
            {couponCount > 0 && (
              <span className="badge badge-emerald">
                🎟️ {couponCount} {couponCount === 1 ? 'Coupon' : 'Coupons'}
              </span>
            )}
            {dealCount > 0 && (
              <span className="badge badge-amber">
                🔥 {dealCount} {dealCount === 1 ? 'Deal' : 'Deals'}
              </span>
            )}
            {totalOffers === 0 && (
              <span className="badge badge-neutral">No active offers</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
