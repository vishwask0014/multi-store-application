"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeftIcon,
  WalletIcon,
  CreditCardIcon,
  BankIcon,
  PaymentSuccessIcon,
  Tick01Icon,
  DollarIcon,
} from "@hugeicons/core-free-icons";
import SidebarLayout from "@/app/components/Common/SidebarLayout";

const gateways = [
  {
    id: "stripe",
    name: "Stripe",
    desc: "Credit/debit cards, Apple Pay, Google Pay",
    icon: CreditCardIcon,
    connected: true,
  },
  {
    id: "razorpay",
    name: "Razorpay",
    desc: "UPI, net banking, cards, wallets",
    icon: BankIcon,
    connected: false,
  },
  {
    id: "paypal",
    name: "PayPal",
    desc: "PayPal checkout & express checkout",
    icon: DollarIcon,
    connected: false,
  },
];

export default function PaymentPage() {
  const [connected, setConnected] = useState(
    Object.fromEntries(gateways.map((g) => [g.id, g.connected]))
  );

  const toggleConnection = (id: string) => {
    setConnected((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <SidebarLayout>
      <div className="mx-auto max-w-3xl">
        <div className="px-6 pt-8 pb-16 lg:px-8">
          <div className="mb-8 space-y-1">
            <a
              href="/profile"
              className="mb-4 inline-flex items-center gap-1.5 text-xs text-text-muted transition-colors hover:text-text-secondary"
            >
              <HugeiconsIcon
                icon={ArrowLeftIcon}
                size={14}
                className="transition-transform duration-200 group-hover:-translate-x-0.5"
              />
              Back to Profile
            </a>
            <h1 className="text-2xl font-medium tracking-tight text-text-primary">
              Payment Gateway
            </h1>
            <p className="text-sm text-text-muted">
              Integrate payment providers to accept payments
            </p>
          </div>

          <div className="mb-8 rounded-xl border border-border/50 bg-surface/50 p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-surface-raised text-primary ring-1 ring-primary/20">
                <HugeiconsIcon icon={WalletIcon} size={20} />
              </div>
              <div>
                <h2 className="text-sm font-medium text-text-primary">
                  Active Gateway
                </h2>
                <p className="text-xs text-text-muted">
                  {Object.values(connected).some(Boolean)
                    ? Object.keys(connected)
                        .filter((k) => connected[k])
                        .join(", ")
                    : "No gateway connected"}
                </p>
              </div>
            </div>

            <div className="flex h-2 overflow-hidden rounded-full bg-border">
              {(() => {
                const total = gateways.length;
                const active = Object.values(connected).filter(Boolean).length;
                return (
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-primary-hover transition-all duration-500"
                    style={{ width: `${(active / total) * 100}%` }}
                  />
                );
              })()}
            </div>
            <p className="mt-2 text-xs text-text-muted">
              {Object.values(connected).filter(Boolean).length} of{" "}
              {gateways.length} connected
            </p>
          </div>

          <div className="space-y-3">
            {gateways.map((g) => {
              const isConnected = connected[g.id];
              return (
                <div
                  key={g.id}
                  className={`group rounded-xl border p-5 transition-all duration-300 ${
                    isConnected
                      ? "border-primary/40 bg-surface/80 shadow-sm shadow-primary/10"
                      : "border-border/50 bg-surface/50 hover:border-border-strong/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
                          isConnected
                            ? "bg-gradient-to-br from-primary/20 to-surface-raised text-primary ring-1 ring-primary/20"
                            : "bg-surface-raised/50 text-text-muted ring-1 ring-border/30"
                        }`}
                      >
                        <HugeiconsIcon icon={g.icon} size={22} />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-text-primary">
                          {g.name}
                        </h3>
                        <p className="mt-0.5 text-xs text-text-muted">
                          {g.desc}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {isConnected && (
                        <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary ring-1 ring-primary/20">
                          <HugeiconsIcon icon={Tick01Icon} size={11} />
                          Connected
                        </span>
                      )}
                      <button
                        onClick={() => toggleConnection(g.id)}
                        className={`relative shrink-0 rounded-lg px-4 py-2 text-xs font-medium transition-all duration-200 ${
                          isConnected
                            ? "border border-danger/20 bg-danger/5 text-danger hover:bg-danger/10"
                            : "bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/30"
                        }`}
                      >
                        {isConnected ? "Disconnect" : "Connect"}
                      </button>
                    </div>
                  </div>

                  {isConnected && (
                    <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border/30 pt-4 sm:grid-cols-3">
                      {[
                        { label: "Status", value: "Active" },
                        { label: "Mode", value: "Test" },
                        { label: "Connected", value: "Mar 10, 2026" },
                      ].map((item) => (
                        <div key={item.label}>
                          <p className="text-[11px] text-text-muted">
                            {item.label}
                          </p>
                          <p className="text-xs font-medium text-text-primary">
                            {item.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 rounded-xl border border-border/50 bg-surface/30 p-5">
            <h3 className="mb-2 text-sm font-medium text-text-primary">
              API Configuration
            </h3>
            <p className="mb-4 text-xs text-text-muted">
              Use these credentials to integrate with your chosen payment
              provider. Keep your secret keys safe.
            </p>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-[11px] font-medium text-text-muted">
                  Publishable Key
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value="pk_test_51HxQ9z..."
                    className="w-full rounded-lg border border-border/50 bg-base px-3 py-2 font-mono text-xs text-text-secondary outline-none"
                  />
                  <button className="shrink-0 rounded-lg bg-surface-raised/50 px-3 py-2 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-raised hover:text-text-primary">
                    Copy
                  </button>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-medium text-text-muted">
                  Secret Key
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    readOnly
                    value="sk_test_51HxQ9z..."
                    className="w-full rounded-lg border border-border/50 bg-base px-3 py-2 font-mono text-xs text-text-secondary outline-none"
                  />
                  <button className="shrink-0 rounded-lg bg-surface-raised/50 px-3 py-2 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-raised hover:text-text-primary">
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
