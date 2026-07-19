"use client";

import { useState, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { CalendarIcon, ClockIcon, Cancel01Icon, ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import SidebarLayout from "@/app/components/Common/SidebarLayout";
import Modal from "@/app/components/Common/Modal";
import OrderTimeline from "@/app/components/Common/OrderTimeline";
import { useAuth } from "@/contexts/AuthContext";
import type { BookingData } from "@/types";

const statusConfig: Record<string, { label: string; style: string }> = {
  pending: { label: "Pending", style: "bg-warning/10 text-warning ring-1 ring-warning/20" },
  confirmed: { label: "Confirmed", style: "bg-primary/10 text-primary ring-1 ring-primary/20" },
  completed: { label: "Completed", style: "bg-success/10 text-success ring-1 ring-success/20" },
  cancelled: { label: "Cancelled", style: "bg-danger/10 text-danger ring-1 ring-danger/20" },
  rejected: { label: "Rejected", style: "bg-danger/10 text-danger ring-1 ring-danger/20" },
  rescheduled: { label: "Rescheduled", style: "bg-accent/10 text-accent ring-1 ring-accent/20" },
};

const tabs = ["All", "Upcoming", "Past"];

export default function BookingsPage() {
  const { firebaseUser, mongoUser } = useAuth();
  const [activeTab, setActiveTab] = useState("All");
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<BookingData | null>(null);
  const [rescheduleMode, setRescheduleMode] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  useEffect(() => {
    if (!firebaseUser?.uid) return;
    fetch(`/api/bookings?userId=${firebaseUser.uid}`)
      .then((r) => r.json())
      .then((data) => setBookings(Array.isArray(data) ? data : data.items || []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, [firebaseUser?.uid]);

  const filtered = bookings.filter((b) => {
    if (activeTab === "Upcoming") return ["pending", "confirmed", "rescheduled"].includes(b.status);
    if (activeTab === "Past") return ["completed", "cancelled", "rejected"].includes(b.status);
    return true;
  });

  const cancelBooking = async (id: string) => {
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "cancelled", actorId: firebaseUser?.uid, actorRole: "customer" }),
    });
    setSelected(null);
    setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, status: "cancelled" } : b)));
  };

  const requestReschedule = async () => {
    if (!selected || !newDate || !newTime) return;
    await fetch(`/api/bookings/${selected._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reschedule", newDate, newTime }),
    });
    setRescheduleMode(false);
    setSelected(null);
    // Refresh
    fetch(`/api/bookings?userId=${firebaseUser?.uid}`)
      .then((r) => r.json())
      .then((data) => setBookings(Array.isArray(data) ? data : data.items || []));
  };

  return (
    <SidebarLayout>
      <div className="mx-auto max-w-4xl">
        <div className="px-6 pt-8 pb-16 lg:px-8">
          <div className="mb-6 space-y-1">
            <h1 className="text-2xl font-medium tracking-tight text-text-primary">Bookings</h1>
            <p className="text-sm text-text-muted">Manage your appointments and reservations</p>
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
          ) : (
            <div className="space-y-3">
              {filtered.map((b) => (
                <div key={b._id}
                  className="group rounded-xl border border-border/50 bg-surface/50 p-4 transition-all duration-200 hover:border-border-strong/50 sm:p-5 cursor-pointer"
                  onClick={() => setSelected(b)}>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-surface-raised text-primary ring-1 ring-primary/20">
                        <HugeiconsIcon icon={CalendarIcon} size={22} />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-medium text-text-primary">{b.title}</h3>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-secondary">
                          <span className="flex items-center gap-1"><HugeiconsIcon icon={CalendarIcon} size={12} />{b.date}</span>
                          <span className="flex items-center gap-1"><HugeiconsIcon icon={ClockIcon} size={12} />{b.time}</span>
                          {b.duration && <span>{b.duration} min</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                      <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${statusConfig[b.status]?.style || ""}`}>
                        {statusConfig[b.status]?.label || b.status}
                      </span>
                      <p className="text-sm font-medium text-accent">${b.price.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="mt-16 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-raised/50 text-text-muted ring-1 ring-border/50">
                <HugeiconsIcon icon={CalendarIcon} size={28} />
              </div>
              <p className="text-sm text-text-muted">No bookings found</p>
            </div>
          )}
        </div>
      </div>

      <Modal open={!!selected} onClose={() => { setSelected(null); setRescheduleMode(false); }} title={selected?.title || "Booking"}>
        {selected && (
          <div className="space-y-5">
            <p className="text-xs text-text-muted">
              {selected.date} at {selected.time} · {selected.duration || 60} min
            </p>

            <OrderTimeline timeline={(selected.timeline || []) as any} currentStatus={selected.status} />

            <div className="rounded-lg bg-surface-raised/30 p-3 text-sm">
              <div className="flex justify-between text-text-secondary"><span>Price</span><span className="text-accent">${selected.price.toFixed(2)}</span></div>
              <div className="flex justify-between text-text-secondary mt-1"><span>Status</span><span>{selected.status}</span></div>
            </div>

            {selected.status === "rescheduled" && (selected as any).rescheduleRequest && (
              <div className="rounded-lg bg-accent/10 p-3 text-sm text-accent">
                Reschedule requested to {(selected as any).rescheduleRequest.newDate} at {(selected as any).rescheduleRequest.newTime}
              </div>
            )}

            {["pending", "confirmed"].includes(selected.status) && (
              <div className="flex flex-wrap gap-2 border-t border-border/30 pt-4">
                {selected.status === "confirmed" && !rescheduleMode && (
                  <button onClick={() => setRescheduleMode(true)}
                    className="rounded-lg bg-accent/10 px-4 py-2 text-xs font-medium text-accent transition-colors hover:bg-accent/20">
                    Request Reschedule
                  </button>
                )}
                <button onClick={() => cancelBooking(selected._id)}
                  className="rounded-lg bg-danger/10 px-4 py-2 text-xs font-medium text-danger transition-colors hover:bg-danger/20">
                  Cancel Booking
                </button>
              </div>
            )}

            {rescheduleMode && (
              <div className="space-y-3 border-t border-border/30 pt-4">
                <h4 className="text-sm font-medium text-text-primary">Request Reschedule</h4>
                <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)}
                  className="w-full rounded-lg border border-border/50 bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-primary/50" />
                <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)}
                  className="w-full rounded-lg border border-border/50 bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-primary/50" />
                <div className="flex gap-2">
                  <button onClick={() => setRescheduleMode(false)}
                    className="flex-1 rounded-lg bg-surface-raised/50 py-2 text-xs font-medium text-text-secondary">Cancel</button>
                  <button onClick={requestReschedule}
                    disabled={!newDate || !newTime}
                    className="flex-1 rounded-lg bg-accent py-2 text-xs font-medium text-white disabled:opacity-50">Submit</button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </SidebarLayout>
  );
}
