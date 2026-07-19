"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  PackageIcon,
  ArrowLeftIcon,
  ImageIcon,
  Tick01Icon,
} from "@hugeicons/core-free-icons";
import SidebarLayout from "@/app/components/Common/SidebarLayout";
import { useInventoryStore } from "@/stores/useInventoryStore";

const img = (id: string) =>
  `https://images.unsplash.com/${id}?w=400&h=300&fit=crop`;

const placeholderImgs = [
  "photo-1505740420928-5e560c06d30e",
  "photo-1544367567-0f2fcb009e0b",
  "photo-1531346878377-1270d5fe5b8b",
];

export default function CreateProductPage() {
  const router = useRouter();
  const addProduct = useInventoryStore((s) => s.addProduct);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");

  const valid = name.trim() && price && Number(price) > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;

    addProduct({
      title: name.trim(),
      price: Number(price),
      rating: 4.0,
      type: "item",
      image: img(placeholderImgs[Math.floor(Math.random() * placeholderImgs.length)]),
    });

    router.push("/dashboard/goods-products");
  };

  return (
    <SidebarLayout>
      <div className="mx-auto max-w-2xl">
        <div className="px-6 pt-8 pb-16 lg:px-8">
          <a
            href="/dashboard/goods-products"
            className="mb-6 inline-flex items-center gap-1.5 text-xs text-text-muted transition-colors hover:text-text-secondary"
          >
            <HugeiconsIcon icon={ArrowLeftIcon} size={14} />
            Back to Products
          </a>

          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <HugeiconsIcon icon={PackageIcon} size={20} />
            </div>
            <div>
              <h1 className="text-xl font-medium tracking-tight text-text-primary">
                Create Product
              </h1>
              <p className="text-sm text-text-muted">
                Add a new product to your inventory
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="rounded-xl border border-border/50 bg-surface/60 p-6 backdrop-blur-sm space-y-5">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">
                  Product Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Wireless Headphones"
                  className="w-full rounded-lg border border-border/50 bg-base px-4 py-2.5 text-sm text-text-primary outline-none transition-all duration-200 placeholder:text-text-muted focus:border-primary/50 focus:shadow-sm focus:shadow-primary/10"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-text-secondary">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="29.99"
                    className="w-full rounded-lg border border-border/50 bg-base px-4 py-2.5 text-sm text-text-primary outline-none transition-all duration-200 placeholder:text-text-muted focus:border-primary/50 focus:shadow-sm focus:shadow-primary/10"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-text-secondary">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="100"
                    className="w-full rounded-lg border border-border/50 bg-base px-4 py-2.5 text-sm text-text-primary outline-none transition-all duration-200 placeholder:text-text-muted focus:border-primary/50 focus:shadow-sm focus:shadow-primary/10"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-border/50 bg-base px-4 py-2.5 text-sm text-text-primary outline-none transition-all duration-200 focus:border-primary/50 focus:shadow-sm focus:shadow-primary/10"
                >
                  <option value="">Select category</option>
                  <option value="electronics">Electronics</option>
                  <option value="fashion">Fashion</option>
                  <option value="home">Home & Garden</option>
                  <option value="sports">Sports</option>
                  <option value="books">Books</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your product..."
                  rows={3}
                  className="w-full resize-none rounded-lg border border-border/50 bg-base px-4 py-2.5 text-sm text-text-primary outline-none transition-all duration-200 placeholder:text-text-muted focus:border-primary/50 focus:shadow-sm focus:shadow-primary/10"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!valid}
              className="group relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-primary to-primary-hover py-3 text-sm font-medium text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              <span className="absolute inset-0 translate-x-full bg-white/10 transition-transform duration-300 group-hover:translate-x-0" />
              <span className="relative flex items-center justify-center gap-2">
                <HugeiconsIcon icon={Tick01Icon} size={16} />
                Create Product
              </span>
            </button>
          </form>
        </div>
      </div>
    </SidebarLayout>
  );
}
