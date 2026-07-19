"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Store01Icon,
  StarIcon,
  ClockIcon,
  MapPinIcon,
  Mail01Icon,
  GlobeIcon,
  InstagramIcon,
  FacebookIcon,
  TwitterIcon,
  CallIcon,
  ArrowLeft02Icon,
  ShoppingBagIcon,
  CalendarIcon,
} from "@hugeicons/core-free-icons";
import { useCartStore } from "@/stores/useCartStore";
import type { StoreData, ProductData, ServiceData } from "@/types";

interface StoreDetail extends StoreData {
  products?: ProductData[];
  services?: ServiceData[];
}

const statusStyles: Record<string, string> = {
  open: "bg-success/10 text-success ring-1 ring-success/20",
  closed: "bg-danger/10 text-danger ring-1 ring-danger/20",
  temporarily_closed: "bg-warning/10 text-warning ring-1 ring-warning/20",
};

export default function StoreDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [store, setStore] = useState<StoreDetail | null>(null);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((s) => s.addItem);
  const addBooking = useCartStore((s) => s.addBooking);

  useEffect(() => {
    if (!slug) return;
    Promise.all([
      fetch(`/api/stores?search=${encodeURIComponent(slug)}`).then((r) => r.json()),
      fetch(`/api/products?limit=50`).then((r) => r.json()),
      fetch(`/api/services?limit=50`).then((r) => r.json()),
    ]).then(([storeRes, prodRes, svcRes]) => {
      const stores = Array.isArray(storeRes) ? storeRes : storeRes.stores || [];
      const found = stores.find((s: any) => s.slug === slug || s._id === slug) || stores[0] || null;
      setStore(found ? { ...found, id: found._id || found.id } : null);

      const prodList = Array.isArray(prodRes) ? prodRes : prodRes.products || [];
      const svcList = Array.isArray(svcRes) ? svcRes : svcRes.services || [];

      setProducts(
        found ? prodList.filter((p: any) => String(p.storeId) === String(found._id || found.id)).map((p: any) => ({ ...p, id: p._id || p.id })) : []
      );
      setServices(
        found ? svcList.filter((s: any) => String(s.storeId) === String(found._id || found.id)).map((s: any) => ({ ...s, id: s._id || s.id })) : []
      );
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!store) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-base gap-4">
        <p className="text-sm text-text-muted">Store not found</p>
        <a href="/shop" className="text-xs text-primary underline">Go to marketplace</a>
      </div>
    );
  }

  const allDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;
  const today = allDays[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
  const todayHours = store.availability?.find((a) => a.day === today);

  return (
    <div className="min-h-screen bg-base">
      <div className="relative h-48 sm:h-64 bg-gradient-to-br from-surface-raised to-surface">
        {store.banner && <img src={store.banner} alt="" className="h-full w-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-base/80 via-base/20 to-transparent" />
        <button onClick={() => window.history.back()} className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg bg-base/60 text-text-secondary backdrop-blur-sm transition-colors hover:bg-base/80">
          <HugeiconsIcon icon={ArrowLeft02Icon} size={18} />
        </button>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="relative -mt-16 mb-6 flex items-end gap-5">
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border-4 border-base bg-surface shadow-xl">
            {store.logo ? (
              <img src={store.logo} alt="" className="h-full w-full object-cover" />
            ) : (
              <HugeiconsIcon icon={Store01Icon} size={36} className="text-primary" />
            )}
          </div>
          <div className="flex-1 pb-1">
            <h1 className="text-2xl font-semibold tracking-tight text-text-primary">{store.name}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs">
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${statusStyles[store.status || "open"]}`}>
                {(store.status || "open").replace("_", " ")}
              </span>
              {store.categories?.map((c) => (
                <span key={c} className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] text-primary">{c}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {store.description && (
              <section>
                <h2 className="mb-2 text-sm font-medium text-text-primary">About</h2>
                <p className="text-sm text-text-secondary leading-relaxed">{store.description}</p>
              </section>
            )}

            {products.length > 0 && (
              <section>
                <h2 className="mb-3 text-sm font-medium text-text-primary">Products ({products.length})</h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {products.slice(0, 6).map((p) => (
                    <a key={p.id} href={`/products/${p.id}`} className="group rounded-xl border border-border/50 bg-surface/50 p-3 transition-all hover:border-primary/40">
                      <div className="mb-2 aspect-square overflow-hidden rounded-lg bg-surface-raised">
                        <img src={p.image} alt={p.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                      </div>
                      <p className="truncate text-xs font-medium text-text-primary">{p.title}</p>
                      <p className="text-xs text-accent">${p.price.toFixed(2)}</p>
                    </a>
                  ))}
                </div>
              </section>
            )}

            {services.length > 0 && (
              <section>
                <h2 className="mb-3 text-sm font-medium text-text-primary">Services ({services.length})</h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {services.slice(0, 6).map((s) => (
                    <a key={s.id} href={`/services/${s.id}`} className="group rounded-xl border border-border/50 bg-surface/50 p-3 transition-all hover:border-primary/40">
                      <div className="mb-2 aspect-square overflow-hidden rounded-lg bg-surface-raised">
                        <img src={s.image} alt={s.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                      </div>
                      <p className="truncate text-xs font-medium text-text-primary">{s.title}</p>
                      <p className="text-xs text-accent">${s.price.toFixed(2)}</p>
                    </a>
                  ))}
                </div>
              </section>
            )}

            {store.gallery && store.gallery.length > 0 && (
              <section>
                <h2 className="mb-3 text-sm font-medium text-text-primary">Gallery</h2>
                <div className="grid grid-cols-3 gap-2">
                  {store.gallery.map((url, i) => (
                    <div key={i} className="aspect-square overflow-hidden rounded-lg ring-1 ring-border/30">
                      <img src={url} alt="" className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-border/50 bg-surface/60 p-5 space-y-4">
              {todayHours && (
                <div className="flex items-center gap-3 text-sm">
                  <HugeiconsIcon icon={ClockIcon} size={16} className="text-text-muted" />
                  <div>
                    <p className="text-text-primary">
                      {todayHours.closed ? "Closed today" : `${todayHours.open} — ${todayHours.close}`}
                    </p>
                    <p className="text-xs text-text-muted capitalize">{today}</p>
                  </div>
                </div>
              )}

              {store.address && (
                <div className="flex items-start gap-3 text-sm">
                  <HugeiconsIcon icon={MapPinIcon} size={16} className="mt-0.5 text-text-muted" />
                  <div>
                    <p className="text-text-primary">{store.address}</p>
                    {store.city && <p className="text-xs text-text-muted">{store.city}</p>}
                    {store.coverage && <p className="text-xs text-text-muted">Covers up to {store.coverage} km</p>}
                  </div>
                </div>
              )}

              {store.contact?.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <HugeiconsIcon icon={CallIcon} size={16} className="text-text-muted" />
                  <a href={`tel:${store.contact.phone}`} className="text-primary hover:underline">{store.contact.phone}</a>
                </div>
              )}

              {store.contact?.email && (
                <div className="flex items-center gap-3 text-sm">
                  <HugeiconsIcon icon={Mail01Icon} size={16} className="text-text-muted" />
                  <a href={`mailto:${store.contact.email}`} className="text-primary hover:underline">{store.contact.email}</a>
                </div>
              )}

              <div className="flex gap-2">
                {store.socialLinks?.website && (
                  <a href={store.socialLinks.website} target="_blank" className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/30 text-text-muted transition-colors hover:border-primary/40 hover:text-primary">
                    <HugeiconsIcon icon={GlobeIcon} size={14} />
                  </a>
                )}
                {store.socialLinks?.instagram && (
                  <a href={store.socialLinks.instagram} target="_blank" className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/30 text-text-muted transition-colors hover:border-primary/40 hover:text-primary">
                    <HugeiconsIcon icon={InstagramIcon} size={14} />
                  </a>
                )}
                {store.socialLinks?.facebook && (
                  <a href={store.socialLinks.facebook} target="_blank" className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/30 text-text-muted transition-colors hover:border-primary/40 hover:text-primary">
                    <HugeiconsIcon icon={FacebookIcon} size={14} />
                  </a>
                )}
              </div>
            </div>

            {store.availability && (
              <div className="rounded-xl border border-border/50 bg-surface/60 p-5">
                <h3 className="mb-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Business Hours</h3>
                <div className="space-y-1.5">
                  {store.availability.map((slot) => (
                    <div key={slot.day} className={`flex justify-between text-xs ${slot.day === today ? "font-medium text-text-primary" : "text-text-muted"}`}>
                      <span className="capitalize">{slot.day.slice(0, 3)}</span>
                      <span>{slot.closed ? "Closed" : `${slot.open} - ${slot.close}`}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
