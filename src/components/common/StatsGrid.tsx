import type { ReactNode } from "react";

type StatsGridProps = {
  children: ReactNode;
};

export function StatsGrid({ children }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {children}
    </div>
  );
}