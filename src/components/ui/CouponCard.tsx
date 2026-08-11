import Link from 'next/link';
import { formatDiscount, maskCode, isExpiringSoon } from '@/lib/utils/formatting';
import CopyCodeButton from './CopyCodeButton';

interface CouponCardProps {
  id: string;
  title: string;
  slug: string;
  code: string | null;
  couponType: string;
  discountType: string | null;
  discountValue: number | null;
  expiresAt: Date | string | null;
  isVerified: boolean;
  isFeatured: boolean;
  clickCount: number;
  storeName: string;
  storeSlug: string;
  storeLogo: string | null;
  storeId: string;
}

export default function CouponCard({
  id,
  title,
  slug,
  code,
  couponType,
  discountType,
  discountValue,
  expiresAt,
  isVerified,
  isFeatured,
  clickCount,
  storeName,
  storeSlug,
  storeLogo,
  storeId,
}: CouponCardProps) {
  const expiringSoon = expiresAt ? isExpiringSoon(expiresAt) : false;
  const discountLabel = formatDiscount(discountType, discountValue);

  return (
    <div
      className="group relative bg-[--ch-surface] border border-[--ch-border] rounded-2xl overflow-hidden card-hover"
      id={`coupon-card-${slug}`}
    >
      {/* Top badges row */}
      <div className="flex items-center justify-between px-5 pt-4 gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {isVerified && (
            <span className="badge badge-emerald">
              ✓ Verified
            </span>
          )}
          {isFeatured && (
            <span className="badge badge-purple">
              ⭐ Featured
            </span>
          )}
          {expiringSoon && (
            <span className="badge badge-rose">
              ⏰ Expiring Soon
            </span>
          )}
        </div>
        <span className="text-xs text-[--ch-text-faint]">{clickCount} uses</span>
      </div>

      {/* Content */}
      <div className="px-5 py-4">
        {/* Discount label */}
        <div className="mb-2">
          <span className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            {discountLabel}
          </span>
        </div>

        {/* Title */}
        <Link href={`/coupons/${slug}`}>
          <h3 className="font-semibold text-[--ch-text] group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
            {title}
          </h3>
        </Link>

        {/* Store info */}
        <Link
          href={`/stores/${storeSlug}`}
          className="inline-flex items-center gap-2 mt-3 text-sm text-[--ch-text-muted] hover:text-[--ch-text] transition-colors max-w-full"
        >
          <div className="w-6 h-6 flex items-center justify-center bg-[--ch-bg] rounded border border-[--ch-border] overflow-hidden shrink-0">
            {storeLogo ? (
              storeLogo.startsWith('http') ? (
                <img src={storeLogo} alt={storeName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-lg">{storeLogo}</span>
              )
            ) : (
              <span className="text-lg">🏪</span>
            )}
          </div>
          <span className="truncate">{storeName}</span>
        </Link>
      </div>

      {/* Code / Action area */}
      <div className="px-5 pb-5">
        {couponType === 'CODE' && code ? (
          <CopyCodeButton
            code={code}
            maskedCode={maskCode(code)}
            couponId={id}
            storeId={storeId}
          />
        ) : (
          <Link
            href={`/coupons/${slug}`}
            className="btn-primary w-full text-center"
          >
            View Offer
          </Link>
        )}
      </div>
    </div>
  );
}
