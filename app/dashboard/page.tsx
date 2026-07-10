import SidebarLayout from "@/app/components/Common/SidebarLayout";
import HeroBanner from "@/app/components/Common/HeroBanner";
import FilterBar from "@/app/components/Common/FilterBar";
import FilterRail from "@/app/components/Common/FilterRail";
import ProductCard from "@/app/components/Common/ProductCard";
import StoreCard from "@/app/components/Common/StoreCard";
import { products, stores } from "@/mock";

export default function Home() {
  return (
    <SidebarLayout>
      <div className="mx-auto max-w-7xl">
        <div className="px-6 pt-8 pb-6 lg:px-8">
          <HeroBanner />
        </div>

        <FilterBar />

        <div className="flex flex-col gap-10 px-6 pt-8 pb-16 lg:px-8">
          <FilterRail />

          <div className="flex-1 space-y-14">
            <section>
              <div className="mb-6 flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-lg font-medium text-text-primary">
                    Featured Products
                  </h2>
                  <p className="text-sm text-text-muted">
                    Handpicked just for you
                  </p>
                </div>
                <a
                  href="#"
                  className="group flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-text-secondary"
                >
                  View all
                  <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">
                    →
                  </span>
                </a>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {products.slice(0, 3).map((p) => (
                  <ProductCard key={p.title} {...p} />
                ))}
                <div className="relative hidden overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-primary/5 to-surface p-6 md:block">
                  <div className="flex h-full flex-col justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-primary">
                        Special
                      </p>
                      <h3 className="mt-2 text-base font-medium text-text-primary">
                        Limited Edition Drops
                      </h3>
                      <p className="mt-1 text-sm text-text-muted">
                        New arrivals every week
                      </p>
                    </div>
                    <button className="mt-4 self-start rounded-lg bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary transition-all duration-300 hover:bg-primary/20">
                      Browse →
                    </button>
                  </div>
                  <div
                    className="pointer-events-none absolute -bottom-8 -right-8 h-32 w-32 rounded-full opacity-10 blur-3xl"
                    style={{ background: "var(--color-primary)" }}
                  />
                </div>
              </div>
            </section>

            <section>
              <div className="mb-6 flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-lg font-medium text-text-primary">
                    Popular Stores
                  </h2>
                  <p className="text-sm text-text-muted">
                    Stores you might like
                  </p>
                </div>
                <a
                  href="#"
                  className="group flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-text-secondary"
                >
                  View all
                  <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">
                    →
                  </span>
                </a>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {stores.map((s) => (
                  <StoreCard key={s.name} {...s} />
                ))}
              </div>
            </section>

            <section>
              <div className="mb-6 flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-lg font-medium text-text-primary">
                    More Products
                  </h2>
                  <p className="text-sm text-text-muted">
                    Continue browsing
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {products.map((p) => (
                  <ProductCard key={p.title} {...p} />
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}