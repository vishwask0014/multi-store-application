"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Store01Icon, PlusSignIcon, ShoppingCartIcon, CalendarIcon } from "@hugeicons/core-free-icons";
import SidebarLayout from "@/app/components/Common/SidebarLayout";
import { useInventoryStore } from "@/stores/useInventoryStore";
import StoreManagerModal from "@/app/components/Common/StoreManagerModal";

export default function StorePage() {
  const { stores } = useInventoryStore();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <SidebarLayout>
      <div className="mx-auto max-w-4xl">
        <div className="px-6 pt-8 pb-16 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-medium tracking-tight text-text-primary">
                My Stores
              </h1>
              <p className="text-sm text-text-muted">
                Manage your stores, products, and services
              </p>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              <HugeiconsIcon icon={PlusSignIcon} size={16} />
              Manage Stores
            </button>
          </div>

          <div className="mb-8 grid gap-3 sm:grid-cols-2">
            <a href="/dashboard/store/orders"
              className="flex items-center gap-3 rounded-xl border border-border/50 bg-surface/50 p-4 transition-all hover:border-primary/40">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <HugeiconsIcon icon={ShoppingCartIcon} size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">Store Orders</p>
                <p className="text-xs text-text-muted">Manage incoming orders</p>
              </div>
            </a>
            <a href="/dashboard/store/bookings"
              className="flex items-center gap-3 rounded-xl border border-border/50 bg-surface/50 p-4 transition-all hover:border-primary/40">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <HugeiconsIcon icon={CalendarIcon} size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">Store Bookings</p>
                <p className="text-xs text-text-muted">Manage appointments</p>
              </div>
            </a>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stores.map((store) => (
              <div
                key={store.id}
                className="rounded-xl border border-border/50 bg-surface/50 p-5 transition-all duration-200 hover:border-border-strong/50"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <HugeiconsIcon icon={Store01Icon} size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-text-primary">
                      {store.name}
                    </h3>
                    <span className="text-[11px] text-text-muted">
                      {store.offeringCount || 0} offerings
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                    {store.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {stores.length === 0 && (
            <div className="mt-16 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-raised/50 text-text-muted ring-1 ring-border/50">
                <HugeiconsIcon icon={Store01Icon} size={28} />
              </div>
              <p className="text-sm text-text-muted">No stores yet</p>
              <button
                onClick={() => setModalOpen(true)}
                className="mt-4 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                Create your first store
              </button>
            </div>
          )}
        </div>
      </div>
      <StoreManagerModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </SidebarLayout>
  );
}
