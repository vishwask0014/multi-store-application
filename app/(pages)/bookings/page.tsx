"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  Cancel01Icon,
  CheckmarkCircleIcon,
  ArrowRightIcon,
} from "@hugeicons/core-free-icons";
import SidebarLayout from "@/app/components/Common/SidebarLayout";

interface Booking {
  id: number;
  title: string;
  store: string;
  date: string;
  time: string;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  price: number;
}

const initialBookings: Booking[] = [
  {
    id: 1,
    title: "Yoga Class Pass",
    store: "Urban Essentials",
    date: "Mar 15, 2026",
    time: "10:00 AM",
    status: "confirmed",
    price: 25,
  },
  {
    id: 2,
    title: "Spa Massage",
    store: "Bloom & Co.",
    date: "Mar 18, 2026",
    time: "2:30 PM",
    status: "pending",
    price: 85,
  },
  {
    id: 3,
    title: "Guitar Lesson",
    store: "The Artisan Loft",
    date: "Mar 10, 2026",
    time: "4:00 PM",
    status: "completed",
    price: 45,
  },
  {
    id: 4,
    title: "Cooking Workshop",
    store: "Urban Essentials",
    date: "Feb 28, 2026",
    time: "6:00 PM",
    status: "cancelled",
    price: 60,
  },
];

const statusConfig = {
  confirmed: { label: "Confirmed", style: "bg-primary/10 text-primary ring-1 ring-primary/20" },
  pending: { label: "Pending", style: "bg-warning/10 text-warning ring-1 ring-warning/20" },
  completed: { label: "Completed", style: "bg-success/10 text-success ring-1 ring-success/20" },
  cancelled: { label: "Cancelled", style: "bg-danger/10 text-danger ring-1 ring-danger/20" },
};

const tabs = ["All", "Upcoming", "Past"];

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [bookings, setBookings] = useState(initialBookings);

  const filtered = bookings.filter((b) => {
    if (activeTab === "Upcoming") return b.status === "confirmed" || b.status === "pending";
    if (activeTab === "Past") return b.status === "completed" || b.status === "cancelled";
    return true;
  });

  const cancelBooking = (id: number) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "cancelled" as const } : b))
    );
  };

  return (
    <SidebarLayout>
      <div className="mx-auto max-w-4xl">
        <div className="px-6 pt-8 pb-16 lg:px-8">
          <div className="mb-6 space-y-1">
            <h1 className="text-2xl font-medium tracking-tight text-text-primary">
              Bookings
            </h1>
            <p className="text-sm text-text-muted">
              Manage your appointments and reservations
            </p>
          </div>

          <div className="mb-6 flex items-center gap-2 border-b border-border/50">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-4 py-2.5 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "text-text-primary"
                    : "text-text-muted hover:text-text-secondary"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.map((b) => (
              <div
                key={b.id}
                className="group rounded-xl border border-border/50 bg-surface/50 p-4 transition-all duration-200 hover:border-border-strong/50 sm:p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-surface-raised text-primary ring-1 ring-primary/20">
                      <HugeiconsIcon icon={CalendarIcon} size={22} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium text-text-primary">
                        {b.title}
                      </h3>
                      <p className="text-xs text-text-muted">{b.store}</p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-secondary">
                        <span className="flex items-center gap-1">
                          <HugeiconsIcon icon={CalendarIcon} size={12} />
                          {b.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <HugeiconsIcon icon={ClockIcon} size={12} />
                          {b.time}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                        statusConfig[b.status].style
                      }`}
                    >
                      {statusConfig[b.status].label}
                    </span>
                    <p className="text-sm font-medium text-accent">
                      ${b.price.toFixed(2)}
                    </p>
                  </div>
                </div>

                {(b.status === "confirmed" || b.status === "pending") && (
                  <div className="mt-4 flex items-center gap-3 border-t border-border/30 pt-3">
                    <button className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20">
                      Reschedule
                    </button>
                    <button
                      onClick={() => cancelBooking(b.id)}
                      className="flex items-center gap-1.5 rounded-lg bg-danger/10 px-3 py-1.5 text-xs font-medium text-danger transition-colors hover:bg-danger/20"
                    >
                      <HugeiconsIcon icon={Cancel01Icon} size={12} />
                      Cancel
                    </button>
                  </div>
                )}

                {b.status === "completed" && (
                  <div className="mt-4 flex items-center gap-3 border-t border-border/30 pt-3">
                    <button className="flex items-center gap-1.5 rounded-lg border border-border/50 px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-raised/50">
                      Book again
                    </button>
                    <button className="flex items-center gap-1.5 rounded-lg border border-border/50 px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-raised/50">
                      Leave a review
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="mt-16 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-raised/50 text-text-muted ring-1 ring-border/50">
                <HugeiconsIcon icon={CalendarIcon} size={28} />
              </div>
              <p className="text-sm text-text-muted">No bookings found</p>
            </div>
          )}
        </div>
      </div>
    </SidebarLayout>
  );
}
