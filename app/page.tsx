"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useInView,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
} from "framer-motion";
import content from "@/data/landingPageContent";

/* ─── Cursor Trail ──────────────────────────────────────────────────────── */
function CursorTrail() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { stiffness: 400, damping: 28 });
  const springY = useSpring(cursorY, { stiffness: 400, damping: 28 });
  const trail1X = useSpring(cursorX, { stiffness: 200, damping: 32 });
  const trail1Y = useSpring(cursorY, { stiffness: 200, damping: 32 });
  const trail2X = useSpring(cursorX, { stiffness: 100, damping: 36 });
  const trail2Y = useSpring(cursorY, { stiffness: 100, damping: 36 });
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => { cursorX.set(e.clientX); cursorY.set(e.clientY); };
    window.addEventListener("mousemove", move);
    const targets = document.querySelectorAll("a, button");
    const enter = () => setHovered(true);
    const leave = () => setHovered(false);
    targets.forEach((el) => { el.addEventListener("mouseenter", enter); el.addEventListener("mouseleave", leave); });
    return () => {
      window.removeEventListener("mousemove", move);
      targets.forEach((el) => { el.removeEventListener("mouseenter", enter); el.removeEventListener("mouseleave", leave); });
    };
  }, [cursorX, cursorY]);

  return (
    <>
      <motion.div className="pointer-events-none fixed top-0 left-0 z-[9999] hidden h-2.5 w-2.5 rounded-full bg-primary lg:block"
        style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%", scale: hovered ? 2.2 : 1, transition: "scale 0.2s ease" }} />
      <motion.div className="pointer-events-none fixed top-0 left-0 z-[9998] hidden h-7 w-7 rounded-full border border-primary/50 lg:block"
        style={{ x: trail1X, y: trail1Y, translateX: "-50%", translateY: "-50%", scale: hovered ? 1.5 : 1, transition: "scale 0.2s ease" }} />
      <motion.div className="pointer-events-none fixed top-0 left-0 z-[9997] hidden h-12 w-12 rounded-full border border-primary/15 lg:block"
        style={{ x: trail2X, y: trail2Y, translateX: "-50%", translateY: "-50%", scale: hovered ? 1.2 : 1, transition: "scale 0.2s ease" }} />
    </>
  );
}

/* ─── NavBar ────────────────────────────────────────────────────────────── */
function NavBar() {
  const { scrollY } = useScroll();
  const blur = useTransform(scrollY, [0, 60], [0, 1]);

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 border-b border-transparent"
      style={{
        backgroundColor: `rgba(10,15,24,${useTransform(scrollY, [0, 60], [0, 0.9])})`,
        borderColor: `rgba(30,42,61,${blur})`,
        backdropFilter: `blur(${useTransform(scrollY, [0, 60], [0, 20])}px)`,
      }}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/assets/logo.png" alt="Market" width={80} height={28} className="h-7 w-auto object-contain" priority />
          </div>
          <nav className="flex items-center gap-2">
            <Link href="/shop" className="group relative px-4 py-2 text-sm font-medium text-text-muted transition-colors hover:text-text-primary">
              Browse
              <span className="absolute bottom-0 left-4 right-4 h-px scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
            <Link href="/dashboard"
              className="relative overflow-hidden rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:bg-primary-hover hover:shadow-primary/30 active:scale-95">
              Open a store
            </Link>
          </nav>
        </div>
      </div>
    </motion.header>
  );
}

/* ─── Hanging Tag ───────────────────────────────────────────────────────── */
function HangingTag({ label, sub, bundled, rotate, delay }: {
  label: string; sub: string; bundled?: boolean; rotate: number; delay: number;
}) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  return (
    <motion.div
      initial={{ opacity: 0, y: -32, rotate: rotate - 8 }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformStyle: "preserve-3d" }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setTilt({ x: ((e.clientY - r.top) / r.height - 0.5) * -14, y: ((e.clientX - r.left) / r.width - 0.5) * 16 });
      }}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      className="relative select-none"
    >
      <div className="mx-auto h-8 w-px bg-gradient-to-b from-border/0 via-border to-border/0" />
      <motion.div
        animate={{ rotateX: tilt.x, rotateY: tilt.y }}
        transition={{ type: "spring", stiffness: 180, damping: 16 }}
        className="relative w-40 rounded-2xl border border-border/70 bg-surface p-4 shadow-2xl shadow-black/30 backdrop-blur-sm"
      >
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 h-4 w-4 rounded-full border border-border/60 bg-base ring-4 ring-base/50" />
        <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
          {bundled ? content.hero.tagLabels.bundled : content.hero.tagLabels.productOnly}
        </p>
        <p className="mt-1.5 text-sm font-semibold text-text-primary leading-tight">{label}</p>
        <p className="mt-0.5 text-[11px] text-text-muted">{sub}</p>
        {bundled && (
          <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-1 text-[10px] font-medium text-accent ring-1 ring-accent/25">
            <span className="h-1 w-1 rounded-full bg-accent" />
            service attached
          </span>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ─── Hero Section ──────────────────────────────────────────────────────── */
function HeroSection() {
  const c = content.hero;
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 80]);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16">
      {/* Background glows */}
      <motion.div className="pointer-events-none absolute inset-0" style={{ y }}>
        <div className="absolute -top-64 left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full opacity-[0.07] blur-[120px]"
          style={{ background: "var(--color-primary)" }} />
        <div className="absolute top-1/4 -right-32 h-[400px] w-[400px] rounded-full opacity-[0.05] blur-[80px]"
          style={{ background: "var(--color-accent)" }} />
        <div className="absolute bottom-0 -left-32 h-[350px] w-[350px] rounded-full opacity-[0.04] blur-[80px]"
          style={{ background: "var(--color-primary)" }} />
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(30,42,61,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(30,42,61,0.35)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
      </motion.div>

      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-24">
        <div className="flex flex-col items-center text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary ring-1 ring-primary/10">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              {c.badge}
            </div>

            {/* Headline */}
            <h1 className="mt-8 text-5xl font-bold leading-[1.06] tracking-[-0.03em] text-text-primary sm:text-6xl lg:text-7xl">
              {c.tagline}{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-primary via-[#7ab39e] to-accent bg-clip-text text-transparent">
                  {c.highlight}
                </span>
                <motion.span
                  className="absolute -bottom-1 left-0 h-px w-full bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0"
                  initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
                />
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-text-secondary sm:text-xl">
              {c.subtitle}
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/shop"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-xl shadow-primary/25 transition-all duration-300 hover:bg-primary-hover hover:shadow-primary/35 active:scale-[0.97]">
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] transition-transform duration-500 group-hover:translate-x-[100%]" />
                {c.cta.shop}
                <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>→</motion.span>
              </Link>
              <Link href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-surface/60 px-8 py-3.5 text-sm font-semibold text-text-primary backdrop-blur-sm transition-all duration-300 hover:border-border-strong hover:bg-surface hover:shadow-lg active:scale-[0.97]">
                {c.cta.dashboard}
              </Link>
            </div>
          </motion.div>

          {/* Hanging tags */}
          <div className="mt-20 hidden items-start justify-center gap-10 sm:flex sm:gap-16">
            <HangingTag label="Trail Bike" sub="Ridge & Co. Cycles" rotate={-5} delay={0.5} />
            <HangingTag label="Sofa Delivery" sub="Linden Furniture" bundled rotate={2} delay={0.65} />
            <HangingTag label="Espresso Machine" sub="Kessler Home Goods" rotate={-3} delay={0.8} />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}>
        <span className="text-[9px] uppercase tracking-[0.25em] text-text-muted">Scroll</span>
        <div className="h-12 w-px bg-gradient-to-b from-primary/40 to-transparent" />
      </motion.div>
    </section>
  );
}

/* ─── Builder Section ───────────────────────────────────────────────────── */
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
    <section ref={ref} className="relative overflow-hidden border-t border-border/50 py-28">
      {/* Subtle section glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <motion.div className="text-center"
          initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}>
          <p className="font-mono text-xs uppercase tracking-widest text-primary mb-3">Interactive demo</p>
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">{b.heading}</h2>
          <p className="mt-3 text-text-secondary">{b.sub}</p>
        </motion.div>

        <motion.div className="mt-16 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start"
          initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.15 }}>

          {/* Selectors */}
          <div className="space-y-8">
            <div>
              <p className="mb-4 font-mono text-[11px] uppercase tracking-widest text-text-muted">{b.productLabel}</p>
              <div className="flex flex-wrap gap-2">
                {b.products.map((p) => (
                  <button key={p.id} onClick={() => { setProductId(p.id); setAdded(false); }}
                    className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200 active:scale-95 ${
                      productId === p.id
                        ? "border-primary/50 bg-primary/10 text-primary shadow-lg shadow-primary/10 ring-1 ring-primary/30"
                        : "border-border/50 bg-surface/60 text-text-muted hover:border-border-strong hover:text-text-primary"
                    }`}>
                    <span className="mr-1.5">{p.emoji}</span>{p.name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-4 font-mono text-[11px] uppercase tracking-widest text-text-muted">{b.serviceLabel}</p>
              <div className="flex flex-wrap gap-2">
                {b.services.map((s) => (
                  <button key={s.id} onClick={() => { setServiceId(s.id); setAdded(false); }}
                    className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200 active:scale-95 ${
                      serviceId === s.id
                        ? "border-accent/40 bg-accent/8 text-accent shadow-lg shadow-accent/10 ring-1 ring-accent/25"
                        : "border-border/50 bg-surface/60 text-text-muted hover:border-border-strong hover:text-text-primary"
                    }`}>
                    {s.name}{s.price > 0 && <span className="ml-1.5 opacity-50">+${s.price}</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Preview card */}
          <div className="relative">
            <div className="absolute inset-0 rounded-3xl bg-primary/5 blur-2xl" />
            <motion.div key={`${productId}-${serviceId}`}
              initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-2xl border border-border/60 bg-surface p-6 shadow-2xl shadow-black/20">

              <div className="flex items-center justify-between mb-5">
                <span className="font-mono text-[10px] uppercase tracking-widest text-text-muted">Listing preview</span>
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary ring-1 ring-primary/20">{product.store}</span>
              </div>

              <div className="flex items-center gap-4 p-3 rounded-xl bg-surface-raised/50">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-2xl border border-border/40">{product.emoji}</div>
                <div>
                  <p className="text-base font-semibold text-text-primary">{product.name}</p>
                  <p className="text-sm font-medium text-primary mt-0.5">${product.price}</p>
                </div>
              </div>

              <AnimatePresence>
                {service.id !== "none" && (
                  <motion.div initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }} className="overflow-hidden">
                    <div className="flex items-center justify-between rounded-xl border border-accent/20 bg-accent/6 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                        <span className="text-sm font-medium text-accent">{service.name}</span>
                      </div>
                      <span className="text-xs font-medium text-text-muted">+${service.price}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-5 flex items-center justify-between border-t border-border/50 pt-4">
                <span className="text-sm text-text-muted">{b.totalLabel}</span>
                <motion.span key={total} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  className="text-xl font-bold text-text-primary">${total}</motion.span>
              </div>

              <motion.button onClick={() => setAdded(true)} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}
                className="mt-5 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover hover:shadow-primary/30">
                {b.addToCart}
              </motion.button>

              <AnimatePresence>
                {added && (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="mt-3 flex items-center justify-center gap-1.5 text-xs font-medium text-accent">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />{b.added}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Flow Section ──────────────────────────────────────────────────────── */
function FlowSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const f = content.flow;

  return (
    <section ref={ref} className="relative overflow-hidden border-t border-border/50 py-28">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-border-strong/40 to-transparent" />

      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <motion.div className="text-center"
          initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}>
          <p className="font-mono text-xs uppercase tracking-widest text-primary mb-3">How it works</p>
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">{f.heading}</h2>
          <p className="mt-3 text-text-secondary">{f.sub}</p>
        </motion.div>

        <div className="mt-16 grid gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Owner card */}
          <motion.div initial={{ opacity: 0, x: -40 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7, delay: 0.2 }}>
            <div className="group relative h-full overflow-hidden rounded-2xl border border-border/60 bg-surface p-8 transition-all duration-500 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
              <div className="flex items-center gap-3 mb-8">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-lg font-bold text-primary">S</div>
                <div>
                  <h3 className="text-base font-semibold text-text-primary">{f.owner.label}</h3>
                  <p className="text-xs text-text-muted">{f.owner.sublabel}</p>
                </div>
              </div>

              <div className="space-y-2">
                {f.owner.steps.map((item, i) => (
                  <motion.div key={item.step}
                    initial={{ opacity: 0, y: 16 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.35 + i * 0.12 }}
                    className="group/step flex items-start gap-4 rounded-xl p-3.5 transition-colors duration-200 hover:bg-primary/5 cursor-default">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-[11px] font-bold text-primary ring-1 ring-primary/20">{item.step}</span>
                    <div>
                      <p className="text-sm font-medium text-text-primary">{item.title}</p>
                      <p className="mt-0.5 text-xs text-text-muted leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8">
                <Link href="/dashboard"
                  className="group/btn inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover hover:shadow-primary/30 active:scale-95">
                  {f.owner.cta}
                  <span className="transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Customer card */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7, delay: 0.2 }}>
            <div className="group relative h-full overflow-hidden rounded-2xl border border-border/60 bg-surface p-8 transition-all duration-500 hover:border-accent/30 hover:shadow-2xl hover:shadow-accent/5">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
              <div className="flex items-center gap-3 mb-8">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 border border-accent/20 text-lg font-bold text-accent">C</div>
                <div>
                  <h3 className="text-base font-semibold text-text-primary">{f.customer.label}</h3>
                  <p className="text-xs text-text-muted">{f.customer.sublabel}</p>
                </div>
              </div>

              <div className="space-y-2">
                {f.customer.steps.map((item, i) => (
                  <motion.div key={item.step}
                    initial={{ opacity: 0, y: 16 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.35 + i * 0.12 }}
                    className="flex items-start gap-4 rounded-xl p-3.5 transition-colors duration-200 hover:bg-accent/5 cursor-default">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-[11px] font-bold text-accent ring-1 ring-accent/20">{item.step}</span>
                    <div>
                      <p className="text-sm font-medium text-text-primary">{item.title}</p>
                      <p className="mt-0.5 text-xs text-text-muted leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8">
                <Link href="/shop"
                  className="group/btn inline-flex items-center gap-2 rounded-xl border border-accent/30 bg-accent/8 px-5 py-2.5 text-sm font-semibold text-accent transition-all hover:bg-accent/15 active:scale-95">
                  {f.customer.cta}
                  <span className="transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Connector pill */}
        <motion.div className="mt-12 flex justify-center"
          initial={{ opacity: 0, scale: 0.9 }} animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.85, type: "spring", stiffness: 120 }}>
          <div className="inline-flex items-center gap-4 rounded-2xl border border-border/50 bg-surface/80 px-7 py-3.5 shadow-xl shadow-black/10 backdrop-blur-sm">
            <span className="text-sm text-text-muted">{f.owner.label}</span>
            <motion.div className="flex items-center gap-1" animate={{ x: [0, 4, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <span className="h-px w-10 bg-gradient-to-r from-primary to-primary/40" />
              <span className="text-primary text-xs">→</span>
            </motion.div>
            <span className="text-sm font-semibold text-text-primary">Marketplace</span>
            <motion.div className="flex items-center gap-1" animate={{ x: [0, 4, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}>
              <span className="h-px w-10 bg-gradient-to-r from-accent/40 to-accent" />
              <span className="text-accent text-xs">→</span>
            </motion.div>
            <span className="text-sm text-text-muted">{f.customer.label}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Value Section ─────────────────────────────────────────────────────── */
function ValueSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const v = content.values;

  return (
    <section ref={ref} className="relative overflow-hidden border-t border-border/50 py-28"
      style={{ background: "linear-gradient(180deg, var(--color-surface) 0%, var(--color-base) 100%)" }}>
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-border-strong/40 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div className="text-center"
          initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}>
          <p className="font-mono text-xs uppercase tracking-widest text-primary mb-3">Why it works</p>
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">{v.heading}</h2>
          <p className="mt-3 text-text-secondary">{v.sub}</p>
        </motion.div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {v.items.map((item, i) => (
            <motion.div key={item.title}
              initial={{ opacity: 0, y: 32 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.13 }}
              whileHover={{ y: -5, transition: { duration: 0.25 } }}
              className="group relative overflow-hidden rounded-2xl border border-border/50 bg-surface p-7 cursor-default transition-all duration-300 hover:border-primary/25 hover:shadow-2xl hover:shadow-primary/5">
              {/* card top glow on hover */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/0 to-transparent transition-all duration-300 group-hover:via-primary/30" />
              <motion.div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border/60 bg-surface-raised text-primary transition-all duration-300 group-hover:border-primary/30 group-hover:bg-primary/10"
                whileHover={{ rotate: 8, scale: 1.08 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={item.icon} />
                </svg>
              </motion.div>
              <h3 className="mt-5 text-base font-semibold text-text-primary">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Stats Bar ─────────────────────────────────────────────────────────── */
function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const s = content.stats;

  return (
    <section ref={ref} className="relative border-t border-border/50 py-20">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-border-strong/40 to-transparent" />
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-surface">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(92,131,116,0.08),transparent)]" />
          <div className="grid divide-x divide-border/50 sm:grid-cols-3">
            {s.items.map((item, i) => (
              <motion.div key={item.label}
                initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group py-10 px-8 text-center cursor-default transition-colors hover:bg-primary/3">
                <motion.p className="text-3xl font-bold text-text-primary transition-colors duration-300 group-hover:text-primary sm:text-4xl"
                  whileHover={{ scale: 1.06 }}>
                  {item.stat}
                </motion.p>
                <p className="mt-2 text-sm text-text-muted">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── CTA Section ───────────────────────────────────────────────────────── */
function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const c = content.cta;

  return (
    <section ref={ref} className="relative overflow-hidden border-t border-border/50 py-28">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.07] blur-[100px]"
          style={{ background: "var(--color-primary)" }} />
        <div className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-3xl px-6 text-center lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}>
          <h2 className="text-4xl font-bold tracking-tight text-text-primary sm:text-5xl leading-[1.1]">{c.heading}</h2>
          <p className="mt-5 text-lg text-text-secondary leading-relaxed">{c.sub}</p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/shop"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-primary px-9 py-4 text-sm font-semibold text-white shadow-xl shadow-primary/25 transition-all hover:bg-primary-hover hover:shadow-primary/35 active:scale-[0.97]">
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] transition-transform duration-500 group-hover:translate-x-[100%]" />
              {c.shop}
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
            <Link href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-surface/60 px-9 py-4 text-sm font-semibold text-text-primary backdrop-blur-sm transition-all hover:border-border-strong hover:bg-surface hover:shadow-lg active:scale-[0.97]">
              {c.dashboard}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Page Root ─────────────────────────────────────────────────────────── */
export default function LandingPage() {
  const f = content.footer;

  return (
    <div className="min-h-screen" style={{ background: "var(--color-base)" }}>
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
            <div className="flex items-center gap-3">
              <Image src="/assets/logo.png" alt="Market" width={64} height={22} className="h-5 w-auto object-contain opacity-60" />
            </div>
            <div className="flex items-center gap-6">
              {f.links.map((link) => (
                <Link key={link.label} href={link.href}
                  className="group relative text-sm text-text-muted transition-colors hover:text-text-primary">
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
