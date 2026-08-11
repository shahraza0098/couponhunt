import Link from 'next/link';

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
      className="group block relative bg-[--ch-surface] border border-[--ch-border] rounded-2xl p-6 text-center card-hover overflow-hidden"
      id={`category-card-${slug}`}
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative">
        <div className="text-4xl mb-3 flex justify-center group-hover:scale-110 transition-transform duration-300">
          {image ? (
            image.startsWith('http') ? (
              <img src={image} alt={name} className="w-16 h-16 object-cover rounded-xl" />
            ) : (
              image
            )
          ) : (
            '📂'
          )}
        </div>

        <h3 className="font-semibold text-[--ch-text] group-hover:text-emerald-400 transition-colors">
          {name}
        </h3>

        <p className="text-sm text-[--ch-text-muted] mt-2">
          {totalOffers} {totalOffers === 1 ? 'offer' : 'offers'}
        </p>
      </div>
    </Link>
  );
}
