"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Store01Icon,
  ShoppingBagIcon,
  CalendarIcon,
  Location01Icon,
  FileValidationIcon,
  ImageIcon,
  CameraIcon,
  SignatureIcon,
  Tick01Icon,
  ArrowLeftIcon,
  UploadIcon,
} from "@hugeicons/core-free-icons";
import SidebarLayout from "@/app/components/Common/SidebarLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useInventoryStore } from "@/stores/useInventoryStore";

const steps = [
  { label: "Store Info", icon: Store01Icon },
  { label: "Location & Docs", icon: Location01Icon },
  { label: "Owner Details", icon: ImageIcon },
];

type StoreType = "products" | "services" | "both";
type CoverageType = "single" | "multiple";

export default function CreateStorePage() {
  const router = useRouter();
  const { firebaseUser } = useAuth();
  const { addStore } = useInventoryStore();
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(0);
  const [storeType, setStoreType] = useState<StoreType | "">("");
  const [storeName, setStoreName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [coverage, setCoverage] = useState(10);
  const [coverageType, setCoverageType] = useState<CoverageType>("single");
  const [gstNumber, setGstNumber] = useState("");
  const [businessReg, setBusinessReg] = useState("");

  const [ownerPhoto, setOwnerPhoto] = useState<File | null>(null);
  const [aadhar, setAadhar] = useState<File | null>(null);
  const [pan, setPan] = useState<File | null>(null);
  const [signature, setSignature] = useState<File | null>(null);

  const canProceed = () => {
    if (step === 0) return storeName.trim() && storeType && category;
    if (step === 1) return address.trim() && city.trim() && gstNumber.trim() && businessReg.trim();
    if (step === 2) return ownerPhoto && aadhar && pan && signature;
    return false;
  };

  const handleFile = (
    setter: (f: File | null) => void
  ) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setter(file);
  };

  const progress = ((step + 1) / steps.length) * 100;

  return (
    <SidebarLayout>
      <div className="mx-auto max-w-2xl">
        <div className="px-6 pt-8 pb-16 lg:px-8">
          <a
            href="/dashboard/stores"
            className="mb-6 inline-flex items-center gap-1.5 text-xs text-text-muted transition-colors hover:text-text-secondary"
          >
            <HugeiconsIcon
              icon={ArrowLeftIcon}
              size={14}
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
            />
            Back to Stores
          </a>

          <div className="mb-8 space-y-1">
            <h1 className="text-2xl font-medium tracking-tight text-text-primary">
              Create Your Store
            </h1>
            <p className="text-sm text-text-muted">
              Fill in the details to get started
            </p>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((s, i) => {
                const done = i < step;
                const current = i === step;
                const Icon = s.icon;
                return (
                  <div key={s.label} className="flex flex-col items-center gap-2">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl text-xs font-medium transition-all duration-300 ${
                        done
                          ? "bg-primary text-white shadow-md shadow-primary/20"
                          : current
                          ? "border-2 border-primary bg-primary/10 text-primary shadow-sm shadow-primary/10"
                          : "border border-border/50 bg-surface text-text-muted"
                      }`}
                    >
                      {done ? (
                        <HugeiconsIcon icon={Tick01Icon} size={16} />
                      ) : (
                        <HugeiconsIcon icon={Icon} size={18} />
                      )}
                    </div>
                    <span
                      className={`text-[11px] font-medium ${
                        current
                          ? "text-text-primary"
                          : done
                          ? "text-primary"
                          : "text-text-muted"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 h-1 rounded-full bg-border">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-primary-hover transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="rounded-xl border border-border/50 bg-surface/60 p-6 backdrop-blur-sm">
            {step === 0 && (
              <div className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-text-secondary">
                    Store Name
                  </label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="e.g. Urban Essentials"
                    className="w-full rounded-lg border border-border/50 bg-base px-4 py-2.5 text-sm text-text-primary outline-none transition-all duration-200 placeholder:text-text-muted focus:border-primary/50 focus:shadow-sm focus:shadow-primary/10"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-text-secondary">
                    Store Type
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "products", label: "Products", icon: ShoppingBagIcon, desc: "Sell items" },
                      { value: "services", label: "Services", icon: CalendarIcon, desc: "Offer services" },
                      { value: "both", label: "Both", icon: Store01Icon, desc: "Sell & offer" },
                    ].map((opt) => {
                      const selected = storeType === opt.value;
                      const Icon = opt.icon;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setStoreType(opt.value as StoreType)}
                          className={`group rounded-xl border p-4 text-center transition-all duration-200 ${
                            selected
                              ? "border-primary/40 bg-primary/10 shadow-sm shadow-primary/10"
                              : "border-border/50 hover:border-border-strong/50"
                          }`}
                        >
                          <div
                            className={`mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                              selected
                                ? "bg-primary text-white"
                                : "bg-surface-raised/50 text-text-muted"
                            }`}
                          >
                            <HugeiconsIcon icon={Icon} size={18} />
                          </div>
                          <p className="text-sm font-medium text-text-primary">
                            {opt.label}
                          </p>
                          <p className="text-[11px] text-text-muted">
                            {opt.desc}
                          </p>
                        </button>
                      );
                    })}
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
                    <option value="">Select a category</option>
                    <option value="electronics">Electronics</option>
                    <option value="fashion">Fashion</option>
                    <option value="home">Home & Garden</option>
                    <option value="sports">Sports</option>
                    <option value="books">Books</option>
                    <option value="music">Music</option>
                    <option value="health">Health & Beauty</option>
                    <option value="toys">Toys & Games</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-text-secondary">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tell us about your store..."
                    rows={3}
                    className="w-full resize-none rounded-lg border border-border/50 bg-base px-4 py-2.5 text-sm text-text-primary outline-none transition-all duration-200 placeholder:text-text-muted focus:border-primary/50 focus:shadow-sm focus:shadow-primary/10"
                  />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-text-secondary">
                    Store Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Building, street, area"
                    className="w-full rounded-lg border border-border/50 bg-base px-4 py-2.5 text-sm text-text-primary outline-none transition-all duration-200 placeholder:text-text-muted focus:border-primary/50 focus:shadow-sm focus:shadow-primary/10"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-text-secondary">
                      City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="New York"
                      className="w-full rounded-lg border border-border/50 bg-base px-4 py-2.5 text-sm text-text-primary outline-none transition-all duration-200 placeholder:text-text-muted focus:border-primary/50 focus:shadow-sm focus:shadow-primary/10"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-text-secondary">
                      Coverage Area
                    </label>
                    <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-base px-4 py-2.5">
                      <input
                        type="range"
                        min={1}
                        max={16}
                        value={coverage}
                        onChange={(e) => setCoverage(Number(e.target.value))}
                        className="flex-1 accent-primary h-1.5"
                      />
                      <span className="shrink-0 text-xs font-medium text-text-primary tabular-nums">
                        {coverage} km
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-text-muted">
                      Maximum: 16 km per location
                    </p>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-text-secondary">
                    Coverage Type
                  </label>
                  <div className="flex gap-3">
                    {[
                      { value: "single", label: "Single Location", desc: "All within {coverage} km" },
                      { value: "multiple", label: "Multiple Locations", desc: "Add more locations later" },
                    ].map((opt) => {
                      const selected = coverageType === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setCoverageType(opt.value as CoverageType)}
                          className={`flex-1 rounded-xl border p-3 text-left transition-all duration-200 ${
                            selected
                              ? "border-primary/40 bg-primary/10 shadow-sm shadow-primary/10"
                              : "border-border/50 hover:border-border-strong/50"
                          }`}
                        >
                          <p className="text-sm font-medium text-text-primary">
                            {opt.label}
                          </p>
                          <p className="text-[11px] text-text-muted">
                            {opt.desc.replace("{coverage}", String(coverage))}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t border-border/30 pt-5">
                  <h3 className="mb-4 text-xs font-medium uppercase tracking-wider text-text-secondary">
                    Documents
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-text-secondary">
                        GST Number
                      </label>
                      <input
                        type="text"
                        value={gstNumber}
                        onChange={(e) => setGstNumber(e.target.value)}
                        placeholder="22AAAAA0000A1Z5"
                        className="w-full rounded-lg border border-border/50 bg-base px-4 py-2.5 text-sm text-text-primary outline-none transition-all duration-200 placeholder:text-text-muted focus:border-primary/50 focus:shadow-sm focus:shadow-primary/10"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-text-secondary">
                        Business Registration Number
                      </label>
                      <input
                        type="text"
                        value={businessReg}
                        onChange={(e) => setBusinessReg(e.target.value)}
                        placeholder="e.g. UDYAM-XX-00-0000000"
                        className="w-full rounded-lg border border-border/50 bg-base px-4 py-2.5 text-sm text-text-primary outline-none transition-all duration-200 placeholder:text-text-muted focus:border-primary/50 focus:shadow-sm focus:shadow-primary/10"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-text-secondary">
                        Upload Documents
                      </label>
                      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border/50 bg-base py-4 text-sm text-text-muted transition-colors hover:border-primary/40 hover:text-text-secondary">
                        <HugeiconsIcon icon={UploadIcon} size={18} />
                        <span>GST certificate, shop license, etc.</span>
                        <input type="file" multiple className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <p className="text-xs text-text-muted">
                  Upload your documents to verify your identity. Accepted formats:
                  JPG, PNG, PDF.
                </p>

                {([
                  { label: "Owner Photo", key: "photo", icon: CameraIcon, file: ownerPhoto, setter: setOwnerPhoto },
                  { label: "Aadhar Card", key: "aadhar", icon: FileValidationIcon, file: aadhar, setter: setAadhar },
                  { label: "PAN Card", key: "pan", icon: FileValidationIcon, file: pan, setter: setPan },
                  { label: "Digital Signature", key: "signature", icon: SignatureIcon, file: signature, setter: setSignature },
                ] as const).map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.key}>
                      <label className="mb-1.5 block text-xs font-medium text-text-secondary">
                        {item.label}
                      </label>
                      <label className="group flex cursor-pointer items-center gap-4 rounded-xl border border-dashed border-border/50 bg-base p-4 transition-all duration-200 hover:border-primary/40">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-surface-raised/50 text-text-muted transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                          {item.file ? (
                            <HugeiconsIcon icon={Tick01Icon} size={22} className="text-primary" />
                          ) : (
                            <HugeiconsIcon icon={Icon} size={22} />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-text-primary">
                            {item.file ? item.file.name : `Upload ${item.label}`}
                          </p>
                          <p className="text-[11px] text-text-muted">
                            {item.file
                              ? `${(item.file.size / 1024).toFixed(1)} KB`
                              : "JPG, PNG or PDF up to 5MB"}
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={handleFile(item.setter)}
                        />
                      </label>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className={`rounded-lg border border-border/50 px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                step === 0
                  ? "invisible"
                  : "text-text-secondary hover:bg-surface-raised/50 hover:text-text-primary"
              }`}
            >
              Back
            </button>

            {step < steps.length - 1 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canProceed()}
                className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-primary to-primary-hover px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <span className="absolute inset-0 translate-x-full bg-white/10 transition-transform duration-300 group-hover:translate-x-0" />
                <span className="relative">Continue</span>
              </button>
            ) : (
              <button
                disabled={!canProceed() || submitting}
                onClick={async () => {
                  setSubmitting(true);
                  try {
                    await addStore({
                      name: storeName,
                      tag: "Fulfilled",
                      images: [],
                      ownerUid: firebaseUser?.uid || "",
                      description,
                      address,
                      city,
                      coverage,
                    });
                    router.push("/dashboard/stores");
                  } catch {
                    setSubmitting(false);
                  }
                }}
                className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-primary to-primary-hover px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <span className="absolute inset-0 translate-x-full bg-white/10 transition-transform duration-300 group-hover:translate-x-0" />
                <span className="relative flex items-center gap-1.5">
                  <HugeiconsIcon icon={Tick01Icon} size={16} />
                  {submitting ? "Submitting..." : "Submit Store"}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
