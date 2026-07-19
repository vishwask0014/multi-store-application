"use client";

import { useState, useEffect, useCallback } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { CalendarIcon, ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import SidebarLayout from "@/app/components/Common/SidebarLayout";
import Modal from "@/app/components/Common/Modal";
import OrderTimeline from "@/app/components/Common/OrderTimeline";
import { useAuth } from "@/contexts/AuthContext";
import { useInventoryStore } from "@/stores/useInventoryStore";
import type { BookingData } from "@/types";

const statusConfig: Record<string, { label: string; style: string }> = {
  pending: { label: "Pending", style: "bg-warning/10 text-warning ring-1 ring-warning/20" },
  confirmed: { label: "Confirmed", style: "bg-primary/10 text-primary ring-1 ring-primary/20" },
  completed: { label: "Completed", style: "bg-success/10 text-success ring-1 ring-success/20" },
  cancelled: { label: "Cancelled", style: "bg-danger/10 text-danger ring-1 ring-danger/20" },
  rejected: { label: "Rejected", style: "bg-danger/10 text-danger ring-1 ring-danger/20" },
  rescheduled: { label: "Rescheduled", style: "bg-accent/10 text-accent ring-1 ring-accent/20" },
};

const OWNER_ACTIONS: Record<string, { label: string; action: string; style: string }[]> = {
  pending: [
    { label: "Accept", action: "confirm", style: "bg-success/10 text-success hover:bg-success/20" },
    { label: "Reject", action: "reject", style: "bg-danger/10 text-danger hover:bg-danger/20" },
  ],
  confirmed: [
    { label: "Mark Complete", action: "complete", style: "bg-success/10 text-success hover:bg-success/20" },
    { label: "Cancel", action: "cancel", style: "bg-danger/10 text-danger hover:bg-danger/20" },
  ],
  rescheduled: [
    { label: "Accept Reschedule", action: "accept-reschedule", style: "bg-success/10 text-success hover:bg-success/20" },
    { label: "Reject Reschedule", action: "reject-reschedule", style: "bg-danger/10 text-danger hover:bg-danger/20" },
    { label: "Cancel", action: "cancel", style: "bg-danger/10 text-danger hover:bg-danger/20" },
  ],
  completed: [],
  cancelled: [],
  rejected: [],
};

const STATUS_MAP: Record<string, string> = {
  confirm: "confirmed",
  reject: "rejected",
  complete: "completed",
  cancel: "cancelled",
  "accept-reschedule": "confirmed",
  "reject-reschedule": "confirmed",
};

const tabs = ["All", "Pending", "Active", "Completed", "Cancelled"];

export default function StoreBookingsPage() {
  const { firebaseUser } = useAuth();
  const { stores } = useInventoryStore();
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [selected, setSelected] = useState<BookingData | null>(null);
  const [acting, setActing] = useState<string | null>(null);

  const myStoreIds = stores.filter((s) => s.ownerUid === firebaseUser?.uid).map((s) => s.id);

  const fetchBookings = useCallback(async () => {
    if (myStoreIds.length === 0) { setLoading(false); return; }
    const all: BookingData[] = [];
    for (const storeId of myStoreIds) {
      const res = await fetch(`/api/bookings?storeId=${storeId}&limit=100`);
      const data = await res.json();
      all.push(...(Array.isArray(data) ? data : data.items || []));
    }
    all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setBookings(all);
    setLoading(false);
  }, [myStoreIds.join(",")]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const filtered = bookings.filter((b) => {
    if (activeTab === "Pending") return b.status === "pending";
    if (activeTab === "Active") return ["confirmed", "rescheduled"].includes(b.status);
    if (activeTab === "Completed") return b.status === "completed";
    if (activeTab === "Cancelled") return ["cancelled", "rejected"].includes(b.status);
    return true;
  });

  const handleAction = async (bookingId: string, action: string) => {
    setActing(bookingId);
    const statusMap: Record<string, string> = {
      confirm: "confirmed",
      reject: "rejected",
      complete: "completed",
      cancel: "cancelled",
    };

    if (action === "accept-reschedule" || action === "reject-reschedule") {
      await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
    } else {
      await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: statusMap[action] || action,
          actorId: firebaseUser?.uid,
          actorRole: "owner",
        }),
      });
    }
    setActing(null);
    setSelected(null);
    fetchBookings();
  };

  return (
    <SidebarLayout>
      <div className="mx-auto max-w-4xl">
        <div className="px-6 pt-8 pb-16 lg:px-8">
          <div className="mb-6 space-y-1">
            <h1 className="text-2xl font-medium tracking-tight text-text-primary">Store Bookings</h1>
            <p className="text-sm text-text-muted">Manage bookings for your stores</p>
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
            <div className="mt-16 text-center"><p className="text-sm text-text-muted">You don&apos;t own any stores yet</p></div>
          ) : filtered.length === 0 ? (
            <div className="mt-16 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-raised/50 text-text-muted ring-1 ring-border/50">
                <HugeiconsIcon icon={CalendarIcon} size={28} />
              </div>
              <p className="text-sm text-text-muted">No bookings found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((b) => {
                const cfg = statusConfig[b.status] || statusConfig.pending;
                return (
                  <div key={b._id}
                    className="rounded-xl border border-border/50 bg-surface/50 p-4 transition-all hover:border-border-strong/50 sm:p-5 cursor-pointer"
                    onClick={() => setSelected(b)}>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-sm font-medium text-text-primary">{b.title}</h3>
                          <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${cfg.style}`}>{cfg.label}</span>
                        </div>
                        <p className="text-xs text-text-muted">{b.date} at {b.time} · ${b.price.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.title || "Booking"}>
        {selected && (
          <div className="space-y-5">
            <p className="text-xs text-text-muted">{selected.date} at {selected.time} · {selected.duration || 60} min</p>

            <OrderTimeline timeline={(selected.timeline || []) as any} currentStatus={selected.status} />

            <div className="rounded-lg bg-surface-raised/30 p-3 text-sm">
              <div className="flex justify-between text-text-secondary"><span>Price</span><span className="text-accent">${selected.price.toFixed(2)}</span></div>
              <div className="flex justify-between text-text-secondary mt-1"><span>Status</span><span>{selected.status}</span></div>
            </div>

            {selected.status === "rescheduled" && (selected as any).rescheduleRequest && (
              <div className="rounded-lg bg-accent/10 p-3 text-sm text-accent">
                Customer requested reschedule to {(selected as any).rescheduleRequest.newDate} at {(selected as any).rescheduleRequest.newTime}
              </div>
            )}

            {(OWNER_ACTIONS[selected.status]?.length > 0) && (
              <div className="flex flex-wrap gap-2 border-t border-border/30 pt-4">
                {OWNER_ACTIONS[selected.status].map((action) => (
                  <button key={action.action} onClick={() => handleAction(selected._id, action.action)}
                    disabled={acting === selected._id}
                    className={`rounded-lg px-4 py-2 text-xs font-medium transition-colors disabled:opacity-50 ${action.style}`}>
                    {acting === selected._id ? "..." : action.label}
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
