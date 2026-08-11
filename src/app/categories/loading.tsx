export default function CategoriesLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="h-8 w-52 bg-[--ch-surface] rounded animate-shimmer mb-2" />
        <div className="h-4 w-72 bg-[--ch-surface] rounded animate-shimmer" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-[--ch-surface] border border-[--ch-border] rounded-2xl p-6 animate-shimmer">
            <div className="mx-auto w-12 h-12 bg-[--ch-bg] rounded-xl mb-3" />
            <div className="h-4 w-20 bg-[--ch-bg] rounded mx-auto mb-2" />
            <div className="h-3 w-14 bg-[--ch-bg] rounded mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
