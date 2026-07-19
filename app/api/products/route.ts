import { NextResponse } from "next/server";
import { getProducts, createProduct } from "@/lib/services/product";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const query = {
    search: url.searchParams.get("search") || undefined,
    category: url.searchParams.get("category") || undefined,
    storeId: url.searchParams.get("storeId") || undefined,
    featured: url.searchParams.get("featured") === "true" || undefined,
    minPrice: url.searchParams.get("minPrice") ? Number(url.searchParams.get("minPrice")) : undefined,
    maxPrice: url.searchParams.get("maxPrice") ? Number(url.searchParams.get("maxPrice")) : undefined,
    page: url.searchParams.get("page") ? Number(url.searchParams.get("page")) : 1,
    limit: url.searchParams.get("limit") ? Number(url.searchParams.get("limit")) : 20,
    sort: url.searchParams.get("sort") || "-createdAt",
  };

  const result = await getProducts(query);
  return NextResponse.json(result);
}

export async function POST(req: Request) {
  const body = await req.json();
  const product = await createProduct(body);
  return NextResponse.json(product, { status: 201 });
}
