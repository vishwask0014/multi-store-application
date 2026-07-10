"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  SearchIcon,
  StoreIcon,
  ArrowRightIcon,
  AddIcon,
} from "@hugeicons/core-free-icons";
import SidebarLayout from "@/app/components/Common/SidebarLayout";
import { stores } from "@/mock";

export default function StoresPage() {
  const [query, setQuery] = useState("");

  const filtered = stores.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <SidebarLayout>
      <div className="mx-auto max-w-7xl">
        <div className="px-6 pt-8 pb-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-medium tracking-tight text-text-primary">
                Stores
              </h1>
              <p className="text-sm text-text-muted">
                Browse all stores on the marketplace
              </p>
            </div>
            <a
              href="/dashboard/store/create"
              className="group relative hidden items-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-primary to-primary-hover px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] sm:inline-flex"
            >
              <span className="absolute inset-0 translate-y-full bg-white/10 transition-transform duration-300 group-hover:translate-y-0" />
              <span className="relative flex items-center gap-1.5">
                <HugeiconsIcon icon={AddIcon} size={16} />
                Create Store
              </span>
            </a>
          </div>
          <a
            href="/dashboard/store/create"
            className="mb-4 flex items-center justify-center gap-2 rounded-lg border border-dashed border-primary/30 bg-primary/5 px-4 py-3 text-sm font-medium text-primary transition-all duration-200 hover:bg-primary/10 sm:hidden"
          >
            <HugeiconsIcon icon={AddIcon} size={16} />
            Create Store
          </a>

          <div className="relative max-w-md">
            <HugeiconsIcon
              icon={SearchIcon}
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search stores..."
              className="w-full rounded-xl border border-border/50 bg-surface py-2.5 pl-10 pr-4 text-sm text-text-primary outline-none transition-all duration-200 placeholder:text-text-muted focus:border-primary/50 focus:shadow-sm focus:shadow-primary/10"
            />
          </div>
        </div>

        <div className="px-6 pb-16 lg:px-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((s) => (
              <StoreCard key={s.name} {...s} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="mt-20 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-raised/50 text-text-muted ring-1 ring-border/50">
                <HugeiconsIcon icon={StoreIcon} size={24} />
              </div>
              <p className="text-sm text-text-muted">No stores found</p>
            </div>
          )}
        </div>
      </div>
    </SidebarLayout>
  );
}

function StoreCard({
  name,
  tag,
  offeringCount,
  images = [],
}: {
  name: string;
  tag: "Fulfilled" | "Filled";
  offeringCount: number;
  images?: string[];
}) {
  const isFulfilled = tag === "Fulfilled";

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-surface p-5 transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10">
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(400px circle at 50% 0%, rgba(92,131,116,0.06), transparent 70%)",
        }}
      />

      <div className="relative mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-surface-raised text-primary ring-1 ring-primary/20">
            <HugeiconsIcon icon={StoreIcon} size={20} />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-medium text-text-primary transition-colors group-hover:text-primary">
              {name}
            </h3>
            <p className="mt-0.5 text-xs text-text-muted">
              {offeringCount} offering{offeringCount !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
            isFulfilled
              ? "bg-accent/10 text-accent ring-1 ring-accent/20"
              : "bg-surface-raised/50 text-text-secondary ring-1 ring-border/30"
          }`}
        >
          {tag}
        </span>
      </div>

      <div className="relative mb-4 grid grid-cols-3 gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="aspect-square overflow-hidden rounded-lg ring-1 ring-border/30"
          >
            {images[i] ? (
              <img
                src={images[i]}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-surface-raised to-surface text-[10px] font-medium text-text-muted/30">
                IMG
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="relative flex items-center gap-2 text-xs text-text-muted transition-colors group-hover:text-text-secondary">
        <span>View store</span>
        <HugeiconsIcon
          icon={ArrowRightIcon}
          size={12}
          className="transition-transform duration-300 group-hover:translate-x-0.5"
        />
      </div>
    </div>
  );
}
