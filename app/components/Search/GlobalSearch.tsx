"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { SearchIcon, Store01Icon, ShoppingBagIcon, ServiceIcon, Cancel01Icon, HistoryIcon, AnalyticsUpIcon } from "@hugeicons/core-free-icons";

interface SearchResult {
  stores: { _id: string; name: string; slug?: string; image?: string }[];
  products: { _id: string; title: string; price: number; image?: string }[];
  services: { _id: string; title: string; price: number; image?: string }[];
  total: number;
}

function highlightText(text: string, query: string) {
  if (!query.trim()) return text;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <span key={i} className="text-primary font-medium">{part}</span>
    ) : (
      part
    )
  );
}

const POPULAR_SEARCHES = ["electronics", "clothing", "home", "services", "gifts"];

export default function GlobalSearch({ onClose }: { onClose?: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("btwoc-search-history") || "[]"); } catch { return []; }
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const saveHistory = useCallback((q: string) => {
    setHistory((prev) => {
      const updated = [q, ...prev.filter((h) => h !== q)].slice(0, 10);
      localStorage.setItem("btwoc-search-history", JSON.stringify(updated));
      return updated;
    });
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 2) {
      setResults(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}&limit=8`);
        const data = await res.json();
        setResults(data);
      } catch {
        setResults(null);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  const handleSearch = (q: string) => {
    setQuery(q);
    saveHistory(q);
    setOpen(true);
  };

  return (
    <div className="relative w-full max-w-lg">
      <div className="relative">
        <HugeiconsIcon icon={SearchIcon} size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Search stores, products, services..."
          className="w-full rounded-xl border border-border/50 bg-surface py-2.5 pl-10 pr-9 text-sm text-text-primary outline-none transition-all placeholder:text-text-muted focus:border-primary/50"
        />
        {query && (
          <button onClick={() => { setQuery(""); setResults(null); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary">
            <HugeiconsIcon icon={Cancel01Icon} size={14} />
          </button>
        )}
      </div>

      {open && (query.length >= 2 || !query) && (
        <div className="absolute left-0 right-0 top-full mt-2 max-h-96 overflow-y-auto rounded-2xl border border-border/50 bg-surface shadow-2xl shadow-black/30 backdrop-blur-2xl z-50">
          {!query && (
            <div className="p-4 space-y-4">
              {history.length > 0 && (
                <div>
                  <p className="mb-2 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-text-muted">
                    <HugeiconsIcon icon={HistoryIcon} size={12} />
                    Recent
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {history.map((h) => (
                      <button key={h} onClick={() => handleSearch(h)}
                        className="rounded-full border border-border/30 px-2.5 py-1 text-[11px] text-text-muted transition-colors hover:border-border-strong hover:text-text-secondary">
                        {h}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <p className="mb-2 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-text-muted">
                  <HugeiconsIcon icon={AnalyticsUpIcon} size={12} />
                  Popular
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_SEARCHES.map((p) => (
                    <button key={p} onClick={() => handleSearch(p)}
                      className="rounded-full border border-border/30 px-2.5 py-1 text-[11px] text-text-muted transition-colors hover:border-border-strong hover:text-text-secondary">
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          )}

          {results && !loading && (
            <div className="p-2 space-y-1">
              {results.stores.length === 0 && results.products.length === 0 && results.services.length === 0 ? (
                <p className="py-8 text-center text-xs text-text-muted">No results for &quot;{query}&quot;</p>
              ) : (
                <>
                  {results.stores.length > 0 && (
                    <div>
                      <p className="px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-text-muted">Stores</p>
                      {results.stores.map((s) => (
                        <a key={s._id} href={`/stores/${s.slug || s._id}`} onClick={onClose}
                          className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors hover:bg-surface-raised/50">
                          <HugeiconsIcon icon={Store01Icon} size={16} className="text-text-muted" />
                          <span className="text-text-primary">{highlightText(s.name, query)}</span>
                        </a>
                      ))}
                    </div>
                  )}
                  {results.products.length > 0 && (
                    <div>
                      <p className="px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-text-muted">Products</p>
                      {results.products.map((p) => (
                        <a key={p._id} href={`/products/${p._id}`} onClick={onClose}
                          className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors hover:bg-surface-raised/50">
                          <HugeiconsIcon icon={ShoppingBagIcon} size={16} className="text-text-muted" />
                          <span className="flex-1 text-text-primary">{highlightText(p.title, query)}</span>
                          <span className="text-xs text-accent">${p.price.toFixed(2)}</span>
                        </a>
                      ))}
                    </div>
                  )}
                  {results.services.length > 0 && (
                    <div>
                      <p className="px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-text-muted">Services</p>
                      {results.services.map((s) => (
                        <a key={s._id} href={`/services/${s._id}`} onClick={onClose}
                          className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors hover:bg-surface-raised/50">
                          <HugeiconsIcon icon={ServiceIcon} size={16} className="text-text-muted" />
                          <span className="flex-1 text-text-primary">{highlightText(s.title, query)}</span>
                          <span className="text-xs text-accent">${s.price.toFixed(2)}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {query && !loading && results && results.stores.length + results.products.length + results.services.length > 0 && (
            <div className="border-t border-border/30 p-2">
              <a href={`/search?q=${encodeURIComponent(query)}`} onClick={onClose}
                className="flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-raised/50">
                View all {results.total} results
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
