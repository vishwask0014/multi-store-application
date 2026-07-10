import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-base)]">
      <header className="border-b border-border/50 bg-base/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-hover text-sm font-medium shadow-lg shadow-primary/20">
              M
            </div>
            <span className="text-base font-semibold text-text-primary">
              Market
            </span>
          </div>
          <nav className="flex items-center gap-6">
            <Link
              href="/shop"
              className="text-sm font-medium text-text-muted transition-colors hover:text-text-primary"
            >
              Browse
            </Link>
            <Link
              href="/dashboard"
              className="rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-all duration-200 hover:bg-primary/20"
            >
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-primary)_0%,_transparent_60%)] opacity-10" />
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-36">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
              Multi-store marketplace
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
              Everything you need,{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                all in one place
              </span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-text-muted sm:text-xl">
              Browse products and services from trusted stores. Manage your
              inventory, track orders, and grow your business.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-hover px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]"
              >
                Start Shopping
                <span className="text-lg">&rarr;</span>
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl border border-border/50 bg-surface px-8 py-3.5 text-sm font-semibold text-text-primary transition-all duration-300 hover:bg-surface-raised active:scale-[0.98]"
              >
                Business Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border/50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-text-primary sm:text-3xl">
              Why choose Market
            </h2>
            <p className="mt-3 text-text-muted">
              Built for both shoppers and sellers
            </p>
          </div>
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Browse & Discover",
                desc: "Explore products and services from multiple stores in one place with powerful search and filters.",
                stat: "50+",
                label: "Products",
              },
              {
                title: "Manage Your Store",
                desc: "List products, create service bundles, and manage your inventory with an intuitive dashboard.",
                stat: "4",
                label: "Stores",
              },
              {
                title: "Track Everything",
                desc: "Monitor bookings, orders, and payments from a single interface. Stay on top of your business.",
                stat: "100%",
                label: "Control",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group rounded-xl border border-border/50 bg-surface p-6 transition-all duration-300 hover:border-border hover:shadow-lg hover:shadow-black/10"
              >
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-primary">
                    {item.stat}
                  </span>
                  <span className="text-sm text-text-muted">{item.label}</span>
                </div>
                <h3 className="mt-4 text-base font-medium text-text-primary">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/50 bg-surface/30">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="text-2xl font-semibold text-text-primary sm:text-3xl">
                For Shoppers
              </h2>
              <p className="mt-3 text-text-muted">
                Discover curated products and services, add to cart, and checkout
                seamlessly.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  "Browse products and services side by side",
                  "Add items to cart with one click",
                  "Track your orders and bookings",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-text-muted"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] text-primary">
                      &check;
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/shop"
                className="mt-8 inline-flex items-center gap-2 rounded-lg border border-border/50 bg-surface px-5 py-2.5 text-sm font-medium text-text-primary transition-all duration-200 hover:bg-surface-raised"
              >
                Start Shopping
                <span>&rarr;</span>
              </Link>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-text-primary sm:text-3xl">
                For Sellers
              </h2>
              <p className="mt-3 text-text-muted">
                List your products, create service offerings, and grow your
                business.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  "Create and manage your store",
                  "List products and service bundles",
                  "View bookings and analytics",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-text-muted"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-[11px] text-accent">
                      &check;
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/dashboard"
                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary-hover px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30"
              >
                Go to Dashboard
                <span>&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/50">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row lg:px-8">
          <p className="text-sm text-text-muted">
            &copy; {new Date().getFullYear()} Market. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/shop"
              className="text-sm text-text-muted transition-colors hover:text-text-primary"
            >
              Shop
            </Link>
            <Link
              href="/dashboard"
              className="text-sm text-text-muted transition-colors hover:text-text-primary"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
