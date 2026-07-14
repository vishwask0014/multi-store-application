import { create } from "zustand";
import type { ProductData, ServiceData, StoreData } from "@/types";

interface InventoryStore {
  products: ProductData[];
  services: ServiceData[];
  stores: StoreData[];
  loaded: boolean;
  loading: boolean;
  fetchAll: () => Promise<void>;
  addProduct: (p: Omit<ProductData, "id">) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  addStore: (store: { name: string; tag?: string; images?: string[] }) => Promise<any>;
  addService: (s: Omit<ServiceData, "id" | "products"> & { productIds: string[]; storeId?: string }) => Promise<void>;
  removeService: (id: string) => Promise<void>;
}

export const useInventoryStore = create<InventoryStore>()((set, get) => ({
  products: [],
  services: [],
  stores: [],
  loaded: false,
  loading: false,

  fetchAll: async () => {
    if (get().loaded || get().loading) return;
    set({ loading: true });
    try {
      const [productsRaw, servicesRaw, storesRaw] = await Promise.all([
        fetch("/api/products").then((r) => r.json()),
        fetch("/api/services").then((r) => r.json()),
        fetch("/api/stores").then((r) => r.json()),
      ]);

      const mapId = (item: any) => ({ ...item, id: item._id || item.id });
      const mapProducts = (prods: any[]) =>
        prods.map((p: any) => ({
          ...mapId(p),
          products: p.products?.map(mapId) || [],
        }));

      set({
        products: productsRaw.map(mapId),
        services: mapProducts(servicesRaw),
        stores: storesRaw.map(mapId),
        loaded: true,
        loading: false,
      });
    } catch {
      set({ loading: false });
    }
  },

  addProduct: async (p) => {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(p),
    });
    const created = await res.json();
    set((s) => ({ products: [...s.products, { ...created, id: created._id || created.id }] }));
  },

  addStore: async (store: { name: string; tag?: string; images?: string[] }) => {
    const res = await fetch("/api/stores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...store, tag: store.tag || "Fulfilled", images: store.images || [] }),
    });
    const created = await res.json();
    set((s) => ({ stores: [...s.stores, { ...created, id: created._id || created.id }] }));
    return created;
  },

  removeProduct: async (id) => {
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    set((s) => ({
      products: s.products.filter((p) => p.id !== id),
      services: s.services.map((svc) => ({
        ...svc,
        products: svc.products.filter((p: any) => p.id !== id && p._id !== id),
        productCount: Math.max(0, svc.productCount - 1),
      })),
    }));
  },

  addService: async (input) => {
    const res = await fetch("/api/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: input.title,
        price: input.price,
        rating: input.rating,
        description: input.description,
        image: input.image,
        ...(input.storeId ? { storeId: input.storeId } : {}),
        productCount: input.productIds.length,
        products: input.productIds,
      }),
    });
    const created = await res.json();
    set((s) => ({
      services: [
        ...s.services,
        { ...created, id: created._id || created.id, products: created.products || [] },
      ],
    }));
  },

  removeService: async (id) => {
    await fetch(`/api/services/${id}`, { method: "DELETE" });
    set((s) => ({ services: s.services.filter((svc) => svc.id !== id) }));
  },
}));
