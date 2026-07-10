"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Lenis from "lenis";
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring } from "framer-motion";
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

function CursorGlow() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const springX = useSpring(x, { stiffness: 100, damping: 30 });
  const springY = useSpring(y, { stiffness: 100, damping: 30 });

  useEffect(() => {
    function move(e: MouseEvent) { x.set(e.clientX); y.set(e.clientY) }
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[60] h-64 w-64 rounded-full opacity-[0.06] blur-3xl"
      style={{ background: "var(--color-primary)", x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
    />
  );
}

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  function handleMouse(e: React.MouseEvent) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRotate({ x: -y * 12, y: x * 12 });
  }

  function handleLeave() { setRotate({ x: 0, y: 0 }) }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      className={className}
      style={{ perspective: 1000 }}
      animate={{ rotateX: rotate.x, rotateY: rotate.y }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}

function ParallaxImg({ src, alt, speed = 0.5, className = "" }: { src: string; alt: string; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [speed * 100, -speed * 100]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.img src={src} alt={alt} style={{ y }} className="h-full w-full object-cover" />
    </div>
  );
}

function MarqueeBand({ items }: { items: string[] }) {
  return (
    <div className="relative overflow-hidden border-y border-border/50 bg-surface/30 py-4">
      <motion.div
        className="flex gap-12"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {[...items, ...items].map((item, i) => (
          <span key={i} className="whitespace-nowrap text-sm font-medium uppercase tracking-[0.2em] text-text-muted/50">
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function MeshBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <motion.div
        className="absolute -top-1/4 -right-1/4 h-[600px] w-[600px] rounded-full blur-[120px]"
        style={{ background: "var(--color-primary)" }}
        animate={{ x: [0, 60, -30, 0], y: [0, -40, 20, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-1/4 -left-1/4 h-[500px] w-[500px] rounded-full blur-[120px]"
        style={{ background: "var(--color-accent, #5C8374)" }}
        animate={{ x: [0, -50, 30, 0], y: [0, 30, -40, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--color-primary)_0%,_transparent_70%)] opacity-[0.05]" />
    </div>
  );
}

function NavBar() {
  const { scrollY } = useScroll();
  const bg = useTransform(scrollY, [0, 100], ["rgba(10,15,24,0)", "rgba(10,15,24,0.9)"]);

  return (
    <motion.header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl" style={{ background: bg }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <motion.div className="flex items-center gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-hover text-sm font-medium shadow-lg shadow-primary/20">M</div>
          <span className="text-base font-semibold text-text-primary">Market</span>
        </motion.div>
        <motion.nav className="flex items-center gap-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.1 }}>
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
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);

  const taglines = ["fresh finds", "daily essentials", "local stores", "smart deals"];
  const [tagIndex, setTagIndex] = useState(0);
  const [text, setText] = useState("");
  const [dir, setDir] = useState(1);

  useEffect(() => {
    const word = taglines[tagIndex];
    const timer = setInterval(() => {
      setText((prev) => {
        const len = prev.length;
        if (dir === 1) {
          if (len >= word.length) { setTimeout(() => setDir(-1), 800); return prev }
          return word.slice(0, len + 1);
        }
        if (len <= 0) { setDir(1); setTagIndex((i) => (i + 1) % taglines.length); return "" }
        return word.slice(0, len - 1);
      });
    }, 50);
    return () => clearInterval(timer);
  }, [tagIndex, dir, taglines]);

  return (
    <section ref={ref} className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <MeshBackground />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--color-primary)_0%,_transparent_50%)] opacity-[0.08]" />

      <motion.div style={{ y }} className="relative z-10 mx-auto w-full max-w-7xl px-6 py-32">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <span className="flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Multi-store marketplace
            </span>

            <h1 className="mt-8 text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              <span className="text-text-primary">Discover </span>
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-primary via-primary-hover to-accent bg-clip-text text-transparent">
                  {text}
                </span>
                <span className="absolute -right-3 top-0 text-primary animate-pulse">|</span>
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-text-muted sm:text-xl">
              Browse products and services from trusted stores near you.
              One marketplace, endless possibilities.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
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
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
            className="mt-16 grid w-full max-w-4xl grid-cols-4 gap-3"
          >
            {products.slice(0, 4).map((p, i) => (
              <TiltCard key={p.title}>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + i * 0.1 }}
                  className="group relative overflow-hidden rounded-2xl border border-border/50 bg-surface/60 backdrop-blur-sm transition-all duration-300 hover:border-border hover:shadow-lg"
                >
                  <div className="aspect-[3/4] overflow-hidden">
                    <img src={p.image} alt={p.title} className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-base/90 via-base/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-xs font-medium text-text-primary/90 truncate">{p.title}</p>
                    <p className="text-sm font-bold text-primary">${p.price.toFixed(2)}</p>
                  </div>
                  <motion.div
                    className="absolute inset-0 border-2 border-transparent rounded-2xl"
                    whileHover={{ borderColor: "var(--color-primary)" }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </TiltCard>
            ))}
          </motion.div>
        </div>
      </motion.div>

      <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.2em] text-text-muted">Scroll</span>
          <div className="h-10 w-[1px] bg-gradient-to-b from-primary/50 to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}

function ProductShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const featured = products.slice(0, 8);

  return (
    <section ref={ref} className="relative overflow-hidden border-t border-border/50">
      <div className="mx-auto max-w-7xl px-6 py-28 lg:px-8">
        <motion.div className="text-center" initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            Shop now
          </span>
          <h2 className="mt-6 text-3xl font-semibold text-text-primary sm:text-4xl">Featured Products</h2>
          <p className="mt-3 text-text-muted">Handpicked just for you</p>
        </motion.div>

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {featured.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.06, ease: "easeOut" }}
            >
              <TiltCard>
                <div className="group relative cursor-pointer">
                  <div className="relative aspect-square overflow-hidden rounded-2xl border border-border/50 bg-surface transition-all duration-500 group-hover:border-border group-hover:shadow-xl group-hover:shadow-black/15">
                    <img src={p.image} alt={p.title} className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-base/90 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      <motion.button
                        className="w-full rounded-lg bg-primary py-2.5 text-xs font-medium text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        Quick add
                      </motion.button>
                    </div>
                    <div className="absolute top-3 right-3">
                      <motion.div
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-base/60 backdrop-blur-sm text-text-muted transition-colors hover:text-red-400"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                      </motion.div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 px-1">
                    <p className="text-xs text-text-muted truncate">{p.title}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-text-primary">${p.price.toFixed(2)}</p>
                      <span className="text-[10px] text-text-muted line-through">${(p.price * 1.2).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>

        <motion.div className="mt-14 text-center" initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.6 }}>
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 rounded-xl border border-border/50 bg-surface px-7 py-3 text-sm font-medium text-text-primary transition-all duration-200 hover:bg-surface-raised hover:shadow-lg"
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
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative overflow-hidden border-t border-border/50">
      <MarqueeBand items={services.map((s) => s.title)} />
      <div className="mx-auto max-w-7xl px-6 py-28 lg:px-8">
        <motion.div className="text-center" initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}>
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-3 py-1 text-xs font-medium text-accent">
            Curated services
          </span>
          <h2 className="mt-6 text-3xl font-semibold text-text-primary sm:text-4xl">Services for every occasion</h2>
          <p className="mt-3 text-text-muted">From parties to wellness — we&apos;ve got you covered</p>
        </motion.div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <TiltCard>
                <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-surface transition-all duration-500 hover:border-border hover:shadow-xl">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <ParallaxImg src={s.image} alt={s.title} speed={0.3} className="h-full w-full" />
                    <div className="absolute inset-0 bg-gradient-to-t from-base/90 via-base/20 to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-[11px] font-medium text-accent ring-1 ring-accent/20 backdrop-blur-sm">
                        From ${s.price.toFixed(0)}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-text-primary">{s.title}</h3>
                    <p className="mt-1 text-xs text-text-muted line-clamp-2">{s.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-text-muted">
                        <span className="font-medium text-text-primary">{s.productCount}</span> products
                      </span>
                      <motion.button
                        className="rounded-lg bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary transition-all duration-200 hover:bg-primary/20"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        Book now
                      </motion.button>
                    </div>
                  </div>
                </div>
              </TiltCard>
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

  function Counter({ to, suffix = "", delay = 0 }: { to: number; suffix?: string; delay?: number }) {
    const [val, setVal] = useState(0);
    const counted = useRef(false);

    useEffect(() => {
      if (!isInView || counted.current) return;
      counted.current = true;
      let start = 0;
      const duration = 2000;
      const step = 20;
      const inc = to / (duration / step);
      const timeout = setTimeout(() => {
        const timer = setInterval(() => {
          start += inc;
          if (start >= to) { setVal(to); clearInterval(timer) }
          else setVal(Math.floor(start));
        }, step);
      }, delay * 1000);
      return () => clearTimeout(timeout);
    }, [isInView, to, delay]);

    return <>{val}{suffix}</>;
  }

  return (
    <section ref={ref} className="relative overflow-hidden border-t border-border/50 bg-surface/20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--color-primary)_0%,_transparent_70%)] opacity-[0.05]" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-3">
          {[
            { stat: 50, suffix: "+", label: "Products", sub: "Across multiple stores", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
            { stat: 10, suffix: "", label: "Service Bundles", sub: "Curated for every need", icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" },
            { stat: 4, suffix: "", label: "Trusted Stores", sub: "Verified sellers", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="group relative text-center"
            >
              <motion.div
                className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 ring-1 ring-primary/10 transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/20"
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: i * 0.15 + 0.1 }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={item.icon} />
                </svg>
              </motion.div>
              <p className="mt-4 text-4xl font-bold text-text-primary sm:text-5xl">
                <Counter to={item.stat} suffix={item.suffix} delay={i * 0.15 + 0.3} />
              </p>
              <p className="mt-2 text-sm font-medium text-text-primary">{item.label}</p>
              <p className="mt-1 text-xs text-text-muted">{item.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive] = useState(0);

  const testimonials = [
    { name: "Alex R.", role: "Shopper", text: "Found exactly what I needed across different stores. The cart system makes it so easy to buy from multiple sellers at once.", rating: 5 },
    { name: "Sarah K.", role: "Store Owner", text: "Managing my inventory and service bundles has never been easier. The dashboard gives me full control of my business.", rating: 5 },
    { name: "Mike L.", role: "Shopper", text: "I love how I can browse both products and services in one place. Booked a party package in under 2 minutes!", rating: 5 },
  ];

  useEffect(() => {
    if (!isInView) return;
    const timer = setInterval(() => setActive((a) => (a + 1) % testimonials.length), 4000);
    return () => clearInterval(timer);
  }, [isInView, testimonials.length]);

  return (
    <section ref={ref} className="relative overflow-hidden border-t border-border/50">
      <div className="mx-auto max-w-3xl px-6 py-28 text-center lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}>
          <span className="inline-flex items-center gap-2 rounded-full border border-warning/20 bg-warning/5 px-3 py-1 text-xs font-medium text-warning">Testimonials</span>
        </motion.div>
        <div className="relative mt-14 h-48">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 flex flex-col items-center justify-center"
              initial={{ opacity: 0, x: 60 }}
              animate={active === i ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <div className="flex gap-1">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <motion.span
                    key={j}
                    className="text-warning text-lg"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={active === i ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.2 + j * 0.1 }}
                  >
                    &#9733;
                  </motion.span>
                ))}
              </div>
              <p className="mt-4 text-lg leading-relaxed text-text-primary italic sm:text-xl">&ldquo;{t.text}&rdquo;</p>
              <div className="mt-6">
                <p className="text-sm font-medium text-text-primary">{t.name}</p>
                <p className="text-xs text-text-muted">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-6 flex justify-center gap-2">
          {testimonials.map((_, i) => (
            <button key={i} onClick={() => setActive(i)} className={`h-1.5 rounded-full transition-all duration-500 ${active === i ? "w-8 bg-primary" : "w-1.5 bg-border"}`} />
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
    <section ref={ref} className="relative overflow-hidden border-t border-border/50">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--color-primary)_0%,_transparent_60%)] opacity-[0.06]" />
      <MeshBackground />
      <div className="relative mx-auto max-w-4xl px-6 py-28 text-center lg:px-8">
        <motion.h2
          className="text-4xl font-bold text-text-primary sm:text-5xl"
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
          Join thousands of shoppers and sellers on Market today.
        </motion.p>
        <motion.div
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
        >
          <Link href="/shop" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-hover px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]">
            Start Shopping <span>&rarr;</span>
          </Link>
          <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-xl border border-border/50 bg-surface/50 px-8 py-3.5 text-sm font-semibold text-text-primary backdrop-blur-sm transition-all duration-300 hover:bg-surface active:scale-[0.98]">
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
      <CursorGlow />
      <NavBar />
      <HeroSection />
      <ProductShowcase />
      <ServicesShowcase />
      <StatsSection />
      <TestimonialSection />
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
