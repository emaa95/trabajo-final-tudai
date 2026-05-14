// components/trabajos/field-error.tsx

type FieldErrorProps = {
  error?: string;
};

export function FieldError({
  error,
}: FieldErrorProps) {
  if (!error) return null;

  return (
    <p className="text-xs font-medium text-destructive">
      {error}
    </p>
  );
}