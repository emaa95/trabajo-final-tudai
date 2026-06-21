interface EmptyStateProps {
  title: string;
  description?: string;
}

export function EmptyState({
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="text-center py-12 text-slate-400">
      <p className="font-medium">
        {title}
      </p>

      {description && (
        <p className="text-sm mt-1">
          {description}
        </p>
      )}
    </div>
  );
}