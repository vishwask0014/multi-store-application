"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Store01Icon, ShoppingBagIcon, ServiceIcon, ArrowLeft02Icon, SearchIcon } from "@hugeicons/core-free-icons";

function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!q) { setLoading(false); return; }
    fetch(`/api/search?q=${encodeURIComponent(q)}&limit=50`)
      .then((r) => r.json())
      .then(setResults)
      .finally(() => setLoading(false));
  }, [q]);

  if (loading) {
    return <div className="flex justify-center py-16"><div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>;
  }

  if (!results || (results.stores?.length === 0 && results.products?.length === 0 && results.services?.length === 0)) {
    return <p className="text-sm text-text-muted">No results found</p>;
  }

  return (
    <div className="space-y-10">
      {results.stores?.length > 0 && (
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-medium text-text-primary">
            <HugeiconsIcon icon={Store01Icon} size={16} /> Stores ({results.stores.length})
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {results.stores.map((s: any) => (
              <a key={s._id} href={`/stores/${s.slug || s._id}`}
                className="rounded-xl border border-border/50 bg-surface/50 p-4 transition-colors hover:border-primary/40">
                <p className="text-sm font-medium text-text-primary">{s.name}</p>
              </a>
            ))}
          </div>
        </section>
      )}
      {results.products?.length > 0 && (
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-medium text-text-primary">
            <HugeiconsIcon icon={ShoppingBagIcon} size={16} /> Products ({results.products.length})
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {results.products.map((p: any) => (
              <a key={p._id} href={`/products/${p._id}`}
                className="group rounded-xl border border-border/50 bg-surface/50 p-3 transition-all hover:border-primary/40">
                <div className="mb-2 aspect-square overflow-hidden rounded-lg bg-surface-raised">
                  {p.image && <img src={p.image} alt={p.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />}
                </div>
                <p className="truncate text-xs font-medium text-text-primary">{p.title}</p>
                <p className="text-xs text-accent">${p.price?.toFixed(2)}</p>
              </a>
            ))}
          </div>
        </section>
      )}
      {results.services?.length > 0 && (
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-medium text-text-primary">
            <HugeiconsIcon icon={ServiceIcon} size={16} /> Services ({results.services.length})
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {results.services.map((s: any) => (
              <a key={s._id} href={`/services/${s._id}`}
                className="group rounded-xl border border-border/50 bg-surface/50 p-3 transition-all hover:border-primary/40">
                <div className="mb-2 aspect-square overflow-hidden rounded-lg bg-surface-raised">
                  {s.image && <img src={s.image} alt={s.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />}
                </div>
                <p className="truncate text-xs font-medium text-text-primary">{s.title}</p>
                <p className="text-xs text-accent">${s.price?.toFixed(2)}</p>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-base">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <a href="/shop" className="mb-4 inline-flex items-center gap-1.5 text-xs text-text-muted transition-colors hover:text-text-secondary">
          <HugeiconsIcon icon={ArrowLeft02Icon} size={14} />
          Back to marketplace
        </a>
        <Suspense fallback={<div className="flex justify-center py-16"><div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>}>
          <SearchResults />
        </Suspense>
      </div>
    </div>
  );
}
