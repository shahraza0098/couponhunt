import { ReactNode } from 'react';
import { Search } from 'lucide-react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
}

export default function EmptyState({
  icon = <Search className="w-16 h-16 text-emerald-500" />,
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-fade-in">
      <div className="mb-4 animate-float flex justify-center text-emerald-500">{icon}</div>
      <h3 className="text-xl font-semibold text-[--ch-text] mb-2">{title}</h3>
      {description && (
        <p className="text-[--ch-text-muted] max-w-md">{description}</p>
      )}
    </div>
  );
}
