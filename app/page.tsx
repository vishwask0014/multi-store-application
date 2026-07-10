"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, useInView, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import content from "@/data/landingPageContent";

function CursorTrail() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { stiffness: 300, damping: 25 });
  const springY = useSpring(cursorY, { stiffness: 300, damping: 25 });
  const trail1X = useSpring(cursorX, { stiffness: 200, damping: 30 });
  const trail1Y = useSpring(cursorY, { stiffness: 200, damping: 30 });
  const trail2X = useSpring(cursorX, { stiffness: 120, damping: 35 });
  const trail2Y = useSpring(cursorY, { stiffness: 120, damping: 35 });
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    function move(e: MouseEvent) { cursorX.set(e.clientX); cursorY.set(e.clientY) }
    window.addEventListener("mousemove", move);

    function onHoverStart() { setHovered(true) }
    function onHoverEnd() { setHovered(false) }
    const targets = document.querySelectorAll("a, button");
    targets.forEach((el) => { el.addEventListener("mouseenter", onHoverStart); el.addEventListener("mouseleave", onHoverEnd) });

    return () => {
      window.removeEventListener("mousemove", move);
      targets.forEach((el) => { el.removeEventListener("mouseenter", onHoverStart); el.removeEventListener("mouseleave", onHoverEnd) });
    };
  }, [cursorX, cursorY]);

  return (
    <>
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] hidden h-3 w-3 rounded-full bg-primary mix-blend-difference lg:block"
        style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%", scale: hovered ? 1.8 : 1 }}
      />
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9998] hidden h-6 w-6 rounded-full border border-primary/40 mix-blend-difference lg:block"
        style={{ x: trail1X, y: trail1Y, translateX: "-50%", translateY: "-50%", scale: hovered ? 1.4 : 1 }}
      />
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9997] hidden h-10 w-10 rounded-full border border-primary/20 mix-blend-difference lg:block"
        style={{ x: trail2X, y: trail2Y, translateX: "-50%", translateY: "-50%", scale: hovered ? 1.2 : 1 }}
      />
    </>
  );
}

function NavBar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-base/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-hover text-sm font-medium shadow-lg shadow-primary/20">
              M
            </div>
            <span className="text-base font-semibold text-text-primary">Market</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/shop" className="group relative text-sm font-medium text-text-muted transition-colors hover:text-text-primary">
              Browse
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link
              href="/dashboard"
              className="rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary ring-1 ring-primary/20 transition-all duration-300 hover:bg-primary/20 hover:ring-primary/40 active:scale-95"
            >
              Dashboard
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

function HangingTag({
  label,
  sub,
  bundled,
  rotate,
  delay,
}: {
  label: string;
  sub: string;
  bundled?: boolean;
  rotate: number;
  delay: number;
}) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  return (
    <motion.div
      initial={{ opacity: 0, y: -24, rotate: rotate - 6 }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      style={{ transformStyle: "preserve-3d" }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        setTilt({ x: py * -12, y: px * 14 });
      }}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      className="relative"
    >
      <div className="mx-auto h-6 w-px bg-border/70" />
      <motion.div
        animate={{ rotateX: tilt.x, rotateY: tilt.y }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        className="relative w-44 rounded-xl border border-border/60 bg-surface p-4 shadow-xl shadow-black/5"
      >
        <div className="absolute -top-2 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full border border-border/60 bg-base" />
        <p className="font-mono text-[11px] uppercase tracking-wide text-text-muted">
          {bundled ? content.hero.tagLabels.bundled : content.hero.tagLabels.productOnly}
        </p>
        <p className="mt-1 text-sm font-semibold text-text-primary">{label}</p>
        <p className="mt-0.5 text-xs text-text-muted">{sub}</p>
        {bundled && (
          <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent ring-1 ring-accent/20">
            + service attached
          </span>
        )}
      </motion.div>
    </motion.div>
  );
}

function HeroSection() {
  const c = content.hero;

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16">
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -top-48 -right-48 h-[500px] w-[500px] rounded-full opacity-15 blur-3xl"
          style={{ background: "var(--color-primary)" }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-48 -left-48 h-[400px] w-[400px] rounded-full opacity-10 blur-3xl"
          style={{ background: "var(--color-accent)" }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--color-primary)_0%,_transparent_60%)] opacity-[0.06]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-20">
        <div className="flex flex-col items-center text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <span className="flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              {c.badge}
            </span>

            <h1 className="mt-8 text-5xl font-bold leading-[1.05] tracking-tight text-text-primary sm:text-6xl lg:text-7xl">
              {c.tagline}{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {c.highlight}
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-text-muted sm:text-xl">
              {c.subtitle}
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/shop"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-primary to-primary-hover px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 active:scale-95"
              >
                <span className="absolute inset-0 translate-y-full bg-white/10 transition-transform duration-300 group-hover:translate-y-0" />
                <span className="relative flex items-center gap-2">
                  {c.cta.shop}
                  <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>&rarr;</motion.span>
                </span>
              </Link>
              <Link
                href="/dashboard"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl border border-border/50 bg-surface/50 px-8 py-3.5 text-sm font-semibold text-text-primary backdrop-blur-sm transition-all duration-300 hover:bg-surface hover:shadow-lg active:scale-95"
              >
                {c.cta.dashboard}
              </Link>
            </div>
          </motion.div>

          <div className="mt-16 flex items-start justify-center gap-8 sm:gap-14">
            <HangingTag label="Trail Bike" sub="Ridge & Co. Cycles" rotate={-6} delay={0.5} />
            <HangingTag label="Sofa Delivery" sub="Linden Furniture" bundled rotate={3} delay={0.65} />
            <HangingTag label="Espresso Machine" sub="Kessler Home Goods" rotate={-2} delay={0.8} />
          </div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.2em] text-text-muted">Scroll</span>
          <div className="h-10 w-px bg-gradient-to-b from-primary/50 to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}

function BuilderSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const b = content.builder;

  const [productId, setProductId] = useState(b.products[0].id);
  const [serviceId, setServiceId] = useState(b.services[1].id);
  const [added, setAdded] = useState(false);

  const product = b.products.find((p) => p.id === productId)!;
  const service = b.services.find((s) => s.id === serviceId)!;
  const total = product.price + service.price;

  return (
    <section ref={ref} className="relative overflow-hidden border-t border-border/50 py-24">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl font-semibold text-text-primary sm:text-4xl">{b.heading}</h2>
          <p className="mt-3 text-text-muted">{b.sub}</p>
        </motion.div>

        <motion.div
          className="mt-14 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <div className="space-y-8">
            <div>
              <p className="mb-3 font-mono text-xs uppercase tracking-wide text-text-muted">{b.productLabel}</p>
              <div className="flex flex-wrap gap-2">
                {b.products.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => { setProductId(p.id); setAdded(false) }}
                    className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200 active:scale-95 ${
                      productId === p.id
                        ? "border-primary bg-primary/10 text-primary ring-1 ring-primary/30"
                        : "border-border/60 bg-surface text-text-muted hover:border-border hover:text-text-primary hover:shadow-md"
                    }`}
                  >
                    <span className="mr-1.5">{p.emoji}</span>
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-3 font-mono text-xs uppercase tracking-wide text-text-muted">{b.serviceLabel}</p>
              <div className="flex flex-wrap gap-2">
                {b.services.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => { setServiceId(s.id); setAdded(false) }}
                    className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200 active:scale-95 ${
                      serviceId === s.id
                        ? "border-accent bg-accent/10 text-accent ring-1 ring-accent/30"
                        : "border-border/60 bg-surface text-text-muted hover:border-border hover:text-text-primary hover:shadow-md"
                    }`}
                  >
                    {s.name}
                    {s.price > 0 && <span className="ml-1.5 opacity-60">+${s.price}</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="relative">
            <motion.div
              key={`${productId}-${serviceId}`}
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="rounded-2xl border border-border/60 bg-surface p-6 shadow-xl shadow-black/5"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wide text-text-muted">Listing preview</span>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary ring-1 ring-primary/20">{product.store}</span>
              </div>

              <div className="mt-4 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/5 text-2xl">
                  {product.emoji}
                </div>
                <div>
                  <p className="text-base font-semibold text-text-primary">{product.name}</p>
                  <p className="text-xs text-text-muted">${product.price}</p>
                </div>
              </div>

              <AnimatePresence>
                {service.id !== "none" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    className="overflow-hidden border-t border-dashed border-border/60 pt-4"
                  >
                    <div className="flex items-center justify-between rounded-lg bg-accent/5 px-3 py-2">
                      <span className="text-sm font-medium text-accent">{service.name}</span>
                      <span className="text-xs text-text-muted">+${service.price}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4">
                <span className="text-sm text-text-muted">{b.totalLabel}</span>
                <span className="text-lg font-semibold text-text-primary">${total}</span>
              </div>

              <motion.button
                onClick={() => setAdded(true)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="mt-5 w-full rounded-xl bg-gradient-to-r from-primary to-primary-hover py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl"
              >
                {b.addToCart}
              </motion.button>

              <AnimatePresence>
                {added && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-3 text-center text-xs font-medium text-accent"
                  >
                    {b.added}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FlowSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const f = content.flow;

  return (
    <section ref={ref} className="relative overflow-hidden border-t border-border/50 py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl font-semibold text-text-primary sm:text-4xl">{f.heading}</h2>
          <p className="mt-3 text-text-muted">{f.sub}</p>
        </motion.div>

        <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-hover text-sm font-bold text-white shadow-lg shadow-primary/20">
                  S
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text-primary">{f.owner.label}</h3>
                  <p className="text-sm text-text-muted">{f.owner.sublabel}</p>
                </div>
              </div>

              <div className="mt-8 space-y-6">
                {f.owner.steps.map((item, i) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.15 }}
                    whileHover={{ x: 4 }}
                    className="group flex items-start gap-4 rounded-xl p-4 transition-all duration-300 hover:bg-primary/5"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20 transition-all duration-300 group-hover:ring-primary/40 group-hover:shadow-md">
                      {item.step}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-text-primary">{item.title}</p>
                      <p className="mt-0.5 text-xs text-text-muted">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div className="mt-8" initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.8 }}>
                <Link
                  href="/dashboard"
                  className="group inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary-hover px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl active:scale-95"
                >
                  {f.owner.cta}
                  <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="rounded-2xl border border-accent/20 bg-accent/5 p-8 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-hover text-sm font-bold text-white shadow-lg shadow-accent/20">
                  C
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text-primary">{f.customer.label}</h3>
                  <p className="text-sm text-text-muted">{f.customer.sublabel}</p>
                </div>
              </div>

              <div className="mt-8 space-y-6">
                {f.customer.steps.map((item, i) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.15 }}
                    whileHover={{ x: 4 }}
                    className="group flex items-start gap-4 rounded-xl p-4 transition-all duration-300 hover:bg-accent/5"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-xs font-bold text-accent ring-1 ring-accent/20 transition-all duration-300 group-hover:ring-accent/40 group-hover:shadow-md">
                      {item.step}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-text-primary">{item.title}</p>
                      <p className="mt-0.5 text-xs text-text-muted">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div className="mt-8" initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.8 }}>
                <Link
                  href="/shop"
                  className="group inline-flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/10 px-5 py-2.5 text-sm font-medium text-accent transition-all duration-300 hover:bg-accent/20 active:scale-95"
                >
                  {f.customer.cta}
                  <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="mt-16 flex justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
        >
          <div className="inline-flex items-center gap-3 rounded-2xl border border-border/50 bg-surface px-6 py-4 shadow-lg">
            <span className="text-sm text-text-muted">{f.owner.label}</span>
            <motion.div className="flex items-center gap-1" animate={{ x: [0, 3, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <span className="block h-px w-8 bg-primary" />
              <span className="text-primary">&rarr;</span>
            </motion.div>
            <span className="text-sm font-medium text-text-primary">Marketplace</span>
            <motion.div className="flex items-center gap-1" animate={{ x: [0, 3, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}>
              <span className="block h-px w-8 bg-accent" />
              <span className="text-accent">&rarr;</span>
            </motion.div>
            <span className="text-sm text-text-muted">{f.customer.label}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ValueSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const v = content.values;

  return (
    <section ref={ref} className="relative overflow-hidden border-t border-border/50 bg-surface/20 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl font-semibold text-text-primary sm:text-4xl">{v.heading}</h2>
          <p className="mt-3 text-text-muted">{v.sub}</p>
        </motion.div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {v.items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              whileHover={{ y: -6 }}
              className="group cursor-default rounded-2xl border border-border/50 bg-surface p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
            >
              <motion.div
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary/20"
                whileHover={{ rotate: 10, scale: 1.1 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={item.icon} />
                </svg>
              </motion.div>
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
  const s = content.stats;

  return (
    <section ref={ref} className="border-t border-border/50 py-16">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          {s.items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group text-center"
            >
              <motion.p
                className="text-3xl font-bold text-text-primary sm:text-4xl transition-all duration-300 group-hover:text-primary"
                whileHover={{ scale: 1.1 }}
              >
                {item.stat}
              </motion.p>
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
  const c = content.cta;

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
          {c.heading}
        </motion.h2>
        <motion.p
          className="mt-4 text-lg text-text-muted"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
        >
          {c.sub}
        </motion.p>
        <motion.div
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
        >
          <Link href="/shop" className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-hover px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 active:scale-95">
            {c.shop}
            <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
          </Link>
          <Link href="/dashboard" className="group inline-flex items-center gap-2 rounded-xl border border-border/50 bg-surface px-8 py-3.5 text-sm font-semibold text-text-primary transition-all duration-300 hover:bg-surface-raised active:scale-95">
            {c.dashboard}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  const f = content.footer;

  return (
    <div className="min-h-screen bg-[var(--color-base)]">
      <CursorTrail />
      <NavBar />
      <HeroSection />
      <BuilderSection />
      <FlowSection />
      <ValueSection />
      <StatsBar />
      <CTASection />

      <footer className="border-t border-border/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <p className="text-sm text-text-muted">&copy; {new Date().getFullYear()} {f.copyright}</p>
            <div className="flex items-center gap-6">
              {f.links.map((link) => (
                <Link key={link.label} href={link.href} className="group relative text-sm text-text-muted transition-colors hover:text-text-primary">
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
