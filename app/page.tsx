"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Lenis from "lenis";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), wheelMultiplier: 1 });
    let frameId: number;
    function raf(time: number) { lenis.raf(time); frameId = requestAnimationFrame(raf) }
    frameId = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(frameId); lenis.destroy() };
  }, []);
}

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1500;
    const step = 16;
    const totalSteps = duration / step;
    const increment = to / totalSteps;
    const timer = setInterval(() => {
      start += increment;
      if (start >= to) { setVal(to); clearInterval(timer) }
      else setVal(Math.floor(start));
    }, step);
    return () => clearInterval(timer);
  }, [isInView, to]);

  return <span ref={ref}>{val}{suffix}</span>;
}

function FloatingOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -top-40 -right-40 h-96 w-96 rounded-full opacity-15 blur-3xl"
        style={{ background: "var(--color-primary)" }}
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full opacity-10 blur-3xl"
        style={{ background: "var(--color-accent, #5C8374)" }}
        animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 left-1/2 h-64 w-64 rounded-full opacity-8 blur-3xl"
        style={{ background: "var(--color-primary)" }}
        animate={{ x: [-20, 20, -20], y: [-10, 10, -10] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

function DotGrid() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.03]">
      <div className="grid h-full w-full grid-cols-12 gap-8 p-8">
        {Array.from({ length: 120 }).map((_, i) => (
          <motion.div
            key={i}
            className="h-1 w-1 rounded-full bg-white"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 5, ease: "easeInOut" }}
          />
        ))}
      </div>
    </div>
  );
}

function NavBar() {
  const { scrollY } = useScroll();
  const bg = useTransform(scrollY, [0, 80], ["rgba(10,15,24,0)", "rgba(10,15,24,0.8)"]);
  const border = useTransform(scrollY, [0, 80], ["rgba(255,255,255,0)", "rgba(255,255,255,0.05)"]);

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl"
      style={{ background: bg, borderBottom: border }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-hover text-sm font-medium shadow-lg shadow-primary/20">
            M
          </div>
          <span className="text-base font-semibold text-text-primary">Market</span>
        </motion.div>
        <motion.nav
          className="flex items-center gap-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        >
          <Link href="/shop" className="text-sm font-medium text-text-muted transition-colors hover:text-text-primary">
            Browse
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-all duration-200 hover:bg-primary/20"
          >
            Dashboard
          </Link>
        </motion.nav>
      </div>
    </motion.header>
  );
}

function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 } as const,
    },
  };

  const child = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
  };

  return (
    <section ref={ref} className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <FloatingOrbs />
      <DotGrid />
      <motion.div style={{ y, opacity }} className="relative z-10 mx-auto max-w-5xl px-6 py-32 lg:px-8">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.span
            variants={child}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary"
          >
            <span className="flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Multi-store marketplace
          </motion.span>

          <motion.h1
            variants={child}
            className="mt-8 text-5xl font-bold leading-tight tracking-tight text-text-primary sm:text-6xl lg:text-7xl"
          >
            Everything you need,{" "}
            <span className="bg-gradient-to-r from-primary via-primary-hover to-accent bg-clip-text text-transparent">
              all in one place
            </span>
          </motion.h1>

          <motion.p
            variants={child}
            className="mt-6 text-lg leading-relaxed text-text-muted sm:text-xl"
          >
            Browse products and services from trusted stores. Manage your inventory,
            track orders, and grow your business — all from one dashboard.
          </motion.p>

          <motion.div
            variants={child}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Link
              href="/shop"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-primary to-primary-hover px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]"
            >
              <span className="absolute inset-0 translate-y-full bg-white/10 transition-transform duration-300 group-hover:translate-y-0" />
              <span className="relative flex items-center gap-2">
                Start Shopping
                <motion.span
                  className="inline-block"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  &rarr;
                </motion.span>
              </span>
            </Link>
            <Link
              href="/dashboard"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl border border-border/50 bg-surface/50 px-8 py-3.5 text-sm font-semibold text-text-primary backdrop-blur-sm transition-all duration-300 hover:bg-surface hover:shadow-lg active:scale-[0.98]"
            >
              Business Dashboard
            </Link>
          </motion.div>

          <motion.div
            variants={child}
            className="mt-16 flex items-center justify-center gap-10 text-center"
          >
            {[
              { label: "Products", val: 50, suffix: "+" },
              { label: "Stores", val: 4 },
              { label: "Services", val: 10 },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-bold text-text-primary sm:text-3xl">
                  <CountUp to={s.val} suffix={s.suffix || ""} />
                </p>
                <p className="mt-1 text-xs text-text-muted">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest text-text-muted">Scroll</span>
          <div className="h-8 w-[1px] bg-gradient-to-b from-primary/50 to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}

function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    { title: "Browse & Discover", desc: "Explore products and services from multiple stores in one place with powerful search and filters.", stat: "50+", label: "Products", color: "from-primary/20 to-transparent" },
    { title: "Manage Your Store", desc: "List products, create service bundles, and manage your inventory with an intuitive dashboard.", stat: "4", label: "Stores", color: "from-accent/20 to-transparent" },
    { title: "Track Everything", desc: "Monitor bookings, orders, and payments from a single interface. Stay on top of your business.", stat: "100%", label: "Control", color: "from-warning/20 to-transparent" },
  ];

  return (
    <section ref={ref} className="relative overflow-hidden border-t border-border/50">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h2 className="text-3xl font-semibold text-text-primary sm:text-4xl">
            Why choose Market
          </h2>
          <p className="mt-3 text-text-muted">Built for both shoppers and sellers</p>
        </motion.div>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.15 }}
              whileHover={{ y: -4 }}
              className="group relative cursor-default rounded-2xl border border-border/50 bg-surface p-6 transition-colors duration-300 hover:border-border"
            >
              <div className={`pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b ${item.color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
              <div className="relative">
                <div className="flex items-baseline gap-1">
                  <motion.span
                    className="text-4xl font-bold text-primary"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.15 + 0.3 }}
                  >
                    {item.stat}
                  </motion.span>
                  <span className="text-sm text-text-muted">{item.label}</span>
                </div>
                <h3 className="mt-4 text-lg font-medium text-text-primary">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SplitSection() {
  const shopperRef = useRef<HTMLDivElement>(null);
  const sellerRef = useRef<HTMLDivElement>(null);
  const shopperIn = useInView(shopperRef, { once: true, margin: "-80px" });
  const sellerIn = useInView(sellerRef, { once: true, margin: "-80px" });

  const checks = [
    { items: ["Browse products and services side by side", "Add items to cart with one click", "Track your orders and bookings"], color: "primary" },
    { items: ["Create and manage your store", "List products and service bundles", "View bookings and analytics"], color: "accent" },
  ];

  return (
    <section className="relative overflow-hidden border-t border-border/50 bg-surface/20">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
          <motion.div
            ref={shopperRef}
            initial={{ opacity: 0, x: -60 }}
            animate={shopperIn ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-primary">
              For everyone
            </div>
            <h2 className="mt-6 text-3xl font-semibold text-text-primary sm:text-4xl">
              For Shoppers
            </h2>
            <p className="mt-3 text-text-muted">
              Discover curated products and services, add to cart, and checkout seamlessly.
            </p>
            <ul className="mt-10 space-y-4">
              {checks[0].items.map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  animate={shopperIn ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1, ease: "easeOut" }}
                  className="flex items-start gap-3 text-sm text-text-muted"
                >
                  <motion.span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] text-primary"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                  >
                    &check;
                  </motion.span>
                  {item}
                </motion.li>
              ))}
            </ul>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={shopperIn ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Link
                href="/shop"
                className="mt-8 inline-flex items-center gap-2 rounded-xl border border-border/50 bg-surface px-6 py-3 text-sm font-medium text-text-primary transition-all duration-200 hover:bg-surface-raised hover:shadow-lg active:scale-[0.98]"
              >
                Start Shopping
                <span className="text-lg">&rarr;</span>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            ref={sellerRef}
            initial={{ opacity: 0, x: 60 }}
            animate={sellerIn ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-accent">
              For business
            </div>
            <h2 className="mt-6 text-3xl font-semibold text-text-primary sm:text-4xl">
              For Sellers
            </h2>
            <p className="mt-3 text-text-muted">
              List your products, create service offerings, and grow your business.
            </p>
            <ul className="mt-10 space-y-4">
              {checks[1].items.map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  animate={sellerIn ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1, ease: "easeOut" }}
                  className="flex items-start gap-3 text-sm text-text-muted"
                >
                  <motion.span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-[11px] text-accent"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                  >
                    &check;
                  </motion.span>
                  {item}
                </motion.li>
              ))}
            </ul>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={sellerIn ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Link
                href="/dashboard"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-hover px-6 py-3 text-sm font-medium text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]"
              >
                Go to Dashboard
                <span className="text-lg">&rarr;</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative overflow-hidden border-t border-border/50">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--color-primary)_0%,_transparent_70%)] opacity-5" />
      <div ref={ref} className="relative mx-auto max-w-4xl px-6 py-24 text-center lg:px-8">
        <motion.h2
          className="text-3xl font-semibold text-text-primary sm:text-4xl"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          Ready to get started?
        </motion.h2>
        <motion.p
          className="mt-4 text-lg text-text-muted"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
        >
          Join thousands of shoppers and sellers on Market today.
        </motion.p>
        <motion.div
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        >
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-hover px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]"
          >
            Start Shopping
            <span>&rarr;</span>
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl border border-border/50 bg-surface px-8 py-3.5 text-sm font-semibold text-text-primary transition-all duration-300 hover:bg-surface-raised active:scale-[0.98]"
          >
            Business Dashboard
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  useLenis();

  return (
    <div className="min-h-screen bg-[var(--color-base)]">
      <NavBar />
      <HeroSection />
      <FeaturesSection />
      <SplitSection />
      <CTASection />

      <footer className="border-t border-border/50">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row lg:px-8">
          <p className="text-sm text-text-muted">
            &copy; {new Date().getFullYear()} Market. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/shop" className="text-sm text-text-muted transition-colors hover:text-text-primary">
              Shop
            </Link>
            <Link href="/dashboard" className="text-sm text-text-muted transition-colors hover:text-text-primary">
              Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
