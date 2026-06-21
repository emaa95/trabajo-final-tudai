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
    <Card>
      <CardContent className="flex flex-col gap-1 px-5">
        <div className="flex items-center justify-between">
          <div
            className={`flex size-10 items-center justify-center rounded-lg ${iconClass}`}
          >
            {icon}
          </div>

          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${trendStyles[trend]}`}
          >
            {trend === "up"
              ? "↑"
              : trend === "down"
                ? "↓"
                : "—"}{" "}
            sin cambio
          </span>
        </div>

        <div>
          <p className="text-2xl font-semibold leading-none">{value}</p>
          <p className="mt-1 text-sm text-muted-foreground">{label}</p>
        </div>

        {footer && (
          <p className="border-t pt-2.5 text-xs text-muted-foreground">
            {footer}
          </p>
        )}
      </CardContent>
    </Card>
  );
}