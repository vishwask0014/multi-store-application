"use client";

import { HugeiconsIcon } from "@hugeicons/react";

interface Props {
  label: string;
  value: string | number;
  icon: any;
  trend?: string;
  trendUp?: boolean;
}

export default function StatCard({ label, value, icon, trend, trendUp }: Props) {
  return (
    <div className="rounded-xl border border-border/50 bg-surface/50 p-5 transition-all hover:border-border-strong/50">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs text-text-muted">{label}</p>
          <p className="text-2xl font-semibold tracking-tight text-text-primary">
            {typeof value === "number" && label.toLowerCase().includes("revenue")
              ? `$${value.toFixed(2)}`
              : value}
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <HugeiconsIcon icon={icon} size={20} />
        </div>
      </div>
      {trend && (
        <p className={`mt-2 text-xs ${trendUp ? "text-success" : "text-text-muted"}`}>
          {trend}
        </p>
      )}
    </div>
  );
}
