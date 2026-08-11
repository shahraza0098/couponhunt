import { SkeletonGrid } from '@/components/ui/SkeletonCard';

export default function CouponsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="h-8 w-64 bg-[--ch-surface] rounded animate-shimmer mb-2" />
        <div className="h-4 w-52 bg-[--ch-surface] rounded animate-shimmer" />
      </div>
      <SkeletonGrid count={8} type="coupon" />
    </div>
  );
}
