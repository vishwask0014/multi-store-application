"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ShoppingBagIcon,
  StarIcon,
  HeartIcon,
  ShareIcon,
  Store01Icon,
  Tick01Icon,
  ArrowLeft02Icon,
} from "@hugeicons/core-free-icons";
import { useCartStore } from "@/stores/useCartStore";
import { useInventoryStore } from "@/stores/useInventoryStore";
import type { ProductData, StoreData } from "@/types";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { stores } = useInventoryStore();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [store, setStore] = useState<StoreData | null>(null);
  const [related, setRelated] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((data) => {
        const p = { ...data, id: data._id || data.id };
        setProduct(p);
        if (p.storeId) {
          const s = stores.find((st) => st.id === p.storeId);
          setStore(s || null);
        }
        return p;
      })
      .then((p) => {
        if (p.category) {
          fetch(`/api/products?category=${encodeURIComponent(p.category)}&limit=5`)
            .then((r) => r.json())
            .then((res) => {
              const list = (Array.isArray(res) ? res : res.products || [])
                .filter((rp: any) => (rp._id || rp.id) !== id)
                .slice(0, 4)
                .map((rp: any) => ({ ...rp, id: rp._id || rp.id }));
              setRelated(list);
            });
        }
      })
      .finally(() => setLoading(false));
  }, [id, stores]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-base gap-4">
        <p className="text-sm text-text-muted">Product not found</p>
        <a href="/shop" className="text-xs text-primary underline">Go to marketplace</a>
      </div>
    );
  }

  const allImages = [product.image, ...(product.gallery || [])].filter(Boolean);
  const inStock = (product.inventory ?? -1) === -1 || (product.inventory ?? 0) > 0;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPct = hasDiscount ? Math.round(((product.price - product.discountPrice!) / product.price) * 100) : 0;

  return (
    <div className="min-h-screen bg-base">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <button onClick={() => window.history.back()} className="mb-4 flex items-center gap-1.5 text-xs text-text-muted transition-colors hover:text-text-secondary">
          <HugeiconsIcon icon={ArrowLeft02Icon} size={14} />
          Back
        </button>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-3">
            <div className="aspect-square overflow-hidden rounded-2xl bg-surface-raised ring-1 ring-border/30">
              <img src={allImages[selectedImage]} alt={product.title} className="h-full w-full object-cover" />
            </div>
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {allImages.map((url, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg ring-1 transition-all ${
                      i === selectedImage ? "ring-primary ring-2" : "ring-border/30 hover:ring-border"
                    }`}>
                    <img src={url} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-5">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-text-primary">{product.title}</h1>
              {product.sku && <p className="mt-1 text-xs text-text-muted">SKU: {product.sku}</p>}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 rounded-md bg-warning/10 px-2 py-0.5">
                <HugeiconsIcon icon={StarIcon} size={14} className="text-warning" />
                <span className="text-sm font-medium text-warning">{product.rating.toFixed(1)}</span>
              </div>
              {product.category && (
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">{product.category}</span>
              )}
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-accent">${(hasDiscount ? product.discountPrice! : product.price).toFixed(2)}</span>
              {hasDiscount && (
                <>
                  <span className="text-sm text-text-muted line-through">${product.price.toFixed(2)}</span>
                  <span className="rounded-full bg-danger/10 px-2 py-0.5 text-[11px] font-medium text-danger">-{discountPct}%</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-3 text-sm">
              <span className={`flex items-center gap-1.5 ${inStock ? "text-success" : "text-danger"}`}>
                <HugeiconsIcon icon={inStock ? Tick01Icon : ShoppingBagIcon} size={14} />
                {inStock ? `In Stock${product.inventory ? ` (${product.inventory} units)` : ""}` : "Out of Stock"}
              </span>
            </div>

            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {product.tags.map((t) => (
                  <span key={t} className="rounded-full bg-surface-raised/50 px-2.5 py-0.5 text-[11px] text-text-muted ring-1 ring-border/30">{t}</span>
                ))}
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => addItem({ id: product.id, title: product.title, price: product.price, type: product.type, image: product.image })}
                disabled={!inStock}
                className="flex-1 rounded-xl bg-gradient-to-r from-primary to-primary-hover py-3 text-sm font-medium text-white shadow-lg shadow-primary/20 transition-all hover:shadow-xl disabled:opacity-30 disabled:cursor-not-allowed">
                Add to Cart
              </button>
              <button className="flex h-11 w-11 items-center justify-center rounded-xl border border-border/50 text-text-muted transition-colors hover:border-primary/40 hover:text-primary">
                <HugeiconsIcon icon={HeartIcon} size={18} />
              </button>
              <button className="flex h-11 w-11 items-center justify-center rounded-xl border border-border/50 text-text-muted transition-colors hover:border-primary/40 hover:text-primary">
                <HugeiconsIcon icon={ShareIcon} size={18} />
              </button>
            </div>

            {store && (
              <a href={`/stores/${store.slug || store.id}`} className="flex items-center gap-3 rounded-xl border border-border/50 bg-surface/50 p-4 transition-colors hover:border-primary/40">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <HugeiconsIcon icon={Store01Icon} size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">{store.name}</p>
                  <p className="text-xs text-text-muted">View store</p>
                </div>
              </a>
            )}

            {product.description && (
              <div>
                <h3 className="mb-2 text-sm font-medium text-text-primary">Description</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{product.description}</p>
              </div>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-4 text-lg font-medium text-text-primary">Related Products</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {related.map((rp) => (
                <a key={rp.id} href={`/products/${rp.id}`} className="group rounded-xl border border-border/50 bg-surface/50 p-3 transition-all hover:border-primary/40">
                  <div className="mb-2 aspect-square overflow-hidden rounded-lg bg-surface-raised">
                    <img src={rp.image} alt={rp.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                  </div>
                  <p className="truncate text-xs font-medium text-text-primary">{rp.title}</p>
                  <p className="text-xs text-accent">${rp.price.toFixed(2)}</p>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
