"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Store01Icon,
  ShoppingBagIcon,
  ServiceIcon,
  Tick01Icon,
  AddIcon,
  DeleteIcon,
  Edit01Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import Modal from "./Modal";
import { useInventoryStore } from "@/stores/useInventoryStore";
import type { StoreData, StoreAvailability } from "@/types";

const tabs = [
  { key: "store", label: "Store", icon: Store01Icon },
  { key: "products", label: "Products", icon: ShoppingBagIcon },
  { key: "services", label: "Services", icon: ServiceIcon },
];

const placeholderImgs = [
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1531346878377-1270d5fe5b8b?w=400&h=300&fit=crop",
];

const allCategories = [
  "electronics", "fashion", "home", "sports", "books",
  "music", "health", "toys", "beauty", "automotive",
  "grocery", "stationery", "furniture", "jewelry",
];

const weekDays = [
  "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday",
] as const;

interface Props {
  open: boolean;
  onClose: () => void;
}

function ConfirmDialog({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl border border-border/50 bg-surface p-6 shadow-2xl">
        <p className="text-sm text-text-primary">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onCancel} className="rounded-lg border border-border/50 px-4 py-2 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-raised">
            Cancel
          </button>
          <button onClick={onConfirm} className="rounded-lg bg-danger px-4 py-2 text-xs font-medium text-white transition-opacity hover:opacity-90">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function StoreManagerModal({ open, onClose }: Props) {
  const { stores, products, services, addStore, updateStore, removeStore, addProduct, addService } = useInventoryStore();
  const [activeTab, setActiveTab] = useState("store");

  const [storeName, setStoreName] = useState("");
  const [storeImages, setStoreImages] = useState<string[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [editingStore, setEditingStore] = useState<StoreData | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [editName, setEditName] = useState("");
  const [editTag, setEditTag] = useState<"Fulfilled" | "Filled">("Fulfilled");
  const [editDescription, setEditDescription] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editCoverage, setEditCoverage] = useState(10);
  const [editImages, setEditImages] = useState<string[]>([]);
  const [editGallery, setEditGallery] = useState<string[]>([]);
  const [editCategories, setEditCategories] = useState<string[]>([]);
  const [editAvailability, setEditAvailability] = useState<StoreAvailability[]>([]);
  const [galleryInput, setGalleryInput] = useState("");
  const [editStatus, setEditStatus] = useState<"open" | "closed" | "temporarily_closed">("open");
  const [editLogo, setEditLogo] = useState("");
  const [editBanner, setEditBanner] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editWebsite, setEditWebsite] = useState("");
  const [editInstagram, setEditInstagram] = useState("");
  const [editFacebook, setEditFacebook] = useState("");

  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");

  const [serviceName, setServiceName] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [serviceDesc, setServiceDesc] = useState("");
  const [serviceProducts, setServiceProducts] = useState<string[]>([]);

  const currentStore = stores.find((s) => s.id === selectedStoreId);
  const storeProducts = products.filter((p) => p.storeId === selectedStoreId);

  const handleAddStore = async () => {
    if (!storeName.trim()) return;
    const created = await addStore({
      name: storeName.trim(),
      images: storeImages.length > 0 ? storeImages : [placeholderImgs[0]],
    });
    setSelectedStoreId(created.id || created._id);
    setStoreName("");
    setStoreImages([]);
    setActiveTab("products");
  };

  const openEdit = (store: StoreData) => {
    setEditingStore(store);
    setEditName(store.name);
    setEditTag(store.tag);
    setEditDescription(store.description || "");
    setEditAddress(store.address || "");
    setEditCity(store.city || "");
    setEditCoverage(store.coverage || 10);
    setEditImages(store.images || []);
    setEditGallery(store.gallery || []);
    setEditCategories(store.categories || []);
    setEditAvailability(store.availability || weekDays.map((d) => ({ day: d, open: "09:00", close: "18:00", closed: d === "sunday" })));
    setEditStatus(store.status || "open");
    setEditLogo(store.logo || "");
    setEditBanner(store.banner || "");
    setEditPhone(store.contact?.phone || "");
    setEditEmail(store.contact?.email || "");
    setEditWebsite(store.socialLinks?.website || "");
    setEditInstagram(store.socialLinks?.instagram || "");
    setEditFacebook(store.socialLinks?.facebook || "");
    setGalleryInput("");
  };

  const closeEdit = () => {
    setEditingStore(null);
  };

  const handleSaveEdit = async () => {
    if (!editingStore) return;
    await updateStore(editingStore.id, {
      name: editName.trim(),
      tag: editTag,
      description: editDescription.trim(),
      address: editAddress.trim(),
      city: editCity.trim(),
      coverage: editCoverage,
      images: editImages,
      gallery: editGallery,
      categories: editCategories,
      availability: editAvailability,
      status: editStatus,
      logo: editLogo || undefined,
      banner: editBanner || undefined,
      contact: { phone: editPhone || undefined, email: editEmail || undefined },
      socialLinks: { website: editWebsite || undefined, instagram: editInstagram || undefined, facebook: editFacebook || undefined },
    });
    closeEdit();
  };

  const addGalleryImage = () => {
    const url = galleryInput.trim();
    if (url && !editGallery.includes(url)) {
      setEditGallery((prev) => [...prev, url]);
    }
    setGalleryInput("");
  };

  const removeGalleryImage = (url: string) => {
    setEditGallery((prev) => prev.filter((u) => u !== url));
  };

  const toggleCategory = (cat: string) => {
    setEditCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const updateAvailability = (day: typeof weekDays[number], field: keyof StoreAvailability, value: string | boolean) => {
    setEditAvailability((prev) =>
      prev.map((a) => (a.day === day ? { ...a, [field]: value } : a))
    );
  };

  const handleDeleteStore = async (id: string) => {
    await removeStore(id);
    setDeleteConfirm(null);
    if (selectedStoreId === id) setSelectedStoreId(null);
  };

  const handleAddProduct = async () => {
    if (!productName.trim() || !productPrice || !selectedStoreId) return;
    await addProduct({
      title: productName.trim(),
      price: Number(productPrice),
      rating: 4.0,
      type: "item",
      storeId: selectedStoreId,
      image: placeholderImgs[Math.floor(Math.random() * placeholderImgs.length)],
    });
    setProductName("");
    setProductPrice("");
  };

  const handleAddService = async () => {
    if (!serviceName.trim() || !servicePrice || !selectedStoreId) return;
    await addService({
      title: serviceName.trim(),
      price: Number(servicePrice),
      rating: 4.0,
      description: serviceDesc,
      image: placeholderImgs[Math.floor(Math.random() * placeholderImgs.length)],
      storeId: selectedStoreId,
      productCount: serviceProducts.length,
      productIds: serviceProducts,
    });
    setServiceName("");
    setServicePrice("");
    setServiceDesc("");
    setServiceProducts([]);
  };

  const handleStoreSelect = (id: string) => {
    setSelectedStoreId(id);
    setActiveTab("products");
  };

  return (
    <Modal open={open} onClose={onClose} title="Store Manager" maxWidth="max-w-4xl">
      {deleteConfirm && (
        <ConfirmDialog
          message="Are you sure you want to delete this store? All associated products and services will also be removed."
          onConfirm={() => handleDeleteStore(deleteConfirm)}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}

      <div className="-mx-6 mb-6 border-b border-border/30 px-6">
        <div className="flex gap-1">
          {tabs.map((tab) => {
            const active = activeTab === tab.key;
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-xs font-medium transition-all ${
                  active
                    ? "border-primary text-primary"
                    : "border-transparent text-text-muted hover:text-text-secondary"
                }`}
              >
                <HugeiconsIcon icon={Icon} size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Store tab */}
      {activeTab === "store" && (
        <div className="space-y-6">
          {stores.length > 0 && (
            <div>
              <p className="mb-3 text-xs font-medium text-text-secondary">Select a store to manage</p>
              <div className="grid grid-cols-2 gap-2">
                {stores.map((s) => (
                  <div key={s.id} className="flex gap-1">
                    <button
                      onClick={() => handleStoreSelect(s.id)}
                      className={`flex flex-1 items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                        selectedStoreId === s.id
                          ? "border-primary/40 bg-primary/10"
                          : "border-border/50 hover:border-border-strong"
                      }`}
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-surface-raised text-primary">
                        <HugeiconsIcon icon={Store01Icon} size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-text-primary">{s.name}</p>
                        <p className="text-[11px] text-text-muted">{s.offeringCount} offerings</p>
                      </div>
                    </button>
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => openEdit(s)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/30 text-text-muted transition-colors hover:border-primary/40 hover:text-primary"
                        title="Edit store"
                      >
                        <HugeiconsIcon icon={Edit01Icon} size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(s.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/30 text-text-muted transition-colors hover:border-danger/40 hover:text-danger"
                        title="Delete store"
                      >
                        <HugeiconsIcon icon={DeleteIcon} size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Edit mode */}
          {editingStore && (
            <div className="rounded-xl border border-border/50 bg-base p-5 space-y-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-text-secondary">Editing: {editingStore.name}</p>
                <button onClick={closeEdit} className="text-xs text-text-muted hover:text-text-secondary">
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="mb-1 block text-xs font-medium text-text-secondary">Store Name</label>
                  <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)}
                    className="w-full rounded-lg border border-border/50 bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-primary/50" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="mb-1 block text-xs font-medium text-text-secondary">Tag</label>
                  <select value={editTag} onChange={(e) => setEditTag(e.target.value as "Fulfilled" | "Filled")}
                    className="w-full rounded-lg border border-border/50 bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-primary/50">
                    <option value="Fulfilled">Fulfilled</option>
                    <option value="Filled">Filled</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block text-xs font-medium text-text-secondary">Description</label>
                  <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} rows={2}
                    className="w-full resize-none rounded-lg border border-border/50 bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-primary/50" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="mb-1 block text-xs font-medium text-text-secondary">Address</label>
                  <input type="text" value={editAddress} onChange={(e) => setEditAddress(e.target.value)}
                    className="w-full rounded-lg border border-border/50 bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-primary/50" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="mb-1 block text-xs font-medium text-text-secondary">City</label>
                  <input type="text" value={editCity} onChange={(e) => setEditCity(e.target.value)}
                    className="w-full rounded-lg border border-border/50 bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-primary/50" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="mb-1 block text-xs font-medium text-text-secondary">Coverage (km)</label>
                  <input type="number" value={editCoverage} onChange={(e) => setEditCoverage(Number(e.target.value))}
                    className="w-full rounded-lg border border-border/50 bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-primary/50" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="mb-1 block text-xs font-medium text-text-secondary">Status</label>
                  <select value={editStatus} onChange={(e) => setEditStatus(e.target.value as "open" | "closed" | "temporarily_closed")}
                    className="w-full rounded-lg border border-border/50 bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-primary/50">
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                    <option value="temporarily_closed">Temporarily Closed</option>
                  </select>
                </div>
              </div>

              {/* Logo & Banner */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-text-secondary">Logo URL</label>
                  <input type="text" value={editLogo} onChange={(e) => setEditLogo(e.target.value)}
                    placeholder="https://..."
                    className="w-full rounded-lg border border-border/50 bg-surface px-3 py-2 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-primary/50" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-text-secondary">Banner URL</label>
                  <input type="text" value={editBanner} onChange={(e) => setEditBanner(e.target.value)}
                    placeholder="https://..."
                    className="w-full rounded-lg border border-border/50 bg-surface px-3 py-2 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-primary/50" />
                </div>
              </div>

              {/* Contact */}
              <div>
                <label className="mb-2 block text-xs font-medium text-text-secondary">Contact Details</label>
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" value={editPhone} onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="Phone number"
                    className="rounded-lg border border-border/50 bg-surface px-3 py-2 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-primary/50" />
                  <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)}
                    placeholder="Email address"
                    className="rounded-lg border border-border/50 bg-surface px-3 py-2 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-primary/50" />
                </div>
              </div>

              {/* Social Links */}
              <div>
                <label className="mb-2 block text-xs font-medium text-text-secondary">Social Links</label>
                <div className="space-y-2">
                  <input type="text" value={editWebsite} onChange={(e) => setEditWebsite(e.target.value)}
                    placeholder="Website URL"
                    className="w-full rounded-lg border border-border/50 bg-surface px-3 py-2 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-primary/50" />
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" value={editInstagram} onChange={(e) => setEditInstagram(e.target.value)}
                      placeholder="Instagram URL"
                      className="rounded-lg border border-border/50 bg-surface px-3 py-2 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-primary/50" />
                    <input type="text" value={editFacebook} onChange={(e) => setEditFacebook(e.target.value)}
                      placeholder="Facebook URL"
                      className="rounded-lg border border-border/50 bg-surface px-3 py-2 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-primary/50" />
                  </div>
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="mb-1 block text-xs font-medium text-text-secondary">Main Images (URLs, comma-separated)</label>
                <input type="text" value={editImages.join(", ")} onChange={(e) => setEditImages(e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
                  className="w-full rounded-lg border border-border/50 bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-primary/50" />
              </div>

              {/* Gallery */}
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label className="text-xs font-medium text-text-secondary">Gallery</label>
                </div>
                <div className="mb-2 flex flex-wrap gap-2">
                  {editGallery.map((url) => (
                    <div key={url} className="group relative h-16 w-16 overflow-hidden rounded-lg ring-1 ring-border/30">
                      <img src={url} alt="" className="h-full w-full object-cover" />
                      <button onClick={() => removeGalleryImage(url)}
                        className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                        <HugeiconsIcon icon={Cancel01Icon} size={14} className="text-white" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input type="text" value={galleryInput} onChange={(e) => setGalleryInput(e.target.value)}
                    placeholder="Image URL..."
                    className="flex-1 rounded-lg border border-border/50 bg-surface px-3 py-2 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-primary/50" />
                  <button onClick={addGalleryImage} disabled={!galleryInput.trim()}
                    className="shrink-0 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-30">
                    Add
                  </button>
                </div>
              </div>

              {/* Categories */}
              <div>
                <label className="mb-2 block text-xs font-medium text-text-secondary">Categories</label>
                <div className="flex flex-wrap gap-1.5">
                  {allCategories.map((cat) => {
                    const selected = editCategories.includes(cat);
                    return (
                      <button key={cat} onClick={() => toggleCategory(cat)}
                        className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all ${
                          selected
                            ? "border-primary/40 bg-primary/10 text-primary"
                            : "border-border/30 text-text-muted hover:border-border-strong hover:text-text-secondary"
                        }`}>
                        {selected && <HugeiconsIcon icon={Tick01Icon} size={10} />}
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Availability */}
              <div>
                <label className="mb-2 block text-xs font-medium text-text-secondary">Availability Hours</label>
                <div className="space-y-1.5">
                  {editAvailability.map((slot) => (
                    <div key={slot.day} className="flex items-center gap-2 rounded-lg border border-border/30 bg-base p-2">
                      <label className="flex items-center gap-2 min-w-[6rem]">
                        <input type="checkbox" checked={!slot.closed} onChange={(e) => updateAvailability(slot.day, "closed", !e.target.checked)}
                          className="accent-primary h-3.5 w-3.5" />
                        <span className={`text-xs font-medium capitalize ${slot.closed ? "text-text-muted" : "text-text-primary"}`}>
                          {slot.day.slice(0, 3)}
                        </span>
                      </label>
                      {!slot.closed && (
                        <>
                          <input type="time" value={slot.open} onChange={(e) => updateAvailability(slot.day, "open", e.target.value)}
                            className="w-24 rounded border border-border/30 bg-surface px-2 py-1 text-xs text-text-primary outline-none" />
                          <span className="text-xs text-text-muted">to</span>
                          <input type="time" value={slot.close} onChange={(e) => updateAvailability(slot.day, "close", e.target.value)}
                            className="w-24 rounded border border-border/30 bg-surface px-2 py-1 text-xs text-text-primary outline-none" />
                        </>
                      )}
                      {slot.closed && <span className="text-xs text-text-muted">Closed</span>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button onClick={closeEdit} className="rounded-lg border border-border/50 px-4 py-2 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-raised">
                  Cancel
                </button>
                <button onClick={handleSaveEdit} className="rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white transition-opacity hover:opacity-90">
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Create new store */}
          {!editingStore && (
            <div>
              <p className="mb-3 text-xs font-medium text-text-secondary">
                {stores.length > 0 ? "Or create a new store" : "Create your first store"}
              </p>
              <div className="space-y-3 rounded-xl border border-border/50 bg-base p-4">
                <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)}
                  placeholder="Store name..."
                  className="w-full rounded-lg border border-border/50 bg-surface px-3 py-2 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-primary/50" />
                <div className="flex items-center gap-2">
                  <input type="text" value={storeImages.join(", ")}
                    onChange={(e) => setStoreImages(e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
                    placeholder="Image URLs (comma-separated)"
                    className="flex-1 rounded-lg border border-border/50 bg-surface px-3 py-2 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-primary/50" />
                  <button onClick={handleAddStore} disabled={!storeName.trim()}
                    className="shrink-0 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed">
                    Create
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Products tab */}
      {activeTab === "products" && (
        <div className="space-y-5">
          {!selectedStoreId && stores.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-medium text-text-secondary">Select a store first</p>
              <div className="flex flex-wrap gap-2">
                {stores.map((s) => (
                  <button key={s.id} onClick={() => setSelectedStoreId(s.id)}
                    className="rounded-lg border border-border/50 bg-base px-3 py-1.5 text-xs font-medium text-text-primary transition-colors hover:border-primary/40 hover:text-primary">
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedStoreId && (
            <>
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-text-secondary">
                  Products in <span className="text-text-primary">{currentStore?.name || "..."}</span>
                </p>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                  {storeProducts.length}
                </span>
              </div>

              {storeProducts.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {storeProducts.map((p) => (
                    <div key={p.id} className="flex items-center gap-3 rounded-lg border border-border/30 bg-base p-2.5">
                      <div className="h-8 w-8 shrink-0 overflow-hidden rounded-md bg-surface-raised">
                        <img src={p.image} alt="" className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-text-primary">{p.title}</p>
                        <p className="text-[11px] text-accent">${p.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-3 rounded-xl border border-border/50 bg-base p-4">
                <p className="text-xs font-medium text-text-secondary">Add Product</p>
                <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)}
                  placeholder="Product name..."
                  className="w-full rounded-lg border border-border/50 bg-surface px-3 py-2 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-primary/50" />
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-text-muted">$</span>
                    <input type="number" step="0.01" value={productPrice} onChange={(e) => setProductPrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full rounded-lg border border-border/50 bg-surface py-2 pl-7 pr-3 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-primary/50" />
                  </div>
                  <button onClick={handleAddProduct} disabled={!productName.trim() || !productPrice}
                    className="shrink-0 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed">
                    Add
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Services tab */}
      {activeTab === "services" && (
        <div className="space-y-5">
          {!selectedStoreId && stores.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-medium text-text-secondary">Select a store first</p>
              <div className="flex flex-wrap gap-2">
                {stores.map((s) => (
                  <button key={s.id} onClick={() => setSelectedStoreId(s.id)}
                    className="rounded-lg border border-border/50 bg-base px-3 py-1.5 text-xs font-medium text-text-primary transition-colors hover:border-primary/40 hover:text-primary">
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedStoreId && (
            <>
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-text-secondary">
                  Services in <span className="text-text-primary">{currentStore?.name || "..."}</span>
                </p>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                  {services.filter((s) => s.storeId === selectedStoreId).length}
                </span>
              </div>

              {services.filter((s) => s.storeId === selectedStoreId).length > 0 && (
                <div className="space-y-2">
                  {services.filter((s) => s.storeId === selectedStoreId).map((svc) => (
                    <div key={svc.id} className="flex items-center gap-3 rounded-lg border border-border/30 bg-base p-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <HugeiconsIcon icon={ServiceIcon} size={16} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-text-primary">{svc.title}</p>
                        <p className="text-xs text-text-muted">{svc.productCount} product(s) · ${svc.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-3 rounded-xl border border-border/50 bg-base p-4">
                <p className="text-xs font-medium text-text-secondary">Add Service</p>
                <input type="text" value={serviceName} onChange={(e) => setServiceName(e.target.value)}
                  placeholder="Service name..."
                  className="w-full rounded-lg border border-border/50 bg-surface px-3 py-2 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-primary/50" />
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-text-muted">$</span>
                    <input type="number" step="0.01" value={servicePrice} onChange={(e) => setServicePrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full rounded-lg border border-border/50 bg-surface py-2 pl-7 pr-3 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-primary/50" />
                  </div>
                </div>
                <textarea value={serviceDesc} onChange={(e) => setServiceDesc(e.target.value)}
                  placeholder="Description (optional)" rows={2}
                  className="w-full resize-none rounded-lg border border-border/50 bg-surface px-3 py-2 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-primary/50" />

                {storeProducts.length > 0 && (
                  <div>
                    <p className="mb-1.5 text-xs text-text-muted">Apply to products:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {storeProducts.map((p) => {
                        const selected = serviceProducts.includes(p.id);
                        return (
                          <button key={p.id}
                            onClick={() => setServiceProducts((prev) => prev.includes(p.id) ? prev.filter((id) => id !== p.id) : [...prev, p.id])}
                            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all ${
                              selected
                                ? "border-primary/40 bg-primary/10 text-primary"
                                : "border-border/30 text-text-muted hover:border-border-strong hover:text-text-secondary"
                            }`}>
                            {selected && <HugeiconsIcon icon={Tick01Icon} size={10} />}
                            {p.title}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <button onClick={handleAddService} disabled={!serviceName.trim() || !servicePrice}
                  className="w-full rounded-lg bg-gradient-to-r from-primary to-primary-hover py-2.5 text-xs font-medium text-white shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 disabled:opacity-30 disabled:cursor-not-allowed">
                  Add Service
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </Modal>
  );
}
