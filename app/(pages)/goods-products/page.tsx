"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  PackageIcon,
  ShoppingBagIcon,
  StarIcon,
  HeartIcon,
  AddIcon,
  ServiceIcon,
  ArrowRightIcon,
} from "@hugeicons/core-free-icons";
import SidebarLayout from "@/app/components/Common/SidebarLayout";
import { products, services } from "@/mock";

const serviceMap = Object.fromEntries(
  services.map((s) => [s.title, s])
);

export default function GoodsProductsPage() {
  return (
    <SidebarLayout>
      <div className="mx-auto max-w-7xl">
        <div className="px-6 pt-8 pb-16 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <HugeiconsIcon icon={PackageIcon} size={20} />
                </div>
                <h1 className="text-2xl font-medium tracking-tight text-text-primary">
                  Goods & Products
                </h1>
              </div>
              <p className="text-sm text-text-muted">
                Browse all products — buy individually or as part of a service
              </p>
            </div>
            <a
              href="/goods-products/create"
              className="group relative hidden items-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-primary to-primary-hover px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] sm:inline-flex"
            >
              <span className="absolute inset-0 translate-y-full bg-white/10 transition-transform duration-300 group-hover:translate-y-0" />
              <span className="relative flex items-center gap-1.5">
                <HugeiconsIcon icon={AddIcon} size={16} />
                Create Product
              </span>
            </a>
          </div>
          <a
            href="/goods-products/create"
            className="mb-4 flex items-center justify-center gap-2 rounded-lg border border-dashed border-primary/30 bg-primary/5 px-4 py-3 text-sm font-medium text-primary transition-all duration-200 hover:bg-primary/10 sm:hidden"
          >
            <HugeiconsIcon icon={AddIcon} size={16} />
            Create Product
          </a>

          <div className="mb-6 flex items-center gap-2 text-sm">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {products.length} products
            </span>
            <span className="rounded-full bg-surface-raised/50 px-3 py-1 text-xs font-medium text-text-muted">
              from {services.length} services
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.title} {...p} />
            ))}
          </div>

          {products.length === 0 && (
            <div className="mt-20 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-raised/50 text-text-muted ring-1 ring-border/50">
                <HugeiconsIcon icon={ShoppingBagIcon} size={28} />
              </div>
              <p className="text-sm text-text-muted">No products yet</p>
            </div>
          )}
        </div>
      </div>
    </SidebarLayout>
  );
}

function ProductCard({
  title,
  price,
  rating,
  image,
  serviceName,
}: {
  title: string;
  price: number;
  rating: number;
  type: string;
  image?: string;
  serviceName?: string;
}) {
  const svc = serviceName ? serviceMap[serviceName] : null;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border/50 bg-surface transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10">
      <div className="relative aspect-[4/3] bg-gradient-to-br from-surface-raised to-surface">
        {image && (
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover"
          />
        )}
        <button className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg bg-base/60 text-text-muted backdrop-blur-sm transition-colors hover:bg-base/80 hover:text-red-400">
          <HugeiconsIcon icon={HeartIcon} size={14} />
        </button>
      </div>
      <div className="flex flex-1 flex-col justify-between space-y-2 p-4">
        <h3 className="text-sm font-medium leading-snug text-text-primary line-clamp-2">
          {title}
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-md bg-warning/10 px-1.5 py-0.5">
              <HugeiconsIcon icon={StarIcon} size={11} className="text-warning" />
              <span className="text-[11px] font-medium text-warning">
                {rating.toFixed(1)}
              </span>
            </div>
            <span className="text-xs text-text-muted">240 sold</span>
          </div>
          {svc && (
            <a
              href="/services"
              className="group/service inline-flex items-center gap-1 rounded-full bg-primary/8 px-2.5 py-0.5 text-[11px] font-medium text-primary ring-1 ring-primary/15 transition-all duration-200 hover:bg-primary/15 hover:ring-primary/30"
            >
              <HugeiconsIcon icon={ServiceIcon} size={11} />
              Part of {svc.title}
              <HugeiconsIcon
                icon={ArrowRightIcon}
                size={10}
                className="-mr-0.5 opacity-0 transition-all duration-200 group-hover/service:opacity-100 group-hover/service:translate-x-0.5"
              />
            </a>
          )}
          <div className="flex items-center justify-between pt-0.5">
            <div>
              <p className="text-sm font-semibold text-accent">
                ${price.toFixed(2)}
              </p>
              <p className="text-[11px] text-text-muted line-through">
                ${(price * 1.25).toFixed(2)}
              </p>
            </div>
            <button className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20">
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
