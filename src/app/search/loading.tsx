export default function SearchLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="h-8 w-64 bg-[--ch-surface] rounded animate-shimmer mb-2" />
        <div className="h-4 w-32 bg-[--ch-surface] rounded animate-shimmer" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-[--ch-surface] border border-[--ch-border] rounded-2xl p-5 animate-shimmer">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-[--ch-bg]" />
              <div className="flex-1 space-y-3">
                <div className="h-4 w-3/4 bg-[--ch-bg] rounded" />
                <div className="h-3 w-full bg-[--ch-bg] rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
