import Link from 'next/link';
import { formatCurrency, formatDiscount, isExpiringSoon } from '@/lib/utils/formatting';
import { Heart, Share2, Store, ShoppingBag } from 'lucide-react';

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
    <div
      className="group bg-card text-card-foreground border border-border rounded-xl overflow-hidden card-hover shadow-sm flex flex-col"
      id={`deal-card-${slug}`}
    >
      {/* Product image area */}
      <Link href={`/deals/${slug}`} className="relative h-40 bg-muted flex items-center justify-center overflow-hidden block">
        {productImage ? (
          productImage.startsWith('http') ? (
            <img src={productImage} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <span className="text-5xl group-hover:scale-110 transition-transform duration-300">
              {productImage}
            </span>
          )
        ) : (
          <ShoppingBag className="w-12 h-12 text-muted-foreground/30 group-hover:scale-110 transition-transform duration-300" />
        )}

        {/* Favorite Icon (top right like screenshot) */}
        <div className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-red-500 shadow-sm cursor-pointer hover:bg-white transition-colors">
          <Heart className="w-4 h-4" />
        </div>

        {/* Floating Store Logo */}
        <div className="absolute -bottom-5 left-4 w-12 h-12 bg-white rounded-full border-2 border-white shadow-sm flex items-center justify-center overflow-hidden z-10 text-lg">
          {storeLogo ? (
            storeLogo.startsWith('http') ? (
              <img src={storeLogo} alt={storeName} className="w-full h-full object-cover" />
            ) : (
              <span>{storeLogo}</span>
            )
          ) : (
            <Store className="w-6 h-6 text-muted-foreground" />
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="pt-7 px-4 pb-4 flex flex-col flex-1 relative text-center">
        {/* Share Icon */}
        <button className="absolute top-2 right-4 text-gray-400 hover:text-gray-600">
          <Share2 className="w-4 h-4" />
        </button>

        <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider mb-1">{storeName}</p>
        
        <Link href={`/deals/${slug}`}>
          <h3 className="font-bold text-foreground text-sm uppercase leading-snug mb-4 line-clamp-2 min-h-[40px]">
            {title}
          </h3>
        </Link>

        <div className="mt-auto">
          <Link href={`/deals/${slug}`} className="block">
            <button className="btn-purple btn-purple-cutout w-full">
              {discountLabel || "GET DEAL"}
            </button>
          </Link>
          <p className="text-[9px] text-red-500 font-bold uppercase mt-2">
            {expiringSoon ? "Expiring Soon" : "Limited Time"}
          </p>
        </div>
      </div>
    </div>
  );
}
