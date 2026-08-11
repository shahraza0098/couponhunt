interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
}

export default function EmptyState({
  icon = '🔍',
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-fade-in">
      <span className="text-6xl mb-4 animate-float">{icon}</span>
      <h3 className="text-xl font-semibold text-[--ch-text] mb-2">{title}</h3>
      {description && (
        <p className="text-[--ch-text-muted] max-w-md">{description}</p>
      )}
    </div>
  );
}
