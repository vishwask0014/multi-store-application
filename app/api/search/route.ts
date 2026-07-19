import { NextResponse } from "next/server";
import { getStores } from "@/lib/services/store";
import { getProducts } from "@/lib/services/product";
import { getServices } from "@/lib/services/service";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.trim() || "";
  const page = Number(url.searchParams.get("page")) || 1;
  const limit = Number(url.searchParams.get("limit")) || 20;

  if (!q || q.length < 2) {
    return NextResponse.json({ stores: [], products: [], services: [], total: 0, page, totalPages: 0 });
  }

  const [storeResult, productResult, serviceResult] = await Promise.all([
    getStores({ search: q, page: 1, limit: 5 }),
    getProducts({ search: q, page: 1, limit: 10 }),
    getServices({ search: q, page: 1, limit: 10 }),
  ]);

  return NextResponse.json({
    stores: storeResult.stores,
    products: productResult.products,
    services: serviceResult.services,
    total: storeResult.total + productResult.total + serviceResult.total,
    page,
    totalPages: Math.max(storeResult.totalPages, productResult.totalPages, serviceResult.totalPages),
  });
}
