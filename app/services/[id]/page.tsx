"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ServiceIcon,
  StarIcon,
  ClockIcon,
  CalendarIcon,
  Store01Icon,
  Tick01Icon,
  ArrowLeft02Icon,
} from "@hugeicons/core-free-icons";
import { useCartStore } from "@/stores/useCartStore";
import { useInventoryStore } from "@/stores/useInventoryStore";
import type { ServiceData, StoreData } from "@/types";

export default function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { stores } = useInventoryStore();
  const [service, setService] = useState<ServiceData | null>(null);
  const [store, setStore] = useState<StoreData | null>(null);
  const [related, setRelated] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const addBooking = useCartStore((s) => s.addBooking);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/services/${id}`)
      .then((r) => r.json())
      .then((data) => {
        const s = { ...data, id: data._id || data.id, products: (data.products || []).map((p: any) => ({ ...p, id: p._id || p.id })) };
        setService(s);
        if (s.storeId) {
          const st = stores.find((st) => st.id === s.storeId);
          setStore(st || null);
        }
        return s;
      })
      .then((s) => {
        const cat = s.categories?.[0];
        if (cat) {
          fetch(`/api/services?category=${encodeURIComponent(cat)}&limit=5`)
            .then((r) => r.json())
            .then((res) => {
              const list = (Array.isArray(res) ? res : res.services || [])
                .filter((rs: any) => (rs._id || rs.id) !== id)
                .slice(0, 4)
                .map((rs: any) => ({ ...rs, id: rs._id || rs.id }));
              setRelated(list);
            });
        }
      })
      .finally(() => setLoading(false));
  }, [id, stores]);

  const generateTimeSlots = () => {
    const slots: string[] = [];
    if (!service?.duration) return slots;
    let start = 9 * 60;
    const end = 18 * 60;
    while (start + service.duration <= end) {
      const h = Math.floor(start / 60);
      const m = start % 60;
      slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
      start += service.duration + (service.bufferTime || 0);
    }
    return slots;
  };

  const getNext7Days = () => {
    const days: { label: string; value: string; full: string }[] = [];
    const workingDays = service?.workingDays || ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

    for (let i = 0; i < 14; i++) {
      const d = new Date(Date.now() + i * 86400000);
      const dayName = dayNames[d.getDay()];
      if (workingDays.includes(dayName)) {
        days.push({
          label: d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
          value: d.toISOString().split("T")[0],
          full: d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }),
        });
      }
    }
    return days;
  };

  const timeSlots = generateTimeSlots();
  const availableDates = getNext7Days();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-base gap-4">
        <p className="text-sm text-text-muted">Service not found</p>
        <a href="/shop" className="text-xs text-primary underline">Go to marketplace</a>
      </div>
    );
  }

  const allImages = [service.image, ...(service.gallery || [])].filter(Boolean);

  return (
    <div className="min-h-screen bg-base">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <button onClick={() => window.history.back()} className="mb-4 flex items-center gap-1.5 text-xs text-text-muted transition-colors hover:text-text-secondary">
          <HugeiconsIcon icon={ArrowLeft02Icon} size={14} />
          Back
        </button>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-3">
            {allImages.length > 0 && (
              <div className="aspect-square overflow-hidden rounded-2xl bg-surface-raised ring-1 ring-border/30">
                <img src={allImages[0]} alt={service.title} className="h-full w-full object-cover" />
              </div>
            )}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {allImages.slice(1).map((url, i) => (
                  <div key={i} className="h-16 w-16 shrink-0 overflow-hidden rounded-lg ring-1 ring-border/30">
                    <img src={url} alt="" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-5">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-text-primary">{service.title}</h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 rounded-md bg-warning/10 px-2 py-0.5">
                <HugeiconsIcon icon={StarIcon} size={14} className="text-warning" />
                <span className="text-sm font-medium text-warning">{service.rating.toFixed(1)}</span>
              </div>
              {service.categories?.map((c) => (
                <span key={c} className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">{c}</span>
              ))}
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-accent">${service.price.toFixed(2)}</span>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <HugeiconsIcon icon={ClockIcon} size={16} />
                <span>{service.duration} min</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <HugeiconsIcon icon={CalendarIcon} size={16} />
                <span>Up to {service.maxBookings} bookings/day</span>
              </div>
            </div>

            {service.description && (
              <div>
                <h3 className="mb-2 text-sm font-medium text-text-primary">Description</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{service.description}</p>
              </div>
            )}

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

            <div className="rounded-xl border border-border/50 bg-surface/60 p-5 space-y-4">
              <h3 className="text-sm font-medium text-text-primary">Book This Service</h3>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">Select Date</label>
                <div className="flex flex-wrap gap-1.5">
                  {availableDates.map((d) => (
                    <button key={d.value} onClick={() => { setSelectedDate(d.value); setSelectedTime(""); }}
                      className={`rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                        selectedDate === d.value
                          ? "border-primary/40 bg-primary/10 text-primary"
                          : "border-border/50 text-text-muted hover:border-border-strong hover:text-text-secondary"
                      }`}>
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {selectedDate && (
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-text-secondary">Select Time</label>
                  <div className="flex flex-wrap gap-1.5">
                    {timeSlots.map((t) => (
                      <button key={t} onClick={() => setSelectedTime(t)}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                          selectedTime === t
                            ? "border-primary/40 bg-primary/10 text-primary"
                            : "border-border/50 text-text-muted hover:border-border-strong hover:text-text-secondary"
                        }`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                disabled={!selectedDate || !selectedTime}
                onClick={() => {
                  addBooking({
                    title: service.title,
                    price: service.price,
                    date: selectedDate,
                    time: selectedTime,
                    image: service.image,
                  });
                }}
                className="w-full rounded-xl bg-gradient-to-r from-primary to-primary-hover py-3 text-sm font-medium text-white shadow-lg shadow-primary/20 transition-all hover:shadow-xl disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Book Now — ${service.price.toFixed(2)}
              </button>
            </div>
          </div>
        </div>

        {service.products && service.products.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-4 text-lg font-medium text-text-primary">Included Products ({service.products.length})</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {service.products.map((p) => (
                <a key={p.id} href={`/products/${p.id}`} className="rounded-xl border border-border/50 bg-surface/50 p-3 transition-colors hover:border-primary/40">
                  <div className="mb-2 aspect-square overflow-hidden rounded-lg bg-surface-raised">
                    <img src={p.image} alt={p.title} className="h-full w-full object-cover" />
                  </div>
                  <p className="truncate text-xs font-medium text-text-primary">{p.title}</p>
                  <p className="text-xs text-accent">${p.price.toFixed(2)}</p>
                </a>
              ))}
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-4 text-lg font-medium text-text-primary">Related Services</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {related.map((rs) => (
                <a key={rs.id} href={`/services/${rs.id}`} className="group rounded-xl border border-border/50 bg-surface/50 p-3 transition-all hover:border-primary/40">
                  <div className="mb-2 aspect-square overflow-hidden rounded-lg bg-surface-raised">
                    <img src={rs.image} alt={rs.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                  </div>
                  <p className="truncate text-xs font-medium text-text-primary">{rs.title}</p>
                  <p className="text-xs text-accent">${rs.price.toFixed(2)}</p>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
