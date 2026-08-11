export function SkeletonCard() {
  return (
    <div className="bg-[--ch-surface] border border-[--ch-border] rounded-2xl p-5 animate-shimmer">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-xl bg-[--ch-bg]" />
        <div className="flex-1 space-y-3">
          <div className="h-4 w-3/4 bg-[--ch-bg] rounded" />
          <div className="h-3 w-full bg-[--ch-bg] rounded" />
          <div className="flex gap-2">
            <div className="h-5 w-20 bg-[--ch-bg] rounded-full" />
            <div className="h-5 w-16 bg-[--ch-bg] rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonCouponCard() {
  return (
    <div className="bg-[--ch-surface] border border-[--ch-border] rounded-2xl p-5 animate-shimmer">
      <div className="flex gap-2 mb-4">
        <div className="h-5 w-16 bg-[--ch-bg] rounded-full" />
        <div className="h-5 w-20 bg-[--ch-bg] rounded-full" />
      </div>
      <div className="h-6 w-24 bg-[--ch-bg] rounded mb-3" />
      <div className="h-4 w-full bg-[--ch-bg] rounded mb-2" />
      <div className="h-4 w-2/3 bg-[--ch-bg] rounded mb-4" />
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-[--ch-bg] rounded-full" />
        <div className="h-3 w-20 bg-[--ch-bg] rounded" />
      </div>
      <div className="h-11 w-full bg-[--ch-bg] rounded-xl" />
    </div>
  );
}

export function SkeletonDealCard() {
  return (
    <div className="bg-[--ch-surface] border border-[--ch-border] rounded-2xl overflow-hidden animate-shimmer">
      <div className="h-40 bg-[--ch-bg]" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-full bg-[--ch-bg] rounded" />
        <div className="h-4 w-2/3 bg-[--ch-bg] rounded" />
        <div className="flex gap-3">
          <div className="h-6 w-20 bg-[--ch-bg] rounded" />
          <div className="h-4 w-16 bg-[--ch-bg] rounded" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[--ch-bg] rounded-full" />
          <div className="h-3 w-20 bg-[--ch-bg] rounded" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8, type = 'card' }: { count?: number; type?: 'card' | 'coupon' | 'deal' }) {
  const Component = type === 'coupon' ? SkeletonCouponCard : type === 'deal' ? SkeletonDealCard : SkeletonCard;

  return (
    <div className={`grid gap-4 ${type === 'deal' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
      {Array.from({ length: count }).map((_, i) => (
        <Component key={i} />
      ))}
    </div>
  );
}
