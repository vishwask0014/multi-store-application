import { connectDB } from "@/lib/mongodb";
import { Service } from "@/lib/models/Service";

export interface ServiceQuery {
  search?: string;
  category?: string;
  storeId?: string;
  featured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sort?: string;
  includeDeleted?: boolean;
}

export interface ServiceResult {
  services: Record<string, unknown>[];
  total: number;
  page: number;
  totalPages: number;
}

export async function getServices(query: ServiceQuery = {}): Promise<ServiceResult> {
  await connectDB();
  const { search, category, storeId, featured, minPrice, maxPrice, page = 1, limit = 20, sort = "-createdAt", includeDeleted } = query;

  const filter: Record<string, unknown> = {};

  if (!includeDeleted) filter.deletedAt = null;

  if (search) {
    filter.$text = { $search: search };
  }

  if (category) filter.categories = category;
  if (storeId) filter.storeId = storeId;
  if (featured) filter.featured = true;
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) (filter.price as Record<string, unknown>).$gte = minPrice;
    if (maxPrice !== undefined) (filter.price as Record<string, unknown>).$lte = maxPrice;
  }

  const sortMap: Record<string, Record<string, 1 | -1>> = {
    "-createdAt": { createdAt: -1 },
    "createdAt": { createdAt: 1 },
    "-price": { price: -1 },
    "price": { price: 1 },
    "-rating": { rating: -1 },
    "rating": { rating: 1 },
  };

  const [services, total] = await Promise.all([
    Service.find(filter).populate("products").sort(sortMap[sort] || { createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Service.countDocuments(filter),
  ]);

  return { services, total, page, totalPages: Math.ceil(total / limit) };
}

export async function getServiceById(id: string) {
  await connectDB();
  return Service.findById(id).populate("products").lean();
}

export async function getRelatedServices(serviceId: string, category: string, limit = 6) {
  await connectDB();
  return Service.find({ categories: category, _id: { $ne: serviceId }, deletedAt: null }).limit(limit).lean();
}

export async function createService(data: Record<string, unknown>) {
  await connectDB();
  return Service.create({ ...data, deletedAt: null });
}

export async function updateService(id: string, data: Record<string, unknown>) {
  await connectDB();
  return Service.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true }).lean();
}

export async function softDeleteService(id: string) {
  await connectDB();
  return Service.findByIdAndUpdate(id, { $set: { deletedAt: new Date() } }, { new: true }).lean();
}

export async function restoreService(id: string) {
  await connectDB();
  return Service.findByIdAndUpdate(id, { $set: { deletedAt: null } }, { new: true }).lean();
}

export async function hardDeleteService(id: string) {
  await connectDB();
  return Service.findByIdAndDelete(id).lean();
}
