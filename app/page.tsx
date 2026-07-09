import HeroBanner from "@/app/components/HeroBanner";
import FilterBar from "@/app/components/FilterBar";
import FilterRail from "@/app/components/FilterRail";
import ProductCard from "@/app/components/ProductCard";
import StoreCard from "@/app/components/StoreCard";

const products = [
  {
    title: "Wireless Headphones",
    price: 79.99,
    rating: 4.5,
    type: "item" as const,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
  },
  {
    title: "Yoga Class Pass",
    price: 25.0,
    rating: 4.8,
    type: "service" as const,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
  },
  {
    title: "Leather Notebook",
    price: 24.99,
    rating: 4.2,
    type: "item" as const,
    image: "https://images.unsplash.com/photo-1531346878377-1270d5fe5b8b?w=400&h=300&fit=crop",
  },
  {
    title: "Guitar Lesson",
    price: 45.0,
    rating: 4.9,
    type: "service" as const,
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=300&fit=crop",
  },
  {
    title: "Mechanical Keyboard",
    price: 149.99,
    rating: 4.7,
    type: "item" as const,
    image: "https://images.unsplash.com/photo-1611669333507-fcbf2a11e20e?w=400&h=300&fit=crop",
  },
  {
    title: "Spa Massage",
    price: 85.0,
    rating: 4.6,
    type: "service" as const,
    image: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=400&h=300&fit=crop",
  },
  {
    title: "Minimalist Watch",
    price: 199.0,
    rating: 4.4,
    type: "item" as const,
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=300&fit=crop",
  },
  {
    title: "Cooking Workshop",
    price: 60.0,
    rating: 4.3,
    type: "service" as const,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
  },
  {
    title: "Designer Sunglasses",
    price: 129.99,
    rating: 4.1,
    type: "item" as const,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop",
  },
];

const stores = [
  {
    name: "Urban Essentials",
    tag: "Fulfilled" as const,
    offeringCount: 24,
    images: [
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=150&h=150&fit=crop",
      "https://images.unsplash.com/photo-1441984904996-e0b6ba9b56e3?w=150&h=150&fit=crop",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=150&h=150&fit=crop",
    ],
  },
  {
    name: "The Artisan Loft",
    tag: "Filled" as const,
    offeringCount: 12,
    images: [
      "https://images.unsplash.com/photo-1567721913486-6585f069b332?w=150&h=150&fit=crop",
      "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=150&h=150&fit=crop",
      "https://images.unsplash.com/photo-1546241072-48010ad2862c?w=150&h=150&fit=crop",
    ],
  },
  {
    name: "Tech Haven",
    tag: "Filled" as const,
    offeringCount: 38,
    images: [
      "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=150&h=150&fit=crop",
      "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=150&h=150&fit=crop",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=150&h=150&fit=crop",
    ],
  },
  {
    name: "Bloom & Co.",
    tag: "Fulfilled" as const,
    offeringCount: 18,
    images: [
      "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=150&h=150&fit=crop",
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=150&h=150&fit=crop",
      "https://images.unsplash.com/photo-1490750967868-88aa4f44bcad?w=150&h=150&fit=crop",
    ],
  },
];

export default function Home() {
  return (
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
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
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
  );
}