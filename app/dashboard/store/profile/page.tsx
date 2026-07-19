"use client";

import { useState } from "react";
import OwnerOnboarding from "@/app/components/Common/OwnerOnboarding";
import SidebarLayout from "@/app/components/Common/SidebarLayout";
import { useAuth } from "@/contexts/AuthContext";
import { HugeiconsIcon } from "@hugeicons/react";
import { Store01Icon, Tick01Icon, ClockIcon, Cancel01Icon } from "@hugeicons/core-free-icons";

const statusConfig: Record<string, { label: string; style: string; icon: any }> = {
  NONE: { label: "Not Applied", style: "bg-surface-raised/50 text-text-muted ring-1 ring-border/50", icon: Store01Icon },
  PENDING: { label: "Under Review", style: "bg-warning/10 text-warning ring-1 ring-warning/20", icon: ClockIcon },
  VERIFIED: { label: "Approved", style: "bg-success/10 text-success ring-1 ring-success/20", icon: Tick01Icon },
  REJECTED: { label: "Rejected", style: "bg-danger/10 text-danger ring-1 ring-danger/20", icon: Cancel01Icon },
};

export default function OwnerProfilePage() {
  const { mongoUser, ownerStatus } = useAuth();
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const config = statusConfig[ownerStatus || "NONE"];
  const Icon = config.icon;

  return (
    <SidebarLayout>
      <div className="mx-auto max-w-2xl">
        <div className="px-6 pt-8 pb-16 lg:px-8">
          <div className="mb-6 space-y-1">
            <h1 className="text-2xl font-medium tracking-tight text-text-primary">
              Seller Profile
            </h1>
            <p className="text-sm text-text-muted">
              Your seller account and store information
            </p>
          </div>

          <div className="rounded-xl border border-border/50 bg-surface/60 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${config.style}`}>
                <HugeiconsIcon icon={Icon} size={24} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-text-primary">Application Status</p>
                <p className="text-xs text-text-muted">{config.label}</p>
              </div>
              {ownerStatus === "NONE" && (
                <button
                  onClick={() => setOnboardingOpen(true)}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
                >
                  Apply Now
                </button>
              )}
            </div>

            {mongoUser && (
              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border/30 pt-6">
                <div>
                  <p className="text-xs text-text-muted">Business Name</p>
                  <p className="text-sm text-text-primary">{mongoUser.businessName || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Category</p>
                  <p className="text-sm text-text-primary">{mongoUser.businessCategory || "-"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-text-muted">Address</p>
                  <p className="text-sm text-text-primary">{mongoUser.businessAddress || "-"}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <OwnerOnboarding open={onboardingOpen} onClose={() => setOnboardingOpen(false)} onComplete={() => setOnboardingOpen(false)} />
    </SidebarLayout>
  );
}
