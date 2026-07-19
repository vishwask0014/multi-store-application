"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ShoppingCartIcon,
  CalendarIcon,
  AddIcon,
  MinusSignIcon,
  DeleteIcon,
  Tick01Icon,
} from "@hugeicons/core-free-icons";
import SidebarLayout from "@/app/components/Common/SidebarLayout";
import { useCartStore } from "@/stores/useCartStore";
import { useAuth } from "@/contexts/AuthContext";

export default function CartPage() {
  const { items, bookings, updateQuantity, removeItem, removeBooking, clearCart } = useCartStore();
  const { firebaseUser, mongoUser } = useAuth();
  const router = useRouter();
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  const itemTotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const bookingTotal = bookings.reduce((s, b) => s + b.price, 0);
  const grandTotal = itemTotal + bookingTotal;

  const handleCheckout = async () => {
    setCheckoutError("");
    setCheckingOut(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: firebaseUser?.uid,
          mongoUserId: mongoUser?.id,
          items: items.map((i) => ({ id: i.id, title: i.title, price: i.price, quantity: i.quantity })),
          bookings: bookings.map((b) => ({ id: b.id, title: b.title, price: b.price, date: b.date, time: b.time, image: b.image })),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Checkout failed");
      }

      const data = await res.json();
      clearCart();

      if (data.orders?.length > 0 && data.bookings?.length > 0) {
        router.push("/dashboard/orders");
      } else if (data.orders?.length > 0) {
        router.push("/dashboard/orders");
      } else if (data.bookings?.length > 0) {
        router.push("/dashboard/bookings");
      }
    } catch (err: any) {
      setCheckoutError(err.message);
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <SidebarLayout>
      <div className="mx-auto max-w-4xl">
        <div className="px-6 pt-8 pb-16 lg:px-8">
          <div className="mb-8 space-y-1">
            <h1 className="text-2xl font-medium tracking-tight text-text-primary">
              Cart
            </h1>
            <p className="text-sm text-text-muted">
              {items.length + bookings.length} item{items.length + bookings.length !== 1 ? "s" : ""} in your cart
            </p>
          </div>

          {items.length > 0 && (
            <section className="mb-10">
              <h2 className="mb-4 text-[11px] font-medium uppercase tracking-[0.15em] text-text-muted">
                Items
              </h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 rounded-xl border border-border/50 bg-surface/50 p-4 transition-all duration-200 hover:border-border-strong/50"
                  >
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-surface-raised to-surface ring-1 ring-border/50">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {item.title}
                      </p>
                      <p className="text-sm text-accent">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="flex h-7 w-7 items-center justify-center rounded-md border border-border/50 text-text-secondary transition-all duration-200 hover:bg-surface-raised/50 hover:text-text-primary"
                      >
                        <HugeiconsIcon icon={MinusSignIcon} size={14} />
                      </button>
                      <span className="flex h-7 w-8 items-center justify-center text-sm tabular-nums text-text-primary">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-md border border-border/50 text-text-secondary transition-all duration-200 hover:bg-surface-raised/50 hover:text-text-primary"
                      >
                        <HugeiconsIcon icon={AddIcon} size={14} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="rounded-lg p-2 text-text-muted transition-colors hover:bg-red-500/10 hover:text-red-400"
                    >
                      <HugeiconsIcon icon={DeleteIcon} size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {bookings.length > 0 && (
            <section className="mb-10">
              <h2 className="mb-4 text-[11px] font-medium uppercase tracking-[0.15em] text-text-muted">
                Bookings
              </h2>
              <div className="space-y-3">
                {bookings.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center gap-4 rounded-xl border border-border/50 bg-surface/50 p-4 transition-all duration-200 hover:border-border-strong/50"
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
                    <button
                      onClick={() => removeBooking(b.id)}
                      className="rounded-lg p-2 text-text-muted transition-colors hover:bg-red-500/10 hover:text-red-400"
                    >
                      <HugeiconsIcon icon={DeleteIcon} size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {items.length === 0 && bookings.length === 0 && (
            <div className="mt-16 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-raised/50 text-text-muted ring-1 ring-border/50">
                <HugeiconsIcon icon={ShoppingCartIcon} size={28} />
              </div>
              <p className="text-sm text-text-muted">Your cart is empty</p>
            </div>
          )}

          {(items.length > 0 || bookings.length > 0) && (
            <div className="rounded-xl border border-border/50 bg-surface/80 p-6 backdrop-blur-sm">
              {items.length > 0 && (
                <div className="mb-3 flex items-center justify-between text-sm">
                  <span className="text-text-secondary">Items subtotal</span>
                  <span className="text-text-primary">${itemTotal.toFixed(2)}</span>
                </div>
              )}
              {bookings.length > 0 && (
                <div className="mb-3 flex items-center justify-between text-sm">
                  <span className="text-text-secondary">Bookings subtotal</span>
                  <span className="text-text-primary">${bookingTotal.toFixed(2)}</span>
                </div>
              )}
              <div className="mb-1 h-px bg-border/30" />
              <div className="mb-5 mt-3 flex items-center justify-between text-sm">
                <span className="font-medium text-text-primary">Total</span>
                <span className="text-lg font-medium text-accent">
                  ${grandTotal.toFixed(2)}
                </span>
              </div>
              {checkoutError && (
                <p className="mb-3 text-xs text-danger">{checkoutError}</p>
              )}
              <button onClick={handleCheckout} disabled={checkingOut}
                className="group relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-primary to-primary-hover py-3 text-sm font-medium text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] disabled:opacity-50">
                <span className="absolute inset-0 translate-y-full bg-white/10 transition-transform duration-300 group-hover:translate-y-0" />
                <span className="relative flex items-center justify-center gap-2">
                  {checkingOut ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <HugeiconsIcon icon={Tick01Icon} size={16} />
                  )}
                  {checkingOut ? "Processing..." : "Proceed to Checkout"}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </SidebarLayout>
  );
}
