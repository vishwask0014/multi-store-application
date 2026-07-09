"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  AddIcon,
  MinusSignIcon,
  CalendarIcon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";

export default function CartDrawer() {
  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-border/50 bg-base/95 backdrop-blur-2xl">
      <div className="flex items-center justify-between border-b border-border/50 px-6 py-4">
        <h2 className="text-base font-medium tracking-tight text-text-primary">
          Cart
        </h2>
        <button className="rounded-lg p-1.5 text-text-muted transition-all duration-200 hover:bg-surface-raised/50 hover:text-text-primary">
          <HugeiconsIcon icon={Cancel01Icon} size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <h3 className="mb-4 text-[11px] font-medium uppercase tracking-[0.15em] text-text-muted">
          Items
        </h3>

        <div className="space-y-3">
          <div className="flex items-center gap-4 rounded-xl border border-border/50 bg-surface/50 p-3 transition-all duration-200 hover:border-border-strong/50">
            <div className="h-16 w-16 shrink-0 rounded-lg bg-gradient-to-br from-surface-raised to-surface ring-1 ring-border/50" />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium text-text-primary">
                Wireless Headphones
              </p>
              <p className="text-sm text-accent">$79.99</p>
            </div>
            <div className="flex items-center gap-1">
              <button className="flex h-7 w-7 items-center justify-center rounded-md border border-border/50 text-text-secondary transition-all duration-200 hover:bg-surface-raised/50 hover:text-text-primary">
                <HugeiconsIcon icon={MinusSignIcon} size={14} />
              </button>
              <span className="flex h-7 w-7 items-center justify-center text-sm tabular-nums text-text-primary">
                1
              </span>
              <button className="flex h-7 w-7 items-center justify-center rounded-md border border-border/50 text-text-secondary transition-all duration-200 hover:bg-surface-raised/50 hover:text-text-primary">
                <HugeiconsIcon icon={AddIcon} size={14} />
              </button>
            </div>
          </div>
        </div>

        <h3 className="mb-4 mt-8 text-[11px] font-medium uppercase tracking-[0.15em] text-text-muted">
          Bookings
        </h3>

        <div className="space-y-3">
          <div className="flex items-center gap-4 rounded-xl border border-border/50 bg-surface/50 p-3 transition-all duration-200 hover:border-border-strong/50">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-surface-raised to-surface text-text-muted ring-1 ring-border/50">
              <HugeiconsIcon icon={CalendarIcon} size={24} />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium text-text-primary">
                Yoga Class
              </p>
              <p className="text-xs text-text-muted">
                Mar 15, 2026 — 10:00 AM
              </p>
              <p className="text-sm text-accent">$25.00</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border/50 px-6 py-4">
        <div className="mb-4 flex items-center justify-between text-sm">
          <span className="text-text-secondary">Total</span>
          <span className="font-medium text-text-primary">$104.99</span>
        </div>
        <button className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]">
          Checkout
        </button>
      </div>
    </div>
  );
}
