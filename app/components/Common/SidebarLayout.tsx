"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { SidebarProvider } from "@/app/providers";
import { useAuth } from "@/contexts/AuthContext";
import { useInventoryStore } from "@/stores/useInventoryStore";
import Sidebar from "@/app/components/Common/Sidebar";
import BottomNav from "@/app/components/Common/BottomNav";

const ownerRoutes = [
  "/dashboard",
  "/dashboard/goods-products",
  "/dashboard/goods-products/create",
  "/dashboard/services",
  "/dashboard/services/create",
  "/dashboard/stores",
  "/dashboard/store",
  "/dashboard/store/create",
  "/dashboard/store/profile",
  "/dashboard/bookings",
  "/dashboard/categories",
  "/dashboard/settings",
];

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const { firebaseUser, loading, isOwner, mongoUser, ownerStatus } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { loaded, fetchAll } = useInventoryStore();
  const [gateChecked, setGateChecked] = useState(false);
  const [gateMessage, setGateMessage] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;

    if (!firebaseUser) {
      router.replace("/login");
      return;
    }

    const isOwnerRoute = ownerRoutes.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    );

    if (!isOwnerRoute) {
      setGateChecked(true);
      return;
    }

    if (!mongoUser) {
      setGateChecked(true);
      return;
    }

    if (isOwner) {
      setGateChecked(true);
      return;
    }

    if (ownerStatus === "PENDING") {
      setGateMessage("Your seller account is under verification. Please wait for approval.");
      return;
    }

    if (ownerStatus === "REJECTED") {
      setGateMessage("Your seller application was rejected. Please contact support.");
      return;
    }

    setGateMessage("You don't have permission to access the dashboard.");
  }, [loading, firebaseUser, isOwner, mongoUser, ownerStatus, pathname, router]);

  useEffect(() => {
    if (!loaded && firebaseUser) fetchAll();
  }, [loaded, fetchAll, firebaseUser]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!firebaseUser) return null;

  if (gateMessage) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-base px-4">
        <div className="mx-auto max-w-sm text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-warning/10 text-warning ring-1 ring-warning/20">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <p className="text-sm text-text-primary leading-relaxed">{gateMessage}</p>
          <button
            onClick={() => router.replace("/shop")}
            className="mt-6 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Go to Marketplace
          </button>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="layout-shell min-h-screen">
        <Sidebar />
        <BottomNav />
        {children}
      </div>
    </SidebarProvider>
  );
}
