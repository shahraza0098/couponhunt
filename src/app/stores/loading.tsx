import { SkeletonGrid } from '@/components/ui/SkeletonCard';

export default function StoresLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="h-8 w-48 bg-[--ch-surface] rounded animate-shimmer mb-2" />
        <div className="h-4 w-72 bg-[--ch-surface] rounded animate-shimmer" />
      </div>
      <SkeletonGrid count={9} type="card" />
    </div>
  );
}
