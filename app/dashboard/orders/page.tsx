"use client";

import { useState, useEffect, useCallback } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { PackageIcon, ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import SidebarLayout from "@/app/components/Common/SidebarLayout";
import OrderCard from "@/app/components/Common/OrderCard";
import OrderTimeline from "@/app/components/Common/OrderTimeline";
import Modal from "@/app/components/Common/Modal";
import { useAuth } from "@/contexts/AuthContext";
import type { OrderData, OrderStatus } from "@/types";

const tabs = ["All", "Active", "Delivered", "Cancelled"];

export default function OrdersPage() {
  const { firebaseUser, mongoUser } = useAuth();
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [selected, setSelected] = useState<OrderData | null>(null);
  const [cancelling, setCancelling] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    if (!mongoUser?.id) return;
    const res = await fetch(`/api/orders?userId=${mongoUser.id}`);
    const data = await res.json();
    setOrders(data.items || []);
    setLoading(false);
  }, [mongoUser?.id]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const filtered = orders.filter((o) => {
    if (activeTab === "Active") return ["pending", "confirmed", "preparing", "ready", "out_for_delivery"].includes(o.status);
    if (activeTab === "Delivered") return o.status === "delivered";
    if (activeTab === "Cancelled") return o.status === "cancelled";
    return true;
  });

  const cancelOrder = async (id: string) => {
    setCancelling(id);
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "cancelled",
        actorId: firebaseUser?.uid || "",
        actorRole: "customer",
        reason: "Cancelled by customer",
      }),
    });
    setCancelling(null);
    setSelected(null);
    fetchOrders();
  };

  return (
    <SidebarLayout>
      <div className="mx-auto max-w-4xl">
        <div className="px-6 pt-8 pb-16 lg:px-8">
          <div className="mb-6 space-y-1">
            <h1 className="text-2xl font-medium tracking-tight text-text-primary">Orders</h1>
            <p className="text-sm text-text-muted">Track and manage your purchases</p>
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
          ) : filtered.length === 0 ? (
            <div className="mt-16 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-raised/50 text-text-muted ring-1 ring-border/50">
                <HugeiconsIcon icon={PackageIcon} size={28} />
              </div>
              <p className="text-sm text-text-muted">No orders found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((order) => (
                <OrderCard key={order.id} order={order} onView={() => setSelected(order)} />
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.orderNumber || "Order Details"}>
        {selected && (
          <div className="space-y-5">
            <p className="text-xs text-text-muted">
              Placed on {new Date(selected.createdAt).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            </p>

            <OrderTimeline timeline={selected.timeline} currentStatus={selected.status} />

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-text-primary">Items</h3>
              {selected.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg bg-surface-raised/30 p-3">
                  {item.image && <img src={item.image} alt={item.title} className="h-10 w-10 rounded-lg object-cover ring-1 ring-border/30" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-primary truncate">{item.title}</p>
                    <p className="text-xs text-text-muted">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm text-accent">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="space-y-1.5 border-t border-border/30 pt-3 text-sm">
              <div className="flex justify-between text-text-secondary">
                <span>Subtotal</span>
                <span>${selected.subtotal.toFixed(2)}</span>
              </div>
              {selected.discount > 0 && (
                <div className="flex justify-between text-success">
                  <span>Discount</span>
                  <span>-${selected.discount.toFixed(2)}</span>
                </div>
              )}
              {selected.tax > 0 && (
                <div className="flex justify-between text-text-secondary">
                  <span>Tax</span>
                  <span>${selected.tax.toFixed(2)}</span>
                </div>
              )}
              {selected.deliveryCharges > 0 && (
                <div className="flex justify-between text-text-secondary">
                  <span>Delivery</span>
                  <span>${selected.deliveryCharges.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-medium text-text-primary pt-1 border-t border-border/30">
                <span>Total</span>
                <span className="text-accent">${selected.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-text-muted">
              <span>Payment: {selected.paymentMethod.toUpperCase()}</span>
              <span>·</span>
              <span>{selected.paymentStatus}</span>
            </div>

            {selected.status === "pending" && (
              <button onClick={() => cancelOrder(selected.id)}
                disabled={cancelling === selected.id}
                className="w-full rounded-lg bg-danger/10 py-2.5 text-sm font-medium text-danger transition-colors hover:bg-danger/20 disabled:opacity-50">
                {cancelling === selected.id ? "Cancelling..." : "Cancel Order"}
              </button>
            )}
          </div>
        )}
      </Modal>
    </SidebarLayout>
  );
}
