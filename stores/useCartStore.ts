import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, BookingItem } from "@/types";

interface CartStore {
  items: CartItem[];
  bookings: BookingItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  addBooking: (booking: Omit<BookingItem, "id">) => void;
  removeBooking: (id: string) => void;
  clearCart: () => void;
}

let _bid = 0;
function bid() { return `bkg_${++_bid}`; }

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      bookings: [],

      addItem: (item) =>
        set((s) => {
          const existing = s.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { items: [...s.items, { ...item, quantity: 1 }] };
        }),

      removeItem: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),

      updateQuantity: (id, delta) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.id === id
              ? { ...i, quantity: Math.max(1, i.quantity + delta) }
              : i
          ),
        })),

      addBooking: (booking) =>
        set((s) => ({
          bookings: [...s.bookings, { ...booking, id: bid() }],
        })),

      removeBooking: (id) =>
        set((s) => ({ bookings: s.bookings.filter((b) => b.id !== id) })),

      clearCart: () => set({ items: [], bookings: [] }),
    }),
    { name: "btwoc-cart" }
  )
);
