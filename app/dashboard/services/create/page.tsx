"use client";

import { useState } from "react";
import Select from "react-select";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ServiceIcon,
  ArrowLeftIcon,
  ImageIcon,
  ClockIcon,
  Tick01Icon,
} from "@hugeicons/core-free-icons";
import SidebarLayout from "@/app/components/Common/SidebarLayout";
import { products } from "@/mock";

const productOptions = products
  .filter((p) => p.type === "item")
  .map((p) => ({ value: p.title, label: p.title }));

const selectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    background: "var(--color-base)",
    borderColor: state.isFocused ? "var(--color-primary)" : "var(--color-border)",
    borderWidth: 1,
    borderRadius: "0.5rem",
    boxShadow: state.isFocused ? "0 0 0 1px var(--color-primary)" : "none",
    padding: "2px 0",
    cursor: "pointer",
    "&:hover": { borderColor: "var(--color-border-strong)" },
  }),
  menu: (base: any) => ({
    ...base,
    background: "var(--color-surface)",
    border: "1px solid var(--color-border)",
    borderRadius: "0.5rem",
    boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
    zIndex: 50,
  }),
  menuList: (base: any) => ({
    ...base,
    padding: "4px",
    "&::-webkit-scrollbar": { width: 4 },
    "&::-webkit-scrollbar-thumb": { background: "var(--color-border)", borderRadius: 4 },
  }),
  option: (base: any, state: any) => ({
    ...base,
    background: state.isSelected
      ? "var(--color-primary)"
      : state.isFocused
      ? "var(--color-surface-raised)"
      : "transparent",
    color: state.isSelected
      ? "#fff"
      : "var(--color-text-primary)",
    borderRadius: "0.375rem",
    padding: "8px 12px",
    fontSize: "0.875rem",
    cursor: "pointer",
    "&:active": { background: "var(--color-primary)" },
  }),
  multiValue: (base: any) => ({
    ...base,
    background: "var(--color-primary)",
    borderRadius: "0.375rem",
  }),
  multiValueLabel: (base: any) => ({
    ...base,
    color: "#fff",
    fontSize: "0.8125rem",
    padding: "2px 6px",
  }),
  multiValueRemove: (base: any) => ({
    ...base,
    color: "rgba(255,255,255,0.7)",
    borderRadius: "0 0.375rem 0.375rem 0",
    "&:hover": { background: "rgba(255,255,255,0.15)", color: "#fff" },
  }),
  input: (base: any) => ({
    ...base,
    color: "var(--color-text-primary)",
  }),
  placeholder: (base: any) => ({
    ...base,
    color: "var(--color-text-muted)",
    fontSize: "0.875rem",
  }),
  dropdownIndicator: (base: any) => ({
    ...base,
    color: "var(--color-text-muted)",
    "&:hover": { color: "var(--color-text-secondary)" },
  }),
  clearIndicator: (base: any) => ({
    ...base,
    color: "var(--color-text-muted)",
    "&:hover": { color: "var(--color-text-secondary)" },
  }),
  noOptionsMessage: (base: any) => ({
    ...base,
    color: "var(--color-text-muted)",
    fontSize: "0.875rem",
  }),
};

export default function CreateServicePage() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <SidebarLayout>
      <div className="mx-auto max-w-2xl">
        <div className="px-6 pt-8 pb-16 lg:px-8">
          <a
            href="/dashboard/services"
            className="mb-6 inline-flex items-center gap-1.5 text-xs text-text-muted transition-colors hover:text-text-secondary"
          >
            <HugeiconsIcon icon={ArrowLeftIcon} size={14} />
            Back to Services
          </a>

          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <HugeiconsIcon icon={ServiceIcon} size={20} />
            </div>
            <div>
              <h1 className="text-xl font-medium tracking-tight text-text-primary">
                Create Service
              </h1>
              <p className="text-sm text-text-muted">
                Add a new service offering
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="rounded-xl border border-border/50 bg-surface/60 p-6 backdrop-blur-sm space-y-5">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">
                  Service Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Yoga Class Pass"
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
                    placeholder="25.00"
                    className="w-full rounded-lg border border-border/50 bg-base px-4 py-2.5 text-sm text-text-primary outline-none transition-all duration-200 placeholder:text-text-muted focus:border-primary/50 focus:shadow-sm focus:shadow-primary/10"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-text-secondary">
                    Duration (mins)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="60"
                      className="w-full rounded-lg border border-border/50 bg-base px-4 py-2.5 pl-9 text-sm text-text-primary outline-none transition-all duration-200 placeholder:text-text-muted focus:border-primary/50 focus:shadow-sm focus:shadow-primary/10"
                    />
                    <HugeiconsIcon
                      icon={ClockIcon}
                      size={16}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                    />
                  </div>
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
                  <option value="health">Health & Wellness</option>
                  <option value="education">Education</option>
                  <option value="home">Home Services</option>
                  <option value="beauty">Beauty & Spa</option>
                  <option value="music">Music & Arts</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">
                  Applicable Products
                </label>
                <Select
                  isMulti
                  options={productOptions}
                  value={selectedProducts}
                  onChange={(val) => setSelectedProducts(val as any[])}
                  placeholder="Select products this service applies to..."
                  noOptionsMessage={() => "No products available"}
                  styles={selectStyles}
                  className="text-sm"
                />
                <p className="mt-1 text-[11px] text-text-muted">
                  Choose the products this service can be applied to
                </p>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your service..."
                  rows={3}
                  className="w-full resize-none rounded-lg border border-border/50 bg-base px-4 py-2.5 text-sm text-text-primary outline-none transition-all duration-200 placeholder:text-text-muted focus:border-primary/50 focus:shadow-sm focus:shadow-primary/10"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">
                  Service Image
                </label>
                <label className="group flex cursor-pointer items-center gap-4 rounded-xl border border-dashed border-border/50 bg-base p-4 transition-all duration-200 hover:border-primary/40">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-surface-raised/50 text-text-muted transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                    {image ? (
                      <HugeiconsIcon icon={Tick01Icon} size={22} className="text-primary" />
                    ) : (
                      <HugeiconsIcon icon={ImageIcon} size={22} />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-text-primary">
                      {image ? image.name : "Upload service image"}
                    </p>
                    <p className="text-[11px] text-text-muted">
                      {image
                        ? `${(image.size / 1024).toFixed(1)} KB`
                        : "JPG, PNG or WEBP up to 5MB"}
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setImage(file);
                    }}
                  />
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="group relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-primary to-primary-hover py-3 text-sm font-medium text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]"
            >
              <span className="absolute inset-0 translate-x-full bg-white/10 transition-transform duration-300 group-hover:translate-x-0" />
              <span className="relative flex items-center justify-center gap-2">
                <HugeiconsIcon icon={Tick01Icon} size={16} />
                Create Service
              </span>
            </button>
          </form>
        </div>
      </div>
    </SidebarLayout>
  );
}
