"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Store01Icon, CalendarIcon } from "@hugeicons/core-free-icons";
import type { OrderData } from "@/types";

const STATUS_CONFIG: Record<string, { label: string; style: string }> = {
  pending: { label: "Pending", style: "bg-warning/10 text-warning ring-1 ring-warning/20" },
  confirmed: { label: "Confirmed", style: "bg-primary/10 text-primary ring-1 ring-primary/20" },
  preparing: { label: "Preparing", style: "bg-accent/10 text-accent ring-1 ring-accent/20" },
  ready: { label: "Ready", style: "bg-success/10 text-success ring-1 ring-success/20" },
  out_for_delivery: { label: "Out for Delivery", style: "bg-blue-500/10 text-blue-500 ring-1 ring-blue-500/20" },
  delivered: { label: "Delivered", style: "bg-success/10 text-success ring-1 ring-success/20" },
  cancelled: { label: "Cancelled", style: "bg-danger/10 text-danger ring-1 ring-danger/20" },
};

export default function OrderCard({ order, onView }: { order: OrderData; onView?: () => void }) {
  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const storeName = typeof order.storeId === "object" ? (order.storeId as any).name || "Store" : "Store";
  const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="rounded-xl border border-border/50 bg-surface/50 p-4 transition-all hover:border-border-strong/50 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-surface-raised text-primary ring-1 ring-primary/20">
            <HugeiconsIcon icon={Store01Icon} size={22} />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-text-primary">{order.orderNumber}</h3>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-secondary">
              <span>{storeName}</span>
              <span>{itemCount} item{itemCount !== 1 ? "s" : ""}</span>
              <span className="flex items-center gap-1">
                <HugeiconsIcon icon={CalendarIcon} size={12} />
                {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 sm:flex-col sm:items-end">
          <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${cfg.style}`}>
            {cfg.label}
          </span>
          <p className="text-sm font-medium text-accent">${order.totalAmount.toFixed(2)}</p>
        </div>
      </div>

      <div className="mt-3 space-y-1.5">
        {order.items.slice(0, 3).map((item, i) => (
          <div key={i} className="flex items-center gap-3 text-xs text-text-secondary">
            <div className="h-8 w-8 shrink-0 overflow-hidden rounded-md bg-surface-raised ring-1 ring-border/30">
              {item.image && <img src={item.image} alt={item.title} className="h-full w-full object-cover" />}
            </div>
            <span className="flex-1 truncate">{item.title}</span>
            <span>x{item.quantity}</span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        {order.items.length > 3 && (
          <p className="text-xs text-text-muted pl-11">+{order.items.length - 3} more items</p>
        )}
      </div>

      {onView && (
        <div className="mt-4 flex items-center gap-3 border-t border-border/30 pt-3">
          <button onClick={onView}
            className="rounded-lg bg-surface-raised/50 px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-raised">
            View Details
          </button>
        </div>
      )}
    </div>
  );
}
