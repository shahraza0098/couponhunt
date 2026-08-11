import Link from 'next/link';
import { formatCurrency, formatDiscount, isExpiringSoon } from '@/lib/utils/formatting';

interface DealCardProps {
  id: string;
  title: string;
  slug: string;
  productName: string | null;
  productImage: string | null;
  originalPrice: number | null;
  salePrice: number | null;
  currency: string;
  discountType: string | null;
  discountValue: number | null;
  expiresAt: Date | string | null;
  isFeatured: boolean;
  clickCount: number;
  storeName: string;
  storeSlug: string;
  storeLogo: string | null;
  storeId: string;
}

export default function DealCard({
  title,
  slug,
  productImage,
  originalPrice,
  salePrice,
  currency,
  discountType,
  discountValue,
  expiresAt,
  isFeatured,
  clickCount,
  storeName,
  storeSlug,
  storeLogo,
}: DealCardProps) {
  const expiringSoon = expiresAt ? isExpiringSoon(expiresAt) : false;
  const discountLabel = formatDiscount(discountType, discountValue, currency);

  return (
    <Link
      href={`/deals/${slug}`}
      className="group block bg-[--ch-surface] border border-[--ch-border] rounded-2xl overflow-hidden card-hover"
      id={`deal-card-${slug}`}
    >
      {/* Product image area */}
      <div className="relative h-40 bg-[--ch-bg] flex items-center justify-center border-b border-[--ch-border]">
        <span className="text-5xl group-hover:scale-110 transition-transform duration-300">
          {productImage || '🛍️'}
        </span>

        {/* Discount badge overlay */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-xs font-bold rounded-lg shadow-md">
            {discountLabel}
          </span>
        </div>

        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-1">
          {isFeatured && (
            <span className="badge badge-purple text-[10px]">⭐ Featured</span>
          )}
          {expiringSoon && (
            <span className="badge badge-rose text-[10px]">⏰ Expiring</span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-[--ch-text] group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug mb-3">
          {title}
        </h3>

        {/* Pricing */}
        {(originalPrice != null || salePrice != null) && (
          <div className="flex items-baseline gap-3 mb-3">
            {salePrice != null && (
              <span className="text-xl font-bold text-emerald-400">
                {formatCurrency(salePrice, currency)}
              </span>
            )}
            {originalPrice != null && (
              <span className="text-sm text-[--ch-text-faint] line-through">
                {formatCurrency(originalPrice, currency)}
              </span>
            )}
          </div>
        )}

        {/* Store */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-[--ch-text-muted]">
            <span className="text-lg">{storeLogo || '🏪'}</span>
            <span>{storeName}</span>
          </div>
          <span className="text-xs text-[--ch-text-faint]">{clickCount} views</span>
        </div>
      </div>
    </Link>
  );
}
