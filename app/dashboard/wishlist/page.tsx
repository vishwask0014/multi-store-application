"use client";

import { useState, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { BookHeartIcon, Store01Icon, ShoppingBagIcon, ServiceIcon, DeleteIcon } from "@hugeicons/core-free-icons";
import SidebarLayout from "@/app/components/Common/SidebarLayout";
import { useWishlistStore } from "@/stores/useWishlistStore";
import { useAuth } from "@/contexts/AuthContext";
import type { WishlistItem } from "@/types";

const TYPE_CONFIG: Record<string, { icon: any; label: string }> = {
  product: { icon: ShoppingBagIcon, label: "Product" },
  service: { icon: ServiceIcon, label: "Service" },
  store: { icon: Store01Icon, label: "Store" },
};

const tabs = ["All", "Products", "Services", "Stores"];

export default function WishlistPage() {
  const { firebaseUser } = useAuth();
  const { items, removeItem } = useWishlistStore();
  const [activeTab, setActiveTab] = useState("All");

  const filtered = items.filter((i) => {
    if (activeTab === "Products") return i.targetType === "product";
    if (activeTab === "Services") return i.targetType === "service";
    if (activeTab === "Stores") return i.targetType === "store";
    return true;
  });

  const handleRemove = async (item: WishlistItem) => {
    removeItem(item.targetId);
    if (firebaseUser?.uid) {
      await fetch("/api/wishlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: firebaseUser.uid, targetType: item.targetType, targetId: item.targetId }),
      });
    }
  };

  const getLink = (item: WishlistItem) => {
    if (item.targetType === "store") return `/stores/${item.targetId}`;
    return `/${item.targetType}s/${item.targetId}`;
  };

  return (
    <SidebarLayout>
      <div className="mx-auto max-w-4xl">
        <div className="px-6 pt-8 pb-16 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-medium tracking-tight text-text-primary">Wishlist</h1>
              <p className="text-sm text-text-muted">{items.length} saved item{items.length !== 1 ? "s" : ""}</p>
            </div>
          </div>

          <div className="mb-6 flex items-center gap-2 border-b border-border/50">
            {tabs.map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`relative px-4 py-2.5 text-sm font-medium transition-colors ${
                  activeTab === tab ? "text-text-primary" : "text-text-muted hover:text-text-secondary"
                }`}>
                {tab}
                {activeTab === tab && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="mt-16 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-raised/50 text-text-muted ring-1 ring-border/50">
                <HugeiconsIcon icon={BookHeartIcon} size={28} />
              </div>
              <p className="text-sm text-text-muted">Your wishlist is empty</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((item) => {
                const cfg = TYPE_CONFIG[item.targetType] || TYPE_CONFIG.product;
                return (
                  <div key={item.targetId}
                    className="flex items-center gap-4 rounded-xl border border-border/50 bg-surface/50 p-4 transition-all hover:border-border-strong/50">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <HugeiconsIcon icon={cfg.icon} size={22} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <a href={getLink(item)} className="text-sm font-medium text-text-primary hover:text-primary transition-colors truncate block">
                        {item.title}
                      </a>
                      <p className="text-xs text-text-muted">{cfg.label}</p>
                      {item.price !== undefined && (
                        <p className="text-xs text-accent mt-0.5">${item.price.toFixed(2)}</p>
                      )}
                    </div>
                    <button onClick={() => handleRemove(item)}
                      className="rounded-lg p-2 text-text-muted transition-colors hover:bg-danger/10 hover:text-danger">
                      <HugeiconsIcon icon={DeleteIcon} size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </SidebarLayout>
  );
}
