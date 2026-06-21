import type { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  error?: string;
  children: ReactNode;
}

export function FormField({
  label,
  error,
  children,
}: FormFieldProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-slate-700">
        {label}
      </label>

      {children}

      {error && (
        <p className="text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}