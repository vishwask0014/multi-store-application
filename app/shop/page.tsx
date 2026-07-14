"use client";

import { useRouter } from "next/navigation";
import { useInventoryStore } from "@/stores/useInventoryStore";
import { useCartStore } from "@/stores/useCartStore";
import { HugeiconsIcon } from "@hugeicons/react";
import { StarIcon, ShoppingBagIcon, CalendarIcon, ArrowLeft02Icon } from "@hugeicons/core-free-icons";

interface ShopItem {
  key: string;
  id: string;
  title: string;
  price: number;
  rating: number;
  type: "item" | "service";
  image: string;
  description?: string;
}

export default function ShopPage() {
  const router = useRouter();
  const { products, services } = useInventoryStore();
  const addItem = useCartStore((s) => s.addItem);
  const addBooking = useCartStore((s) => s.addBooking);

  const allItems: ShopItem[] = [
    ...services.map((s) => ({
      key: `service-${s.id}`,
      id: s.id,
      title: s.title,
      price: s.price,
      rating: s.rating,
      type: "service" as const,
      image: s.image,
      description: s.description,
    })),
    ...products.map((p) => ({
      key: `product-${p.id}`,
      id: p.id,
      title: p.title,
      price: p.price,
      rating: p.rating,
      type: p.type as "item" | "service",
      image: p.image,
    })),
  ];

  const handleAdd = (item: ShopItem) => {
    if (item.type === "service") {
      addBooking({
        title: item.title,
        price: item.price,
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
          month: "short", day: "numeric", year: "numeric",
        }),
        time: "10:00 AM",
        image: item.image,
      });
    } else {
      addItem({ id: item.id, title: item.title, price: item.price, type: item.type, image: item.image });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-base)]">
      <header className="sticky top-0 z-30 border-b border-border/50 bg-base/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface-raised/50 hover:text-text-primary"
            >
              <HugeiconsIcon icon={ArrowLeft02Icon} size={18} />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-text-primary">Browse All</h1>
              <p className="text-sm text-text-muted">{allItems.length} items & services available</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Items
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-accent" />
              Services
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {allItems.map((item) => (
            <div
              key={item.key}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-border/50 bg-surface transition-all duration-300 hover:border-border hover:shadow-lg hover:shadow-black/10"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-surface-raised to-surface">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute left-2 top-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                      item.type === "service"
                        ? "bg-accent/10 text-accent ring-1 ring-accent/20"
                        : "bg-primary/10 text-primary ring-1 ring-primary/20"
                    }`}
                  >
                    <HugeiconsIcon
                      icon={item.type === "service" ? CalendarIcon : ShoppingBagIcon}
                      size={10}
                    />
                    {item.type}
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-2 p-3">
                <h3 className="text-xs font-medium leading-snug text-text-primary line-clamp-2">
                  {item.title}
                </h3>

                {item.description && (
                  <p className="text-[10px] leading-relaxed text-text-muted line-clamp-2">
                    {item.description}
                  </p>
                )}

                <div className="flex items-center gap-1.5">
                  <HugeiconsIcon icon={StarIcon} size={11} className="text-warning" />
                  <span className="text-[11px] font-medium text-warning">
                    {item.rating.toFixed(1)}
                  </span>
                  <span className="text-[10px] text-text-muted">(120)</span>
                </div>

                <div className="mt-auto flex items-center justify-between pt-1">
                  <p className="text-sm font-semibold text-text-primary">
                    ${item.price.toFixed(2)}
                  </p>
                  <button
                    onClick={() => handleAdd(item)}
                    className="rounded-lg bg-primary/10 px-2.5 py-1.5 text-[11px] font-medium text-primary transition-all duration-200 hover:bg-primary/20 active:scale-95"
                  >
                    {item.type === "service" ? "Book now" : "Add to cart"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
