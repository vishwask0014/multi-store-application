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
  updateProduct: (id: string, data: Record<string, unknown>) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  addStore: (store: { name: string; tag?: string; images?: string[]; ownerUid?: string; description?: string; address?: string; city?: string; coverage?: number }) => Promise<any>;
  updateStore: (id: string, data: Record<string, unknown>) => Promise<void>;
  removeStore: (id: string) => Promise<void>;
  addService: (s: Omit<ServiceData, "id" | "products"> & { productIds: string[]; storeId?: string }) => Promise<void>;
  updateService: (id: string, data: Record<string, unknown>) => Promise<void>;
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

      const extractList = (res: any) => (res.products || res.services || res.stores || res);

      const mapId = (item: any) => ({ ...item, id: item._id || item.id });
      const mapProducts = (prods: any[]) =>
        prods.map((p: any) => ({
          ...mapId(p),
          products: p.products?.map(mapId) || [],
        }));

      set({
        products: extractList(productsRaw).map(mapId),
        services: mapProducts(extractList(servicesRaw)),
        stores: extractList(storesRaw).map(mapId),
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

  updateProduct: async (id, data) => {
    const res = await fetch(`/api/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const updated = await res.json();
    set((s) => ({
      products: s.products.map((p) =>
        p.id === id ? { ...p, ...updated, id: updated._id || updated.id } : p
      ),
    }));
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

  addStore: async (store) => {
    const res = await fetch("/api/stores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...store, tag: store.tag || "Fulfilled", images: store.images || [] }),
    });
    const created = await res.json();
    set((s) => ({ stores: [...s.stores, { ...created, id: created._id || created.id }] }));
    return created;
  },

  updateStore: async (id, data) => {
    const res = await fetch(`/api/stores/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const updated = await res.json();
    set((s) => ({
      stores: s.stores.map((st) =>
        st.id === id ? { ...st, ...updated, id: updated._id || updated.id } : st
      ),
    }));
  },

  removeStore: async (id) => {
    await fetch(`/api/stores/${id}`, { method: "DELETE" });
    set((s) => ({
      stores: s.stores.filter((st) => st.id !== id),
      products: s.products.filter((p) => p.storeId !== id),
      services: s.services.filter((svc) => svc.storeId !== id),
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

  updateService: async (id, data) => {
    const res = await fetch(`/api/services/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const updated = await res.json();
    set((s) => ({
      services: s.services.map((svc) =>
        svc.id === id ? { ...svc, ...updated, id: updated._id || updated.id } : svc
      ),
    }));
  },

  removeService: async (id) => {
    await fetch(`/api/services/${id}`, { method: "DELETE" });
    set((s) => ({ services: s.services.filter((svc) => svc.id !== id) }));
  },
}));
