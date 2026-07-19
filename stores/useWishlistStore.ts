import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WishlistItem } from "@/types";

interface WishlistStore {
  items: WishlistItem[];
  hydrated: boolean;
  setItems: (items: WishlistItem[]) => void;
  addItem: (item: WishlistItem) => void;
  removeItem: (targetId: string) => void;
  isWishlisted: (targetId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      hydrated: false,
      setItems: (items) => set({ items, hydrated: true }),
      addItem: (item) =>
        set((s) => {
          if (s.items.find((i) => i.targetId === item.targetId)) return s;
          return { items: [...s.items, item] };
        }),
      removeItem: (targetId) =>
        set((s) => ({ items: s.items.filter((i) => i.targetId !== targetId) })),
      isWishlisted: (targetId) => get().items.some((i) => i.targetId === targetId),
      clearWishlist: () => set({ items: [] }),
    }),
    { name: "btwoc-wishlist" }
  )
);
