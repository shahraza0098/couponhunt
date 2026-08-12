import Link from 'next/link';
import { FolderOpen } from 'lucide-react';

interface CategoryCardProps {
  name: string;
  slug: string;
  image: string | null;
  couponCount: number;
  dealCount: number;
}

export default function CategoryCard({
  name,
  slug,
  image,
  couponCount,
  dealCount,
}: CategoryCardProps) {
  const totalOffers = couponCount + dealCount;

  return (
    <Link
      href={`/categories/${slug}`}
      className="group flex items-center gap-3 bg-card text-card-foreground border border-border rounded-full py-2 px-4 card-hover shadow-sm min-w-max"
      id={`category-card-${slug}`}
    >
      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-lg overflow-hidden shrink-0 group-hover:bg-primary/20 transition-colors">
        {image ? (
          image.startsWith('http') ? (
            <img src={image} alt={name} className="w-full h-full object-cover" />
          ) : (
            image
          )
        ) : (
          <FolderOpen className="w-4 h-4 text-muted-foreground" />
        )}
      </div>

      <div className="flex flex-col">
        <span className="font-bold text-sm uppercase tracking-wider text-foreground group-hover:text-primary transition-colors">
          {name}
        </span>
      </div>
    </Link>
  );
}
