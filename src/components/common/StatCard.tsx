import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";

type StatCardProps = {
  icon: ReactNode;
  iconClass: string;
  label: string;
  value: number | string;
  footer?: string;
  trend?: "up" | "down" | "neutral";
};

export function StatCard({
  icon,
  iconClass,
  label,
  value,
  footer,
  trend = "up",
}: StatCardProps) {
  const trendStyles = {
    up: "bg-green-100 text-green-700",
    down: "bg-red-100 text-red-700",
    neutral: "bg-muted text-muted-foreground",
  };

  return (
    <Card className="group relative overflow-hidden border-border/60 py-0 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      {/* Glow ambiental */}
      <div className="pointer-events-none absolute -right-8 -top-8 size-24 rounded-full bg-linear-to-br from-foreground/4 to-transparent blur-2xl transition-opacity duration-300 group-hover:opacity-100" />

      <CardContent className="relative flex items-center gap-3 px-4 pt-3 pb-0">
        <div
          className={`flex size-11 shrink-0 items-center justify-center rounded-xl shadow-inner ring-1 ring-black/4 ${iconClass}`}
        >
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xl font-semibold leading-none tracking-tight">
              {value}
            </p>

            <span
              className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium leading-none ${trendStyles[trend]}`}
            >
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "—"}
            </span>
          </div>

          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {label}
          </p>
        </div>
      </CardContent>

      {footer && (
        <div className="relative border-t border-border/40 bg-muted/20 px-4 py-1">
          <p className="truncate text-[11px] text-muted-foreground">
            {footer}
          </p>
        </div>
      )}
    </Card>
  );
}