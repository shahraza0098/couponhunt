import Link from 'next/link';
import { Store } from 'lucide-react';

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
      className="group flex flex-col items-center justify-center bg-card text-card-foreground border border-border rounded-xl p-4 card-hover shadow-sm"
      id={`store-card-${slug}`}
    >
      {/* Logo */}
      <div className="w-16 h-16 rounded-full bg-muted border border-border flex items-center justify-center text-3xl mb-3 group-hover:border-primary/50 transition-colors overflow-hidden shrink-0">
        {logo ? (
          logo.startsWith('http') ? (
            <img src={logo} alt={name} className="w-full h-full object-cover" />
          ) : (
            logo
          )
        ) : (
          <Store className="w-8 h-8 text-muted-foreground" />
        )}
      </div>

      <div className="text-center">
        <h3 className="font-bold text-foreground text-sm uppercase group-hover:text-primary transition-colors truncate w-full px-2 max-w-[150px]">
          {name}
        </h3>
        
        {/* Offer count */}
        <div className="mt-1">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
            {totalOffers} Offers
          </span>
        </div>
      </div>
    </Link>
  );
}
