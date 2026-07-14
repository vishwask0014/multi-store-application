"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Store01Icon,
  ShoppingBagIcon,
  ServiceIcon,
  Tick01Icon,
  AddIcon,
  ImageIcon,
  PackageIcon,
  DeleteIcon,
  StarIcon,
} from "@hugeicons/core-free-icons";
import Modal from "./Modal";
import { useInventoryStore } from "@/stores/useInventoryStore";

const tabs = [
  { key: "store", label: "Store", icon: Store01Icon },
  { key: "products", label: "Products", icon: ShoppingBagIcon },
  { key: "services", label: "Services", icon: ServiceIcon },
];

const placeholderImgs = [
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1531346878377-1270d5fe5b8b?w=400&h=300&fit=crop",
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function StoreManagerModal({ open, onClose }: Props) {
  const { stores, products, services, addStore, addProduct, addService } = useInventoryStore();
  const [activeTab, setActiveTab] = useState("store");

  const [storeName, setStoreName] = useState("");
  const [storeImages, setStoreImages] = useState<string[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);

  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");

  const [serviceName, setServiceName] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [serviceDesc, setServiceDesc] = useState("");
  const [serviceProducts, setServiceProducts] = useState<string[]>([]);

  const currentStore = stores.find((s) => s.id === selectedStoreId);
  const storeProducts = products.filter((p) => p.storeId === selectedStoreId);

  const handleAddStore = async () => {
    if (!storeName.trim()) return;
    const created = await addStore({
      name: storeName.trim(),
      images: storeImages.length > 0 ? storeImages : [placeholderImgs[0]],
    });
    setSelectedStoreId(created.id || created._id);
    setStoreName("");
    setStoreImages([]);
    setActiveTab("products");
  };

  const handleAddProduct = async () => {
    if (!productName.trim() || !productPrice || !selectedStoreId) return;
    await addProduct({
      title: productName.trim(),
      price: Number(productPrice),
      rating: 4.0,
      type: "item",
      storeId: selectedStoreId,
      image: placeholderImgs[Math.floor(Math.random() * placeholderImgs.length)],
    });
    setProductName("");
    setProductPrice("");
  };

  const handleAddService = async () => {
    if (!serviceName.trim() || !servicePrice || !selectedStoreId) return;
    await addService({
      title: serviceName.trim(),
      price: Number(servicePrice),
      rating: 4.0,
      description: serviceDesc,
      image: placeholderImgs[Math.floor(Math.random() * placeholderImgs.length)],
      storeId: selectedStoreId,
      productCount: serviceProducts.length,
      productIds: serviceProducts,
    });
    setServiceName("");
    setServicePrice("");
    setServiceDesc("");
    setServiceProducts([]);
  };

  const handleStoreSelect = (id: string) => {
    setSelectedStoreId(id);
    setActiveTab("products");
  };

  return (
    <Modal open={open} onClose={onClose} title="Store Manager" maxWidth="max-w-3xl">
      {/* Tab bar */}
      <div className="-mx-6 mb-6 border-b border-border/30 px-6">
        <div className="flex gap-1">
          {tabs.map((tab) => {
            const active = activeTab === tab.key;
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-xs font-medium transition-all ${
                  active
                    ? "border-primary text-primary"
                    : "border-transparent text-text-muted hover:text-text-secondary"
                }`}
              >
                <HugeiconsIcon icon={Icon} size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Store tab */}
      {activeTab === "store" && (
        <div className="space-y-6">
          {/* Existing stores */}
          {stores.length > 0 && (
            <div>
              <p className="mb-3 text-xs font-medium text-text-secondary">Select a store to manage</p>
              <div className="grid grid-cols-2 gap-2">
                {stores.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleStoreSelect(s.id)}
                    className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                      selectedStoreId === s.id
                        ? "border-primary/40 bg-primary/10"
                        : "border-border/50 hover:border-border-strong"
                    }`}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-surface-raised text-primary">
                      <HugeiconsIcon icon={Store01Icon} size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-text-primary">{s.name}</p>
                      <p className="text-[11px] text-text-muted">{s.offeringCount} offerings</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Create new store */}
          <div>
            <p className="mb-3 text-xs font-medium text-text-secondary">
              {stores.length > 0 ? "Or create a new store" : "Create your first store"}
            </p>
            <div className="space-y-3 rounded-xl border border-border/50 bg-base p-4">
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="Store name..."
                className="w-full rounded-lg border border-border/50 bg-surface px-3 py-2 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-primary/50"
              />
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={storeImages.join(", ")}
                  onChange={(e) => setStoreImages(e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
                  placeholder="Image URLs (comma-separated)"
                  className="flex-1 rounded-lg border border-border/50 bg-surface px-3 py-2 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-primary/50"
                />
                <button
                  onClick={handleAddStore}
                  disabled={!storeName.trim()}
                  className="shrink-0 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products tab */}
      {activeTab === "products" && (
        <div className="space-y-5">
          {/* Store selector */}
          {!selectedStoreId && stores.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-medium text-text-secondary">Select a store first</p>
              <div className="flex flex-wrap gap-2">
                {stores.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedStoreId(s.id)}
                    className="rounded-lg border border-border/50 bg-base px-3 py-1.5 text-xs font-medium text-text-primary transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedStoreId && (
            <>
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-text-secondary">
                  Products in <span className="text-text-primary">{currentStore?.name || "..."}</span>
                </p>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                  {storeProducts.length}
                </span>
              </div>

              {/* Product list */}
              {storeProducts.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {storeProducts.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center gap-3 rounded-lg border border-border/30 bg-base p-2.5"
                    >
                      <div className="h-8 w-8 shrink-0 overflow-hidden rounded-md bg-surface-raised">
                        <img src={p.image} alt="" className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-text-primary">{p.title}</p>
                        <p className="text-[11px] text-accent">${p.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add product form */}
              <div className="space-y-3 rounded-xl border border-border/50 bg-base p-4">
                <p className="text-xs font-medium text-text-secondary">Add Product</p>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Product name..."
                  className="w-full rounded-lg border border-border/50 bg-surface px-3 py-2 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-primary/50"
                />
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-text-muted">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={productPrice}
                      onChange={(e) => setProductPrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full rounded-lg border border-border/50 bg-surface py-2 pl-7 pr-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-primary/50"
                    />
                  </div>
                  <button
                    onClick={handleAddProduct}
                    disabled={!productName.trim() || !productPrice}
                    className="shrink-0 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Services tab */}
      {activeTab === "services" && (
        <div className="space-y-5">
          {/* Store selector */}
          {!selectedStoreId && stores.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-medium text-text-secondary">Select a store first</p>
              <div className="flex flex-wrap gap-2">
                {stores.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedStoreId(s.id)}
                    className="rounded-lg border border-border/50 bg-base px-3 py-1.5 text-xs font-medium text-text-primary transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedStoreId && (
            <>
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-text-secondary">
                  Services in <span className="text-text-primary">{currentStore?.name || "..."}</span>
                </p>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                  {services.filter((s) => s.storeId === selectedStoreId).length}
                </span>
              </div>

              {/* Service list */}
              {services.filter((s) => s.storeId === selectedStoreId).length > 0 && (
                <div className="space-y-2">
                  {services.filter((s) => s.storeId === selectedStoreId).map((svc) => (
                    <div
                      key={svc.id}
                      className="flex items-center gap-3 rounded-lg border border-border/30 bg-base p-3"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <HugeiconsIcon icon={ServiceIcon} size={16} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-text-primary">{svc.title}</p>
                        <p className="text-xs text-text-muted">{svc.productCount} product(s) · ${svc.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add service form */}
              <div className="space-y-3 rounded-xl border border-border/50 bg-base p-4">
                <p className="text-xs font-medium text-text-secondary">Add Service</p>
                <input
                  type="text"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  placeholder="Service name..."
                  className="w-full rounded-lg border border-border/50 bg-surface px-3 py-2 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-primary/50"
                />
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-text-muted">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={servicePrice}
                      onChange={(e) => setServicePrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full rounded-lg border border-border/50 bg-surface py-2 pl-7 pr-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-primary/50"
                    />
                  </div>
                </div>
                <textarea
                  value={serviceDesc}
                  onChange={(e) => setServiceDesc(e.target.value)}
                  placeholder="Description (optional)"
                  rows={2}
                  className="w-full resize-none rounded-lg border border-border/50 bg-surface px-3 py-2 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-primary/50"
                />

                {/* Product picker */}
                {storeProducts.length > 0 && (
                  <div>
                    <p className="mb-1.5 text-xs text-text-muted">Apply to products:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {storeProducts.map((p) => {
                        const selected = serviceProducts.includes(p.id);
                        return (
                          <button
                            key={p.id}
                            onClick={() =>
                              setServiceProducts((prev) =>
                                prev.includes(p.id) ? prev.filter((id) => id !== p.id) : [...prev, p.id]
                              )
                            }
                            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all ${
                              selected
                                ? "border-primary/40 bg-primary/10 text-primary"
                                : "border-border/30 text-text-muted hover:border-border-strong hover:text-text-secondary"
                            }`}
                          >
                            {selected && <HugeiconsIcon icon={Tick01Icon} size={10} />}
                            {p.title}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <button
                  onClick={handleAddService}
                  disabled={!serviceName.trim() || !servicePrice}
                  className="w-full rounded-lg bg-gradient-to-r from-primary to-primary-hover py-2.5 text-xs font-medium text-white shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Add Service
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </Modal>
  );
}
