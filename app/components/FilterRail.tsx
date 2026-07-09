"use client";

export default function FilterRail() {
  return (
    <aside className="hidden shrink-0 space-y-8 lg:block">
      <h3 className="text-xs font-medium uppercase tracking-widest text-text-muted">
        Filter by
      </h3>

      <div className="flex gap-6">

        <div className="space-y-3">
          <label className="text-xs font-medium text-text-secondary mb-2 block">
            Category
          </label>
          <select className="w-full rounded-lg border border-border/50 bg-surface px-3 py-2.5 text-sm text-text-primary outline-none transition-all duration-200 focus:border-primary/50 focus:shadow-sm focus:shadow-primary/10">
            <option>All Categories</option>
            <option>Electronics</option>
            <option>Fashion</option>
            <option>Home & Garden</option>
          </select>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-medium text-text-secondary mb-2 block">Type</label>
          <select className="w-full rounded-lg border border-border/50 bg-surface px-3 py-2.5 text-sm text-text-primary outline-none transition-all duration-200 focus:border-primary/50 focus:shadow-sm focus:shadow-primary/10">
            <option>All</option>
            <option>Items</option>
            <option>Services</option>
          </select>
        </div>

        <div className="space-y-3">
          <label className="text-xs block font-medium text-text-secondary mb-2">
            Price range
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              className="w-full rounded-lg border border-border/50 bg-surface px-3 py-2.5 text-sm text-text-primary outline-none transition-all duration-200 placeholder:text-text-muted focus:border-primary/50 focus:shadow-sm focus:shadow-primary/10"
            />
            <span className="text-text-muted">–</span>
            <input
              type="number"
              placeholder="Max"
              className="w-full rounded-lg border border-border/50 bg-surface px-3 py-2.5 text-sm text-text-primary outline-none transition-all duration-200 placeholder:text-text-muted focus:border-primary/50 focus:shadow-sm focus:shadow-primary/10"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-medium text-text-secondary mb-2 block">
            Availability
          </label>
          <div className="space-y-3 flex gap-4 mt-4">
            <label className="group flex cursor-pointer items-center gap-3 text-sm text-text-secondary transition-colors hover:text-text-primary">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-border/50 bg-surface text-primary accent-primary transition-all duration-200"
              />
              In Stock
            </label>
            <label className="group flex cursor-pointer items-center gap-3 text-sm text-text-secondary transition-colors hover:text-text-primary">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-border/50 bg-surface text-primary accent-primary transition-all duration-200"
              />
              On Sale
            </label>
          </div>
        </div>
      </div>
    </aside>
  );
}
