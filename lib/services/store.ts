import { connectDB } from "@/lib/mongodb";
import { Store } from "@/lib/models/Store";
import type { IStoreAvailability } from "@/lib/models/Store";

export interface UpdateStoreData {
  name?: string;
  slug?: string;
  tag?: "Fulfilled" | "Filled";
  description?: string;
  address?: string;
  city?: string;
  coverage?: number;
  images?: string[];
  gallery?: string[];
  categories?: string[];
  availability?: IStoreAvailability[];
  logo?: string;
  banner?: string;
  status?: "open" | "closed" | "temporarily_closed";
  contact?: { phone?: string; email?: string };
  socialLinks?: { facebook?: string; instagram?: string; twitter?: string; youtube?: string; website?: string };
}

export interface StoreQuery {
  search?: string;
  ownerUid?: string;
  category?: string;
  status?: string;
  page?: number;
  limit?: number;
  includeDeleted?: boolean;
}

export interface StoreResult {
  stores: Record<string, unknown>[];
  total: number;
  page: number;
  totalPages: number;
}

export async function getStores(query: StoreQuery = {}): Promise<StoreResult> {
  await connectDB();
  const { search, ownerUid, category, status, page = 1, limit = 20, includeDeleted } = query;

  const filter: Record<string, unknown> = {};

  if (!includeDeleted) filter.deletedAt = null;

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { city: { $regex: search, $options: "i" } },
    ];
  }

  if (ownerUid) filter.ownerUid = ownerUid;
  if (category) filter.categories = category;
  if (status) filter.status = status;

  const [stores, total] = await Promise.all([
    Store.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Store.countDocuments(filter),
  ]);

  return { stores, total, page, totalPages: Math.ceil(total / limit) };
}

export async function getStoreById(id: string) {
  await connectDB();
  return Store.findById(id).lean();
}

export async function getStoreBySlug(slug: string) {
  await connectDB();
  return Store.findOne({ slug, deletedAt: null }).lean();
}

export async function createStore(data: Record<string, unknown>) {
  await connectDB();
  return Store.create({ ...data, deletedAt: null });
}

export async function updateStore(id: string, data: UpdateStoreData) {
  await connectDB();
  return Store.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true }).lean();
}

export async function softDeleteStore(id: string) {
  await connectDB();
  return Store.findByIdAndUpdate(id, { $set: { deletedAt: new Date() } }, { new: true }).lean();
}

export async function restoreStore(id: string) {
  await connectDB();
  return Store.findByIdAndUpdate(id, { $set: { deletedAt: null } }, { new: true }).lean();
}

export async function hardDeleteStore(id: string) {
  await connectDB();
  return Store.findByIdAndDelete(id).lean();
}
