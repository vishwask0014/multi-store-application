"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ServiceIcon,
  StarIcon,
  CalendarIcon,
  HeartIcon,
  ShoppingBagIcon,
  AddIcon,
  ArrowRightIcon,
} from "@hugeicons/core-free-icons";
import SidebarLayout from "@/app/components/Common/SidebarLayout";
import { services } from "@/mock";

export default function ServicesPage() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <SidebarLayout>
      <div className="mx-auto max-w-7xl">
        <div className="px-6 pt-8 pb-16 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <HugeiconsIcon icon={ServiceIcon} size={20} />
                </div>
                <h1 className="text-2xl font-medium tracking-tight text-text-primary">
                  Services
                </h1>
              </div>
              <p className="text-sm text-text-muted">
                Browse services with included products — all in one place
              </p>
            </div>
            <a
              href="/services/create"
              className="group relative hidden items-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-primary to-primary-hover px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] sm:inline-flex"
            >
              <span className="absolute inset-0 translate-y-full bg-white/10 transition-transform duration-300 group-hover:translate-y-0" />
              <span className="relative flex items-center gap-1.5">
                <HugeiconsIcon icon={AddIcon} size={16} />
                Create Service
              </span>
            </a>
          </div>
          <a
            href="/services/create"
            className="mb-4 flex items-center justify-center gap-2 rounded-lg border border-dashed border-primary/30 bg-primary/5 px-4 py-3 text-sm font-medium text-primary transition-all duration-200 hover:bg-primary/10 sm:hidden"
          >
            <HugeiconsIcon icon={AddIcon} size={16} />
            Create Service
          </a>

          <div className="mb-6 flex items-center gap-2 text-sm">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {services.length} services
            </span>
            <span className="rounded-full bg-surface-raised/50 px-3 py-1 text-xs font-medium text-text-muted">
              {services.reduce((s, svc) => s + svc.products.length, 0)} products
            </span>
          </div>

          <div className="space-y-4">
            {services.map((svc) => {
              const open = expanded === svc.title;
              return (
                <div
                  key={svc.title}
                  className="overflow-hidden rounded-xl border border-border/50 bg-surface transition-all duration-300 hover:border-primary/30"
                >
                  <button
                    onClick={() => setExpanded(open ? null : svc.title)}
                    className="flex w-full items-start gap-4 p-5 text-left sm:items-center"
                  >
                    <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg sm:h-24 sm:w-36">
                      <img
                        src={svc.image}
                        alt={svc.title}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      <div className="absolute bottom-1.5 left-2 flex items-center gap-1 rounded-full bg-base/70 px-2 py-0.5 text-[10px] font-medium text-text-secondary backdrop-blur-sm">
                        <HugeiconsIcon icon={CalendarIcon} size={10} />
                        Bookable
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-medium text-text-primary">
                        {svc.title}
                      </h3>
                      <p className="mt-0.5 text-sm text-text-muted line-clamp-1">
                        {svc.description}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <div className="flex items-center gap-1 rounded-md bg-warning/10 px-1.5 py-0.5">
                          <HugeiconsIcon icon={StarIcon} size={11} className="text-warning" />
                          <span className="text-[11px] font-medium text-warning">
                            {svc.rating.toFixed(1)}
                          </span>
                        </div>
                        <span className="flex items-center gap-1 text-xs text-text-muted">
                          <HugeiconsIcon icon={ShoppingBagIcon} size={12} />
                          {svc.products.length} products included
                        </span>
                        <span className="text-sm font-semibold text-accent">
                          ${svc.price.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="hidden shrink-0 sm:block">
                      <button className="rounded-lg bg-primary/10 px-4 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/20">
                        Book now
                      </button>
                    </div>

                    <HugeiconsIcon
                      icon={ArrowRightIcon}
                      size={16}
                      className={`shrink-0 text-text-muted transition-transform duration-300 sm:hidden ${open ? "rotate-90" : ""}`}
                    />
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      open ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="border-t border-border/30 px-5 py-4">
                      <p className="mb-3 text-[11px] font-medium uppercase tracking-wider text-text-muted">
                        Included Products
                      </p>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                        {svc.products.map((p) => (
                          <div
                            key={p.title}
                            className="group/product overflow-hidden rounded-lg border border-border/30 bg-base transition-all duration-200 hover:border-primary/30"
                          >
                            <div className="aspect-[4/3] bg-gradient-to-br from-surface-raised to-surface">
                              <img
                                src={p.image}
                                alt={p.title}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="p-2.5">
                              <p className="text-xs font-medium text-text-primary line-clamp-1">
                                {p.title}
                              </p>
                              <p className="mt-0.5 text-xs font-medium text-accent">
                                ${p.price.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 flex items-center gap-3 border-t border-border/20 pt-4">
                        <button className="rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white shadow-sm shadow-primary/20 transition-all hover:bg-primary-hover active:scale-[0.98]">
                          Book this service — ${svc.price.toFixed(2)}
                        </button>
                        <span className="text-xs text-text-muted">
                          or buy products individually below
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setExpanded(open ? null : svc.title)}
                    className="flex w-full items-center justify-center gap-1 border-t border-border/20 py-2 text-xs text-text-muted transition-colors hover:text-text-secondary sm:hidden"
                  >
                    {open ? "Show less" : `View ${svc.products.length} products`}
                    <HugeiconsIcon
                      icon={ArrowRightIcon}
                      size={12}
                      className={`transition-transform duration-300 ${open ? "rotate-90" : ""}`}
                    />
                  </button>
                </div>
              );
            })}
          </div>

          {services.length === 0 && (
            <div className="mt-20 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-raised/50 text-text-muted ring-1 ring-border/50">
                <HugeiconsIcon icon={CalendarIcon} size={28} />
              </div>
              <p className="text-sm text-text-muted">No services yet</p>
            </div>
          )}
        </div>
      </div>
    </SidebarLayout>
  );
}
