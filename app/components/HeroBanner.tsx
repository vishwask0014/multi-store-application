export default function HeroBanner() {
  return (
    <section className="group relative overflow-hidden rounded-xl border border-border/50 sm:rounded-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-surface to-surface-raised/40" />

      <div className="absolute inset-0 opacity-50">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(1.5px 1.5px at 10% 20%, rgba(255,255,255,0.9), transparent),
            radial-gradient(1px 1px at 25% 45%, rgba(255,255,255,0.6), transparent),
            radial-gradient(2px 2px at 40% 10%, rgba(255,255,255,0.8), transparent),
            radial-gradient(1px 1px at 55% 60%, rgba(255,255,255,0.5), transparent),
            radial-gradient(1.5px 1.5px at 70% 25%, rgba(255,255,255,0.7), transparent),
            radial-gradient(1px 1px at 85% 50%, rgba(255,255,255,0.6), transparent),
            radial-gradient(1px 1px at 15% 75%, rgba(255,255,255,0.5), transparent),
            radial-gradient(2px 2px at 60% 85%, rgba(255,255,255,0.7), transparent),
            radial-gradient(1px 1px at 90% 15%, rgba(255,255,255,0.55), transparent),
            radial-gradient(1px 1px at 35% 90%, rgba(255,255,255,0.5), transparent),
            radial-gradient(2.5px 2.5px at 50% 35%, rgba(255,255,255,0.9), transparent),
            radial-gradient(1px 1px at 5% 55%, rgba(255,255,255,0.45), transparent),
            radial-gradient(1.5px 1.5px at 75% 70%, rgba(255,255,255,0.55), transparent),
            radial-gradient(1px 1px at 45% 15%, rgba(255,255,255,0.6), transparent),
            radial-gradient(1px 1px at 20% 80%, rgba(255,255,255,0.5), transparent),
            radial-gradient(2px 2px at 95% 40%, rgba(255,255,255,0.7), transparent),
            radial-gradient(1px 1px at 30% 30%, rgba(255,255,255,0.65), transparent),
            radial-gradient(1px 1px at 65% 5%, rgba(255,255,255,0.5), transparent),
            radial-gradient(1.5px 1.5px at 80% 90%, rgba(255,255,255,0.6), transparent),
            radial-gradient(1px 1px at 10% 95%, rgba(255,255,255,0.45), transparent)
          `,
        }} />
      </div>

      <div className="absolute inset-0 opacity-40 mix-blend-screen" style={{
        backgroundImage: `
          radial-gradient(1.5px 1.5px at 15% 25%, rgba(200,230,220,0.9), transparent),
          radial-gradient(1.5px 1.5px at 45% 12%, rgba(200,230,220,0.8), transparent),
          radial-gradient(1.5px 1.5px at 65% 30%, rgba(200,230,220,0.7), transparent),
          radial-gradient(2px 2px at 52% 38%, rgba(200,230,220,0.9), transparent),
          radial-gradient(1px 1px at 22% 70%, rgba(200,230,220,0.6), transparent),
          radial-gradient(1.5px 1.5px at 78% 55%, rgba(200,230,220,0.7), transparent)
        `,
      }} />

      <div className="absolute inset-0 overflow-hidden">
        <div className="star-twinkle-1 absolute h-1.5 w-1.5 rounded-full bg-white/80 blur-[1px]" style={{ top: "22%", left: "18%" }} />
        <div className="star-twinkle-2 absolute h-1 w-1 rounded-full bg-white/60 blur-[1px]" style={{ top: "35%", left: "48%" }} />
        <div className="star-twinkle-3 absolute h-1.5 w-1.5 rounded-full bg-white/70 blur-[1px]" style={{ top: "15%", left: "72%" }} />
        <div className="star-twinkle-2 absolute h-1 w-1 rounded-full bg-white/50 blur-[1px]" style={{ top: "55%", left: "82%" }} />
        <div className="star-twinkle-1 absolute h-2 w-2 rounded-full bg-white/30 blur-[2px]" style={{ top: "28%", left: "55%" }} />
        <div className="star-twinkle-3 absolute h-1 w-1 rounded-full bg-white/60 blur-[1px]" style={{ top: "65%", left: "30%" }} />
      </div>

      <div className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: "radial-gradient(800px circle at 30% 40%, rgba(92,131,116,0.15), transparent 60%)",
        }}
      />

      <div className="relative flex flex-col items-start gap-3 px-5 py-6 sm:gap-4 sm:px-8 sm:py-8 md:px-10 lg:px-12 lg:py-12">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border/40 bg-surface-raised/50 px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest text-text-muted backdrop-blur-sm sm:px-3 sm:text-[11px]">
          Multi-store marketplace
        </span>
        <h1 className="relative max-w-xl text-2xl font-medium leading-tight tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
          <span className="bg-gradient-to-r from-text-primary via-text-primary to-primary bg-clip-text text-transparent">
            Discover unique products from local stores
          </span>
        </h1>
        <p className="max-w-md text-sm leading-relaxed text-text-secondary">
          Shop across hundreds of independent stores — items delivered, services
          booked, all in one place.
        </p>
        <button className="relative w-full rounded-lg bg-gradient-to-r from-primary to-primary-hover px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] sm:w-auto sm:py-2">
          Explore Stores
        </button>
      </div>
    </section>
  );
}