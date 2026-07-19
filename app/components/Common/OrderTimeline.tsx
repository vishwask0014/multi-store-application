"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Tick01Icon, ClockIcon } from "@hugeicons/core-free-icons";
import type { OrderTimelineEntry } from "@/types";

const STATUS_ORDER = ["pending", "confirmed", "preparing", "ready", "out_for_delivery", "delivered"];

const STATUS_LABELS: Record<string, string> = {
  pending: "Order Received",
  confirmed: "Confirmed",
  preparing: "Preparing",
  ready: "Ready",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function OrderTimeline({ timeline, currentStatus }: { timeline: OrderTimelineEntry[]; currentStatus: string }) {
  const isCancelled = currentStatus === "cancelled";
  const currentIdx = STATUS_ORDER.indexOf(currentStatus);

  return (
    <div className="space-y-0">
      {STATUS_ORDER.map((s, i) => {
        const entry = timeline.find((t) => t.status === s);
        const done = entry || (!isCancelled && i <= currentIdx);
        const active = !isCancelled && i === currentIdx;
        const pending = !isCancelled && !done && i > currentIdx;

        return (
          <div key={s} className="relative flex gap-3 pb-6 last:pb-0">
            {i < STATUS_ORDER.length - 1 && (
              <div className={`absolute left-[11px] top-5 w-0.5 ${done ? "bg-primary/40" : "bg-border/30"}`} style={{ height: "calc(100% + 8px)" }} />
            )}
            <div className={`relative mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
              done ? "bg-primary/15 text-primary" : active ? "bg-primary text-white" : "bg-surface-raised text-text-muted"
            }`}>
              {done && !active ? <HugeiconsIcon icon={Tick01Icon} size={14} /> : <HugeiconsIcon icon={ClockIcon} size={12} />}
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <p className={`text-sm font-medium ${done ? "text-text-primary" : "text-text-muted"}`}>
                {STATUS_LABELS[s]}
              </p>
              {entry?.timestamp && (
                <p className="text-xs text-text-muted">
                  {new Date(entry.timestamp).toLocaleDateString("en-US", {
                    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                  })}
                </p>
              )}
              {entry?.note && <p className="text-xs text-text-muted mt-0.5">{entry.note}</p>}
            </div>
          </div>
        );
      })}

      {isCancelled && (
        <div className="relative flex gap-3 pt-2">
          <div className="relative mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-danger/15 text-danger">
            <HugeiconsIcon icon={Tick01Icon} size={14} />
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-danger">Cancelled</p>
            {(() => {
              const cancelEntry = timeline.find((t) => t.status === "cancelled");
              return cancelEntry?.timestamp ? (
                <p className="text-xs text-text-muted">
                  {new Date(cancelEntry.timestamp).toLocaleDateString("en-US", {
                    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                  })}
                </p>
              ) : null;
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
