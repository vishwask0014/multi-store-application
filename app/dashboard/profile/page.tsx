"use client";

import { useState, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserIcon,
  SmartPhoneIcon,
  MapPinIcon,
  EditIcon,
  Tick01Icon,
  StoreIcon,
  ShoppingCartIcon,
  CalendarIcon,
  WalletIcon,
  ArrowRightIcon,
  Logout01Icon,
  BuildingIcon,
} from "@hugeicons/core-free-icons";
import SidebarLayout from "@/app/components/Common/SidebarLayout";
import OwnerOnboarding from "@/app/components/Common/OwnerOnboarding";
import { useAuth } from "@/contexts/AuthContext";
import type { OwnerStatus } from "@/lib/models/User";

function getOwnerStatusBadge(status: OwnerStatus) {
  switch (status) {
    case "NONE":
      return { label: "Customer", className: "bg-surface-raised/50 text-text-secondary ring-1 ring-border/30" };
    case "PENDING":
      return { label: "Under Review", className: "bg-warning/10 text-warning ring-1 ring-warning/20" };
    case "VERIFIED":
      return { label: "Verified Seller", className: "bg-success/10 text-success ring-1 ring-success/20" };
    case "REJECTED":
      return { label: "Rejected", className: "bg-danger/10 text-danger ring-1 ring-danger/20" };
  }
}

export default function ProfilePage() {
  const { firebaseUser, mongoUser, signOut, refreshMongoUser, updateName, ownerStatus, isOwner } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({ products: 0, services: 0, stores: 0, bookings: 0 });
  const [onboardingOpen, setOnboardingOpen] = useState(false);

  const initials = (mongoUser?.name || firebaseUser?.displayName || "U")
    .split(" ")
    .map((s) => s[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const memberSince = firebaseUser?.metadata?.creationTime
    ? new Date(firebaseUser.metadata.creationTime).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "Recently";

  useEffect(() => {
    if (mongoUser?.name) setName(mongoUser.name);
  }, [mongoUser?.name]);

  useEffect(() => {
    if (!firebaseUser?.uid) return;
    fetch(`/api/stats?uid=${firebaseUser.uid}`)
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch(() => {});
  }, [firebaseUser?.uid]);

  const handleSaveName = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await updateName(name.trim());
      setEditing(false);
    } catch {}
    setSaving(false);
  };

  const badge = getOwnerStatusBadge((ownerStatus || "NONE") as OwnerStatus);
  const canApply = ownerStatus === "NONE" || ownerStatus === "REJECTED";

  const statCards = [
    { label: "Products", value: stats.products, icon: ShoppingCartIcon },
    { label: "Services", value: stats.services, icon: StoreIcon },
    { label: "Bookings", value: stats.bookings, icon: CalendarIcon },
    { label: "Stores", value: stats.stores, icon: BuildingIcon },
  ];

  return (
    <SidebarLayout>
      <div className="mx-auto max-w-3xl">
        <div className="px-6 pt-8 pb-16 lg:px-8">
          <div className="mb-8 flex flex-col items-center text-center sm:flex-row sm:gap-6 sm:text-left">
            <div className="relative mb-4 sm:mb-0">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-hover text-2xl font-medium text-white shadow-lg shadow-primary/25 ring-1 ring-white/10">
                {initials || "U"}
              </div>
            </div>
            <div className="flex-1">
              {editing ? (
                <div className="flex items-center justify-center gap-2 sm:justify-start">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-lg border border-primary/40 bg-surface px-3 py-1.5 text-lg font-medium text-text-primary outline-none shadow-sm shadow-primary/10"
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                  />
                  <button
                    onClick={handleSaveName}
                    disabled={saving}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors hover:bg-primary/20 disabled:opacity-40"
                  >
                    <HugeiconsIcon icon={Tick01Icon} size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 sm:justify-start">
                  <h1 className="text-xl font-medium tracking-tight text-text-primary">
                    {mongoUser?.name || firebaseUser?.displayName || "User"}
                  </h1>
                  <button
                    onClick={() => setEditing(true)}
                    className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-surface-raised/50 hover:text-text-secondary"
                  >
                    <HugeiconsIcon icon={EditIcon} size={14} />
                  </button>
                </div>
              )}
              <div className="mt-1 flex items-center justify-center gap-2 sm:justify-start">
                <p className="text-sm text-text-muted">Member since {memberSince}</p>
                <span className="text-text-muted">·</span>
                <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${badge.className}`}>
                  {badge.label}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {statCards.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-border/50 bg-surface p-4 text-center transition-all duration-200 hover:border-primary/30"
              >
                <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <HugeiconsIcon icon={s.icon} size={18} />
                </div>
                <p className="text-lg font-medium text-text-primary">{s.value}</p>
                <p className="text-xs text-text-muted">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Owner Application Section */}
          {!isOwner && (
            <div className="mb-8 rounded-xl border border-border/50 bg-surface/50 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <HugeiconsIcon icon={StoreIcon} size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-text-primary">Sell on Marketplace</h3>
                    <p className="text-xs text-text-muted mt-0.5">
                      {ownerStatus === "PENDING"
                        ? "Your application is under review. We'll notify you once it's approved."
                        : ownerStatus === "REJECTED"
                        ? "Your application was rejected. You can re-apply with updated information."
                        : "Become a seller and start listing your products and services."}
                    </p>
                  </div>
                </div>
                {canApply && (
                  <button
                    onClick={() => setOnboardingOpen(true)}
                    className="shrink-0 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white transition-opacity hover:opacity-90"
                  >
                    Apply Now
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h2 className="text-sm font-medium text-text-primary">Account Details</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-4 rounded-xl border border-border/50 bg-surface/50 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <HugeiconsIcon icon={UserIcon} size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-text-muted">Name</p>
                  <p className="text-sm text-text-primary">{mongoUser?.name || firebaseUser?.displayName || "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-xl border border-border/50 bg-surface/50 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <HugeiconsIcon icon={SmartPhoneIcon} size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-text-muted">Phone</p>
                  <p className="text-sm text-text-primary">{firebaseUser?.phoneNumber || mongoUser?.phone || "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-xl border border-border/50 bg-surface/50 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <HugeiconsIcon icon={MapPinIcon} size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-text-muted">UID</p>
                  <p className="text-sm font-mono text-text-primary text-[13px]">{firebaseUser?.uid || "—"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <h2 className="text-sm font-medium text-text-primary">Payments</h2>
            <a
              href="/dashboard/profile/payment"
              className="group flex items-center gap-4 rounded-xl border border-border/50 bg-surface/50 p-4 transition-all duration-200 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-surface-raised text-primary ring-1 ring-primary/20">
                <HugeiconsIcon icon={WalletIcon} size={18} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors">
                  Payment Gateway
                </p>
                <p className="text-xs text-text-muted">Configure your payment integration</p>
              </div>
              <HugeiconsIcon
                icon={ArrowRightIcon}
                size={16}
                className="text-text-muted transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-primary"
              />
            </a>
          </div>

          <div className="mt-8">
            <button
              onClick={() => signOut()}
              className="group flex w-full items-center gap-4 rounded-xl border border-danger/20 bg-danger/5 p-4 text-left transition-all duration-200 hover:border-danger/40 hover:bg-danger/10"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-danger/10 text-danger">
                <HugeiconsIcon icon={Logout01Icon} size={18} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-danger">Sign Out</p>
                <p className="text-xs text-text-muted">You can sign back in anytime</p>
              </div>
              <HugeiconsIcon
                icon={ArrowRightIcon}
                size={16}
                className="text-text-muted transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-danger"
              />
            </button>
          </div>
        </div>
      </div>

      <OwnerOnboarding
        open={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
        onComplete={() => {
          refreshMongoUser();
          setOnboardingOpen(false);
        }}
      />
    </SidebarLayout>
  );
}
