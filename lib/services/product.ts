import { connectDB } from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";

export interface ProductQuery {
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

export interface ProductResult {
  products: Record<string, unknown>[];
  total: number;
  page: number;
  totalPages: number;
}

export async function getProducts(query: ProductQuery = {}): Promise<ProductResult> {
  await connectDB();
  const { search, category, storeId, featured, minPrice, maxPrice, page = 1, limit = 20, sort = "-createdAt", includeDeleted } = query;

  const filter: Record<string, unknown> = {};

  if (!includeDeleted) filter.deletedAt = null;

  if (search) {
    filter.$text = { $search: search };
  }

  if (category) filter.category = category;
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
    "-sold": { sold: -1 },
  };

  const [products, total] = await Promise.all([
    Product.find(filter).sort(sortMap[sort] || { createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Product.countDocuments(filter),
  ]);

  return { products, total, page, totalPages: Math.ceil(total / limit) };
}

export async function getProductById(id: string) {
  await connectDB();
  return Product.findById(id).lean();
}

export async function getRelatedProducts(productId: string, category: string, limit = 6) {
  await connectDB();
  return Product.find({ category, _id: { $ne: productId }, deletedAt: null }).limit(limit).lean();
}

export async function createProduct(data: Record<string, unknown>) {
  await connectDB();
  return Product.create({ ...data, deletedAt: null });
}

export async function updateProduct(id: string, data: Record<string, unknown>) {
  await connectDB();
  return Product.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true }).lean();
}

export async function softDeleteProduct(id: string) {
  await connectDB();
  return Product.findByIdAndUpdate(id, { $set: { deletedAt: new Date() } }, { new: true }).lean();
}

export async function restoreProduct(id: string) {
  await connectDB();
  return Product.findByIdAndUpdate(id, { $set: { deletedAt: null } }, { new: true }).lean();
}

export async function hardDeleteProduct(id: string) {
  await connectDB();
  return Product.findByIdAndDelete(id).lean();
}
