import React from 'react';

type Column<T> = {
  header: string;
  accessor: (row: T) => React.ReactNode;
};

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  emptyMessage?: string;
}

export default function DataTable<T>({ data, columns, emptyMessage = 'No records found' }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-2xl shadow-lg bg-[--ch-surface]">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-[--ch-bg] border-b border-[--ch-border]">
          <tr>
            {columns.map((col, i) => (
              <th key={i} className="px-6 py-4 font-semibold text-[--ch-text-muted] tracking-wider uppercase text-xs">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[--ch-border]">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center text-[--ch-text-faint]">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={i} className="hover:bg-[--ch-surface-hover] transition-colors">
                {columns.map((col, j) => (
                  <td key={j} className="px-6 py-4 text-[--ch-text]">
                    {col.accessor(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
