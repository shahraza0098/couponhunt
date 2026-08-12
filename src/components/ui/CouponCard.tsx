import Link from 'next/link';
import { formatDiscount, maskCode, isExpiringSoon } from '@/lib/utils/formatting';
import CopyCodeButton from './CopyCodeButton';
import { Ticket, Store, Share2 } from 'lucide-react';

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
      className="group bg-card text-card-foreground border border-border rounded-xl overflow-hidden card-hover shadow-sm flex flex-col"
      id={`coupon-card-${slug}`}
    >
      {/* Top Graphic Area (No Product Image for Coupons, using Brand Color/Gradient) */}
      <div className="relative h-32 bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center overflow-hidden">
        
        <div className="text-4xl opacity-20 transform -rotate-12 scale-150">
          <Ticket className="w-16 h-16 text-black" />
        </div>

        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-1">
          {isVerified && <span className="badge badge-emerald bg-white text-green-700 shadow-sm text-[10px]">✓ Verified</span>}
        </div>
        
        {/* Floating Store Logo */}
        <Link href={`/stores/${storeSlug}`} className="absolute -bottom-5 left-4 w-12 h-12 bg-white rounded-full border-2 border-white shadow-sm flex items-center justify-center overflow-hidden z-10 text-lg">
          {storeLogo ? (
            storeLogo.startsWith('http') ? (
              <img src={storeLogo} alt={storeName} className="w-full h-full object-cover" />
            ) : (
              <span>{storeLogo}</span>
            )
          ) : (
            <Store className="w-6 h-6 text-muted-foreground" />
          )}
        </Link>
      </div>

      {/* Content */}
      <div className="pt-7 px-4 pb-4 flex flex-col flex-1 relative text-center">
        {/* Share Icon */}
        <button className="absolute top-2 right-4 text-gray-400 hover:text-gray-600">
          <Share2 className="w-4 h-4" />
        </button>

        <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider mb-1">
          <Link href={`/stores/${storeSlug}`} className="hover:text-primary transition-colors">{storeName}</Link>
        </p>

        <Link href={`/coupons/${slug}`}>
          <h3 className="font-bold text-foreground text-sm uppercase leading-snug mb-4 line-clamp-2 min-h-[40px]">
            {title}
          </h3>
        </Link>

        <div className="mt-auto">
          {couponType === 'CODE' && code ? (
            <div className="relative">
              <CopyCodeButton
                code={code}
                maskedCode={maskCode(code)}
                couponId={id}
                storeId={storeId}
              />
            </div>
          ) : (
            <Link href={`/coupons/${slug}`} className="block">
              <button className="btn-purple btn-purple-cutout w-full">
                {discountLabel || "GET DEAL"}
              </button>
            </Link>
          )}
          
          <div className="flex justify-between items-center mt-2 px-1">
             <p className="text-[9px] text-red-500 font-bold uppercase">
               {expiringSoon ? "Expiring Soon" : "Valid Offer"}
             </p>
             <span className="text-[9px] text-muted-foreground uppercase">{clickCount} Uses</span>
          </div>
        </div>
      </div>
    </div>
  );
}
