"use client";

import { useState, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Store01Icon,
  ShoppingBagIcon,
  BuildingIcon,
  Tick01Icon,
  UploadIcon,
  CameraIcon,
  Location01Icon,
  FileValidationIcon,
  SignatureIcon,
} from "@hugeicons/core-free-icons";
import Modal from "./Modal";
import { useAuth } from "@/contexts/AuthContext";

const steps = [
  { label: "Business Profile", icon: BuildingIcon },
  { label: "Your Store", icon: Store01Icon },
  { label: "Documents", icon: FileValidationIcon },
  { label: "Review", icon: Tick01Icon },
];

const placeholderImgs = [
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop",
];

interface OnboardingData {
  businessName: string;
  businessAddress: string;
  businessCategory: string;
  gstNumber: string;
  businessRegNumber: string;
  aadharNumber: string;
  panNumber: string;
  storeName: string;
  storeDescription: string;
  storeImages: string[];
  storeAddress: string;
  storeCity: string;
  storeCoverage: number;
  ownerPhoto: string;
}

const initialData: OnboardingData = {
  businessName: "",
  businessAddress: "",
  businessCategory: "",
  gstNumber: "",
  businessRegNumber: "",
  aadharNumber: "",
  panNumber: "",
  storeName: "",
  storeDescription: "",
  storeImages: [],
  storeAddress: "",
  storeCity: "",
  storeCoverage: 10,
  ownerPhoto: "",
};

interface Props {
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export default function OwnerOnboarding({ open, onClose, onComplete }: Props) {
  const { firebaseUser } = useAuth();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(initialData);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!open) {
      setStep(0);
      setData(initialData);
      setError("");
      setSaved(false);
    }
  }, [open]);

  const update = (fields: Partial<OnboardingData>) =>
    setData((prev) => ({ ...prev, ...fields }));

  const canProceed = () => {
    if (step === 0) return data.businessName && data.businessAddress && data.businessCategory;
    if (step === 1) return data.storeName.trim().length > 0;
    if (step === 2) return true;
    if (step === 3) return true;
    return false;
  };

  const autoSave = async () => {
    if (!firebaseUser?.uid) return;
    try {
      await fetch("/api/user-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: firebaseUser.uid,
          phone: firebaseUser.phoneNumber || "",
          ...data,
          status: "draft",
        }),
      });
    } catch {}
  };

  const handleSubmit = async () => {
    if (!firebaseUser?.uid) return;
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`/api/user-details?uid=${firebaseUser.uid}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "submit",
          uid: firebaseUser.uid,
          phone: firebaseUser.phoneNumber || "",
          ...data,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Submission failed");
      }

      setSaved(true);
      setTimeout(() => {
        onComplete();
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const progress = ((step + 1) / steps.length) * 100;

  return (
    <Modal open={open} onClose={onClose} title="Become a Seller" maxWidth="max-w-2xl">
      {/* Progress */}
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
                  className={`text-[10px] font-medium text-center leading-tight ${
                    current ? "text-text-primary" : done ? "text-primary" : "text-text-muted"
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

      {saved ? (
        <div className="py-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-success/10 text-success ring-1 ring-success/20">
            <HugeiconsIcon icon={Tick01Icon} size={28} />
          </div>
          <h3 className="text-lg font-medium text-text-primary">Application Submitted!</h3>
          <p className="mt-1 text-sm text-text-muted">
            We'll review your application and notify you once it's approved.
          </p>
        </div>
      ) : (
        <>
          {/* Step 0: Business Profile */}
          {step === 0 && (
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">Business Name *</label>
                <input
                  type="text"
                  value={data.businessName}
                  onChange={(e) => update({ businessName: e.target.value })}
                  placeholder="Your business name"
                  className="w-full rounded-lg border border-border/50 bg-base px-4 py-2.5 text-sm text-text-primary outline-none transition-all placeholder:text-text-muted focus:border-primary/50"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">Business Address *</label>
                <input
                  type="text"
                  value={data.businessAddress}
                  onChange={(e) => update({ businessAddress: e.target.value })}
                  placeholder="Full business address"
                  className="w-full rounded-lg border border-border/50 bg-base px-4 py-2.5 text-sm text-text-primary outline-none transition-all placeholder:text-text-muted focus:border-primary/50"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-text-secondary">Category *</label>
                  <select
                    value={data.businessCategory}
                    onChange={(e) => update({ businessCategory: e.target.value })}
                    className="w-full rounded-lg border border-border/50 bg-base px-4 py-2.5 text-sm text-text-primary outline-none focus:border-primary/50"
                  >
                    <option value="">Select category</option>
                    <option value="electronics">Electronics</option>
                    <option value="fashion">Fashion</option>
                    <option value="home">Home & Garden</option>
                    <option value="sports">Sports</option>
                    <option value="books">Books</option>
                    <option value="music">Music</option>
                    <option value="health">Health & Beauty</option>
                    <option value="services">Services</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-text-secondary">GST Number</label>
                  <input
                    type="text"
                    value={data.gstNumber}
                    onChange={(e) => update({ gstNumber: e.target.value })}
                    placeholder="22AAAAA0000A1Z5"
                    className="w-full rounded-lg border border-border/50 bg-base px-4 py-2.5 text-sm text-text-primary outline-none transition-all placeholder:text-text-muted focus:border-primary/50"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-text-secondary">Business Reg. Number</label>
                  <input
                    type="text"
                    value={data.businessRegNumber}
                    onChange={(e) => update({ businessRegNumber: e.target.value })}
                    placeholder="UDYAM-XX-00-0000000"
                    className="w-full rounded-lg border border-border/50 bg-base px-4 py-2.5 text-sm text-text-primary outline-none transition-all placeholder:text-text-muted focus:border-primary/50"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-text-secondary">Aadhar Number</label>
                  <input
                    type="text"
                    value={data.aadharNumber}
                    onChange={(e) => update({ aadharNumber: e.target.value })}
                    placeholder="XXXX XXXX XXXX"
                    className="w-full rounded-lg border border-border/50 bg-base px-4 py-2.5 text-sm text-text-primary outline-none transition-all placeholder:text-text-muted focus:border-primary/50"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">PAN Number</label>
                <input
                  type="text"
                  value={data.panNumber}
                  onChange={(e) => update({ panNumber: e.target.value })}
                  placeholder="ABCDE1234F"
                  className="w-full rounded-lg border border-border/50 bg-base px-4 py-2.5 text-sm text-text-primary outline-none transition-all placeholder:text-text-muted focus:border-primary/50"
                />
              </div>
            </div>
          )}

          {/* Step 1: Your Store */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">Store Name *</label>
                <input
                  type="text"
                  value={data.storeName}
                  onChange={(e) => update({ storeName: e.target.value })}
                  placeholder="e.g. Urban Essentials"
                  className="w-full rounded-lg border border-border/50 bg-base px-4 py-2.5 text-sm text-text-primary outline-none transition-all placeholder:text-text-muted focus:border-primary/50"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">Description</label>
                <textarea
                  value={data.storeDescription}
                  onChange={(e) => update({ storeDescription: e.target.value })}
                  placeholder="Tell customers about your store..."
                  rows={3}
                  className="w-full resize-none rounded-lg border border-border/50 bg-base px-4 py-2.5 text-sm text-text-primary outline-none transition-all placeholder:text-text-muted focus:border-primary/50"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">Store Images (URLs, comma-separated)</label>
                <input
                  type="text"
                  value={data.storeImages.join(", ")}
                  onChange={(e) => update({ storeImages: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
                  placeholder="https://..."
                  className="w-full rounded-lg border border-border/50 bg-base px-4 py-2.5 text-sm text-text-primary outline-none transition-all placeholder:text-text-muted focus:border-primary/50"
                />
                {data.storeImages.length === 0 && (
                  <div className="mt-2 flex gap-2">
                    {placeholderImgs.map((url, i) => (
                      <button
                        key={i}
                        onClick={() => update({ storeImages: [...data.storeImages, url] })}
                        className="rounded-lg border border-dashed border-border/50 px-3 py-1.5 text-[11px] text-text-muted hover:border-primary/40 hover:text-primary transition-colors"
                      >
                        + Img {i + 1}
                      </button>
                    ))}
                  </div>
                )}
                {data.storeImages.length > 0 && (
                  <div className="mt-2 flex gap-2">
                    {data.storeImages.map((url, i) => (
                      <div key={i} className="relative h-14 w-14 overflow-hidden rounded-lg ring-1 ring-border/30">
                        <img src={url} alt="" className="h-full w-full object-cover" />
                        <button
                          onClick={() => update({ storeImages: data.storeImages.filter((_, j) => j !== i) })}
                          className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-white text-[10px]"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-text-secondary">Address</label>
                  <input
                    type="text"
                    value={data.storeAddress}
                    onChange={(e) => update({ storeAddress: e.target.value })}
                    placeholder="Store address"
                    className="w-full rounded-lg border border-border/50 bg-base px-4 py-2.5 text-sm text-text-primary outline-none transition-all placeholder:text-text-muted focus:border-primary/50"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-text-secondary">City</label>
                  <input
                    type="text"
                    value={data.storeCity}
                    onChange={(e) => update({ storeCity: e.target.value })}
                    placeholder="New York"
                    className="w-full rounded-lg border border-border/50 bg-base px-4 py-2.5 text-sm text-text-primary outline-none transition-all placeholder:text-text-muted focus:border-primary/50"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">
                  Coverage Area: {data.storeCoverage} km
                </label>
                <input
                  type="range"
                  min={1}
                  max={50}
                  value={data.storeCoverage}
                  onChange={(e) => update({ storeCoverage: Number(e.target.value) })}
                  className="w-full accent-primary"
                />
              </div>
            </div>
          )}

          {/* Step 2: Documents */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-xs text-text-muted">Upload links to your documents for verification.</p>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">Owner Photo URL</label>
                <input
                  type="text"
                  value={data.ownerPhoto}
                  onChange={(e) => update({ ownerPhoto: e.target.value })}
                  placeholder="https://..."
                  className="w-full rounded-lg border border-border/50 bg-base px-4 py-2.5 text-sm text-text-primary outline-none transition-all placeholder:text-text-muted focus:border-primary/50"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Aadhar Card", value: data.aadharNumber, key: "aadharNumber" as const, icon: FileValidationIcon },
                  { label: "PAN Card", value: data.panNumber, key: "panNumber" as const, icon: SignatureIcon },
                ].map((item) => {
                  const Icon = item.icon;
                  const filled = !!item.value;
                  return (
                    <div
                      key={item.key}
                      className={`rounded-xl border p-4 ${
                        filled ? "border-success/30 bg-success/5" : "border-border/50 bg-base"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                            filled ? "bg-success/10 text-success" : "bg-surface-raised/50 text-text-muted"
                          }`}
                        >
                          <HugeiconsIcon icon={Icon} size={18} />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-text-primary">{item.label}</p>
                          <p className="text-[11px] text-text-muted">
                            {filled ? "Provided" : "Not provided"}
                          </p>
                        </div>
                        {filled && (
                          <HugeiconsIcon icon={Tick01Icon} size={14} className="ml-auto text-success" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">GST Certificate</label>
                <div className="flex items-center gap-3 rounded-xl border border-dashed border-border/50 bg-base p-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-raised/50 text-text-muted">
                    <HugeiconsIcon icon={UploadIcon} size={18} />
                  </div>
                  <p className="text-xs text-text-muted">
                    Upload GST certificate, shop license, etc.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="rounded-xl border border-border/50 bg-base p-4 space-y-3">
                <h4 className="text-xs font-medium uppercase tracking-wider text-text-secondary">Business Profile</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-text-muted">Name:</span> <span className="text-text-primary">{data.businessName}</span></div>
                  <div><span className="text-text-muted">Category:</span> <span className="text-text-primary">{data.businessCategory}</span></div>
                  <div className="col-span-2"><span className="text-text-muted">Address:</span> <span className="text-text-primary">{data.businessAddress}</span></div>
                  <div><span className="text-text-muted">GST:</span> <span className="text-text-primary">{data.gstNumber || "—"}</span></div>
                  <div><span className="text-text-muted">Reg No:</span> <span className="text-text-primary">{data.businessRegNumber || "—"}</span></div>
                </div>
              </div>
              <div className="rounded-xl border border-border/50 bg-base p-4 space-y-3">
                <h4 className="text-xs font-medium uppercase tracking-wider text-text-secondary">Store</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-text-muted">Name:</span> <span className="text-text-primary">{data.storeName}</span></div>
                  <div><span className="text-text-muted">City:</span> <span className="text-text-primary">{data.storeCity || "—"}</span></div>
                  <div className="col-span-2"><span className="text-text-muted">Address:</span> <span className="text-text-primary">{data.storeAddress || "—"}</span></div>
                  <div><span className="text-text-muted">Coverage:</span> <span className="text-text-primary">{data.storeCoverage} km</span></div>
                  {data.storeImages.length > 0 && (
                    <div className="col-span-2">
                      <span className="text-text-muted">Images:</span>
                      <div className="mt-1 flex gap-1">
                        {data.storeImages.map((url, i) => (
                          <div key={i} className="h-8 w-8 overflow-hidden rounded ring-1 ring-border/30">
                            <img src={url} alt="" className="h-full w-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {data.aadharNumber || data.panNumber ? (
                <div className="rounded-xl border border-border/50 bg-base p-4 space-y-3">
                  <h4 className="text-xs font-medium uppercase tracking-wider text-text-secondary">Documents</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {data.aadharNumber && <div><span className="text-text-muted">Aadhar:</span> <span className="text-text-primary">Provided</span></div>}
                    {data.panNumber && <div><span className="text-text-muted">PAN:</span> <span className="text-text-primary">Provided</span></div>}
                  </div>
                </div>
              ) : null}

              {error && <p className="text-xs text-danger">{error}</p>}

              <div className="rounded-xl border border-warning/20 bg-warning/5 p-3">
                <p className="text-xs text-warning">
                  By submitting, you agree to our seller terms. We'll review your application and notify you within 2-3 business days.
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between gap-4">
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
                onClick={() => {
                  if (step === 0) autoSave();
                  setStep((s) => s + 1);
                }}
                disabled={!canProceed()}
                className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-primary to-primary-hover px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <span className="relative">Continue</span>
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-primary to-primary-hover px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <span className="relative flex items-center gap-1.5">
                  {submitting ? "Submitting..." : "Submit Application"}
                  {!submitting && <HugeiconsIcon icon={Tick01Icon} size={16} />}
                </span>
              </button>
            )}
          </div>
        </>
      )}
    </Modal>
  );
}
