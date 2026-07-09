"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRightIcon, StoreIcon } from "@hugeicons/core-free-icons";

interface StoreCardProps {
  name: string;
  tag: "Fulfilled" | "Filled";
  offeringCount: number;
  images?: string[];
}

export default function StoreCard({
  name,
  tag,
  offeringCount,
  images = [],
}: StoreCardProps) {
  const isFulfilled = tag === "Fulfilled";

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-surface p-5 transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10">
      <div className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: "radial-gradient(400px circle at 50% 0%, rgba(92,131,116,0.06), transparent 70%)",
        }}
      />

      <div className="relative mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-surface-raised text-primary ring-1 ring-primary/20">
            <HugeiconsIcon icon={StoreIcon} size={20} />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-medium text-text-primary transition-colors group-hover:text-primary truncate">
              {name}
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
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
            className="aspect-square rounded-lg overflow-hidden ring-1 ring-border/30"
          >
            {images[i] ? (
              <img
                src={images[i]}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-surface-raised to-surface text-text-muted/30 text-[10px] font-medium">
                IMG
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="relative flex items-center gap-2 text-xs text-text-muted transition-colors group-hover:text-text-secondary">
        <span>View store</span>
        <HugeiconsIcon icon={ArrowRightIcon} size={12} className="transition-transform duration-300 group-hover:translate-x-0.5" />
      </div>
    </div>
  );
}