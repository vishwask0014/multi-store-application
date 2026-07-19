"use client";

import { useState, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { DollarCircleIcon, ShoppingCartIcon, CalendarIcon, UserIcon, BarChartIcon, PackageIcon } from "@hugeicons/core-free-icons";
import SidebarLayout from "@/app/components/Common/SidebarLayout";
import StatCard from "@/app/components/Common/StatCard";
import SimpleChart from "@/app/components/Common/SimpleChart";
import { useAuth } from "@/contexts/AuthContext";
import { useInventoryStore } from "@/stores/useInventoryStore";
import type { AnalyticsData } from "@/types";

export default function AnalyticsPage() {
  const { firebaseUser } = useAuth();
  const { stores } = useInventoryStore();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const myStoreIds = stores.filter((s) => s.ownerUid === firebaseUser?.uid).map((s) => s.id);

  useEffect(() => {
    if (myStoreIds.length === 0) { setLoading(false); return; }
    fetch(`/api/analytics?ownerUid=${firebaseUser?.uid}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [firebaseUser?.uid, myStoreIds.join(",")]);

  return (
    <SidebarLayout>
      <div className="mx-auto max-w-7xl">
        <div className="px-6 pt-8 pb-16 lg:px-8">
          <div className="mb-6 space-y-1">
            <h1 className="text-2xl font-medium tracking-tight text-text-primary">Analytics</h1>
            <p className="text-sm text-text-muted">Your store performance at a glance</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : myStoreIds.length === 0 ? (
            <div className="mt-16 text-center">
              <p className="text-sm text-text-muted">You need to own a store to see analytics</p>
            </div>
          ) : !data ? (
            <div className="mt-16 text-center">
              <p className="text-sm text-text-muted">Failed to load analytics</p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Total Revenue" value={data.totalRevenue} icon={DollarCircleIcon} />
                <StatCard label="Total Orders" value={data.totalOrders} icon={ShoppingCartIcon} />
                <StatCard label="Total Bookings" value={data.totalBookings} icon={CalendarIcon} />
                <StatCard label="Total Customers" value={data.totalCustomers} icon={UserIcon} />
              </div>

              {data.monthlySales.length > 0 && (
                <div className="rounded-xl border border-border/50 bg-surface/50 p-5">
                  <h3 className="mb-4 text-sm font-medium text-text-primary">Monthly Sales</h3>
                  <SimpleChart
                    data={data.monthlySales.map((m) => ({ label: m.month, value: m.revenue, secondary: m.orders * 10 }))}
                    height={180}
                  />
                </div>
              )}

              <div className="grid gap-6 lg:grid-cols-2">
                {data.topProducts.length > 0 && (
                  <div className="rounded-xl border border-border/50 bg-surface/50 p-5">
                    <h3 className="mb-3 text-sm font-medium text-text-primary">Top Products</h3>
                    <div className="space-y-2">
                      {data.topProducts.map((p, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <span className="text-text-primary truncate flex-1">{p.title}</span>
                          <span className="text-text-muted ml-2">{p.count} sold</span>
                          <span className="text-accent ml-3">${p.revenue.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {data.topServices.length > 0 && (
                  <div className="rounded-xl border border-border/50 bg-surface/50 p-5">
                    <h3 className="mb-3 text-sm font-medium text-text-primary">Top Services</h3>
                    <div className="space-y-2">
                      {data.topServices.map((s, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <span className="text-text-primary truncate flex-1">{s.title}</span>
                          <span className="text-text-muted ml-2">{s.count} booked</span>
                          <span className="text-accent ml-3">${s.revenue.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {data.lowStockProducts.length > 0 && (
                <div className="rounded-xl border border-danger/20 bg-danger/5 p-5">
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-danger">
                    <HugeiconsIcon icon={PackageIcon} size={16} />
                    Low Stock Alert
                  </h3>
                  <div className="space-y-2">
                    {data.lowStockProducts.map((p, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-text-primary truncate flex-1">{p.title}</span>
                        <span className="text-danger font-medium ml-2">{p.inventory} left</span>
                        {p.sku && <span className="text-text-muted ml-3 text-xs">SKU: {p.sku}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {data.recentCustomers.length > 0 && (
                <div className="rounded-xl border border-border/50 bg-surface/50 p-5">
                  <h3 className="mb-3 text-sm font-medium text-text-primary">Recent Customers</h3>
                  <div className="space-y-2">
                    {data.recentCustomers.map((c, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-text-primary">{c.name || "Unknown"}</span>
                        <span className="text-text-muted">{c.phone || ""}</span>
                        <span className="text-text-secondary">{c.orderCount} order{c.orderCount !== 1 ? "s" : ""}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </SidebarLayout>
  );
}
