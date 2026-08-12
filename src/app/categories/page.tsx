import type { Metadata } from 'next';
import { getAllCategories } from '@/lib/queries/categories';
import CategoryCard from '@/components/ui/CategoryCard';
import { FolderOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'All Categories',
  description: 'Browse coupons and deals by category. Find offers in Electronics, Fashion, Food, Travel, Health & Beauty, and more.',
};

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[--ch-text] flex items-center"><FolderOpen className="w-8 h-8 mr-3 text-purple-500" /> All Categories</h1>
        <p className="text-[--ch-text-muted] mt-2">
          Browse coupons and deals by shopping category
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 stagger-grid">
        {categories.map((cat) => (
          <CategoryCard
            key={cat.id}
            name={cat.name}
            slug={cat.slug}
            image={cat.image}
            couponCount={cat._count.coupons}
            dealCount={cat._count.deals}
          />
        ))}
      </div>

      {/* Sub-categories */}
      {categories.filter((c) => c.children.length > 0).map((cat) => (
        <div key={cat.id} className="mt-10">
          <h2 className="section-title mb-4 flex items-center gap-2">
            {cat.image ? (
              cat.image.startsWith('http') ? (
                <img src={cat.image} alt={cat.name} className="w-8 h-8 object-cover rounded-md" />
              ) : (
                <span className="text-2xl">{cat.image}</span>
              )
            ) : (
              <FolderOpen className="w-6 h-6 text-[--ch-text-muted]" />
            )}
            <span>{cat.name}</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {cat.children.map((child) => (
              <CategoryCard
                key={child.id}
                name={child.name}
                slug={child.slug}
                image={child.image}
                couponCount={child._count.coupons}
                dealCount={child._count.deals}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
