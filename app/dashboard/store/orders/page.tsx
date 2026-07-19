"use client";

import { useState, useEffect, useCallback } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { PackageIcon, ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import SidebarLayout from "@/app/components/Common/SidebarLayout";
import OrderTimeline from "@/app/components/Common/OrderTimeline";
import Modal from "@/app/components/Common/Modal";
import { useAuth } from "@/contexts/AuthContext";
import { useInventoryStore } from "@/stores/useInventoryStore";
import type { OrderData, OrderStatus } from "@/types";

const STATUS_CONFIG: Record<string, { label: string; style: string }> = {
  pending: { label: "Pending", style: "bg-warning/10 text-warning ring-1 ring-warning/20" },
  confirmed: { label: "Confirmed", style: "bg-primary/10 text-primary ring-1 ring-primary/20" },
  preparing: { label: "Preparing", style: "bg-accent/10 text-accent ring-1 ring-accent/20" },
  ready: { label: "Ready", style: "bg-success/10 text-success ring-1 ring-success/20" },
  out_for_delivery: { label: "Out for Delivery", style: "bg-blue-500/10 text-blue-500 ring-1 ring-blue-500/20" },
  delivered: { label: "Delivered", style: "bg-success/10 text-success ring-1 ring-success/20" },
  cancelled: { label: "Cancelled", style: "bg-danger/10 text-danger ring-1 ring-danger/20" },
};

const OWNER_ACTIONS: Record<string, { label: string; nextStatus: OrderStatus; style: string }[]> = {
  pending: [
    { label: "Accept Order", nextStatus: "confirmed", style: "bg-success/10 text-success hover:bg-success/20" },
    { label: "Reject Order", nextStatus: "cancelled", style: "bg-danger/10 text-danger hover:bg-danger/20" },
  ],
  confirmed: [
    { label: "Mark Preparing", nextStatus: "preparing", style: "bg-accent/10 text-accent hover:bg-accent/20" },
    { label: "Cancel Order", nextStatus: "cancelled", style: "bg-danger/10 text-danger hover:bg-danger/20" },
  ],
  preparing: [
    { label: "Mark Ready", nextStatus: "ready", style: "bg-success/10 text-success hover:bg-success/20" },
    { label: "Cancel Order", nextStatus: "cancelled", style: "bg-danger/10 text-danger hover:bg-danger/20" },
  ],
  ready: [
    { label: "Out for Delivery", nextStatus: "out_for_delivery", style: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20" },
    { label: "Cancel Order", nextStatus: "cancelled", style: "bg-danger/10 text-danger hover:bg-danger/20" },
  ],
  out_for_delivery: [
    { label: "Mark Delivered", nextStatus: "delivered", style: "bg-success/10 text-success hover:bg-success/20" },
    { label: "Cancel Order", nextStatus: "cancelled", style: "bg-danger/10 text-danger hover:bg-danger/20" },
  ],
  delivered: [],
  cancelled: [],
};

const tabs = ["All", "Pending", "Active", "Delivered", "Cancelled"];

export default function StoreOrdersPage() {
  const { firebaseUser } = useAuth();
  const { stores } = useInventoryStore();
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [selected, setSelected] = useState<OrderData | null>(null);
  const [acting, setActing] = useState<string | null>(null);

  const myStoreIds = stores.filter((s) => s.ownerUid === firebaseUser?.uid).map((s) => s.id);

  const fetchOrders = useCallback(async () => {
    if (myStoreIds.length === 0) { setLoading(false); return; }
    const all: OrderData[] = [];
    for (const storeId of myStoreIds) {
      const res = await fetch(`/api/orders?storeId=${storeId}&limit=100`);
      const data = await res.json();
      all.push(...(data.items || []));
    }
    all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setOrders(all);
    setLoading(false);
  }, [myStoreIds.join(",")]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const filtered = orders.filter((o) => {
    if (activeTab === "Pending") return o.status === "pending";
    if (activeTab === "Active") return ["confirmed", "preparing", "ready", "out_for_delivery"].includes(o.status);
    if (activeTab === "Delivered") return o.status === "delivered";
    if (activeTab === "Cancelled") return o.status === "cancelled";
    return true;
  });

  const updateStatus = async (id: string, status: OrderStatus) => {
    setActing(id);
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, actorId: firebaseUser?.uid || "", actorRole: "owner" }),
    });
    setActing(null);
    setSelected(null);
    fetchOrders();
  };

  return (
    <SidebarLayout>
      <div className="mx-auto max-w-4xl">
        <div className="px-6 pt-8 pb-16 lg:px-8">
          <div className="mb-6 space-y-1">
            <h1 className="text-2xl font-medium tracking-tight text-text-primary">Store Orders</h1>
            <p className="text-sm text-text-muted">Manage incoming orders for your stores</p>
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

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : myStoreIds.length === 0 ? (
            <div className="mt-16 text-center">
              <p className="text-sm text-text-muted">You don&apos;t own any stores yet</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="mt-16 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-raised/50 text-text-muted ring-1 ring-border/50">
                <HugeiconsIcon icon={PackageIcon} size={28} />
              </div>
              <p className="text-sm text-text-muted">No orders found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((order) => {
                const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                const storeName = typeof order.storeId === "object" ? (order.storeId as any).name || "Store" : "Store";
                const customerName = typeof order.userId === "object" ? (order.userId as any).name || "Customer" : "Customer";
                return (
                  <div key={order.id}
                    className="rounded-xl border border-border/50 bg-surface/50 p-4 transition-all hover:border-border-strong/50 sm:p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-sm font-medium text-text-primary">{order.orderNumber}</h3>
                          <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${cfg.style}`}>{cfg.label}</span>
                        </div>
                        <p className="text-xs text-text-muted">{storeName} · {customerName}</p>
                        <p className="text-xs text-text-muted">{order.items.length} item{order.items.length !== 1 ? "s" : ""} · ${order.totalAmount.toFixed(2)}</p>
                      </div>
                      <button onClick={() => setSelected(order)}
                        className="rounded-lg bg-surface-raised/50 px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-raised">
                        View
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.orderNumber || "Order Details"}>
        {selected && (
          <div className="space-y-5">
            <p className="text-xs text-text-muted">
              {new Date(selected.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
            </p>

            <OrderTimeline timeline={selected.timeline} currentStatus={selected.status} />

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-text-primary">Items</h3>
              {selected.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg bg-surface-raised/30 p-3">
                  {item.image && <img src={item.image} alt={item.title} className="h-10 w-10 rounded-lg object-cover ring-1 ring-border/30" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-primary truncate">{item.title}</p>
                    <p className="text-xs text-text-muted">Qty: {item.quantity}{item.sku ? ` · SKU: ${item.sku}` : ""}</p>
                  </div>
                  <p className="text-sm text-accent">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="space-y-1.5 border-t border-border/30 pt-3 text-sm">
              <div className="flex justify-between text-text-secondary"><span>Subtotal</span><span>${selected.subtotal.toFixed(2)}</span></div>
              {selected.discount > 0 && <div className="flex justify-between text-success"><span>Discount</span><span>-${selected.discount.toFixed(2)}</span></div>}
              {selected.tax > 0 && <div className="flex justify-between text-text-secondary"><span>Tax</span><span>${selected.tax.toFixed(2)}</span></div>}
              {selected.deliveryCharges > 0 && <div className="flex justify-between text-text-secondary"><span>Delivery</span><span>${selected.deliveryCharges.toFixed(2)}</span></div>}
              <div className="flex justify-between font-medium text-text-primary pt-1 border-t border-border/30">
                <span>Total</span><span className="text-accent">${selected.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {(OWNER_ACTIONS[selected.status]?.length > 0) && (
              <div className="flex flex-wrap gap-2 border-t border-border/30 pt-4">
                {OWNER_ACTIONS[selected.status].map((action) => (
                  <button key={action.nextStatus} onClick={() => updateStatus(selected.id, action.nextStatus)}
                    disabled={acting === selected.id}
                    className={`rounded-lg px-4 py-2 text-xs font-medium transition-colors disabled:opacity-50 ${action.style}`}>
                    {acting === selected.id ? "Updating..." : action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>
    </SidebarLayout>
  );
}
