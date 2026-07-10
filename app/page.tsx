"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Lenis from "lenis";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { products, services } from "@/mock";

function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), wheelMultiplier: 1 });
    let frameId: number;
    function raf(t: number) { lenis.raf(t); frameId = requestAnimationFrame(raf) }
    frameId = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(frameId); lenis.destroy() };
  }, []);
}

function useTypewriter(words: string[]) {
  const [index, setIndex] = useState(0);
  const [char, setChar] = useState(0);
  const [dir, setDir] = useState(1);

  useEffect(() => {
    const word = words[index];
    const timer = setInterval(() => {
      setChar((prev) => {
        if (prev + dir > word.length || prev + dir < 0) {
          if (dir === 1 && prev >= word.length) { setDir(-1); return prev }
          if (dir === -1 && prev <= 0) { setDir(1); setIndex((i) => (i + 1) % words.length); return 0 }
        }
        return prev + dir;
      });
    }, 60);
    return () => clearInterval(timer);
  }, [index, dir, words]);

  return words[index].slice(0, char);
}

function NavBar() {
  const { scrollY } = useScroll();
  const bg = useTransform(scrollY, [0, 80], ["rgba(10,15,24,0)", "rgba(10,15,24,0.9)"]);
  const border = useTransform(scrollY, [0, 80], ["rgba(255,255,255,0)", "rgba(255,255,255,0.05)"]);

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl"
      style={{ background: bg, borderBottom: border }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <motion.div className="flex items-center gap-3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-hover text-sm font-medium shadow-lg shadow-primary/20">
            M
          </div>
          <span className="text-base font-semibold text-text-primary">Market</span>
        </motion.div>
        <motion.nav className="flex items-center gap-6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          <Link href="/shop" className="text-sm font-medium text-text-muted transition-colors hover:text-text-primary">Browse</Link>
          <Link href="/dashboard" className="rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-all duration-200 hover:bg-primary/20">Dashboard</Link>
        </motion.nav>
      </div>
    </motion.header>
  );
}

function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const tagline = useTypewriter(["fresh finds", "daily essentials", "local stores", "smart deals"]);

  return (
    <section ref={ref} className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <motion.div className="absolute -top-48 -right-48 h-[500px] w-[500px] rounded-full opacity-15 blur-3xl" style={{ background: "var(--color-primary)" }} animate={{ x: [0, 40, 0], y: [0, -30, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="absolute -bottom-48 -left-48 h-[400px] w-[400px] rounded-full opacity-10 blur-3xl" style={{ background: "var(--color-accent, #5C8374)" }} animate={{ x: [0, -30, 0], y: [0, 20, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--color-primary)_0%,_transparent_60%)] opacity-[0.07]" />
      </div>

      <motion.div style={{ y, opacity }} className="relative z-10 mx-auto max-w-6xl px-6 py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="text-center lg:text-left"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <span className="flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Multi-store marketplace
            </span>
            <h1 className="mt-8 text-5xl font-bold leading-[1.1] tracking-tight text-text-primary sm:text-6xl lg:text-7xl">
              Discover{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {tagline}
              </span>
              <span className="animate-pulse text-primary">|</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-text-muted sm:text-xl">
              Browse products and services from trusted stores near you.
              One marketplace, endless possibilities.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <Link
                href="/shop"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-primary to-primary-hover px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]"
              >
                <span className="absolute inset-0 translate-y-full bg-white/10 transition-transform duration-300 group-hover:translate-y-0" />
                <span className="relative flex items-center gap-2">
                  Start Shopping
                  <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>&rarr;</motion.span>
                </span>
              </Link>
              <Link
                href="/dashboard"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl border border-border/50 bg-surface/50 px-8 py-3.5 text-sm font-semibold text-text-primary backdrop-blur-sm transition-all duration-300 hover:bg-surface hover:shadow-lg active:scale-[0.98]"
              >
                Business Dashboard
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
            className="relative hidden lg:block"
          >
            <div className="relative mx-auto aspect-square max-w-md">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 via-accent/10 to-transparent blur-2xl" />
              <div className="relative grid grid-cols-2 gap-3">
                {products.slice(0, 4).map((p, i) => (
                  <motion.div
                    key={p.title}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 + i * 0.1 }}
                    className="group relative overflow-hidden rounded-xl border border-border/50 bg-surface/80 backdrop-blur-sm"
                  >
                    <div className="aspect-square overflow-hidden">
                      <img src={p.image} alt={p.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-base/90 to-transparent p-3 pt-8">
                      <p className="text-xs font-medium text-text-primary truncate">{p.title}</p>
                      <p className="text-sm font-semibold text-primary">${p.price.toFixed(2)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.2em] text-text-muted">Scroll</span>
          <div className="h-8 w-[1px] bg-gradient-to-b from-primary/50 to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}

function ProductShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const featured = products.slice(0, 6);

  return (
    <section ref={ref} className="relative overflow-hidden border-t border-border/50">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl font-semibold text-text-primary sm:text-4xl">Featured Products</h2>
          <p className="mt-3 text-text-muted">Handpicked just for you</p>
        </motion.div>

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {featured.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-square overflow-hidden rounded-xl border border-border/50 bg-surface transition-all duration-300 group-hover:border-border group-hover:shadow-lg group-hover:shadow-black/10">
                <img src={p.image} alt={p.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-base/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <button className="w-full rounded-lg bg-primary py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary-hover">
                    Quick add
                  </button>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <p className="text-xs text-text-muted truncate">{p.title}</p>
                <p className="text-sm font-semibold text-text-primary">${p.price.toFixed(2)}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
        >
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 rounded-xl border border-border/50 bg-surface px-6 py-3 text-sm font-medium text-text-primary transition-all duration-200 hover:bg-surface-raised hover:shadow-lg"
          >
            View All Products
            <span className="transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function ServicesShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative overflow-hidden border-t border-border/50 bg-surface/20">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-3 py-1 text-xs font-medium text-accent">
            Curated services
          </span>
          <h2 className="mt-6 text-3xl font-semibold text-text-primary sm:text-4xl">Services for every occasion</h2>
          <p className="mt-3 text-text-muted">From parties to wellness — we've got you covered</p>
        </motion.div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-2xl border border-border/50 bg-surface transition-all duration-300 hover:border-border hover:shadow-lg"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <img src={s.image} alt={s.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-base/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-0.5 text-[11px] font-medium text-accent ring-1 ring-accent/20">
                    From ${s.price.toFixed(0)}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-medium text-text-primary">{s.title}</h3>
                <p className="mt-1 text-xs text-text-muted line-clamp-2">{s.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-text-muted">{s.productCount} products</span>
                  <button className="rounded-lg bg-primary/10 px-3 py-1.5 text-[11px] font-medium text-primary transition-all duration-200 hover:bg-primary/20">
                    Book now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative overflow-hidden border-t border-border/50">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--color-primary)_0%,_transparent_70%)] opacity-[0.04]" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          {[
            { stat: "50+", label: "Products", sub: "Across multiple stores" },
            { stat: "10", label: "Service Bundles", sub: "Curated for every need" },
            { stat: "4", label: "Trusted Stores", sub: "Verified sellers" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="text-center"
            >
              <motion.p
                className="text-4xl font-bold text-primary sm:text-5xl"
                initial={{ scale: 0.5 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ duration: 0.5, delay: i * 0.15 + 0.2, type: "spring" }}
              >
                {item.stat}
              </motion.p>
              <p className="mt-2 text-sm font-medium text-text-primary">{item.label}</p>
              <p className="mt-1 text-xs text-text-muted">{item.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SplitSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative overflow-hidden border-t border-border/50">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-primary">
              For shoppers
            </span>
            <h2 className="mt-6 text-3xl font-semibold text-text-primary sm:text-4xl">Shop with ease</h2>
            <p className="mt-3 text-text-muted">Browse, add to cart, and checkout — all in one place.</p>
            <ul className="mt-10 space-y-4">
              {["Browse products and services side by side", "Add items to cart in one click", "Track your orders easily"].map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-start gap-3 text-sm text-text-muted"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] text-primary">&check;</span>
                  {item}
                </motion.li>
              ))}
            </ul>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.5 }}>
              <Link href="/shop" className="mt-8 inline-flex items-center gap-2 rounded-xl border border-border/50 bg-surface px-6 py-3 text-sm font-medium text-text-primary transition-all duration-200 hover:bg-surface-raised hover:shadow-lg">
                Start Shopping <span className="text-lg">&rarr;</span>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-accent">
              For sellers
            </span>
            <h2 className="mt-6 text-3xl font-semibold text-text-primary sm:text-4xl">Sell & grow</h2>
            <p className="mt-3 text-text-muted">List products, create services, and manage your business.</p>
            <ul className="mt-10 space-y-4">
              {["Create and manage your store", "List products and service bundles", "View bookings and analytics"].map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.35 + i * 0.1 }}
                  className="flex items-start gap-3 text-sm text-text-muted"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-[11px] text-accent">&check;</span>
                  {item}
                </motion.li>
              ))}
            </ul>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.65 }}>
              <Link href="/dashboard" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-hover px-6 py-3 text-sm font-medium text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30">
                Go to Dashboard <span className="text-lg">&rarr;</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
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
      <ProductShowcase />
      <ServicesShowcase />
      <StatsSection />
      <SplitSection />

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
