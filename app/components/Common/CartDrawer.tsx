"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  AddIcon,
  MinusSignIcon,
  CalendarIcon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { useCartStore } from "@/stores/useCartStore";

export default function CartDrawer({ onClose }: { onClose?: () => void }) {
  const { items, bookings, updateQuantity, removeItem, removeBooking } = useCartStore();

  const itemTotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const bookingTotal = bookings.reduce((s, b) => s + b.price, 0);
  const grandTotal = itemTotal + bookingTotal;

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-border/50 bg-base/95 backdrop-blur-2xl">
      <div className="flex items-center justify-between border-b border-border/50 px-6 py-4">
        <h2 className="text-base font-medium tracking-tight text-text-primary">
          Cart
        </h2>
        {onClose && (
          <button onClick={onClose} className="rounded-lg p-1.5 text-text-muted transition-all duration-200 hover:bg-surface-raised/50 hover:text-text-primary">
            <HugeiconsIcon icon={Cancel01Icon} size={20} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        {items.length > 0 && (
          <>
            <h3 className="mb-4 text-[11px] font-medium uppercase tracking-[0.15em] text-text-muted">
              Items ({items.length})
            </h3>
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 rounded-xl border border-border/50 bg-surface/50 p-3 transition-all duration-200 hover:border-border-strong/50"
                >
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-surface-raised to-surface ring-1 ring-border/50">
                    <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {item.title}
                    </p>
                    <p className="text-sm text-accent">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-border/50 text-text-secondary transition-all duration-200 hover:bg-surface-raised/50 hover:text-text-primary"
                    >
                      <HugeiconsIcon icon={MinusSignIcon} size={14} />
                    </button>
                    <span className="flex h-7 w-7 items-center justify-center text-sm tabular-nums text-text-primary">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-border/50 text-text-secondary transition-all duration-200 hover:bg-surface-raised/50 hover:text-text-primary"
                    >
                      <HugeiconsIcon icon={AddIcon} size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {bookings.length > 0 && (
          <>
            <h3 className={`mb-4 text-[11px] font-medium uppercase tracking-[0.15em] text-text-muted ${items.length > 0 ? "mt-8" : ""}`}>
              Bookings ({bookings.length})
            </h3>
            <div className="space-y-3">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center gap-4 rounded-xl border border-border/50 bg-surface/50 p-3 transition-all duration-200 hover:border-border-strong/50"
                >
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-surface-raised to-surface text-text-muted ring-1 ring-border/50">
                    <HugeiconsIcon icon={CalendarIcon} size={24} />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {b.title}
                    </p>
                    <p className="text-xs text-text-muted">
                      {b.date} — {b.time}
                    </p>
                    <p className="text-sm text-accent">${b.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {items.length === 0 && bookings.length === 0 && (
          <div className="mt-16 text-center">
            <p className="text-sm text-text-muted">Your cart is empty</p>
          </div>
        )}
      </div>

      {(items.length > 0 || bookings.length > 0) && (
        <div className="border-t border-border/50 px-6 py-4">
          <div className="mb-4 flex items-center justify-between text-sm">
            <span className="text-text-secondary">Total</span>
            <span className="font-medium text-text-primary">${grandTotal.toFixed(2)}</span>
          </div>
          <button className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]">
            Checkout
          </button>
        </div>
      )}
    </div>
  );
}
