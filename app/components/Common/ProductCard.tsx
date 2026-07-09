"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  StarIcon,
  ShoppingBagIcon,
  CalendarIcon,
  HeartIcon,
} from "@hugeicons/core-free-icons";

interface ProductCardProps {
  title: string;
  price: number;
  rating: number;
  type: "item" | "service";
  image?: string;
}

export default function ProductCard({
  title,
  price,
  rating,
  type,
  image,
}: ProductCardProps) {
  const TypeIcon = type === "item" ? ShoppingBagIcon : CalendarIcon;

  return (
    <div className="relative flex flex-col overflow-hidden rounded-xl border border-border/50 bg-surface">
      <div className="relative aspect-[4/3] bg-gradient-to-br from-surface-raised to-surface">
        {image && (
          <img src={image} alt={title} className="h-full w-full object-cover" />
        )}
      </div>

      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-medium leading-snug text-text-primary line-clamp-2">
            {title}
          </h3>
          <button className="shrink-0 text-text-muted transition-colors hover:text-red-400">
            <HugeiconsIcon icon={HeartIcon} size={16} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-md bg-warning/10 px-1.5 py-0.5">
            <HugeiconsIcon icon={StarIcon} size={11} className="text-warning" />
            <span className="text-[11px] font-medium text-warning">
              {rating.toFixed(1)}
            </span>
          </div>
          <span className="text-xs text-text-muted">|</span>
          <span className="text-xs text-text-muted">240 sold</span>
        </div>

        <div className="flex items-center justify-between pt-1">
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
  );
}