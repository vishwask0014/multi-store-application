"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";

function NavBar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-base/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-hover text-sm font-medium shadow-lg shadow-primary/20">
            M
          </div>
          <span className="text-base font-semibold text-text-primary">Market</span>
        </div>
        <nav className="flex items-center gap-6">
          <Link href="/shop" className="text-sm font-medium text-text-muted transition-colors hover:text-text-primary">Browse</Link>
          <Link href="/dashboard" className="rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-all duration-200 hover:bg-primary/20">Dashboard</Link>
        </nav>
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-48 -right-48 h-[500px] w-[500px] rounded-full opacity-15 blur-3xl" style={{ background: "var(--color-primary)" }} />
        <div className="absolute -bottom-48 -left-48 h-[400px] w-[400px] rounded-full opacity-10 blur-3xl" style={{ background: "var(--color-accent)" }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--color-primary)_0%,_transparent_60%)] opacity-[0.06]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            <span className="flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Multi-store marketplace
          </span>

          <h1 className="mt-8 text-5xl font-bold leading-[1.05] tracking-tight text-text-primary sm:text-6xl lg:text-7xl">
            One platform for{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              stores & shoppers
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-text-muted sm:text-xl">
            Store owners create stores, list products and services. Customers browse, shop, and
            book everything in one place. No need to go anywhere else.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-hover px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]"
            >
              Start Shopping <span>&rarr;</span>
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-border/50 bg-surface px-8 py-3.5 text-sm font-semibold text-text-primary transition-all duration-300 hover:bg-surface-raised active:scale-[0.98]"
            >
              Open a Store
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FlowSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative overflow-hidden border-t border-border/50 py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl font-semibold text-text-primary sm:text-4xl">How it works</h2>
          <p className="mt-3 text-text-muted">Two sides, one platform — everyone wins</p>
        </motion.div>

        <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Owner side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-hover text-sm font-bold text-white shadow-lg shadow-primary/20">
                  S
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text-primary">Store Owners</h3>
                  <p className="text-sm text-text-muted">Sell goods & services</p>
                </div>
              </div>

              <div className="mt-8 space-y-6">
                {[
                  { step: "01", title: "Create your store", desc: "Register your business, set up your store profile in minutes." },
                  { step: "02", title: "List products & services", desc: "Add items, set prices, create service bundles with multiple products." },
                  { step: "03", title: "Manage & grow", desc: "Track orders, bookings, and analytics from your dashboard." },
                ].map((item, i) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.15 }}
                    className="group flex items-start gap-4 rounded-xl p-4 transition-all duration-300 hover:bg-primary/5"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                      {item.step}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-text-primary">{item.title}</p>
                      <p className="mt-0.5 text-xs text-text-muted">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                className="mt-8"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.8 }}
              >
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary-hover px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl"
                >
                  Open your store <span>&rarr;</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Customer side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="rounded-2xl border border-accent/20 bg-accent/5 p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-hover text-sm font-bold text-white shadow-lg shadow-accent/20">
                  C
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text-primary">Customers</h3>
                  <p className="text-sm text-text-muted">Browse & buy from any store</p>
                </div>
              </div>

              <div className="mt-8 space-y-6">
                {[
                  { step: "01", title: "Browse everything", desc: "Explore products and services from all stores in one unified feed." },
                  { step: "02", title: "Add to cart", desc: "Pick items and services from multiple stores and add them to your cart." },
                  { step: "03", title: "Checkout & track", desc: "Pay once, track orders and bookings from your profile." },
                ].map((item, i) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.15 }}
                    className="group flex items-start gap-4 rounded-xl p-4 transition-all duration-300 hover:bg-accent/5"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-xs font-bold text-accent">
                      {item.step}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-text-primary">{item.title}</p>
                      <p className="mt-0.5 text-xs text-text-muted">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                className="mt-8"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.8 }}
              >
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/10 px-5 py-2.5 text-sm font-medium text-accent transition-all duration-300 hover:bg-accent/20"
                >
                  Start browsing <span>&rarr;</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Central connector */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
        >
          <div className="inline-flex items-center gap-3 rounded-2xl border border-border/50 bg-surface px-6 py-4 shadow-lg">
            <span className="text-sm text-text-muted">Store Owners</span>
            <motion.div
              className="flex items-center gap-1"
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="block h-px w-8 bg-primary" />
              <span className="text-primary">&rarr;</span>
            </motion.div>
            <span className="text-sm font-medium text-text-primary">Marketplace</span>
            <motion.div
              className="flex items-center gap-1"
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              <span className="block h-px w-8 bg-accent" />
              <span className="text-accent">&rarr;</span>
            </motion.div>
            <span className="text-sm text-text-muted">Customers</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ValueSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const items = [
    {
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
      title: "Multi-store access",
      desc: "Browse products and services from multiple stores in one place. No hopping between sites.",
    },
    {
      icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
      title: "Products & services",
      desc: "Stores can sell individual products or bundle them into services. Customers see it all unified.",
    },
    {
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
      title: "Easy management",
      desc: "Store owners get a full dashboard. Customers track orders and bookings effortlessly.",
    },
  ];

  return (
    <section ref={ref} className="relative overflow-hidden border-t border-border/50 bg-surface/20 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl font-semibold text-text-primary sm:text-4xl">Why Market?</h2>
          <p className="mt-3 text-text-muted">Everything connected, nothing missed</p>
        </motion.div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="rounded-2xl border border-border/50 bg-surface p-6 transition-all duration-300 hover:border-border hover:shadow-lg"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={item.icon} />
                </svg>
              </div>
              <h3 className="mt-4 text-base font-medium text-text-primary">{item.title}</h3>
              <p className="mt-2 text-sm text-text-muted leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const stats = [
    { stat: "50+", label: "Products" },
    { stat: "10", label: "Service Bundles" },
    { stat: "4", label: "Stores" },
  ];

  return (
    <section ref={ref} className="border-t border-border/50 py-16">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          {stats.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <p className="text-3xl font-bold text-primary sm:text-4xl">{item.stat}</p>
              <p className="mt-1 text-sm text-text-muted">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative overflow-hidden border-t border-border/50 py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--color-primary)_0%,_transparent_60%)] opacity-[0.06]" />
      <div className="relative mx-auto max-w-3xl px-6 text-center lg:px-8">
        <motion.h2
          className="text-3xl font-semibold text-text-primary sm:text-4xl"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          Ready to get started?
        </motion.h2>
        <motion.p
          className="mt-4 text-lg text-text-muted"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
        >
          Whether you&apos;re here to shop or sell — you&apos;re in the right place.
        </motion.p>
        <motion.div
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
        >
          <Link href="/shop" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-hover px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30">
            Start Shopping <span>&rarr;</span>
          </Link>
          <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-xl border border-border/50 bg-surface px-8 py-3.5 text-sm font-semibold text-text-primary transition-all duration-300 hover:bg-surface-raised">
            Open a Store
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-base)]">
      <NavBar />
      <HeroSection />
      <FlowSection />
      <ValueSection />
      <StatsBar />
      <CTASection />

      <footer className="border-t border-border/50">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row lg:px-8">
          <p className="text-sm text-text-muted">&copy; {new Date().getFullYear()} Market. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/shop" className="text-sm text-text-muted transition-colors hover:text-text-primary">Shop</Link>
            <Link href="/dashboard" className="text-sm text-text-muted transition-colors hover:text-text-primary">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
