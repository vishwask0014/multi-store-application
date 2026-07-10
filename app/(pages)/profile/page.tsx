"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserIcon,
  MailIcon,
  SmartPhoneIcon,
  MapPinIcon,
  EditIcon,
  Tick01Icon,
  StoreIcon,
  ShoppingCartIcon,
  CalendarIcon,
  HeartIcon,
  WalletIcon,
  ArrowRightIcon,
} from "@hugeicons/core-free-icons";
import SidebarLayout from "@/app/components/Common/SidebarLayout";

const stats = [
  { label: "Orders", value: 12, icon: ShoppingCartIcon },
  { label: "Bookings", value: 8, icon: CalendarIcon },
  { label: "Wishlist", value: 23, icon: HeartIcon },
  { label: "Stores", value: 4, icon: StoreIcon },
];

export default function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("Alex Morgan");

  return (
    <SidebarLayout>
      <div className="mx-auto max-w-3xl">
        <div className="px-6 pt-8 pb-16 lg:px-8">
          <div className="mb-8 flex flex-col items-center text-center sm:flex-row sm:gap-6 sm:text-left">
            <div className="relative mb-4 sm:mb-0">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-hover text-2xl font-medium text-white shadow-lg shadow-primary/25 ring-1 ring-white/10">
                AM
              </div>
              <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border border-border/50 bg-surface text-text-muted transition-colors hover:bg-surface-raised hover:text-text-primary">
                <HugeiconsIcon icon={EditIcon} size={13} />
              </button>
            </div>
            <div className="flex-1">
              {editing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-lg border border-primary/40 bg-surface px-3 py-1.5 text-lg font-medium text-text-primary outline-none shadow-sm shadow-primary/10"
                    autoFocus
                  />
                  <button
                    onClick={() => setEditing(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors hover:bg-primary/20"
                  >
                    <HugeiconsIcon icon={Tick01Icon} size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-medium tracking-tight text-text-primary">
                    {name}
                  </h1>
                  <button
                    onClick={() => setEditing(true)}
                    className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-surface-raised/50 hover:text-text-secondary"
                  >
                    <HugeiconsIcon icon={EditIcon} size={14} />
                  </button>
                </div>
              )}
              <p className="text-sm text-text-muted">Member since Jan 2025</p>
            </div>
          </div>

          <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-border/50 bg-surface p-4 text-center transition-all duration-200 hover:border-primary/30"
              >
                <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <HugeiconsIcon icon={s.icon} size={18} />
                </div>
                <p className="text-lg font-medium text-text-primary">
                  {s.value}
                </p>
                <p className="text-xs text-text-muted">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-medium text-text-primary">
              Account Details
            </h2>

            <div className="space-y-3">
              <div className="flex items-center gap-4 rounded-xl border border-border/50 bg-surface/50 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <HugeiconsIcon icon={MailIcon} size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-text-muted">Email</p>
                  <p className="text-sm text-text-primary">
                    alex.morgan@example.com
                  </p>
                </div>
                <button className="rounded-lg px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-raised/50 hover:text-text-primary">
                  Change
                </button>
              </div>

              <div className="flex items-center gap-4 rounded-xl border border-border/50 bg-surface/50 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <HugeiconsIcon icon={SmartPhoneIcon} size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-text-muted">Phone</p>
                  <p className="text-sm text-text-primary">+91 98765 43210</p>
                </div>
                <button className="rounded-lg px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-raised/50 hover:text-text-primary">
                  Change
                </button>
              </div>

              <div className="flex items-center gap-4 rounded-xl border border-border/50 bg-surface/50 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <HugeiconsIcon icon={MapPinIcon} size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-text-muted">Address</p>
                  <p className="text-sm text-text-primary">
                    123 Main St, New York, NY 10001
                  </p>
                </div>
                <button className="rounded-lg px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-raised/50 hover:text-text-primary">
                  Edit
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <h2 className="text-sm font-medium text-text-primary">
              Payments
            </h2>
            <a
              href="/profile/payment"
              className="group flex items-center gap-4 rounded-xl border border-border/50 bg-surface/50 p-4 transition-all duration-200 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-surface-raised text-primary ring-1 ring-primary/20">
                <HugeiconsIcon icon={WalletIcon} size={18} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors">
                  Payment Gateway
                </p>
                <p className="text-xs text-text-muted">
                  Configure your payment integration
                </p>
              </div>
              <HugeiconsIcon
                icon={ArrowRightIcon}
                size={16}
                className="text-text-muted transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-primary"
              />
            </a>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
