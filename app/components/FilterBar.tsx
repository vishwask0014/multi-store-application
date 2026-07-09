"use client";

import { useState } from "react";

const categories = [
  "All",
  "Items",
  "Services",
  "Electronics",
  "Fashion",
  "Home & Garden",
  "Sports",
  "Books",
];

export default function FilterBar() {
  const [active, setActive] = useState("All");

  return (
    <div className="sticky top-0 z-30 border-b border-border/50 bg-base/80 backdrop-blur-xl">
      <div className="flex items-center gap-2 overflow-x-auto px-6 py-4 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-300 ${
              active === cat
                ? "border-primary/50 bg-primary/10 text-primary shadow-sm shadow-primary/10"
                : "border-border/50 text-text-muted hover:border-border-strong hover:text-text-secondary"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
