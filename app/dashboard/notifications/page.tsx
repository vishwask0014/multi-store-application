"use client";

import { useState, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Notification03Icon } from "@hugeicons/core-free-icons";
import SidebarLayout from "@/app/components/Common/SidebarLayout";
import { useAuth } from "@/contexts/AuthContext";

const TYPE_ICONS: Record<string, string> = {
  order_confirmed: "✅",
  order_cancelled: "❌",
  booking_confirmed: "✅",
  booking_cancelled: "❌",
  new_order: "🛒",
  new_booking: "📅",
  low_inventory: "⚠️",
  order_status: "📦",
};

export default function NotificationsPage() {
  const { firebaseUser } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseUser?.uid) return;
    fetch(`/api/notifications?userId=${firebaseUser.uid}`)
      .then((r) => r.json())
      .then((data) => setNotifications(Array.isArray(data) ? data : []))
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));

    // Mark all as read
    fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: firebaseUser.uid }),
    });
  }, [firebaseUser?.uid]);

  return (
    <SidebarLayout>
      <div className="mx-auto max-w-4xl">
        <div className="px-6 pt-8 pb-16 lg:px-8">
          <div className="mb-6 space-y-1">
            <h1 className="text-2xl font-medium tracking-tight text-text-primary">Notifications</h1>
            <p className="text-sm text-text-muted">Stay updated with your orders and bookings</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="mt-16 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-raised/50 text-text-muted ring-1 ring-border/50">
                <HugeiconsIcon icon={Notification03Icon} size={28} />
              </div>
              <p className="text-sm text-text-muted">No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((n: any) => (
                <div key={n._id}
                  className={`rounded-xl border ${n.read ? "border-border/30 bg-surface/30" : "border-primary/20 bg-primary/5"} p-4 transition-all`}>
                  <div className="flex items-start gap-3">
                    <span className="text-lg">{TYPE_ICONS[n.type] || "🔔"}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${n.read ? "text-text-secondary" : "text-text-primary font-medium"}`}>{n.title}</p>
                      <p className="text-xs text-text-muted mt-0.5">{n.message}</p>
                      <p className="text-[10px] text-text-muted mt-1">
                        {new Date(n.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    {!n.read && <span className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </SidebarLayout>
  );
}
