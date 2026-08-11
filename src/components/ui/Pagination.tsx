import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams?: Record<string, string>;
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
  searchParams = {},
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const buildUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(page));
    return `${basePath}?${params.toString()}`;
  };

  // Generate page numbers with ellipsis
  const pages: (number | '...')[] = [];
  const delta = 2;

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <nav className="flex items-center justify-center gap-2 mt-10" id="pagination" aria-label="Pagination">
      {/* Prev */}
      {currentPage > 1 ? (
        <Link
          href={buildUrl(currentPage - 1)}
          className="px-3 py-2 text-sm font-medium text-[--ch-text-muted] hover:text-[--ch-text] bg-[--ch-surface] border border-[--ch-border] rounded-lg hover:bg-[--ch-surface-hover] transition-colors"
        >
          ← Prev
        </Link>
      ) : (
        <span className="px-3 py-2 text-sm font-medium text-[--ch-text-faint] bg-[--ch-surface] border border-[--ch-border] rounded-lg opacity-50 cursor-not-allowed">
          ← Prev
        </span>
      )}

      {/* Page numbers */}
      {pages.map((page, i) =>
        page === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-[--ch-text-faint]">
            …
          </span>
        ) : (
          <Link
            key={page}
            href={buildUrl(page)}
            className={`w-10 h-10 flex items-center justify-center text-sm font-medium rounded-lg border transition-colors ${
              page === currentPage
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                : 'text-[--ch-text-muted] hover:text-[--ch-text] bg-[--ch-surface] border-[--ch-border] hover:bg-[--ch-surface-hover]'
            }`}
          >
            {page}
          </Link>
        )
      )}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={buildUrl(currentPage + 1)}
          className="px-3 py-2 text-sm font-medium text-[--ch-text-muted] hover:text-[--ch-text] bg-[--ch-surface] border border-[--ch-border] rounded-lg hover:bg-[--ch-surface-hover] transition-colors"
        >
          Next →
        </Link>
      ) : (
        <span className="px-3 py-2 text-sm font-medium text-[--ch-text-faint] bg-[--ch-surface] border border-[--ch-border] rounded-lg opacity-50 cursor-not-allowed">
          Next →
        </span>
      )}
    </nav>
  );
}
